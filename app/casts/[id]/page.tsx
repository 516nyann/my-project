'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'

// ─── Mock data ───────────────────────────────────────────────────────────────

type MockCast = {
  id: string
  name: string
  number: string
  active: boolean
  monthly_sales: number
  bill_count: number
}

const MOCK_CASTS: MockCast[] = [
  { id: '1', name: 'さくら', number: 'No.1', active: true, monthly_sales: 380000, bill_count: 12 },
  { id: '2', name: 'れいな', number: 'No.2', active: true, monthly_sales: 295000, bill_count: 9 },
  { id: '3', name: 'みさき', number: 'No.3', active: true, monthly_sales: 220000, bill_count: 7 },
  { id: '4', name: 'あやか', number: 'No.4', active: true, monthly_sales: 185000, bill_count: 6 },
  { id: '5', name: 'ゆりな', number: 'No.5', active: false, monthly_sales: 0, bill_count: 0 },
]

type MockBill = {
  id: string
  visit_date: string
  customer_name: string
  table_number: string
  total_amount: number
  status: 'open' | 'closed' | 'paid'
}

const MOCK_CAST_BILLS: MockBill[] = [
  { id: '1', visit_date: '2026-05-07', customer_name: '田中 健一', table_number: 'VIP-1', total_amount: 85000, status: 'paid' },
  { id: '2', visit_date: '2026-05-03', customer_name: '山田 太郎', table_number: 'A-2', total_amount: 45000, status: 'paid' },
  { id: '3', visit_date: '2026-04-28', customer_name: '鈴木 一郎', table_number: 'B-1', total_amount: 62000, status: 'paid' },
  { id: '4', visit_date: '2026-04-22', customer_name: '佐藤 次郎', table_number: 'VIP-2', total_amount: 98000, status: 'paid' },
  { id: '5', visit_date: '2026-04-15', customer_name: '高橋 誠', table_number: 'C-3', total_amount: 38000, status: 'paid' },
  { id: '6', visit_date: '2026-04-10', customer_name: '渡辺 隆', table_number: 'A-1', total_amount: 55000, status: 'closed' },
  { id: '7', visit_date: '2026-04-05', customer_name: '伊藤 雅彦', table_number: 'VIP-1', total_amount: 120000, status: 'paid' },
]

type MonthlySale = {
  month: string
  amount: number
}

const MOCK_MONTHLY_SALES: MonthlySale[] = [
  { month: '12月', amount: 250000 },
  { month: '1月', amount: 190000 },
  { month: '2月', amount: 310000 },
  { month: '3月', amount: 285000 },
  { month: '4月', amount: 340000 },
  { month: '5月', amount: 380000 },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitial(name: string): string {
  return name.charAt(0)
}

function formatVisitDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
  })
}

function statusLabel(status: string): React.ReactNode {
  switch (status) {
    case 'paid':
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
          支払済
        </Badge>
      )
    case 'closed':
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
          締め済
        </Badge>
      )
    default:
      return (
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
          会計中
        </Badge>
      )
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CastDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const cast = MOCK_CASTS.find((c) => c.id === params.id) ?? MOCK_CASTS[0]

  const [editingName, setEditingName] = useState(false)
  const [editingNumber, setEditingNumber] = useState(false)
  const [name, setName] = useState(cast.name)
  const [number, setNumber] = useState(cast.number)

  // Previous month comparison
  const currentMonthSales = MOCK_MONTHLY_SALES[MOCK_MONTHLY_SALES.length - 1].amount
  const prevMonthSales = MOCK_MONTHLY_SALES[MOCK_MONTHLY_SALES.length - 2].amount
  const momChange =
    prevMonthSales > 0
      ? ((currentMonthSales - prevMonthSales) / prevMonthSales) * 100
      : 0

  // Bar chart
  const maxSales = Math.max(...MOCK_MONTHLY_SALES.map((m) => m.amount))

  return (
    <div className="p-8 bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Back link */}
        <Link
          href="/casts"
          className="text-sm text-gray-400 hover:text-amber-400 transition-colors inline-block"
        >
          ← キャスト一覧に戻る
        </Link>

        {/* ── Profile header ── */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              {/* Large avatar */}
              <div className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-500/25">
                <span className="text-3xl font-bold text-white">
                  {getInitial(name)}
                </span>
              </div>

              {/* Name / number / badge */}
              <div className="flex-1 min-w-0">
                {/* Name row */}
                <div className="flex items-center gap-3 mb-1">
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white w-40 h-9 text-lg font-bold focus-visible:ring-amber-500"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold h-9"
                        onClick={() => setEditingName(false)}
                      >
                        保存
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 h-9"
                        onClick={() => { setName(cast.name); setEditingName(false) }}
                      >
                        取消
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-white">{name}</h1>
                      <button
                        onClick={() => setEditingName(true)}
                        className="text-xs text-gray-500 hover:text-amber-400 transition-colors px-2 py-0.5 rounded border border-gray-700 hover:border-amber-500/50"
                      >
                        編集
                      </button>
                    </>
                  )}
                </div>

                {/* Number row */}
                <div className="flex items-center gap-3 mb-3">
                  {editingNumber ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white w-32 h-8 text-sm focus-visible:ring-amber-500"
                        autoFocus
                        placeholder="例: No.1"
                      />
                      <Button
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold h-8 text-xs"
                        onClick={() => setEditingNumber(false)}
                      >
                        保存
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 h-8 text-xs"
                        onClick={() => { setNumber(cast.number); setEditingNumber(false) }}
                      >
                        取消
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm text-gray-400">{number}</span>
                      <button
                        onClick={() => setEditingNumber(true)}
                        className="text-xs text-gray-500 hover:text-amber-400 transition-colors px-2 py-0.5 rounded border border-gray-700 hover:border-amber-500/50"
                      >
                        編集
                      </button>
                    </>
                  )}
                </div>

                {/* Status badge */}
                {cast.active ? (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    在籍中
                  </Badge>
                ) : (
                  <Badge className="bg-gray-700/50 text-gray-400 border-gray-600">
                    休業中
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Monthly summary ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-5">
              <p className="text-xs text-gray-400 mb-2">今月売上合計</p>
              <p className="text-2xl font-bold text-amber-400">
                {formatCurrency(currentMonthSales)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-5">
              <p className="text-xs text-gray-400 mb-2">今月担当件数</p>
              <p className="text-2xl font-bold text-white">
                {cast.bill_count}
                <span className="text-sm text-gray-400 ml-1">件</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-5">
              <p className="text-xs text-gray-400 mb-2">先月比</p>
              <p
                className={`text-2xl font-bold ${
                  momChange >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {momChange >= 0 ? '+' : ''}
                {momChange.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ── Monthly sales bar chart ── */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base font-semibold">
              月別売上（過去6ヶ月）
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="space-y-3">
              {MOCK_MONTHLY_SALES.map((month) => {
                const pct = maxSales > 0 ? (month.amount / maxSales) * 100 : 0
                return (
                  <div key={month.month} className="flex items-center gap-3">
                    {/* Month label */}
                    <span className="text-xs text-gray-400 w-8 text-right flex-shrink-0">
                      {month.month}
                    </span>
                    {/* Bar track */}
                    <div className="flex-1 bg-gray-800 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-6 bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {/* Amount label */}
                    <span className="text-xs text-gray-300 w-24 text-right flex-shrink-0 font-medium">
                      {formatCurrency(month.amount)}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Recent bills table ── */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base font-semibold">
              最近の担当伝票（直近10件）
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                      日付
                    </th>
                    <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                      お客様
                    </th>
                    <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                      テーブル
                    </th>
                    <th className="text-right text-xs text-gray-400 font-medium px-6 py-3">
                      金額
                    </th>
                    <th className="text-center text-xs text-gray-400 font-medium px-6 py-3">
                      ステータス
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_CAST_BILLS.slice(0, 10).map((bill, idx) => (
                    <tr
                      key={bill.id}
                      className={`border-b border-gray-800/60 hover:bg-gray-800/40 transition-colors ${
                        idx === MOCK_CAST_BILLS.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="px-6 py-4 text-gray-300">
                        {formatVisitDate(bill.visit_date)}
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        {bill.customer_name}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {bill.table_number}
                      </td>
                      <td className="px-6 py-4 text-right text-amber-400 font-semibold">
                        {formatCurrency(bill.total_amount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {statusLabel(bill.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {MOCK_CAST_BILLS.length === 0 && (
              <div className="py-12 text-center text-gray-500 text-sm">
                担当伝票がありません
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
