(function () {
  const CD = window.CD || {};
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ext = (href, text, cls = "") => `<a ${cls ? `class="${cls}" ` : ""}href="${esc(href)}" target="_blank" rel="noopener">${text}</a>`;

  // localStorage 可能被擋，一律包起來
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  const WEEK = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const fmtDay = (s) => { const d = new Date(s + "T00:00:00"); return `${d.getMonth() + 1} 月 ${d.getDate()} 日 · ${WEEK[d.getDay()]}`; };
  const today = new Date();
  const todayISO = iso(today);
  const P = CD.profile || {};
  // 顯示的更新時間一律取到 :00 / :05（排程常會晚幾分鐘才跑）
  const tidy = (t) => String(t || "").replace(/(\d{1,2}):(\d{2})/, (_, h, m) => `${h.padStart(2, "0")}:${String(m - (m % 5)).padStart(2, "0")}`);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mojs = !reduce && window.mojs;

  /* ---------- 動漫主題：每天自動輪替一部 ---------- */
  const themes = CD.themes || [];
  const dayNo = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
  // 網址加 ?theme=oshinoko 可以預覽指定主題
  const forced = new URLSearchParams(location.search).get("theme");
  const theme = themes.find((t) => t.id === forced) || themes[dayNo % themes.length] || { images: [], palette: [] };
  const nextTheme = themes[(dayNo + 1) % themes.length] || {};
  const pal = theme.palette.length ? theme.palette : ["#7ee0b5", "#ffd36e", "#b9a6ff", "#7cc7ff"];
  const root = document.documentElement.style;
  pal.forEach((c, i) => root.setProperty(`--c${i + 1}`, c));
  if (theme.bg) { root.setProperty("--bg", theme.bg); document.querySelector('meta[name="theme-color"]').content = theme.bg; }
  if (theme.bg2) root.setProperty("--bg2", theme.bg2);
  document.querySelectorAll("[data-motif]").forEach((el) => (el.textContent = theme.motif || "✿"));

  /* ---------- 主視覺輪播：當天動漫的多張圖 ---------- */
  const frame = $("#kv-frame");
  let images = [...theme.images];
  let current = 0, timer = null;
  const imgEls = images.map((src, i) => {
    const img = new Image();
    img.referrerPolicy = "no-referrer";
    img.decoding = "async";
    img.alt = `${theme.name} 主視覺 ${i + 1}`;
    img.addEventListener("load", () => frame.classList.add("has-img"));
    img.addEventListener("error", () => { // 官方換掉網址就跳過這張
      const k = imgEls.indexOf(img);
      if (k < 0) return;
      imgEls.splice(k, 1); images.splice(k, 1); img.remove(); renderDots();
      if (current >= imgEls.length) current = 0;
      if (imgEls.length) show(current, true); else frame.classList.remove("has-img");
    });
    img.src = src;
    frame.appendChild(img);
    return img;
  });

  function renderDots() {
    $("#kv-dots").innerHTML = imgEls.map((_, i) => `<button aria-label="第 ${i + 1} 張" class="${i === current ? "on" : ""}" data-i="${i}"></button>`).join("");
  }
  function show(i, silent) {
    if (!imgEls.length) return;
    current = (i + imgEls.length) % imgEls.length;
    imgEls.forEach((el, k) => el.classList.toggle("on", k === current));
    $("#bg-img").style.backgroundImage = `url("${images[current]}")`;
    document.querySelectorAll("#kv-dots button").forEach((b, k) => b.classList.toggle("on", k === current));
    if (window.gsap && !reduce) window.gsap.fromTo(imgEls[current], { scale: 1.12 }, { scale: 1, duration: 5.5, ease: "power1.out" });
    if (!silent) burstAt(frame, 0.5, 0.15);
  }
  function autoplay() { clearInterval(timer); if (imgEls.length > 1) timer = setInterval(() => show(current + 1), 5200); }
  $("#kv-dots").addEventListener("click", (e) => { const b = e.target.closest("[data-i]"); if (b) { show(+b.dataset.i); autoplay(); } });
  current = dayNo % Math.max(images.length, 1);
  renderDots(); show(current, true); autoplay();

  $("#kv-badge").textContent = `今日主題｜${theme.name || ""}`;
  $("#kv-credit").innerHTML = theme.sourceUrl ? `圖片 © ${ext(theme.sourceUrl, esc(theme.source))}，每天自動換一部、每 5 秒換一張` : "";

  // 今日圖鑑：同一部動漫的所有主視覺，點一下換到主視覺
  const gallery = [...theme.images, ...theme.images];
  $("#gallery").innerHTML = gallery.map((src, i) => `<figure data-g="${i % theme.images.length}"><img src="${esc(src)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.remove()"></figure>`).join("");
  $("#gallery").addEventListener("click", (e) => {
    const f = e.target.closest("[data-g]"); if (!f) return;
    const k = imgEls.findIndex((el) => el.src === theme.images[+f.dataset.g]);
    if (k >= 0) { show(k); autoplay(); window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); }
  });

  /* ---------- Hero ---------- */
  $("#hero-date").textContent = `${today.getFullYear()} 年 ${fmtDay(todayISO)}`;
  const [first, ...rest] = (P.name || "Craig Shih").split(" ");
  $("#hero-name").innerHTML = `<span class="w">${esc(first)}</span> <em class="w grad">${esc(rest.join(" "))}</em>`;
  $("#hero-role").textContent = P.role || "";
  $("#hero-line").innerHTML = `${esc(theme.hero || "")}　<b>${esc(theme.tagline || "")}</b>`;
  $("#brand-name").textContent = P.name || "Craig Shih";
  const words = ["Morning Brief", "Market Insight", "Strategy", "Innovation", "Supply Chain", "FinTech", "Papers", "Notes", "Grants"];
  $("#marquee").innerHTML = [...words, ...words].map((w) => `<span>${w}</span>`).join("");

  /* ---------- 平台標記顏色 ---------- */
  const colorOf = (name) => { let h = 0; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return pal[h % pal.length]; };
  const initial = (name) => (name.match(/[A-Za-z]/) ? name.replace(/[^A-Z]/g, "").slice(0, 2) || name[0].toUpperCase() : name[0]);
  const badge = (name) => `<span class="src-badge"><i style="--badge:${colorOf(name)}">${esc(initial(name))}</i>${esc(name)}</span>`;

  /* ---------- Bento 今日總覽 ---------- */
  function renderBento() {
    const b = CD.brief || {}, market = CD.market || [], papers = CD.papers || [];
    const nSources = new Set(market.map((m) => m.source)).size;
    const top = market.filter((m) => m.group !== "tw").slice(0, 4);
    const bySem = (CD.semesters || []).map((s) => `${s} ${papers.filter((p) => p.semester === s).length}`).join("・");
    $("#bento").innerHTML = `
      <div class="tile tile-about reveal">
        <div>
          <p class="t-label">About me</p>
          <p class="t-title">${esc(P.role || "")}</p>
        </div>
        <p>${esc(P.bio || "")}</p>
        <div class="tags">${(P.focus || []).map((f, i) => `<span class="tag ${i % 2 ? "alt" : "hot"}">${esc(f)}</span>`).join("")}</div>
      </div>
      <a class="tile tile-wide reveal" href="#brief">
        <span class="arrow">↗</span>
        <p class="t-label">今天的晨報</p>
        <p class="t-title">${esc(b.headline || "還沒有晨報")}</p>
        <p>${(b.needs || []).length} 件事需要你處理・${(b.resolved || []).length} 件已經解決</p>
      </a>
      <div class="tile tile-theme reveal">
        <img src="${esc(theme.images[(dayNo + 1) % Math.max(theme.images.length, 1)] || "")}" alt="" referrerpolicy="no-referrer" onerror="this.remove()">
        <div class="shade">
          <p class="t-label">Today's Theme</p>
          <p class="t-title">${esc(theme.name || "")}</p>
          <p>明天輪到：${esc(nextTheme.name || "")}</p>
        </div>
      </div>
      <a class="tile reveal" href="#market">
        <span class="arrow">↗</span>
        <p class="t-label">市場洞察</p>
        <p class="t-big grad" data-count="${market.length}">${market.length}</p>
        <p>篇今日新文・${nSources} 個平台</p>
      </a>
      <a class="tile tile-wide reveal" href="#market">
        <span class="arrow">↗</span>
        <p class="t-label">國外今日焦點</p>
        <ul class="mini-list">${top.map((m) => `<li>${esc(m.titleZh || m.title)}</li>`).join("")}</ul>
      </a>
      <a class="tile reveal" href="#papers">
        <span class="arrow">↗</span>
        <p class="t-label">論文書架</p>
        <p class="t-big grad" data-count="${papers.length}">${papers.length}</p>
        <p>${esc(bySem)}</p>
      </a>`;
  }

  /* ---------- 便利貼（Notion「📌 便利貼」每小時整點同步） ---------- */
  let stickyTag = "全部", stickyAll = false;
  const STICKY_COLORS = ["黃", "粉", "藍", "綠", "紫"];
  function renderStickies() {
    const all = (CD.stickies || []).slice().sort((a, b) => (b.pinned - a.pinned) || b.date.localeCompare(a.date));
    const db = CD.stickiesForm || CD.stickiesDb || "";
    $("#stickies-meta").innerHTML = `${all.length} 張・在 Notion 寫、每小時整點同步・最近一次 ${esc(tidy(CD.stickiesSynced) || "—")}`;
    const tags = ["全部", ...new Set(all.flatMap((s) => s.tags || []))];
    $("#stickies-filters").innerHTML = tags.length > 2 ? tags.map((t) => `<button class="btn ${t === stickyTag ? "on" : ""}" data-st="${esc(t)}">${esc(t)}</button>`).join("") : "";
    const shown = all.filter((s) => stickyTag === "全部" || (s.tags || []).includes(stickyTag));
    const limit = stickyAll ? shown.length : 11;
    const hash = (id) => { let h = 0; for (const ch of id || "x") h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
    const card = (s) => {
      const h = hash(s.id), tilt = ((h % 7) - 3) * 0.9;
      const color = STICKY_COLORS.includes(s.color) ? s.color : STICKY_COLORS[h % STICKY_COLORS.length];
      return `<article class="sticky" data-c="${color}" style="--tilt:${tilt}deg">
        ${s.pinned ? `<span class="pin" aria-label="釘選">📌</span>` : ""}
        <p class="s-text">${esc(s.text)}</p>
        ${s.note ? `<p class="s-note">${esc(s.note)}</p>` : ""}
        <div class="s-foot"><span class="s-tags">${(s.tags || []).map((t) => `<span>${esc(t)}</span>`).join("")}</span>
          <span>${s.link ? ext(s.link, "來源 ↗") + "・" : ""}${esc(s.date.slice(5).replace("-", "/"))}</span></div>
      </article>`;
    };
    const add = db ? `<a class="sticky-add" href="${esc(db)}" target="_blank" rel="noopener"><span><b>＋</b>到 Notion 寫一張<br><small>整點就會貼到這裡</small></span></a>` : "";
    $("#stickies-list").innerHTML = add + (shown.length ? shown.slice(0, limit).map(card).join("") : "");
    $("#stickies-more").innerHTML = shown.length > limit ? `<button class="btn" data-more="1">看全部 ${shown.length} 張</button>` : "";
  }
  $("#stickies-filters").addEventListener("click", (e) => { const b = e.target.closest("[data-st]"); if (b) { stickyTag = b.dataset.st; renderStickies(); } });
  $("#stickies-more").addEventListener("click", (e) => { if (e.target.closest("[data-more]")) { stickyAll = true; renderStickies(); } });

  /* ---------- 晨報 ---------- */
  function linkify(item) {
    const src = item.srcLabel ? (item.link ? ext(item.link, esc(item.srcLabel), "src") : `<span>${esc(item.srcLabel)}</span>`) : "";
    return esc(item.text).replace("{src}", src);
  }
  function list(title, items) {
    if (!items || !items.length) return "";
    return `<div class="brief-list"><h3>${esc(title)}</h3><ol>${items.map((it) =>
      `<li><div><b>${esc(it.title)}</b></div><p>${linkify(it)}</p></li>`).join("")}</ol></div>`;
  }
  function terrain(values) {
    const W = 840, H = 170, top = 18, base = 150;
    const v = values && values.length > 1 ? values : [0.2, 0.2];
    const pts = v.map((y, i) => [(i / (v.length - 1)) * W, base - y * (base - top)]);
    // 平滑曲線（Catmull-Rom 轉貝茲）
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    const yAt = (x) => { const f = (x / W) * (v.length - 1), i = Math.floor(f), t = f - i; const a = v[i], b = v[Math.min(i + 1, v.length - 1)]; return base - (a + (b - a) * t) * (base - top); };
    const dots = [140, 420, 700].map((x) => `<i class="focal" style="left:${(x / W * 100).toFixed(2)}%;top:${((yAt(x) - 12) / H * 100).toFixed(2)}%"></i>`).join("");
    const stops = pal.map((c, i) => `<stop offset="${(i / (pal.length - 1) * 100).toFixed(0)}%" stop-color="${c}"/>`).join("");
    // 拉伸到容器寬度、高度固定，線寬不跟著變形；焦點用 HTML 疊上去才不會變橢圓
    return `<div class="terrain" role="img" aria-label="今天的負荷地形"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="terrain-grad" gradientUnits="userSpaceOnUse" x1="0" x2="${W}" y1="0" y2="0">${stops}</linearGradient></defs><path d="${d}" vector-effect="non-scaling-stroke"/></svg>${dots}</div>`;
  }
  function renderBrief() {
    const b = CD.brief;
    if (!b) { $("#brief-body").innerHTML = `<p class="empty">還沒有晨報。</p>`; return; }
    $("#brief-meta").textContent = b.date !== todayISO ? `最近一期：${b.date}・每天 06:05 自動更新` : `今天 ${b.date}・每天 06:05 自動更新`;
    const d = new Date(b.date + "T00:00:00");
    const tmr = new Date(d); tmr.setDate(d.getDate() + 1);
    const ev = (CD.lab || []).filter((e) => e.date === b.date || e.date === iso(tmr))
      .sort((x, y) => (x.date + (x.time || "99")).localeCompare(y.date + (y.time || "99")));
    const lab = list("實驗室行事曆・今明兩天", ev.map((e) => ({
      title: e.title,
      text: `${e.date === b.date ? "今天" : "明天"}${e.time ? " " + e.time : ""}・{src}`,
      srcLabel: { discord: "Discord", gmail: "Gmail", manual: "手動記錄", web: "網路" }[e.source] || e.source || "行事曆",
      link: e.link || ""
    })));
    const needs = list("需要你處理", b.needs), resolved = list("已經解決", b.resolved);
    $("#brief-body").innerHTML = `
      <p class="day-date">${d.getFullYear()} 年 ${fmtDay(b.date)}</p>
      <p class="headline">${esc(b.headline)}</p>
      ${terrain(b.terrain)}
      <div class="acts">${(b.acts || []).map((a) => `<div class="act"><b>${esc(a.time)}</b><p>${esc(a.text)}</p></div>`).join("")}</div>
      ${needs || resolved ? needs + resolved : `<div class="brief-list"><p>今天早上沒有需要你處理的事。</p></div>`}
      ${(b.sections || []).map((s) => list(s.title, s.items)).join("")}
      ${lab}`;
  }

  /* ---------- 每日市場洞察：依主題 / 依平台 ---------- */
  let marketMode = store.get("cd-market-mode", "topic");
  let marketTab = "all";
  function marketCard(m) {
    const items = CD.market || [], read = store.get("cd-market-read", {});
    const i = items.indexOf(m), isRead = read[m.link];
    const zh = m.titleZh && m.titleZh !== m.title && !/[\u4e00-\u9fff]/.test(m.title); // 中文原標題就不重複顯示
    return `
      <article class="card ${isRead ? "read" : ""}">
        <div class="meta">${badge(m.source)}<span>${esc(m.date)}</span></div>
        <h3>${ext(m.link, esc(zh ? m.titleZh : m.title))}</h3>
        ${zh ? `<p class="orig">${esc(m.title)}</p>` : ""}
        ${m.takeaway ? `<p class="insight">${esc(m.takeaway)}</p>` : m.excerpt ? `<p class="excerpt">${esc(m.excerpt)}</p>` : ""}
        <div class="card-foot"><button class="btn ${isRead ? "on" : ""}" data-read="${i}">${isRead ? "已讀 ✓" : "標記已讀"}</button></div>
      </article>`;
  }
  function renderMarket() {
    const s = CD.marketSummary, items = CD.market || [], groups = CD.marketGroups || [];
    const sources = [...new Set(items.map((m) => m.source))];
    const groupName = Object.fromEntries(groups.map((g) => [g.id, g.name]));
    $("#market-meta").textContent = `每天台灣時間 06:05 自動更新・最近一次 ${tidy(CD.marketUpdated) || "—"}`;
    $("#market-summary").innerHTML = s && s.text ? `
      <div><p class="label">今日總覽</p><p>${esc(s.text)}</p></div>
      <div class="watch"><p class="label">值得追的問題</p>${(s.watch || []).map((w) => `<span class="tag alt">${esc(w)}</span>`).join("")}</div>` : `
      <div><p class="label">今日來源</p><p>從 ${sources.length} 個台灣與國外財經、商業、科技平台抓今天的新文章。可以依主題看，也可以切到「依平台」逐站瀏覽。</p></div>`;
    document.querySelectorAll(".seg button").forEach((b) => b.classList.toggle("on", b.dataset.mode === marketMode));

    const tabs = marketMode === "topic"
      ? [{ id: "all", name: "全部", n: items.length }, ...groups.map((g) => ({ id: g.id, name: g.name, n: items.filter((m) => m.group === g.id).length }))]
      : [{ id: "all", name: "全部平台", n: items.length }, ...sources.map((x) => ({ id: x, name: x, n: items.filter((m) => m.source === x).length }))];
    if (!tabs.some((t) => t.id === marketTab)) marketTab = "all";
    $("#market-tabs").innerHTML = tabs.map((t) => `<button class="btn ${t.id === marketTab ? "on" : ""}" role="tab" aria-selected="${t.id === marketTab}" data-tab="${esc(t.id)}">${esc(t.name)}<span class="n">${t.n}</span></button>`).join("");

    const box = $("#market-list");
    if (marketMode === "platform" && marketTab === "all") {
      // 依平台：每個平台一段，左邊平台名稱、右邊文章
      box.innerHTML = sources.map((src) => {
        const list = items.filter((m) => m.source === src);
        return `<div class="platform-block">
          <div class="platform-name"><b>${badge(src)}</b><span>${esc(groupName[list[0].group] || "")}・${list.length} 篇</span></div>
          <div class="platform-cards">${list.map(marketCard).join("")}</div>
        </div>`;
      }).join("") || `<p class="empty">今天沒有抓到文章。</p>`;
      return;
    }
    const shown = items.filter((m) => marketTab === "all" || (marketMode === "topic" ? m.group === marketTab : m.source === marketTab));
    box.innerHTML = shown.length ? shown.map(marketCard).join("") : `<p class="empty">這裡今天沒有新文章。</p>`;
  }
  document.querySelector(".seg").addEventListener("click", (e) => {
    const b = e.target.closest("[data-mode]"); if (!b || b.dataset.mode === marketMode) return;
    marketMode = b.dataset.mode; marketTab = "all"; store.set("cd-market-mode", marketMode); renderMarket(); burstFrom(e);
  });
  $("#market-tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) { marketTab = b.dataset.tab; renderMarket(); } });
  $("#market-list").addEventListener("click", (e) => {
    const b = e.target.closest("[data-read]"); if (!b) return;
    const m = CD.market[+b.dataset.read], read = store.get("cd-market-read", {});
    read[m.link] = !read[m.link]; store.set("cd-market-read", read); renderMarket();
  });

  /* ---------- 論文：依學期排的時間軸 ---------- */
  let paperFilter = "全部";
  function renderPapers() {
    const all = CD.papers || [], sems = CD.semesters || ["碩一上", "碩一下", "碩二上", "碩二下"];
    $("#papers-meta").textContent = `${all.length} 篇・同步自 Notion 論文資料庫 ${CD.papersSynced || ""}`;
    const fields = ["全部", ...new Set(all.flatMap((p) => p.fields || []))];
    $("#papers-filters").innerHTML = fields.length > 2 ? fields.map((f) => `<button class="btn ${f === paperFilter ? "on" : ""}" data-pf="${esc(f)}">${esc(f)}</button>`).join("") : "";
    const shown = all.filter((p) => paperFilter === "全部" || (p.fields || []).includes(paperFilter));
    const card = (p) => `
      <article class="card paper-card">
        <div class="meta">${p.status ? `<span class="tag alt">${esc(p.status)}</span>` : ""}${p.type ? `<span>${esc(p.type)}</span>` : ""}${p.year ? `<span>${esc(p.year)}</span>` : ""}${p.venue ? `<span>${esc(p.venue)}</span>` : ""}${p.rating ? `<span class="rating">${esc(p.rating)}</span>` : ""}</div>
        <h3>${p.link ? ext(p.link, esc(p.title)) : esc(p.title)}</h3>
        ${p.authors ? `<p>${esc(p.authors)}</p>` : ""}
        ${p.takeaway ? `<p class="takeaway">${esc(p.takeaway)}</p>` : ""}
        ${(p.highlights || []).length ? `<ul>${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
        <div class="card-foot">${(p.fields || []).map((t) => `<span class="tag hot">${esc(t)}</span>`).join("")}${p.course ? `<span class="tag">${esc(p.course)}</span>` : ""}</div>
      </article>`;
    const nowSem = sems.find((s) => all.some((p) => p.semester === s)) && [...sems].reverse().find((s) => all.some((p) => p.semester === s));
    $("#papers-list").innerHTML = sems.map((s, i) => {
      const list = shown.filter((p) => p.semester === s);
      return `
      <div class="term reveal ${s === nowSem ? "now" : ""}">
        <div class="term-label"><b>${esc(s)}</b><span>${["第一學年・上", "第一學年・下", "第二學年・上", "第二學年・下"][i] || ""}・${list.length} 篇</span></div>
        ${list.length ? `<div class="term-list">${list.map(card).join("")}</div>` : `<p class="term-empty">這學期還沒有論文。在 Notion 新增一筆、選好學期並勾選「公開到網站」。</p>`}
      </div>`;
    }).join("") + (shown.some((p) => !sems.includes(p.semester)) ? `<div class="term"><div class="term-label"><b>未分學期</b></div><div class="term-list">${shown.filter((p) => !sems.includes(p.semester)).map(card).join("")}</div></div>` : "");
  }
  $("#papers-filters").addEventListener("click", (e) => { const b = e.target.closest("[data-pf]"); if (b) { paperFilter = b.dataset.pf; renderPapers(); } });

  /* ---------- 筆記 ---------- */
  const notes = CD.notes || [];
  let noteFilter = "全部";
  function renderNotes() {
    if (!notes.length) { $("#notes-list").innerHTML = `<p class="empty">還沒有筆記。執行 <code>node sync.js</code> 從 FinTech Lab 同步。</p>`; return; }
    const types = ["全部", ...new Set(notes.map((n) => n.type).filter(Boolean))];
    $("#notes-meta").textContent = `${notes.length} 則・同步自 Notion ${tidy(CD.notesSynced)}`;
    $("#notes-filters").innerHTML = types.map((t) => `<button class="btn ${t === noteFilter ? "on" : ""}" data-f="${esc(t)}">${esc(t)}</button>`).join("");
    const shown = notes.filter((n) => noteFilter === "全部" || n.type === noteFilter)
      .sort((a, b) => (b.pinned - a.pinned) || String(b.updated || b.created).localeCompare(String(a.updated || a.created)));
    $("#notes-list").innerHTML = shown.map((n) => `
      <article class="card">
        <div class="meta"><span>${esc(n.icon || "📝")}</span>${n.type ? `<span class="tag">${esc(n.type)}</span>` : ""}${n.status ? `<span>${esc(n.status)}</span>` : ""}</div>
        <h3>${esc(n.title || "（未命名）")}</h3>
        ${n.summary ? `<p>${esc(n.summary)}</p>` : ""}
        <div class="card-foot">${(n.tags || []).slice(0, 4).map((t) => `<span class="tag alt">${esc(t)}</span>`).join("")}</div>
      </article>`).join("");
  }
  $("#notes-filters").addEventListener("click", (e) => { const b = e.target.closest("[data-f]"); if (b) { noteFilter = b.dataset.f; renderNotes(); } });

  /* ---------- 補助・獎學金（手動更新） ---------- */
  let fundFilter = "全部";
  const STATES = ["想申請", "已申請", "不適合"];
  function renderFunding() {
    const items = CD.funding || [], mine = store.get("cd-funding", {});
    const cats = ["全部", ...new Set(items.map((f) => f.cat)), "我的清單"];
    $("#funding-meta").textContent = `手動整理・最近更新 ${CD.fundingUpdated || ""}・申請前請看官網公告`;
    $("#funding-filters").innerHTML = cats.map((c) => `<button class="btn ${c === fundFilter ? "on" : ""}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
    const shown = items.filter((f) => fundFilter === "全部" || f.cat === fundFilter || (fundFilter === "我的清單" && mine[f.name] && mine[f.name] !== "不適合"));
    $("#funding-list").innerHTML = shown.length ? shown.map((f) => `
      <article class="card">
        <div class="meta"><span class="tag hot">${esc(f.cat)}</span><span>${esc(f.org)}</span></div>
        <h3>${ext(f.link, esc(f.name))}</h3>
        <p><b>對象</b>　${esc(f.who)}</p>
        <p>${esc(f.what)}</p>
        ${f.verify ? `<p class="insight">內容來自二手整理，申請前請查官方原文</p>` : ""}
        <div class="card-foot">${STATES.map((s) => `<button class="btn ${mine[f.name] === s ? "on" : ""}" data-n="${esc(f.name)}" data-s="${s}">${s}</button>`).join("")}</div>
      </article>`).join("") : `<p class="empty">清單是空的——在卡片上按「想申請」或「已申請」就會出現在這裡。</p>`;

    const kw = CD.oppKeywords;
    const opps = (CD.lab || []).filter((e) => kw && kw.test(e.title)).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
    $("#opps-head").hidden = !opps.length;
    $("#opps-list").innerHTML = opps.map((e) => `
      <article class="card">
        <div class="meta"><span>${esc(e.date)}</span><span class="tag alt">${esc(e.source || "")}</span></div>
        <h3>${e.link ? ext(e.link, esc(e.title)) : esc(e.title)}</h3>
      </article>`).join("");
  }
  $("#funding-filters").addEventListener("click", (e) => { const b = e.target.closest("[data-c]"); if (b) { fundFilter = b.dataset.c; renderFunding(); } });
  $("#funding-list").addEventListener("click", (e) => {
    const b = e.target.closest("[data-n]"); if (!b) return;
    const mine = store.get("cd-funding", {});
    mine[b.dataset.n] = mine[b.dataset.n] === b.dataset.s ? "" : b.dataset.s;
    store.set("cd-funding", mine); renderFunding(); burstFrom(e);
  });

  /* ---------- 頁尾 ---------- */
  $("#footer-links").innerHTML = (P.links || []).map((l) => ext(l.url, esc(l.label))).join("　·　");
  $("#credits").innerHTML = "動漫主視覺外連自各作品官方網站，版權屬原作者與製作委員會：" + themes.map((t) => ext(t.sourceUrl, esc(t.name))).join("、");

  /* ---------- 導覽列高亮 ---------- */
  const links = [...document.querySelectorAll(".nav a")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id)); });
  }, { rootMargin: "-40% 0px -55% 0px" });
  ["stickies", "brief", "market", "papers", "notes", "funding"].forEach((id) => io.observe(document.getElementById(id)));

  renderBento(); renderStickies(); renderBrief(); renderMarket(); renderPapers(); renderNotes(); renderFunding();

  /* ---------- mo.js：點擊爆破、主視覺換圖爆破、Hero 幾何動畫（mojs.io 風格） ---------- */
  const fx = $("#fx");
  let burst = null;
  if (mojs) {
    burst = new mojs.Burst({
      parent: fx, left: 0, top: 0, radius: { 0: 90 }, count: 12, degree: 360,
      children: { shape: ["circle", "polygon", "rect", "cross"], points: 5, fill: pal, stroke: pal, strokeWidth: { 2: 0 },
        radius: { 9: 0 }, rotate: { 0: 180 }, duration: 750, delay: "stagger(0, 18)", easing: "quad.out" }
    });
    const ring = new mojs.Shape({ parent: fx, left: 0, top: 0, shape: "circle", fill: "none", stroke: pal[1], strokeWidth: { 8: 0 }, radius: { 0: 60 }, duration: 600, easing: "cubic.out" });
    window.__fx = (x, y) => { burst.tune({ x, y }).replay(); ring.tune({ x, y }).replay(); };
  }
  function burstAt(el, fx0 = 0.5, fy0 = 0.5) {
    if (!window.__fx) return;
    // #fx 圖層在 #app 外面、不受超大螢幕 zoom 影響；getBoundingClientRect 已經是畫面座標
    const r = el.getBoundingClientRect();
    window.__fx(r.left + r.width * fx0, r.top + r.height * fy0);
  }
  function burstFrom(e) { if (window.__fx && e.clientX) window.__fx(e.clientX, e.clientY); }
  document.addEventListener("click", (e) => { if (!e.target.closest("[data-read], .seg, [data-n]")) burstFrom(e); });

  if (mojs) {
    // Hero 背景的漂浮幾何（圓、星、鋸齒、十字），位置用百分比，跟著版面縮放
    const parent = $("#hero-shapes");
    const defs = [
      { shape: "circle", left: "2%", top: "6%", radius: 28, stroke: pal[0], strokeWidth: 3, fill: "none", scale: { 1: 1.35 } },
      { shape: "polygon", points: 3, left: "46%", top: "10%", radius: 16, fill: pal[1], rotate: { 0: 360 }, duration: 6000 },
      { shape: "zigzag", points: 10, left: "52%", top: "86%", radius: 46, stroke: pal[2], strokeWidth: 3, fill: "none", x: { 0: 30 } },
      { shape: "cross", left: "92%", top: "8%", radius: 12, stroke: pal[3], strokeWidth: 4, rotate: { 0: 180 } },
      { shape: "rect", left: "46%", top: "97%", radius: 10, fill: pal[3], rotate: { 0: 90 }, y: { 0: -20 } },
      { shape: "circle", left: "96%", top: "70%", radius: 7, fill: pal[0], scale: { 1: 1.8 } },
      { shape: "polygon", points: 5, left: "3%", top: "86%", radius: 14, fill: "none", stroke: pal[1], strokeWidth: 3, rotate: { 0: -360 }, duration: 7000 },
      { shape: "zigzag", points: 6, left: "28%", top: "4%", radius: 26, stroke: pal[0], strokeWidth: 3, fill: "none", y: { 0: 14 } }
    ];
    defs.forEach((d, i) => new mojs.Shape({ parent, isShowStart: true, duration: 3200 + i * 300, repeat: 999, isYoyo: true, easing: "sin.inOut", opacity: .85, ...d }).play());
  }

  /* ---------- 動漫鼠標：每部一種形狀 + 拖尾粒子（觸控裝置不啟用） ---------- */
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer) {
    const [a, b, c, d] = pal;
    const shapes = {
      // 芙莉蓮：花田魔法的小花
      frieren: (s) => `<g transform="translate(16 16) scale(${s})">${[0, 72, 144, 216, 288].map((r) => `<ellipse cx="0" cy="-7" rx="4.6" ry="7" fill="${a}" stroke="#fff" stroke-width="1" transform="rotate(${r})"/>`).join("")}<circle r="3.6" fill="${b}" stroke="#fff" stroke-width="1"/></g>`,
      // RE:0：冰晶雪花
      rezero: (s) => `<g transform="translate(16 16) scale(${s})" stroke-linecap="round">${[0, 60, 120].map((r) => `<g transform="rotate(${r})"><line y1="-12" y2="12" stroke="#fff" stroke-width="4.5"/><line y1="-12" y2="12" stroke="${a}" stroke-width="2.4"/><path d="M-4 -9 L0 -5 L4 -9 M-4 9 L0 5 L4 9" fill="none" stroke="${d}" stroke-width="2"/></g>`).join("")}<circle r="2.6" fill="${c}"/></g>`,
      // 我推：星星眼
      oshinoko: (s) => `<g transform="translate(16 16) scale(${s})"><path d="M0 -13 L3.8 -4.2 L13 -4 L5.8 2 L8.2 11.6 L0 6.2 L-8.2 11.6 L-5.8 2 L-13 -4 L-3.8 -4.2 Z" fill="${a}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M0 -5 L1.6 -1.6 L5 -1.5 L2.3 .8 L3.2 4.6 L0 2.5 L-3.2 4.6 L-2.3 .8 L-5 -1.5 L-1.6 -1.6 Z" fill="${b}"/></g>`,
      // 敗北女角：夏天的太陽
      makeine: (s) => `<g transform="translate(16 16) scale(${s})" stroke-linecap="round">${[0, 45, 90, 135, 180, 225, 270, 315].map((r) => `<line y1="-9.5" y2="-13.5" stroke="${c}" stroke-width="2.6" transform="rotate(${r})"/>`).join("")}<circle r="7" fill="${a}" stroke="#fff" stroke-width="1.6"/><circle cx="-2.2" cy="-2.2" r="2" fill="#fff" opacity=".7"/></g>`
    };
    const draw = shapes[theme.id] || shapes.frieren;
    const url = (s) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">${draw(s)}</svg>`)}") 16 16`;
    const css = document.createElement("style");
    css.textContent = `html, body { cursor: ${url(0.85)}, auto; }
      a, button, [role="tab"], .gallery figure, .kv-dots button { cursor: ${url(1.15)}, pointer; }
      input, textarea { cursor: text; }`;
    document.head.appendChild(css);

    // 拖尾：花瓣往下飄、冰晶閃爍、星星、陽光碎片；用固定數量的 mo.js 圖形輪流重播
    if (mojs) {
      const trailDef = {
        frieren: { shape: "circle", radius: { 4: 0 }, fall: 28 },
        rezero: { shape: "cross", radius: { 5: 0 }, rotate: { 0: 90 }, strokeWidth: 2 },
        oshinoko: { shape: "polygon", points: 5, radius: { 6: 0 }, rotate: { 0: 144 } },
        makeine: { shape: "circle", radius: { 3.5: 0 }, scale: { 1: 1.6 } }
      }[theme.id] || { shape: "circle", radius: { 4: 0 } };
      const { fall = 0, ...shapeDef } = trailDef;
      const pool = Array.from({ length: 14 }, (_, i) => new mojs.Shape({
        parent: fx, left: 0, top: 0, duration: 650, easing: "quad.out", opacity: { 1: 0 },
        fill: shapeDef.shape === "cross" ? "none" : pal[i % pal.length], stroke: pal[i % pal.length], ...shapeDef
      }));
      let k = 0, last = 0;
      window.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse") return;
        const now = performance.now();
        if (now - last < 45) return; // 節流，避免太密
        last = now;
        const x = e.clientX + (fall ? Math.random() * 16 - 8 : 0), y = e.clientY;
        pool[k = (k + 1) % pool.length].tune({ x, y: fall ? { [y]: y + fall } : y }).replay();
      }, { passive: true });
    }
  }

  /* ---------- GSAP：進場與捲動動畫 ---------- */
  if (window.gsap && !reduce) {
    const gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".eyebrow", { y: 16, opacity: 0, duration: .6 })
      .from("#hero-name .w", { yPercent: 70, rotate: 4, opacity: 0, duration: 1.1, stagger: .14 }, "-=.3")
      .from([".hero-role", ".hero-line", ".hero-cta"], { y: 20, opacity: 0, duration: .7, stagger: .1 }, "-=.7")
      .from(".kv-ring", { scale: .7, rotate: -8, opacity: 0, duration: 1.2, ease: "back.out(1.6)" }, 0.15)
      .add(() => burstAt(frame, .5, .1), 0.9)
      .from(".kv figcaption", { opacity: 0, y: 10, duration: .6 }, "-=.4");
    if (window.ScrollTrigger) {
      gsap.to(".kv-ring", { y: 40, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".marquee", { xPercent: -6, ease: "none", scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.from(el, { y: 50, opacity: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
      gsap.utils.toArray(".block-head h2").forEach((el) => {
        window.ScrollTrigger.create({ trigger: el, start: "top 80%", once: true, onEnter: () => setTimeout(() => burstAt(el, 0.08, 0.5), 400) });
      });
      gsap.utils.toArray(".block-num").forEach((el) => {
        gsap.from(el, { x: 80, opacity: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });
      document.querySelectorAll("[data-count]").forEach((el) => {
        const n = +el.dataset.count, obj = { v: 0 };
        gsap.to(obj, { v: n, duration: 1.6, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(obj.v)), scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });
    }
  }
})();
