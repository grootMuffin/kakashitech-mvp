import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { lineUserId } = await req.json()

    // 更新当前登录用户的 line_user_id
    const { error } = await supabase
      .from('profiles')
      .update({ line_user_id: lineUserId })
      .eq('id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true, message: 'LINE ID 绑定成功！' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}