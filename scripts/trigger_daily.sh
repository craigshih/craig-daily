#!/bin/zsh
# 每天 06:00（LaunchAgent com.craig.dailysite-daily）觸發 GitHub Action 更新晨報與市場洞察。
# GitHub 自己的排程常晚 1–2 小時，用 workflow_dispatch 觸發幾秒內就會開始跑。
# Mac 睡著時錯過的那次，醒來會補跑；同一天跑兩次也沒關係（晨報一天只產生一次，市場文章會再更新）。
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$HOME/.local/bin"
echo "== $(date '+%F %H:%M') 觸發每日更新"
for i in 1 2 3; do  # 剛醒來網路可能還沒連上，失敗就等一下再試
  gh workflow run daily-market.yml -R craigshih/craig-daily && { echo "已觸發"; exit 0; }
  sleep 60
done
echo "觸發失敗，等 GitHub 06:05 的備援排程"
exit 1
