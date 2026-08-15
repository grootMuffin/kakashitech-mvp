'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, AlertTriangle, Link2, Send, Loader2 } from 'lucide-react'


export default function LineBindButton() {
  const [loading, setLoading] = useState(false)

  const handleLineBind = () => {
    setLoading(true)

    const clientId = process.env.NEXT_PUBLIC_LINE_LOGIN_CLIENT_ID
    const redirectUri = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/line/callback`
    )
    // 生成随机 state 防止 CSRF 攻击
    const state = Math.random().toString(36).substring(7)
    
    // 存储 state 到 cookie / localStorage 以便回调校验 (可选)
    document.cookie = `line_oauth_state=${state}; path=/; max-age=300`

    // 构建 LINE OAuth 2.0 授权链接
    // bot_prompt=normal 会在用户授权时提示用户“同时添加官方账号为好友”（非常适合农田告警场景！）
    const lineAuthUrl = 
      `https://access.line.me/oauth2/v2.1/authorize?` +
      `response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&state=${state}` +
      `&scope=profile%20openid` +
      `&bot_prompt=normal`

    // 跳转到 LINE 授权登录页
    window.location.href = lineAuthUrl
  }

  return (
    <button
      onClick={handleLineBind}
      disabled={loading}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#06C755] hover:bg-[#05b34c] text-white font-medium text-sm rounded-lg shadow-sm transition"
    >
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.572-3.843 2.572-6.002z" />
      </svg>
      {loading ? '正在跳转 LINE 授权...' : '使用 LINE 一键绑定'}
    </button>
  )
}