'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BillStatusBadge } from '@/components/bills/BillStatusBadge'
import { formatCurrency, formatDate } from '@/lib/utils'

type BillStatus = 'open' | 'closed' | 'paid'

interface MockBill {
  id: string
  bill_number: string
  visit_date: string
  customer_name: string
  table_number: string
  casts: string[]
  total_amount: number
  status: BillStatus
}

const MOCK_BILLS: MockBill[] = [
  {
    id: '1',
    bill_number: 'B-20260501-001',
    visit_date: '2026-05-01',
    customer_name: '田中 健一',
    table_number: 'VIP-1',
    casts: ['さくら', 'れいな'],
    total_amount: 85000,
    status: 'paid',
  },
  {
    id: '2',
    bill_number: 'B-20260503-001',
    visit_date: '2026-05-03',
    customer_name: '山田 太郎',
    table_number: 'A-2',
    casts: ['みさき'],
    total_amount: 45000,
    status: 'closed',
  },
  {
    id: '3',
    bill_number: 'B-20260507-001',
    visit_date: '2026-05-07',
    customer_name: '鈴木 一郎',
    table_number: 'B-1',
    casts: ['あやか', 'さくら'],
    total_amount: 62000,
    status: 'open',
  },
  {
    id: '4',
    bill_number: 'B-20260508-001',
    visit_date: '2026-05-08',
    customer_name: '田中 健一',
    table_number: 'VIP-2',
    casts: ['れいな'],
    total_amount: 38000,
    status: 'open',
  },
  {
    id: '5',
    bill_number: 'B-20260427-001',
    visit_date: '2026-04-27',
    customer_name: '山田 太郎',
    table_number: 'A-1',
    casts: ['さくら', 'みさき', 'あやか'],
    total_amount: 120000,
    status: 'paid',
  },
  {
    id: '6',
    bill_number: 'B-20260430-001',
    visit_date: '2026-04-30',
    customer_name: '鈴木 一郎',
    table_number: 'B-3',
    casts: ['れいな', 'あやか'],
    total_amount: 55000,
    status: 'paid',
  },
]

type FilterStatus = 'all' | BillStatus

export default function BillsPage() {
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')

  const filteredBills = MOCK_BILLS.filter((bill) => {
    if (dateFilter && bill.visit_date !== dateFilter) return false
    if (statusFilter !== 'all' && bill.status !== statusFilter) return false
    return true
  })

  return (
    <div className="p-8 min-h-screen bg-gray-950">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            伝票管理
          </h1>
          <p className="text-gray-400 mt-1 text-sm">お客様の伝票を管理します</p>
        </div>
        <Link href="/bills/new">
          <Button className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold">
            <Plus className="w-4 h-4" />
            新規伝票
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400 whitespace-nowrap">日付</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-9 rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400 whitespace-nowrap">ステータス</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
            className="h-9 rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">すべて</option>
            <option value="open">営業中</option>
            <option value="closed">会計済</option>
            <option value="paid">入金済</option>
          </select>
        </div>
        {(dateFilter || statusFilter !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={() => {
              setDateFilter('')
              setStatusFilter('all')
            }}
          >
            フィルターをリセット
          </Button>
        )}
        <span className="ml-auto text-sm text-gray-500">
          {filteredBills.length} 件
        </span>
      </div>

      {/* Bills Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-transparent">
              <TableHead className="text-gray-400">伝票番号</TableHead>
              <TableHead className="text-gray-400">日付</TableHead>
              <TableHead className="text-gray-400">お客様</TableHead>
              <TableHead className="text-gray-400">テーブル</TableHead>
              <TableHead className="text-gray-400">担当キャスト</TableHead>
              <TableHead className="text-gray-400 text-right">金額</TableHead>
              <TableHead className="text-gray-400">ステータス</TableHead>
              <TableHead className="text-gray-400 text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBills.length === 0 ? (
              <TableRow className="border-gray-800 hover:bg-gray-800/30">
                <TableCell colSpan={8} className="text-center text-gray-500 py-12">
                  該当する伝票がありません
                </TableCell>
              </TableRow>
            ) : (
              filteredBills.map((bill) => (
                <TableRow
                  key={bill.id}
                  className="border-gray-800 hover:bg-gray-800/40 transition-colors"
                >
                  <TableCell className="text-amber-400 font-mono text-sm font-medium">
                    {bill.bill_number}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {formatDate(bill.visit_date)}
                  </TableCell>
                  <TableCell className="text-white font-medium">
                    {bill.customer_name}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {bill.table_number}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <div className="flex flex-wrap gap-1">
                      {bill.casts.map((cast) => (
                        <span
                          key={cast}
                          className="inline-flex items-center rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-300 border border-gray-700"
                        >
                          {cast}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-white font-semibold">
                    {formatCurrency(bill.total_amount)}
                  </TableCell>
                  <TableCell>
                    <BillStatusBadge status={bill.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/bills/${bill.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                      >
                        詳細
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
