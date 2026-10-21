#!/bin/zsh
# 每 15 分鐘（LaunchAgent com.craig.dailysite-daily，整點與 :15 / :30 / :45）確認「每日」區塊有沒有更新：
# - 08:30 以前什麼都不做
# - 網路還沒好（Mac 剛醒常常這樣）就等下一輪，不會像以前試三次就放棄
# - 把本機副本拉到最新（http://localhost:8793/daily-site/ 看的是這份）
# - 實驗室行事曆與筆記一天同步一次（晨報會用到）
# - GitHub 上今天的晨報還沒產生，就觸發 daily-market.yml；同一天最多每 45 分鐘觸發一次
# GitHub 自己的排程常晚好幾個小時，只當備援。日誌：~/Library/Logs/dailysite-daily.log
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$HOME/.local/bin"
cd "$HOME/個人學習/daily-site" || exit 1
REPO=craigshih/craig-daily
STATE="$HOME/Library/Application Support/dailysite"
mkdir -p "$STATE"
today=$(date +%F)
stamp() { date '+%F %H:%M'; }

[ "$(date +%-H%M)" -lt 830 ] && exit 0

if ! curl -s -m 10 -o /dev/null https://api.github.com; then
  echo "$(stamp) 網路還沒好，15 分鐘後再試"
  exit 0
fi

git pull -q --rebase --autostash 2>/dev/null || echo "$(stamp) 本機副本更新失敗（下一輪再試）"

if [ "$(cat "$STATE/synced" 2>/dev/null)" != "$today" ]; then
  zsh scripts/local_sync.sh && echo "$today" > "$STATE/synced"
fi

brief_date=$(gh api -H "Accept: application/vnd.github.raw" "repos/$REPO/contents/data/brief.js" 2>/dev/null \
  | grep -m1 -o '"date": "[0-9-]*"' | cut -d'"' -f4)
[ "$brief_date" = "$today" ] && exit 0

running=$(gh run list -R "$REPO" --workflow daily-market.yml --limit 5 --json status \
  -q '[.[] | select(.status != "completed")] | length' 2>/dev/null)
if [ "${running:-0}" -gt 0 ]; then
  echo "$(stamp) 今天的更新正在跑，等它完成"
  exit 0
fi

last=$(cat "$STATE/triggered" 2>/dev/null)
if [ -n "$last" ] && [ $(( $(date +%s) - last )) -lt 2700 ]; then
  exit 0
fi

echo "== $(stamp) GitHub 上的晨報還是 ${brief_date:-（讀不到）}，觸發今天的更新"
if gh workflow run daily-market.yml -R "$REPO"; then
  date +%s > "$STATE/triggered"
  echo "已觸發"
else
  echo "觸發失敗，15 分鐘後再試"
fi
