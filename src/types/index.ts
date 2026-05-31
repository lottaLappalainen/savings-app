import { Database } from './database'

// Pull table row types straight from the generated file
export type Profile      = Database['public']['Tables']['profiles']['Row']
export type Goal         = Database['public']['Tables']['goals']['Row']
export type SavingsEntry = Database['public']['Tables']['savings_entries']['Row']
export type PresetItem   = Database['public']['Tables']['preset_items']['Row']

// Insert types (for creating new rows)
export type GoalInsert         = Database['public']['Tables']['goals']['Insert']
export type SavingsEntryInsert = Database['public']['Tables']['savings_entries']['Insert']
export type PresetItemInsert   = Database['public']['Tables']['preset_items']['Insert']

// Composite type for profile with joined goal
export type ProfileWithGoal = Profile & {
  current_goal: Goal | null
}

// Function parameter types
export type CreateGoalParams = {
  name:         string
  targetAmount: number
  photoUrl?:    string | null
}

export type AddEntryParams = {
  title?:    string | null
  amount:    number
  presetId?: string | null
}

export type CreatePresetParams = {
  title:  string
  amount: number
}