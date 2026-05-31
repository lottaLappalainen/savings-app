import { useRouter } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Input, Spinner, Text, XStack, YStack } from 'tamagui'
import { signIn } from '../../src/actions/auth'

export default function LoginScreen() {
  const router   = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)

  async function handleLogin() {
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1520' }}>
      <YStack flex={1} justifyContent="center" paddingHorizontal="$6" gap="$4">

        <YStack alignItems="center" gap="$2" marginBottom="$4">
          <YStack
            width={56} height={56}
            borderRadius="$4"
            backgroundColor="$backgroundHover"
            borderWidth={0.5}
            borderColor="$borderColor"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize={26}>🐷</Text>
          </YStack>
          <Text fontSize="$7" fontWeight="500" color="$color">
            Welcome back
          </Text>
          <Text fontSize="$2" color="$colorMuted">
            Log in to your account
          </Text>
        </YStack>

        <YStack gap="$1">
          <Text fontSize="$2" color="$colorMuted">Email</Text>
          <Input
            placeholder="you@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            backgroundColor="$backgroundHover"
            borderColor="$borderColor"
            color="$color"
            placeholderTextColor="$colorMuted"
          />
        </YStack>

        <YStack gap="$1">
          <Text fontSize="$2" color="$colorMuted">Password</Text>
          <XStack alignItems="center">
            <Input
              flex={1}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              backgroundColor="$backgroundHover"
              borderColor="$borderColor"
              color="$color"
              placeholderTextColor="$colorMuted"
            />
            <Text
              position="absolute"
              right="$3"
              color="$colorMuted"
              onPress={() => setShowPass(p => !p)}
            >
              {showPass ? '🙈' : '👁'}
            </Text>
          </XStack>
        </YStack>

        {error && (
          <Text fontSize="$2" color="$danger" textAlign="center">{error}</Text>
        )}

        <Button
          backgroundColor="$primary"
          color="$background"
          fontWeight="700"
          borderRadius="$4"
          onPress={handleLogin}
          disabled={loading}
          pressStyle={{ opacity: 0.85 }}
        >
          {loading ? <Spinner color="$background" /> : 'Log in'}
        </Button>

        <XStack alignItems="center" gap="$3">
          <YStack flex={1} height={0.5} backgroundColor="$borderColor" />
          <Text fontSize="$2" color="$colorMuted">or</Text>
          <YStack flex={1} height={0.5} backgroundColor="$borderColor" />
        </XStack>

        <Text
          textAlign="center"
          fontSize="$2"
          color="$colorMuted"
          onPress={() => router.push('/(auth)/register')}
        >
          Don't have an account?{' '}
          <Text color="$primary" fontWeight="500">Sign up</Text>
        </Text>

      </YStack>
    </SafeAreaView>
  )
}