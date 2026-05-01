#!/usr/bin/env python3
"""Fetch NHK RSS feeds and generate a concise daily Japanese news summary via Claude."""

import sys
import urllib.request
import xml.etree.ElementTree as ET
import anthropic
from datetime import datetime

NEWS_SOURCES = [
    {"name": "主要", "url": "https://www.nhk.or.jp/rss/news/cat0.xml"},
    {"name": "政治", "url": "https://www.nhk.or.jp/rss/news/cat1.xml"},
    {"name": "経済", "url": "https://www.nhk.or.jp/rss/news/cat3.xml"},
    {"name": "社会", "url": "https://www.nhk.or.jp/rss/news/cat4.xml"},
    {"name": "国際", "url": "https://www.nhk.or.jp/rss/news/cat6.xml"},
]

MAX_PER_SOURCE = 8
SYSTEM_PROMPT = """\
あなたは日本語ニュースの編集者です。
NHKニュースの記事一覧を受け取り、今日の重要なニュースを日本語で簡潔にまとめてください。

ルール：
- 各ニュースは2〜3文で要約する
- カテゴリ別（経済・ビジネス／政治／社会／国際）に整理する
- 記事に書かれていない情報を補完・推測しない
- 正確さを最優先にする
- 重複するニュースはまとめる\
"""


def fetch_rss(url: str) -> list[tuple[str, str]]:
    """Return list of (title, description) from an RSS feed URL."""
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        root = ET.fromstring(resp.read())

    ns = {"atom": "http://www.w3.org/2005/Atom"}
    items = root.findall(".//item") or root.findall(".//atom:entry", ns)
    results = []
    for item in items:
        title = (item.findtext("title") or item.findtext("atom:title", namespaces=ns) or "").strip()
        desc = (item.findtext("description") or item.findtext("atom:summary", namespaces=ns) or "").strip()
        if title:
            results.append((title, desc))
    return results


def fetch_articles() -> list[dict]:
    articles = []
    seen = set()

    for src in NEWS_SOURCES:
        try:
            entries = fetch_rss(src["url"])
        except Exception as e:
            print(f"⚠ {src['name']} の取得失敗: {e}", file=sys.stderr)
            continue

        count = 0
        for title, summary in entries:
            if count >= MAX_PER_SOURCE:
                break
            if title in seen:
                continue
            seen.add(title)
            articles.append({
                "category": src["name"],
                "title": title,
                "summary": summary,
            })
            count += 1

    return articles


def build_prompt(articles: list[dict]) -> str:
    today = datetime.now().strftime("%Y年%m月%d日")
    lines = [f"以下は {today} のNHKニュース一覧です。カテゴリ別に要約してください。\n"]

    current_cat = None
    for a in articles:
        if a["category"] != current_cat:
            current_cat = a["category"]
            lines.append(f"\n【{current_cat}】")
        lines.append(f"・{a['title']}")
        if a["summary"]:
            # Keep summaries short to stay within context
            lines.append(f"  {a['summary'][:150]}")

    lines.append(f"""
## 出力形式（Markdownで出力）

## 今日のニュース要約（{today}）

### 経済・ビジネス
- ...

### 政治
- ...

### 社会
- ...

### 国際
- ...

各項目は2〜3文で簡潔に。重要度の高い順に並べること。""")

    return "\n".join(lines)


def generate_summary(articles: list[dict]) -> None:
    client = anthropic.Anthropic()

    print("\n" + "=" * 60, flush=True)

    with client.messages.stream(
        model="claude-haiku-4-5",
        max_tokens=2048,
        system=[
            {
                "type": "text",
                "text": SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=[{"role": "user", "content": build_prompt(articles)}],
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
        final = stream.get_final_message()

    print("\n" + "=" * 60)
    cached = final.usage.cache_read_input_tokens
    print(
        f"\n📊 トークン使用量: 入力 {final.usage.input_tokens} "
        f"(キャッシュヒット {cached}) / 出力 {final.usage.output_tokens}",
        file=sys.stderr,
    )


def main() -> None:
    print("📰 ニュースを取得中...", file=sys.stderr)
    articles = fetch_articles()

    if not articles:
        print("❌ 記事を取得できませんでした。ネットワーク接続を確認してください。", file=sys.stderr)
        sys.exit(1)

    print(f"✅ {len(articles)} 件の記事を取得しました。要約を生成中...", file=sys.stderr)
    generate_summary(articles)


if __name__ == "__main__":
    main()
