'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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

// 传感器数据类型接口
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
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d'>('24h')

  // 模拟从 Supabase 获取传感器历史数据
  const fetchLogs = async () => {
    setLoading(true)
    try {
      // 演示模拟数据 (如果在实际生产中，可用 supabase.from('water_sensor_logs').select('*') 替换)
      const mockData: SensorLog[] = Array.from({ length: 8 }).map((_, i) => ({
        id: `log-${i}`,
        device_id: 'paddy_field_01',
        water_level_cm: Number((18.5 + Math.sin(i) * 4.2).toFixed(1)),
        water_temp_c: Number((22.0 + Math.cos(i) * 1.5).toFixed(1)),
        battery_pct: 98,
        created_at: new Date(Date.now() - i * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))

      setLogs(mockData)
    } catch (err) {
      console.error('获取传感器数据失败', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const currentLog = logs[0] || { water_level_cm: 18.5, water_temp_c: 22.4, battery_pct: 98 }
  const isAbnormal = currentLog.water_level_cm < 5 || currentLog.water_level_cm > 30

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
            <p className="text-xs text-slate-500">设备 ID: paddy_field_01 (支持 Python 脚本实时数据推送)</p>
          </div>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl shadow-sm transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> 手动刷新
        </button>
      </div>

      {/* 2. 当前状态卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">实时水位</p>
            <h3 className={`text-3xl font-extrabold mt-1 ${isAbnormal ? 'text-red-600' : 'text-blue-600'}`}>
              {currentLog.water_level_cm} <span className="text-sm font-normal text-slate-500">cm</span>
            </h3>
            <span className="inline-flex items-center gap-1 text-xs font-medium mt-1 text-slate-600">
              {isAbnormal ? (
                <span className="text-red-600 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> 触发告警阈值</span>
              ) : (
                <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> 水位正常</span>
              )}
            </span>
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
            <span className="text-xs text-slate-500 mt-1 block">适宜水稻生长</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Thermometer className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">传感器电量与通信</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {currentLog.battery_pct}%
            </h3>
            <span className="text-xs text-green-600 font-medium mt-1 block">太阳能供电正常</span>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <BatteryCharging className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. 历史趋势数据图表卡片 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> 水位历史变化趋势 (水位 cm / 时间)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">连续监控水田水分蒸发与灌溉补水曲线</p>
          </div>

          {/* 时间范围切换 */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
            {(['24h', '7d', '30d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-3 py-1 rounded-lg transition ${
                  timeFilter === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t === '24h' ? '最近 24 小时' : t === '7d' ? '近 7 天' : '近 30 天'}
              </button>
            ))}
          </div>
        </div>

        {/* 动态可视化趋势图（使用 CSS/SVG 模拟，可替换为 Recharts） */}
        <div className="h-64 w-full bg-slate-50 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden border border-slate-100">
          {/* 上下安全边界警戒线 */}
          <div className="absolute left-0 right-0 top-[20%] border-b border-dashed border-red-300 pointer-events-none flex justify-end pr-2">
            <span className="text-[10px] text-red-500 bg-white/80 px-1 rounded">上限警报线 30cm</span>
          </div>
          <div className="absolute left-0 right-0 bottom-[20%] border-b border-dashed border-amber-300 pointer-events-none flex justify-end pr-2">
            <span className="text-[10px] text-amber-600 bg-white/80 px-1 rounded">下限警报线 5cm</span>
          </div>

          {/* 柱状/折线分布示意 */}
          <div className="flex-1 flex items-end justify-between gap-2 pt-6 pb-2 px-2 z-10">
            {logs.map((item, idx) => {
              const heightPct = Math.min(100, Math.max(10, (item.water_level_cm / 35) * 100))
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition">
                    {item.water_level_cm}cm
                  </div>
                  <div 
                    className="w-full bg-blue-500/80 group-hover:bg-blue-600 rounded-t-md transition-all duration-300"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] text-slate-400 font-mono truncate w-full text-center">
                    {item.created_at}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 4. 上报历史日志明细表 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-600" /> 上报数据明细日志
          </h2>
          <span className="text-xs text-slate-500">已自动同步 Supabase `water_sensor_logs`</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="p-3.5 pl-5">时间</th>
                <th className="p-3.5">设备编号</th>
                <th className="p-3.5">水位 (cm)</th>
                <th className="p-3.5">水温 (℃)</th>
                <th className="p-3.5">剩余电量</th>
                <th className="p-3.5 pr-5">状态评估</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 pl-5">{log.created_at}</td>
                  <td className="p-3.5">{log.device_id}</td>
                  <td className="p-3.5 font-bold text-blue-600">{log.water_level_cm} cm</td>
                  <td className="p-3.5">{log.water_temp_c} ℃</td>
                  <td className="p-3.5">{log.battery_pct}%</td>
                  <td className="p-3.5 pr-5">
                    {log.water_level_cm < 5 || log.water_level_cm > 30 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700">
                        水位异常
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-700">
                        正常
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}