# Craig 的日常

個人日常網站：每日晨報、市場先生洞察、讀過的論文與筆記、青年補助與獎學金，四套動漫主題（芙莉蓮 / RE:0 / 我推 / 敗北女角）。

- 公開網站：https://craigshih.github.io/craig-daily/
- 本機版：http://localhost:8793/daily-site/（LaunchAgent `com.craig.dailysite` 開機自動啟動）

## 更新方式
| 內容 | 檔案 | 怎麼更新 |
|---|---|---|
| 每日市場洞察 | `data/market.js` | **自動**：GitHub Action 每天台灣 06:05 跑 `scripts/fetch_market.py`（市場先生、MacroMicro、HBR、Business Insider、Fast Company、TechCrunch、The Verge、Wired、Springwise、Lenny's Newsletter、Brian Balfour／Reforge、HubSpot、Shopify、Entrepreneur、Small Business Trends）。在 repo 的 Settings → Secrets 加 `GROQ_API_KEY`（或 `ANTHROPIC_API_KEY`）就會多出中文重點與今日總覽；Groq 預設用 `openai/gpt-oss-120b`，可在 Settings → Variables 設 `GROQ_MODEL` 換模型 |
| 每日晨報 | `data/brief.js` | **自動**：同一個 Action 抓完市場文章後跑 `scripts/build_brief.py`，依今明兩天的實驗室行事曆、今天的市場文章、閱讀中的論文，由 Groq 寫成 Claude 晨報版型（沒金鑰時用固定模板） |
| 讀過的論文 | `data/papers.js` | 在 Notion「📚 論文資料庫」寫筆記、勾「公開到網站」，再對 Claude 說「同步論文」 |
| 筆記、實驗室行事曆 | `data/notes.js`、`data/lab.js` | **自動**：本機 LaunchAgent `com.craig.dailysite-sync` 每天 05:40 跑 `scripts/local_sync.sh`（`node sync.js` 後推上 GitHub；Mac 睡著會在醒來補跑），日誌在 `~/Library/Logs/dailysite-sync.log` |
| 青年補助・獎學金 | `data/funding.js` | 手動（一到兩週一次） |
| 個人簡介 | `data/profile.js` | 手動 |
| 動漫主題 | `data/themes.js` | 每天自動輪替一部，當天在多張官方主視覺間輪播；`palette` 是四個霓虹色；鼠標與拖尾也跟著換（芙莉蓮花瓣、RE:0 雪花、我推星星、敗北女角太陽）。網址加 `?theme=oshinoko` 可預覽指定主題 |

本機手動抓市場文章：`SSL_CERT_FILE=/etc/ssl/cert.pem python3 scripts/fetch_market.py`

改完 `git push`，Action 會自動部署。改了 CSS / JS 記得把 `index.html` 裡的 `?v=` 版本號加一。

動畫：GSAP + ScrollTrigger（cdnjs，捲動進場）、mo.js（jsDelivr，點擊爆破與 Hero 幾何動畫，mojs.io 那套）。載入失敗或系統關閉動態效果時，頁面照常顯示。

## 動漫主視覺
圖片外連各作品官方網站，不存進這個 repo，版權屬原作者與製作委員會。官方換掉圖片網址時，主視覺會自動退回主題漸層，到 `data/themes.js` 換新網址即可。

## 新增主題
1. 在 `data/themes.js` 加一筆（id、名稱、符號、主視覺網址、標語）
2. 在 `styles.css` 複製一段 `[data-theme="..."]` 色票改顏色

## 時間
排程與網站上顯示的更新時間一律用尾數 :00 / :05（使用者偏好）：本機同步 05:40、GitHub Action 06:05；Action 偶爾晚幾分鐘才跑，顯示時會取到最近的 :00 / :05。
