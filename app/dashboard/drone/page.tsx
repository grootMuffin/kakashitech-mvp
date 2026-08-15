'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Plane, 
  Play, 
  Pause, 
  RotateCcw, 
  Camera, 
  Compass, 
  Navigation, 
  Battery, 
  Wifi, 
  ShieldAlert,
  Layers
} from 'lucide-react'

export default function DroneInspectionPage() {
  const [isFlying, setIsFlying] = useState(false)
  const [activeTab, setActiveTab] = useState<'video' | 'map'>('video')

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8 space-y-6">
      {/* 顶栏 */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Plane className="w-5 h-5 text-indigo-400" /> 无人机实时巡检控制台
            </h1>
            <p className="text-xs text-slate-400">地块 ID: Paddy-Sector-01 (120 亩)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isFlying ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-slate-800 text-slate-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isFlying ? 'bg-green-400 animate-ping' : 'bg-slate-500'}`} />
            {isFlying ? '飞行巡检中' : '机巢待命'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧 2 列: 视频/地图 HUD 模拟主窗口 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
            {/* 视角切换按钮 */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              <button
                onClick={() => setActiveTab('video')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg backdrop-blur-md transition ${
                  activeTab === 'video' ? 'bg-indigo-600 text-white' : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                高清图传 HUD
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg backdrop-blur-md transition ${
                  activeTab === 'map' ? 'bg-indigo-600 text-white' : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                三维航线地图
              </button>
            </div>

            {/* 模拟 HUD 画面 */}
            {activeTab === 'video' ? (
              <div className="w-full h-full relative flex items-center justify-center bg-slate-900 bg-cover bg-center"
                   style={{ backgroundImage: 'radial-gradient(circle, rgba(15,23,42,0.6) 0%, rgba(2,6,23,0.95) 100%)' }}>
                {/* 网格线条与瞄准准星 */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
                
                {/* 中央十字准星 */}
                <div className="relative w-32 h-32 border border-indigo-500/30 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                  <div className="absolute w-full h-[1px] bg-indigo-500/40" />
                  <div className="absolute h-full w-[1px] bg-indigo-500/40" />
                </div>

                {/* HUD 覆盖文字信息 */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-xs font-mono text-indigo-300/80">
                  <div>
                    <p>LAT: 35.6895° N</p>
                    <p>LNG: 139.6917° E</p>
                  </div>
                  <div className="text-right">
                    <p>ALT: {isFlying ? '45.2 m' : '0.0 m'}</p>
                    <p>SPD: {isFlying ? '12.4 km/h' : '0.0 km/h'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                <Layers className="w-10 h-10 text-indigo-500/50 animate-bounce" />
                <p className="text-xs">三维地形与航线规划图加载中...</p>
              </div>
            )}
          </div>

          {/* 控制按键栏 */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFlying(!isFlying)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg ${
                  isFlying 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
              >
                {isFlying ? <><Pause className="w-4 h-4" /> 暂停巡航</> : <><Play className="w-4 h-4" /> 开始自动巡航</>}
              </button>

              <button
                onClick={() => setIsFlying(false)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded-xl transition"
              >
                <RotateCcw className="w-4 h-4" /> 一键返航 (RTH)
              </button>
            </div>

            <button
              onClick={() => alert('截图已保存至巡检相册')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded-xl transition"
            >
              <Camera className="w-4 h-4" /> 航拍抓拍
            </button>
          </div>
        </div>

        {/* 右侧 1 列: 无人机遥测数据仪表 */ }
        <div className="space-y-4">
          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-800 space-y-5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-indigo-400" /> 遥测数据面板
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <p className="text-[10px] text-slate-400">电池电量</p>
                <p className="text-lg font-bold text-green-400 mt-1 flex items-center gap-1">
                  <Battery className="w-4 h-4" /> 98%
                </p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <p className="text-[10px] text-slate-400">图传信号</p>
                <p className="text-lg font-bold text-indigo-400 mt-1 flex items-center gap-1">
                  <Wifi className="w-4 h-4" /> -62 dBm
                </p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <p className="text-[10px] text-slate-400">相对飞行高度</p>
                <p className="text-lg font-bold text-white mt-1">
                  {isFlying ? '45.2 m' : '0.0 m'}
                </p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <p className="text-[10px] text-slate-400">巡航风速</p>
                <p className="text-lg font-bold text-white mt-1">2.1 m/s</p>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">本次地块巡检进度</span>
                <span className="text-indigo-400 font-semibold">{isFlying ? '64%' : '0%'}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-500" 
                  style={{ width: isFlying ? '64%' : '0%' }}
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-amber-300">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold">电子围栏保护已开启</p>
              <p className="text-amber-300/80 leading-relaxed">
                无人机被限定在指定 120 亩水田空域内飞行，超出边界将自动悬停并触发安全返航。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}