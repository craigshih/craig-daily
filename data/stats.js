// 量化研究入門：統計概念、學習路線、選方法、工具與資源（手動整理，給統計新手的商管研究生）
// 「今日概念」每天依路線順序換一個（app 端依日期計算，不用排程）；學會的概念存在瀏覽器
window.CD = window.CD || {};

window.CD.statsStages = [
  { id: 1, title: "資料與描述統計", time: "約 2 週", goal: "看得懂一份資料：有哪些變數、大概長什麼樣子、怎麼用幾個數字描述它。" },
  { id: 2, title: "機率與抽樣", time: "約 2 週", goal: "理解為什麼用「一部分人」的資料可以推論「全部的人」，以及這中間的不確定性。" },
  { id: 3, title: "推論統計與檢定", time: "約 3 週", goal: "會判斷「差異是真的還是運氣」，並且知道 p 值、效果量、樣本數各代表什麼。" },
  { id: 4, title: "相關與迴歸", time: "約 3 週", goal: "會用迴歸分析同時看多個因素對結果的影響——這是量化研究最核心的工具。" },
  { id: 5, title: "問卷研究與量表", time: "約 4 週", goal: "商管碩論最常見的路線：設計量表、檢驗信效度、跑中介調節與結構方程模型。" },
  { id: 6, title: "因果推論與次級資料", time: "進階・持續學", goal: "用公司、市場、政策等現成資料，盡量逼近「X 造成 Y」的因果結論。" }
];

window.CD.statsConcepts = [
  /* ---------- 1 資料與描述統計 ---------- */
  {
    id: "scales", stage: 1, zh: "變數與測量尺度", en: "Levels of measurement",
    one: "先分清楚手上的資料是「分類」還是「數字」，才知道能用哪些統計方法。",
    explain: "名目尺度只是分類（產業別、性別）；順序尺度有大小順序但間距不一定相等（名次、教育程度）；等距與比率尺度是真正的數字，可以加減（溫度、營收、年資）。比率尺度有真正的零點，所以可以說「兩倍」。",
    example: "問卷裡的「1 非常不同意～5 非常同意」嚴格來說是順序尺度，但商管研究通常把多題加總或平均後當成連續變數分析。",
    myth: "把產業代碼 1、2、3 拿去算平均——代碼只是標籤，平均出來的 2.1 沒有意義。",
    paper: "本研究之依變數為月營收（比率尺度），自變數包含產業別（名目尺度，以虛擬變數處理）。",
    quiz: { q: "「員工所屬部門（行銷、財務、研發）」屬於哪一種尺度？", options: ["名目尺度", "順序尺度", "比率尺度"], answer: 0, why: "部門只是分類，沒有大小順序，所以是名目尺度。" }
  },
  {
    id: "central", stage: 1, zh: "平均數、中位數、眾數", en: "Mean, median, mode",
    one: "用一個數字代表「一般來說大概是多少」，但三種代表值適合的情況不同。",
    explain: "平均數把所有值加總後除以個數，會被極端值拉走；中位數是排序後正中間的值，不怕極端值；眾數是出現最多次的值，類別資料也能用。",
    example: "新創公司的募資金額通常有少數超大筆，平均數會被拉高，用中位數更能代表「一般新創」募到多少。",
    myth: "以為平均數一定最能代表資料。資料很偏的時候（收入、公司規模），中位數通常更有代表性。",
    paper: "樣本企業員工人數中位數為 48 人（平均數 312 人），顯示分配呈右偏。",
    quiz: { q: "某班 10 人月薪大多 3 萬，但其中 1 人 100 萬。哪個數字最能代表「一般人」的月薪？", options: ["平均數", "中位數", "最大值"], answer: 1, why: "極端值會把平均數拉高，中位數不受影響。" }
  },
  {
    id: "spread", stage: 1, zh: "標準差與變異數", en: "Standard deviation & variance",
    one: "衡量資料「有多分散」：大家都差不多，還是差很多。",
    explain: "變異數是每個值和平均數差距的平方的平均；標準差是變異數開根號，單位跟原始資料一樣，比較好解讀。標準差越大，代表資料越分散。",
    example: "兩檔基金平均報酬都是 8%，但 A 的標準差 5%、B 的標準差 20%，B 的報酬波動大很多，風險較高。",
    myth: "只報告平均數不報告標準差。少了分散程度，讀者無法判斷平均數有多「可靠」。",
    paper: "受訪者的工作滿意度平均為 3.82（SD = 0.71，五點量表）。",
    quiz: { q: "兩組資料平均數相同，A 組標準差比 B 組大，代表？", options: ["A 組資料比較集中", "A 組資料比較分散", "A 組樣本比較多"], answer: 1, why: "標準差衡量分散程度，越大越分散，和樣本數無關。" }
  },
  {
    id: "distribution", stage: 1, zh: "分配形狀：偏態與離群值", en: "Distribution, skewness & outliers",
    one: "先畫圖看資料長怎樣，再決定要用什麼方法——這是新手最常跳過的一步。",
    explain: "直方圖可以看出資料是對稱、右偏（長尾在右邊，例如所得）還是左偏。離群值是明顯偏離其他資料的點，可能是輸入錯誤，也可能是真實但特殊的個案。",
    example: "分析電商客單價時，少數大客戶會造成嚴重右偏，常見做法是取對數（log）讓分配比較對稱。",
    myth: "看到離群值就直接刪掉。應該先查原因、說明處理方式，必要時比較刪除前後結果是否一致。",
    paper: "由於企業規模呈高度右偏，本研究以總資產取自然對數作為控制變數。",
    quiz: { q: "所得分配通常是？", options: ["左偏", "對稱", "右偏"], answer: 2, why: "大部分人所得中等，少數人非常高，形成往右延伸的長尾。" }
  },
  {
    id: "population", stage: 1, zh: "母體與樣本", en: "Population vs. sample",
    one: "母體是你真正想了解的全部對象，樣本是你實際收到資料的那一部分。",
    explain: "我們幾乎不可能調查全部對象，所以用樣本推論母體。樣本是否能代表母體（抽樣方式、回收率、誰比較願意填）會直接影響結論能不能推廣。",
    example: "想研究「台灣中小企業的數位轉型」，但只在 LINE 群組發問卷，樣本可能偏向本來就比較數位化的企業。",
    myth: "以為樣本越大就一定越能代表母體。樣本若有系統性偏誤，再大也一樣偏。",
    paper: "本研究母體為台灣上市櫃電子業公司，以 2018–2024 年共 412 家公司為研究樣本。",
    quiz: { q: "在學校發問卷調查「台灣上班族」的消費習慣，最大的問題是？", options: ["樣本數太少", "樣本無法代表母體", "問卷題目太多"], answer: 1, why: "學生不是上班族，樣本和想推論的母體不一致。" }
  },

  /* ---------- 2 機率與抽樣 ---------- */
  {
    id: "probability", stage: 2, zh: "機率與獨立事件", en: "Probability & independence",
    one: "機率描述事情發生的可能性；兩件事「獨立」代表一件事發生與否不影響另一件。",
    explain: "機率介於 0 到 1。若 A、B 獨立，同時發生的機率是兩者相乘。條件機率 P(A|B) 是「在 B 已經發生的情況下 A 的機率」，很多統計推論都建立在條件機率上。",
    example: "顧客看過廣告後的購買率是 P(購買|看過廣告)，和沒看過廣告的購買率比較，就能初步看廣告有沒有效。",
    myth: "賭徒謬誤：連開 5 次紅，就覺得下次「該開黑了」。獨立事件不會記得過去的結果。",
    paper: "在控制產業後，曾獲得政府補助的新創，三年內完成下一輪募資的條件機率為 0.42。",
    quiz: { q: "丟一枚公正的硬幣，已經連續 4 次正面，第 5 次是正面的機率？", options: ["小於 0.5", "等於 0.5", "大於 0.5"], answer: 1, why: "每次丟硬幣彼此獨立，機率仍是 0.5。" }
  },
  {
    id: "normal", stage: 2, zh: "常態分配與 z 分數", en: "Normal distribution & z-score",
    one: "最常見的鐘形分配；z 分數告訴你一個值離平均數有幾個標準差。",
    explain: "常態分配左右對稱，約 68% 的資料落在平均數 ±1 個標準差內，約 95% 落在 ±2 個（精確是 1.96）內。z =（值 − 平均數）÷ 標準差，可以把不同單位的資料放在同一把尺上比較。",
    example: "某業務員本月業績 z = 2.1，代表比平均高 2.1 個標準差，大約贏過 98% 的同事。",
    myth: "以為所有資料都是常態分配。很多商業資料（營收、點擊數）明顯偏態，需要先檢查。",
    paper: "各構念分數經標準化（z 分數）後再計算交互作用項，以降低共線性。",
    quiz: { q: "常態分配中，約有多少比例的資料落在平均數 ±2 個標準差內？", options: ["約 68%", "約 95%", "約 99.7%"], answer: 1, why: "68–95–99.7 法則：±1、±2、±3 個標準差。" }
  },
  {
    id: "se", stage: 2, zh: "抽樣分配與標準誤", en: "Sampling distribution & standard error",
    one: "如果重複抽很多次樣本，每次算出的平均數會不一樣；這些平均數的標準差就是標準誤。",
    explain: "標準差描述「個體之間」的差異，標準誤描述「估計值」的不確定性。樣本越大，標準誤越小，估計越精準。平均數的標準誤 = 標準差 ÷ √n。",
    example: "調查 100 位顧客的平均滿意度標準誤是 0.08；調查 400 位時，標準誤會降到大約一半（0.04）。",
    myth: "把標準差和標準誤搞混。迴歸結果表裡括號中的數字通常是標準誤，不是標準差。",
    paper: "表 3 括號內為穩健標準誤（robust standard errors）。",
    quiz: { q: "樣本數變成原來的 4 倍，平均數的標準誤大約會變成？", options: ["原來的 1/4", "原來的 1/2", "不變"], answer: 1, why: "標準誤 = SD ÷ √n，√4 = 2，所以變成一半。" }
  },
  {
    id: "clt", stage: 2, zh: "中央極限定理", en: "Central limit theorem",
    one: "樣本夠大時，樣本平均數的分配會接近常態——就算原始資料不是常態。",
    explain: "這是許多檢定（t 檢定、信賴區間）能用的理由。一般經驗是每組 30 筆以上就比較放心，但原始資料越偏，需要的樣本越大。",
    example: "單筆訂單金額很偏，但每天隨機抽 50 筆訂單算平均，這些「每日平均」畫出來會接近鐘形。",
    myth: "以為中央極限定理會讓「原始資料」變成常態。變成常態的是「樣本平均數的分配」。",
    paper: "由於各組樣本數皆大於 30，依中央極限定理，平均數的抽樣分配可近似常態。",
    quiz: { q: "中央極限定理說的是什麼會接近常態分配？", options: ["原始資料", "樣本平均數的分配", "母體"], answer: 1, why: "是樣本平均數（重複抽樣）的分配接近常態。" }
  },

  /* ---------- 3 推論統計與檢定 ---------- */
  {
    id: "ci", stage: 3, zh: "信賴區間", en: "Confidence interval",
    one: "用一個範圍來估計母體的值，並說明這個方法有多可靠。",
    explain: "95% 信賴區間的意思是：如果重複抽樣很多次、每次都這樣算區間，約 95% 的區間會包含真正的母體值。區間越窄，估計越精準。",
    example: "平均每月訂閱金額 95% CI 為 [320, 380] 元，比只說「平均 350 元」多提供了不確定性的資訊。",
    myth: "說「真值有 95% 機率落在這個區間」。嚴格來說，95% 描述的是「這個方法」長期的成功率。",
    paper: "教育訓練對績效的效果為 0.32（95% CI [0.12, 0.52]）。",
    quiz: { q: "其他條件不變，樣本數變大時，信賴區間會？", options: ["變寬", "變窄", "不變"], answer: 1, why: "樣本大 → 標準誤小 → 區間變窄。" }
  },
  {
    id: "hypothesis", stage: 3, zh: "假設檢定", en: "Hypothesis testing",
    one: "先假設「沒有效果」，再看資料有多不支持這個假設。",
    explain: "虛無假設（H0）通常是「沒有差異、沒有關係」；對立假設（H1）是你想證明的。檢定的邏輯是反證：如果 H0 為真，觀察到這種資料的機會很小，就拒絕 H0。",
    example: "H0：新舊兩版網頁的轉換率相同；H1：兩版轉換率不同。A/B 測試就是在做假設檢定。",
    myth: "說「接受虛無假設」。沒拒絕 H0 只代表證據不夠，不代表證明了沒有差異。",
    paper: "H1：數位轉型程度對企業績效有正向影響。",
    quiz: { q: "檢定結果「未拒絕 H0」代表？", options: ["證明兩組完全相同", "證據不足以說兩組不同", "研究失敗"], answer: 1, why: "沒拒絕 H0 只是證據不足，不等於證明 H0 為真。" }
  },
  {
    id: "pvalue", stage: 3, zh: "p 值", en: "p-value",
    one: "假設 H0 為真，看到這麼極端（或更極端）資料的機率。",
    explain: "p 值越小，代表資料和「沒有效果」越不相容。慣例用 0.05 當門檻（顯著水準 α），p < .05 稱為統計顯著。但 p 值不告訴你效果有多大、有多重要。",
    example: "A/B 測試得到 p = .003，表示如果兩版真的沒差，看到這麼大的差距的機率只有 0.3%。",
    myth: "以為 p = .03 代表「H0 為真的機率是 3%」或「結果有 97% 是對的」。兩者都是錯誤解讀。",
    paper: "數位轉型對企業績效有顯著正向影響（β = 0.21, p < .01）。",
    quiz: { q: "樣本非常大時，很小的差異也可能 p < .05。這代表？", options: ["差異一定很重要", "需要再看效果量", "檢定算錯了"], answer: 1, why: "顯著不等於重要，要搭配效果量判斷實際意義。" }
  },
  {
    id: "errors", stage: 3, zh: "型一錯誤與型二錯誤", en: "Type I & Type II errors",
    one: "型一錯誤是「沒有卻說有」，型二錯誤是「有卻說沒有」。",
    explain: "型一錯誤的機率就是顯著水準 α（通常 5%）。型二錯誤的機率是 β，1 − β 就是檢定力。兩者互相拉扯：門檻定得越嚴，型一錯誤越少，但型二錯誤可能變多。",
    example: "藥物檢測：型一錯誤是把沒效的藥說成有效；型二錯誤是錯過真正有效的藥。",
    myth: "一次跑很多個檢定，只挑顯著的報告。檢定越多次，至少出現一次型一錯誤的機率就越高。",
    paper: "為控制多重比較造成的型一錯誤膨脹，本研究採 Bonferroni 校正。",
    quiz: { q: "新廣告其實沒效果，但檢定結果顯著，這是？", options: ["型一錯誤", "型二錯誤", "沒有錯誤"], answer: 0, why: "實際上沒有效果卻判定有，是型一錯誤（偽陽性）。" }
  },
  {
    id: "effectsize", stage: 3, zh: "效果量", en: "Effect size",
    one: "回答「差異或關係有多大」，而不只是「有沒有」。",
    explain: "常見效果量：Cohen's d（兩組平均差除以標準差，約 0.2 小、0.5 中、0.8 大）、相關係數 r、迴歸的標準化係數 β、R²、η²。現在多數期刊要求同時報告 p 值和效果量。",
    example: "訓練組比對照組績效高，p < .001 但 d = 0.08——統計上顯著，實務上幾乎沒差。",
    myth: "用 p 值大小判斷效果大小（p 越小效果越大）。p 值也受樣本數影響。",
    paper: "實驗組與控制組的購買意願差異達中度效果量（Cohen's d = 0.54）。",
    quiz: { q: "Cohen's d = 0.8 通常被視為？", options: ["小效果", "中效果", "大效果"], answer: 2, why: "Cohen 的慣例：0.2 小、0.5 中、0.8 大（只是參考，要看領域）。" }
  },
  {
    id: "power", stage: 3, zh: "檢定力與樣本數", en: "Statistical power & sample size",
    one: "研究開始前先算好需要多少樣本，才不會「有效果卻測不出來」。",
    explain: "檢定力是「效果真的存在時，檢定能抓到它」的機率，一般希望至少 0.8。需要的樣本數取決於預期效果量、α 和想要的檢定力。可以用免費軟體 G*Power 計算。",
    example: "預期中等效果（d = 0.5）、α = .05、檢定力 .80，獨立樣本 t 檢定每組約需 64 人。",
    myth: "樣本收到多少算多少，結果不顯著就說「沒有效果」。可能只是檢定力不足。",
    paper: "依 G*Power 估算（f² = 0.15, α = .05, power = .80，預測變數 5 個），最低樣本數為 92。",
    quiz: { q: "預期效果越小，需要的樣本數？", options: ["越少", "越多", "沒有影響"], answer: 1, why: "小效果比較難和隨機誤差分開，需要更多樣本。" }
  },
  {
    id: "ttest", stage: 3, zh: "t 檢定", en: "t-test",
    one: "比較「兩組」的平均數有沒有顯著差異。",
    explain: "獨立樣本 t 檢定比較兩群不同的人（男 vs 女、實驗組 vs 對照組）；成對樣本 t 檢定比較同一群人前後兩次（訓練前 vs 訓練後）。前提包括資料大致常態、兩組變異數相近（不相近時用 Welch t 檢定）。",
    example: "比較「有使用行動支付」和「沒有使用」的消費者，平均每月網購次數是否不同。",
    myth: "三組以上時兩兩做很多次 t 檢定。這會膨脹型一錯誤，應該用 ANOVA。",
    paper: "獨立樣本 t 檢定顯示，實驗組的購買意願顯著高於控制組（t(198) = 3.12, p = .002, d = 0.44）。",
    quiz: { q: "同一批員工在教育訓練前後各測一次績效，要比較前後差異應用？", options: ["獨立樣本 t 檢定", "成對樣本 t 檢定", "卡方檢定"], answer: 1, why: "同一群人測兩次，資料是成對的。" }
  },
  {
    id: "anova", stage: 3, zh: "變異數分析 ANOVA", en: "Analysis of variance",
    one: "比較「三組以上」的平均數有沒有差異。",
    explain: "ANOVA 比較「組間差異」和「組內差異」的比例（F 值）。F 檢定顯著只代表至少有兩組不同，還要用事後比較（例如 Tukey）找出是哪幾組。二因子 ANOVA 還能看兩個因子的交互作用。",
    example: "比較北、中、南、東四區門市的平均客單價是否不同。",
    myth: "F 檢定顯著就說「每一組都不同」。要看事後比較才知道差在哪裡。",
    paper: "單因子變異數分析顯示不同地區的客單價有顯著差異（F(3, 296) = 5.47, p = .001, η² = .05），Tukey 事後比較指出北區顯著高於東區。",
    quiz: { q: "ANOVA 結果顯著後，下一步應該做？", options: ["事後比較", "卡方檢定", "直接下結論每組都不同"], answer: 0, why: "F 檢定只告訴你「有差異」，事後比較告訴你「誰跟誰不同」。" }
  },
  {
    id: "chisq", stage: 3, zh: "卡方檢定", en: "Chi-square test",
    one: "檢驗兩個「類別變數」之間有沒有關聯。",
    explain: "把資料整理成交叉表（例如 世代 × 偏好的支付方式），比較實際次數和「如果兩者無關」時的期望次數差多少。期望次數太小（小於 5 的格子太多）時結果不可靠。",
    example: "檢驗 Z 世代和 X 世代在「最常用的支付方式」上是否有差異。",
    myth: "用卡方檢定比較平均數。卡方檢定處理的是「次數」，連續變數要用 t 檢定或 ANOVA。",
    paper: "卡方檢定顯示世代與支付偏好之間有顯著關聯（χ²(4) = 18.6, p < .001, Cramér's V = .21）。",
    quiz: { q: "想知道「性別」和「是否購買」有沒有關聯，應用？", options: ["t 檢定", "卡方檢定", "迴歸的 R²"], answer: 1, why: "兩個都是類別變數，用卡方獨立性檢定。" }
  },

  /* ---------- 4 相關與迴歸 ---------- */
  {
    id: "correlation", stage: 4, zh: "相關係數與因果", en: "Correlation ≠ causation",
    one: "相關係數 r 衡量兩個變數「一起變動」的程度，但相關不代表因果。",
    explain: "r 介於 −1 到 1，正值代表同方向變動，負值代表反方向，0 代表沒有線性關係。兩個變數相關可能是因為第三個變數（混淆變數）同時影響兩者，或因果方向相反。",
    example: "冰淇淋銷量和溺水人數正相關——真正的原因是天氣熱，兩者都變多。",
    myth: "看到 r 很高就下因果結論。要談因果，需要實驗設計或因果推論方法（第 6 階段）。",
    paper: "知覺有用性與使用意圖呈中度正相關（r = .46, p < .001）。",
    quiz: { q: "r = −0.7 代表？", options: ["沒有關係", "強烈的負向關係", "弱的正向關係"], answer: 1, why: "絕對值 0.7 算強，負號代表一個變大另一個變小。" }
  },
  {
    id: "regression", stage: 4, zh: "簡單線性迴歸", en: "Simple linear regression",
    one: "用一條直線描述 X 和 Y 的關係：X 每增加 1，Y 平均變化多少。",
    explain: "Y = a + bX。截距 a 是 X = 0 時 Y 的預測值；斜率 b（迴歸係數）是 X 增加一單位時 Y 的平均變化。用最小平方法找出讓預測誤差平方和最小的那條線。",
    example: "廣告費每增加 1 萬元，營收平均增加 3.2 萬元（b = 3.2）。",
    myth: "把迴歸係數解讀成因果效果。沒有控制其他因素、沒有處理內生性時，它只是「關聯」。",
    paper: "簡單迴歸結果顯示，廣告支出對營收有顯著正向影響（b = 3.2, SE = 0.9, p < .001）。",
    quiz: { q: "迴歸式 Y = 10 + 2X，當 X 從 5 增加到 6，Y 的預測值？", options: ["增加 2", "增加 10", "增加 12"], answer: 0, why: "斜率 2 代表 X 每增加 1，Y 增加 2。" }
  },
  {
    id: "multiple", stage: 4, zh: "多元迴歸與控制變數", en: "Multiple regression & controls",
    one: "同時放入多個自變數，看「在其他條件不變下」每個變數的影響。",
    explain: "每個係數的意思是：在其他變數維持不變（控制住）的情況下，這個變數增加一單位，Y 的平均變化。控制變數是會同時影響 X 和 Y、需要排除的因素，例如公司規模、年齡、產業。",
    example: "研究「研發投入對營收成長」時控制公司規模——大公司研發多、成長也可能不同，不控制會混在一起。",
    myth: "控制變數越多越好。放入「中介變數」或「結果造成的變數」反而會讓估計偏誤。",
    paper: "在控制公司規模、年齡與產業後，研發密集度對營收成長仍有顯著正向影響（β = 0.18, p < .01）。",
    quiz: { q: "多元迴歸中 X1 的係數代表？", options: ["X1 和 Y 的相關係數", "其他變數不變時 X1 對 Y 的影響", "X1 的平均數"], answer: 1, why: "多元迴歸係數是「控制其他變數後」的偏效果。" }
  },
  {
    id: "r2", stage: 4, zh: "R² 與調整後 R²", en: "R-squared & adjusted R²",
    one: "模型能解釋 Y 的變異的比例；但 R² 高不等於模型好。",
    explain: "R² 介於 0 到 1，例如 0.35 代表模型解釋了 Y 35% 的變異。多放變數 R² 只會增加不會減少，所以比較不同模型時看調整後 R²。社會科學的 R² 常常不高，重點是係數是否合理、顯著。",
    example: "加入「顧客年資」後，模型的 R² 從 .21 增加到 .29（ΔR² = .08, p < .001），表示年資有額外解釋力。",
    myth: "R² 低就代表研究失敗。行為研究影響因素很多，R² 0.1–0.3 很常見。",
    paper: "階層迴歸結果顯示，加入調節變數後解釋力顯著提升（ΔR² = .05, F change = 9.81, p < .01）。",
    quiz: { q: "比較變數個數不同的兩個模型，應該看？", options: ["R²", "調整後 R²", "樣本數"], answer: 1, why: "調整後 R² 會懲罰多放的變數，比較公平。" }
  },
  {
    id: "dummy", stage: 4, zh: "虛擬變數", en: "Dummy variables",
    one: "把類別變數轉成 0/1，才能放進迴歸。",
    explain: "類別有 k 個時，建立 k − 1 個虛擬變數，剩下的那一類是「參照組」。係數解讀成「這一類和參照組相比，Y 平均高或低多少」。",
    example: "產業分成科技、金融、製造三類：以製造業為參照組，建立「科技=1」「金融=1」兩個虛擬變數。",
    myth: "k 個類別建 k 個虛擬變數一起放——會和截距完全共線（虛擬變數陷阱）。",
    paper: "以製造業為參照組，科技業的平均 ROA 高出 2.3 個百分點（b = 2.3, p < .05）。",
    quiz: { q: "「地區」有北、中、南、東 4 類，放進迴歸需要幾個虛擬變數？", options: ["3 個", "4 個", "1 個"], answer: 0, why: "k − 1 = 3，剩下一類當參照組。" }
  },
  {
    id: "vif", stage: 4, zh: "多元共線性", en: "Multicollinearity",
    one: "自變數之間太高度相關時，迴歸係數會變得很不穩定。",
    explain: "共線性高時，標準誤會變大、係數可能忽正忽負，但整體預測不一定受影響。常用 VIF 檢查，VIF 大於 10（嚴格一點用 5）通常需要留意。",
    example: "同時放入「員工人數」和「總資產」衡量公司規模，兩者高度相關，可能造成共線性。",
    myth: "VIF 有點高就一定要刪變數。要先看研究問題，有時可以合併指標或接受較大的標準誤。",
    paper: "所有變數的 VIF 介於 1.12 至 2.87，均低於 5，顯示無嚴重共線性問題。",
    quiz: { q: "檢查多元共線性最常用的指標是？", options: ["VIF", "p 值", "Cronbach's α"], answer: 0, why: "VIF（變異數膨脹因子）專門用來檢查共線性。" }
  },
  {
    id: "logistic", stage: 4, zh: "羅吉斯迴歸", en: "Logistic regression",
    one: "當結果是「是／否」（會不會購買、有沒有違約）時用的迴歸。",
    explain: "一般迴歸預測連續數字；羅吉斯迴歸預測「發生的機率」。係數通常轉成勝算比（odds ratio）解讀：OR = 1.5 代表 X 增加一單位，發生的勝算變成 1.5 倍。",
    example: "預測顧客會不會流失（1 = 流失、0 = 留下），自變數是使用頻率、客服次數、方案類型。",
    myth: "把勝算比當成機率倍數。勝算（odds）= 發生機率 ÷ 不發生機率，不等於機率本身。",
    paper: "羅吉斯迴歸結果顯示，客服申訴次數每增加一次，流失勝算增加 38%（OR = 1.38, 95% CI [1.15, 1.66]）。",
    quiz: { q: "依變數是「有沒有申請貸款（是／否）」，應該用？", options: ["線性迴歸", "羅吉斯迴歸", "ANOVA"], answer: 1, why: "二元的依變數用羅吉斯迴歸。" }
  },

  /* ---------- 5 問卷研究與量表 ---------- */
  {
    id: "construct", stage: 5, zh: "構念與 Likert 量表", en: "Constructs & Likert scales",
    one: "「信任」「滿意度」看不到也摸不到，要用一組題目來間接測量。",
    explain: "構念（construct）是抽象概念，用多個題目（題項）測量，例如 5 點或 7 點 Likert 量表。最好引用文獻中已驗證過的量表，翻譯時用「翻譯—回譯」確保意思一致，正式施測前先做前測。",
    example: "「知覺有用性」用 4 題測量，例如「使用這個 App 能提升我的工作效率」，1 = 非常不同意、7 = 非常同意。",
    myth: "自己想題目、一個構念只用一題。單題無法計算信度，也難以說服審查委員。",
    paper: "知覺有用性採用 Davis（1989）之量表，共 4 題，以 7 點 Likert 尺度衡量。",
    quiz: { q: "為什麼一個構念通常用多題來測量？", options: ["讓問卷看起來比較專業", "可以評估信度、降低單題誤差", "統計軟體規定"], answer: 1, why: "多題可以互相印證，並計算信度與效度。" }
  },
  {
    id: "reliability", stage: 5, zh: "信度：Cronbach's α", en: "Reliability",
    one: "同一個構念的題目，回答是否一致、穩定。",
    explain: "Cronbach's α 衡量內部一致性，一般 0.7 以上可接受（探索性研究有時接受 0.6）。做 SEM 時還會看組合信度（CR），同樣希望大於 0.7。α 太高（例如 0.95 以上）可能代表題目重複。",
    example: "「品牌忠誠度」4 題的 α = 0.86，代表這 4 題大致在測同一件事。",
    myth: "信度高就代表量表有效。信度是「穩定」，效度才是「測到你想測的東西」。",
    paper: "各構念之 Cronbach's α 介於 .81 至 .92，組合信度介於 .86 至 .94，皆高於 .70 之建議值。",
    quiz: { q: "Cronbach's α 一般建議至少達到？", options: ["0.3", "0.7", "0.99"], answer: 1, why: "0.7 是最常引用的門檻（Nunnally, 1978）。" }
  },
  {
    id: "validity", stage: 5, zh: "效度：收斂與區別", en: "Convergent & discriminant validity",
    one: "收斂效度：同構念的題目彼此夠像；區別效度：不同構念彼此夠不一樣。",
    explain: "收斂效度常看因素負荷量（> 0.7 較理想）與平均變異萃取量 AVE（> 0.5）。區別效度可用 Fornell–Larcker 準則（AVE 的平方根大於與其他構念的相關）或較新的 HTMT（< 0.85 或 0.9）。",
    example: "「滿意度」和「忠誠度」如果相關高達 0.95，受訪者可能根本分不出兩者，區別效度就有問題。",
    myth: "只報信度不報效度。審查委員通常會要求兩者都要有。",
    paper: "各構念 AVE 皆大於 .50，且 HTMT 值皆小於 .85，顯示具備收斂效度與區別效度。",
    quiz: { q: "AVE 一般建議大於？", options: ["0.3", "0.5", "0.9"], answer: 1, why: "AVE > 0.5 代表構念解釋了題目一半以上的變異。" }
  },
  {
    id: "factor", stage: 5, zh: "因素分析：EFA 與 CFA", en: "Exploratory vs. confirmatory factor analysis",
    one: "EFA 是「讓資料告訴你題目分成幾群」，CFA 是「驗證題目是否照你預期的分群」。",
    explain: "自己開發新量表、或不確定結構時先做 EFA；使用既有量表、理論已明確時做 CFA。CFA 要看模型配適度，例如 CFI、TLI（> .90 或 .95）、RMSEA、SRMR（< .08）。",
    example: "用文獻中的量表測 5 個構念，用 CFA 確認每題都落在它應屬的構念上，且負荷量夠高。",
    myth: "同一份資料先做 EFA 刪題、再做 CFA 宣稱驗證。理想上應該用不同樣本。",
    paper: "驗證性因素分析結果顯示模型配適良好（χ²/df = 2.14, CFI = .96, TLI = .95, RMSEA = .052, SRMR = .041）。",
    quiz: { q: "使用文獻上已發展成熟的量表，比較適合做？", options: ["EFA", "CFA", "卡方檢定"], answer: 1, why: "結構已知、要驗證時用驗證性因素分析。" }
  },
  {
    id: "mediation", stage: 5, zh: "中介效果", en: "Mediation",
    one: "X 透過 M 影響 Y——解釋「為什麼」或「怎麼影響」的機制。",
    explain: "例如 X → M → Y。現在主流作法是用 bootstrap 估計間接效果（a × b）的信賴區間，區間不包含 0 就代表中介效果顯著。工具：SPSS／R 的 PROCESS（Model 4）、SEM 軟體。",
    example: "社群行銷（X）透過提升品牌信任（M），進而提高購買意願（Y）。",
    myth: "只用 Baron & Kenny（1986）的逐步法、要求 X → Y 先顯著。現在多直接檢驗間接效果。",
    paper: "Bootstrap（5,000 次）結果顯示，品牌信任的間接效果顯著（ab = 0.21, 95% CI [0.11, 0.33]）。",
    quiz: { q: "用 bootstrap 檢驗中介時，怎樣代表間接效果顯著？", options: ["p > .05", "信賴區間不包含 0", "R² 大於 0.5"], answer: 1, why: "間接效果的信賴區間不包含 0，表示顯著不為 0。" }
  },
  {
    id: "moderation", stage: 5, zh: "調節效果（交互作用）", en: "Moderation / interaction",
    one: "X 對 Y 的影響大小，會因為 W 而不同——回答「在什麼情況下」。",
    explain: "在迴歸中加入 X × W 的交互作用項，係數顯著就代表有調節效果。建議先把 X、W 平均數中心化，並畫簡單斜率圖說明「W 高和低時，X 的效果各是多少」。",
    example: "遠距工作對生產力的影響，會因為主管支持程度（W）而不同：主管支持高時效果正向，低時接近 0。",
    myth: "把中介和調節搞混。中介是「機制」（X → M → Y），調節是「條件」（W 改變 X → Y 的強弱）。",
    paper: "主管支持對遠距工作與生產力之關係具正向調節效果（b = 0.15, p < .01），簡單斜率分析結果如圖 2。",
    quiz: { q: "「價格敏感度越高的人，促銷對購買的影響越大」描述的是？", options: ["中介效果", "調節效果", "共線性"], answer: 1, why: "價格敏感度改變了促銷效果的大小，是調節。" }
  },
  {
    id: "sem", stage: 5, zh: "結構方程模型 SEM／PLS-SEM", en: "Structural equation modeling",
    one: "把量表（測量模型）和構念之間的因果路徑（結構模型）放在一起估計。",
    explain: "CB-SEM（用 AMOS、R 的 lavaan）重視模型配適度、適合驗證成熟理論；PLS-SEM（用 SmartPLS、R 的 seminr）重視預測與解釋力，對樣本數和常態的要求較寬鬆，商管研究很常用。兩種都要先過信效度，再看路徑係數。",
    example: "驗證「科技接受模型」：知覺有用性、知覺易用性 → 使用態度 → 使用意圖，全部構念一次估計。",
    myth: "以為 PLS-SEM 樣本很小也沒關係。樣本數仍要依模型複雜度估算（例如用 G*Power 或逆平方根法）。",
    paper: "本研究採用 PLS-SEM（SmartPLS 4）進行分析，先評估測量模型之信效度，再以 bootstrap（5,000 次）檢驗結構模型路徑。",
    quiz: { q: "SEM 和多元迴歸最大的差別是？", options: ["SEM 不能處理多個自變數", "SEM 可以同時估計測量誤差與多條路徑", "SEM 只能用在實驗"], answer: 1, why: "SEM 同時處理潛在構念的測量與構念之間的多條路徑。" }
  },
  {
    id: "cmv", stage: 5, zh: "共同方法變異", en: "Common method bias",
    one: "同一份問卷、同一個人回答所有題目，相關可能被「填答方式」灌水。",
    explain: "例如受訪者整體傾向給高分，會讓所有構念看起來都相關。事前可以分時間點施測、匿名、打亂題目順序；事後常用 Harman 單因子檢定、或在 PLS-SEM 看完全共線性 VIF（< 3.3）。",
    example: "自變數與依變數都由同一位員工自評，審查委員幾乎一定會問 CMV。",
    myth: "只做 Harman 單因子檢定就宣稱沒有 CMV。這個方法很寬鬆，最好事前在研究設計就預防。",
    paper: "為降低共同方法變異，本研究分兩個時間點施測；Harman 單因子檢定之第一因子解釋變異量為 28.4%，未超過 50%。",
    quiz: { q: "下列哪個是「事前」降低共同方法變異的方法？", options: ["Harman 單因子檢定", "分兩個時間點收集自變數與依變數", "計算 Cronbach's α"], answer: 1, why: "在研究設計時就把資料來源或時間分開，是最有效的預防。" }
  },

  /* ---------- 6 因果推論與次級資料 ---------- */
  {
    id: "endogeneity", stage: 6, zh: "內生性", en: "Endogeneity",
    one: "自變數和誤差項相關，導致迴歸係數有偏誤——實證研究最常被挑戰的問題。",
    explain: "常見來源：遺漏變數（有重要因素沒放）、反向因果（Y 也影響 X）、自我選擇（做 X 的公司本來就不一樣）、測量誤差。處理方法包括固定效果、差異中的差異、工具變數、傾向分數配對等。",
    example: "「有做 ESG 的公司績效比較好」——也可能是績效好的公司才有餘力做 ESG（反向因果）。",
    myth: "多放幾個控制變數就解決內生性。觀察不到的因素放不進去，問題仍在。",
    paper: "為處理潛在的反向因果問題，本研究將自變數落後一期，並以工具變數法進行穩健性檢驗。",
    quiz: { q: "「績效好的公司才有錢做研發」對「研發提升績效」的研究造成的是？", options: ["反向因果", "共同方法變異", "型二錯誤"], answer: 0, why: "Y（績效）反過來影響 X（研發），是反向因果。" }
  },
  {
    id: "panel", stage: 6, zh: "追蹤資料與固定效果", en: "Panel data & fixed effects",
    one: "同一批對象追蹤很多年，可以排除「每家公司固定不變的特質」。",
    explain: "追蹤資料（panel）是「多個對象 × 多個時間點」。公司固定效果控制住不隨時間改變的因素（企業文化、創辦人特質），年度固定效果控制同一年所有公司共同受到的衝擊（景氣、疫情）。用 Hausman 檢定比較固定效果與隨機效果。",
    example: "用 2015–2024 年上市公司資料，研究董事會多元性對 ROA 的影響，加入公司與年度固定效果。",
    myth: "以為固定效果能解決所有內生性。隨時間改變、又沒觀察到的因素仍然會造成偏誤。",
    paper: "本研究採用雙向固定效果模型，控制公司與年度固定效果，標準誤於公司層級群聚（clustered）。",
    quiz: { q: "公司固定效果可以控制住？", options: ["每年的景氣變化", "公司不隨時間改變的特質", "所有內生性"], answer: 1, why: "公司固定效果吸收每家公司固定不變的差異。" }
  },
  {
    id: "did", stage: 6, zh: "差異中的差異 DID", en: "Difference-in-differences",
    one: "比較「受影響組」和「未受影響組」在事件前後的變化差距，估計政策或事件的效果。",
    explain: "效果 =（處理組事後 − 事前）−（對照組事後 − 事前）。核心假設是平行趨勢：如果沒有這個政策，兩組本來會有相同的變化趨勢，所以要畫圖或做事件研究檢查事前趨勢。",
    example: "某縣市推出中小企業數位補助，比較補助縣市和其他縣市企業在補助前後的營收變化。",
    myth: "只比較處理組的前後差異。這樣會把同期的景氣變化也算進政策效果。",
    paper: "以差異中的差異法估計補助效果，事前趨勢檢驗顯示處理組與對照組在政策實施前無顯著差異。",
    quiz: { q: "DID 最重要的假設是？", options: ["資料呈常態分配", "平行趨勢", "樣本數大於 30"], answer: 1, why: "沒有政策時兩組趨勢相同，差異才能歸因於政策。" }
  },
  {
    id: "iv", stage: 6, zh: "工具變數", en: "Instrumental variables",
    one: "找一個只透過 X 影響 Y 的變數，用它來「乾淨地」估計 X 的效果。",
    explain: "好的工具變數要滿足兩個條件：和 X 夠相關（相關性，第一階段 F 值一般要大於 10）；而且除了透過 X 以外，不會直接影響 Y（排除限制）。第二個條件無法完全用資料證明，要靠理論論述。常用兩階段最小平方法（2SLS）。",
    example: "研究「上大學對收入的影響」時，用「離家最近大學的距離」當工具變數。",
    myth: "工具變數隨便找一個相關的變數就好。弱工具變數或違反排除限制，結果可能比 OLS 更糟。",
    paper: "以兩階段最小平方法估計，第一階段 F 值為 24.3，顯示不存在弱工具變數問題。",
    quiz: { q: "工具變數必須「只透過 X 影響 Y」，這個條件叫？", options: ["相關性", "排除限制", "平行趨勢"], answer: 1, why: "排除限制：工具變數不能有直接影響 Y 的其他管道。" }
  },
  {
    id: "event", stage: 6, zh: "事件研究法", en: "Event study",
    one: "看某個事件公布前後，股價出現多少「超出正常」的報酬。",
    explain: "先用事件前一段時間（估計期）建立正常報酬模型（例如市場模型），再計算事件期間的異常報酬（AR）與累積異常報酬（CAR），檢定是否顯著不為 0。財務、會計研究很常用。",
    example: "研究企業宣布導入生成式 AI 時，公告日前後 3 天的累積異常報酬是否顯著為正。",
    myth: "事件窗口取很長。窗口越長，越容易混入其他事件的影響。",
    paper: "以市場模型估計正常報酬（估計期為事件日前 250 至 30 個交易日），事件窗口 [−1, +1] 之 CAR 為 1.8%（t = 3.05）。",
    quiz: { q: "事件研究法中，用來衡量事件影響的是？", options: ["累積異常報酬 CAR", "Cronbach's α", "VIF"], answer: 0, why: "CAR 是事件期間超出正常報酬的部分加總。" }
  }
];

// 我該用哪種統計方法？（第一層問「想回答什麼問題」，第二層再細分）
window.CD.statsPicker = [
  {
    q: "比較不同組別的平均數", hint: "例如：實驗組 vs 對照組、不同地區的門市",
    next: [
      { q: "兩組，不同的人", a: { name: "獨立樣本 t 檢定", when: "兩群不同的人，比較一個連續變數的平均數。", check: "兩組變異數差很多時改用 Welch t 檢定（jamovi 勾選即可）。", jamovi: "Analyses → T-Tests → Independent Samples T-Test", r: "t.test(y ~ group, data = df)", concepts: ["ttest", "effectsize"] } },
      { q: "同一群人，前後測兩次", a: { name: "成對樣本 t 檢定", when: "同一批受試者在兩個時間點或兩種情境下的比較。", check: "看的是「差值」是否大致常態。", jamovi: "Analyses → T-Tests → Paired Samples T-Test", r: "t.test(df$after, df$before, paired = TRUE)", concepts: ["ttest"] } },
      { q: "三組或以上", a: { name: "單因子變異數分析（ANOVA）", when: "三組以上比較平均數；有兩個分組因子時用二因子 ANOVA。", check: "顯著後要做事後比較（Tukey）。", jamovi: "Analyses → ANOVA → One-Way ANOVA", r: "summary(aov(y ~ group, data = df)); TukeyHSD(aov(y ~ group, data = df))", concepts: ["anova", "errors"] } }
    ]
  },
  {
    q: "看兩個變數有沒有關係", hint: "例如：性別與購買、廣告量與營收",
    next: [
      { q: "兩個都是數字（連續）", a: { name: "Pearson 相關", when: "兩個連續變數的線性關係；資料很偏或是順序尺度時用 Spearman 相關。", check: "先畫散布圖，確認是不是直線關係、有沒有離群值。", jamovi: "Analyses → Regression → Correlation Matrix", r: "cor.test(df$x, df$y)", concepts: ["correlation"] } },
      { q: "兩個都是類別", a: { name: "卡方獨立性檢定", when: "兩個類別變數的交叉表，例如世代 × 支付方式。", check: "期望次數小於 5 的格子不要太多，否則改用 Fisher 精確檢定。", jamovi: "Analyses → Frequencies → Independent Samples χ² test of association", r: "chisq.test(table(df$a, df$b))", concepts: ["chisq"] } }
    ]
  },
  {
    q: "用幾個因素解釋或預測一個結果", hint: "例如：哪些因素影響滿意度、會不會流失",
    next: [
      { q: "結果是數字（分數、營收）", a: { name: "多元迴歸", when: "一個連續的依變數，多個自變數與控制變數。", check: "檢查共線性（VIF）、殘差是否大致常態、有沒有離群值。", jamovi: "Analyses → Regression → Linear Regression", r: "summary(lm(y ~ x1 + x2 + control, data = df))", concepts: ["multiple", "r2", "vif", "dummy"] } },
      { q: "結果是「是／否」", a: { name: "羅吉斯迴歸", when: "依變數只有兩種結果，例如購買／不購買、違約／不違約。", check: "用勝算比（OR）解讀係數。", jamovi: "Analyses → Regression → 2 Outcomes (Binomial)", r: "summary(glm(y ~ x1 + x2, family = binomial, data = df))", concepts: ["logistic"] } },
      { q: "結果是次數（專利數、客訴次數）", a: { name: "Poisson／負二項迴歸", when: "依變數是 0、1、2… 的次數資料。", check: "變異數遠大於平均數（過度離散）時用負二項迴歸。", jamovi: "需要安裝 GAMLj 模組 → Generalized Linear Models", r: "glm(y ~ x, family = poisson, data = df)；過度離散用 MASS::glm.nb()", concepts: ["regression"] } }
    ]
  },
  {
    q: "問卷：驗證量表或研究架構", hint: "商管碩論最常見",
    next: [
      { q: "確認題目有測到同一個構念", a: { name: "信度分析＋驗證性因素分析（CFA）", when: "使用量表收集資料後，正式分析前的第一步。", check: "α、CR > .7；AVE > .5；HTMT < .85。", jamovi: "Analyses → Factor → Reliability Analysis／Confirmatory Factor Analysis", r: "psych::alpha(df[items])；lavaan::cfa(model, data = df)", concepts: ["reliability", "validity", "factor"] } },
      { q: "X 透過 M 影響 Y（機制）", a: { name: "中介分析（bootstrap 間接效果）", when: "想解釋「為什麼」X 會影響 Y。", check: "看間接效果的 bootstrap 信賴區間是否不包含 0。", jamovi: "安裝 jAMM 或 medmod 模組 → Mediation", r: "lavaan 定義 ab := a*b 並用 se = \"bootstrap\"；或 PROCESS for R（Model 4）", concepts: ["mediation"] } },
      { q: "X 對 Y 的影響因 W 而不同（條件）", a: { name: "調節分析（交互作用）", when: "想知道「在什麼情況下」效果比較強或比較弱。", check: "先中心化，再畫簡單斜率圖。", jamovi: "安裝 medmod 模組 → Moderation；或 Linear Regression 放入交互作用項", r: "summary(lm(y ~ x * w, data = df))；interactions::sim_slopes()", concepts: ["moderation"] } },
      { q: "很多構念的整個研究架構一起驗證", a: { name: "結構方程模型（CB-SEM／PLS-SEM）", when: "多個構念、多條路徑，例如延伸科技接受模型。", check: "先過測量模型（信效度），再看結構模型路徑與 R²。", jamovi: "安裝 SEMLj 模組；PLS-SEM 建議用 SmartPLS", r: "lavaan::sem(model, data = df)；PLS-SEM 用 seminr 套件", concepts: ["sem", "cmv"] } }
    ]
  },
  {
    q: "政策或事件造成的影響（次級資料）", hint: "例如：補助、法規、公司公告",
    next: [
      { q: "有受影響組與對照組、事前事後資料", a: { name: "差異中的差異（DID）", when: "政策只影響一部分對象，而且有實施前後的資料。", check: "檢查事前平行趨勢。", jamovi: "不適合用 jamovi，建議 R 或 Stata", r: "fixest::feols(y ~ treat:post | id + year, data = df)", concepts: ["did", "panel"] } },
      { q: "同一批公司追蹤多年", a: { name: "固定效果追蹤迴歸", when: "多家公司 × 多年度的資料，想排除公司固定特質。", check: "標準誤在公司層級群聚；用 Hausman 檢定比較隨機效果。", jamovi: "不適合用 jamovi，建議 R 或 Stata", r: "fixest::feols(y ~ x + controls | firm + year, cluster = ~firm, data = df)", concepts: ["panel", "endogeneity"] } },
      { q: "公告前後的股價反應", a: { name: "事件研究法", when: "研究某事件對股價（市場反應）的短期影響。", check: "事件窗口不宜太長，避免混入其他事件。", jamovi: "不適合用 jamovi，建議 R、Python 或 Stata", r: "用市場模型 lm(ret ~ mkt) 估計正常報酬，再計算 AR 與 CAR", concepts: ["event"] } }
    ]
  }
];

window.CD.statsTools = [
  { name: "jamovi", os: "Mac・Windows", kind: "點選式", cost: "免費", level: "新手第一步", desc: "介面像簡化版的 SPSS，點選就能跑分析，結果直接是 APA 格式表格。有很多擴充模組（中介、調節、SEM）。", link: "https://www.jamovi.org/" },
  { name: "JASP", os: "Mac・Windows", kind: "點選式", cost: "免費", level: "新手", desc: "和 jamovi 很像，另外有貝氏統計。兩個選一個熟悉就好。", link: "https://jasp-stats.org/" },
  { name: "G*Power", os: "Mac・Windows", kind: "點選式", cost: "免費", level: "研究設計", desc: "收資料前計算需要多少樣本，口試時常被問。", link: "https://www.psychologie.hhu.de/arbeitsgruppen/allgemeine-psychologie-und-arbeitspsychologie/gpower" },
  { name: "SPSS", os: "Mac・Windows", kind: "點選式", cost: "付費（學校通常有授權）", level: "很多老師在用", desc: "傳統主流，學校電腦教室常有。搭配 Hayes 的 PROCESS 外掛做中介、調節。", link: "https://www.ibm.com/products/spss-statistics" },
  { name: "SmartPLS", os: "Mac・Windows", kind: "點選式", cost: "學生版有限制", level: "問卷研究", desc: "PLS-SEM 專用，畫出研究架構就能跑，商管問卷研究非常常見。", link: "https://www.smartpls.com/" },
  { name: "IBM SPSS AMOS", os: "只有 Windows", kind: "點選式", cost: "付費（學校可能有授權）", level: "問卷研究", desc: "CB-SEM 最常見的點選式軟體，畫路徑圖就能跑，很多商管老師習慣用。和 SmartPLS 擇一，看指導教授習慣。", link: "https://www.ibm.com/products/structural-equation-modeling-sem" },
  { name: "R + RStudio", os: "Mac・Windows", kind: "寫程式", cost: "免費", level: "長期必學", desc: "學術界主流之一，套件最多：lavaan（SEM）、seminr（PLS-SEM）、fixest（追蹤資料、DID）。可以先用 Posit Cloud 免安裝。", link: "https://posit.co/download/rstudio-desktop/" },
  { name: "Python + Colab", os: "瀏覽器", kind: "寫程式", cost: "免費", level: "資料處理", desc: "抓資料、清資料、機器學習很強；統計用 statsmodels、scipy。Google Colab 開瀏覽器就能寫。", link: "https://colab.research.google.com/" },
  { name: "Stata", os: "Mac・Windows", kind: "寫程式", cost: "付費", level: "財經實證", desc: "經濟、財務、會計的追蹤資料與 DID 研究很常用，語法簡潔。", link: "https://www.stata.com/" },
  { name: "EViews", os: "只有 Windows", kind: "點選式", cost: "付費（有學生版）", level: "財經實證", desc: "時間序列與計量經濟學常用，例如利率、匯率、總體經濟資料。", link: "https://www.eviews.com/" },
  { name: "TEJ 資料庫", os: "Excel 外掛以 Windows 為主", kind: "資料庫", cost: "學校圖書館授權", level: "次級資料", desc: "台灣上市櫃公司財務、股價資料的主要來源，做固定效果、事件研究法幾乎都會用到。先問圖書館怎麼使用。", link: "https://www.tej.com.tw/" },
  { name: "Power BI Desktop", os: "只有 Windows", kind: "點選式", cost: "免費", level: "商業分析", desc: "微軟的資料視覺化與儀表板工具，把分析結果做成互動圖表，實習與求職很加分。", link: "https://www.microsoft.com/zh-tw/power-platform/products/power-bi/desktop" }
];

window.CD.statsResources = [
  { group: "先看懂概念", items: [
    { name: "StatQuest", note: "YouTube 圖解統計，一個概念 10 分鐘，英文但很好懂", link: "https://www.youtube.com/@statquest" },
    { name: "Seeing Theory", note: "互動視覺化：拖拉就能看懂機率、信賴區間、迴歸", link: "https://seeing-theory.brown.edu/" },
    { name: "Khan Academy 統計與機率", note: "從最基礎開始，有練習題", link: "https://www.khanacademy.org/math/statistics-probability" }
  ] },
  { group: "邊做邊學的教科書（免費）", items: [
    { name: "使用 jamovi 學習統計", note: "Learning Statistics with jamovi 繁體中文版，新手最推薦", link: "https://lsj.readthedocs.io/zh_TW/latest/" },
    { name: "OpenIntro Statistics", note: "免費統計教科書，例題多", link: "https://www.openintro.org/book/os/" },
    { name: "R for Data Science", note: "學 R 整理資料與畫圖", link: "https://r4ds.hadley.nz/" }
  ] },
  { group: "商管研究方法", items: [
    { name: "PLS-SEM Using R", note: "Hair 等人的 PLS-SEM 開放取用教科書（seminr 套件）", link: "https://link.springer.com/book/10.1007/978-3-030-80519-7" },
    { name: "lavaan 教學", note: "R 的 CFA／SEM 官方教學", link: "https://lavaan.ugent.be/tutorial/" },
    { name: "PROCESS macro", note: "Hayes 的中介、調節分析工具", link: "https://www.processmacro.org/" }
  ] },
  { group: "因果推論（進階）", items: [
    { name: "The Effect", note: "研究設計與因果推論，寫得很白話", link: "https://theeffectbook.net/" },
    { name: "Causal Inference: The Mixtape", note: "DID、IV、RDD 等方法，附程式碼", link: "https://mixtape.scunning.com/" },
    { name: "Introduction to Econometrics with R", note: "計量經濟學入門，用 R 實作", link: "https://www.econometrics-with-r.org/" }
  ] }
];
