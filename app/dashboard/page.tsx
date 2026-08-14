// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Droplet, ShieldAlert, ShieldCheck, Navigation, Eye, Play, RotateCcw } from 'lucide-react';

export default function Dashboard() {
  // 核心状态管理
  const [waterLevel, setWaterLevel] = useState<number>(5.2);
  const [isAlert, setIsAlert] = useState<boolean>(false);
  const [droneState, setDroneState] = useState<'idle' | 'triggered' | 'flying' | 'arrived'>('idle');
  const [time, setTime] = useState<number>(0);

  // 1. Mock 数据发生器：让水位计规律且真实地产生小幅度上下波动
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 0.1);
      
      // 只要无人机没有被触发破坏状态，水位在 4.5cm 到 5.5cm 之间做平滑的正弦波波动
      if (droneState === 'idle') {
        const wave = Math.sin(time) * 0.3; // 波动幅度 0.3cm
        setWaterLevel(parseFloat((5.0 + wave).toFixed(1)));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [time, droneState]);

  // 2. 模拟遭到偷窃/野生动物撞击的“突发事件触发器”
  const triggerTheftIncident = () => {
    setIsAlert(true);
    setWaterLevel(1.2); // 模拟水位计被拔出丢在田埂上，读数瞬间暴跌
    setDroneState('triggered');
  };

  // 3. 模拟无人机起飞航线动画
  const launchDrone = () => {
    setDroneState('flying');
    setTimeout(() => {
      setDroneState('arrived');
    }, 4000); // 4秒后模拟划过航线抵达现场
  };

  // 4. 重置状态
  const resetDemo = () => {
    setWaterLevel(5.2);
    setIsAlert(false);
    setDroneState('idle');
    setTime(0);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 font-sans">
      {/* 头部控制区 */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" /> kakashitech SaaS Live Demo
          </div>
          <h1 className="text-2xl font-black">藤沢第3地区 - 水田管理コンソール</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={resetDemo} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all">
            <RotateCcw size={16} /> 状態リセット
          </button>
          <Link href="/" className="border border-slate-700 hover:bg-slate-800 text-slate-400 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
            ← 官网首页
          </Link>
        </div>
      </div>

      {/* 核心展示区 */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8">
        
        {/* 左侧：直观的“水箱式”动态水位计组件 */}
        <div className="md:col-span-4 bg-slate-800/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[400px]">
          <h3 className="font-bold text-slate-400 text-sm self-start flex items-center gap-1.5">
            <Droplet size={16} className="text-blue-400" /> リアルタイム水位測定
          </h3>
          
          {/* 水箱容器组件 */}
          <div className="w-32 h-64 bg-slate-950 rounded-2xl border-4 border-slate-700 relative overflow-hidden flex flex-col justify-end shadow-inner my-6">
            {/* 动态填充层 */}
            <div 
              className={`w-full transition-all duration-1000 ease-in-out relative ${isAlert ? 'bg-gradient-to-t from-orange-600 to-red-500' : 'bg-gradient-to-t from-blue-600 to-cyan-400'}`}
              style={{ height: `${Math.min(waterLevel * 10, 100)}%` }}
            >
              {/* 波纹特效 */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-white/20 animate-pulse" />
            </div>
            {/* 大字数显 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              <span className="text-4xl font-black tracking-tight">{waterLevel}</span>
              <span className="text-xs font-bold text-white/70">cm</span>
            </div>
          </div>

          <div className="w-full text-center space-y-1">
            <p className="text-xs text-slate-400">ステータス：</p>
            <p className={`text-sm font-black ${isAlert ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              {isAlert ? '⚠️ 異常水位・デバイス離脱警告' : '正常稼働中 (閾値 3.0cm)'}
            </p>
          </div>
        </div>

        {/* 右侧：地图与陆空协同防犯演示大屏 */}
        <div className="md:col-span-8 bg-slate-800/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between min-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-400 text-sm flex items-center gap-1.5">
              <Eye size={16} className="text-emerald-400" /> 陸空連動セキュリティマップ（コンセプト実証）
            </h3>
            <span className="px-2 py-0.5 bg-slate-900 rounded text-[11px] font-mono text-slate-500">
              MAPBOX_MOCK_CONNECTED
            </span>
          </div>

          {/* 模拟网格地图 */}
          <div className="flex-1 bg-slate-950 rounded-xl relative overflow-hidden border border-slate-800 min-h-[250px] p-4 flex items-center justify-center">
            {/* 背景网格线 */}
            <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            {/* 模拟基地（DJI Dock） */}
            <div className="absolute left-12 bottom-12 text-center">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${droneState === 'idle' ? 'bg-slate-800 border-slate-600' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                🏠
              </div>
              <span className="text-[10px] block mt-1 text-slate-500 font-bold">ドローン基地</span>
            </div>

            {/* 模拟水田设备点 */}
            <div className="absolute right-16 top-16 text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isAlert ? 'bg-red-950 border-red-500 text-red-400 animate-ping' : 'bg-emerald-950 border-emerald-500 text-emerald-400'}`}>
                🌾
              </div>
              <span className="text-[10px] block mt-1 text-slate-400 font-bold">藤沢第3水位计</span>
            </div>

            {/* 动态飞行的无人机图标 */}
            {droneState === 'flying' && (
              <div className="absolute animate-all duration-[4000ms] ease-out flex flex-col items-center text-orange-400 animate-pulse"
                   style={{ left: '50%', top: '40%' }}>
                <Navigation className="rotate-45" size={24} />
                <span className="text-[9px] font-bold bg-orange-500 text-white px-1 rounded mt-1">ドローン急行中...</span>
              </div>
            )}

            {droneState === 'arrived' && (
              <div className="absolute right-28 top-8 flex flex-col items-center text-red-400 animate-bounce">
                <Navigation size={24} className="rotate-180" />
                <span className="text-[9px] font-bold bg-red-600 text-white px-1 rounded mt-1">上空到着・録画中</span>
              </div>
            )}

            {droneState === 'idle' && (
              <p className="text-xs text-slate-600 font-medium text-center z-10">
                画面下の「🚨 盗难破坏シミュレート」ボタンを押すと、防犯連携が発動します。
              </p>
            )}
          </div>

          {/* 下方控制触发台 */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800/80 pt-4">
            <button 
              onClick={triggerTheftIncident}
              disabled={droneState !== 'idle'}
              className="bg-red-950/40 hover:bg-red-950/80 border border-red-800 disabled:opacity-30 disabled:pointer-events-none text-red-400 font-bold p-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
            >
              <ShieldAlert size={16} /> 🚨 盗難・破壊シミュレート（発生）
            </button>

            <button 
              onClick={launchDrone}
              disabled={droneState !== 'triggered'}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-slate-800 disabled:text-slate-600 font-bold p-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/20"
            >
              <Play size={16} /> 🚀 LINEからドローン出動を承認
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}