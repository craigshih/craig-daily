"""每日市場洞察：抓各財經／商業網站最新文章，寫成 data/market.js

GitHub Action 每天跑一次（.github/workflows/daily-market.yml），本機也可以手動跑：
    python3 scripts/fetch_market.py

有設定 ANTHROPIC_API_KEY 時，會請 Claude 幫每篇寫一句中文重點、翻譯標題、整理今日總覽；
沒有金鑰就只放原文標題與摘要，網站一樣能看。
"""
import email.utils
import html
import json
import os
import re
import ssl
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "market.js")
TW = timezone(timedelta(hours=8))
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"


def gnews(query, lang="en"):
    """沒有 RSS 或擋爬蟲的網站，改用 Google News 搜尋該站的最新文章。"""
    loc = "hl=zh-TW&gl=TW&ceid=TW:zh-Hant" if lang == "zh" else "hl=en-US&gl=US&ceid=US:en"
    return f"https://news.google.com/rss/search?q={urllib.parse.quote(query)}&{loc}"


GROUPS = [
    ("tw", "台灣財經"),
    ("strategy", "商業與戰略"),
    ("tech", "科技・新創・創投"),
    ("growth", "行銷・產品・增長"),
    ("smb", "創業與中小企業"),
]

# (名稱, 分組, 網址, 最多幾篇, 幾天內算新)
SOURCES = [
    ("市場先生", "tw", "https://rich01.com/feed/", 3, 7),
    ("MacroMicro 財經M平方", "tw", gnews("site:macromicro.me/blog when:7d", "zh"), 3, 7),
    ("Harvard Business Review", "strategy", gnews("site:hbr.org/2026 when:7d"), 3, 7),
    ("Business Insider", "strategy", gnews("site:businessinsider.com when:2d"), 3, 3),
    ("Fast Company", "strategy", "https://www.fastcompany.com/latest/rss", 3, 3),
    ("TechCrunch", "tech", "https://techcrunch.com/feed/", 3, 3),
    ("The Verge", "tech", "https://www.theverge.com/rss/index.xml", 2, 3),
    ("Wired", "tech", "https://www.wired.com/feed/category/business/latest/rss", 2, 4),
    ("Springwise", "tech", gnews("site:springwise.com when:7d"), 2, 7),
    ("Lenny's Newsletter", "growth", "https://www.lennysnewsletter.com/feed", 2, 14),
    ("Brian Balfour（Reforge）", "growth", "https://brianbalfour.com/essays?format=rss", 1, 30),
    ("HubSpot Blog", "growth", "https://blog.hubspot.com/marketing/rss.xml", 2, 4),
    ("Shopify Blog", "growth", gnews("site:shopify.com/blog when:7d"), 2, 7),
    ("Entrepreneur", "smb", "https://www.entrepreneur.com/latest.rss", 3, 3),
    ("Small Business Trends", "smb", "https://feeds2.feedburner.com/SmallBusinessTrends", 2, 4),
]


try:  # macOS 的 python.org 版本沒有內建憑證，有 certifi 就用它
    import certifi
    SSL_CTX = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    SSL_CTX = ssl.create_default_context()


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8"})
    with urllib.request.urlopen(req, timeout=25, context=SSL_CTX) as r:
        return r.read()


def text_of(el, *names):
    for n in names:
        found = el.find(n)
        if found is not None:
            if found.text and found.text.strip():
                return found.text.strip()
            if found.get("href"):
                return found.get("href")
    return ""


def parse_date(s):
    if not s:
        return None
    try:
        d = email.utils.parsedate_to_datetime(s)
    except (TypeError, ValueError):
        try:
            d = datetime.fromisoformat(s.replace("Z", "+00:00"))
        except ValueError:
            return None
    return d if d.tzinfo else d.replace(tzinfo=timezone.utc)


def clean(s, limit=220):
    s = re.sub(r"<[^>]+>", " ", html.unescape(s or ""))
    # WordPress 自動加的尾巴與更新日期
    s = re.sub(r"這篇文章.*?最早出現於.*$|The post .*? appeared first on .*$|\(最後更新：[^)]*\)|\[…\]|\[\.\.\.\]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s if len(s) <= limit else s[:limit].rsplit(" ", 1)[0] + "…"


def parse_feed(raw):
    root = ET.fromstring(raw)
    for el in root.iter():  # 去掉命名空間，Atom / RSS 用同一套欄位名
        if "}" in el.tag:
            el.tag = el.tag.split("}", 1)[1]
    items = root.findall(".//item") or root.findall(".//entry")
    for it in items:
        yield {
            "title": clean(text_of(it, "title"), 200),
            "link": text_of(it, "link"),
            "date": parse_date(text_of(it, "pubDate", "published", "updated", "date")),
            "excerpt": text_of(it, "description", "summary", "content"),
        }


# 不是文章的頁面（訂閱、會員中心、優惠碼）不要
JUNK = re.compile(r"subscription|my library|sign in|log in|coupon|promo code|% off|deals? (of|for) |^\W*$|^[-|｜\s]*shopify$", re.I)


def collect():
    now = datetime.now(timezone.utc)
    articles, status = [], []
    for name, group, url, limit, days in SOURCES:
        try:
            entries = list(parse_feed(fetch(url)))
        except Exception as e:  # 單一網站失敗不影響其他
            status.append({"source": name, "ok": False, "error": str(e)[:120]})
            print(f"✗ {name}: {e}", file=sys.stderr)
            continue
        fresh = [e for e in entries if e["date"] and now - e["date"] <= timedelta(days=days) and e["title"] and e["link"]]
        fresh.sort(key=lambda e: e["date"], reverse=True)
        seen, picked = set(), []
        for e in fresh:
            # Google News 標題結尾是「 - 網站名」，去掉
            title = e["title"]
            if "news.google.com" in url:  # 可能重複兩次，所以去兩輪
                for _ in range(3):
                    title = re.sub(r"\s*[-|｜]\s*[^-|｜]*(Review|Insider|Springwise|Shopify|MacroMicro|部落格|M平方)[^-|｜]*$", "", title, flags=re.I)
            title = re.sub(r"\s+\^\s*\w+$", "", title).strip(" -|｜")  # HBR 標題尾巴的文章代號
            if title in seen or len(title) < 12 or JUNK.search(title):
                continue
            seen.add(title)
            excerpt = "" if "news.google.com" in url else clean(e["excerpt"])
            picked.append({
                "source": name, "group": group, "title": title, "link": e["link"],
                "date": e["date"].astimezone(TW).strftime("%Y-%m-%d"),
                "excerpt": excerpt, "titleZh": "", "takeaway": "",
            })
            if len(picked) >= limit:
                break
        status.append({"source": name, "ok": True, "count": len(picked)})
        print(f"✓ {name}: {len(picked)}", file=sys.stderr)
        articles += picked
    return articles, status


SUMMARY_SCHEMA = {
    "type": "object",
    "properties": {
        "summary": {"type": "string"},
        "watch": {"type": "array", "items": {"type": "string"}},
        "items": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "i": {"type": "integer"},
                    "titleZh": {"type": "string"},
                    "takeaway": {"type": "string"},
                },
                "required": ["i", "titleZh", "takeaway"],
                "additionalProperties": False,
            },
        },
    },
    "required": ["summary", "watch", "items"],
    "additionalProperties": False,
}


def summarize(articles):
    """用 Claude 寫中文重點；沒有金鑰或呼叫失敗時回傳 None，網站改顯示原文。"""
    if not os.environ.get("ANTHROPIC_API_KEY") or not articles:
        return None
    try:
        import anthropic
    except ImportError:
        print("沒有安裝 anthropic，略過中文摘要", file=sys.stderr)
        return None

    listing = "\n".join(
        f"[{i}] ({a['source']}) {a['title']}" + (f" — {a['excerpt']}" if a["excerpt"] else "")
        for i, a in enumerate(articles)
    )
    prompt = (
        "你是一位幫台灣科技管理研究所碩士生整理每日財經與商業洞察的編輯。"
        "讀者關心產業變革、企業策略、金融科技、創新創業、供應鏈與宏觀經濟。\n\n"
        "以下是今天各網站的最新文章。請用繁體中文：\n"
        "1. summary：今天整體最值得注意的 2–3 個趨勢，寫成一段 80–120 字的總覽。\n"
        "2. watch：3 個值得持續追蹤的問題，每個 20 字內。\n"
        "3. items：每篇文章一筆，i 對應編號；titleZh 是精簡的中文標題（中文原文就照抄）；"
        "takeaway 是一句 30–50 字的重點，說明它對產業或商業決策的意義。只根據標題與摘要，不要編造數字。\n\n"
        + listing
    )
    try:
        client = anthropic.Anthropic()
        resp = client.beta.messages.create(
            model="claude-opus-5-5",
            max_tokens=16000,
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
            output_config={"effort": "low", "format": {"type": "json_schema", "schema": SUMMARY_SCHEMA}},
            messages=[{"role": "user", "content": prompt}],
        )
    except anthropic.APIStatusError as e:
        print(f"Claude API 錯誤 {e.status_code}，略過中文摘要", file=sys.stderr)
        return None
    except anthropic.APIConnectionError:
        print("連不上 Claude API，略過中文摘要", file=sys.stderr)
        return None
    if resp.stop_reason in ("refusal", "max_tokens"):
        print(f"Claude 回應中止（{resp.stop_reason}），略過中文摘要", file=sys.stderr)
        return None
    text = next((b.text for b in resp.content if b.type == "text"), "")
    return json.loads(text)


def main():
    articles, status = collect()
    if not articles:
        print("一篇都沒抓到，保留舊資料", file=sys.stderr)
        sys.exit(1)
    ai = summarize(articles)
    summary = None
    if ai:
        for row in ai["items"]:
            if 0 <= row["i"] < len(articles):
                articles[row["i"]]["titleZh"] = row["titleZh"]
                articles[row["i"]]["takeaway"] = row["takeaway"]
        summary = {"text": ai["summary"], "watch": ai["watch"]}

    now = datetime.now(TW)
    body = "\n".join([
        "// 每日市場洞察：由 scripts/fetch_market.py 自動產生（GitHub Action 每天台灣時間 06:00），請不要手動改",
        "window.CD = window.CD || {};",
        f"window.CD.marketUpdated = {json.dumps(now.strftime('%Y-%m-%d %H:%M'))};",
        f"window.CD.marketGroups = {json.dumps([{'id': g, 'name': n} for g, n in GROUPS], ensure_ascii=False)};",
        f"window.CD.marketSummary = {json.dumps(summary, ensure_ascii=False)};",
        f"window.CD.marketStatus = {json.dumps(status, ensure_ascii=False)};",
        f"window.CD.market = {json.dumps(articles, ensure_ascii=False, indent=2)};",
        "",
    ])
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(body)
    print(f"寫入 {len(articles)} 篇{'（含中文摘要）' if summary else ''}", file=sys.stderr)


if __name__ == "__main__":
    main()
