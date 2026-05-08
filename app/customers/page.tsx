'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Users, Plus, Search, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'

type MockCustomer = {
  id: string
  name: string
  phone: string
  notes: string
  visit_count: number
  total_spent: number
  last_visit: string
}

const MOCK_CUSTOMERS: MockCustomer[] = [
  { id: '1', name: '田中 健一', phone: '090-1234-5678', notes: 'VIP客。シャンパン好き。', visit_count: 24, total_spent: 1850000, last_visit: '2026-05-08' },
  { id: '2', name: '山田 太郎', phone: '090-9876-5432', notes: '', visit_count: 12, total_spent: 680000, last_visit: '2026-05-03' },
  { id: '3', name: '鈴木 一郎', phone: '090-5555-4444', notes: 'ウイスキー好き。', visit_count: 8, total_spent: 420000, last_visit: '2026-05-07' },
  { id: '4', name: '佐藤 次郎', phone: '090-3333-2222', notes: '', visit_count: 3, total_spent: 125000, last_visit: '2026-04-15' },
  { id: '5', name: '伊藤 博', phone: '090-7777-8888', notes: '接待利用が多い。', visit_count: 18, total_spent: 1200000, last_visit: '2026-04-28' },
]

type SortKey = 'visit_count' | 'total_spent' | 'last_visit'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'visit_count', label: '来店回数順' },
  { value: 'total_spent', label: '売上順' },
  { value: 'last_visit', label: '最終来店日順' },
]

function CustomerAvatar({ name }: { name: string }) {
  const initial = name.charAt(0)
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0">
      <span className="text-sm font-bold text-white">{initial}</span>
    </div>
  )
}

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('visit_count')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = q
      ? MOCK_CUSTOMERS.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.phone.replace(/-/g, '').includes(q.replace(/-/g, ''))
        )
      : [...MOCK_CUSTOMERS]

    list.sort((a, b) => {
      if (sortKey === 'last_visit') {
        return new Date(b.last_visit).getTime() - new Date(a.last_visit).getTime()
      }
      return b[sortKey] - a[sortKey]
    })

    return list
  }, [search, sortKey])

  return (
    <div className="min-h-screen bg-gray-950 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Users className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">お客様管理</h1>
            <p className="text-sm text-gray-400">全{filtered.length}名</p>
          </div>
        </div>
        <Link href="/customers/new">
          <Button className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold gap-2">
            <Plus className="w-4 h-4" />
            新規登録
          </Button>
        </Link>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="お名前・電話番号で検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-amber-500"
          />
        </div>
        <div className="flex gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortKey(opt.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortKey === opt.value
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:text-white hover:bg-gray-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-transparent">
              <TableHead className="text-gray-400 font-medium">お客様名</TableHead>
              <TableHead className="text-gray-400 font-medium">電話番号</TableHead>
              <TableHead className="text-gray-400 font-medium text-right">累計来店回数</TableHead>
              <TableHead className="text-gray-400 font-medium text-right">累計消費額</TableHead>
              <TableHead className="text-gray-400 font-medium">最終来店日</TableHead>
              <TableHead className="text-gray-400 font-medium text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-12">
                  該当するお客様が見つかりません
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="border-gray-800 hover:bg-gray-800/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <CustomerAvatar name={customer.name} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{customer.name}</span>
                          {customer.total_spent > 1000000 && (
                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1 px-1.5 py-0.5 text-xs">
                              <Star className="w-3 h-3 fill-amber-400" />
                              VIP
                            </Badge>
                          )}
                        </div>
                        {customer.notes && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[180px]">
                            {customer.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{customer.phone}</TableCell>
                  <TableCell className="text-right text-gray-300">
                    {customer.visit_count.toLocaleString()}回
                  </TableCell>
                  <TableCell className="text-right font-medium text-white">
                    {formatCurrency(customer.total_spent)}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {formatDate(customer.last_visit)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/customers/${customer.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-600"
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
