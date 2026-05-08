import { Settings, Store, CreditCard } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-amber-400" />
        <h1 className="text-2xl font-bold text-white">設定</h1>
      </div>

      {/* ── 店舗情報 ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800">
          <Store className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-white">店舗情報</h2>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 店舗名 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-400">店舗名</label>
              <input
                type="text"
                defaultValue="GinzaBooks 本店"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-600"
                placeholder="店舗名を入力"
              />
            </div>

            {/* 電話番号 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-400">電話番号</label>
              <input
                type="tel"
                defaultValue="03-1234-5678"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-600"
                placeholder="電話番号を入力"
              />
            </div>

            {/* 住所 */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-medium text-gray-400">住所</label>
              <input
                type="text"
                defaultValue="東京都中央区銀座1-1-1 銀座ビル5F"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-600"
                placeholder="住所を入力"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-gray-950 text-sm font-semibold transition-colors"
            >
              保存する
            </button>
          </div>
        </div>
      </div>

      {/* ── プラン ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800">
          <CreditCard className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-white">プラン</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-bold text-white">Proプラン</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  現在のプラン
                </span>
              </div>
              <p className="text-sm text-gray-400">¥9,800 / 月</p>
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <p>
                契約開始日:{' '}
                <span className="text-gray-300">2026年1月1日</span>
              </p>
              <p>
                次回更新日:{' '}
                <span className="text-gray-300">2026年6月1日</span>
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'キャスト登録', value: '無制限' },
              { label: 'お客様管理', value: '無制限' },
              { label: 'データエクスポート', value: '対応' },
            ].map((feature) => (
              <div
                key={feature.label}
                className="bg-gray-800 rounded-lg px-4 py-3 border border-gray-700"
              >
                <p className="text-xs text-gray-500">{feature.label}</p>
                <p className="text-sm font-semibold text-white mt-0.5">{feature.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-gray-800">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium border border-gray-700 transition-colors"
            >
              プランを変更する
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
