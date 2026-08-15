'use client'

import Link from 'next/link'
import { 
  Plane, 
  Waves, 
  Sliders, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Droplets,
  BatteryCharging,
  Wifi
} from 'lucide-react'

export default function DashboardOverviewPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 space-y-8">
      {/* 1. 顶部 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kakashi Tech 智能水田管理平台</h1>
          <p className="text-sm text-slate-500 mt-1">
            实时监控水田水位、土壤参数与无人机自动巡检轨迹
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl shadow-sm transition"
          >
            <Sliders className="w-4 h-4" /> 渠道配置
          </Link>
        </div>
      </div>

      {/* 2. 关键 KPI 指标概览 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">水田监测总面积</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">120 亩</h3>
            <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 4/4 地块正常
            </span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Droplets className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">平均水位</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">18.5 cm</h3>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 mt-1">
              最佳水位范围: 10-25cm
            </span>
          </div>
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shrink-0">
            <Waves className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">巡检无人机状态</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">机巢待命</h3>
            <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium mt-1">
              <BatteryCharging className="w-3.5 h-3.5" /> 电量 98%
            </span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <Plane className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">IoT 传感器连线率</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">100%</h3>
            <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium mt-1">
              <Wifi className="w-3.5 h-3.5" /> 8 个节点全部在线
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. 功能模块快速入口卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 入口 1：水田水位 & 历史趋势 */}
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute right-0 top-0 -mt-6 -mr-6 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-125 transition duration-500 pointer-events-none" />
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 backdrop-blur-md rounded-full text-xs font-medium text-blue-300 border border-blue-400/30 mb-4">
              <Waves className="w-3.5 h-3.5" /> 实时 IoT 监控
            </div>
            <h2 className="text-2xl font-bold text-white">水量与传感器可视化</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              实时接收水田 IoT 传感器上报的水位、水温数据，动态展示 24 小时历史趋势曲线，支持告警阈值智能监测。
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-700/60 flex items-center justify-between">
            <span className="text-xs text-slate-400">已连接 Python 模拟器 API</span>
            <Link
              href="/dashboard/water-level"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-blue-600/30"
            >
              进入水位监控 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 入口 2：无人机巡检 */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute right-0 top-0 -mt-6 -mr-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-125 transition duration-500 pointer-events-none" />
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 backdrop-blur-md rounded-full text-xs font-medium text-indigo-300 border border-indigo-400/30 mb-4">
              <Plane className="w-3.5 h-3.5" /> 智能无人机巡检
            </div>
            <h2 className="text-2xl font-bold text-white">无人机实时航拍演示</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              查看无人机图传视频画质、遥测飞行数据（高度、速度、电池电量），支持远程下发自动巡航任务指令。
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-700/60 flex items-center justify-between">
            <span className="text-xs text-slate-400">无人机状态: 待命（已准备）</span>
            <Link
              href="/dashboard/drone"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-indigo-600/30"
            >
              进入无人机演示 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}