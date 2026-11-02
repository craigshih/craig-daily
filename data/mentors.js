// 業師・職涯資源：以政大商學院 OSAAS（osaas.commerce.nccu.edu.tw）為主要來源，每週手動更新一次（說「跑業師雷達」）
// cat：商學院／職涯中心／校內其他／校外（網站的篩選按鈕依這欄自動產生）
// 每筆：regStart / regEnd 為報名期間（YYYY-MM-DD，可留空）；status: "tbd" 代表下一梯次還沒公布
// grad：碩士生能不能參加（"可"／"優先"／"待確認"）；fintech：1–3，跟金融科技的關聯度
// regEnd 有填的會顯示倒數，也會自動出現在私人行事曆；verify: true 代表二手資料，報名前請看官方公告
window.CD = window.CD || {};
window.CD.mentorsUpdated = "2026-11-02";
window.CD.mentors = [
  {
    id: "osaas-counseling", cat: "商學院", name: "一對一職涯諮詢",
    org: "商學院 OSAAS", grad: "可", fintech: 3,
    regStart: "2026-11-02", regEnd: "2026-12-11", when: "諮詢期間 11/15–12/12・每次 40 分鐘・商院 8F",
    what: "政大商學院校友顧問一對一諮詢。報名後 3 個工作天內要到 818 室繳 300 元保證金，出席後退還；爽約會被停權。",
    who: "郭信宏（蝦皮金流）、張喆（Microsoft 雲端與 AI，曾任職花旗）、傅肇弘（PIMCO）、李青洋（瑞銀）、許維浩（創投）、彭怡翔（Gogolook）、王任澤（Ogilvy 數據）",
    contact: "陳助教 02-2939-3091 #88826・osaas@nccu.edu.tw",
    link: "https://osaas.commerce.nccu.edu.tw/counseling"
  },
  {
    id: "cd-consultant", cat: "職涯中心", name: "業師諮詢面對面",
    org: "政大職涯中心", grad: "可", fintech: 1,
    regEnd: "2026-11-06", when: "諮詢日 11/11 10:00–17:00・行政大樓・25 分鐘",
    what: "免費一對一，每人限 1 場；爽約會被取消之後的資格。這一梯的業師沒有人標明金融背景。",
    link: "https://cd.nccu.edu.tw/career_consultant"
  },
  {
    id: "sinopac-fintech", cat: "校外", name: "永豐銀行金融科技創新競賽",
    org: "永豐銀行", grad: "可", fintech: 3,
    regEnd: "2026-11-04", when: "11/4（三）14:00–17:30・2–10 人一隊",
    what: "能和永豐主管、評審交流並拿到回饋；最高獎金 5 萬，得獎可免書審參加永豐 MA/PA 徵選。報名截止日要看 Cake 頁面。",
    contact: "osaas@nccu.edu.tw", link: "https://www.cake.me/campaigns/banksinopac-competition"
  },
  {
    id: "ai-internship", cat: "職涯中心", name: "AI 課程實習「生成式 AI 應用專題」",
    org: "政大職涯中心・應數系", grad: "可", fintech: 3, status: "tbd",
    when: "115-2 說明會還沒公告（114-2 是 11/18 辦）・3 學分",
    what: "企業出題、學生組隊做 AI 專案；114-2 合作企業有國泰金控、中國信託、富邦人壽、凱基。",
    contact: "02-2939-3091 #63297／#63257", link: "https://cd.nccu.edu.tw/ai_course_internship"
  },
  {
    id: "ctbc-8schools", cat: "校內其他", name: "中信 × 八校聯盟 金融科技趨勢與創新課程",
    org: "政大金融科技研究中心・中信金控", grad: "待確認", fintech: 3, status: "tbd",
    when: "2026 年是春季學期開課・115-2 是否開課待確認",
    what: "中信會指派企業導師，還有提案競賽；表現好的學生有機會到中信實習。",
    contact: "政大金融科技研究中心", link: "https://www.businesstoday.com.tw/article/category/183017/post/202603190038/", verify: true
  },
  {
    id: "taipei-youth", cat: "校外", name: "臺北青年職涯諮詢＋職涯進修補助",
    org: "臺北市青年局", grad: "可", fintech: 1,
    regEnd: "2026-11-30", when: "補助每年 1/10–11/30 受理・申請前要先完成職涯諮詢",
    what: "18 到未滿 30 歲、設籍臺北市 6 個月以上；課程學費最高補助 1 萬元。",
    link: "https://www.yourator.co/articles/801?locale=en", verify: true
  },
  {
    id: "esg-internship", cat: "職涯中心", name: "ESG 跨領域實習課程",
    org: "政大職涯中心", grad: "可", fintech: 2, status: "tbd",
    when: "3 學分・大三以上含碩士生",
    what: "上一輪的金融業職缺是南山人壽。",
    link: "https://cd.nccu.edu.tw/esg_course_internship"
  },
  {
    id: "domestic-internship", cat: "職涯中心", name: "政植計畫國內實習",
    org: "政大職涯中心", grad: "可", fintech: 2,
    when: "職缺不定期上架",
    what: "有政大限定的實習職缺。",
    contact: "02-2939-3091 #63297", link: "https://cd.nccu.edu.tw/domestic_internship/collaboration_job"
  },
  {
    id: "youth-career", cat: "校外", name: "台灣就業通「YOUTH 職涯」線上諮詢",
    org: "勞動部", grad: "可", fintech: 1,
    when: "隨時線上預約",
    what: "職涯顧問線上一對一諮詢，免費。",
    contact: "02-8995-6000", link: "https://www.mol.gov.tw/1607/1632/1633/86334/"
  },
  {
    id: "adplist", cat: "校外", name: "ADPList 線上 mentor",
    org: "ADPList", grad: "可", fintech: 2,
    when: "隨時預約・線上視訊",
    what: "免費的國際 mentor 平台，台灣約 97 位以上 mentor；以設計、產品、工程為主，金融科技 mentor 要在平台上自己搜尋。",
    link: "https://adplist.org/mentors/location/taiwan"
  },
  {
    id: "osaas-mentor", cat: "商學院", name: "商學院企業導師計畫",
    org: "商學院 OSAAS・EMBA 校友會", grad: "優先", fintech: 3,
    regStart: "2026-09-16", regEnd: "2026-10-04", when: "計畫期間 10 月–隔年 6 月・下一屆推估 2027 年 9 月中報名",
    what: "8 位 EMBA 校友導師各帶 6–10 人，有企業參訪、座談和面談。115 學年金融導師有 4 位，另有資訊科技、軟體各 1 位。已錄取財管系或 MBA 企業導師計畫的人不能重複申請。",
    contact: "osaas@nccu.edu.tw・02-2939-3091", link: "https://osaas.commerce.nccu.edu.tw/mentor"
  },
  {
    id: "career-month", cat: "職涯中心", name: "政大徵才月",
    org: "政大職涯中心", grad: "可", fintech: 2, status: "tbd",
    when: "每年春季",
    what: "企業說明會、職涯講座、徵才博覽會。",
    link: "https://cd.nccu.edu.tw/career_month"
  },
  {
    id: "overseas-subsidy", cat: "職涯中心", name: "海外實習補助",
    org: "政大職涯中心", grad: "待確認", fintech: 1,
    regEnd: "2027-05-31", when: "每年 5/31 前申請・需連續實習 30 天以上",
    what: "金額，以及碩士生能不能申請，頁面都沒寫。",
    contact: "02-2939-3091 #63257", link: "https://cd.nccu.edu.tw/overseas_internship/scholarships"
  },
  {
    id: "sherolab", cat: "校內其他", name: "英雄實驗室（師徒制）",
    org: "政大 X 實驗學院", grad: "待確認", fintech: 1, status: "tbd",
    when: "「114學年度 學生登錄系統」已停止收件",
    what: "約 30 位業師的師徒制；頁面只寫「設籍 NCCU」，研究生能不能參加要再確認。",
    contact: "yenchenh@nccu.edu.tw・02-2939-3091 #62605", link: "https://sherolab.nccu.edu.tw"
  }
];

// OSAAS 最新公告（每週更新時重抓 /news 前 2–3 頁，只留跟職涯、實習、說明會有關的；end 過了網站會自動隱藏）
window.CD.osaasNews = [
  { title: "花旗銀行 2027 暑期實習＆儲備主管計畫", kind: "徵才", end: "2026-11-27", link: "https://osaas.commerce.nccu.edu.tw/news/view/543" },
  { title: "商學院 × P&G 寶僑家品 校園徵才說明會", kind: "說明會", end: "2026-11-23", link: "https://osaas.commerce.nccu.edu.tw/news/view/546" },
  { title: "2027 法藍瓷年度 CSR 專案實習生", kind: "徵才", end: "2026-11-19", link: "https://osaas.commerce.nccu.edu.tw/news/view/545" },
  { title: "2027 貝萊德人才培育實習計畫", kind: "徵才", end: "2026-11-13", link: "https://osaas.commerce.nccu.edu.tw/news/view/537" },
  { title: "商學院 × 裕隆集團新鑫公司 校園徵才說明會", kind: "說明會", end: "2026-11-12", link: "https://osaas.commerce.nccu.edu.tw/news/view/541" },
  { title: "商學院 × 遠東新世紀 校園說明會", kind: "說明會", end: "2026-11-11", link: "https://osaas.commerce.nccu.edu.tw/news/view/540" },
  { title: "2027 星展儲備幹部計畫", kind: "徵才", end: "2026-11-08", link: "https://osaas.commerce.nccu.edu.tw/news/view/548" },
  { title: "2027 安永旺季實習", kind: "徵才", end: "2026-11-08", link: "https://osaas.commerce.nccu.edu.tw/news/view/542" },
  { title: "資誠 2027 旺季工讀生招募", kind: "徵才", end: "2026-11-06", link: "https://osaas.commerce.nccu.edu.tw/news/view/547" },
  { title: "2027 GU 全球儲備菁英計畫", kind: "徵才", end: "2026-11-30", link: "https://osaas.commerce.nccu.edu.tw/news/view/539" },
  { title: "中國信託 Rising Star 學期實習計畫", kind: "徵才", end: "2027-02-28", link: "https://osaas.commerce.nccu.edu.tw/news/view/523" },
  { title: "星展儲備幹部實習計畫（學期實習制）", kind: "徵才", end: "2027-01-31", link: "https://osaas.commerce.nccu.edu.tw/news/view/522" }
];

// 學分／專長學程：只放碩士生（科智所，屬商學院）能申請的；ineligible 是查過只收學士班的，unchecked 是還沒查資格的
// 欄位同上：regStart / regEnd / status: "tbd"；credits 學分數；fit 1–3 跟目前規劃（金融科技 × 供應鏈 × 行銷）的契合度
window.CD.programs = [
  {
    id: "p-fintech", name: "金融科技專長學程", org: "商學院・金融科技研究中心", school: "商學院",
    credits: "21 學分（舊報導，待確認）", grad: "可", fit: 3, status: "tbd",
    when: "115-2 申請時程待確認", what: "跨資訊、資管、財管、金融、統計等系所開課，會結合業界提供實習機會。",
    link: "https://stat.nccu.edu.tw/uploads/asset/data/66ada370311fc8225895c7fe/6-3%E5%9C%8B%E7%AB%8B%E6%94%BF%E6%B2%BB%E5%A4%A7%E5%AD%B8%E9%87%91%E8%9E%8D%E7%A7%91%E6%8A%80%E5%B0%88%E9%95%B7%E5%AD%B8%E7%A8%8B.pdf", verify: true
  },
  {
    id: "p-scm", name: "供應鏈管理專長學程（碩士班）", org: "商學院", school: "商學院",
    credits: "9 學分（五門選三）", grad: "可（全校碩一、碩二）", fit: 3, status: "tbd",
    when: "115 學年報名已在 6/29 截止，可以問 115-2 能不能補申請",
    what: "課程有作業管理、策略性生產與作業管理、供應鏈整合、供應鏈管理實務、供應鏈管理，五門選三。",
    perks: "學程生可申請大聯大獎學金 10 萬元，附大聯大控股實習；每年第二學期公告，大學部、碩士班各 1 名。",
    contact: "scm@nccu.edu.tw", link: "https://commerce.nccu.edu.tw/zh_tw/feature/feature6/DProgram2"
  },
  {
    id: "p-sustain", name: "企業永續經營與永續金融專長學程", org: "商學院", school: "商學院",
    credits: "待確認", grad: "商學院碩士生可", fit: 3, status: "tbd",
    when: "每年 4 月中–5 月下旬報名（2026 年是 4/13–5/22），6 月公布錄取",
    what: "永續金融和金融科技互補，ESG 也能接上原本的研究方向。資格寫「本校大學部及商學院碩士生」，送件前跟承辦人確認。",
    link: "https://sp.nccu.edu.tw/"
  },
  {
    id: "p-marketing", name: "行銷學程（碩士班）", org: "企管系", school: "商學院",
    credits: "18 學分（必修行銷管理、消費者行為、行銷研究）", grad: "可（各系所碩士班）", fit: 2, status: "tbd",
    when: "每學期初受理，最快 115-2（2027 年 2 月）",
    what: "選修有數位與社群媒體行銷、大數據品牌行銷、Google 數位行銷，廣告背景最好上手。結業要學分平均 80 分以上，還要參加 5 場行銷演講。",
    link: "https://ba.nccu.edu.tw/zh_tw/Programs/Programs102/SCMPROG108"
  },
  {
    id: "p-ccis", name: "創新與創造力學分學程", org: "創新與創造力研究中心", school: "其他學院",
    credits: "15 學分（必修「X 創業家」）", grad: "可（學士班、碩士班，不分院系）", fit: 2, status: "tbd",
    when: "每年 10 月招生；115 學年的招生公告還沒找到，可能剛截止",
    what: "每學年約收 40 人；群修「跨界專題–X 計畫」或「新媒體與創業」擇一。",
    contact: "ccis@nccu.edu.tw・02-2939-3091 #65771", link: "https://ccis.nccu.edu.tw/PageDoc?fid=13582"
  }
];
window.CD.programsIneligible = [
  { name: "創新創業學程", org: "商院創新創業辦公室", link: "https://oie.nccu.edu.tw/program/about" },
  { name: "營運與供應鏈管理學程", org: "企管系", link: "https://ba.nccu.edu.tw/zh_tw/programs/Programs105" },
  { name: "巨量資料分析學程", org: "統計系", link: "https://stat.nccu.edu.tw/zh_tw/Program/BigData/programmethod2" }
];
window.CD.programsUnchecked = [
  { name: "商業分析微學程", org: "國貿系", link: "https://ib.nccu.edu.tw/zh_tw/Programs/Microprogram/BusinessAnalysis" },
  { name: "CFA 核心學程", org: "商學院", link: "https://commerce.nccu.edu.tw/zh_tw/feature" },
  { name: "管理會計（CIMA）學程", org: "商學院", link: "https://commerce.nccu.edu.tw/zh_tw/feature" }
];
window.CD.programsSource = "https://commerce.nccu.edu.tw/zh_tw/feature";
