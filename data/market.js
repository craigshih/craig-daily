// 每日市場洞察：由 scripts/fetch_market.py 自動產生（每天台灣時間 08:30，中午、傍晚各再抓一次），請不要手動改
window.CD = window.CD || {};
window.CD.marketUpdated = "2026-11-25 22:00";
window.CD.marketGroups = [{"id": "tw", "name": "財經・台股美股"}, {"id": "strategy", "name": "商業與戰略"}, {"id": "tech", "name": "科技・新創・創投"}, {"id": "growth", "name": "行銷・產品・增長"}, {"id": "smb", "name": "創業與中小企業"}];
window.CD.marketSummary = {"text": "AI 產業持續成為焦點，從 Nvidia 估值、供應鏈到新興 AI 產品的市場動能皆受矚目；同時領導力與組織文化的研究顯示感恩與自我保護成為提升員工效能的關鍵；在金融與創業層面，供應鏈未來走向、AI 對職涯建議的影響以及新興創業模式持續改寫商業決策。", "watch": ["AI 估值回升與供應鏈變化的長期影響", "領導者感恩與自我保護對組織績效的傳導效應", "AI 技術如何重新塑造職涯諮詢與人才培育"]};
window.CD.marketStatus = [{"source": "市場先生", "ok": false, "error": "HTTP Error 429: Too Many Requests"}, {"source": "MacroMicro 財經M平方", "ok": true, "count": 3}, {"source": "大叔美股筆記", "ok": true, "count": 3}, {"source": "Harvard Business Review", "ok": true, "count": 3}, {"source": "Business Insider", "ok": false, "error": "HTTP Error 429: Too Many Requests"}, {"source": "Fast Company", "ok": true, "count": 3}, {"source": "TechCrunch", "ok": true, "count": 3}, {"source": "The Verge", "ok": true, "count": 2}, {"source": "Wired", "ok": true, "count": 2}, {"source": "Springwise", "ok": true, "count": 2}, {"source": "Lenny's Newsletter", "ok": true, "count": 2}, {"source": "Brian Balfour（Reforge）", "ok": true, "count": 0}, {"source": "HubSpot Blog", "ok": true, "count": 1}, {"source": "Shopify Blog", "ok": true, "count": 2}, {"source": "Entrepreneur", "ok": true, "count": 3}, {"source": "Small Business Trends", "ok": true, "count": 2}];
window.CD.market = [
  {
    "source": "MacroMicro 財經M平方",
    "group": "tw",
    "title": "【展望 2027 系列四】黃仁勳回來了，AI 估值回得去嗎？2027 年供應鏈深度分析",
    "link": "https://news.google.com/rss/articles/CBMi7wFBVV95cUxPZVFHV25lVi1sQkp4LTJhWXJzYktXWVJwejZWaEJ4TWlNWi12ZU9CcUpWSlcwdTU4Q0swaVpYTGRnU1Q5YWdLNW5MeGRJRHJEZUt5a1JRS2lUTlV3RFRBd0F1TzVRa3Yxd09OUUNibjV4SW5rSmU2TWFkY19OX1pWTU5TdlBMTHRSdTFmbWs4blB1R1gxWENqZDlWUWY2ZFZYU1AxMzZ3Zm9mSGVZVlkyTVN5a0RKTkRZSkpsSnNQU1VDS0J1MFNldkFnQXFLN2hvX0l4U2l5RGg4cEp2ZFlmTTBiNE14RXpCZ3dINXg2cw?oc=5",
    "date": "2026-11-24",
    "excerpt": "",
    "titleZh": "展望 2027 系列四：黃仁勳回來了，AI 估值回得去嗎？2027 年供應鏈深度分析",
    "takeaway": "探討 Nvidia 重返領導層後 AI 估值能否回升，以及未來供應鏈結構的變化對產業投資決策的啟示。"
  },
  {
    "source": "MacroMicro 財經M平方",
    "group": "tw",
    "title": "【創辦人撰文】崩盤、打底、回升：三大循環的2027 修復路線圖",
    "link": "https://news.google.com/rss/articles/CBMiY0FVX3lxTE93XzR1bWp4Nk9rWW9zQ2o3ZXhLRG1xazkwWkZZX2M5UUxYT2lQWnVBN2pvWUJGQ1gtbEtHMzM5bWVBY2VIQ3ZGRmJJX01keThHTUNxY2dieXc0a2tvQjliY2k4cw?oc=5",
    "date": "2026-11-23",
    "excerpt": "",
    "titleZh": "創辦人撰文：崩盤、打底、回升：三大循環的2027 修復路線圖",
    "takeaway": "闡述三段經濟循環的修復策略，提供企業在波動期的資金與營運規劃參考。"
  },
  {
    "source": "MacroMicro 財經M平方",
    "group": "tw",
    "title": "【MM一週盤前】全球 AI 股強烈賣壓、聯準會再放鷹，本週關注美國 PCE 物價！",
    "link": "https://news.google.com/rss/articles/CBMikAJBVV95cUxQa3pXTUNNUzZDNk42eGZxemRXODZ0eWM1bWhFWFhRcmpfWVZqV0hjOXN4UWNQcEpTWHFyYU8xbkpzV2NKdzRBWXMyWUtCY3FpbVBHRWpxQi1nVHBqOG1mTFg3OUhkWHdfM0I4dmw0aEZtcUNHZUZwekdKRWpCd2hQa1R5UEtKOE40dVRmVUpXaUZESUtXSGM0anNhUzNsTHg4THA3SW1TTlllVjlERnNRWUxoanFWTzd0VXlFZUFTU2NIaUZEV2RyT3lqRGZldGtiT3NzcFFlT1Q1eTUwNkIwc2ROOTNNRUNIVDJOX2FLMl9MNHZTU3FmaHE5azVTYTB2UWVSTl9ZdVBfUUVrOUV3Zw?oc=5",
    "date": "2026-11-22",
    "excerpt": "",
    "titleZh": "MM一週盤前：全球 AI 股強烈賣壓、聯準會再放鷹，本週關注美國 PCE 物價！",
    "takeaway": "指出 AI 股面臨拋售壓力與美聯儲鷹派政策交錯，提醒投資人關注 PCE 物價指標的短期波動。"
  },
  {
    "source": "大叔美股筆記",
    "group": "tw",
    "title": "每日重點 261124 Substack 大叔留言",
    "link": "https://news.google.com/rss/articles/CBMiZEFVX3lxTE9XZEkxWU1KWkhDaTBSdGpUVnR4QjEyOWh6c2VaRG1NbE5sZHZNNHNfWWREbHJCbFYwN21ZQzJCMW1EcWVoR3UzdldwWEo5a0pPUHdidm9naFBXSEZIOHQxR3JWNmE?oc=5",
    "date": "2026-11-25",
    "excerpt": "",
    "titleZh": "每日重點 261124 Substack 大叔留言",
    "takeaway": "彙整當日美股市場要點與讀者回饋，提供快速掌握投資情緒的參考。"
  },
  {
    "source": "大叔美股筆記",
    "group": "tw",
    "title": "Coherent Corp. $COHR FY2027 Q1 財報分析",
    "link": "https://news.google.com/rss/articles/CBMie0FVX3lxTFA1SWpyZEJtVlV2YlZ6azBzMUItYllXQzEwcjl1SF9uTEV4YTdkSUpDMXVqdk5aeEZ3QU9XYUo0TU9FM2Y2Tnp6V1lzQUhleHZHalVQQTM1SnM0dE1ISlloUC1YUkxXRG12SmpQSFpEX1hhNnQ0Slp5R1d6SQ?oc=5",
    "date": "2026-11-24",
    "excerpt": "",
    "titleZh": "Coherent Corp. $COHR FY2027 Q1 財報分析",
    "takeaway": "解析 Coherent 2027 年第一季財報，說明其營收與研發投入對光電產業的影響。"
  },
  {
    "source": "大叔美股筆記",
    "group": "tw",
    "title": "Ondas Inc. $ONDS 2026年第三季財報分享",
    "link": "https://news.google.com/rss/articles/CBMib0FVX3lxTE5jbms5b2VLVmVTS2c3UHNUZzlSUUhmSng4aUh0TElROURUNUZFSWo3dU84MkRqdVhwaHMzUGIycEhHOHAwSXphV05QVDQ3QVBoaGJTdk9rd3pQZDBnWGJoazBMZm0yOS1ta1c4b1pOVQ?oc=5",
    "date": "2026-11-24",
    "excerpt": "",
    "titleZh": "Ondas Inc. $ONDS 2026年第三季財報分享",
    "takeaway": "概述 Ondas 2026 年第三季業績，強調其聲波技術在醫療與通訊領域的成長潛力。"
  },
  {
    "source": "Harvard Business Review",
    "group": "strategy",
    "title": "Leading Others Without Losing Yourself",
    "link": "https://news.google.com/rss/articles/CBMib0FVX3lxTE1mUFd2dVJrYVc3UHgzSWRTS2d2cWlJVHlVdzFqUGVIWlhGZmFnWDR1c0NSZmhudWxTSkN4a21Fb2c1cEZfMTRoSktuMHg3dVdJZjRnQ2ZBUEhFZUhsNkV2ZWtadFFpVWVCU1JMM1JURQ?oc=5",
    "date": "2026-11-25",
    "excerpt": "",
    "titleZh": "領導他人而不失自我",
    "takeaway": "提供領導者在保持個人價值觀的同時，有效帶領團隊的實務建議。"
  },
  {
    "source": "Harvard Business Review",
    "group": "strategy",
    "title": "Research: When Leaders Practice Gratitude, It Spreads Through Their Organization",
    "link": "https://news.google.com/rss/articles/CBMipAFBVV95cUxPUHE4QU5tVkZEd0N4aGtXTDM5UnUzV1RaNER0Z0p2YzRVZ01MZmFiYXE1VXlzX0RDQmZpb0tqREdzS3FzNERCWG52ZjNKVUxFNnl5SWRpMXBQYXItZ3pQVmtELTg0Ti13T1BKTFQzTXgtRVR6QnMxcGVFRUVNQVVKMDFhbkhUTWxaREptVUtCLXdmSFF6ZkJCbjNFUl9wM1J5NTVCTQ?oc=5",
    "date": "2026-11-25",
    "excerpt": "",
    "titleZh": "研究：領導者實踐感恩，會在組織內擴散",
    "takeaway": "說明感恩行為如何在企業內部形成正向循環，提升員工敬業度與合作意願。"
  },
  {
    "source": "Harvard Business Review",
    "group": "strategy",
    "title": "Do Your Employees Want Time or Money?",
    "link": "https://news.google.com/rss/articles/CBMibEFVX3lxTE9mdXppampWTVprQWRyamRxRGVsOFhYQ2ZPZmNlb1p6ZGpKU2laRXRjZElNUzRuUTEyeURkclVZaGRRVGxaZE5taUx1b1pCOTZYOGo2elF3ekxhVTNnT19EWjFaMi1lX2hPVVB2OA?oc=5",
    "date": "2026-11-25",
    "excerpt": "",
    "titleZh": "員工想要時間還是金錢？",
    "takeaway": "探討員工在彈性工作與薪酬之間的偏好，協助企業設計更具吸引力的福利方案。"
  },
  {
    "source": "Fast Company",
    "group": "strategy",
    "title": "Driving for Thanksgiving? These are the worst times to be on the road this week",
    "link": "https://www.fastcompany.com/91648890/driving-for-thanksgiving-these-are-the-worst-times-to-be-on-the-road-this-week",
    "date": "2026-11-25",
    "excerpt": "Another Thanksgiving week is upon us, which means tens of millions of Americans will once again travel by plane, train, and automobile to see their loved ones. However, this Thanksgiving period will be a little…",
    "titleZh": "感恩節開車最糟時段大公開",
    "takeaway": "提醒駕駛者在感恩節期間避開高風險時段，降低交通事故與物流延遲的風險。"
  },
  {
    "source": "Fast Company",
    "group": "strategy",
    "title": "Why isn’t AI changing career advice?",
    "link": "https://www.fastcompany.com/91647961/why-isnt-ai-changing-career-advice",
    "date": "2026-11-25",
    "excerpt": "Ask a 17-year-old where their career plan came from and the answer is usually someone at the kitchen table. A parent, maybe an uncle. These are people who love them and want the best for them. They are also, in most…",
    "titleZh": "為何 AI 尚未改變職涯建議？",
    "takeaway": "指出 AI 在職涯諮詢領域仍受限於傳統資訊來源，提示教育與科技結合的改進空間。"
  },
  {
    "source": "Fast Company",
    "group": "strategy",
    "title": "TouchTunes just added a social feed to your local jukebox",
    "link": "https://www.fastcompany.com/91648105/touchtunes-just-added-a-social-feed-to-your-local-jukebox",
    "date": "2026-11-25",
    "excerpt": "The streaming jukebox giant TouchTunes wants to be the online social hub for your local bar. The New York-based company boasts jukeboxes in more than 60,000 locations that users can control through touch screens or apps…",
    "titleZh": "TouchTunes 為本地點唱機加入社交動態功能",
    "takeaway": "說明點唱機平台加入社交功能，如何提升酒吧客群互動與品牌黏著度。"
  },
  {
    "source": "TechCrunch",
    "group": "tech",
    "title": "Flipkart CEO Kalyan Krishnamurthy to step down next week amid IPO uncertainty",
    "link": "https://techcrunch.com/2026/11/25/flipkart-ceo-kalyan-krishnamurthy-to-step-down-next-week-amid-ipo-uncertainty/",
    "date": "2026-11-25",
    "excerpt": "Flipkart's product and technology chief Balaji Thiagarajan will lead the company alongside its board until a successor is found.",
    "titleZh": "Flipkart CEO 將於下週辭職，IPO 前景不明",
    "takeaway": "揭示 Flipkart 高層變動對其上市計畫與電商競爭格局的潛在衝擊。"
  },
  {
    "source": "TechCrunch",
    "group": "tech",
    "title": "The questions Jensen Huang and Nvidia will still have to answer about Megaspeed",
    "link": "https://techcrunch.com/2026/11/25/the-questions-jensen-huang-and-nvidia-will-still-have-to-answer-about-megaspeed/",
    "date": "2026-11-25",
    "excerpt": "Huang still faces questions from Congress and his own board about his romantic relationship with an alleged chip smuggler.",
    "titleZh": "Jensen Huang 與 Nvidia 必須回答的 Megaspeed 問題",
    "takeaway": "列出 Nvidia 在高速運算與供應鏈透明度上仍面臨的政策與市場疑問。"
  },
  {
    "source": "TechCrunch",
    "group": "tech",
    "title": "Yale’s Sonnenfeld: Nvidia is a ‘detriment’ to US industrial might — not a champion",
    "link": "https://techcrunch.com/2026/11/24/yales-sonnenfeld-nvidia-is-a-detriment-to-u-s-industrial-might-not-a-champion/",
    "date": "2026-11-25",
    "excerpt": "Yale's Jeffrey Sonnenfeld warns that what the market cheered Monday, Jensen Huang's White House–backed return as Nvidia's CEO and board member, could prove a giant mistake, exposing the directors to \"historic\" personal…",
    "titleZh": "耶魯 Sonnenfeld：Nvidia 可能削弱美國工業實力",
    "takeaway": "警示 Nvidia 的市場主導地位或對美國製造業自主性產生負面影響，供政策制定者參考。"
  },
  {
    "source": "The Verge",
    "group": "tech",
    "title": "Tapo’s new indoor security camera includes a touchscreen for video calls",
    "link": "https://www.theverge.com/tech/1041221/tapo-c825-security-indoor-2k-camera-video-calls-tracking-pan-tilt",
    "date": "2026-11-25",
    "excerpt": "TP-Link's Tapo smart home brand announced a new indoor security camera that can help keep an eye on your house while you're away or connect you to family and friends while you're at home. The C825 upgrades a 2K…",
    "titleZh": "Tapo 新室內安全攝影機加入觸控螢幕支援視訊通話",
    "takeaway": "介紹具視訊通話功能的智慧攝影機，為居家安全與遠距互動提供新商機。"
  },
  {
    "source": "The Verge",
    "group": "tech",
    "title": "Has vibe coding made open source the new normal for synths?",
    "link": "https://www.theverge.com/ai-artificial-intelligence/1040081/vibe-coding-open-source-music-firmware",
    "date": "2026-11-25",
    "excerpt": "The emergence of powerful vibe-coding agents and tools like Reverse Engineer Anything has caused chaos in the music gear world, leaving companies scrambling to figure out how to respond. While some, like Roland, have…",
    "titleZh": "Vibe coding 讓開源成為合成器新常態？",
    "takeaway": "說明 AI 生成程式碼在音樂硬體領域的崛起，促使傳統廠商重新思考開源策略。"
  },
  {
    "source": "Wired",
    "group": "tech",
    "title": "‘Rejection Will Have Consequences’: Inside Team Trump’s Takeover of a Chips Giant",
    "link": "https://www.wired.com/story/inside-trumps-demands-to-another-chips-ceo/",
    "date": "2026-11-25",
    "excerpt": "Donald Trump’s dealings with Intel reveal yet another government-led pressure campaign involving a private company, court documents show.",
    "titleZh": "「拒絕將有後果」：川普接管晶片巨頭的內幕",
    "takeaway": "揭露政府介入晶片企業的手段，提醒產業在政治風險管理上的重要性。"
  },
  {
    "source": "Wired",
    "group": "tech",
    "title": "11 Things Jensen Huang Actually Said at His First All-Hands Back at Nvidia",
    "link": "https://www.wired.com/story/11-things-jensen-huang-actually-said-at-his-first-all-hands-back-at-nvidia/",
    "date": "2026-11-25",
    "excerpt": "The newly reinstated CEO discussed his daily therapy sessions, his reputation as a “tech bro,” his disdain for succession planning, and his relationship with President Trump.",
    "titleZh": "Jensen Huang 首次全員會上說的 11 件事",
    "takeaway": "彙整 Nvidia CEO 重返後的關鍵訊息，涵蓋治療、企業文化與政治關係等面向。"
  },
  {
    "source": "Springwise",
    "group": "tech",
    "title": "Plant-based alternative to traditional plastic",
    "link": "https://news.google.com/rss/articles/CBMikAFBVV95cUxOb25xdUhkT3Nsa3dkNVU5YUdCY3lYZUMyN21GNkFoc1FZYXZYUnNramxPUjRYMVV4TkFUYXpWMmQwQ2ZveHAtT1FtQmt3cEJKbHlGaHc5eTJLVmFWV0pRbC1WSWRMOVh5cEtlNmZoOHNXM21CUUwwOVhkZFdTcjN0bURVSXFPSmN3WG1Gc2dvc3fSAZwBQVVfeXFMT2lpamc3TlJoQmNtVE1hYkdxbXYwWkhuM2pWZkxXMGpyTUgyMGJ3eFFtNkFtTUJrV05qcDloNXZ3N2NST1RKLW9nbEJaMG82MUtZUkwzN25GRkVycVM4aTgyOWtBYU1hWFJFQmo3eUNzODhiNm5OY2pXdmtQUmo1VkpjM3lzMVhXRlRwTkJibWdiYkZ3RmcxanFsRjFu?oc=5",
    "date": "2026-11-25",
    "excerpt": "",
    "titleZh": "植物性替代傳統塑膠的新方案",
    "takeaway": "介紹以植物為基礎的可降解材料，為塑膠產業的永續轉型提供技術路徑。"
  },
  {
    "source": "Springwise",
    "group": "tech",
    "title": "Innovative cardboard inhaler enhances drug delivery",
    "link": "https://news.google.com/rss/articles/CBMiowFBVV95cUxObVhvY0lWUHdQT09PUm8ya0F5UUFaaEw4QkZHMHVGZWdDRGhwU2I5bm85bWFZUjNpRERCNEhqem0ydDlOMUd0ZVpCNFRULURuMkF5MVFQNWRtSlFtUnVTMXRGLW13OFV6QkNJM1pUbmdTdURWQjdLNEl2dTJzYldGeGw3XzZIaXlyMXd2QkpBQkkwQUhTSUJkdnp3T3k1R0k5dmZF0gGjAUFVX3lxTE5tWG9jSVZQd1BPT09SbzJrQXlRQVpoTDhCRkcwdUZlZ0NEaHBTYjlubzltYVlSM2lEREI0SGp6bTJ0OU4xR3RlWkI0VFQtRG4yQXkxUVA1ZG1KUW1SdVMxdEYtbXc4VXpCQ0kzWlRuZ1N1RFZCN0s0SXZ1MnNiV0Z4bDdfNkhpeXIxd3ZCSkFCSTBBSFNJQmR2endPeTVHSTl2ZkU?oc=5",
    "date": "2026-11-25",
    "excerpt": "",
    "titleZh": "創新紙板吸入器提升藥物傳遞效率",
    "takeaway": "說明紙板吸入器的設計優勢，可能改變呼吸道藥物的配送方式與成本結構。"
  },
  {
    "source": "Lenny's Newsletter",
    "group": "growth",
    "title": "Gemini 4 Neon beat GPT-6.2 and Claude in my 25-task AI benchmark",
    "link": "https://www.lennysnewsletter.com/p/gemini-4-neon-beat-gpt-62-and-claude",
    "date": "2026-11-25",
    "excerpt": "Watch now (32 mins) | 🎙️ My late-2026 How I AI bench: GPT-6.2 disappointed me, Opus 5.5 is my least annoying daily driver, and Gemini 4 Neon is now my top pick",
    "titleZh": "Gemini 4 Neon 在 25 項 AI 基準測試中擊敗 GPT-6.2 與 Claude",
    "takeaway": "展示最新大型模型在多任務表現上的領先，提示企業在 AI 研發與採購上的新選擇。"
  },
  {
    "source": "Lenny's Newsletter",
    "group": "growth",
    "title": "🎙️ How I AI: OpenClaw for executives: Automate every 1% annoyance",
    "link": "https://www.lennysnewsletter.com/p/how-i-ai-openclaw-for-executives",
    "date": "2026-11-24",
    "excerpt": "Your weekly listens from How I AI, part of the Lenny’s Podcast Network",
    "titleZh": "OpenClaw 為主管自動化 1% 煩惱",
    "takeaway": "介紹可自動化日常小問題的工具，協助管理層提升效率與減少認知負荷。"
  },
  {
    "source": "HubSpot Blog",
    "group": "growth",
    "title": "CRM for political campaigns: Key terms and FAQs answered",
    "link": "https://blog.hubspot.com/marketing/crm-for-political-campaigns",
    "date": "2026-11-25",
    "excerpt": "A political campaign CRM is a system for managing supporter relationships and coordinating campaign interactions across teams. Unlike a general CRM, a political campaign CRM focuses on the needs of election campaigns,…",
    "titleZh": "政治活動 CRM：關鍵術語與常見問答",
    "takeaway": "說明政治選舉專用 CRM 的功能與需求，協助政黨提升選民關係管理。"
  },
  {
    "source": "Shopify Blog",
    "group": "growth",
    "title": "How To Make Stickers To Sell in 9 Steps (2027)",
    "link": "https://news.google.com/rss/articles/CBMiZEFVX3lxTE9YUzlQQVQ4TzJNZ25TajdFU2UyWVhDUklodGhaM1RIdi0wWkJsTGVCeXpZY0dKSGJMXzJSY21MRTJfMFA4ZHNkbFpBWGFsSXVJRmM5UXBQczlkTFJyS0NiV1Z4WHE?oc=5",
    "date": "2026-11-21",
    "excerpt": "",
    "titleZh": "如何製作貼紙販售：9 步驟指南（2027）",
    "takeaway": "提供貼紙商品化的完整流程，適合創業者快速上手小型商品銷售。"
  },
  {
    "source": "Shopify Blog",
    "group": "growth",
    "title": "Do You Need an LLC for Dropshipping? Key Considerations (2026)",
    "link": "https://news.google.com/rss/articles/CBMickFVX3lxTE9TbE9lV2Y4OGdwX0Uwa0doRldXRDRvaVF0Ry1FMGhjSE1rRER2Y3Y2d3BSY1VtcV9IUlBXb0JINTlJemZtNzkzUFl0NmtFbVllX0d6d2Z2N1hMMm44LXlHZ1BkWDQ4SzlNRTloN0RHaF9oZw?oc=5",
    "date": "2026-11-20",
    "excerpt": "",
    "titleZh": "Dropshipping 是否需要 LLC？關鍵考量（2026）",
    "takeaway": "解析在代發貨模式下成立 LLC 的法律與稅務優缺點，供創業者決策參考。"
  },
  {
    "source": "Entrepreneur",
    "group": "smb",
    "title": "She Came Up With Her Business Idea While Juggling Law School, Divorce and a Custody Battle. Now She’s on Track for 8-Figure Revenue.",
    "link": "https://www.entrepreneur.com/building-a-business/i-was-wrung-out-she-juggled-divorce-a-custody-battle-and-law-school",
    "date": "2026-11-25",
    "excerpt": "Hannah Hembree Bell left a big law practice to start her own law firm shaped by her own divorce experience.",
    "titleZh": "她在法學院、離婚與監護爭奪中孕育商業點子，現正朝 8 位數營收邁進",
    "takeaway": "說明個人危機如何轉化為法律服務創業機會，啟發創業者從痛點出發。"
  },
  {
    "source": "Entrepreneur",
    "group": "smb",
    "title": "How Asking Teams to Flag Problems Earlier Can Create a New Challenge for Leaders",
    "link": "https://www.entrepreneur.com/building-a-business/how-asking-teams-to-flag-problems-earlier-can-create-a-new-challenge-for-leaders",
    "date": "2026-11-25",
    "excerpt": "Identifying risks early isn't enough if no one has the authority to act.",
    "titleZh": "要求團隊提前標記問題會為領導者帶來新挑戰",
    "takeaway": "指出早期風險標示若缺乏執行權限，會增加領導者的決策負擔與組織摩擦。"
  },
  {
    "source": "Entrepreneur",
    "group": "smb",
    "title": "Your Company May Be Acting on Decisions Nobody Actually Approved. Here’s How It Happens (and What It Costs).",
    "link": "https://www.entrepreneur.com/building-a-business/your-company-may-be-acting-on-decisions-nobody-actually-approved-heres-how-it-happens-and-what-it-costs",
    "date": "2026-11-25",
    "excerpt": "Commitments built on a working assumption can give it the weight of a decision, even though no one actually decided anything.",
    "titleZh": "公司可能在未經批准的決策上行動，成本與風險何在？",
    "takeaway": "闡述隱性決策流程的隱藏成本，提醒企業加強決策透明度與責任追蹤。"
  },
  {
    "source": "Small Business Trends",
    "group": "smb",
    "title": "Conducting Effective Performance Discussions: A Step-by-Step Guide",
    "link": "https://smallbiztrends.com/performance-discussion/",
    "date": "2026-11-25",
    "excerpt": "Unlock the secrets to successful performance discussions with our step-by-step guide. Learn effective techniques to engage in meaningful conversations that drive improvement and motivate your team.",
    "titleZh": "有效績效對話的步驟指南",
    "takeaway": "提供績效面談的逐步技巧，協助管理者提升員工表現與動機。"
  },
  {
    "source": "Small Business Trends",
    "group": "smb",
    "title": "7 Essential Steps for a Digital Transformation Roadmap",
    "link": "https://smallbiztrends.com/digital-transformation-roadmap/",
    "date": "2026-11-25",
    "excerpt": "Discover the 7 essential steps for creating an effective digital transformation roadmap. Learn how to navigate the complexities of digital change and drive your organization’s success in the digital age.",
    "titleZh": "數位轉型路線圖的 7 個關鍵步驟",
    "takeaway": "列出制定數位化策略的核心階段，幫助組織系統化推動轉型計畫。"
  }
];
