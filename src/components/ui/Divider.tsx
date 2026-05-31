import { Text, View } from 'react-native'
import { useTheme } from 'tamagui'

type Props = {
  label?: string
}

export function Divider({ label }: Props) {
  const theme = useTheme()
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ flex: 1, height: 0.5, backgroundColor: theme.borderColor.val }} />
      {label && (
        <Text style={{ fontSize: 12, color: theme.colorMuted.val }}>{label}</Text>
      )}
      <View style={{ flex: 1, height: 0.5, backgroundColor: theme.borderColor.val }} />
    </View>
  )
}