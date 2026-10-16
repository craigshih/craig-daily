"""便利貼：把 Notion「📌 便利貼」資料庫同步成 data/stickies.js（勾「不公開」的不會同步）

GitHub Action（.github/workflows/stickies.yml）每小時整點跑一次，需要 repo secret NOTION_TOKEN，
而且資料庫要在 Notion 右上角 ••• → 連結（Connections）加入那個整合。
沒有金鑰時直接跳過，網站沿用現有的便利貼。
"""
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fetch_market import SSL_CTX, TW  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "stickies.js")
DATABASE_ID = "ad81686b08fe4394ac4c3186529a85fe"
DATA_SOURCE_ID = "2d9dba43-0b42-4da1-a27a-75ff0cfdc2a0"
DB_URL = "https://app.notion.com/p/ad81686b08fe4394ac4c3186529a85fe"
FORM_URL = DB_URL + "?v=3fb40356b27a8126a2ba000c12eb1e3e"  # ✏️ 快速記一張（表單檢視）


def notion(path, token, version, body):
    req = urllib.request.Request(
        f"https://api.notion.com/v1/{path}", data=json.dumps(body).encode(), method="POST",
        headers={"Authorization": f"Bearer {token}", "Notion-Version": version, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=60, context=SSL_CTX) as r:
        return json.loads(r.read())


def query_all(token):
    """先用新版 data source API，不行再退回舊版 database API。"""
    body = {"page_size": 100, "sorts": [{"timestamp": "created_time", "direction": "descending"}],
            "filter": {"property": "不公開", "checkbox": {"equals": False}}}
    routes = [(f"data_sources/{DATA_SOURCE_ID}/query", "2025-09-03"), (f"databases/{DATABASE_ID}/query", "2022-06-28")]
    last = None
    for path, version in routes:
        rows, cursor = [], None
        try:
            while True:
                data = notion(path, token, version, {**body, **({"start_cursor": cursor} if cursor else {})})
                rows += data.get("results", [])
                cursor = data.get("next_cursor")
                if not data.get("has_more") or len(rows) >= 300:
                    return rows
        except urllib.error.HTTPError as e:
            last = f"{e.code} {e.read()[:200]!r}"
            print(f"Notion {path} 失敗：{last}", file=sys.stderr)
    raise RuntimeError(last)


def plain(prop):
    items = (prop or {}).get("title") or (prop or {}).get("rich_text") or []
    return "".join(t.get("plain_text", "") for t in items).strip()


def to_sticky(page):
    p = page.get("properties", {})
    created = datetime.fromisoformat(page["created_time"].replace("Z", "+00:00")).astimezone(TW)
    return {
        "text": plain(p.get("Takeaway")),
        "note": plain(p.get("補充")),
        "tags": [o["name"] for o in (p.get("標籤") or {}).get("multi_select", [])],
        "color": ((p.get("顏色") or {}).get("select") or {}).get("name", ""),
        "link": (p.get("連結") or {}).get("url") or "",
        "pinned": bool((p.get("釘選") or {}).get("checkbox")),
        "date": created.strftime("%Y-%m-%d"),
        "id": page["id"].replace("-", "")[:12],
    }


def main():
    token = os.environ.get("NOTION_TOKEN")
    if not token:
        print("沒有 NOTION_TOKEN，略過便利貼同步", file=sys.stderr)
        return
    stickies = [s for s in map(to_sticky, query_all(token)) if s["text"]]
    now = datetime.now(TW)
    now = now.replace(minute=now.minute - now.minute % 5)  # 顯示時間取到 :00 / :05
    body = json.dumps(stickies, ensure_ascii=False, indent=2)
    try:  # 內容沒變就不改檔案，避免每小時都產生一個 commit
        with open(OUT, encoding="utf-8") as f:
            if f"window.CD.stickies = {body};" in f.read():
                print(f"便利貼沒有變動（{len(stickies)} 張）", file=sys.stderr)
                return
    except OSError:
        pass
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("// 便利貼：Notion「📌 便利貼」資料庫的同步副本，由 scripts/sync_stickies.py 每小時整點更新，請在 Notion 編輯\n"
                "window.CD = window.CD || {};\n"
                f"window.CD.stickiesDb = {json.dumps(DB_URL)};\n"
                f"window.CD.stickiesForm = {json.dumps(FORM_URL)};\n"
                f"window.CD.stickiesSynced = {json.dumps(now.strftime('%Y-%m-%d %H:%M'))};\n"
                f"window.CD.stickies = {body};\n")
    print(f"便利貼已更新：{len(stickies)} 張", file=sys.stderr)


if __name__ == "__main__":
    main()
