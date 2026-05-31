import { Pressable, Text, View } from 'react-native'
import { useTheme } from 'tamagui'

type Props = {
  title:  string
  onBack: () => void
}

export function SectionHeader({ title, onBack }: Props) {
  const theme = useTheme()
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <Pressable
        onPress={onBack}
        style={({ pressed }) => ({
          width:           36,
          height:          36,
          borderRadius:    10,
          backgroundColor: theme.backgroundHover.val,
          borderWidth:     0.5,
          borderColor:     theme.borderColor.val,
          alignItems:      'center',
          justifyContent:  'center',
          opacity:         pressed ? 0.6 : 1,
        })}
      >
        <Text style={{ fontSize: 18, color: theme.color.val }}>←</Text>
      </Pressable>
      <Text style={{ fontSize: 22, fontWeight: '700', color: theme.color.val }}>{title}</Text>
    </View>
  )
}