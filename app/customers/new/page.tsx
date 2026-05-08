'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserPlus, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function NewCustomerPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('お名前は必須です')
      return
    }

    setLoading(true)
    // Simulate save (no Supabase yet)
    setTimeout(() => {
      setLoading(false)
      router.push('/customers')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/customers">
            <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <UserPlus className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">新規お客様登録</h1>
              <p className="text-sm text-gray-400">お客様情報を入力してください</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300 font-medium">
                お名前
                <span className="ml-1 text-amber-400 text-xs">必須</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="例：田中 健一"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 focus:border-amber-500"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300 font-medium">
                電話番号
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="例：090-1234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 focus:border-amber-500"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gray-300 font-medium">
                メモ・備考
              </Label>
              <Textarea
                id="notes"
                placeholder="好みのお酒、接待利用など..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 focus:border-amber-500 resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold disabled:opacity-60"
              >
                {loading ? '登録中...' : '登録する'}
              </Button>
              <Link href="/customers" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  キャンセル
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
