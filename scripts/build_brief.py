"""每日晨報：依今明兩天的實驗室行事曆、今天的市場洞察、閱讀中的論文，產生 data/brief.js

GitHub Action 每天跑（排在抓完市場文章之後），版型沿用 Claude 晨報：
標題一句話 + 地形線 + 三段時間 + 需要你處理 + 今天值得讀的。
有 GROQ_API_KEY 時由 Groq 寫成自然的中文；沒有或失敗時用固定模板。
公開網站：不寫任何同學名字。
"""
import json
import os
import subprocess
import sys
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fetch_market import TW, extract_json, groq_request  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "brief.js")
HOURS = list(range(7, 24))  # 地形線從 7:00 畫到 23:00


def load(name, *keys):
    """data/*.js 是給瀏覽器的 JS，用 node 執行後取出需要的欄位。"""
    js = f"global.window={{}};require({json.dumps(os.path.join(ROOT, 'data', name))});" \
         f"console.log(JSON.stringify({{{','.join(f'{k}: window.CD.{k}' for k in keys)}}}))"
    out = subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def hour_of(e):
    try:
        return int((e.get("time") or "").split(":")[0])
    except ValueError:
        return None


def terrain(events):
    """有時間的行程在那個時段拱起來；待辦截止也算一點負荷。平靜的日子就是接近水平的線。"""
    load_ = [0.15] * len(HOURS)
    for e in events:
        h = hour_of(e)
        if h is None:
            continue
        peak = 0.45 if e.get("type") == "event" else 0.3
        for i, hh in enumerate(HOURS):
            load_[i] += peak * max(0.0, 1 - abs(hh - h) / 2)
    return [round(min(v, 0.9), 2) for v in load_]


def period(h):
    if h is None:
        return None
    return 0 if h < 12 else 1 if h < 18 else 2


ACT_TIMES = ["早上 – 中午 12 點", "下午 12 – 6 點", "晚上 6 點以後"]


def fallback(today, todays, tomorrows, market, papers):
    """沒有 AI 時的固定版本。"""
    acts = []
    for p in range(3):
        items = [e["title"] for e in todays if period(hour_of(e)) == p]
        acts.append({"time": ACT_TIMES[p], "text": "、".join(items)[:60] if items else "沒有排定的行程，留給閱讀或整理筆記。"})
    needs = [{"title": e["title"][:30], "text": f"{'今天' if e in todays else '明天'}{' ' + e['time'] if e.get('time') else ''}在{{src}}上的待辦。",
              "srcLabel": "實驗室行事曆", "link": e.get("link", "")} for e in todays + tomorrows if e.get("type") == "todo"]
    busy = [e for e in todays if e.get("time")]
    headline = (f"今天有 {len(busy)} 個排定的時段，Craig——其餘時間留給閱讀。" if busy
                else "今天行事曆是空的，Craig——挑一篇論文好好讀完。")
    return {"headline": headline, "acts": acts, "needs": needs, "resolved": [], "picks": [0, 1, 2]}


def ask_groq(today, todays, tomorrows, market, papers):
    key = os.environ.get("GROQ_API_KEY")
    if not key:
        return None
    ev = lambda e: f"- {e['date']} {e.get('time') or '（全天）'}｜{e.get('type')}｜{e['title']}"
    lines_today = "\n".join(map(ev, todays)) or "（無）"
    lines_tmr = "\n".join(map(ev, tomorrows)) or "（無）"
    lines_mkt = "\n".join(f"[{i}] {m.get('titleZh') or m['title']}（{m['source']}）" for i, m in enumerate(market[:30]))
    lines_pap = "\n".join(f"- {p['title']}（{p.get('status', '')}）" for p in papers) or "（無）"
    prompt = f"""你在幫台灣的碩士生 Craig 寫「每日晨報」，語氣像朋友把一天交到他手上，繁體中文、台灣用語。
今天是 {today:%Y-%m-%d}（{'一二三四五六日'[today.weekday()]}）。這份晨報會公開在網站上，不要寫任何同學或他人的名字，只用「組長」「同學」。

今天的行程與待辦：
{lines_today}

明天的行程與待辦：
{lines_tmr}

今天的市場文章（編號）：
{lines_mkt}

閱讀中的論文：
{lines_pap}

請只輸出 JSON：
{{
  "headline": "一句話，20–40 字，點出今天最有特色的一件事或整天的節奏，句中自然地叫一次 Craig",
  "acts": [{{"time": "{ACT_TIMES[0]}", "text": "這段時間的一句話建議"}}, {{"time": "{ACT_TIMES[1]}", "text": "…"}}, {{"time": "{ACT_TIMES[2]}", "text": "…"}}],
  "needs": [{{"title": "10 字左右，用自己的話", "text": "一句話說明要做什麼、為什麼今天要處理，句中放一次 {{src}} 代表來源", "event": 對應行程在今天＋明天清單中的序號（從 0 起算，今天在前），沒有就填 -1}}],
  "picks": [三篇今天最值得 Craig 讀的市場文章編號],
  "pickWhy": ["每篇一句話：對他的研究或課業有什麼用"]
}}
needs 只放真的需要他今天動手的事（待辦、截止、要準備的行程），沒有就給空陣列。不要編造清單裡沒有的事情。"""
    model = os.environ.get("GROQ_MODEL") or "openai/gpt-oss-120b"
    for _ in range(3):
        try:
            data = groq_request("chat/completions", key, {
                "model": model, "messages": [{"role": "user", "content": prompt}], "temperature": 0.4,
                "max_completion_tokens": 6000, "response_format": {"type": "json_object"},
                **({"reasoning_effort": "low"} if "gpt-oss" in model else {}),
            })
            out = extract_json(data["choices"][0]["message"]["content"])
            if out.get("headline") and isinstance(out.get("acts"), list) and len(out["acts"]) == 3:
                print(f"Groq {model} 完成晨報", file=sys.stderr)
                return out
        except Exception as e:  # 任何錯誤都改用模板，不讓晨報開天窗
            print(f"Groq 晨報失敗：{e}", file=sys.stderr)
    return None


def main():
    now = datetime.now(TW)
    today = now.date()
    tomorrow = today + timedelta(days=1)
    lab = load("lab.js", "lab").get("lab") or []
    market = load("market.js", "market").get("market") or []
    papers = load("papers.js", "papers").get("papers") or []
    sort_key = lambda e: (e["date"], e.get("time") or "99")
    todays = sorted([e for e in lab if e["date"] == str(today)], key=sort_key)
    tomorrows = sorted([e for e in lab if e["date"] == str(tomorrow)], key=sort_key)
    reading = [p for p in papers if "閱讀中" in (p.get("status") or "")]

    ai = ask_groq(today, todays, tomorrows, market, reading)
    base = ai or fallback(today, todays, tomorrows, market, reading)
    both = todays + tomorrows
    needs = []
    for n in base.get("needs") or []:
        idx = n.get("event", -1)
        e = both[idx] if isinstance(idx, int) and 0 <= idx < len(both) else None
        text = str(n.get("text") or "")
        if "{src}" not in text:
            text += "（{src}）"
        needs.append({"title": str(n.get("title") or "")[:40], "text": text,
                      "srcLabel": n.get("srcLabel") or "實驗室行事曆", "link": n.get("link") or (e or {}).get("link", "")})

    picks = [i for i in base.get("picks") or [] if isinstance(i, int) and 0 <= i < len(market)][:3] or list(range(min(3, len(market))))
    why = base.get("pickWhy") or []
    read_items = [{"title": market[i].get("titleZh") or market[i]["title"],
                   "text": (str(why[k]) if k < len(why) and why[k] else market[i].get("takeaway") or "今天的市場文章。") + "（{src}）",
                   "srcLabel": market[i]["source"], "link": market[i]["link"]} for k, i in enumerate(picks)]
    read_items += [{"title": p["title"], "text": "這篇還在閱讀中，挑一段整理進 {src}。", "srcLabel": "Notion 論文資料庫", "link": ""} for p in reading[:2]]

    timed = [e for e in todays if e.get("time")]
    brief = {
        "date": str(today),
        "dayType": "HEAVY" if len(timed) >= 4 else "OPEN" if not timed else "NORMAL",
        "headline": str(base["headline"]),
        "terrain": terrain(todays),
        "acts": [{"time": ACT_TIMES[k], "text": str((base["acts"][k] or {}).get("text") or "")} for k in range(3)],
        "needs": needs,
        "resolved": [],
        "sections": [{"title": "今天值得讀的", "items": read_items}] if read_items else [],
        "generated": "ai" if ai else "template",
    }
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("// 每日晨報：由 scripts/build_brief.py 自動產生（GitHub Action 每天台灣時間 06:05），請不要手動改\n"
                "// 版型沿用 Claude 晨報（/morning）；公開網站不寫同學名字\n"
                "window.CD = window.CD || {};\n"
                f"window.CD.brief = {json.dumps(brief, ensure_ascii=False, indent=2)};\n")
    print(f"晨報 {today} 完成（{'AI' if ai else '模板'}），待辦 {len(needs)} 件", file=sys.stderr)


if __name__ == "__main__":
    main()
