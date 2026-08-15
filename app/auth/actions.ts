'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
// 定义统一的返回类型
export type AuthActionResult = {
  error?: string
  success?: string
}
// 1. 登录 Action
export async function login(formData: FormData): Promise<AuthActionResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard/settings')
}

// 2. 注册 Action
export async function signup(formData: FormData): Promise<AuthActionResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: email.split('@')[0],
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.session) {
    revalidatePath('/', 'layout')
    redirect('/dashboard/settings')
  }

  return { success: '注册成功！请检查你的邮箱完成账号激活。' }
}

// 3. 退出登录 Action

export async function signout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
export async function unbindLine(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('未登录用户无法执行此操作')
  }

  // 将当前用户的 line_user_id 清空为 null
  const { error } = await supabase
    .from('profiles')
    .update({ 
      line_user_id: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  if (error) {
    console.error('解除绑定失败:', error)
    throw new Error('解绑失败，请重试')
  }

  // 刷新当前设置页面，使 UI 立即更新为“未绑定”状态
  revalidatePath('/dashboard/settings')
}