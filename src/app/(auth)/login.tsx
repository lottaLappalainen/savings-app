import { useRouter } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Input, Spinner, Text, useTheme, XStack, YStack } from 'tamagui'
import { signIn } from '../../actions/auth'

export default function LoginScreen() {
  const router   = useRouter()
  const theme    = useTheme()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)

  async function handleLogin() {
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true)
    setError(null)
    try {
      await signIn(email, password)
      router.replace('/(app)')
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.val }}>
      <YStack flex={1} gap="$4" style={{ justifyContent: 'center', paddingHorizontal: 24 }}>

        <YStack gap="$2" style={{ alignItems: 'center', marginBottom: 16 }}>
          <YStack style={{
            width: 56, height: 56,
            borderRadius: 12,
            backgroundColor: theme.backgroundHover.val,
            borderWidth: 0.5,
            borderColor: theme.borderColor.val,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 26 }}>🐷</Text>
          </YStack>
          <Text style={{ fontSize: 22, fontWeight: '500', color: theme.color.val }}>
            Welcome back
          </Text>
          <Text style={{ fontSize: 13, color: theme.colorMuted.val }}>
            Log in to your account
          </Text>
        </YStack>

        <YStack gap="$1">
          <Text style={{ fontSize: 12, color: theme.colorMuted.val }}>Email</Text>
          <Input
            placeholder="you@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{
              backgroundColor: theme.backgroundHover.val,
              borderColor: theme.borderColor.val,
              color: theme.color.val,
            }}
            placeholderTextColor="$colorMuted"
          />
        </YStack>

        <YStack gap="$1">
          <Text style={{ fontSize: 12, color: theme.colorMuted.val }}>Password</Text>
          <XStack style={{ alignItems: 'center' }}>
            <Input
              flex={1}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              style={{
                backgroundColor: theme.backgroundHover.val,
                borderColor: theme.borderColor.val,
                color: theme.color.val,
              }}
              placeholderTextColor="$colorMuted"
            />
            <Text
              style={{ position: 'absolute', right: 12, color: theme.colorMuted.val }}
              onPress={() => setShowPass(p => !p)}
            >
              {showPass ? '🙈' : '👁'}
            </Text>
          </XStack>
        </YStack>

        {error && (
          <Text style={{ fontSize: 12, color: '#ef4444', textAlign: 'center' }}>
            {error}
          </Text>
        )}

        <Button
          onPress={handleLogin}
          disabled={loading}
          style={{
            backgroundColor: theme.primary.val,
            borderRadius: 12,
            opacity: loading ? 0.7 : 1,
          }}
        >
          <Text style={{ color: theme.background.val, fontWeight: '700', fontSize: 15 }}>
            {loading ? <Spinner /> : 'Log in'}
          </Text>
        </Button>

        <XStack style={{ alignItems: 'center', gap: 12 }}>
          <YStack style={{ flex: 1, height: 0.5, backgroundColor: theme.borderColor.val }} />
          <Text style={{ fontSize: 12, color: theme.colorMuted.val }}>or</Text>
          <YStack style={{ flex: 1, height: 0.5, backgroundColor: theme.borderColor.val }} />
        </XStack>

        <Text
          style={{ textAlign: 'center', fontSize: 13, color: theme.colorMuted.val }}
          onPress={() => router.push('/(auth)/register')}
        >
          Don't have an account?{' '}
          <Text style={{ color: theme.primary.val, fontWeight: '500' }}>Sign up</Text>
        </Text>

      </YStack>
    </SafeAreaView>
  )
}