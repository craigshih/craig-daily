// 讀過的論文：Notion「📚 論文資料庫」的同步副本（只同步勾選「公開到網站」的）
// 資料庫：https://app.notion.com/p/674c4f06afe1450094cce11da78f4e42
// 在對話裡說「同步論文」時，由 Claude 讀資料庫（含每頁「📌 主要發現」）重寫這份檔案；請在 Notion 編輯
window.CD = window.CD || {};
window.CD.papersSynced = "2026-10-15";
window.CD.semesters = ["碩一上", "碩一下", "碩二上", "碩二下"];
window.CD.papers = [
  {
    title: "穩定幣與存款爭奪戰：動機事實與未解問題",
    authors: "", year: null, venue: "", link: "",
    fields: ["金融科技", "財務與金融"],
    semester: "碩一上", type: "文獻回顧", uses: ["碩士論文", "實驗室專案"], course: "",
    status: "📖 閱讀中", rating: "⭐⭐",
    takeaway: "在美國 GENIUS 法案架構下，穩定幣透過分銷商獎勵與銀行牌照兩條路侵蝕銀行存款，真正的存款分流要等支付與理財場景普及才會浮現。",
    highlights: [
      "法案禁止發行商付息，但分銷平台用儲備金分潤發 3%–5% 獎勵，形成實質存款競價。",
      "威脅同時來自收益率與服務邊際（信託牌照、聯準會結算帳戶）。",
      "存款若大量轉向穩定幣，銀行將失去低成本資金、削弱實體放款。"
    ],
    readDate: ""
  }
];
