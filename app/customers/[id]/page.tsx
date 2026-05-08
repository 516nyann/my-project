'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Phone,
  FileText,
  Star,
  Pencil,
  Check,
  X,
  TrendingUp,
  Calendar,
  Receipt,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

type MockVisit = {
  id: string
  bill_id: string
  visit_date: string
  table_number: string
  total_amount: number
  casts: string[]
  status: 'open' | 'closed' | 'paid'
}

const MOCK_CUSTOMERS: MockCustomer[] = [
  { id: '1', name: '田中 健一', phone: '090-1234-5678', notes: 'VIP客。シャンパン好き。', visit_count: 24, total_spent: 1850000, last_visit: '2026-05-08' },
  { id: '2', name: '山田 太郎', phone: '090-9876-5432', notes: '', visit_count: 12, total_spent: 680000, last_visit: '2026-05-03' },
  { id: '3', name: '鈴木 一郎', phone: '090-5555-4444', notes: 'ウイスキー好き。', visit_count: 8, total_spent: 420000, last_visit: '2026-05-07' },
  { id: '4', name: '佐藤 次郎', phone: '090-3333-2222', notes: '', visit_count: 3, total_spent: 125000, last_visit: '2026-04-15' },
  { id: '5', name: '伊藤 博', phone: '090-7777-8888', notes: '接待利用が多い。', visit_count: 18, total_spent: 1200000, last_visit: '2026-04-28' },
]

// Mock visits keyed by customer id
const MOCK_VISITS_BY_CUSTOMER: Record<string, MockVisit[]> = {
  '1': [
    { id: 'v1', bill_id: 'b1', visit_date: '2026-05-08', table_number: 'VIP-2', total_amount: 38000, casts: ['れいな'], status: 'open' },
    { id: 'v2', bill_id: 'b2', visit_date: '2026-05-01', table_number: 'VIP-1', total_amount: 85000, casts: ['さくら', 'れいな'], status: 'paid' },
    { id: 'v3', bill_id: 'b3', visit_date: '2026-04-22', table_number: 'VIP-1', total_amount: 72000, casts: ['さくら'], status: 'paid' },
    { id: 'v4', bill_id: 'b4', visit_date: '2026-04-10', table_number: 'A-3', total_amount: 55000, casts: ['みさき'], status: 'paid' },
  ],
}

const STATUS_LABELS: Record<string, string> = {
  open: 'オープン',
  closed: '締め済み',
  paid: '支払済',
}

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  closed: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  paid: 'bg-green-500/20 text-green-400 border-green-500/30',
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
      <div className="p-2 bg-amber-500/10 rounded-lg">
        <Icon className="w-5 h-5 text-amber-400" />
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-bold text-white mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default function CustomerDetailPage() {
  const params = useParams()
  const id = params.id as string

  const customer = MOCK_CUSTOMERS.find((c) => c.id === id)
  const visits = (MOCK_VISITS_BY_CUSTOMER[id] ?? []).sort(
    (a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime()
  )

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(customer?.name ?? '')
  const [editPhone, setEditPhone] = useState(customer?.phone ?? '')
  const [editNotes, setEditNotes] = useState(customer?.notes ?? '')

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-lg">お客様が見つかりませんでした</p>
        <Link href="/customers">
          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
          >
            一覧に戻る
          </Button>
        </Link>
      </div>
    )
  }

  const isVip = customer.total_spent > 1000000
  const avgSpent =
    customer.visit_count > 0
      ? Math.round(customer.total_spent / customer.visit_count)
      : 0

  function handleSave() {
    // In real app: persist via API
    setIsEditing(false)
  }

  function handleCancel() {
    if (!customer) return
    setEditName(customer.name)
    setEditPhone(customer.phone ?? '')
    setEditNotes(customer.notes ?? '')
    setIsEditing(false)
  }

  const initial = customer.name.charAt(0)

  return (
    <div className="min-h-screen bg-gray-950 p-6 space-y-6">
      {/* Back nav */}
      <div className="flex items-center gap-3">
        <Link href="/customers">
          <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <span className="text-gray-500 text-sm">お客様管理 / {customer.name}</span>
      </div>

      {/* Profile Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Avatar + info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
              <span className="text-2xl font-bold text-white">{initial}</span>
            </div>
            <div className="space-y-3 flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-gray-400 text-xs">お名前</Label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white focus:border-amber-500 h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-400 text-xs">電話番号</Label>
                    <Input
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white focus:border-amber-500 h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-400 text-xs">メモ・備考</Label>
                    <Textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      rows={3}
                      className="bg-gray-800 border-gray-700 text-white focus:border-amber-500 resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-bold text-white">{customer.name}</h2>
                    {isVip && (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        VIP
                      </Badge>
                    )}
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-gray-400">
                      <Phone className="w-3.5 h-3.5" />
                      <span className="text-sm">{customer.phone}</span>
                    </div>
                  )}
                  {customer.notes && (
                    <div className="flex items-start gap-1.5 mt-2 text-gray-400">
                      <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span className="text-sm leading-relaxed">{customer.notes}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Edit controls */}
          <div className="shrink-0">
            {isEditing ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold gap-1"
                >
                  <Check className="w-4 h-4" />
                  保存
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 gap-1"
                >
                  <X className="w-4 h-4" />
                  取消
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 gap-1"
              >
                <Pencil className="w-4 h-4" />
                編集
              </Button>
            )}
          </div>
        </div>

        {/* Last visit highlight */}
        {visits.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-gray-400">最終来店：</span>
            <span className="text-amber-400 font-medium">{formatDate(customer.last_visit)}</span>
            {visits[0]?.table_number && (
              <>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400">テーブル {visits[0].table_number}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Calendar}
          label="累計来店回数"
          value={`${customer.visit_count.toLocaleString()}回`}
        />
        <StatCard
          icon={TrendingUp}
          label="累計消費額"
          value={formatCurrency(customer.total_spent)}
        />
        <StatCard
          icon={Receipt}
          label="平均消費額/回"
          value={formatCurrency(avgSpent)}
        />
      </div>

      {/* Visit History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">来店履歴</h3>
          <span className="text-sm text-gray-500">{visits.length}件</span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {visits.length === 0 ? (
            <div className="py-12 text-center text-gray-500">来店履歴がありません</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400 font-medium">来店日</TableHead>
                  <TableHead className="text-gray-400 font-medium">テーブル</TableHead>
                  <TableHead className="text-gray-400 font-medium text-right">伝票金額</TableHead>
                  <TableHead className="text-gray-400 font-medium">担当キャスト</TableHead>
                  <TableHead className="text-gray-400 font-medium">ステータス</TableHead>
                  <TableHead className="text-gray-400 font-medium text-center">伝票</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.map((visit) => (
                  <TableRow
                    key={visit.id}
                    className="border-gray-800 hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell className="text-gray-300">{formatDate(visit.visit_date)}</TableCell>
                    <TableCell className="text-gray-300">{visit.table_number}</TableCell>
                    <TableCell className="text-right font-medium text-white">
                      {formatCurrency(visit.total_amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {visit.casts.map((cast) => (
                          <span
                            key={cast}
                            className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-300"
                          >
                            {cast}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`border text-xs font-medium ${STATUS_STYLES[visit.status]}`}
                      >
                        {STATUS_LABELS[visit.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/bills/${visit.bill_id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-600 gap-1"
                        >
                          <Receipt className="w-3 h-3" />
                          表示
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}
