import { useEffect, useState } from 'react'
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

type BootstrapState = {
  profileReady: boolean
  goalsReady:   boolean
  historyReady: boolean
  presetsReady: boolean
  typesReady:   boolean
}

export function useBootstrap() {
  const { session, setProfile } = useAuthStore()
  const { setGoals }   = useGoalStore()
  const { setPresets } = usePresetStore()
  const { setTypes }   = useTypeStore()
  const { setHistory } = useHistoryStore()

  const [ready, setReady] = useState<BootstrapState>({
    profileReady: false,
    goalsReady:   false,
    historyReady: false,
    presetsReady: false,
    typesReady:   false,
  })

  useEffect(() => {
    if (!session) return

    // Load each independently so UI can render progressively
    getProfile()
      .then(p => { setProfile(p); setReady(r => ({ ...r, profileReady: true })) })
      .catch(console.error)

    getGoals()
      .then(g => { setGoals(g); setReady(r => ({ ...r, goalsReady: true })) })
      .catch(console.error)

    getHistory()
      .then(h => { setHistory(h); setReady(r => ({ ...r, historyReady: true })) })
      .catch(console.error)

    getPresets()
      .then(p => { setPresets(p); setReady(r => ({ ...r, presetsReady: true })) })
      .catch(console.error)

    getSavingTypes()
      .then(t => { setTypes(t); setReady(r => ({ ...r, typesReady: true })) })
      .catch(console.error)

  }, [session])

  return ready
}