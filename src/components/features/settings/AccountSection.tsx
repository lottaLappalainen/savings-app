import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { useTheme } from 'tamagui'
import { signOut } from '../../../actions/auth'
import { useAuthStore } from '../../../store'
import { AppButton } from '../../ui/AppButton'
import { ScreenWrapper } from '../../ui/ScreenWrapper'
import { SectionHeader } from './SectionHeader'

export function AccountSection({ onBack }: { onBack: () => void }) {
  const theme   = useTheme()
  const router  = useRouter()
  const clear   = useAuthStore(s => s.clear)
  const profile = useAuthStore(s => s.profile)
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    try {
      await signOut()
      clear()
      router.replace('/(auth)/register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScreenWrapper>
      <SectionHeader title="Account" onBack={onBack} />
      <View style={{
        backgroundColor: theme.backgroundHover.val,
        borderRadius:    14,
        borderWidth:     0.5,
        borderColor:     theme.borderColor.val,
        padding:         16,
        marginBottom:    16,
        gap:             8,
      }}>
        <Text style={{ fontSize: 12, color: theme.colorMuted.val }}>Signed in as</Text>
        <Text style={{ fontSize: 15, color: theme.color.val, fontWeight: '500' }}>
          {profile?.username ?? 'User'}
        </Text>
      </View>
      <AppButton variant="danger" onPress={handleSignOut} loading={loading}>
        Sign out
      </AppButton>
    </ScreenWrapper>
  )
}