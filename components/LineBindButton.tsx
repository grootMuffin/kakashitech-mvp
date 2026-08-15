'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function LineBindButton() {
  const [loading, setLoading] = useState(false)

  const handleLineBind = () => {
    setLoading(true)

    const clientId = process.env.NEXT_PUBLIC_LINE_LOGIN_CLIENT_ID
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/api/auth/line/callback`
    )
    const state = Math.random().toString(36).substring(7)

    const lineAuthUrl = 
      `https://access.line.me/oauth2/v2.1/authorize?` +
      `response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&state=${state}` +
      `&scope=profile%20openid` +
      `&bot_prompt=normal`

    window.location.href = lineAuthUrl
  }

  return (
    <button
      onClick={handleLineBind}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          正在跳转 LINE 授权...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.572-3.843 2.572-6.002z" />
          </svg>
          一键绑定 LINE 账号
        </>
      )}
    </button>
  )
}