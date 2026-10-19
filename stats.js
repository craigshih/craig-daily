/* 量化研究入門：今日概念（每天依學習路線換一個）、我該用哪種方法、學習路線、工具、資源
 * 內容在 data/stats.js；「我懂了」的進度存在這台裝置的瀏覽器（cd-stats-learned） */
(function () {
  const K = window.CDKit;
  const CD = window.CD || {};
  if (!K || !document.getElementById("stats")) return;
  const { $, esc, store } = K;
  const concepts = CD.statsConcepts || [], stages = CD.statsStages || [], picker = CD.statsPicker || [];
  if (!concepts.length) return;

  const ext = (href, text, cls = "") => `<a ${cls ? `class="${cls}" ` : ""}href="${esc(href)}" target="_blank" rel="noopener">${text}</a>`;
  const byId = Object.fromEntries(concepts.map((c, i) => [c.id, i]));
  const stageOf = (id) => stages.find((s) => s.id === id) || {};

  // 從 2026-10-18 開始，每天依路線順序換一個概念，學完一輪再從頭複習
  const now = new Date();
  const dayNo = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(2026, 9, 18)) / 864e5);
  const todayIdx = ((dayNo % concepts.length) + concepts.length) % concepts.length;
  let viewIdx = todayIdx;
  let quizPick = null;
  let pickPath = [];

  const learned = () => store.get("cd-stats-learned", {});
  function toggleLearned(id) {
    const l = learned();
    if (l[id]) delete l[id]; else l[id] = new Date().toISOString().slice(0, 10);
    store.set("cd-stats-learned", l);
  }

  /* ---------- 今日概念 ---------- */
  function renderToday() {
    const c = concepts[viewIdx], st = stageOf(c.stage), l = learned();
    const isToday = viewIdx === todayIdx;
    const q = c.quiz || {};
    $("#stats-today").innerHTML = `
      <div class="st-top">
        <span class="st-badge">${isToday ? "今日概念" : "概念"}・${viewIdx + 1} / ${concepts.length}</span>
        <span class="st-stage">階段 ${c.stage}｜${esc(st.title || "")}</span>
        <span class="st-nav">
          <button class="btn" data-go="-1" aria-label="上一個概念">‹</button>
          ${isToday ? "" : `<button class="btn" data-go="today">回到今天</button>`}
          <button class="btn" data-go="1" aria-label="下一個概念">›</button>
        </span>
      </div>
      <h3 class="st-title">${esc(c.zh)}<small>${esc(c.en)}</small></h3>
      <p class="st-one">${esc(c.one)}</p>
      <div class="st-grid">
        <div class="st-box"><b>白話解釋</b><p>${esc(c.explain)}</p></div>
        <div class="st-box"><b>商管例子</b><p>${esc(c.example)}</p></div>
        <div class="st-box warn"><b>常見誤解</b><p>${esc(c.myth)}</p></div>
        <div class="st-box paper-line"><b>論文裡會這樣寫</b><p>${esc(c.paper)}</p></div>
      </div>
      ${q.q ? `<div class="st-quiz">
        <b>小測驗</b><p>${esc(q.q)}</p>
        <div class="st-opts">${q.options.map((o, i) => {
          const cls = quizPick == null ? "" : i === q.answer ? "right" : i === quizPick ? "wrong" : "dim";
          return `<button class="st-opt ${cls}" data-opt="${i}" ${quizPick != null ? "disabled" : ""}>${esc(o)}</button>`;
        }).join("")}</div>
        ${quizPick != null ? `<p class="st-why ${quizPick === q.answer ? "ok" : ""}">${quizPick === q.answer ? "答對了！" : "再想想："}${esc(q.why)}</p>` : ""}
      </div>` : ""}
      <div class="st-foot">
        <button class="pill ${l[c.id] ? "solid" : ""}" data-learn="${c.id}">${l[c.id] ? "✓ 已經懂了" : "我懂了"}</button>
        <span>${isToday ? "明天會換下一個概念" : `今天的概念是「${esc(concepts[todayIdx].zh)}」`}</span>
      </div>`;
  }

  /* ---------- 我該用哪種方法 ---------- */
  function renderPicker() {
    const box = $("#stats-picker");
    const head = `<div class="sp-head"><b>我該用哪種統計方法？</b>${pickPath.length ? `<button class="btn" data-pick="reset">重新選</button>` : ""}</div>`;
    if (!pickPath.length) {
      box.innerHTML = head + `<p class="sp-q">你想回答哪一種問題？</p>
        <div class="sp-opts">${picker.map((p, i) => `<button class="sp-opt" data-pick="${i}"><span>${esc(p.q)}</span><small>${esc(p.hint || "")}</small></button>`).join("")}</div>`;
      return;
    }
    const top = picker[pickPath[0]];
    if (pickPath.length === 1) {
      box.innerHTML = head + `<p class="sp-crumb">${esc(top.q)}</p><p class="sp-q">再細一點：</p>
        <div class="sp-opts">${top.next.map((n, i) => `<button class="sp-opt" data-pick="${i}"><span>${esc(n.q)}</span></button>`).join("")}</div>`;
      return;
    }
    const leaf = top.next[pickPath[1]], a = leaf.a;
    box.innerHTML = head + `<p class="sp-crumb">${esc(top.q)} › ${esc(leaf.q)}</p>
      <div class="sp-answer">
        <p class="sp-name">${esc(a.name)}</p>
        <p>${esc(a.when)}</p>
        <p class="sp-check"><b>記得檢查</b>${esc(a.check)}</p>
        <p class="sp-how"><b>jamovi</b><span>${esc(a.jamovi)}</span></p>
        <p class="sp-how"><b>R</b><code>${esc(a.r)}</code></p>
        <div class="sp-concepts">${(a.concepts || []).filter((id) => id in byId).map((id) => `<button class="btn" data-concept="${id}">複習：${esc(concepts[byId[id]].zh)}</button>`).join("")}</div>
      </div>`;
  }

  /* ---------- 學習路線 ---------- */
  function renderRoad() {
    const l = learned(), cur = concepts[todayIdx].stage;
    $("#stats-road").innerHTML = stages.map((s) => {
      const list = concepts.filter((c) => c.stage === s.id);
      const done = list.filter((c) => l[c.id]).length;
      return `<article class="sr-stage ${s.id === cur ? "now" : ""} ${done === list.length ? "done" : ""}">
        <div class="sr-head"><span class="sr-num">STAGE ${s.id}</span><span class="sr-time">${esc(s.time)}</span></div>
        <h4>${esc(s.title)}</h4>
        <p class="sr-goal">${esc(s.goal)}</p>
        <div class="sr-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${list.length}" aria-valuenow="${done}"><i style="width:${(done / list.length) * 100}%"></i></div>
        <p class="sr-count">已懂 ${done} / ${list.length}${s.id === cur ? "・今天在這一階段" : ""}</p>
        <div class="sr-chips">${list.map((c) => `<button class="sr-chip ${l[c.id] ? "on" : ""} ${byId[c.id] === viewIdx ? "view" : ""}" data-concept="${c.id}">${l[c.id] ? "✓ " : ""}${esc(c.zh)}</button>`).join("")}</div>
      </article>`;
    }).join("");
  }

  function renderMeta() {
    const n = Object.keys(learned()).filter((id) => id in byId).length;
    $("#stats-meta").textContent = `已懂 ${n} / ${concepts.length} 個概念・每天一個新概念・進度存在這台裝置`;
  }

  function renderStatic() {
    $("#stats-tools").innerHTML = (CD.statsTools || []).map((t) => `
      <article class="card stool">
        <div class="meta"><span class="tag ${t.kind === "點選式" ? "hot" : "alt"}">${esc(t.kind)}</span>${t.os ? `<span class="tag os ${/Windows/.test(t.os) && !/Mac/.test(t.os) ? "win" : ""}">${esc(t.os)}</span>` : ""}<span>${esc(t.cost)}</span></div>
        <h3>${ext(t.link, esc(t.name))}</h3>
        <p class="stool-level">${esc(t.level)}</p>
        <p>${esc(t.desc)}</p>
      </article>`).join("");
    $("#stats-res").innerHTML = (CD.statsResources || []).map((g) => `
      <div class="sres-group"><h4>${esc(g.group)}</h4>
        <ul>${g.items.map((r) => `<li>${ext(r.link, esc(r.name))}<span>${esc(r.note)}</span></li>`).join("")}</ul>
      </div>`).join("");
  }

  function renderAll() { renderMeta(); renderToday(); renderPicker(); renderRoad(); }

  function show(idx, scroll) {
    viewIdx = (idx + concepts.length) % concepts.length;
    quizPick = null;
    renderToday(); renderRoad();
    if (scroll) $("#stats-today").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- 互動 ---------- */
  $("#stats").addEventListener("click", (e) => {
    const t = e.target;
    const go = t.closest("[data-go]");
    if (go) return show(go.dataset.go === "today" ? todayIdx : viewIdx + +go.dataset.go);
    const opt = t.closest("[data-opt]");
    if (opt && quizPick == null) {
      quizPick = +opt.dataset.opt;
      renderToday();
      if (quizPick === concepts[viewIdx].quiz.answer) K.burstAt(opt, 0.5, 0.5);
      return;
    }
    const learn = t.closest("[data-learn]");
    if (learn) {
      const was = !!learned()[learn.dataset.learn];
      toggleLearned(learn.dataset.learn);
      renderAll();
      if (!was) K.burstAt($("#stats-today .st-foot .pill"), 0.5, 0.5);
      return;
    }
    const concept = t.closest("[data-concept]");
    if (concept) return show(byId[concept.dataset.concept], true);
    const pick = t.closest("[data-pick]");
    if (pick) {
      if (pick.dataset.pick === "reset") pickPath = [];
      else pickPath.push(+pick.dataset.pick);
      return renderPicker();
    }
  });

  renderStatic();
  renderAll();
})();
