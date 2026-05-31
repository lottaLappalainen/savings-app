import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useTheme } from 'tamagui'
import { signIn } from '../../actions/auth'
import { AppButton } from '../../components/ui/AppButton'
import { AppText } from '../../components/ui/AppText'
import { Divider } from '../../components/ui/Divider'
import { FormField } from '../../components/ui/FormField'
import { ScreenWrapper } from '../../components/ui/ScreenWrapper'

export default function LoginScreen() {
  const router  = useRouter()
  const theme   = useTheme()
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
      const msg: string = e.message ?? ''
      if (msg.toLowerCase().includes('invalid')) {
        setError('Invalid email or password')
      } else if (msg.toLowerCase().includes('email')) {
        setError('No account found with this email')
      } else {
        setError('Something went wrong, please try again')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScreenWrapper centered>

      {/* Logo */}
      <View style={{ alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <View style={{
          width:           56,
          height:          56,
          borderRadius:    12,
          backgroundColor: theme.backgroundHover.val,
          borderWidth:     0.5,
          borderColor:     theme.borderColor.val,
          alignItems:      'center',
          justifyContent:  'center',
        }}>
          <Text style={{ fontSize: 26 }}>🐷</Text>
        </View>
        <AppText variant="heading">Welcome back</AppText>
        <AppText variant="muted">Log in to your account</AppText>
      </View>

      {/* Fields */}
      <View style={{ gap: 12 }}>
        <FormField
          label="Email"
          placeholder="you@email.com"
          value={email}
          onChangeText={(t) => { setEmail(t); setError(null) }}
          autoCapitalize="none"
          keyboardType="email-address"
          error={error ?? undefined}
        />
        <FormField
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={(t) => { setPassword(t); setError(null) }}
          secureTextEntry={!showPass}
          error={undefined}
          rightElement={
            <Pressable
              onPress={() => setShowPass(p => !p)}
              style={{ padding: 4 }}
            >
              <Text style={{ fontSize: 16 }}>{showPass ? '🙈' : '👁'}</Text>
            </Pressable>
          }
        />
      </View>

      {/* Inline error */}
      {error && (
        <View style={{
          backgroundColor: '#2e1a1a',
          borderWidth:     1,
          borderColor:     '#ef4444',
          borderRadius:    10,
          padding:         12,
        }}>
          <Text style={{ color: '#ef4444', fontSize: 13 }}>{error}</Text>
        </View>
      )}

      <AppButton onPress={handleLogin} loading={loading}>
        Log in
      </AppButton>

      <Divider label="or" />

      <Pressable onPress={() => router.push('/(auth)/register')}>
        <AppText variant="muted" style={{ textAlign: 'center' }}>
          Don't have an account?{' '}
          <Text style={{ color: theme.primary.val, fontWeight: '500' }}>Sign up</Text>
        </AppText>
      </Pressable>

    </ScreenWrapper>
  )
}