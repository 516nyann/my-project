'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, Users, ReceiptText } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_DAILY_SALES = [
  { day: 1, amount: 185000 },
  { day: 3, amount: 245000 },
  { day: 5, amount: 310000 },
  { day: 7, amount: 92000 },
  { day: 8, amount: 123000 },
  { day: 10, amount: 198000 },
  { day: 12, amount: 275000 },
  { day: 14, amount: 88000 },
  { day: 15, amount: 320000 },
  { day: 17, amount: 145000 },
  { day: 19, amount: 260000 },
  { day: 21, amount: 195000 },
  { day: 22, amount: 330000 },
  { day: 24, amount: 175000 },
  { day: 26, amount: 285000 },
]

const MOCK_CAST_SALES = [
  { name: 'さくら', bills: 12, total: 380000 },
  { name: 'れいな', bills: 9, total: 295000 },
  { name: 'みさき', bills: 7, total: 220000 },
  { name: 'あやか', bills: 6, total: 185000 },
  { name: 'ゆりな', bills: 4, total: 120000 },
]

const MOCK_TOP_CUSTOMERS = [
  { rank: 1, name: '田中 健一', visits: 5, total: 350000 },
  { rank: 2, name: '伊藤 博', visits: 3, total: 277000 },
  { rank: 3, name: '山田 太郎', visits: 4, total: 198000 },
  { rank: 4, name: '鈴木 一郎', visits: 3, total: 179000 },
  { rank: 5, name: '佐藤 次郎', visits: 2, total: 88000 },
]

// ---------------------------------------------------------------------------
// Derived values
// ---------------------------------------------------------------------------

const TOTAL_MONTHLY = MOCK_DAILY_SALES.reduce((s, d) => s + d.amount, 0)
const TOTAL_BILLS = MOCK_CAST_SALES.reduce((s, c) => s + c.bills, 0)
const TOTAL_CUSTOMERS = MOCK_TOP_CUSTOMERS.length
const MAX_DAY_AMOUNT = Math.max(...MOCK_DAILY_SALES.map((d) => d.amount))
const MAX_CAST_TOTAL = MOCK_CAST_SALES[0].total

const YEARS = [2025, 2026]
const MONTHS = [
  { value: 1, label: '1月' },
  { value: 2, label: '2月' },
  { value: 3, label: '3月' },
  { value: 4, label: '4月' },
  { value: 5, label: '5月' },
  { value: 6, label: '6月' },
  { value: 7, label: '7月' },
  { value: 8, label: '8月' },
  { value: 9, label: '9月' },
  { value: 10, label: '10月' },
  { value: 11, label: '11月' },
  { value: 12, label: '12月' },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AnalyticsPage() {
  const [selectedYear, setSelectedYear] = useState(2026)
  const [selectedMonth, setSelectedMonth] = useState(5)

  const periodLabel = `${selectedYear}年${selectedMonth}月`

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-amber-400" />
        <h1 className="text-2xl font-bold text-white">集計・分析</h1>
      </div>

      {/* ── Section 1: Period Selector ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center gap-4">
          {/* Year */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 shrink-0">年</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}年
                </option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 shrink-0">月</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick buttons */}
          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={() => { setSelectedYear(2026); setSelectedMonth(5) }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
            >
              今月
            </button>
            <button
              onClick={() => { setSelectedYear(2026); setSelectedMonth(4) }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700 hover:text-white hover:border-gray-600 transition-colors"
            >
              先月
            </button>
            <button
              onClick={() => { setSelectedYear(2026); setSelectedMonth(3) }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700 hover:text-white hover:border-gray-600 transition-colors"
            >
              過去3ヶ月
            </button>
          </div>

          <span className="text-sm text-gray-500 ml-auto">{periodLabel} のデータを表示中</span>
        </div>
      </div>

      {/* ── Section 2: KPI Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 hover:border-amber-500/50 transition-colors rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">月間売上合計</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-amber-400">{formatCurrency(TOTAL_MONTHLY)}</p>
          <p className="text-xs text-gray-600 mt-2">{periodLabel}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 hover:border-amber-500/50 transition-colors rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">伝票件数</span>
            <ReceiptText className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {TOTAL_BILLS}
            <span className="text-lg font-normal text-gray-500 ml-1">件</span>
          </p>
          <p className="text-xs text-gray-600 mt-2">{periodLabel}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 hover:border-amber-500/50 transition-colors rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">来客数</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {TOTAL_CUSTOMERS}
            <span className="text-lg font-normal text-gray-500 ml-1">名</span>
          </p>
          <p className="text-xs text-gray-600 mt-2">{periodLabel}</p>
        </div>
      </div>

      {/* ── Section 3: Daily Sales Chart ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-white">日別売上</h2>
          <span className="text-xs text-gray-500">
            合計: <span className="text-white font-medium">{formatCurrency(TOTAL_MONTHLY)}</span>
          </span>
        </div>
        <div className="p-6">
          {/* CSS-only bar chart */}
          <div className="flex items-end gap-1 h-40">
            {MOCK_DAILY_SALES.map((d) => {
              const heightPct = Math.round((d.amount / MAX_DAY_AMOUNT) * 100)
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <div className="w-full flex items-end justify-center" style={{ height: '120px' }}>
                    <div
                      title={`${d.day}日: ${formatCurrency(d.amount)}`}
                      className="w-full rounded-t-sm bg-amber-500 hover:bg-amber-400 transition-colors cursor-default"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 leading-none">{d.day}</span>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-600 mt-3 text-center">
            ※ 売上のある日のみ表示（ホバーで金額確認）
          </p>
        </div>
      </div>

      {/* ── Section 4: Two Columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Cast Sales */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-white">キャスト別売上</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">キャスト名</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">件数</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">売上合計</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">割合</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {MOCK_CAST_SALES.map((cast) => {
                  const pct = Math.round((cast.total / TOTAL_MONTHLY) * 100)
                  const barPct = Math.round((cast.total / MAX_CAST_TOTAL) * 100)
                  return (
                    <tr key={cast.name} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-3 text-white font-medium">{cast.name}</td>
                      <td className="px-4 py-3 text-right text-gray-400">{cast.bills}</td>
                      <td className="px-4 py-3 text-right text-white font-semibold">
                        {formatCurrency(cast.total)}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: `${barPct}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Top Customers */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-white">お客様別売上ランキング</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-12">順位</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">お客様名</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">来店回数</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">累計消費額</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {MOCK_TOP_CUSTOMERS.map((c) => {
                  const rankColor =
                    c.rank === 1
                      ? 'text-amber-400'
                      : c.rank === 2
                      ? 'text-gray-400'
                      : c.rank === 3
                      ? 'text-amber-700'
                      : 'text-gray-600'
                  return (
                    <tr key={c.rank} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3 text-center">
                        <span className={`text-sm font-bold ${rankColor}`}>{c.rank}</span>
                      </td>
                      <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                      <td className="px-4 py-3 text-right text-gray-400">{c.visits}回</td>
                      <td className="px-6 py-3 text-right font-semibold text-white">
                        {formatCurrency(c.total)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
