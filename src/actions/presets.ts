import { supabase } from '../lib/supabase'
import { CreatePresetParams, PresetWithType, UpdatePresetParams } from '../types'
import { getProfile } from './auth'

export async function getPresets(): Promise<PresetWithType[]> {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('preset_items')
    .select('*, saving_type:saving_types(*)')
    .eq('user_id', profile.id)
    .order('title')
  if (error) throw error
  return data as PresetWithType[]
}

export async function createPreset(params: CreatePresetParams): Promise<PresetWithType> {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('preset_items')
    .insert({
      user_id: profile.id,
      type_id: params.typeId,
      title:   params.title,
      amount:  params.amount,
    })
    .select('*, saving_type:saving_types(*)')
    .single()
  if (error) throw error
  return data as PresetWithType
}

export async function updatePreset(params: UpdatePresetParams): Promise<PresetWithType> {
  const { id, title, amount, typeId } = params
  const { data, error } = await supabase
    .from('preset_items')
    .update({
      ...(title  !== undefined && { title }),
      ...(amount !== undefined && { amount }),
      ...(typeId !== undefined && { type_id: typeId }),
    })
    .eq('id', id)
    .select('*, saving_type:saving_types(*)')
    .single()
  if (error) throw error
  return data as PresetWithType
}

export async function deletePreset(id: string): Promise<void> {
  const { error } = await supabase
    .from('preset_items')
    .delete()
    .eq('id', id)
  if (error) throw error
}