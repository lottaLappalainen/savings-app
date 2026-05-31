import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native'
import { useTheme } from 'tamagui'

type Props = {
  value:    string
  onChange: (v: string) => void
  onSave:   () => void
  onCancel: () => void
  loading:  boolean
  isEdit:   boolean
}

export function TypeForm({ value, onChange, onSave, onCancel, loading, isEdit }: Props) {
  const theme = useTheme()
  return (
    <View style={{
      backgroundColor: theme.backgroundHover.val,
      borderRadius:    10,
      borderWidth:     1,
      borderColor:     theme.primary.val,
      padding:         12,
      gap:             8,
      marginBottom:    8,
    }}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: theme.primary.val }}>
        {isEdit ? 'Edit type' : 'New type'}
      </Text>
      <View style={{
        backgroundColor:   theme.background.val,
        borderRadius:      8,
        borderWidth:       0.5,
        borderColor:       theme.borderColor.val,
        paddingHorizontal: 12,
        paddingVertical:   10,
      }}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Type name"
          placeholderTextColor={theme.colorMuted.val}
          style={{ fontSize: 14, color: theme.color.val }}
          autoFocus
        />
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable
          onPress={onCancel}
          style={{
            flex: 1, paddingVertical: 9, borderRadius: 8,
            borderWidth: 0.5, borderColor: theme.borderColor.val, alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 13, color: theme.colorMuted.val }}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={onSave}
          disabled={loading}
          style={({ pressed }) => ({
            flex: 2, paddingVertical: 9, borderRadius: 8,
            backgroundColor: theme.primary.val, alignItems: 'center',
            opacity: pressed || loading ? 0.7 : 1,
          })}
        >
          {loading
            ? <ActivityIndicator color={theme.background.val} />
            : <Text style={{ fontSize: 13, fontWeight: '700', color: theme.background.val }}>Save</Text>
          }
        </Pressable>
      </View>
    </View>
  )
}