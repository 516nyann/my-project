# 毎日ニュース要約

NHKのRSSフィードから最新ニュースを取得し、Claude AIで日本語の簡潔な要約を生成するツールです。

## セットアップ

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY="your-api-key"
```

APIキーは [Anthropic Console](https://console.anthropic.com/) で取得できます。

## 使い方

```bash
python daily_news.py
```

経済・ビジネス、政治、社会、国際のカテゴリ別に今日の重要ニュースが出力されます。

## 毎日自動実行（cron）

毎朝8時に実行してファイルに保存する例：

```bash
# crontab -e で追加
0 8 * * * cd /path/to/my-project && python daily_news.py >> ~/news/$(date +\%Y-\%m-\%d).md 2>/dev/null
```

## ニュースソース

[NHKニュース](https://www.nhk.or.jp/news/) — 主要・政治・経済・社会・国際の各カテゴリ

## コスト目安

1回の実行あたり約 $0.01〜0.03（Claude Opus 4.7 使用時）。
コスト削減には `daily_news.py` の `model=` を `"claude-haiku-4-5"` に変更すると約1/5になります。
