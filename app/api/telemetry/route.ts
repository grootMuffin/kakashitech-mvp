// app/api/telemetry/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { device_id, water_level_cm, water_temp_c, battery_pct, api_key } = body

    // 简单校验密钥（防止非法上报）
    if (api_key !== process.env.HARDWARE_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // 1. 写入历史日志表
    const { error } = await supabase.from('water_sensor_logs').insert([
      {
        device_id,
        water_level_cm,
        water_temp_c,
        battery_pct,
      },
    ])

    if (error) throw error

    // 2. 💡 阈值检测与告警逻辑（例如水位过低触发 LINE 推送）
    if (water_level_cm < 5.0) {
      console.warn(`[告警] 设备 ${device_id} 水位低于 5cm！当前值: ${water_level_cm}cm`)
      // TODO: 在这里调用之前写好的 LINE 消息推送逻辑
    }

    return NextResponse.json({ success: true, timestamp: new Date() })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}