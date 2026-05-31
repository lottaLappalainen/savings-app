import { supabase } from '../lib/supabase'
import { ProfileWithGoal } from '../types'

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function resendConfirmation(email: string): Promise<void> {
  const { error } = await supabase.auth.resend({ type: 'signup', email })
  if (error) throw error
}

export async function updateTheme(theme: 'dark' | 'light'): Promise<void> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw userError ?? new Error('No user session')

  const { error } = await supabase
    .from('profiles')
    .update({ theme })
    .eq('auth_user_id', user.id)
  if (error) throw error
}

export async function getProfile(): Promise<ProfileWithGoal> {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw userError ?? new Error('No user session')

  const { data, error } = await supabase
    .from('profiles')
    .select('*, current_goal:goals!profiles_current_goal_id_fkey(*)')
    .eq('auth_user_id', user.id)
    .single()

  if (error) throw error

  const raw = data as any
  return {
    ...raw,
    current_goal: Array.isArray(raw.current_goal)
      ? (raw.current_goal[0] ?? null)
      : (raw.current_goal ?? null),
  } as ProfileWithGoal
}