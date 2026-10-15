// 把 FinTech Lab 的筆記與行事曆複製成公開網站用的資料：node sync.js
// - data/notes.js：Notion 筆記（去掉內文 body，只留卡片要用的欄位）
// - data/lab.js：實驗室行事曆（去掉 note 欄位，避免公開同學名字與群組對話）
const fs = require("fs");
const path = require("path");
const hub = path.join(__dirname, "..", "fintech-hub", "data");

function load(file) {
  const window = {};
  new Function("window", fs.readFileSync(path.join(hub, file), "utf8"))(window);
  return window.FT || {};
}
const out = (file, header, body) =>
  fs.writeFileSync(path.join(__dirname, "data", file), `${header}\nwindow.CD = window.CD || {};\n${body}\n`);

const n = load("notes.js");
const notes = (n.notes || []).map(({ body, ...rest }) => rest);
out("notes.js", "// Notion 筆記同步副本，由 node sync.js 從 fintech-hub/data/notes.js 產生，請不要直接改",
  `window.CD.notionDb = ${JSON.stringify(n.notionDb || "")};\nwindow.CD.notesSynced = ${JSON.stringify(n.notesSynced || "")};\nwindow.CD.notes = ${JSON.stringify(notes, null, 2)};`);

const e = load("events.js");
const lab = (e.events || []).map(({ note, ...rest }) => rest);
out("lab.js", "// 實驗室行事曆公開版，由 node sync.js 從 fintech-hub/data/events.js 產生（已去掉 note 欄位）",
  `window.CD.labUpdated = ${JSON.stringify(e.eventsUpdated || "")};\nwindow.CD.lab = ${JSON.stringify(lab, null, 2)};`);

console.log(`notes ${notes.length} 則、lab ${lab.length} 筆已更新`);
