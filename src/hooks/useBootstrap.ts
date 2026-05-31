import { useEffect, useRef } from 'react'
import { getProfile } from '../actions/auth'
import { getGoals } from '../actions/goals'
import { getPresets } from '../actions/presets'
import { getHistory } from '../actions/savings'
import { getSavingTypes } from '../actions/types'
import {
    useAuthStore,
    useGoalStore,
    useHistoryStore,
    usePresetStore,
    useTypeStore,
} from '../store'

export function useBootstrap() {
  const { session, setProfile } = useAuthStore()
  const { setGoals }   = useGoalStore()
  const { setPresets } = usePresetStore()
  const { setTypes }   = useTypeStore()
  const { setHistory } = useHistoryStore()
  const loaded = useRef(false)

  useEffect(() => {
    if (!session || loaded.current) return
    loaded.current = true

    getProfile()
      .then(setProfile)
      .catch(console.error)

    getGoals()
      .then(setGoals)
      .catch(console.error)

    getHistory()
      .then(setHistory)
      .catch(console.error)

    getPresets()
      .then(setPresets)
      .catch(console.error)

    getSavingTypes()
      .then(setTypes)
      .catch(console.error)

  }, [session])
}