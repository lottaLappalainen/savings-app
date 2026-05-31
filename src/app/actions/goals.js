import { supabase } from '../lib/supabase'
import { getProfile } from './auth'

export async function getGoals() {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createGoal({ name, targetAmount, photoUrl }) {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('goals')
    .insert({ user_id: profile.id, name, target_amount: targetAmount, photo_url: photoUrl })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function setCurrentGoal(goalId) {
  const profile = await getProfile()
  const { error } = await supabase
    .from('profiles')
    .update({ current_goal_id: goalId })
    .eq('id', profile.id)
  if (error) throw error
}

export async function completeGoal(goalId) {
  const { error } = await supabase
    .from('goals')
    .update({ is_completed: true, completed_at: new Date().toISOString() })
    .eq('id', goalId)
  if (error) throw error
}

export async function getGoalProgress(goalId) {
  // Sum calculated in DB — no client-side logic needed
  const { data, error } = await supabase
    .from('savings_entries')
    .select('amount')
    .eq('goal_id', goalId)
  if (error) throw error
  const saved = data.reduce((sum, e) => sum + parseFloat(e.amount), 0)
  return saved
}