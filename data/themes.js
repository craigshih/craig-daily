// 動漫主題：每天自動輪替一部（app.js 依日期挑），主視覺在當天的多張圖之間輪播
// 圖片直接外連各作品官方網站（不存進 repo），版權屬原作者；官方換網址時會自動跳過載入失敗的圖
// palette 是四個霓虹色，用在漸層字、光暈、mo.js 爆破動畫；bg / bg2 是深色底
// 標語是自己寫的，不引用原作台詞
window.CD = window.CD || {};
(function () {
  const fr = (n) => `https://frieren-anime.jp/wp-content/themes/frieren_2023/assets/img/top/top/${n}_visual.jpg`;
  const rz = (x) => `https://re-zero-anime.jp/tv/assets/top/main-tv4${x}.webp`;
  const os = (n) => `https://ichigoproduction.com/core_sys/images/banner/000000${n}.jpg`;
  const mk = (n) => `https://makeine-anime.com/assets/img/top/main/img_visual${n}.jpg`;

  window.CD.themes = [
    {
      id: "frieren", name: "葬送的芙莉蓮", short: "芙莉蓮", motif: "✿",
      images: [fr(8), fr(1), fr(4), fr(3), fr(9), fr(6), fr(7), fr(12)],
      palette: ["#7ee0b5", "#ffd36e", "#b9a6ff", "#7cc7ff"], bg: "#0b161b", bg2: "#132630",
      source: "葬送的芙莉蓮 官方網站", sourceUrl: "https://frieren-anime.jp/",
      tagline: "知識像魔法一樣，慢慢收集，總有一天會派上用場。",
      hero: "旅途很長，今天先讀一點。"
    },
    {
      id: "rezero", name: "Re:從零開始的異世界生活", short: "RE:0", motif: "❄",
      images: [rz("b"), rz("a"), rz("e"), rz("g"), rz("d"), rz("c"), rz("f")],
      palette: ["#6fb6ff", "#ff8fd1", "#c4a4ff", "#9ff0ff"], bg: "#090e2a", bg2: "#141b48",
      source: "Re:從零開始的異世界生活 官方網站", sourceUrl: "https://re-zero-anime.jp/",
      tagline: "每一次重來都不是白費——把昨天的教訓，變成今天的判斷。",
      hero: "從零開始也沒關係，今天再往前一步。"
    },
    {
      id: "oshinoko", name: "我推的孩子", short: "我推", motif: "★",
      images: [os("07"), os("10"), os("09"), os("08")],
      palette: ["#ff4fa3", "#ffd84d", "#7b6bff", "#4ff0ff"], bg: "#140720", bg2: "#22103a",
      source: "【我推的孩子】官方網站", sourceUrl: "https://ichigoproduction.com/",
      tagline: "舞台上的光很亮，但真正的功夫都在後台的每一天。",
      hero: "今天也要閃閃發亮地做研究。"
    },
    {
      id: "makeine", name: "敗北女角太多了！", short: "敗北女角", motif: "☀",
      images: [mk("07"), mk("03"), mk("08"), mk("04"), mk("09"), mk("05")],
      palette: ["#ff8a3d", "#2fd3ff", "#ffe14d", "#ff5f7e"], bg: "#06182a", bg2: "#0e2a45",
      source: "敗北女角太多了！ 官方網站", sourceUrl: "https://makeine-anime.com/",
      tagline: "輸了一次也還是夏天。整理好心情，下一輪再上場。",
      hero: "沒抽中也沒關係，夏天還很長。"
    }
  ];
})();
