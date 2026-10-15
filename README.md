# Craig 的日常

個人日常網站：每日晨報、市場先生洞察、讀過的論文與筆記、青年補助與獎學金，四套動漫主題（芙莉蓮 / RE:0 / 我推 / 敗北女角）。

- 公開網站：https://craigshih.github.io/craig-daily/
- 本機版：http://localhost:8793/daily-site/（LaunchAgent `com.craig.dailysite` 開機自動啟動）

## 更新方式
| 檔案 | 內容 | 更新方式 |
|---|---|---|
| `data/brief.js` | 每日晨報（Claude /morning 版型） | 對 Claude 說「更新晨報」 |
| `data/market.js` | 市場先生最新文章、重點、我的心得 | 對 Claude 說「讀市場先生」（來源 rich01.com/feed/） |
| `data/papers.js` | Notion「📚 論文資料庫」勾選「公開到網站」的論文 | 對 Claude 說「同步論文」 |
| `data/notes.js`、`data/lab.js` | FinTech Lab 的 Notion 筆記、實驗室行事曆（去掉對話內容） | `node sync.js` |
| `data/funding.js` | 青年補助・獎學金 | 手動 / 請 Claude 查證更新 |
| `data/themes.js` | 動漫主題名稱、主視覺網址、標語（配色在 styles.css） | 手動 |

改完 `git push`，GitHub Pages 約一分鐘後更新。改了 CSS / JS 記得把 `index.html` 裡的 `?v=` 版本號加一，避免瀏覽器快取舊檔。

已讀標記、補助的「想申請／已申請」只存在各自瀏覽器的 localStorage。

## 動漫主視覺
圖片外連各作品官方網站，不存進這個 repo，版權屬原作者與製作委員會。官方換掉圖片網址時，主視覺會自動退回主題漸層，到 `data/themes.js` 換新網址即可。

## 新增主題
1. 在 `data/themes.js` 加一筆（id、名稱、符號、主視覺網址、標語）
2. 在 `styles.css` 複製一段 `[data-theme="..."]` 色票改顏色
