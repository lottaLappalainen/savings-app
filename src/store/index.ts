import { Session } from '@supabase/supabase-js'
import { create } from 'zustand'
import { EntriesByDay, Goal, PresetWithType, ProfileWithGoal, SavingType } from '../types'

// ── Auth ──────────────────────────────────
type AuthStore = {
  session:    Session | null
  profile:    ProfileWithGoal | null
  theme:      'dark' | 'light'
  setSession: (s: Session | null) => void
  setProfile: (p: ProfileWithGoal | null) => void
  setTheme:   (t: 'dark' | 'light') => void
  clear:      () => void
}
export const useAuthStore = create<AuthStore>((set) => ({
  session:    null,
  profile:    null,
  theme:      'dark',
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({
    profile,
    theme: (profile?.theme as 'dark' | 'light') ?? 'dark',
  }),
  setTheme:   (theme)   => set({ theme }),
  clear:      () => set({ session: null, profile: null, theme: 'dark' }),
}))

// ── Goals ─────────────────────────────────
type GoalStore = {
  goals:      Goal[]
  setGoals:   (g: Goal[]) => void
  addGoal:    (g: Goal) => void
  updateGoal: (g: Goal) => void
  removeGoal: (id: string) => void
}
export const useGoalStore = create<GoalStore>((set) => ({
  goals:      [],
  setGoals:   (goals)  => set({ goals }),
  addGoal:    (goal)   => set(s => ({ goals: [goal, ...s.goals] })),
  updateGoal: (goal)   => set(s => ({ goals: s.goals.map(g => g.id === goal.id ? goal : g) })),
  removeGoal: (id)     => set(s => ({ goals: s.goals.filter(g => g.id !== id) })),
}))

// ── Presets ───────────────────────────────
type PresetStore = {
  presets:      PresetWithType[]
  setPresets:   (p: PresetWithType[]) => void
  addPreset:    (p: PresetWithType) => void
  updatePreset: (p: PresetWithType) => void
  removePreset: (id: string) => void
}
export const usePresetStore = create<PresetStore>((set) => ({
  presets:      [],
  setPresets:   (presets) => set({ presets }),
  addPreset:    (preset)  => set(s => ({ presets: [...s.presets, preset] })),
  updatePreset: (preset)  => set(s => ({ presets: s.presets.map(p => p.id === preset.id ? preset : p) })),
  removePreset: (id)      => set(s => ({ presets: s.presets.filter(p => p.id !== id) })),
}))

// ── Saving types ──────────────────────────
type TypeStore = {
  types:      SavingType[]
  setTypes:   (t: SavingType[]) => void
  addType:    (t: SavingType) => void
  updateType: (t: SavingType) => void
  removeType: (id: string) => void
}
export const useTypeStore = create<TypeStore>((set) => ({
  types:      [],
  setTypes:   (types) => set({ types }),
  addType:    (type)  => set(s => ({ types: [...s.types, type] })),
  updateType: (type)  => set(s => ({ types: s.types.map(t => t.id === type.id ? type : t) })),
  removeType: (id)    => set(s => ({ types: s.types.filter(t => t.id !== id) })),
}))

// ── History ───────────────────────────────
type HistoryStore = {
  history:    EntriesByDay[]
  setHistory: (h: EntriesByDay[]) => void
}
export const useHistoryStore = create<HistoryStore>((set) => ({
  history:    [],
  setHistory: (history) => set({ history }),
}))