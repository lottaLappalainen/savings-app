import { supabase } from '../lib/supabase'
import { CreatePresetParams, PresetItem } from '../types'
import { getProfile } from './auth'

export async function getPresets(): Promise<PresetItem[]> {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('preset_items')
    .select('*')
    .eq('user_id', profile.id)
    .order('title')
  if (error) throw error
  return data
}

export async function createPreset(params: CreatePresetParams): Promise<PresetItem> {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('preset_items')
    .insert({
      user_id: profile.id,
      title:   params.title,
      amount:  params.amount,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePreset(id: string): Promise<void> {
  const { error } = await supabase
    .from('preset_items')
    .delete()
    .eq('id', id)
  if (error) throw error
}