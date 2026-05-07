#!/usr/bin/env python3
"""
AI CXO 自動事業計画システム
AI CXOたちが自律的に議論して事業計画書を作成します。
"""

import json
import sys
from dataclasses import dataclass
from datetime import datetime

import anthropic

client = anthropic.Anthropic()

RESET = "\033[0m"
BOLD = "\033[1m"
DIM = "\033[2m"


@dataclass
class CXO:
    title: str
    name: str
    emoji: str
    focus: str
    system_prompt: str
    color: str


CXOS = [
    CXO(
        title="CEO",
        name="田中 誠一郎",
        emoji="👔",
        focus="戦略・ビジョン・全体統括",
        system_prompt="""あなたは田中誠一郎、20年のキャリアを持つ経験豊富なCEOです。

あなたの視点:
- 全社戦略とビジョン設定
- 市場機会と競争ポジショニング
- 長期的な企業価値創造
- リスクと機会のバランス
- ステークホルダー（投資家・従業員・顧客）調整

議論での振る舞い:
- 戦略的方向性を示しながらも他のCXOの意見を引き出す
- 思い込みに挑戦し、明確さを追求する
- 各視点を統合してビジョンを形成する
- 大胆な決断を下す
- 必要に応じて議論をまとめ、前進させる

必ず日本語で回答してください。3〜4文で簡潔に発言し、必要に応じて他のCXOの意見に具体的に言及してください。
あなたはリーダーとして自信があり、時に挑発的な問いかけで思考を深める人物です。""",
        color="\033[1;34m",
    ),
    CXO(
        title="CFO",
        name="山田 花子",
        emoji="💰",
        focus="財務・収益性・投資対効果",
        system_prompt="""あなたは山田花子、複数のスタートアップと上場企業での財務経験を持つ厳格なCFOです。

あなたの視点:
- 財務的実現可能性と収益性
- 収益モデル、ユニットエコノミクス、利益率
- キャッシュフロー管理と資金調達
- 財務リスクとその軽減策
- ROIと資本配分の最適化

議論での振る舞い:
- アイデアを常に財務的現実に落とし込む
- 具体的な数字と現実的な予測を求める
- 見落とされがちな財務リスクを指摘する
- 楽観的すぎる仮定に懐疑的に挑む
- 創造的な資金調達ソリューションを提案する

必ず日本語で回答してください。3〜4文で簡潔に発言し、必要に応じて他のCXOの意見に具体的に言及してください。
あなたは鋭い分析力を持ち、時に懐疑的ですが、常に解決策を志向します。""",
        color="\033[1;32m",
    ),
    CXO(
        title="COO",
        name="佐藤 健二",
        emoji="⚙️",
        focus="オペレーション・実行力・スケーラビリティ",
        system_prompt="""あなたは佐藤健二、スタートアップから大企業まで多様な組織の運営経験を持つ実務派COOです。

あなたの視点:
- オペレーションの実現可能性と実行力
- プロセス設計と効率化
- 組織体制と人材要件
- スケーラビリティと運営上のボトルネック
- タイムラインの現実性とマイルストーン設定

議論での振る舞い:
- 「実際にどう動かすのか？」を常に問いかける
- 運営上のリスクと依存関係を洗い出す
- 具体的な実行計画を求める
- リソース要件が現実的かを確認する
- 戦略を実行可能なオペレーションに落とし込む

必ず日本語で回答してください。3〜4文で簡潔に発言し、必要に応じて他のCXOの意見に具体的に言及してください。
あなたは実践的で細部にこだわり、時に「現実チェック係」の役割を果たします。""",
        color="\033[1;33m",
    ),
    CXO(
        title="CMO",
        name="鈴木 美咲",
        emoji="📣",
        focus="マーケティング・ブランド・顧客獲得",
        system_prompt="""あなたは鈴木美咲、革新的なマーケティングで急成長を実現してきたクリエイティブなCMOです。

あなたの視点:
- 市場ポジショニングとブランド差別化
- 顧客獲得・維持戦略
- マーケティングチャネルとキャンペーン
- カスタマージャーニーとユーザー体験
- グロースハックとバイラル機構

議論での振る舞い:
- 顧客視点とエンパシーを常に持ち込む
- 差別化の機会を見つける
- 創造的なGTM（市場参入）戦略を提案する
- プロダクト中心の思考に顧客視点で挑む
- ブランドストーリーとナラティブを考える

必ず日本語で回答してください。3〜4文で簡潔に発言し、必要に応じて他のCXOの意見に具体的に言及してください。
あなたは情熱的で創造的、顧客に取りつかれているマーケターです。大胆なアイデアを臆せず提案します。""",
        color="\033[1;35m",
    ),
    CXO(
        title="CTO",
        name="高橋 龍一",
        emoji="💻",
        focus="技術・イノベーション・システムアーキテクチャ",
        system_prompt="""あなたは高橋龍一、深い技術的専門知識とビジネス感覚を兼ね備えたビジョナリーなCTOです。

あなたの視点:
- 技術アーキテクチャとテクノロジー選択
- AI/ML の機会と技術的競合優位
- 開発タイムラインとリソース要件
- 技術リスクとスケーラビリティ
- テクノロジーによるイノベーション機会

議論での振る舞い:
- 技術的実現可能性を正直に評価する
- 競争上の堀を作る技術機会を見つける
- 技術的に非現実的な仮定に反論する
- 革新的な技術ソリューションを提案する
- 技術とビジネスの橋渡しをする

必ず日本語で回答してください。3〜4文で簡潔に発言し、必要に応じて他のCXOの意見に具体的に言及してください。
あなたはAIの可能性に興奮しつつも技術的課題に対して誠実です。技術とビジネスの両方の言語を話します。""",
        color="\033[1;36m",
    ),
]


def print_banner():
    print(f"\n{BOLD}{'═' * 68}{RESET}")
    print(f"{BOLD}   🏢  AI CXO 自動事業計画システム{RESET}")
    print(f"{DIM}   AI経営幹部が自律的に議論して事業計画書を作成します{RESET}")
    print(f"{BOLD}{'═' * 68}{RESET}\n")


def format_history(history: list[dict]) -> str:
    if not history:
        return "（まだ議論なし — あなたが最初の発言者です）"

    lines = []
    current_round = None
    for entry in history:
        if entry["round"] != current_round:
            current_round = entry["round"]
            lines.append(f"\n【Round {current_round}】")
        lines.append(f"[{entry['title']}・{entry['name']}]: {entry['content']}")

    return "\n".join(lines)


def get_cxo_response(
    cxo: CXO,
    history: list[dict],
    business_idea: str,
    round_num: int,
    total_rounds: int,
) -> str:
    """Stream a CXO's response to the current discussion."""
    history_text = format_history(history)

    if round_num == 1:
        round_guide = "初回発言です。この事業テーマに対する第一印象と最重要課題を述べてください。"
    elif round_num == total_rounds:
        round_guide = (
            "最終ラウンドです。"
            "これまでの議論を踏まえ、事業計画書に必ず盛り込むべき提言を力強くまとめてください。"
        )
    else:
        round_guide = "前ラウンドの議論を踏まえ、賛成・反論・新視点を加えて議論を深めてください。"

    messages = [
        {
            "role": "user",
            "content": (
                f"【事業テーマ】{business_idea}\n\n"
                f"【これまでの議論】\n{history_text}\n\n"
                f"【指示】\n"
                f"{round_guide}\n"
                f"{cxo.title}（{cxo.name}）として発言してください。"
                f"他のCXOの具体的な発言に言及しながら、建設的に議論してください。"
                f"3〜4文で簡潔に発言してください。"
            ),
        }
    ]

    print(f"\n{cxo.color}{cxo.emoji} {cxo.title}（{cxo.name}）{RESET} ", end="", flush=True)

    response_text = ""
    with client.messages.stream(
        model="claude-opus-4-7",
        max_tokens=512,
        system=cxo.system_prompt,
        messages=messages,
        thinking={"type": "adaptive"},
    ) as stream:
        for chunk in stream.text_stream:
            print(chunk, end="", flush=True)
            response_text += chunk

    print()
    return response_text


def generate_business_plan(business_idea: str, history: list[dict]) -> str:
    """Synthesize all CXO discussions into a structured business plan."""
    print(f"\n\n{BOLD}{'═' * 68}{RESET}")
    print(f"{BOLD}   📋 事業計画書を生成中...{RESET}")
    print(f"{BOLD}{'═' * 68}{RESET}\n")

    history_text = format_history(history)

    messages = [
        {
            "role": "user",
            "content": (
                f"以下のCXO経営会議の議論を元に、実践的な事業計画書を作成してください。\n\n"
                f"【事業テーマ】\n{business_idea}\n\n"
                f"【CXO会議議事録】\n{history_text}\n\n"
                f"以下の構成で詳細な事業計画書を日本語で作成してください。"
                f"各セクションはCXO議論の具体的な意見を反映させ、実行可能な内容にしてください:\n\n"
                f"# 事業計画書\n\n"
                f"## 1. エグゼクティブサマリー\n"
                f"## 2. 事業コンセプト・ミッション・ビジョン\n"
                f"## 3. 市場分析（規模・セグメント・競合）\n"
                f"## 4. 製品・サービス戦略（機能・差別化・ロードマップ）\n"
                f"## 5. マーケティング・販売戦略\n"
                f"## 6. オペレーション計画（体制・プロセス・パートナー）\n"
                f"## 7. 技術戦略（スタック・AI活用・セキュリティ）\n"
                f"## 8. 財務計画（収益モデル・コスト・資金調達・3年シミュレーション）\n"
                f"## 9. リスク分析と対策\n"
                f"## 10. 実行ロードマップ（フェーズ別マイルストーン）\n"
            ),
        }
    ]

    plan_text = ""
    with client.messages.stream(
        model="claude-opus-4-7",
        max_tokens=4096,
        system=(
            "あなたは一流のビジネスコンサルタントです。"
            "CXO経営会議での各経営幹部の専門的視点を統合し、"
            "具体的な数字・タイムライン・アクションプランを含む"
            "実践的な事業計画書を作成します。"
        ),
        messages=messages,
        thinking={"type": "adaptive"},
    ) as stream:
        for chunk in stream.text_stream:
            print(chunk, end="", flush=True)
            plan_text += chunk

    print()
    return plan_text


def save_results(
    business_idea: str,
    history: list[dict],
    business_plan: str,
) -> tuple[str, str]:
    """Save the meeting transcript and business plan to files."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # Build Markdown transcript
    transcript_lines = []
    current_round = None
    for entry in history:
        if entry["round"] != current_round:
            current_round = entry["round"]
            transcript_lines.append(f"\n### ラウンド {current_round}\n")
        transcript_lines.append(
            f"**{entry['emoji']} {entry['title']}（{entry['name']}）**\n\n"
            f"{entry['content']}\n"
        )

    md_content = (
        f"# AI CXO 事業計画会議レポート\n\n"
        f"**事業テーマ**: {business_idea}  \n"
        f"**生成日時**: {datetime.now().strftime('%Y年%m月%d日 %H:%M')}\n\n"
        f"---\n\n"
        f"## CXO 会議議事録\n"
        f"{''.join(transcript_lines)}\n"
        f"---\n\n"
        f"{business_plan}\n"
    )

    md_file = f"business_plan_{timestamp}.md"
    with open(md_file, "w", encoding="utf-8") as f:
        f.write(md_content)

    json_file = f"meeting_data_{timestamp}.json"
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(
            {
                "business_idea": business_idea,
                "generated_at": datetime.now().isoformat(),
                "cxos": [
                    {"title": c.title, "name": c.name, "focus": c.focus}
                    for c in CXOS
                ],
                "discussion_history": history,
                "business_plan": business_plan,
            },
            f,
            ensure_ascii=False,
            indent=2,
        )

    return md_file, json_file


def run_meeting(business_idea: str, num_rounds: int = 3) -> str:
    """Run the full CXO meeting and generate a business plan."""
    print_banner()

    print(f"📌 事業テーマ: {BOLD}{business_idea}{RESET}\n")
    print(f"👥 参加CXO:")
    for cxo in CXOS:
        print(f"   {cxo.color}{cxo.emoji} {cxo.title}（{cxo.name}）{RESET} — {cxo.focus}")
    print(f"\n🔄 討議ラウンド数: {num_rounds}")
    print(f"\n{DIM}会議を開始します...{RESET}")

    history: list[dict] = []

    for round_num in range(1, num_rounds + 1):
        print(f"\n\n{BOLD}{'─' * 68}{RESET}")
        print(f"{BOLD}   🔄  Round {round_num} / {num_rounds}{RESET}")
        print(f"{BOLD}{'─' * 68}{RESET}")

        for cxo in CXOS:
            response = get_cxo_response(
                cxo, history, business_idea, round_num, num_rounds
            )
            history.append(
                {
                    "round": round_num,
                    "title": cxo.title,
                    "name": cxo.name,
                    "emoji": cxo.emoji,
                    "content": response,
                }
            )

    business_plan = generate_business_plan(business_idea, history)

    md_file, json_file = save_results(business_idea, history, business_plan)

    print(f"\n\n{BOLD}{'═' * 68}{RESET}")
    print(f"{BOLD}   ✅  事業計画書の作成が完了しました！{RESET}")
    print(f"{BOLD}{'═' * 68}{RESET}")
    print(f"\n📄 保存先:")
    print(f"   Markdown : {BOLD}{md_file}{RESET}")
    print(f"   JSON データ: {BOLD}{json_file}{RESET}\n")

    return business_plan


def main():
    if len(sys.argv) > 1:
        business_idea = " ".join(sys.argv[1:])
        num_rounds = 3
    else:
        print_banner()
        business_idea = input("📌 事業テーマを入力してください\n   例: AIを活用した高齢者向け介護支援サービス\n\n   > ").strip()
        if not business_idea:
            business_idea = "生成AIを活用した次世代パーソナライズ学習プラットフォーム"
            print(f"\n{DIM}デフォルトテーマを使用します: {business_idea}{RESET}")

        rounds_input = input("\n🔄 討議ラウンド数 (Enter で 3): ").strip()
        num_rounds = int(rounds_input) if rounds_input.isdigit() and int(rounds_input) > 0 else 3

    run_meeting(business_idea, num_rounds)


if __name__ == "__main__":
    main()
