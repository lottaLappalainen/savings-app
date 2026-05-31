import { ActivityIndicator, Pressable } from 'react-native'
import { Text, useTheme } from 'tamagui'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger'

type Props = {
  children: React.ReactNode
  onPress: () => void
  variant?: Variant
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

export function AppButton({
  children,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = true,
}: Props) {
  const theme = useTheme()

  const styles: Record<Variant, { bg: string; border: string; text: string }> = {
    primary: {
      bg:     theme.primary.val,
      border: theme.primary.val,
      text:   theme.background.val,
    },
    outline: {
      bg:     'transparent',
      border: theme.primary.val,
      text:   theme.primary.val,
    },
    ghost: {
      bg:     'transparent',
      border: 'transparent',
      text:   theme.primary.val,
    },
    danger: {
      bg:     'transparent',
      border: '#ef4444',
      text:   '#ef4444',
    },
  }

  const s = styles[variant]

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        backgroundColor:  s.bg,
        borderColor:      s.border,
        borderWidth:      1,
        borderRadius:     12,
        paddingVertical:  14,
        paddingHorizontal: 20,
        alignItems:       'center',
        justifyContent:   'center',
        width:            fullWidth ? '100%' : undefined,
        opacity:          pressed || disabled ? 0.7 : 1,
      })}
    >
      {loading
        ? <ActivityIndicator color={s.text} />
        : <Text style={{ color: s.text, fontWeight: '700', fontSize: 15 }}>{children}</Text>
      }
    </Pressable>
  )
}