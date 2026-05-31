// src/components/ui/FormField.tsx
import { Text, TextInputProps, View } from 'react-native'
import { useTheme } from 'tamagui'
import { AppInput } from './AppInput'

type Props = TextInputProps & {
  label:         string
  error?:        string | null
  rightElement?: React.ReactNode
}

export function FormField({ label, error, rightElement, ...inputProps }: Props) {
  const theme = useTheme()
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 12, color: theme.colorMuted.val, fontWeight: '500' }}>
        {label}
      </Text>
      <View style={{ position: 'relative' }}>
        <AppInput
          error={!!error}
          {...inputProps}
          style={rightElement ? { paddingRight: 44 } : undefined}
        />
        {rightElement && (
          <View style={{
            position:       'absolute',
            right:          12,
            top:            0,
            bottom:         0,
            justifyContent: 'center',
          }}>
            {rightElement}
          </View>
        )}
      </View>
      {error && (
        <Text style={{ fontSize: 12, color: '#ef4444' }}>{error}</Text>
      )}
    </View>
  )
}