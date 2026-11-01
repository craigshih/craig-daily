// 每日市場洞察：由 scripts/fetch_market.py 自動產生（每天台灣時間 08:30，中午、傍晚各再抓一次），請不要手動改
window.CD = window.CD || {};
window.CD.marketUpdated = "2026-11-01 19:05";
window.CD.marketGroups = [{"id": "tw", "name": "財經・台股美股"}, {"id": "strategy", "name": "商業與戰略"}, {"id": "tech", "name": "科技・新創・創投"}, {"id": "growth", "name": "行銷・產品・增長"}, {"id": "smb", "name": "創業與中小企業"}];
window.CD.marketSummary = {"text": "美國選舉與經濟悲觀情緒交織、AI 代理與自駕卡車持續測試、以及 AI 生成廣告與行銷工具的快速崛起，成為今日最顯著的產業變革與商業策略焦點。", "watch": ["美國中期選舉對科技與能源政策的影響", "自駕卡車商業化路徑與法規挑戰", "AI 代理在行銷與企業決策中的安全與效能"]};
window.CD.marketStatus = [{"source": "市場先生", "ok": false, "error": "HTTP Error 503: Service Unavailable"}, {"source": "MacroMicro 財經M平方", "ok": false, "error": "HTTP Error 503: Service Unavailable"}, {"source": "大叔美股筆記", "ok": false, "error": "HTTP Error 503: Service Unavailable"}, {"source": "Harvard Business Review", "ok": false, "error": "HTTP Error 503: Service Unavailable"}, {"source": "Business Insider", "ok": false, "error": "HTTP Error 503: Service Unavailable"}, {"source": "Fast Company", "ok": true, "count": 3}, {"source": "TechCrunch", "ok": true, "count": 3}, {"source": "The Verge", "ok": true, "count": 2}, {"source": "Wired", "ok": true, "count": 2}, {"source": "Springwise", "ok": false, "error": "HTTP Error 503: Service Unavailable"}, {"source": "Lenny's Newsletter", "ok": true, "count": 2}, {"source": "Brian Balfour（Reforge）", "ok": true, "count": 0}, {"source": "HubSpot Blog", "ok": true, "count": 2}, {"source": "Shopify Blog", "ok": false, "error": "HTTP Error 503: Service Unavailable"}, {"source": "Entrepreneur", "ok": true, "count": 3}, {"source": "Small Business Trends", "ok": true, "count": 2}];
window.CD.market = [
  {
    "source": "Fast Company",
    "group": "strategy",
    "title": "Are American voters actually gloomy about the economy?",
    "link": "https://www.fastcompany.com/91633258/are-american-voters-actually-gloomy-about-the-economy",
    "date": "2026-11-01",
    "excerpt": "Polling is looking grim for Republicans ahead of the U.S. midterm elections on November 3, due in large part to deep pessimism among the public about the economy. At first glance, this might seem surprising. With the…",
    "titleZh": "美國選民對經濟感到沮喪嗎？民調顯示共和黨前景黯淡",
    "takeaway": "選民對經濟的悲觀情緒可能削弱共和黨在11月中期選舉的支持，企業需留意政策走向對市場的衝擊。"
  },
  {
    "source": "Fast Company",
    "group": "strategy",
    "title": "Why driverless trucks won’t be taking over highways just yet",
    "link": "https://www.fastcompany.com/91632428/driverless-trucks-wont-be-taking-over-highways-just-yet",
    "date": "2026-11-01",
    "excerpt": "Driverless trucks with artificial intelligence on board could dramatically change the landscape of freight shipping. A few companies have begun testing early models on some limited routes in Texas and California.…",
    "titleZh": "自駕卡車尚未全面上路的原因",
    "takeaway": "AI 自駕卡車在德州與加州的試驗顯示技術可行，但法規與基礎設施限制仍阻礙大規模部署。"
  },
  {
    "source": "Fast Company",
    "group": "strategy",
    "title": "Could AI give older creatives a second act?",
    "link": "https://www.fastcompany.com/91633136/could-ai-give-older-creatives-a-second-act",
    "date": "2026-11-01",
    "excerpt": "Advertising is made for the young by the young. That’s conventional wisdom backed up by the Bureau of Labor Statistics , which in 2025 reported the median age of ad industry workers was 39, compared to 42 for the…",
    "titleZh": "AI 能否為年長創意人帶來第二次職涯？",
    "takeaway": "AI 工具或成為年長廣告人再度發光的助力，企業可考慮利用此趨勢延長人才使用壽命。"
  },
  {
    "source": "TechCrunch",
    "group": "tech",
    "title": "Data centers are now a midterm issue, even in Brooklyn",
    "link": "https://techcrunch.com/2026/10/31/data-centers-are-now-a-midterm-issue-even-in-brooklyn/",
    "date": "2026-11-01",
    "excerpt": "At a Brooklyn midterm party five days before Election Day, every conversation, from a council member’s fireside chat to a debate about the Democratic Party, kept circling back to AI and data centers.",
    "titleZh": "資料中心成為布魯克林選舉的焦點議題",
    "takeaway": "選舉期間 AI 與資料中心議題頻繁出現在公共討論，顯示能源與算力供應將影響未來政策與投資。"
  },
  {
    "source": "TechCrunch",
    "group": "tech",
    "title": "Apple CEO says the company doesn’t ‘want to ship AI for AI’s sake’",
    "link": "https://techcrunch.com/2026/10/31/apple-ceo-says-the-company-doesnt-want-to-ship-ai-for-ais-sake/",
    "date": "2026-11-01",
    "excerpt": "Apple's new CEO defended the company's current position in the AI landscape.",
    "titleZh": "蘋果 CEO 表示不會為了 AI 而推出 AI 產品",
    "takeaway": "蘋果強調產品實用性而非技術炫耀，提醒業者在 AI 佈局時須聚焦真實需求。"
  },
  {
    "source": "TechCrunch",
    "group": "tech",
    "title": "4 days left: How TechCrunch Founder Summit helps you make more useful connections to scale",
    "link": "https://techcrunch.com/2026/10/31/4-days-left-how-techcrunch-founder-summit-helps-you-make-more-useful-connections-to-scale/",
    "date": "2026-11-01",
    "excerpt": "On November 4 at Boston’s SoWa Power Station, get ready for a full day packed with meaningful networking opportunities, actionable insights, and connections that could change the trajectory of your idea and startup.…",
    "titleZh": "TechCrunch 創辦人峰會：四天倒數，助你擴大創業人脈",
    "takeaway": "即將舉行的峰會提供實務連結與資源，對新創團隊的資金與市場拓展具關鍵助益。"
  },
  {
    "source": "The Verge",
    "group": "tech",
    "title": "Get in the spirit with these horrors from YouTube",
    "link": "https://www.theverge.com/entertainment/1024096/halloween-spirit-youtube-horror",
    "date": "2026-11-01",
    "excerpt": "Rather than recommend a single horror film or an unsettling album for our final installment of spooky season recs, I present you with a small selection of creepy, disturbing, and just plain weird videos from YouTube.…",
    "titleZh": "YouTube 恐怖影片精選：節慶氛圍的怪異之選",
    "takeaway": "平台內容多元化呈現，提醒媒體與廣告主善用節慶情緒打造吸睛行銷。"
  },
  {
    "source": "The Verge",
    "group": "tech",
    "title": "Keyboards of The Verge",
    "link": "https://www.theverge.com/gadgets/1017979/keyboards-of-the-verge-staff-picks",
    "date": "2026-11-01",
    "excerpt": "What is a keyboard if not the original brain-computer interface? You can tap on a touchscreen or talk to the computer, but if your work involves getting information out of your head and into the computer, you're…",
    "titleZh": "The Verge 鍵盤特輯：鍵盤作為最早的腦機介面",
    "takeaway": "鍵盤仍是資訊輸入核心，相關硬體創新可提升工作效率與使用者體驗。"
  },
  {
    "source": "Wired",
    "group": "tech",
    "title": "Meta’s Muse Could Upend All Kinds of Businesses. It Hasn’t Yet",
    "link": "https://www.wired.com/story/metas-muse-could-upend-all-kinds-of-businesses-it-hasnt-yet/",
    "date": "2026-10-31",
    "excerpt": "Companies have spent the past several weeks trying to reassure investors that Muse and other AI agents pose more of an opportunity than a threat.",
    "titleZh": "Meta 的 Muse 可能顛覆各行各業，但尚未實現",
    "takeaway": "雖然 AI 代理被視為機會，企業仍需觀察其成熟度與實際商業價值。"
  },
  {
    "source": "Wired",
    "group": "tech",
    "title": "How a Contractor’s Claude Agent Got Into the Pentagon",
    "link": "https://www.wired.com/story/uncanny-valley-podcast-how-a-contractors-claude-agent-got-into-the-pentagon/",
    "date": "2026-10-31",
    "excerpt": "This week on Uncanny Valley, we also discuss Anthropic’s IPO filing and the volunteers gearing up to counter ICE at the midterms.",
    "titleZh": "承包商的 Claude 代理如何闖入五角大樓",
    "takeaway": "AI 代理進入政府機構顯示安全與合規挑戰升高，供應鏈與政策風險需加強管理。"
  },
  {
    "source": "Lenny's Newsletter",
    "group": "growth",
    "title": "🧠 Community Wisdom: The biggest sources of interruptions for PMs, hiring junior PMs with case studies vs. behavioral interviews, building a product harness for AI-driven development, and more",
    "link": "https://www.lennysnewsletter.com/p/community-wisdom-the-biggest-sources",
    "date": "2026-11-01",
    "excerpt": "Community Wisdom 304",
    "titleZh": "社群智慧：PM 常被打斷的來源、面試方式與 AI 產品開發",
    "takeaway": "產品經理面臨的中斷與招聘挑戰，以及 AI 驅動開發工具，提示企業優化流程與人才選拔。"
  },
  {
    "source": "Lenny's Newsletter",
    "group": "growth",
    "title": "Grok vs. Dot vs. Muse vs. Claude Duet: which one crushes the competition?",
    "link": "https://www.lennysnewsletter.com/p/grok-vs-dot-vs-muse-vs-claude-duet",
    "date": "2026-10-28",
    "excerpt": "Listen now | 🎙️ I ranked Grok Bot, Dot, Muse, and Claude Duet across 9 real tasks—and the scores told me which agent runs my work and which runs my life",
    "titleZh": "Grok、Dot、Muse、Claude Duet 比較：哪個 AI 代理最強？",
    "takeaway": "透過實測任務評分，提供企業選擇最適合工作與生活的 AI 代理參考。"
  },
  {
    "source": "HubSpot Blog",
    "group": "growth",
    "title": "ChatGPT Ads vs. Google Search ads: 5 differences to consider in your strategy",
    "link": "https://blog.hubspot.com/marketing/chatgpt-ads-vs-google-search-ads",
    "date": "2026-10-29",
    "excerpt": "It’s hard to believe anything could rival Google’s impact on our digital lives and habits, but ChatGPT is on its tail — especially now that it shows ads. For many marketers and businesses, this means debating ChatGPT…",
    "titleZh": "ChatGPT 廣告 vs. Google 搜尋廣告：策略差異五點",
    "takeaway": "ChatGPT 廣告的興起迫使行銷人重新思考投放平台與受眾觸達方式。"
  },
  {
    "source": "HubSpot Blog",
    "group": "growth",
    "title": "Claude marketing plugins worth adding to your stack in 2026",
    "link": "https://blog.hubspot.com/marketing/claude-marketing-plugin",
    "date": "2026-10-29",
    "excerpt": "Claude marketing plugins extend Claude into workflows for content creation, campaign planning, brand management, reporting, and publishing. The best options connect Claude with the tools and business data marketers…",
    "titleZh": "2026 年值得加入的 Claude 行銷插件",
    "takeaway": "Claude 插件可串接內容、活動與報表工作流，提升行銷自動化與資料整合效率。"
  },
  {
    "source": "Entrepreneur",
    "group": "smb",
    "title": "Why Playing It Safe Is the Riskiest Marketing Decision You’ll Make",
    "link": "https://www.entrepreneur.com/building-a-business/why-playing-it-safe-is-the-riskiest-marketing-decision-youll-make",
    "date": "2026-11-01",
    "excerpt": "Best practices are crowded on purpose. The upside sits with whoever moves before they're proven safe. Here's how you can be that person.",
    "titleZh": "保守是最危險的行銷決策",
    "takeaway": "過度遵循慣例會錯失先行者優勢，企業需敢於在未驗證前採取創新行動。"
  },
  {
    "source": "Entrepreneur",
    "group": "smb",
    "title": "AI and Emerging Tech Are Changing How People Travel. Here’s How Travel Businesses Can Stay Visible and Valuable",
    "link": "https://www.entrepreneur.com/business-news/tech/ai-and-emerging-tech-are-changing-how-people-travel-heres-how-travel-businesses-can-stay-visible-and-valuable",
    "date": "2026-10-31",
    "excerpt": "See how AI, virtual reality and predictive analytics are changing travel planning, search and advisor value.",
    "titleZh": "AI 與新興科技改變旅遊業：保持能見度與價值的策略",
    "takeaway": "旅遊企業應運用 AI、VR 與預測分析提升規劃與客服，才能在數位化競爭中存活。"
  },
  {
    "source": "Entrepreneur",
    "group": "smb",
    "title": "Starting an AI Side Hustle is Easy (Steal This System)",
    "link": "https://www.entrepreneur.com/building-a-business/starting-an-ai-side-hustle-is-easy-steal-this-system-2",
    "date": "2026-10-31",
    "excerpt": "See how AI agents can help solo entrepreneurs delegate work, build tools and operate with the capabilities of a much larger team.",
    "titleZh": "打造 AI 副業的簡易系統：偷師成功模式",
    "takeaway": "AI 代理可協助個人創業者分工與工具建置，降低門檻並提升產出規模。"
  },
  {
    "source": "Small Business Trends",
    "group": "smb",
    "title": "Conducting an Effective Performance and Development Review",
    "link": "https://smallbiztrends.com/performance-and-development-review/",
    "date": "2026-11-01",
    "excerpt": "Discover essential strategies for conducting an effective performance and development review. Learn how to set clear goals, provide constructive feedback, and foster employee growth to enhance productivity and…",
    "titleZh": "有效的績效與發展評估方法",
    "takeaway": "透過明確目標與建設性回饋提升員工表現，對企業生產力與人才保留具正面影響。"
  },
  {
    "source": "Small Business Trends",
    "group": "smb",
    "title": "What Is IT Asset Lifecycle Management’s Importance?",
    "link": "https://smallbiztrends.com/it-asset-lifecycle-management/",
    "date": "2026-11-01",
    "excerpt": "Discover the critical role of IT asset lifecycle management in optimizing your organization's technology investments. Learn about its importance in enhancing efficiency, reducing costs, and ensuring compliance…",
    "titleZh": "IT 資產生命週期管理的重要性",
    "takeaway": "完善的資產管理可優化技術投資、降低成本並確保合規，對企業營運效率關鍵。"
  }
];
