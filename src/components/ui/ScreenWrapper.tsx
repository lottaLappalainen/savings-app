import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme, YStack } from 'tamagui'

type Props = {
  children: React.ReactNode
  centered?: boolean
  padded?: boolean
}

export function ScreenWrapper({ children, centered = false, padded = true }: Props) {
  const theme = useTheme()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>
      <YStack
        flex={1}
        gap="$4"
        style={{
          paddingHorizontal: padded ? 24 : 0,
          justifyContent: centered ? 'center' : 'flex-start',
          paddingTop: padded ? 16 : 0,
        }}
      >
        {children}
      </YStack>
    </SafeAreaView>
  )
}