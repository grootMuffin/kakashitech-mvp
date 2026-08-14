import { messagingApi } from '@line/bot-sdk'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 1. 初始化 Supabase Admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 2. 初始化 LINE MessagingApiClient (V8/V9 SDK 规范)
const { MessagingApiClient } = messagingApi
const lineClient = new MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
})

export async function POST(req: Request) {
  try {
    const { deviceId, newWaterLevel } = await req.json()

    // 查询设备及关联的用户 LINE User ID
    const { data: device, error } = await supabaseAdmin
      .from('devices')
      .select('*, profiles(line_user_id)')
      .eq('id', deviceId)
      .single()

    if (error || !device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 })
    }

    // 更新水位
    await supabaseAdmin
      .from('devices')
      .update({ current_water_level: newWaterLevel })
      .eq('id', deviceId)

    const lineUserId = device.profiles?.line_user_id

    // 触发警报逻辑
    if (newWaterLevel < device.warning_threshold) {
      if (lineUserId) {
        // 调用最新版 SDK 发送推送消息
        await lineClient.pushMessage({
          to: lineUserId,
          messages: [
            {
              type: 'text',
              text: `🚨【Kakashi Tech 警報】\n\n${device.device_name} の水位が危険水域に達しました！\n\n現在の水位: ${newWaterLevel} cm\n設定閾値: ${device.warning_threshold} cm\n\n至急、水田の状況を確認してください。`,
            },
          ],
        })
      }
    }

    return NextResponse.json({
      success: true,
      currentWaterLevel: newWaterLevel,
      alertTriggered: newWaterLevel < device.warning_threshold && !!lineUserId,
    })
  } catch (err: any) {
    console.error('Alert processing error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}