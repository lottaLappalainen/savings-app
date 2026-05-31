import { Inter_400Regular, Inter_700Bold, useFonts } from '@expo-google-fonts/inter'
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { TamaguiProvider } from 'tamagui'
import config from '../../tamagui.config'
import { getProfile } from '../actions/auth'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const router   = useRouter()
  const segments = useSegments()
  const { setSession, setProfile, clear, theme } = useAuthStore()

  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        if (session) {
          try {
            const profile = await getProfile()
            setProfile(profile)
          } catch {
            // profile not ready yet on first signup
          }
        } else {
          clear()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!fontsLoaded) return

    const inAuthGroup = segments[0] === '(auth)'
    const { session } = useAuthStore.getState()

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/register')
    } else if (session && inAuthGroup) {
      router.replace('/(app)')
    }

    SplashScreen.hideAsync()
  }, [fontsLoaded, segments])

  if (!fontsLoaded) return null

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <Slot />
    </TamaguiProvider>
  )
}