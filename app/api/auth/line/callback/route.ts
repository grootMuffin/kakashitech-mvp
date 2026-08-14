import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  // 用户拒绝授权或出错
  if (error || !code) {
    return NextResponse.redirect(
      new URL('/dashboard/settings?error=line_auth_failed', req.url)
    )
  }

  try {
    const clientId = process.env.NEXT_PUBLIC_LINE_LOGIN_CLIENT_ID!
    const clientSecret = process.env.LINE_LOGIN_CLIENT_SECRET!
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/line/callback`

    // 1. 拿着 code 向 LINE 换取 Access Token
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || 'Failed to get LINE access token')
    }

    // 2. 用 Access Token 获取 LINE 用户的 Profile 信息（拿到 userId）
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const profileData = await profileResponse.json()
    const lineUserId = profileData.userId

    if (!lineUserId) {
      throw new Error('Failed to retrieve LINE User ID')
    }

    // 3. 获取当前登录的 Supabase 用户
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 如果未登录，跳转回 /login 引导登录
    if (!user) {
    return NextResponse.redirect(new URL('/login?error=please_login_first', req.url))
    }

    // 4. 将获取到的 line_user_id 保存至 Supabase 的 profiles 表
    const { error: dbError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        line_user_id: lineUserId,
        updated_at: new Date().toISOString(),
      })

    if (dbError) {
      throw dbError
    }

    // 5. 绑定成功，重定向回设置页面
    return NextResponse.redirect(
      new URL('/dashboard/settings?status=line_bound_success', req.url)
    )
  } catch (err: any) {
    console.error('LINE OAuth Error:', err)
    return NextResponse.redirect(
      new URL(`/dashboard/settings?error=${encodeURIComponent(err.message)}`, req.url)
    )
  }
}