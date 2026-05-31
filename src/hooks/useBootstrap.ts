import { useEffect } from 'react'
import { getProfile } from '../actions/auth'
import { getGoals } from '../actions/goals'
import { getPresets } from '../actions/presets'
import { getHistory } from '../actions/savings'
import { getSavingTypes } from '../actions/types'
import { useAuthStore, useGoalStore, useHistoryStore, usePresetStore, useTypeStore } from '../store'

export function useBootstrap() {
  const { session, setProfile } = useAuthStore()
  const { setGoals }   = useGoalStore()
  const { setPresets } = usePresetStore()
  const { setTypes }   = useTypeStore()
  const { setHistory } = useHistoryStore()

  useEffect(() => {
    if (!session) return

    async function load() {
      try {
        const [profile, goals, presets, types, history] = await Promise.all([
          getProfile(),
          getGoals(),
          getPresets(),
          getSavingTypes(),
          getHistory(),
        ])
        setProfile(profile)
        setGoals(goals)
        setPresets(presets)
        setTypes(types)
        setHistory(history)
      } catch (e) {
        console.error('Bootstrap failed', e)
      }
    }

    load()
  }, [session])
}