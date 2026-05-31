import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Switch, Text, View } from 'react-native'
import { useTheme } from 'tamagui'
import { signOut, updateTheme } from '../../../actions/auth'
import { useToast } from '../../../hooks/useToast'
import { useAuthStore } from '../../../store'
import { AppButton } from '../../ui/AppButton'
import { ScreenWrapper } from '../../ui/ScreenWrapper'
import { Toast } from '../../ui/Toast'
import { SectionHeader } from './SectionHeader'

export function AccountSection({ onBack }: { onBack: () => void }) {
  const theme   = useTheme()
  const router  = useRouter()
  const { clear, profile, theme: currentTheme, setTheme, setProfile } = useAuthStore()
  const { toast, showToast, hideToast } = useToast()
  const [loading,       setLoading]       = useState(false)
  const [themeLoading,  setThemeLoading]  = useState(false)

  const isDark = currentTheme === 'dark'

  async function handleThemeToggle(value: boolean) {
    const newTheme = value ? 'dark' : 'light'
    setTheme(newTheme)
    setThemeLoading(true)
    try {
      await updateTheme(newTheme)
      showToast(`Switched to ${newTheme} mode`, 'success')
    } catch {
      // revert on failure
      setTheme(isDark ? 'dark' : 'light')
      showToast('Could not save theme preference', 'error')
    } finally {
      setThemeLoading(false)
    }
  }

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
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />

      <SectionHeader title="Account" onBack={onBack} />

      {/* Profile info */}
      <View style={{
        backgroundColor: theme.backgroundHover.val,
        borderRadius:    14,
        borderWidth:     0.5,
        borderColor:     theme.borderColor.val,
        padding:         16,
        marginBottom:    12,
        gap:             4,
      }}>
        <Text style={{ fontSize: 12, color: theme.colorMuted.val }}>Signed in as</Text>
        <Text style={{ fontSize: 15, color: theme.color.val, fontWeight: '500' }}>
          {profile?.username ?? 'User'}
        </Text>
      </View>

      {/* Theme toggle */}
      <View style={{
        backgroundColor: theme.backgroundHover.val,
        borderRadius:    14,
        borderWidth:     0.5,
        borderColor:     theme.borderColor.val,
        padding:         16,
        marginBottom:    12,
        flexDirection:   'row',
        alignItems:      'center',
        justifyContent:  'space-between',
      }}>
        <View style={{ gap: 2 }}>
          <Text style={{ fontSize: 15, fontWeight: '500', color: theme.color.val }}>
            {isDark ? '🌙 Dark mode' : '☀️ Light mode'}
          </Text>
          <Text style={{ fontSize: 12, color: theme.colorMuted.val }}>
            {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {themeLoading && (
            <ActivityIndicator size="small" color={theme.primary.val} />
          )}
          <Switch
            value={isDark}
            onValueChange={handleThemeToggle}
            trackColor={{
              false: theme.borderColor.val,
              true:  theme.primary.val,
            }}
            thumbColor={isDark ? theme.soft.val : '#ffffff'}
            disabled={themeLoading}
          />
        </View>
      </View>

      <AppButton variant="danger" onPress={handleSignOut} loading={loading}>
        Sign out
      </AppButton>
    </ScreenWrapper>
  )
}