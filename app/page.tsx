// src/app/page.tsx
import Link from 'next/link';
import { Droplet, ShieldAlert, ShieldCheck, Bell, Radio } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans">
      {/* 导航栏 */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">T</div>
          <span className="text-xl font-black text-emerald-800 tracking-wider">kakashitech</span>
        </div>
        <Link href="/dashboard" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2 rounded-full transition-all text-sm shadow-sm shadow-emerald-200">
          デモコンソールを開く (SaaS体験) →
        </Link>
      </nav>

      {/* Hero 区域 */}
      <header className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
            <Radio size={12} /> 次世代アグリテックソリューション
          </span>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            土と空をつなぎ、<br />
            <span className="text-emerald-600">地域農業に絶対的な安心を。</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
            日本の高齢化する稲作農家へ捧げる、極限の低コスト水管理。中国の成熟した技適合規ハードウェアと、AWS・LINE連携が生み出す「陸空一体型」防犯・防獣エコシステム。
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl text-center shadow-lg shadow-emerald-200 transition-all">
              無料デモを体験する
            </Link>
            <a href="#concept" className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold px-8 py-4 rounded-xl text-center transition-all">
              コンセプトを見る
            </a>
          </div>
        </div>

        {/* 核心模拟：LINE 界面截图 Mock */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[340px] bg-[#7494C0] rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 aspect-[9/19] flex flex-col justify-between">
            {/* 模拟状态栏 */}
            <div className="flex justify-between px-6 py-1 text-xs text-white/80 font-medium">
              <span>11:16</span>
              <div className="flex gap-1">🟢 4G 🔋 100%</div>
            </div>
            {/* LINE 聊天头部 */}
            <div className="text-center text-white font-bold py-2 border-b border-white/10 text-sm">
              kakashitech | スマート水管理
            </div>
            {/* LINE 消息流 */}
            <div className="flex-1 p-3 space-y-4 overflow-y-auto flex flex-col justify-end">
              <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm max-w-[85%] self-start text-xs text-slate-800 space-y-2">
                <div className="font-bold text-emerald-700 flex items-center gap-1">
                  <Droplet size={14} /> 【水位低下アラート】
                </div>
                <p>藤沢第3水田の水位が <b>1.8cm</b> に低下しました。（設定閾值: 3.0cm）</p>
                <p className="text-[10px] text-slate-400">11:10</p>
              </div>

              <div className="bg-[#FF9800] text-white rounded-2xl rounded-tl-none p-3 shadow-sm max-w-[85%] self-start text-xs space-y-2 border border-orange-400 animate-bounce">
                <div className="font-bold flex items-center gap-1 text-white">
                  <ShieldAlert size={14} /> 【警告：異常振動検知】
                </div>
                <p>第3水田の水位計に異常な衝撃が加わりました。盗難または野獣の可能性があります。</p>
                <p className="font-black underline bg-white/20 p-1 rounded text-center text-[11px] mt-1">
                  🚀 ドローン（DJI Dock）を緊急出動させますか？
                </p>
                <p className="text-[10px] text-white/70">11:12</p>
              </div>
            </div>
            {/* 模拟输入框 */}
            <div className="bg-white rounded-full p-2 flex justify-between items-center text-slate-400 text-xs px-4 mb-2">
              <span>ドローンを出動させてください</span>
              <span className="text-emerald-600 font-bold">送信</span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}