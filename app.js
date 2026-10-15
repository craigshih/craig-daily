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

  /* ---------- 動漫主題：每天自動輪替 ---------- */
  const themes = CD.themes || [];
  const dayNo = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
  const theme = themes[dayNo % themes.length] || {};
  document.documentElement.dataset.theme = theme.id || "frieren";
  document.documentElement.style.setProperty("--motif", `"${theme.motif || "✿"}"`);
  document.querySelectorAll("[data-motif]").forEach((el) => (el.textContent = theme.motif || "✿"));

  const kvImg = $("#kv-img");
  kvImg.addEventListener("load", () => kvImg.classList.add("ready"));
  kvImg.addEventListener("error", () => { kvImg.classList.remove("ready"); $("#bg-img").style.backgroundImage = "none"; });
  if (theme.img) {
    kvImg.alt = `${theme.name} 主視覺`;
    kvImg.style.objectPosition = theme.pos || "50% 30%";
    kvImg.src = theme.img;
    $("#bg-img").style.backgroundImage = `url("${theme.img}")`;
  }
  const nextTheme = themes[(dayNo + 1) % themes.length] || {};
  $("#kv-badge").textContent = `今日主題｜${theme.name || ""}`;
  $("#kv-credit").innerHTML = theme.sourceUrl ? `圖 © ${ext(theme.sourceUrl, "官方網站")}` : "";

  /* ---------- Hero ---------- */
  $("#hero-date").textContent = `${today.getFullYear()} 年 ${fmtDay(todayISO)}`;
  const [first, ...rest] = (P.name || "Craig Shih").split(" ");
  $("#hero-name").innerHTML = `<span class="w">${esc(first)}</span> <em class="w">${esc(rest.join(" "))}</em>`;
  $("#hero-role").textContent = P.role || "";
  $("#hero-line").innerHTML = `${esc(theme.hero || "")}　<b>${esc(theme.tagline || "")}</b>`;
  $("#brand-name").textContent = P.name || "Craig Shih";

  const words = ["Morning Brief", "Market Insight", "Strategy", "Innovation", "Supply Chain", "FinTech", "Papers", "Notes", "Grants"];
  $("#marquee").innerHTML = [...words, ...words].map((w) => `<span>${w}</span>`).join("");

  /* ---------- Bento 今日總覽 ---------- */
  function renderBento() {
    const b = CD.brief || {}, market = CD.market || [], papers = CD.papers || [];
    const groups = CD.marketGroups || [];
    const nSources = new Set(market.map((m) => m.source)).size;
    const top = market.filter((m) => m.group !== "tw").slice(0, 3);
    const bySem = (CD.semesters || []).map((s) => `${s} ${papers.filter((p) => p.semester === s).length}`).join("・");
    $("#bento").innerHTML = `
      <div class="tile tile-about reveal">
        <div>
          <p class="t-label">About</p>
          <p class="t-title">${esc(P.role || "")}</p>
        </div>
        <p>${esc(P.bio || "")}</p>
        <div class="tags">${(P.focus || []).map((f) => `<span class="tag line">${esc(f)}</span>`).join("")}</div>
      </div>
      <a class="tile tile-brief reveal" href="#brief">
        <span class="arrow">↗</span>
        <p class="t-label">今天的晨報</p>
        <p class="t-title">${esc(b.headline || "還沒有晨報")}</p>
        <p>${(b.needs || []).length} 件事需要你處理・${(b.resolved || []).length} 件已經解決</p>
      </a>
      <div class="tile tile-theme reveal" style="background-image:url('${esc(theme.img || "")}')">
        <div class="shade">
          <p class="t-label">Today's Theme</p>
          <p class="t-title">${esc(theme.name || "")}</p>
          <p>明天輪到：${esc(nextTheme.name || "")}</p>
        </div>
      </div>
      <a class="tile reveal" href="#market">
        <span class="arrow">↗</span>
        <p class="t-label">市場洞察</p>
        <p class="t-big" data-count="${market.length}">${market.length}</p>
        <p>篇今日新文・${nSources} 個來源・${groups.length} 大主題</p>
      </a>
      <a class="tile tile-brief reveal" href="#market">
        <span class="arrow">↗</span>
        <p class="t-label">國外今日焦點</p>
        <ul class="mini-list">${top.map((m) => `<li>${esc(m.titleZh || m.title)}</li>`).join("")}</ul>
      </a>
      <a class="tile reveal" href="#papers">
        <span class="arrow">↗</span>
        <p class="t-label">論文書架</p>
        <p class="t-big" data-count="${papers.length}">${papers.length}</p>
        <p>${esc(bySem)}</p>
      </a>`;
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
    const yAt = (x) => { const f = (x / W) * (v.length - 1), i = Math.floor(f), t = f - i; const a = v[i], b = v[Math.min(i + 1, v.length - 1)]; return base - (a + (b - a) * t) * (base - top); };
    const dots = [140, 420, 700].map((x) => `<i class="focal" style="left:${(x / W * 100).toFixed(2)}%;top:${((yAt(x) - 12) / H * 100).toFixed(2)}%"></i>`).join("");
    // 拉伸到容器寬度、高度固定，線寬不跟著變形；焦點用 HTML 疊上去才不會變橢圓
    return `<div class="terrain" role="img" aria-label="今天的負荷地形"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${d}" vector-effect="non-scaling-stroke"/></svg>${dots}</div>`;
  }
  function renderBrief() {
    const b = CD.brief;
    if (!b) { $("#brief-body").innerHTML = `<p class="empty">還沒有晨報。</p>`; return; }
    $("#brief-meta").textContent = b.date !== todayISO ? `最近一期：${b.date}・說「更新晨報」產生今天的` : `今天 ${b.date}`;
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

  /* ---------- 每日市場洞察（GitHub Action 每天自動更新） ---------- */
  let marketTab = "all";
  function renderMarket() {
    const s = CD.marketSummary, items = CD.market || [], groups = CD.marketGroups || [];
    const read = store.get("cd-market-read", {});
    const sources = [...new Set(items.map((m) => m.source))];
    $("#market-meta").textContent = `每天台灣時間 06:00 自動更新・最近一次 ${CD.marketUpdated || "—"}`;
    $("#market-summary").innerHTML = s ? `
      <div><p class="label">今日總覽</p><p>${esc(s.text)}</p></div>
      <div class="watch"><p class="label">值得追的問題</p>${(s.watch || []).map((w) => `<span class="tag alt">${esc(w)}</span>`).join("")}</div>` : `
      <div><p class="label">今日來源</p><p>從 ${sources.length} 個台灣與國外財經、商業、科技網站抓今天的新文章，依主題分類。</p>
      <div class="sources">${sources.map((x) => `<span class="tag line">${esc(x)}</span>`).join("")}</div></div>`;
    $("#market-tabs").innerHTML = [{ id: "all", name: "全部" }, ...groups].map((g) => {
      const n = g.id === "all" ? items.length : items.filter((m) => m.group === g.id).length;
      return `<button class="btn ${g.id === marketTab ? "on" : ""}" role="tab" aria-selected="${g.id === marketTab}" data-tab="${g.id}">${esc(g.name)} ${n}</button>`;
    }).join("");
    const shown = items.filter((m) => marketTab === "all" || m.group === marketTab);
    $("#market-list").innerHTML = shown.length ? shown.map((m) => {
      const i = items.indexOf(m), isRead = read[m.link];
      const zh = m.titleZh && m.titleZh !== m.title;
      return `
      <article class="card ${isRead ? "read" : ""}">
        <div class="meta"><span class="src-name">${esc(m.source)}</span><span>${esc(m.date)}</span></div>
        <h3>${ext(m.link, esc(zh ? m.titleZh : m.title))}</h3>
        ${zh ? `<p class="orig">${esc(m.title)}</p>` : ""}
        ${m.takeaway ? `<p class="insight">${esc(m.takeaway)}</p>` : m.excerpt ? `<p class="excerpt">${esc(m.excerpt)}</p>` : ""}
        <div class="card-foot"><button class="btn ${isRead ? "on" : ""}" data-read="${i}">${isRead ? "已讀 ✓" : "標記已讀"}</button></div>
      </article>`;
    }).join("") : `<p class="empty">這個主題今天沒有新文章。</p>`;
  }
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
        <div class="card-foot">${(p.fields || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}${p.course ? `<span class="tag line">${esc(p.course)}</span>` : ""}</div>
      </article>`;
    $("#papers-list").innerHTML = sems.map((s, i) => {
      const list = shown.filter((p) => p.semester === s);
      return `
      <div class="term reveal">
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
    $("#notes-meta").textContent = `${notes.length} 則・同步自 Notion ${CD.notesSynced || ""}`;
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
        <div class="meta"><span class="tag">${esc(f.cat)}</span><span>${esc(f.org)}</span></div>
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
    store.set("cd-funding", mine); renderFunding();
  });

  /* ---------- 頁尾 ---------- */
  $("#footer-links").innerHTML = (P.links || []).map((l) => ext(l.url, esc(l.label))).join("　·　");
  $("#credits").innerHTML = "動漫主視覺外連自各作品官方網站，版權屬原作者與製作委員會：" + themes.map((t) => ext(t.sourceUrl, esc(t.name))).join("、");

  /* ---------- 導覽列高亮 ---------- */
  const links = [...document.querySelectorAll(".nav a")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id)); });
  }, { rootMargin: "-40% 0px -55% 0px" });
  ["brief", "market", "papers", "notes", "funding"].forEach((id) => io.observe(document.getElementById(id)));

  renderBento(); renderBrief(); renderMarket(); renderPapers(); renderNotes(); renderFunding();

  /* ---------- 動畫（GSAP + ScrollTrigger；沒載到或使用者關閉動態時直接顯示） ---------- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (window.gsap && !reduce) {
    const gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".eyebrow", { y: 16, opacity: 0, duration: .6 })
      .from("#hero-name .w", { yPercent: 60, opacity: 0, duration: 1, stagger: .12 }, "-=.3")
      .from([".hero-role", ".hero-line", ".hero-cta"], { y: 20, opacity: 0, duration: .7, stagger: .1 }, "-=.6")
      .from(".kv-frame", { clipPath: "inset(100% 0 0 0 round 999px 999px 28px 28px)", duration: 1.2, ease: "power4.inOut" }, 0.2)
      .from(".kv figcaption", { opacity: 0, duration: .6 }, "-=.4");
    if (window.ScrollTrigger) {
      gsap.to(".kv-frame img", { yPercent: 8, scale: 1.08, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.from(el, { y: 36, opacity: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
      document.querySelectorAll("[data-count]").forEach((el) => {
        const n = +el.dataset.count, obj = { v: 0 };
        gsap.to(obj, { v: n, duration: 1.4, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(obj.v)), scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });
    }
  }
})();
