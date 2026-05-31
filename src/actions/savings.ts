import { supabase } from '../lib/supabase'
import { AddEntryParams, EntriesByDay, EntryWithType, UpdateEntryParams } from '../types'
import { getProfile } from './auth'

export async function addEntry(params: AddEntryParams): Promise<void> {
  const profile = await getProfile()
  const goalId  = profile.current_goal_id ?? null

  // Insert the entry
  const { error: entryError } = await supabase
    .from('savings_entries')
    .insert({
      user_id:   profile.id,
      goal_id:   goalId,
      preset_id: params.presetId ?? null,
      type_id:   params.typeId   ?? null,
      title:     params.title    ?? null,
      amount:    params.amount,
    })
  if (entryError) throw entryError

  // Update total_saved and current_goal_amount on profile
  const newTotal       = Number(profile.total_saved)       + params.amount
  const newGoalAmount  = Number(profile.current_goal_amount) + params.amount

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      total_saved:         newTotal,
      current_goal_amount: goalId ? newGoalAmount : profile.current_goal_amount,
    })
    .eq('id', profile.id)
  if (profileError) throw profileError

  // Check if current goal is now achieved
  if (goalId) {
    const { data: goal } = await supabase
      .from('goals')
      .select('target_amount')
      .eq('id', goalId)
      .single()

    if (goal && newGoalAmount >= Number(goal.target_amount)) {
      // Mark goal complete and reset current goal
      await supabase
        .from('goals')
        .update({ is_completed: true, completed_at: new Date().toISOString() })
        .eq('id', goalId)

      await supabase
        .from('profiles')
        .update({ current_goal_id: null, current_goal_amount: 0 })
        .eq('id', profile.id)
    }
  }
}

export async function updateEntry(params: UpdateEntryParams): Promise<void> {
  const { id, title, amount, typeId } = params

  // If amount changed, we need to adjust totals
  if (amount !== undefined) {
    const profile = await getProfile()

    const { data: existing } = await supabase
      .from('savings_entries')
      .select('amount, goal_id')
      .eq('id', id)
      .single()

    if (existing) {
      const diff          = amount - Number(existing.amount)
      const newTotal      = Number(profile.total_saved) + diff
      const isCurrentGoal = existing.goal_id === profile.current_goal_id
      const newGoalAmount = isCurrentGoal
        ? Number(profile.current_goal_amount) + diff
        : Number(profile.current_goal_amount)

      await supabase
        .from('profiles')
        .update({ total_saved: newTotal, current_goal_amount: newGoalAmount })
        .eq('id', profile.id)
    }
  }

  const { error } = await supabase
    .from('savings_entries')
    .update({
      ...(title   !== undefined && { title }),
      ...(amount  !== undefined && { amount }),
      ...(typeId  !== undefined && { type_id: typeId }),
    })
    .eq('id', id)
  if (error) throw error
}

export async function deleteEntry(id: string): Promise<void> {
  const profile = await getProfile()

  const { data: existing } = await supabase
    .from('savings_entries')
    .select('amount, goal_id')
    .eq('id', id)
    .single()

  if (existing) {
    const newTotal      = Number(profile.total_saved) - Number(existing.amount)
    const isCurrentGoal = existing.goal_id === profile.current_goal_id
    const newGoalAmount = isCurrentGoal
      ? Number(profile.current_goal_amount) - Number(existing.amount)
      : Number(profile.current_goal_amount)

    await supabase
      .from('profiles')
      .update({
        total_saved:         Math.max(0, newTotal),
        current_goal_amount: Math.max(0, newGoalAmount),
      })
      .eq('id', profile.id)
  }

  const { error } = await supabase
    .from('savings_entries')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function getHistory(): Promise<EntriesByDay[]> {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('savings_entries')
    .select('*, saving_type:saving_types(*)')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
  if (error) throw error

  // Group by date
  const groups: Record<string, EntryWithType[]> = {}
  for (const entry of data as EntryWithType[]) {
    const date = new Date(entry.created_at).toLocaleDateString('fi-FI')
    if (!groups[date]) groups[date] = []
    groups[date].push(entry)
  }

  return Object.entries(groups).map(([date, entries]) => ({
    date,
    entries,
    total: entries.reduce((s, e) => s + Number(e.amount), 0),
  }))
}