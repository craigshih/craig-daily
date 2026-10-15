"""每日市場洞察：抓各財經／商業網站最新文章，寫成 data/market.js

GitHub Action 每天跑一次（.github/workflows/daily-market.yml），本機也可以手動跑：
    python3 scripts/fetch_market.py

有設定 GROQ_API_KEY（或 ANTHROPIC_API_KEY）時，會請 AI 幫每篇寫一句中文重點、翻譯標題、整理今日總覽；
沒有金鑰就只放原文標題與摘要，網站一樣能看。
"""
import email.utils
import html
import json
import os
import re
import ssl
import sys
import urllib.error
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
    ("市場先生", "tw", ["https://rich01.com/feed/", gnews("site:rich01.com when:7d", "zh")], 3, 7),
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
    for name, group, urls, limit, days in SOURCES:
        entries, err = None, None
        for url in urls if isinstance(urls, list) else [urls]:  # 第一個網址被擋就換備用的
            try:
                entries = list(parse_feed(fetch(url)))
                break
            except Exception as e:
                err = e
        if entries is None:  # 單一網站失敗不影響其他
            status.append({"source": name, "ok": False, "error": str(err)[:120]})
            print(f"✗ {name}: {err}", file=sys.stderr)
            continue
        fresh = [e for e in entries if e["date"] and now - e["date"] <= timedelta(days=days) and e["title"] and e["link"]]
        fresh.sort(key=lambda e: e["date"], reverse=True)
        seen, picked = set(), []
        for e in fresh:
            # Google News 標題結尾是「 - 網站名」，去掉
            title = e["title"]
            if "news.google.com" in url:  # 可能重複兩次，所以去兩輪
                for _ in range(3):
                    title = re.sub(r"\s*[-|｜]\s*[^-|｜]*(Review|Insider|Springwise|Shopify|MacroMicro|部落格|M平方|市場先生|Mr\.Market)[^-|｜]*$", "", title, flags=re.I)
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


def build_prompt(articles):
    listing = "\n".join(
        f"[{i}] ({a['source']}) {a['title']}" + (f" — {a['excerpt']}" if a["excerpt"] else "")
        for i, a in enumerate(articles)
    )
    return (
        "你是一位幫台灣科技管理研究所碩士生整理每日財經與商業洞察的編輯。"
        "讀者關心產業變革、企業策略、金融科技、創新創業、供應鏈與宏觀經濟。\n\n"
        "以下是今天各網站的最新文章。請用繁體中文（台灣用語與譯名，例如 Trump 譯「川普」）：\n"
        "1. summary：今天整體最值得注意的 2–3 個趨勢，寫成一段 80–120 字的總覽。\n"
        "2. watch：3 個值得持續追蹤的問題，每個 20 字內。\n"
        "3. items：每篇文章一筆，i 對應編號；titleZh 是把標題翻成繁體中文的精簡標題（英文標題一定要翻譯，不可保留英文原文；中文原文就照抄）；"
        "takeaway 是一句 30–50 字的重點，說明它對產業或商業決策的意義。只根據標題與摘要，不要編造數字。\n\n"
        "只輸出 JSON，格式：{\"summary\": \"…\", \"watch\": [\"…\"], \"items\": [{\"i\": 0, \"titleZh\": \"…\", \"takeaway\": \"…\"}]}\n"
        "titleZh 範例：「Managers Need to Get Better at Killing Digital Products」→「主管要學會果斷收掉數位產品」。\n\n"
        + listing
    )


def groq_request(path, key, payload=None):
    req = urllib.request.Request(
        f"https://api.groq.com/openai/v1/{path}",
        data=json.dumps(payload).encode() if payload else None,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json", "User-Agent": UA},
    )
    with urllib.request.urlopen(req, timeout=180, context=SSL_CTX) as r:
        return json.loads(r.read())


def extract_json(text):
    """從回覆中取出第一個完整的 JSON 物件（模型偶爾會在前後加說明）。"""
    text = re.sub(r"^```(?:json)?|```$", "", (text or "").strip(), flags=re.M)
    start = text.find("{")
    if start < 0:
        raise ValueError("沒有 JSON")
    return json.JSONDecoder().raw_decode(text[start:])[0]


def summarize_groq(prompt):
    """Groq（OpenAI 相容 API）。GROQ_MODEL 可指定模型，預設 gpt-oss-120b；
    失敗時依序重試、改用不強制 JSON 的模式，最後從 Groq 現有模型清單挑其他模型。"""
    key = os.environ["GROQ_API_KEY"]
    models = [os.environ.get("GROQ_MODEL") or "openai/gpt-oss-120b", "openai/gpt-oss-20b"]
    try:  # Groq 模型常更換，從即時清單補上可用的備援
        live = [m["id"] for m in groq_request("models", key).get("data", [])]
        models = [m for m in models if m in live] + [m for m in live if re.search(r"gpt-oss|qwen|llama-4|kimi", m) and m not in models]
    except Exception as e:
        print(f"讀不到 Groq 模型清單：{e}", file=sys.stderr)
    attempts = [(m, mode) for m in models[:4] for mode in ("json", "json", "text")]
    for model, mode in attempts:
        payload = {"model": model, "messages": [{"role": "user", "content": prompt}], "temperature": 0.3, "max_completion_tokens": 16000}
        if mode == "json":
            payload["response_format"] = {"type": "json_object"}
        if "gpt-oss" in model:
            payload["reasoning_effort"] = "low"  # 推理少一點，把 token 留給輸出
        try:
            data = groq_request("chat/completions", key, payload)
            result = extract_json(data["choices"][0]["message"]["content"])
            if isinstance(result.get("items"), list) and result["items"]:
                print(f"Groq {model}（{mode}）完成中文摘要", file=sys.stderr)
                return result
            print(f"Groq {model}（{mode}）回傳格式不完整", file=sys.stderr)
        except urllib.error.HTTPError as e:
            body = e.read()[:160]
            print(f"Groq {model}（{mode}）錯誤 {e.code}：{body!r}", file=sys.stderr)
            if e.code in (401, 403):
                return None  # 金鑰問題，重試也沒用
            if e.code == 404:
                continue
        except (urllib.error.URLError, ValueError, KeyError, TimeoutError) as e:
            print(f"Groq {model}（{mode}）失敗：{e}", file=sys.stderr)
    return None


HAS_CJK = re.compile(r"[\u4e00-\u9fff]")


def translate_titles_groq(articles):
    """第一輪沒翻成中文的標題，再用一次小請求只做翻譯。"""
    todo = [i for i, a in enumerate(articles) if not HAS_CJK.search(a.get("titleZh") or a["title"])]
    if not todo or not os.environ.get("GROQ_API_KEY"):
        return
    lines = "\n".join(f"[{i}] {articles[i]['title']}" for i in todo)
    prompt = ("把下列英文新聞標題翻成精簡、通順的繁體中文（台灣用語與譯名，例如 Trump 譯「川普」），保留公司與人名的英文原名。"
              "只輸出 JSON：{\"titles\": [{\"i\": 編號, \"zh\": \"中文標題\"}]}\n\n" + lines)
    key = os.environ["GROQ_API_KEY"]
    model = os.environ.get("GROQ_MODEL") or "openai/gpt-oss-120b"
    for _ in range(2):
        try:
            data = groq_request("chat/completions", key, {
                "model": model, "messages": [{"role": "user", "content": prompt}], "temperature": 0.2,
                "max_completion_tokens": 8000, "response_format": {"type": "json_object"},
                **({"reasoning_effort": "low"} if "gpt-oss" in model else {}),
            })
            rows = extract_json(data["choices"][0]["message"]["content"]).get("titles", [])
            n = 0
            for row in rows:
                i, zh = row.get("i"), str(row.get("zh") or "")
                if isinstance(i, int) and 0 <= i < len(articles) and HAS_CJK.search(zh):
                    articles[i]["titleZh"] = zh
                    n += 1
            print(f"Groq 補翻標題 {n}/{len(todo)} 篇", file=sys.stderr)
            return
        except (urllib.error.HTTPError, urllib.error.URLError, ValueError, KeyError, TimeoutError) as e:
            print(f"Groq 補翻標題失敗：{e}", file=sys.stderr)


def summarize_claude(prompt):
    try:
        import anthropic
    except ImportError:
        print("沒有安裝 anthropic，略過中文摘要", file=sys.stderr)
        return None
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


def summarize(articles):
    """有 GROQ_API_KEY 用 Groq，有 ANTHROPIC_API_KEY 用 Claude；都沒有或失敗就回傳 None，網站改顯示原文。"""
    if not articles:
        return None
    prompt = build_prompt(articles)
    ai = None
    if os.environ.get("GROQ_API_KEY"):
        ai = summarize_groq(prompt)
    if ai is None and os.environ.get("ANTHROPIC_API_KEY"):
        ai = summarize_claude(prompt)
    if not ai or not isinstance(ai.get("items"), list):
        return None
    ai.setdefault("summary", "")
    ai.setdefault("watch", [])
    return ai


def reuse_previous(articles):
    """今天的 AI 摘要失敗時，同一篇文章沿用上一次的中文標題與重點。"""
    try:
        with open(OUT, encoding="utf-8") as f:
            m = re.search(r"window\.CD\.market = (\[.*\]);", f.read(), re.S)
        old = {a["link"]: a for a in json.loads(m.group(1))} if m else {}
    except (OSError, ValueError):
        return
    n = 0
    for a in articles:
        o = old.get(a["link"])
        if o and o.get("takeaway"):
            a["titleZh"], a["takeaway"] = o.get("titleZh", ""), o["takeaway"]
            n += 1
    print(f"AI 摘要失敗，沿用上一次的中文 {n} 篇", file=sys.stderr)


def main():
    articles, status = collect()
    if not articles:
        print("一篇都沒抓到，保留舊資料", file=sys.stderr)
        sys.exit(1)
    ai = summarize(articles)
    summary = None
    if not ai:
        reuse_previous(articles)
    if ai:
        for row in ai["items"]:
            i = row.get("i") if isinstance(row, dict) else None
            if isinstance(i, int) and 0 <= i < len(articles):
                articles[i]["titleZh"] = str(row.get("titleZh") or "")
                articles[i]["takeaway"] = str(row.get("takeaway") or "")
        summary = {"text": ai["summary"], "watch": ai["watch"]}
        translate_titles_groq(articles)
    for a in articles:  # 沒翻成中文的就留空，網站直接顯示原文標題
        if a["titleZh"] and not HAS_CJK.search(a["titleZh"]) and a["titleZh"] == a["title"]:
            a["titleZh"] = ""

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
