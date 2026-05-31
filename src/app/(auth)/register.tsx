// src/app/(auth)/register.tsx
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useTheme } from 'tamagui'
import { signUp } from '../../actions/auth'
import { AppButton } from '../../components/ui/AppButton'
import { AppText } from '../../components/ui/AppText'
import { Divider } from '../../components/ui/Divider'
import { FormField } from '../../components/ui/FormField'
import { ScreenWrapper } from '../../components/ui/ScreenWrapper'
import { Toast } from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'

export default function RegisterScreen() {
  const router  = useRouter()
  const theme   = useTheme()
  const { toast, showToast, hideToast } = useToast()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [errors,   setErrors]   = useState<{ email?: string; password?: string }>({})
  const [showPass, setShowPass] = useState(false)

  function validate(): boolean {
    const e: { email?: string; password?: string } = {}
    if (!email)              e.email    = 'Email is required'
    else if (!email.includes('@')) e.email = 'Enter a valid email'
    if (!password)           e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleRegister() {
    if (!validate()) return
    setLoading(true)
    try {
      await signUp(email, password)
      showToast('Account created!', 'success')
      setTimeout(() => router.replace('/(app)'), 1000)
    } catch (e: any) {
      const msg: string = e.message ?? ''
      if (msg.toLowerCase().includes('already')) {
        setErrors({ email: 'An account with this email already exists' })
      } else {
        showToast('Something went wrong, please try again', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScreenWrapper centered>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />

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
        <AppText variant="heading">Create account</AppText>
        <AppText variant="muted">Start tracking your savings</AppText>
      </View>

      {/* Fields */}
      <View style={{ gap: 12 }}>
        <FormField
          label="Email"
          placeholder="you@email.com"
          value={email}
          onChangeText={(t) => { setEmail(t); setErrors(e => ({ ...e, email: undefined })) }}
          autoCapitalize="none"
          keyboardType="email-address"
          error={errors.email}
        />
        <FormField
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={(t) => { setPassword(t); setErrors(e => ({ ...e, password: undefined })) }}
          secureTextEntry={!showPass}
          error={errors.password}
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

      <AppButton onPress={handleRegister} loading={loading}>
        Create account
      </AppButton>

      <Divider label="or" />

      <Pressable onPress={() => router.push('/(auth)/login')}>
        <AppText variant="muted" style={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <Text style={{ color: theme.primary.val, fontWeight: '500' }}>Log in</Text>
        </AppText>
      </Pressable>

    </ScreenWrapper>
  )
}