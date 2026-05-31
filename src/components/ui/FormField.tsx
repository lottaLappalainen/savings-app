import { Text, TextInputProps, View } from 'react-native'
import { useTheme } from 'tamagui'
import { AppInput } from './AppInput'

type Props = TextInputProps & {
  label:    string
  error?:   string | null
}

export function FormField({ label, error, ...inputProps }: Props) {
  const theme = useTheme()
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 12, color: theme.colorMuted.val, fontWeight: '500' }}>
        {label}
      </Text>
      <AppInput error={!!error} {...inputProps} />
      {error && (
        <Text style={{ fontSize: 12, color: '#ef4444' }}>{error}</Text>
      )}
    </View>
  )
}