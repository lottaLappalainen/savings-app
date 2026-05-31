import { supabase } from '../lib/supabase'
import { AddEntryParams, SavingsEntry } from '../types'
import { getProfile } from './auth'
import { completeGoal, setCurrentGoal } from './goals'

export async function addEntry(params: AddEntryParams): Promise<SavingsEntry> {
  const profile = await getProfile()
  const goalId = profile.current_goal_id ?? null

  const { data, error } = await supabase
    .from('savings_entries')
    .insert({
      user_id:   profile.id,
      goal_id:   goalId,
      preset_id: params.presetId ?? null,
      title:     params.title ?? null,
      amount:    params.amount,
    })
    .select()
    .single()
  if (error) throw error

  if (goalId) {
    const { data: goal } = await supabase
      .from('goals')
      .select('target_amount')
      .eq('id', goalId)
      .single()

    const { data: entries } = await supabase
      .from('savings_entries')
      .select('amount')
      .eq('goal_id', goalId)

    if (goal && entries) {
      const total = entries.reduce((s, e) => s + Number(e.amount), 0)
      if (total >= Number(goal.target_amount)) {
        await completeGoal(goalId)
        await setCurrentGoal(null)
      }
    }
  }

  return data
}

export async function getTotalSaved(): Promise<number> {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('savings_entries')
    .select('amount')
    .eq('user_id', profile.id)
  if (error) throw error
  return data.reduce((s, e) => s + Number(e.amount), 0)
}

export async function getHistoryByDay(): Promise<SavingsEntry[]> {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('savings_entries')
    .select('*')                  
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}