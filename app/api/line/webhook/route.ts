import { webhook } from '@line/bot-sdk'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
export async function POST(req: Request) {
  try {
    const body = await req.json()
    // 使用 webhook.Event 或 webhook.FollowEvent
    const events: webhook.Event[] = body.events

    for (const event of events) {
      if (event.type === 'follow') {
        // 使用 type assertion 或直接访问 source
        const lineUserId = event.source?.userId
        console.log('新用户关注，LINE User ID:', lineUserId)
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}