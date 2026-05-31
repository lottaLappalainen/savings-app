import { Inter_400Regular, Inter_700Bold, useFonts } from '@expo-google-fonts/inter'
import { Slot, SplashScreen } from 'expo-router'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { TamaguiProvider } from 'tamagui'
import config from '../tamagui.config'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()

  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  })

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync()
  }, [loaded, error])

  if (!loaded && !error) return null

  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme ?? 'dark'}>
      <Slot />
    </TamaguiProvider>
  )
}