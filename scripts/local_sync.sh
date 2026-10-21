#!/bin/zsh
# 每天 08:30 後由 scripts/daily_guard.sh 呼叫一次（網路好了才跑），把 FinTech Lab 的筆記與實驗室行事曆同步到 GitHub，
# 讓接著觸發的 GitHub Action 產生晨報時用到最新的行程。也可以手動執行。
set -e
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$HOME/.local/bin"
cd "$HOME/個人學習/daily-site"

echo "== $(date '+%F %H:%M') 開始同步"
git pull -q --rebase --autostash
node sync.js
git add data/notes.js data/lab.js
if git diff --cached --quiet; then
  echo "沒有變動"
else
  git commit -q -m "同步實驗室行事曆與筆記 $(date +%F)"
  git push -q
  echo "已推上 GitHub"
fi
