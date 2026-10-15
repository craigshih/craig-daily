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

  /* ---------- 主題 ---------- */
  const themes = CD.themes || [];
  const kvImg = $("#kv-img");
  kvImg.addEventListener("load", () => kvImg.classList.add("ready"));
  kvImg.addEventListener("error", () => { kvImg.classList.remove("ready"); $("#bg-img").style.backgroundImage = "none"; });

  function applyTheme(id) {
    const t = themes.find((x) => x.id === id) || themes[0];
    if (!t) return;
    document.documentElement.dataset.theme = t.id;
    document.documentElement.style.setProperty("--motif", `"${t.motif}"`);
    document.querySelectorAll("[data-motif]").forEach((el) => (el.textContent = t.motif));
    $("#hero-title").textContent = t.hero;
    $("#hero-tagline").innerHTML = `<b>${esc(t.name)}</b>｜${esc(t.tagline)}`;
    if (kvImg.dataset.src !== t.img) {
      kvImg.classList.remove("ready");
      kvImg.dataset.src = t.img;
      kvImg.alt = `${t.name} 主視覺`;
      kvImg.style.objectPosition = t.pos || "50% 30%";
      kvImg.src = t.img;
      $("#bg-img").style.backgroundImage = `url("${t.img}")`;
    }
    $("#kv-credit").innerHTML = `圖片 © ${ext(t.sourceUrl, esc(t.source))}`;
    document.querySelectorAll(".theme-chip").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.id === t.id)));
    try { localStorage.setItem("cd-theme", t.id); } catch (e) {}
  }

  $("#theme-chips").innerHTML = themes.map((t) => `
    <button class="theme-chip" role="radio" aria-checked="false" data-id="${t.id}" title="${esc(t.name)}">
      <span class="thumb" style="background-image:url('${esc(t.img)}');background-color:var(--bg-2)"></span>
      <span class="name">${esc(t.motif)} ${esc(t.short)}</span>
    </button>`).join("");
  $("#theme-chips").addEventListener("click", (e) => { const b = e.target.closest(".theme-chip"); if (b) applyTheme(b.dataset.id); });
  applyTheme(document.documentElement.dataset.theme);

  $("#hero-date").textContent = `${today.getFullYear()} 年 ${fmtDay(todayISO)}`;
  $("#credits").innerHTML = "動漫主視覺外連自各作品官方網站，版權屬原作者與製作委員會：" +
    themes.map((t) => ext(t.sourceUrl, esc(t.name))).join("、");

  /* ---------- 總覽 ---------- */
  function renderStats() {
    const b = CD.brief || {};
    const stats = [
      [(b.needs || []).length, "件事需要你處理", "#brief"],
      [(CD.market || []).length, "篇市場先生新文", "#market"],
      [(CD.papers || []).length, "篇論文在書架上", "#papers"],
      [(CD.funding || []).length, "項補助・獎學金", "#funding"]
    ];
    $("#stats").innerHTML = stats.map(([n, label, href]) => `<a class="stat" href="${href}"><b>${n}</b><span>${label}</span></a>`).join("");
  }

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
    // 三段的焦點（x≈140/420/700）落在曲線上方
    const yAt = (x) => { const f = (x / W) * (v.length - 1), i = Math.floor(f), t = f - i; const a = v[i], b = v[Math.min(i + 1, v.length - 1)]; return base - (a + (b - a) * t) * (base - top); };
    const dots = [140, 420, 700].map((x) => `<i class="focal" style="left:${(x / W * 100).toFixed(2)}%;top:${((yAt(x) - 12) / H * 100).toFixed(2)}%"></i>`).join("");
    // 拉伸到容器寬度、高度固定，線寬不跟著變形；焦點用 HTML 疊上去才不會變橢圓
    return `<div class="terrain" role="img" aria-label="今天的負荷地形"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${d}" vector-effect="non-scaling-stroke"/></svg>${dots}</div>`;
  }
  function renderBrief() {
    const b = CD.brief;
    if (!b) { $("#brief-body").innerHTML = `<p class="empty">還沒有晨報。</p>`; return; }
    $("#brief-meta").textContent = b.date !== todayISO ? `最近一期：${b.date}` : `今天 ${b.date}`;
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

  /* ---------- 市場先生 ---------- */
  function renderMarket() {
    const s = CD.marketSummary, items = CD.market || [];
    const read = store.get("cd-market-read", {});
    $("#market-meta").innerHTML = `資料來源：${ext("https://rich01.com/", "市場先生 rich01.com")} · 更新 ${esc(CD.marketUpdated || "")}`;
    $("#market-summary").innerHTML = s ? `
      <div><p class="label">${esc(s.week)}的重點</p><p>${esc(s.text)}</p></div>
      <div class="watch"><p class="label">值得追的問題</p>${(s.watch || []).map((w) => `<span class="tag alt">${esc(w)}</span>`).join("")}</div>` : "";
    $("#market-list").innerHTML = items.length ? items.map((m, i) => `
      <article class="card ${read[m.link] ? "read" : ""}">
        <div class="meta"><span>${esc(m.date)}</span><span class="tag">${esc(m.category)}</span></div>
        <h3>${ext(m.link, esc(m.title))}</h3>
        <p>${esc(m.point)}</p>
        <p class="insight ${m.insight ? "" : "none"}">${m.insight ? esc(m.insight) : "還沒寫心得"}</p>
        <div class="card-foot"><button class="btn ${read[m.link] ? "on" : ""}" data-read="${i}">${read[m.link] ? "已讀 ✓" : "標記已讀"}</button></div>
      </article>`).join("") : `<p class="empty">還沒有文章。</p>`;
  }
  $("#market-list").addEventListener("click", (e) => {
    const b = e.target.closest("[data-read]"); if (!b) return;
    const m = CD.market[+b.dataset.read], read = store.get("cd-market-read", {});
    read[m.link] = !read[m.link]; store.set("cd-market-read", read); renderMarket();
  });

  /* ---------- 論文（Notion 論文資料庫） ---------- */
  let paperFilter = "全部";
  function renderPapers() {
    const all = CD.papers || [];
    $("#papers-meta").innerHTML = `${all.length} 篇 · 同步自 Notion ${esc(CD.papersSynced || "")}${CD.papersDb ? ` · ${ext(CD.papersDb, "開啟論文資料庫")}` : ""}`;
    const fields = ["全部", ...new Set(all.flatMap((p) => p.fields || []))];
    $("#papers-filters").innerHTML = all.length > 3 ? fields.map((f) => `<button class="btn ${f === paperFilter ? "on" : ""}" data-pf="${esc(f)}">${esc(f)}</button>`).join("") : "";
    const shown = all.filter((p) => paperFilter === "全部" || (p.fields || []).includes(paperFilter));
    $("#papers-list").innerHTML = shown.length ? shown.map((p) => `
      <article class="card paper-card">
        <div class="meta">${p.status ? `<span class="tag alt">${esc(p.status)}</span>` : ""}${p.year ? `<span>${esc(p.year)}</span>` : ""}${p.venue ? `<span>${esc(p.venue)}</span>` : ""}${p.rating ? `<span class="rating">${esc(p.rating)}</span>` : ""}</div>
        <h3>${p.link ? ext(p.link, esc(p.title)) : esc(p.title)}</h3>
        ${p.authors ? `<p>${esc(p.authors)}</p>` : ""}
        ${p.takeaway ? `<p class="takeaway">${esc(p.takeaway)}</p>` : ""}
        ${p.method ? `<p><b>研究方法</b>　${esc(p.method)}</p>` : ""}
        <div class="card-foot">
          ${(p.fields || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}
          ${p.notes ? ext(p.notes, "我的筆記 →", "link-btn") : ""}
        </div>
      </article>`).join("") : `<p class="empty">還沒有論文。在 Notion「📚 論文資料庫」新增一筆並勾選「公開到網站」，再說「同步論文」。</p>`;
  }
  $("#papers-filters").addEventListener("click", (e) => { const b = e.target.closest("[data-pf]"); if (b) { paperFilter = b.dataset.pf; renderPapers(); } });

  /* ---------- 筆記 ---------- */
  const notes = CD.notes || [];
  let noteFilter = "全部";
  function renderNotes() {
    if (!notes.length) { $("#notes-list").innerHTML = `<p class="empty">還沒有筆記。執行 <code>node sync.js</code> 從 FinTech Lab 同步。</p>`; return; }
    const types = ["全部", ...new Set(notes.map((n) => n.type).filter(Boolean))];
    $("#notes-meta").innerHTML = `${notes.length} 則 · 同步自 Notion ${esc(CD.notesSynced || "")}${CD.notionDb ? ` · ${ext(CD.notionDb, "開啟筆記資料庫")}` : ""}`;
    $("#notes-filters").innerHTML = types.map((t) => `<button class="btn ${t === noteFilter ? "on" : ""}" data-f="${esc(t)}">${esc(t)}</button>`).join("");
    const shown = notes.filter((n) => noteFilter === "全部" || n.type === noteFilter)
      .sort((a, b) => (b.pinned - a.pinned) || String(b.updated || b.created).localeCompare(String(a.updated || a.created)));
    $("#notes-list").innerHTML = shown.map((n) => `
      <article class="card">
        <div class="meta"><span>${esc(n.icon || "📝")}</span>${n.type ? `<span class="tag">${esc(n.type)}</span>` : ""}${n.status ? `<span>${esc(n.status)}</span>` : ""}</div>
        <h3>${ext(n.url, esc(n.title || "（未命名）"))}</h3>
        ${n.summary ? `<p>${esc(n.summary)}</p>` : ""}
        <div class="card-foot">${(n.tags || []).slice(0, 4).map((t) => `<span class="tag alt">${esc(t)}</span>`).join("")}</div>
      </article>`).join("");
  }
  $("#notes-filters").addEventListener("click", (e) => { const b = e.target.closest("[data-f]"); if (b) { noteFilter = b.dataset.f; renderNotes(); } });

  /* ---------- 補助・獎學金 ---------- */
  let fundFilter = "全部";
  const STATES = ["想申請", "已申請", "不適合"];
  function renderFunding() {
    const items = CD.funding || [], mine = store.get("cd-funding", {});
    const cats = ["全部", ...new Set(items.map((f) => f.cat)), "我的清單"];
    $("#funding-meta").textContent = `整理於 ${CD.fundingUpdated || ""} · 期程與金額每年會變，申請前請看官網公告`;
    $("#funding-filters").innerHTML = cats.map((c) => `<button class="btn ${c === fundFilter ? "on" : ""}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
    const shown = items.filter((f) => fundFilter === "全部" || f.cat === fundFilter || (fundFilter === "我的清單" && mine[f.name] && mine[f.name] !== "不適合"));
    $("#funding-list").innerHTML = shown.length ? shown.map((f) => `
      <article class="card">
        <div class="meta"><span class="tag">${esc(f.cat)}</span><span>${esc(f.org)}</span></div>
        <h3>${ext(f.link, esc(f.name))}</h3>
        <p><b>對象</b>　${esc(f.who)}</p>
        <p>${esc(f.what)}</p>
        ${f.verify ? `<p class="insight none">內容來自二手整理，申請前請查官方原文</p>` : ""}
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
    store.set("cd-funding", mine); renderFunding();
  });

  /* ---------- 導覽列高亮 ---------- */
  const links = [...document.querySelectorAll(".nav a")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id)); });
  }, { rootMargin: "-40% 0px -55% 0px" });
  ["brief", "market", "papers", "notes", "funding"].forEach((id) => io.observe(document.getElementById(id)));

  renderStats(); renderBrief(); renderMarket(); renderPapers(); renderNotes(); renderFunding();
})();
