import { Inter_400Regular, Inter_700Bold, useFonts } from '@expo-google-fonts/inter'
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { TamaguiProvider } from 'tamagui'
import config from '../../tamagui.config'
import { getProfile } from '../actions/auth'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme   = useColorScheme()
  const router        = useRouter()
  const segments      = useSegments()
  const { setSession, setProfile, clear } = useAuthStore()

  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold })

  // Listen to Supabase auth state changes
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
            // profile not ready yet on first signup, ignore
          }
        } else {
          clear()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Redirect based on auth state
  useEffect(() => {
    if (!fontsLoaded) return

    const inAuthGroup = segments[0] === '(auth)'
    const { session } = useAuthStore.getState()

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/register')
    } else if (session && inAuthGroup) {
      router.replace('/(app)/index')
    }

    SplashScreen.hideAsync()
  }, [fontsLoaded, segments])

  if (!fontsLoaded) return null

  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme ?? 'dark'}>
      <Slot />
    </TamaguiProvider>
  )
}