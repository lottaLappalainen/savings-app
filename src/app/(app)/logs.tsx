import { View } from 'react-native'
import { AppText } from '../../components/ui/AppText'
import { ScreenWrapper } from '../../components/ui/ScreenWrapper'

export default function LogsScreen() {
  return (
    <ScreenWrapper>
      <AppText variant="heading">Logs</AppText>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <AppText variant="muted">Your savings history will appear here</AppText>
      </View>
    </ScreenWrapper>
  )
}