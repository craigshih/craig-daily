/* 私人行事曆
 * 行程用 AES-GCM 加密後存在 repo 的 vault/calendar.json：網站是公開的，但沒有你的 GitHub 金鑰就解不開。
 * - 資料金鑰（隨機產生）再用「由 GitHub 金鑰推導出的金鑰」包起來存在檔案裡；換新金鑰時，只要任一台裝置
 *   還記得資料金鑰（localStorage 的 cd-cal-dk），打開網站就會自動幫新金鑰補上一份。
 * - 讀寫都直接走 GitHub API，不經過 GitHub Pages 部署，存檔後其他裝置重新整理就看得到。
 * - 補助・獎學金（data/funding.js）有填 deadline 的會自動出現在行事曆上，任何人都看得到（本來就是公開資料）。
 */
(function () {
  const K = window.CDKit;
  const CD = window.CD || {};
  if (!K || !document.getElementById("cal")) return;
  const { $, esc, store, ghToken } = K;

  const API = "https://api.github.com/repos/craigshih/craig-daily/contents/vault/calendar.json";
  const CATS = { 課堂: "#7cc7ff", 研究: "#b9a6ff", 工作: "#ffd36e", 生活: "#7ee0b5", 重要: "#ff7a9a" };
  const DEADLINE = "#ff9f5a";
  const DOW = ["一", "二", "三", "四", "五", "六", "日"];
  const HOUR = 52; // 週檢視每小時的高度（px）

  /* ---------- 日期工具（一律用 UTC 算，避免時區影響） ---------- */
  const P = (s) => new Date(s + "T00:00:00Z");
  const S = (d) => d.toISOString().slice(0, 10);
  const add = (s, n) => { const d = P(s); d.setUTCDate(d.getUTCDate() + n); return S(d); };
  const dow = (s) => (P(s).getUTCDay() + 6) % 7; // 0 = 星期一
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const md = (s) => `${+s.slice(5, 7)}/${+s.slice(8, 10)}`;
  const dayTitle = (s) => `${+s.slice(5, 7)} 月 ${+s.slice(8, 10)} 日・星期${DOW[dow(s)]}`;
  const mins = (t) => (t ? +t.slice(0, 2) * 60 + +t.slice(3, 5) : 0);
  const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const TIMES = Array.from({ length: 288 }, (_, i) => hhmm(i * 5)); // 只用尾數 :00 / :05 的時間

  /* ---------- 加密 ---------- */
  const enc = new TextEncoder(), dec = new TextDecoder();
  const subtle = crypto.subtle;
  const rand = (n) => crypto.getRandomValues(new Uint8Array(n));
  const b64 = (buf) => {
    const a = new Uint8Array(buf); let s = "";
    for (let i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000));
    return btoa(s);
  };
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const kidOf = async (token) => b64(await subtle.digest("SHA-256", enc.encode("craig-daily-cal:" + token))).slice(0, 16);
  async function kekOf(token, salt) {
    const base = await subtle.importKey("raw", enc.encode(token), "PBKDF2", false, ["deriveKey"]);
    return subtle.deriveKey({ name: "PBKDF2", salt, iterations: 150000, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  }
  const dataKey = (raw) => subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
  async function wrapFor(token, raw) {
    const salt = rand(16), iv = rand(12);
    const key = await subtle.encrypt({ name: "AES-GCM", iv }, await kekOf(token, salt), raw);
    return { kid: await kidOf(token), salt: b64(salt), iv: b64(iv), key: b64(key) };
  }
  async function open(file) {
    const token = ghToken(), kid = await kidOf(token);
    const w = (file.keys || []).find((k) => k.kid === kid);
    const tries = [];
    if (w) tries.push(async () => new Uint8Array(await subtle.decrypt({ name: "AES-GCM", iv: unb64(w.iv) }, await kekOf(token, unb64(w.salt)), unb64(w.key))));
    const cached = store.get("cd-cal-dk", "");
    if (cached) tries.push(async () => unb64(cached));
    for (const t of tries) {
      try {
        const raw = await t();
        const plain = await subtle.decrypt({ name: "AES-GCM", iv: unb64(file.iv) }, await dataKey(raw), unb64(file.data));
        return { raw, events: JSON.parse(dec.decode(plain)).events || [], needsWrap: !w };
      } catch (e) { /* 換下一個方法 */ }
    }
    return null;
  }
  async function seal(raw, events, keys) {
    const token = ghToken(), kid = await kidOf(token);
    if (!keys.some((k) => k.kid === kid)) keys = [await wrapFor(token, raw), ...keys].slice(0, 6);
    const iv = rand(12);
    const data = await subtle.encrypt({ name: "AES-GCM", iv }, await dataKey(raw), enc.encode(JSON.stringify({ events })));
    return { v: 1, note: "Craig 的日常・私人行事曆（已加密）", keys, iv: b64(iv), data: b64(data) };
  }

  /* ---------- GitHub 存取 ---------- */
  const headers = () => ({ Authorization: `Bearer ${ghToken()}`, Accept: "application/vnd.github+json" });
  const httpErr = (r) => new Error(r.status === 401 ? "金鑰無效或過期，按「🔑」重新設定" : r.status === 403 || r.status === 404 ? "金鑰沒有 craig-daily 的寫入權限" : `GitHub 回應 ${r.status}`);
  async function fetchFile() {
    const r = await fetch(API, { cache: "no-store", headers: headers() });
    if (r.status === 404) return { file: null, sha: null };
    if (!r.ok) throw httpErr(r);
    const j = await r.json();
    return { file: JSON.parse(dec.decode(unb64(j.content.replace(/\s/g, "")))), sha: j.sha };
  }

  /* ---------- 狀態 ---------- */
  // status：locked（沒有金鑰）/ loading / ready / nokey（金鑰打不開）/ error
  const st = { status: "locked", msg: "", events: [], base: [], raw: null, file: null, sha: null, reset: false, saving: 0, savedAt: "" };
  let view = store.get("cd-cal-view", "month");
  let anchor = today, selected = today;

  let gen = 0; // 換金鑰時可能同時有兩次解鎖在跑，只採用最新那次的結果
  async function init() {
    const my = ++gen;
    st.msg = "";
    if (!ghToken()) { Object.assign(st, { status: "locked", events: [], raw: null }); return render(); }
    if (!crypto.subtle) { Object.assign(st, { status: "error", msg: "這個瀏覽器不支援加密功能" }); return render(); }
    st.status = "loading"; render();
    try {
      const { file, sha } = await fetchFile();
      const o = file && await open(file);
      if (my !== gen) return;
      Object.assign(st, { file, sha, reset: false });
      if (!file) {
        Object.assign(st, { raw: rand(32), base: [], events: [], status: "ready" });
      } else if (!o) {
        Object.assign(st, { status: "nokey", events: [] }); return render();
      } else {
        Object.assign(st, { raw: o.raw, base: o.events, events: o.events, status: "ready" });
        if (o.needsWrap) save((x) => x, "幫新金鑰加上解鎖資料");
      }
      store.set("cd-cal-dk", b64(st.raw));
    } catch (e) {
      if (my !== gen) return;
      Object.assign(st, { status: "error", msg: e.message });
    }
    render();
  }

  // 先改畫面，再依序存到 GitHub；版本衝突（別台裝置剛存過）就重新讀取後再套用一次
  let queue = Promise.resolve();
  function save(fn, message = "更新私人行事曆") {
    st.events = fn(st.events.map((e) => ({ ...e })));
    st.saving++; render();
    queue = queue.then(async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt) {
          const { file, sha } = await fetchFile();
          const o = file && await open(file);
          Object.assign(st, { file, sha, base: o ? o.events : [] });
        }
        const next = fn(st.base.map((e) => ({ ...e })));
        const sealed = await seal(st.raw, next, st.file && !st.reset ? st.file.keys || [] : []);
        const r = await fetch(API, {
          method: "PUT", headers: headers(),
          body: JSON.stringify({ message, content: b64(enc.encode(JSON.stringify(sealed, null, 1))), ...(st.sha ? { sha: st.sha } : {}) })
        });
        if (r.status === 409 || r.status === 422) continue;
        if (!r.ok) throw httpErr(r);
        const j = await r.json();
        Object.assign(st, { sha: j.content.sha, file: sealed, base: next, reset: false });
        return;
      }
      throw new Error("其他裝置同時在存，請重新整理再試");
    }).then(() => {
      st.saving--; st.msg = "";
      st.savedAt = hhmm(Math.floor((new Date().getHours() * 60 + new Date().getMinutes()) / 5) * 5);
      if (!st.saving) st.events = st.base;
      render();
    }, (err) => {
      st.saving--; st.msg = `沒存成功：${err.message}`;
      if (!st.saving) st.events = st.base; // 退回 GitHub 上的版本
      render();
    });
    return queue;
  }

  /* ---------- 行程展開（每週重複 + 補助截止日） ---------- */
  function occurrences(from, to) {
    const out = [];
    for (const ev of st.status === "ready" ? st.events : []) {
      if (ev.repeat === "weekly") {
        let d = ev.date;
        if (d < from) d = add(d, Math.ceil((P(from) - P(d)) / 864e5 / 7) * 7);
        const end = ev.until && ev.until < to ? ev.until : to;
        for (; d <= end; d = add(d, 7)) if (!(ev.skip || []).includes(d)) out.push({ ...ev, on: d });
      } else if (ev.date >= from && ev.date <= to) out.push({ ...ev, on: ev.date });
    }
    const mine = store.get("cd-funding", {});
    for (const f of CD.funding || []) {
      if (f.deadline && f.deadline >= from && f.deadline <= to && mine[f.name] !== "不適合") {
        out.push({ id: "fund", title: `截止｜${f.name}`, on: f.deadline, start: "", end: "", link: f.link, deadline: true, want: !!mine[f.name] });
      }
    }
    return out.sort((a, b) => a.on.localeCompare(b.on) || (a.start || "").localeCompare(b.start || "") || a.title.localeCompare(b.title));
  }
  const colorOf = (e) => (e.deadline ? DEADLINE : CATS[e.cat] || CATS.生活);
  const timeText = (e) => (e.start ? `${e.start}${e.end ? `–${e.end}` : ""}` : e.deadline ? "截止日" : "全天");

  /* ---------- 畫面 ---------- */
  const root = $("#cal");
  const narrow = window.matchMedia("(max-width: 680px)");
  narrow.addEventListener("change", () => render());

  function render() {
    const ready = st.status === "ready";
    // 標題右邊的狀態
    const meta = {
      locked: "🔒 私人行程已加密，只有設定過金鑰的裝置看得到",
      loading: "解鎖中…",
      ready: st.saving ? "儲存中…" : st.msg ? esc(st.msg) : `🔐 已加密同步${st.savedAt ? `・${st.savedAt} 已儲存` : ""}`,
      nokey: "這把金鑰還打不開行事曆",
      error: esc(st.msg)
    }[st.status];
    $("#cal-meta").innerHTML = meta;

    const title = view === "month" ? `${anchor.slice(0, 4)} 年 ${+anchor.slice(5, 7)} 月` : weekTitle();
    const banner = {
      locked: `<div class="cal-banner"><span>🔒 這是私人行事曆，行程都加密了。用你的裝置解鎖後就能看到和新增行程。</span><button class="btn" data-unlock>🔑 解鎖</button></div>`,
      nokey: `<div class="cal-banner"><span>這把金鑰打不開行事曆（可能換過金鑰）。在之前用過的裝置打開網站一次，就會自動幫新金鑰解鎖；如果沒有那台裝置了，只能重新開始。</span><button class="btn danger" data-reset>重新開始（清空舊行程）</button></div>`,
      error: `<div class="cal-banner"><span>${esc(st.msg)}</span><button class="btn" data-retry>再試一次</button></div>`
    }[st.status] || "";

    root.innerHTML = `
      <div class="cal-bar">
        <div class="cal-nav">
          <button class="btn" data-nav="-1" aria-label="上一個">‹</button>
          <button class="btn" data-nav="0">今天</button>
          <button class="btn" data-nav="1" aria-label="下一個">›</button>
          <h3 class="cal-title">${title}</h3>
        </div>
        <div class="cal-tools">
          <div class="cal-views">${[["month", "月"], ["week", "週"]].map(([v, t]) => `<button class="btn ${view === v ? "on" : ""}" data-view="${v}">${t}</button>`).join("")}</div>
          ${ready ? `<button class="pill solid cal-add" data-add="${selected}">＋ 新增行程</button>` : ""}
        </div>
      </div>
      <div class="cal-legend">${Object.entries(CATS).map(([k, c]) => `<span style="--cc:${c}">${k}</span>`).join("")}<span style="--cc:${DEADLINE}">補助截止</span></div>
      ${banner}
      ${view === "month" ? monthView() : narrow.matches ? weekList() : weekGrid()}`;
    if (view === "week" && !narrow.matches) {
      const sc = root.querySelector(".cal-scroll");
      if (sc && sc.dataset.top) sc.scrollTop = +sc.dataset.top;
    }
  }

  function weekStart(s) { return add(s, -dow(s)); }
  function weekTitle() {
    const a = weekStart(anchor), b = add(a, 6);
    return a.slice(0, 7) === b.slice(0, 7) ? `${a.slice(0, 4)} 年 ${+a.slice(5, 7)} 月 ${+a.slice(8)}–${+b.slice(8)} 日` : `${md(a)} – ${md(b)}`;
  }

  function chip(e) {
    const attrs = e.deadline ? `data-link="${esc(e.link || "")}"` : `data-ev="${esc(e.id)}" data-on="${e.on}"`;
    return `<span class="cal-chip ${e.deadline ? "is-deadline" : ""}" style="--cc:${colorOf(e)}" ${attrs}>${e.start ? `<i>${e.start}</i>` : ""}${esc(e.title)}</span>`;
  }

  function monthView() {
    const first = anchor.slice(0, 8) + "01";
    const start = weekStart(first);
    const nextMonth = add(first, 32).slice(0, 8) + "01";
    const weeks = Math.ceil((dow(first) + (P(nextMonth) - P(first)) / 864e5) / 7);
    const end = add(start, weeks * 7 - 1);
    const occ = occurrences(start, end);
    const byDay = {};
    occ.forEach((e) => (byDay[e.on] = byDay[e.on] || []).push(e));
    let cells = "";
    for (let i = 0; i < weeks * 7; i++) {
      const d = add(start, i), list = byDay[d] || [];
      const cls = [d.slice(0, 7) !== first.slice(0, 7) && "out", d === today && "today", d === selected && "sel", i % 7 > 4 && "weekend"].filter(Boolean).join(" ");
      cells += `<div class="cal-day ${cls}" data-day="${d}" role="button" tabindex="0" aria-label="${dayTitle(d)}，${list.length} 個行程">
        <span class="cal-dn">${+d.slice(8)}</span>
        <span class="cal-chips">${list.slice(0, 3).map(chip).join("")}${list.length > 3 ? `<span class="cal-more">+${list.length - 3}</span>` : ""}</span>
        <span class="cal-dots">${list.slice(0, 4).map((e) => `<i style="--cc:${colorOf(e)}"></i>`).join("")}</span>
      </div>`;
    }
    return `<div class="cal-month">
      <div class="cal-grid-wrap">
        <div class="cal-dow">${DOW.map((w) => `<span>${w}</span>`).join("")}</div>
        <div class="cal-grid" style="--weeks:${weeks}">${cells}</div>
      </div>
      <aside class="cal-side">${agenda(selected, byDay[selected] || occurrences(selected, selected))}${upcoming()}</aside>
    </div>`;
  }

  function item(e, withDate) {
    const attrs = e.deadline ? `data-link="${esc(e.link || "")}"` : `data-ev="${esc(e.id)}" data-on="${e.on}"`;
    return `<li class="cal-item ${e.deadline ? "is-deadline" : ""}" style="--cc:${colorOf(e)}" ${attrs} role="button" tabindex="0">
      <span class="cal-time">${withDate ? `${md(e.on)}<br>星期${DOW[dow(e.on)]}` : timeText(e)}</span>
      <span class="cal-what"><b>${esc(e.title)}${e.repeat ? ` <small title="每週重複">↻</small>` : ""}${e.deadline && e.want ? ` <small>⭐ 我的清單</small>` : ""}</b>
        ${e.place ? `<small>📍 ${esc(e.place)}</small>` : ""}${e.note ? `<small class="cal-note">${esc(e.note)}</small>` : ""}</span>
    </li>`;
  }

  function agenda(day, list) {
    const ready = st.status === "ready";
    return `<div class="cal-agenda">
      <div class="cal-agenda-head"><h4>${day === today ? "今天・" : ""}${dayTitle(day)}</h4>${ready ? `<button class="btn" data-add="${day}" aria-label="在這天新增行程">＋</button>` : ""}</div>
      ${list.length ? `<ul>${list.map((e) => item(e)).join("")}</ul>` : `<p class="cal-empty">${ready ? "這天沒有行程，按 ＋ 新增。" : "沒有公開的截止日。"}</p>`}
    </div>`;
  }

  function upcoming() {
    const list = occurrences(add(today, 1), add(today, 14)).filter((e) => e.deadline || e.cat === "重要").slice(0, 5);
    if (!list.length) return "";
    return `<div class="cal-agenda cal-soon"><div class="cal-agenda-head"><h4>接下來兩週的重要日子</h4></div>
      <ul>${list.map((e) => item(e, true)).join("")}</ul></div>`;
  }

  function lanes(list) {
    // 同一天重疊的行程並排顯示
    const evs = list.map((e) => ({ e, s: mins(e.start), t: e.end && mins(e.end) > mins(e.start) ? mins(e.end) : mins(e.start) + 60 }));
    evs.sort((a, b) => a.s - b.s || b.t - a.t);
    let cluster = [], clusterEnd = -1;
    const flush = () => { const n = Math.max(...cluster.map((c) => c.lane)) + 1; cluster.forEach((c) => (c.n = n)); cluster = []; };
    for (const ev of evs) {
      if (ev.s >= clusterEnd && cluster.length) flush();
      const used = cluster.filter((c) => c.t > ev.s).map((c) => c.lane);
      ev.lane = 0; while (used.includes(ev.lane)) ev.lane++;
      cluster.push(ev); clusterEnd = Math.max(clusterEnd, ev.t);
    }
    if (cluster.length) flush();
    return evs;
  }

  function weekGrid() {
    const start = weekStart(anchor), days = Array.from({ length: 7 }, (_, i) => add(start, i));
    const occ = occurrences(start, days[6]);
    const timed = occ.filter((e) => e.start), allday = occ.filter((e) => !e.start);
    let lo = 7, hi = 23;
    timed.forEach((e) => { lo = Math.min(lo, Math.floor(mins(e.start) / 60)); hi = Math.max(hi, Math.ceil((e.end ? mins(e.end) : mins(e.start) + 60) / 60)); });
    hi = Math.min(24, Math.max(hi, lo + 1));
    const hours = Array.from({ length: hi - lo }, (_, i) => lo + i);
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const cols = days.map((d) => {
      const evs = lanes(timed.filter((e) => e.on === d));
      return `<div class="cal-col ${d === today ? "today" : ""}" data-col="${d}" style="height:${hours.length * HOUR}px">
        ${evs.map(({ e, s, t, lane, n }) => `<div class="cal-ev" data-ev="${esc(e.id)}" data-on="${e.on}" role="button" tabindex="0"
          style="--cc:${colorOf(e)};top:${((s - lo * 60) / 60) * HOUR}px;height:${Math.max(24, ((t - s) / 60) * HOUR - 2)}px;left:calc(${(lane / n) * 100}% + 2px);width:calc(${100 / n}% - 4px)">
          <b>${esc(e.title)}</b><span>${timeText(e)}${e.place ? `・${esc(e.place)}` : ""}</span></div>`).join("")}
        ${d === today && nowMin >= lo * 60 && nowMin < hi * 60 ? `<i class="cal-now" style="top:${((nowMin - lo * 60) / 60) * HOUR}px"></i>` : ""}
      </div>`;
    }).join("");
    const firstEv = timed.length ? Math.min(...timed.map((e) => mins(e.start))) : 8 * 60;
    const top = Math.max(0, ((Math.min(firstEv, 8 * 60) - lo * 60) / 60) * HOUR - 8);
    return `<div class="cal-week">
      <div class="cal-week-head">
        <span></span>${days.map((d, i) => `<button class="cal-wd ${d === today ? "today" : ""}" data-add="${st.status === "ready" ? d : ""}"><small>${DOW[i]}</small><b>${+d.slice(8)}</b></button>`).join("")}
        <span class="cal-ad-label">全天</span>${days.map((d) => `<div class="cal-ad">${allday.filter((e) => e.on === d).map(chip).join("")}</div>`).join("")}
      </div>
      <div class="cal-scroll" data-top="${top}">
        <div class="cal-week-body">
          <div class="cal-hours">${hours.map((h) => `<span style="height:${HOUR}px">${String(h).padStart(2, "0")}:00</span>`).join("")}</div>
          ${cols}
        </div>
      </div>
    </div>`;
  }

  function weekList() {
    // 手機：一週改成逐日清單
    const start = weekStart(anchor), occ = occurrences(start, add(start, 6));
    return `<div class="cal-weeklist">${Array.from({ length: 7 }, (_, i) => add(start, i))
      .map((d) => agenda(d, occ.filter((e) => e.on === d)).replace('class="cal-agenda"', `class="cal-agenda ${d === today ? "today" : ""}"`)).join("")}</div>`;
  }

  /* ---------- 互動 ---------- */
  root.addEventListener("click", (e) => {
    const t = e.target;
    const go = (sel) => t.closest(sel);
    if (go("[data-unlock]")) return K.openKeyDialog();
    if (go("[data-retry]")) return init();
    if (go("[data-reset]")) {
      if (!confirm("確定重新開始？舊的行程會被清空，無法復原。")) return;
      Object.assign(st, { raw: rand(32), base: [], events: [], status: "ready", reset: true });
      store.set("cd-cal-dk", b64(st.raw));
      return save(() => [], "重新開始私人行事曆");
    }
    const nav = go("[data-nav]");
    if (nav) {
      const n = +nav.dataset.nav;
      if (!n) anchor = selected = today;
      else if (view === "month") { const d = P(anchor.slice(0, 8) + "01"); d.setUTCMonth(d.getUTCMonth() + n); anchor = S(d); }
      else { anchor = add(anchor, 7 * n); }
      return render();
    }
    const v = go("[data-view]");
    if (v) { view = v.dataset.view; store.set("cd-cal-view", view); anchor = selected; return render(); }
    const link = go("[data-link]");
    if (link) { if (link.dataset.link) window.open(link.dataset.link, "_blank", "noopener"); return; }
    const ev = go("[data-ev]");
    if (ev) return openEditor(st.events.find((x) => x.id === ev.dataset.ev), ev.dataset.on);
    const addBtn = go("[data-add]");
    if (addBtn && addBtn.dataset.add) return openEditor(null, addBtn.dataset.add);
    const col = go("[data-col]");
    if (col && st.status === "ready") {
      // 點週檢視的空白處：在那個時間新增（取到半小時）
      const sc = root.querySelector(".cal-hours span");
      const lo = sc ? +sc.textContent.slice(0, 2) : 7;
      const y = (e.clientY - col.getBoundingClientRect().top) / (col.currentCSSZoom || 1); // 大螢幕有 zoom
      const m = Math.max(0, Math.min(23 * 60 + 30, lo * 60 + Math.floor((y / HOUR) * 2) * 30));
      return openEditor(null, col.dataset.col, hhmm(m));
    }
    const day = go("[data-day]");
    if (day) {
      selected = day.dataset.day;
      if (selected.slice(0, 7) !== anchor.slice(0, 7)) anchor = selected;
      render();
      if (narrow.matches) root.querySelector(".cal-side")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
  root.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches("[role=button]")) { e.preventDefault(); e.target.click(); }
  });
  root.addEventListener("scroll", (e) => { if (e.target.classList?.contains("cal-scroll")) e.target.dataset.top = e.target.scrollTop; }, true);

  /* ---------- 編輯視窗 ---------- */
  const dlg = $("#cal-dialog"), form = dlg.querySelector("form");
  form.start.innerHTML = form.end.innerHTML = TIMES.map((t) => `<option>${t}</option>`).join("");
  let editing = null, editingOn = "";

  function syncForm() {
    const allday = form.allday.checked, weekly = form.repeat.value === "weekly";
    $("#cal-times").hidden = allday;
    $("#cal-until").hidden = !weekly;
    $("#cal-date-label").textContent = weekly ? "第一次的日期" : "日期";
  }
  form.allday.addEventListener("change", syncForm);
  form.repeat.addEventListener("change", syncForm);
  form.start.addEventListener("change", () => {
    if (mins(form.end.value) <= mins(form.start.value)) form.end.value = hhmm(Math.min(mins(form.start.value) + 60, 23 * 60 + 55));
  });

  function openEditor(ev, on, at) {
    if (st.status !== "ready") return K.openKeyDialog();
    editing = ev || null; editingOn = on || "";
    const start = ev ? ev.start : at || "09:00";
    form.title.value = ev ? ev.title : "";
    form.date.value = ev ? ev.date : on || selected;
    form.allday.checked = !!(ev && !ev.start);
    form.start.value = start || "09:00";
    form.end.value = ev && ev.end ? ev.end : hhmm(Math.min(mins(start || "09:00") + 60, 23 * 60 + 55));
    form.place.value = ev ? ev.place || "" : "";
    form.note.value = ev ? ev.note || "" : "";
    form.repeat.value = ev ? ev.repeat || "" : "";
    form.until.value = ev ? ev.until || "" : "";
    const cat = ev && CATS[ev.cat] ? ev.cat : "課堂";
    $("#cal-cats").innerHTML = Object.entries(CATS).map(([k, c]) =>
      `<label class="chip" style="--cc:${c}"><input type="radio" name="cat" value="${k}" ${k === cat ? "checked" : ""}><span>${k}</span></label>`).join("");
    $("#cal-title").textContent = ev ? "編輯行程" : "新增行程";
    $("#cal-series").hidden = !(ev && ev.repeat);
    $("#cal-del").hidden = !ev;
    $("#cal-del").textContent = ev && ev.repeat ? "刪除整個系列" : "刪除";
    $("#cal-del-one").hidden = !(ev && ev.repeat);
    $("#cal-status").textContent = "";
    syncForm();
    dlg.showModal();
    if (!ev) setTimeout(() => form.title.focus(), 50);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = form.title.value.trim();
    if (!title || !form.date.value) { $("#cal-status").textContent = "先填行程名稱和日期。"; return; }
    const allday = form.allday.checked, weekly = form.repeat.value === "weekly";
    if (!allday && mins(form.end.value) <= mins(form.start.value)) { $("#cal-status").textContent = "結束時間要比開始晚。"; return; }
    if (weekly && form.until.value && form.until.value < form.date.value) { $("#cal-status").textContent = "「重複到」要在第一次的日期之後。"; return; }
    const ev = {
      id: editing ? editing.id : `e${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      title, date: form.date.value,
      start: allday ? "" : form.start.value, end: allday ? "" : form.end.value,
      cat: (form.querySelector("input[name=cat]:checked") || {}).value || "課堂",
      place: form.place.value.trim(), note: form.note.value.trim(),
      repeat: weekly ? "weekly" : "", until: weekly ? form.until.value : "",
      skip: weekly && editing ? editing.skip || [] : []
    };
    const isNew = !editing;
    save((list) => (isNew ? [...list, ev] : list.map((x) => (x.id === ev.id ? ev : x))), isNew ? "新增行程" : "修改行程");
    selected = ev.repeat ? (editingOn || ev.date) : ev.date;
    if (view === "month") anchor = selected;
    dlg.close();
    render();
    K.burstAt(root, 0.5, 0.3);
  });
  $("#cal-del").addEventListener("click", () => {
    if (!editing || !confirm(editing.repeat ? "刪除這個每週行程（每一週都會刪掉）？" : "刪除這個行程？")) return;
    const id = editing.id;
    save((list) => list.filter((x) => x.id !== id), "刪除行程");
    dlg.close();
  });
  $("#cal-del-one").addEventListener("click", () => {
    if (!editing || !editingOn) return;
    const id = editing.id, on = editingOn;
    save((list) => list.map((x) => (x.id === id ? { ...x, skip: [...new Set([...(x.skip || []), on])] } : x)), "取消一次行程");
    dlg.close();
  });
  $("#cal-cancel").addEventListener("click", () => dlg.close());

  document.addEventListener("cd-key", init);
  init();
})();
