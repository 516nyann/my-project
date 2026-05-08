'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

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

function getInitial(name: string): string {
  return name.charAt(0)
}

export default function CastsPage() {
  const [showAll, setShowAll] = useState(false)

  const displayedCasts = showAll
    ? MOCK_CASTS
    : MOCK_CASTS.filter((c) => c.active)

  return (
    <div className="p-8 bg-gray-950 min-h-screen">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">キャスト管理</h1>
          <p className="text-gray-400 mt-1 text-sm">在籍キャストの管理・売上確認</p>
        </div>
        <Link href="/casts/new">
          <Button className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold">
            + キャスト追加
          </Button>
        </Link>
      </div>

      {/* Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setShowAll(false)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !showAll
              ? 'bg-amber-500 text-gray-950'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          在籍中のみ
        </button>
        <button
          onClick={() => setShowAll(true)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            showAll
              ? 'bg-amber-500 text-gray-950'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          すべて表示
        </button>
      </div>

      {/* Cast grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCasts.map((cast) => (
          <Card
            key={cast.id}
            className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20">
                  <span className="text-xl font-bold text-white">
                    {getInitial(cast.name)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-white">{cast.name}</h2>
                    <span className="text-sm text-gray-400">{cast.number}</span>
                  </div>
                  <div className="mt-1">
                    {cast.active ? (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                        在籍中
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-700/50 text-gray-400 border-gray-600 text-xs">
                        休業中
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Sales stats */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="bg-gray-800/60 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">今月売上</p>
                  <p className="text-base font-bold text-amber-400">
                    {formatCurrency(cast.monthly_sales)}
                  </p>
                </div>
                <div className="bg-gray-800/60 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">担当件数</p>
                  <p className="text-base font-bold text-white">
                    {cast.bill_count}
                    <span className="text-xs text-gray-400 ml-1">件</span>
                  </p>
                </div>
              </div>

              {/* Detail link */}
              <div className="mt-4">
                <Link href={`/casts/${cast.id}`}>
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white text-sm"
                  >
                    詳細を見る
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayedCasts.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">キャストが登録されていません</p>
        </div>
      )}
    </div>
  )
}
