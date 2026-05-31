import { TextInput, TextInputProps } from 'react-native'
import { useTheme } from 'tamagui'

type Props = TextInputProps & {
  error?: boolean
}

export function AppInput({ error = false, style, ...props }: Props) {
  const theme = useTheme()
  return (
    <TextInput
      {...props}
      placeholderTextColor={theme.colorMuted.val}
      style={[
        {
          backgroundColor: theme.backgroundHover.val,
          borderColor:     error ? '#ef4444' : theme.borderColor.val,
          borderWidth:     1,
          borderRadius:    10,
          paddingHorizontal: 14,
          paddingVertical:   12,
          fontSize:        15,
          color:           theme.color.val,
          width:           '100%',
        },
        style,
      ]}
    />
  )
}