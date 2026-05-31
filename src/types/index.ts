import { Database } from './database'

export type Profile      = Database['public']['Tables']['profiles']['Row']
export type Goal         = Database['public']['Tables']['goals']['Row']
export type SavingsEntry = Database['public']['Tables']['savings_entries']['Row']
export type PresetItem   = Database['public']['Tables']['preset_items']['Row']
export type SavingType   = Database['public']['Tables']['saving_types']['Row']

export type GoalInsert         = Database['public']['Tables']['goals']['Insert']
export type GoalUpdate         = Database['public']['Tables']['goals']['Update']
export type SavingsEntryInsert = Database['public']['Tables']['savings_entries']['Insert']
export type SavingsEntryUpdate = Database['public']['Tables']['savings_entries']['Update']
export type PresetItemInsert   = Database['public']['Tables']['preset_items']['Insert']
export type PresetItemUpdate   = Database['public']['Tables']['preset_items']['Update']
export type SavingTypeInsert   = Database['public']['Tables']['saving_types']['Insert']

// Supabase returns the joined goal as an array even for single FK joins
// We normalize it to Goal | null in getProfile()
export type ProfileWithGoal = Profile & {
  current_goal: Goal | null
}

export type PresetWithType = PresetItem & {
  saving_type: SavingType
}

export type EntryWithType = SavingsEntry & {
  saving_type: SavingType | null
}

export type EntriesByDay = {
  date:    string
  entries: EntryWithType[]
  total:   number
}

export type CreateGoalParams = {
  name:         string
  targetAmount: number
  photoUrl?:    string | null
}

export type UpdateGoalParams = {
  id:            string
  name?:         string
  targetAmount?: number
  photoUrl?:     string | null
}

export type AddEntryParams = {
  title?:    string | null
  amount:    number
  presetId?: string | null
  typeId?:   string | null
}

export type UpdateEntryParams = {
  id:      string
  title?:  string | null
  amount?: number
  typeId?: string | null
}

export type CreatePresetParams = {
  title:  string
  amount: number
  typeId: string
}

export type UpdatePresetParams = {
  id:      string
  title?:  string
  amount?: number
  typeId?: string
}

export type CreateTypeParams = {
  name: string
}