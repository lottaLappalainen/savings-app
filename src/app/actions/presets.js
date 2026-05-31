import { supabase } from '../lib/supabase'
import { getProfile } from './auth'

export async function getPresets() {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('preset_items')
    .select('*')
    .eq('user_id', profile.id)
    .order('title')
  if (error) throw error
  return data
}

export async function createPreset({ title, amount }) {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('preset_items')
    .insert({ user_id: profile.id, title, amount })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePreset(id) {
  const { error } = await supabase
    .from('preset_items')
    .delete()
    .eq('id', id)
  if (error) throw error
}