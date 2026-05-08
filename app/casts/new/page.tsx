'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function NewCastPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [active, setActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('キャスト名を入力してください')
      return
    }
    setError('')
    setSubmitting(true)
    // Mock: simulate save and redirect
    setTimeout(() => {
      router.push('/casts')
    }, 600)
  }

  return (
    <div className="p-8 bg-gray-950 min-h-screen">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/casts"
            className="text-sm text-gray-400 hover:text-amber-400 transition-colors mb-3 inline-block"
          >
            ← キャスト一覧に戻る
          </Link>
          <h1 className="text-2xl font-bold text-white">キャスト追加</h1>
          <p className="text-gray-400 mt-1 text-sm">新しいキャストを登録します</p>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">キャスト情報</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300 text-sm font-medium">
                  キャスト名
                  <span className="text-red-400 ml-1">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例: さくら"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-amber-500"
                />
              </div>

              {/* Number */}
              <div className="space-y-2">
                <Label htmlFor="number" className="text-gray-300 text-sm font-medium">
                  キャスト番号
                </Label>
                <Input
                  id="number"
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="例: No.5"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-amber-500"
                />
                <p className="text-xs text-gray-500">省略可能。入力する場合は「No.〇」の形式を推奨します。</p>
              </div>

              {/* Status */}
              <div className="space-y-3">
                <Label className="text-gray-300 text-sm font-medium">ステータス</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        active
                          ? 'border-amber-500 bg-amber-500'
                          : 'border-gray-600 group-hover:border-gray-400'
                      }`}
                      onClick={() => setActive(true)}
                    >
                      {active && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span
                      className="text-sm text-gray-300 cursor-pointer"
                      onClick={() => setActive(true)}
                    >
                      在籍中
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        !active
                          ? 'border-amber-500 bg-amber-500'
                          : 'border-gray-600 group-hover:border-gray-400'
                      }`}
                      onClick={() => setActive(false)}
                    >
                      {!active && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span
                      className="text-sm text-gray-300 cursor-pointer"
                      onClick={() => setActive(false)}
                    >
                      休業中
                    </span>
                  </label>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold disabled:opacity-50"
                >
                  {submitting ? '登録中...' : '登録する'}
                </Button>
                <Link href="/casts" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    キャンセル
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
