import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signout } from '@/app/auth/actions' // 👈 引入 signout Action
import { ArrowRight, Droplets, LogOut, ShieldCheck, Zap } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      {/* 顶部导航栏 */}
      <header className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold text-xl tracking-wide">
          <Droplets className="w-6 h-6 text-green-500" />
          <span>Kakashi Tech 水田警報システム</span>
        </div>

        <div>
          {user ? (
            /* 已登录状态：显示用户邮箱前缀、进入控制台按钮 和 退出登录按钮 */
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 hidden sm:inline-block">
                {user.email}
              </span>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition"
              >コンソールに入る
                 <ArrowRight className="w-4 h-4" />
              </Link>

              {/* 使用 form 触发 Server Action 实现一键退出登录 */}
              <form action={signout}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                >ログアウト
                  <LogOut className="w-3.5 h-3.5" />
                  
                </button>
              </form>
            </div>
          ) : (
            /* 未登录状态：显示登录与注册按钮 */
            <div className="flex gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-slate-300 hover:text-white font-medium transition"
              >
                ログイン
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition"
              >
                無料体験
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* 主视觉区域 (Hero Section) ... 保持不变 */}
      <main className="max-w-4xl mx-auto text-center px-6 py-20 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-medium">
          <Zap className="w-3.5 h-3.5" /> インテリジェントな水田水位監視とLINEリアルタイムアラーム
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          すべての水田を守ります。 <br />
          <span className="text-green-500">異常な水流が発生した場合は、LINEで即座に通知します。</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
         現代の農地向けに特別に設計されたIoT水位検知システム。
         低消費電力センサーとLINEメッセージングAPIを高度に統合することで、
         水田の干上がりや氾濫時に遅延のないアラームを発信します。
         </p>

        <div className="pt-4 flex justify-center gap-4">
          {user ? (
            <Link
              href="/dashboard/settings"
              className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-medium rounded-xl shadow-lg transition flex items-center gap-2"
            >
              デバイスとLINEアラートの設定に移動してください。 <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-medium rounded-xl shadow-lg transition flex items-center gap-2"
            >
              すぐに您的水田账号をバインドしてください。 <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* 亮点展示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-12 border-t border-slate-800">
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <ShieldCheck className="w-8 h-8 text-green-400 mb-2" />
            <h3 className="font-semibold text-white">第二段階のアラームボタンを押す</h3>
            <p className="text-sm text-slate-400 mt-1">値が設定されたしきい値を下回ると、LINEモバイルアプリにリッチテキスト形式のプッシュ通知が即座に送信されます。</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <Droplets className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="font-semibold text-white">一键账号绑定</h3>
            <p className="text-sm text-slate-400 mt-1">ワンクリックでアカウント連携。</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <Zap className="w-8 h-8 text-amber-400 mb-2" />
            <h3 className="font-semibold text-white">クラウドベースのオープンインターフェース</h3>
            <p className="text-sm text-slate-400 mt-1">物理ハードウェアとシミュレータ間の直接データ接続をサポートし、Next.jsルーティングフレームワークとシームレスに統合します。</p>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="text-center py-6 text-xs text-slate-500 border-t border-slate-800">
        © {new Date().getFullYear()} Kakashi Tech All rights reserved.
      </footer>
    </div>
  )
}