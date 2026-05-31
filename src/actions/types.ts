import { supabase } from '../lib/supabase'
import { CreateTypeParams, SavingType } from '../types'
import { getProfile } from './auth'

export async function getSavingTypes(): Promise<SavingType[]> {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('saving_types')
    .select('*')
    .eq('user_id', profile.id)
    .order('name')
  if (error) throw error
  return data
}

export async function createSavingType(params: CreateTypeParams): Promise<SavingType> {
  const profile = await getProfile()
  const { data, error } = await supabase
    .from('saving_types')
    .insert({ user_id: profile.id, name: params.name })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateSavingType(id: string, name: string): Promise<SavingType> {
  const { data, error } = await supabase
    .from('saving_types')
    .update({ name })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteSavingType(id: string): Promise<void> {
  // Will fail if presets are using this type (on delete restrict)
  // Handle this error in the UI
  const { error } = await supabase
    .from('saving_types')
    .delete()
    .eq('id', id)
  if (error) throw error
}