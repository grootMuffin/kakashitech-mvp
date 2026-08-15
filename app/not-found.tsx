import Link from 'next/link'
import { AlertCircle, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">404 - ページが見つかりません</h1>
          <p className="text-sm text-gray-500 mt-2">
            リクエストされたページは存在しないか、削除されています。入力したURLが正しいかご確認ください。
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-lg transition"
          >
            <Home className="w-4 h-4" /> ホームページに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}