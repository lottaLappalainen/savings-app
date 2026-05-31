import { Session } from '@supabase/supabase-js'
import { create } from 'zustand'
import { ProfileWithGoal } from '../types'

type AuthStore = {
  session:    Session | null
  profile:    ProfileWithGoal | null
  setSession: (session: Session | null) => void
  setProfile: (profile: ProfileWithGoal | null) => void
  clear:      () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  session:    null,
  profile:    null,
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  clear:      () => set({ session: null, profile: null }),
}))