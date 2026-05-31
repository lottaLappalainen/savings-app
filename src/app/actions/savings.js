import { supabase } from '../lib/supabase'
import { getProfile } from './auth'
import { completeGoal, setCurrentGoal } from './goals'

export async function addEntry({ title, amount, presetId }) {
  const profile = await getProfile()
  const goalId = profile.current_goal_id

  const { data, error } = await supabase
    .from('savings_entries')
    .insert({
      user_id:   profile.id,
      goal_id:   goalId,
      preset_id: presetId ?? null,
      title,
      amount
    })
    .select()
    .single()
  if (error) throw error

  // Check if goal is now complete
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

    const total = entries.reduce((s, e) => s + parseFloat(e.amount), 0)

    if (total >= parseFloat(goal.target_amount)) {
      await completeGoal(goalId)
      await setCurrentGoal(null) // Prompt user to pick next goal
    }
  }

  return data
}

export async function getTotalSaved() {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('savings_entries')
    .select('amount')
    .eq('user_id', profile.id)
  if (error) throw error
  return data.reduce((s, e) => s + parseFloat(e.amount), 0)
}

export async function getHistoryByDay() {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('savings_entries')
    .select('id, title, amount, created_at, preset_id')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}