// 動漫主題：配色寫在 styles.css 的 [data-theme="..."]，這裡放名稱、主視覺、標語
// 主視覺直接外連各作品官方網站（不存進 repo），版權屬原作者；官方換網址時會自動退回漸層背景
// 標語是自己寫的，不引用原作台詞
window.CD = window.CD || {};
window.CD.themes = [
  {
    id: "frieren", name: "葬送的芙莉蓮", short: "芙莉蓮", motif: "✿",
    img: "https://frieren-anime.jp/wp-content/themes/frieren_2023/assets/img/top/top/8_visual.jpg",
    pos: "50% 30%",
    source: "葬送的芙莉蓮 官方網站", sourceUrl: "https://frieren-anime.jp/",
    tagline: "知識像魔法一樣，慢慢收集，總有一天會派上用場。",
    hero: "旅途很長，今天先讀一點。"
  },
  {
    id: "rezero", name: "Re:從零開始的異世界生活", short: "RE:0", motif: "❄",
    img: "https://re-zero-anime.jp/tv/assets/top/main-tv4b.webp",
    pos: "50% 25%",
    source: "Re:從零開始的異世界生活 官方網站", sourceUrl: "https://re-zero-anime.jp/",
    tagline: "每一次重來都不是白費——把昨天的教訓，變成今天的判斷。",
    hero: "從零開始也沒關係，今天再往前一步。"
  },
  {
    id: "oshinoko", name: "我推的孩子", short: "我推", motif: "★",
    img: "https://ichigoproduction.com/core_sys/images/banner/00000007.jpg",
    pos: "50% 20%",
    source: "【我推的孩子】官方網站", sourceUrl: "https://ichigoproduction.com/",
    tagline: "舞台上的光很亮，但真正的功夫都在後台的每一天。",
    hero: "今天也要閃閃發亮地做研究。"
  },
  {
    id: "makeine", name: "敗北女角太多了！", short: "敗北女角", motif: "☀",
    img: "https://makeine-anime.com/assets/img/top/main/img_visual07.jpg",
    pos: "50% 30%",
    source: "敗北女角太多了！ 官方網站", sourceUrl: "https://makeine-anime.com/",
    tagline: "輸了一次也還是夏天。整理好心情，下一輪再上場。",
    hero: "沒抽中也沒關係，夏天還很長。"
  }
];
