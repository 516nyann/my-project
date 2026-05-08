import Link from 'next/link'
import {
  TrendingUp,
  TrendingDown,
  CircleDot,
  Users,
  ReceiptText,
  Trophy,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_TODAY = {
  date: '2026年5月8日（金）',
  daily_sales: 123000,
  monthly_sales: 2850000,
  open_bills: 2,
  monthly_customers: 48,
  daily_trend: +12.5,
  monthly_trend: +8.3,
}

const MOCK_OPEN_BILLS = [
  {
    id: 'b3',
    table: 'B-1',
    customer: '鈴木 一郎',
    casts: ['あやか', 'さくら'],
    elapsed: '1時間45分',
    current_amount: 62000,
  },
  {
    id: 'b4',
    table: 'VIP-2',
    customer: '田中 健一',
    casts: ['れいな'],
    elapsed: '45分',
    current_amount: 38000,
  },
]

const MOCK_CAST_RANKING = [
  { rank: 1, name: 'さくら', amount: 380000 },
  { rank: 2, name: 'れいな', amount: 295000 },
  { rank: 3, name: 'みさき', amount: 220000 },
  { rank: 4, name: 'あやか', amount: 185000 },
  { rank: 5, name: 'ゆりな', amount: 120000 },
]

const MOCK_RECENT_VISITS = [
  { id: 'b4', customer: '田中 健一', date: '2026-05-08', amount: 38000, status: 'open' },
  { id: 'b3', customer: '鈴木 一郎', date: '2026-05-07', amount: 62000, status: 'open' },
  { id: 'b2', customer: '山田 太郎', date: '2026-05-03', amount: 45000, status: 'paid' },
  { id: 'b1', customer: '田中 健一', date: '2026-05-01', amount: 85000, status: 'paid' },
  { id: 'b5', customer: '伊藤 博', date: '2026-04-28', amount: 92000, status: 'paid' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function TrendBadge({ value }: { value: number }) {
  const positive = value >= 0
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        positive ? 'text-green-400' : 'text-red-400'
      }`}
    >
      {positive ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {positive ? '+' : ''}
      {value}%
    </span>
  )
}

const RANK_COLORS: Record<number, string> = {
  1: 'text-amber-400',
  2: 'text-gray-400',
  3: 'text-amber-700',
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const maxCastAmount = MOCK_CAST_RANKING[0].amount

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">ダッシュボード</h1>
        <p className="text-sm text-gray-500 mt-1">{MOCK_TODAY.date}</p>
      </div>

      {/* ── Section 1: KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* 本日の売上 */}
        <div className="bg-gray-900 border border-gray-800 hover:border-amber-500/50 transition-colors rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">本日の売上</span>
            <ReceiptText className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-amber-400">{formatCurrency(MOCK_TODAY.daily_sales)}</p>
          <div className="mt-2">
            <TrendBadge value={MOCK_TODAY.daily_trend} />
            <span className="text-xs text-gray-600 ml-1">前月比</span>
          </div>
        </div>

        {/* 今月の売上 */}
        <div className="bg-gray-900 border border-gray-800 hover:border-amber-500/50 transition-colors rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">今月の売上</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(MOCK_TODAY.monthly_sales)}</p>
          <div className="mt-2">
            <TrendBadge value={MOCK_TODAY.monthly_trend} />
            <span className="text-xs text-gray-600 ml-1">前月比</span>
          </div>
        </div>

        {/* 営業中の伝票 */}
        <div className="bg-gray-900 border border-gray-800 hover:border-amber-500/50 transition-colors rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">営業中の伝票</span>
            <CircleDot className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <p className="text-3xl font-bold text-white">
              {MOCK_TODAY.open_bills}
              <span className="text-lg font-normal text-gray-500 ml-1">件</span>
            </p>
          </div>
          <p className="text-xs text-gray-600 mt-2">現在オープン中</p>
        </div>

        {/* 今月の来客数 */}
        <div className="bg-gray-900 border border-gray-800 hover:border-amber-500/50 transition-colors rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">今月の来客数</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {MOCK_TODAY.monthly_customers}
            <span className="text-lg font-normal text-gray-500 ml-1">名</span>
          </p>
          <p className="text-xs text-gray-600 mt-2">今月累計</p>
        </div>
      </div>

      {/* ── Section 2: Open Bills ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            今日の営業中テーブル
          </h2>
          <span className="text-xs text-gray-500">{MOCK_OPEN_BILLS.length} テーブル営業中</span>
        </div>

        {MOCK_OPEN_BILLS.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-500 text-sm">現在営業中のテーブルはありません</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">テーブル</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">お客様</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">担当キャスト</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">経過時間</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">現在金額</th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {MOCK_OPEN_BILLS.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-amber-400">{bill.table}</td>
                    <td className="px-6 py-4 text-white">{bill.customer}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {bill.casts.map((c) => (
                          <span
                            key={c}
                            className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-300 border border-gray-700"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{bill.elapsed}</td>
                    <td className="px-6 py-4 text-right font-semibold text-white">
                      {formatCurrency(bill.current_amount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/bills/${bill.id}`}
                        className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-semibold transition-colors"
                      >
                        会計へ
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Section 3: Two Columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Cast Ranking */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">今月のキャスト売上ランキング</h2>
          </div>
          <div className="p-6 space-y-4">
            {MOCK_CAST_RANKING.map((cast) => {
              const pct = Math.round((cast.amount / maxCastAmount) * 100)
              const rankColor = RANK_COLORS[cast.rank] ?? 'text-gray-500'
              return (
                <div key={cast.rank} className="flex items-center gap-3">
                  <span className={`w-6 text-sm font-bold text-center shrink-0 ${rankColor}`}>
                    {cast.rank}
                  </span>
                  <span className="w-16 text-sm text-white shrink-0 truncate">{cast.name}</span>
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-24 text-right text-xs text-gray-400 shrink-0">
                    {formatCurrency(cast.amount)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Recent Visits */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-white">最近の来店</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {MOCK_RECENT_VISITS.map((v) => (
              <div key={`${v.id}-${v.date}`} className="flex items-center justify-between px-6 py-3 hover:bg-gray-800/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-white">{v.customer}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{v.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-white">{formatCurrency(v.amount)}</span>
                  {v.status === 'open' ? (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                      営業中
                    </Badge>
                  ) : (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      精算済
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
