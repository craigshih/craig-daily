"""把網站上的便利貼編輯寫回 Notion

網站（編輯模式）每次儲存，會用你的 GitHub 金鑰在 repo 的 edits/ 放一個 JSON：
  {"op": "create" | "update" | "delete", "id": "Notion 頁面 id（新增時沒有）",
   "fields": {"text", "note", "tags", "color", "link", "pinned", "private"}, "at": 毫秒時間}
.github/workflows/sticky-edits.yml 收到推送後跑這支程式：依時間順序套用到 Notion、刪掉處理完的檔案，
再由 sync_stickies.py 重新同步網站。需要 NOTION_TOKEN，且整合要有「插入內容」與「更新內容」權限。
"""
import glob
import json
import os
import sys
import urllib.error
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fetch_market import SSL_CTX  # noqa: E402
from sync_stickies import DATABASE_ID  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TAGS = {"投資理財", "課堂", "研究", "產業觀察", "靈感", "生活", "金句"}
COLORS = {"黃", "粉", "藍", "綠", "紫"}


def notion(method, path, token, body):
    req = urllib.request.Request(
        f"https://api.notion.com/v1/{path}", data=json.dumps(body).encode() if body is not None else None, method=method,
        headers={"Authorization": f"Bearer {token}", "Notion-Version": "2022-06-28", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=60, context=SSL_CTX) as r:
        return json.loads(r.read())


def rich(s, limit=2000):
    s = str(s or "").strip()[:limit]
    return [{"type": "text", "text": {"content": s}}] if s else []


def properties(f):
    """只送有出現的欄位，沒提到的欄位在 Notion 上保持不變。"""
    p = {}
    if "text" in f:
        p["Takeaway"] = {"title": rich(f["text"], 500)}
    if "note" in f:
        p["補充"] = {"rich_text": rich(f["note"])}
    if "tags" in f:
        # 網站可以打新標籤，Notion 會自動新增選項；名稱不能有逗號
        tags = [str(t).replace(",", "，").strip()[:40] for t in (f["tags"] or []) if str(t).strip()]
        p["標籤"] = {"multi_select": [{"name": t} for t in dict.fromkeys(tags)][:10]}
    if "color" in f:
        p["顏色"] = {"select": {"name": f["color"]} if f["color"] in COLORS else None}
    if "link" in f:
        link = str(f["link"] or "").strip()
        p["連結"] = {"url": link if link.startswith(("http://", "https://")) else None}
    if "pinned" in f:
        p["釘選"] = {"checkbox": bool(f["pinned"])}
    if "private" in f:
        p["不公開"] = {"checkbox": bool(f["private"])}
    return p


def apply(edit, token):
    op, fields = edit.get("op"), edit.get("fields") or {}
    page_id = str(edit.get("id") or "").replace("-", "")
    if op == "create":
        if not str(fields.get("text") or "").strip():
            return "略過：沒有內容"
        notion("POST", "pages", token, {"parent": {"database_id": DATABASE_ID}, "properties": properties(fields)})
        return "已新增"
    if len(page_id) != 32 or not all(c in "0123456789abcdef" for c in page_id.lower()):
        return f"略過：頁面 id 不正確（{page_id[:40]}）"
    # 只允許改便利貼資料庫裡的頁面，避免被拿去改 Notion 的其他頁面
    parent = notion("GET", f"pages/{page_id}", token, None).get("parent", {})
    if parent.get("database_id", "").replace("-", "") != DATABASE_ID:
        return "略過：這個頁面不在便利貼資料庫"
    if op == "update":
        notion("PATCH", f"pages/{page_id}", token, {"properties": properties(fields)})
        return "已修改"
    if op == "delete":
        notion("PATCH", f"pages/{page_id}", token, {"archived": True})
        return "已移到垃圾桶"
    return f"略過：不認得的動作 {op}"


def main():
    token = os.environ.get("NOTION_TOKEN")
    files = sorted(glob.glob(os.path.join(ROOT, "edits", "*.json")))
    if not files:
        print("沒有待處理的編輯", file=sys.stderr)
        return
    if not token:
        print("沒有 NOTION_TOKEN，編輯先留著", file=sys.stderr)
        sys.exit(1)
    edits = []
    for path in files:
        try:
            with open(path, encoding="utf-8") as f:
                edits.append((json.load(f), path))
        except (OSError, ValueError) as e:
            print(f"{os.path.basename(path)} 讀不到：{e}，刪掉", file=sys.stderr)
            os.remove(path)
    failed = 0
    for edit, path in sorted(edits, key=lambda x: x[0].get("at", 0)):
        try:
            print(f"{os.path.basename(path)}：{apply(edit, token)}", file=sys.stderr)
            os.remove(path)
        except urllib.error.HTTPError as e:
            body = e.read()[:300]
            print(f"{os.path.basename(path)} 失敗 {e.code}：{body!r}", file=sys.stderr)
            if e.code in (400, 404):  # 內容或頁面本身有問題，重試也沒用
                os.remove(path)
            else:
                failed += 1
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
