import { supabase } from '../lib/supabase'
import { CreateGoalParams, Goal, UpdateGoalParams } from '../types'
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

export async function getActiveGoals(): Promise<Goal[]> {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_completed', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getCompletedGoals(): Promise<Goal[]> {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_completed', true)
    .order('completed_at', { ascending: false })
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

export async function updateGoal(params: UpdateGoalParams): Promise<Goal> {
  const { id, name, targetAmount, photoUrl } = params
  const { data, error } = await supabase
    .from('goals')
    .update({
      ...(name          !== undefined && { name }),
      ...(targetAmount  !== undefined && { target_amount: targetAmount }),
      ...(photoUrl      !== undefined && { photo_url: photoUrl }),
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function setCurrentGoal(goalId: string): Promise<void> {
  const profile = await getProfile()
  const { error } = await supabase
    .from('profiles')
    .update({ current_goal_id: goalId, current_goal_amount: 0 })
    .eq('id', profile.id)
  if (error) throw error
}

export async function deleteGoal(id: string): Promise<void> {
  const profile = await getProfile()
  // If deleting current goal, clear it from profile first
  if (profile.current_goal_id === id) {
    await supabase
      .from('profiles')
      .update({ current_goal_id: null, current_goal_amount: 0 })
      .eq('id', profile.id)
  }
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)
  if (error) throw error
}