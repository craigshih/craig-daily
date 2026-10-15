# Craig 的日常

個人日常網站：每日晨報、市場先生洞察、讀過的論文與筆記、青年補助與獎學金，四套動漫主題（芙莉蓮 / RE:0 / 我推 / 敗北女角）。

- 公開網站：https://craigshih.github.io/craig-daily/
- 本機版：http://localhost:8793/daily-site/（LaunchAgent `com.craig.dailysite` 開機自動啟動）

## 更新方式
| 內容 | 檔案 | 怎麼更新 |
|---|---|---|
| 每日市場洞察 | `data/market.js` | **自動**：GitHub Action 每天台灣 06:00 跑 `scripts/fetch_market.py`（市場先生、MacroMicro、HBR、Business Insider、Fast Company、TechCrunch、The Verge、Wired、Springwise、Lenny's Newsletter、Brian Balfour／Reforge、HubSpot、Shopify、Entrepreneur、Small Business Trends）。在 repo 的 Settings → Secrets 加 `ANTHROPIC_API_KEY` 就會多出中文重點與今日總覽 |
| 每日晨報 | `data/brief.js` | 對 Claude 說「更新晨報」 |
| 讀過的論文 | `data/papers.js` | 在 Notion「📚 論文資料庫」寫筆記、勾「公開到網站」，再對 Claude 說「同步論文」 |
| 筆記、實驗室行事曆 | `data/notes.js`、`data/lab.js` | `node sync.js` |
| 青年補助・獎學金 | `data/funding.js` | 手動（一到兩週一次） |
| 個人簡介 | `data/profile.js` | 手動 |
| 動漫主題 | `data/themes.js` | 每天自動輪替，不用選 |

本機手動抓市場文章：`SSL_CERT_FILE=/etc/ssl/cert.pem python3 scripts/fetch_market.py`

改完 `git push`，Action 會自動部署。改了 CSS / JS 記得把 `index.html` 裡的 `?v=` 版本號加一。

動畫用 GSAP + ScrollTrigger（cdnjs），載入失敗時頁面照常顯示。

## 動漫主視覺
圖片外連各作品官方網站，不存進這個 repo，版權屬原作者與製作委員會。官方換掉圖片網址時，主視覺會自動退回主題漸層，到 `data/themes.js` 換新網址即可。

## 新增主題
1. 在 `data/themes.js` 加一筆（id、名稱、符號、主視覺網址、標語）
2. 在 `styles.css` 複製一段 `[data-theme="..."]` 色票改顏色
