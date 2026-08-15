'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client' // 👈 引入你的 Supabase 客户端创建函数
import { 
  ArrowLeft, 
  Waves, 
  Thermometer, 
  BatteryCharging, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Database
} from 'lucide-react'

interface SensorLog {
  id: string
  device_id: string
  water_level_cm: number
  water_temp_c: number
  battery_pct: number
  created_at: string
}

export default function WaterLevelDashboardPage() {
  const [logs, setLogs] = useState<SensorLog[]>([])
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(true) // 是否开启实时轮询
  const supabase = createClient()

  // 核心：从 Supabase 实时获取最近数据
  const fetchLogsFromSupabase = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('water_sensor_logs')
        .select('*')
        .eq('device_id', 'paddy_field_01')
        .order('created_at', { ascending: false })
        .limit(15)

      if (error) {
        console.error('Supabase 查询失败:', error)
        return
      }

      if (data) {
        setLogs(data)
      }
    } catch (err) {
      console.error('请求异常:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // 初始化拉取 + 开启 5 秒定时轮询
  useEffect(() => {
    fetchLogsFromSupabase()

    let intervalId: NodeJS.Timeout
    if (isLive) {
      intervalId = setInterval(() => {
        fetchLogsFromSupabase()
      }, 5000) // 每 5 秒轮询刷新一次
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [fetchLogsFromSupabase, isLive])

  // 当前最新的 1 条记录（作为卡片指标）
  const currentLog = logs[0] || { 
    water_level_cm: 0, 
    water_temp_c: 0, 
    battery_pct: 0, 
    created_at: '暂无数据' 
  }
  const isAbnormal = currentLog.water_level_cm < 5 || currentLog.water_level_cm > 30

  // 图表展示需要按照时间从左到右正序排列
  const chartLogs = [...logs].reverse()

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 space-y-6">
      {/* 1. 顶栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Waves className="w-5 h-5 text-blue-600" /> 水田水量与传感器实时监控
            </h1>
            <p className="text-xs text-slate-500">设备 ID: paddy_field_01 (Supabase 实时查询中)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 实时/静止 状态开关 */}
          <button
            onClick={() => setIsLive(!isLive)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              isLive 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-ping' : 'bg-slate-400'}`} />
            {isLive ? '实时刷新中 (5s)' : '已暂停自动更新'}
          </button>

          <button
            onClick={fetchLogsFromSupabase}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl shadow-sm transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> 刷新
          </button>
        </div>
      </div>

      {/* 2. 当前状态实时卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">实时水位</p>
            <h3 className={`text-3xl font-extrabold mt-1 transition-all ${isAbnormal ? 'text-red-600' : 'text-blue-600'}`}>
              {currentLog.water_level_cm} <span className="text-sm font-normal text-slate-500">cm</span>
            </h3>
            <div className="mt-1">
              {logs.length === 0 ? (
                <span className="text-xs text-slate-400">等待硬件数据上报...</span>
              ) : isAbnormal ? (
                <span className="text-xs text-red-600 font-medium flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> 触发水位告警</span>
              ) : (
                <span className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> 水位正常</span>
              )}
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Waves className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">水温</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {currentLog.water_temp_c} <span className="text-sm font-normal text-slate-500">℃</span>
            </h3>
            <span className="text-xs text-slate-500 mt-1 block">环境传感器在线</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Thermometer className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">传感器剩余电量</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {currentLog.battery_pct}%
            </h3>
            <span className="text-xs text-green-600 font-medium mt-1 block">电池供电良好</span>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <BatteryCharging className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. 动态历史趋势柱状图 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> 水位历史变化趋势 (由数据库真实生成)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">展示数据库中最新的 {chartLogs.length} 条真实上报轨迹</p>
          </div>
        </div>

        <div className="h-64 w-full bg-slate-50 rounded-xl p-4 flex flex-col justify-between relative border border-slate-100">
          <div className="absolute left-0 right-0 top-[20%] border-b border-dashed border-red-300 pointer-events-none flex justify-end pr-2">
            <span className="text-[10px] text-red-500 bg-white/80 px-1 rounded">警戒上限 30cm</span>
          </div>

          <div className="flex-1 flex items-end justify-between gap-2 pt-6 pb-2 px-2 z-10">
            {chartLogs.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                暂无数据库记录，请运行 Python 模拟器上报数据...
              </div>
            ) : (
              chartLogs.map((item) => {
                const heightPct = Math.min(100, Math.max(5, (item.water_level_cm / 35) * 100))
                const timeStr = new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                return (
                  <div key={item.id} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="text-[10px] font-mono text-slate-600 opacity-0 group-hover:opacity-100 transition">
                      {item.water_level_cm}cm
                    </div>
                    <div 
                      className="w-full bg-blue-500/80 group-hover:bg-blue-600 rounded-t-md transition-all duration-500"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[9px] text-slate-400 font-mono truncate w-full text-center">
                      {timeStr}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* 4. 数据库读取结果明细表 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-600" /> Supabase `water_sensor_logs` 表实时明细
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="p-3.5 pl-5">记录时间</th>
                <th className="p-3.5">设备 ID</th>
                <th className="p-3.5">水位 (cm)</th>
                <th className="p-3.5">水温 (℃)</th>
                <th className="p-3.5">电量</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 pl-5">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="p-3.5">{log.device_id}</td>
                  <td className="p-3.5 font-bold text-blue-600">{log.water_level_cm} cm</td>
                  <td className="p-3.5">{log.water_temp_c} ℃</td>
                  <td className="p-3.5">{log.battery_pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}