import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native'
import { useTheme } from 'tamagui'
import type { SavingType } from '../../../types'
import { AppSelect } from '../../ui/AppSelect'

type EditState = {
  id:     string
  amount: string
  title:  string
  typeId: string | null
}

type Props = {
  edit:     EditState
  onChange: (update: Partial<EditState>) => void
  onSave:   () => void
  onCancel: () => void
  loading:  boolean
  types:    SavingType[]
}

export function EntryEditForm({ edit, onChange, onSave, onCancel, loading, types }: Props) {
  const theme       = useTheme()
  const typeOptions = types.map(t => ({ label: t.name, value: t.id }))

  return (
    <View style={{
      backgroundColor: theme.backgroundHover.val,
      borderRadius:    12,
      borderWidth:     1,
      borderColor:     theme.primary.val,
      padding:         12,
      gap:             8,
    }}>
      {/* Amount */}
      <View style={{
        backgroundColor:   theme.background.val,
        borderRadius:      8,
        borderWidth:       0.5,
        borderColor:       theme.borderColor.val,
        paddingHorizontal: 12,
        paddingVertical:   8,
        flexDirection:     'row',
        alignItems:        'center',
        gap:               4,
      }}>
        <Text style={{ fontSize: 16, color: theme.colorMuted.val }}>€</Text>
        <TextInput
          value={edit.amount}
          onChangeText={v => onChange({ amount: v })}
          keyboardType="decimal-pad"
          style={{ flex: 1, fontSize: 16, fontWeight: '600', color: theme.color.val }}
        />
      </View>

      {/* Title */}
      <View style={{
        backgroundColor:   theme.background.val,
        borderRadius:      8,
        borderWidth:       0.5,
        borderColor:       theme.borderColor.val,
        paddingHorizontal: 12,
        paddingVertical:   8,
      }}>
        <TextInput
          value={edit.title}
          onChangeText={v => onChange({ title: v })}
          placeholder="Title (optional)"
          placeholderTextColor={theme.colorMuted.val}
          style={{ fontSize: 14, color: theme.color.val }}
        />
      </View>

      {/* Type */}
      <AppSelect
        options={typeOptions}
        value={edit.typeId}
        onChange={v => onChange({ typeId: v })}
        placeholder="Type (optional)"
      />

      {/* Actions */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable
          onPress={onCancel}
          style={{
            flex:            1,
            paddingVertical: 10,
            borderRadius:    8,
            borderWidth:     0.5,
            borderColor:     theme.borderColor.val,
            alignItems:      'center',
          }}
        >
          <Text style={{ fontSize: 13, color: theme.colorMuted.val }}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={onSave}
          disabled={loading}
          style={({ pressed }) => ({
            flex:            2,
            paddingVertical: 10,
            borderRadius:    8,
            backgroundColor: theme.primary.val,
            alignItems:      'center',
            opacity:         pressed || loading ? 0.7 : 1,
          })}
        >
          {loading
            ? <ActivityIndicator color={theme.background.val} />
            : <Text style={{ fontSize: 13, fontWeight: '700', color: theme.background.val }}>
                Save changes
              </Text>
          }
        </Pressable>
      </View>
    </View>
  )
}