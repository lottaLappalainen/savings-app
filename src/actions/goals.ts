import { supabase } from '../lib/supabase'
import { CreateGoalParams, Goal } from '../types'
import { getProfile } from './auth'

export async function getGoals(): Promise<Goal[]> {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createGoal(params: CreateGoalParams): Promise<Goal> {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id:       profile.id,
      name:          params.name,
      target_amount: params.targetAmount,
      photo_url:     params.photoUrl ?? null,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function setCurrentGoal(goalId: string | null): Promise<void> {
  const profile = await getProfile()
  const { error } = await supabase
    .from('profiles')
    .update({ current_goal_id: goalId })
    .eq('id', profile.id)
  if (error) throw error
}

export async function completeGoal(goalId: string): Promise<void> {
  const { error } = await supabase
    .from('goals')
    .update({ is_completed: true, completed_at: new Date().toISOString() })
    .eq('id', goalId)
  if (error) throw error
}

export async function getGoalProgress(goalId: string): Promise<number> {
  const { data, error } = await supabase
    .from('savings_entries')
    .select('amount')
    .eq('goal_id', goalId)
  if (error) throw error
  return data.reduce((sum, e) => sum + Number(e.amount), 0)
}