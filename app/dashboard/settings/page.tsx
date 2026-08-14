'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, AlertTriangle, Link2, Send, Loader2 } from 'lucide-react'

export default function LineBindSettingsPage() {
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [testingAlert, setTestingAlert] = useState(false)
  
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [lineUserId, setLineUserId] = useState('')
  const [savedLineUserId, setSavedLineUserId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // 1. 初始化时读取当前登录用户以及已绑定的 LINE User ID
  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUserEmail(user.email || null)
          
          // 查询 profiles 表中的 line_user_id
          const { data: profile } = await supabase
            .from('profiles')
            .select('line_user_id')
            .eq('id', user.id)
            .single()

          if (profile?.line_user_id) {
            setSavedLineUserId(profile.line_user_id)
            setLineUserId(profile.line_user_id)
          }
        }
      } catch (err) {
        console.error('Failed to load user profile:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [supabase])

  // 2. 调用 /api/user/bind-line 提交绑定请求
  const handleBindLine = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setStatusMessage(null)

    try {
      const res = await fetch('/api/user/bind-line', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineUserId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '绑定失败，请稍后重试')
      }

      setSavedLineUserId(lineUserId)
      setStatusMessage({ type: 'success', text: '🎉 LINE 账号绑定成功！' })
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  // 3. 模拟触发二次验证（发送测试警报）
  const handleTestAlert = async () => {
    setTestingAlert(true)
    try {
      // 随机选取一台设备的测试 ID 或调用测试逻辑
      const res = await fetch('/api/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // 传入模拟数据测试
          deviceId: 'a4b4d9c2-134f-4de6-b388-1ca253379e2f', // 可在此处替换为你 Supabase devices 表里的真实设备 ID
          newWaterLevel: 2.0 // 触发小于 3.0 或 5.0 的警报
        }),
      })

      const data = await res.json()
      if (data.alertTriggered) {
        alert('推送成功！请检查手机 LINE 是否收到警报消息。')
      } else {
        alert(`API 调用完成，但未触发推送（返回值: ${JSON.stringify(data)}）`)
      }
    } catch (err) {
      alert('测试失败，请查看控制台输出。')
      console.error(err)
    } finally {
      setTestingAlert(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* 标题说明 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">LINE 告警设置</h1>
        <p className="text-sm text-gray-500 mt-1">
          绑定您的 LINE 账号后，当水田水位低于设定阈值时，系统将第一时间推送 LINE 紧急提醒。
        </p>
      </div>

      {/* 绑定状态卡片 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">当前账号</span>
            <p className="text-base font-medium text-gray-800">{userEmail || '未登录测试账号'}</p>
          </div>
          <div>
            {savedLineUserId ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> 已绑定 LINE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5" /> 未绑定告警
              </span>
            )}
          </div>
        </div>

        {/* 绑定表单 */}
        <form onSubmit={handleBindLine} className="space-y-4">
          <div>
            <label htmlFor="lineUserId" className="block text-sm font-medium text-gray-700 mb-1">
              LINE User ID (以 U 开头的 33 位字符串)
            </label>
            <div className="relative">
              <input
                id="lineUserId"
                type="text"
                required
                placeholder="例如: U1389911a062bc34dddc1b2ba92d1ed5d"
                value={lineUserId}
                onChange={(e) => setLineUserId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm font-mono transition"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              可通过关注官方账号并发送测试或在 LINE Developers 后台获取。
            </p>
          </div>

          {/* 状态提示文案 */}
          {statusMessage && (
            <div
              className={`p-3 rounded-lg text-sm ${
                statusMessage.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting || !lineUserId}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg shadow-sm transition"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> 保存中...
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" /> 保存并更新绑定
                </>
              )}
            </button>

            {savedLineUserId && (
              <button
                type="button"
                onClick={handleTestAlert}
                disabled={testingAlert}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-lg transition"
              >
                {testingAlert ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                发送测试警报
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}