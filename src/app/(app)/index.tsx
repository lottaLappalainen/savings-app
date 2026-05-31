import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, YStack } from 'tamagui'

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1520' }}>
      <YStack
        flex={1}
        style={{ alignItems: 'center', justifyContent: 'center' }}
      >
        <Text color="$colorMuted">Home screen — coming in phase 3</Text>
      </YStack>
    </SafeAreaView>
  )
}