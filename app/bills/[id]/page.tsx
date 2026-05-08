'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { BillStatusBadge } from '@/components/bills/BillStatusBadge'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'

type BillStatus = 'open' | 'closed' | 'paid'

interface MockBillItem {
  id: string
  name: string
  quantity: number
  unit_price: number
  amount: number
}

interface MockBillData {
  id: string
  bill_number: string
  visit_date: string
  customer_name: string
  table_number: string
  casts: string[]
  items: MockBillItem[]
  status: BillStatus
  closed_at?: string
  paid_at?: string
  notes?: string
}

const MOCK_BILL_DATA: Record<string, MockBillData> = {
  '1': {
    id: '1',
    bill_number: 'B-20260501-001',
    visit_date: '2026-05-01',
    customer_name: '田中 健一',
    table_number: 'VIP-1',
    casts: ['さくら', 'れいな'],
    items: [
      { id: 'i1', name: 'セットチャージ', quantity: 2, unit_price: 5000, amount: 10000 },
      { id: 'i2', name: 'ボトル(シャンパン)', quantity: 2, unit_price: 30000, amount: 60000 },
      { id: 'i3', name: 'フード盛り合わせ', quantity: 1, unit_price: 3000, amount: 3000 },
      { id: 'i4', name: '延長料金', quantity: 2, unit_price: 5000, amount: 10000 },
    ],
    status: 'paid',
    closed_at: '2026-05-01T23:30:00+09:00',
    paid_at: '2026-05-02T00:05:00+09:00',
    notes: 'VIPルーム利用',
  },
  '2': {
    id: '2',
    bill_number: 'B-20260503-001',
    visit_date: '2026-05-03',
    customer_name: '山田 太郎',
    table_number: 'A-2',
    casts: ['みさき'],
    items: [
      { id: 'i1', name: 'セットチャージ', quantity: 1, unit_price: 5000, amount: 5000 },
      { id: 'i2', name: 'ボトル(ウイスキー)', quantity: 1, unit_price: 25000, amount: 25000 },
      { id: 'i3', name: 'フード盛り合わせ', quantity: 2, unit_price: 3000, amount: 6000 },
      { id: 'i4', name: '延長料金', quantity: 1, unit_price: 5000, amount: 5000 },
    ],
    status: 'closed',
    closed_at: '2026-05-03T22:45:00+09:00',
  },
  '3': {
    id: '3',
    bill_number: 'B-20260507-001',
    visit_date: '2026-05-07',
    customer_name: '鈴木 一郎',
    table_number: 'B-1',
    casts: ['あやか', 'さくら'],
    items: [
      { id: 'i1', name: 'セットチャージ', quantity: 2, unit_price: 5000, amount: 10000 },
      { id: 'i2', name: 'ボトル(ウイスキー)', quantity: 1, unit_price: 25000, amount: 25000 },
      { id: 'i3', name: 'フード盛り合わせ', quantity: 3, unit_price: 3000, amount: 9000 },
    ],
    status: 'open',
  },
  '4': {
    id: '4',
    bill_number: 'B-20260508-001',
    visit_date: '2026-05-08',
    customer_name: '田中 健一',
    table_number: 'VIP-2',
    casts: ['れいな'],
    items: [
      { id: 'i1', name: 'セットチャージ', quantity: 1, unit_price: 5000, amount: 5000 },
      { id: 'i2', name: 'ボトル(シャンパン)', quantity: 1, unit_price: 30000, amount: 30000 },
    ],
    status: 'open',
  },
}

const DEFAULT_BILL: MockBillData = MOCK_BILL_DATA['3']

const PRESET_ITEMS = [
  { name: 'セットチャージ', unit_price: 5000 },
  { name: 'ボトル(シャンパン)', unit_price: 30000 },
  { name: 'ボトル(ウイスキー)', unit_price: 25000 },
  { name: 'フード盛り合わせ', unit_price: 3000 },
  { name: '延長料金', unit_price: 5000 },
]

export default function BillDetailPage({ params }: { params: { id: string } }) {
  const initialBill = MOCK_BILL_DATA[params.id] ?? DEFAULT_BILL
  const [billStatus, setBillStatus] = useState<BillStatus>(initialBill.status)
  const [closedAt, setClosedAt] = useState<string | undefined>(initialBill.closed_at)
  const [paidAt, setPaidAt] = useState<string | undefined>(initialBill.paid_at)
  const [items, setItems] = useState<MockBillItem[]>(initialBill.items)

  // Add item form state
  const [newItemName, setNewItemName] = useState('')
  const [newItemQty, setNewItemQty] = useState('1')
  const [newItemPrice, setNewItemPrice] = useState('')

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  const addItem = (name: string, quantity: number, unitPrice: number) => {
    if (!name || quantity <= 0 || unitPrice <= 0) return
    const newItem: MockBillItem = {
      id: `new-${Date.now()}`,
      name,
      quantity,
      unit_price: unitPrice,
      amount: quantity * unitPrice,
    }
    setItems((prev) => [...prev, newItem])
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    addItem(newItemName, parseInt(newItemQty, 10) || 1, parseInt(newItemPrice, 10) || 0)
    setNewItemName('')
    setNewItemQty('1')
    setNewItemPrice('')
  }

  const handlePresetAdd = (preset: { name: string; unit_price: number }) => {
    addItem(preset.name, 1, preset.unit_price)
  }

  const handleClose = () => {
    const now = new Date().toISOString()
    setBillStatus('closed')
    setClosedAt(now)
  }

  const handlePaid = () => {
    const now = new Date().toISOString()
    setBillStatus('paid')
    setPaidAt(now)
  }

  return (
    <div className="p-8 min-h-screen bg-gray-950">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <Link href="/bills">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800 mt-1">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white font-mono">
                {initialBill.bill_number}
              </h1>
              <BillStatusBadge status={billStatus} />
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-400">
              <span>
                <span className="text-gray-500">お客様:</span>{' '}
                <span className="text-white font-medium">{initialBill.customer_name}</span>
              </span>
              <span>
                <span className="text-gray-500">来店日:</span>{' '}
                <span className="text-gray-300">{formatDate(initialBill.visit_date)}</span>
              </span>
              <span>
                <span className="text-gray-500">テーブル:</span>{' '}
                <span className="text-gray-300">{initialBill.table_number}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left/Center */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cast Assignment */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              担当キャスト
            </h2>
            <div className="flex flex-wrap gap-2">
              {initialBill.casts.map((cast) => (
                <span
                  key={cast}
                  className="inline-flex items-center rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-sm text-amber-300 font-medium"
                >
                  {cast}
                </span>
              ))}
            </div>
          </div>

          {/* Bill Items */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                品目
              </h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-500 text-xs">品目名</TableHead>
                  <TableHead className="text-gray-500 text-xs text-right">数量</TableHead>
                  <TableHead className="text-gray-500 text-xs text-right">単価</TableHead>
                  <TableHead className="text-gray-500 text-xs text-right">小計</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow className="border-gray-800 hover:bg-gray-800/20">
                    <TableCell colSpan={4} className="text-center text-gray-600 py-8">
                      品目がありません
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id} className="border-gray-800 hover:bg-gray-800/30">
                      <TableCell className="text-white">{item.name}</TableCell>
                      <TableCell className="text-gray-300 text-right">{item.quantity}</TableCell>
                      <TableCell className="text-gray-300 text-right">
                        {formatCurrency(item.unit_price)}
                      </TableCell>
                      <TableCell className="text-white font-medium text-right">
                        {formatCurrency(item.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Totals */}
            <div className="border-t border-gray-800 px-5 py-4">
              <div className="flex justify-between items-center text-sm text-gray-400 mb-1">
                <span>小計</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <Separator className="my-2 bg-gray-800" />
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-white">合計</span>
                <span className="text-xl font-bold text-amber-400">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Add Item Section (only when open) */}
          {billStatus === 'open' && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                品目を追加
              </h2>

              {/* Preset Quick-Add */}
              <div>
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  クイック追加
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_ITEMS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handlePresetAdd(preset)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-300 transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      {preset.name}
                      <span className="text-gray-500">{formatCurrency(preset.unit_price)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="bg-gray-800" />

              {/* Manual Add Form */}
              <form onSubmit={handleAddItem} className="flex gap-3 items-end">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-gray-400 text-xs">品目名</Label>
                  <Input
                    type="text"
                    placeholder="例: ビール"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 focus:border-amber-500 h-9"
                  />
                </div>
                <div className="w-20 space-y-1.5">
                  <Label className="text-gray-400 text-xs">数量</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white focus:border-amber-500 h-9"
                  />
                </div>
                <div className="w-32 space-y-1.5">
                  <Label className="text-gray-400 text-xs">単価（円）</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 focus:border-amber-500 h-9"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!newItemName || !newItemPrice}
                  className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold h-9 disabled:opacity-40"
                >
                  追加
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column - Actions & Info */}
        <div className="space-y-6">
          {/* Notes */}
          {initialBill.notes && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                メモ
              </h2>
              <p className="text-gray-300 text-sm">{initialBill.notes}</p>
            </div>
          )}

          {/* Status Timeline */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              ステータス
            </h2>

            <div className="space-y-3">
              {/* Open */}
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-300">営業開始</p>
                  <p className="text-xs text-gray-500">{formatDate(initialBill.visit_date)}</p>
                </div>
              </div>

              {/* Closed */}
              {closedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-300">会計済</p>
                    <p className="text-xs text-gray-500">{formatDateTime(closedAt)}</p>
                  </div>
                </div>
              )}

              {/* Paid */}
              {paidAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-300">入金確認</p>
                    <p className="text-xs text-gray-500">{formatDateTime(paidAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              アクション
            </h2>

            {billStatus === 'open' && (
              <>
                <Button
                  onClick={handleClose}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  会計する
                </Button>
                <Link href="/bills" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-700"
                  >
                    キャンセル
                  </Button>
                </Link>
              </>
            )}

            {billStatus === 'closed' && (
              <Button
                onClick={handlePaid}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                入金確認
              </Button>
            )}

            {billStatus === 'paid' && paidAt && (
              <div className="rounded-md bg-green-500/10 border border-green-500/20 px-4 py-3 text-center">
                <p className="text-xs text-green-400 font-medium">入金確認済み</p>
                <p className="text-xs text-gray-500 mt-1">{formatDateTime(paidAt)}</p>
              </div>
            )}
          </div>

          {/* Total Summary Card */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-5">
            <p className="text-xs text-amber-400/80 font-medium uppercase tracking-wider mb-1">
              合計金額
            </p>
            <p className="text-3xl font-bold text-amber-400">
              {formatCurrency(totalAmount)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{items.length} 品目</p>
          </div>
        </div>
      </div>
    </div>
  )
}
