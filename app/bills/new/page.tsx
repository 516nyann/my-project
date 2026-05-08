'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const MOCK_CUSTOMERS = [
  { id: '1', name: '田中 健一', phone: '090-1234-5678' },
  { id: '2', name: '山田 太郎', phone: '090-9876-5432' },
  { id: '3', name: '鈴木 一郎', phone: '090-5555-4444' },
]

const MOCK_CASTS = [
  { id: '1', name: 'さくら', number: 'No.1' },
  { id: '2', name: 'れいな', number: 'No.2' },
  { id: '3', name: 'みさき', number: 'No.3' },
  { id: '4', name: 'あやか', number: 'No.4' },
]

function todayString() {
  const d = new Date()
  return d.toISOString().split('T')[0]
}

export default function NewBillPage() {
  const router = useRouter()
  const [customerId, setCustomerId] = useState('')
  const [customerSearch, setCustomerSearch] = useState('')
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  const [visitDate, setVisitDate] = useState(todayString())
  const [tableNumber, setTableNumber] = useState('')
  const [selectedCasts, setSelectedCasts] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredCustomers = MOCK_CUSTOMERS.filter(
    (c) =>
      c.name.includes(customerSearch) ||
      (c.phone && c.phone.includes(customerSearch))
  )

  const selectedCustomer = MOCK_CUSTOMERS.find((c) => c.id === customerId)

  const toggleCast = (castId: string) => {
    setSelectedCasts((prev) =>
      prev.includes(castId) ? prev.filter((id) => id !== castId) : [...prev, castId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId || !visitDate) return
    setIsSubmitting(true)
    // Mock submission — in production this would POST to the API/Supabase
    setTimeout(() => {
      router.push('/bills/3') // Redirect to mock open bill detail
    }, 600)
  }

  return (
    <div className="p-8 min-h-screen bg-gray-950">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/bills">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            新規伝票作成
          </h1>
          <p className="text-gray-400 mt-1 text-sm">新しい伝票を作成します</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Customer Selection */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">お客様情報</h2>

          <div className="space-y-2">
            <Label className="text-gray-300">お客様 <span className="text-amber-400">*</span></Label>
            <div className="relative">
              {selectedCustomer ? (
                <div className="flex items-center gap-3 h-10 w-full rounded-md border border-amber-500/50 bg-gray-800 px-3 py-2">
                  <span className="text-white flex-1">{selectedCustomer.name}</span>
                  <span className="text-gray-500 text-sm">{selectedCustomer.phone}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerId('')
                      setCustomerSearch('')
                    }}
                    className="text-gray-500 hover:text-white text-xs ml-2"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <Input
                    type="text"
                    placeholder="お客様名または電話番号で検索..."
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value)
                      setShowCustomerDropdown(true)
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                    onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 150)}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-500"
                  />
                  {showCustomerDropdown && filteredCustomers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-xl overflow-hidden">
                      {filteredCustomers.map((customer) => (
                        <button
                          key={customer.id}
                          type="button"
                          onMouseDown={() => {
                            setCustomerId(customer.id)
                            setCustomerSearch('')
                            setShowCustomerDropdown(false)
                          }}
                          className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-white hover:bg-gray-700 transition-colors text-left"
                        >
                          <span className="font-medium">{customer.name}</span>
                          <span className="text-gray-400 text-xs">{customer.phone}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {showCustomerDropdown && customerSearch && filteredCustomers.length === 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-xl px-3 py-3 text-sm text-gray-500">
                      該当するお客様がいません
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Visit Information */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">来店情報</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">来店日 <span className="text-amber-400">*</span></Label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
                className="h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">テーブル番号</Label>
              <Input
                type="text"
                placeholder="例: VIP-1, A-2"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Cast Assignment */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">担当キャスト</h2>
          <p className="text-gray-500 text-sm">担当するキャストを選択してください（複数選択可）</p>

          <div className="grid grid-cols-2 gap-3">
            {MOCK_CASTS.map((cast) => {
              const isSelected = selectedCasts.includes(cast.id)
              return (
                <button
                  key={cast.id}
                  type="button"
                  onClick={() => toggleCast(cast.id)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border text-left transition-all',
                    isSelected
                      ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                      : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-750'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                      isSelected ? 'border-amber-400 bg-amber-400' : 'border-gray-600'
                    )}
                  >
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-gray-950" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{cast.name}</p>
                    <p className="text-xs text-gray-500">{cast.number}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {selectedCasts.length > 0 && (
            <p className="text-xs text-amber-400">
              {selectedCasts.length}名のキャストを選択中
            </p>
          )}
        </div>

        {/* Notes */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">メモ</h2>
          <Textarea
            placeholder="備考・特記事項があれば入力してください"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-500 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-2">
          <Button
            type="submit"
            disabled={!customerId || !visitDate || isSubmitting}
            className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold disabled:opacity-50"
          >
            {isSubmitting ? '作成中...' : '伝票を作成'}
          </Button>
          <Link href="/bills">
            <Button
              type="button"
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              キャンセル
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
