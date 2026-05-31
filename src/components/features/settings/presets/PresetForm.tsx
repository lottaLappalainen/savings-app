import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native'
import { useTheme } from 'tamagui'
import type { SavingType } from '../../../../types'
import { AppSelect } from '../../../ui/AppSelect'

type FormState = { title: string; amount: string; typeId: string }

type Props = {
  form:     FormState
  onChange: (key: keyof FormState, value: string) => void
  onSave:   () => void
  onCancel: () => void
  loading:  boolean
  isEdit:   boolean
  types:    SavingType[]
}

export function PresetForm({ form, onChange, onSave, onCancel, loading, isEdit, types }: Props) {
  const theme       = useTheme()
  const typeOptions = types.map(t => ({ label: t.name, value: t.id }))

  return (
    <View style={{
      backgroundColor: theme.backgroundHover.val,
      borderRadius:    12,
      borderWidth:     1,
      borderColor:     theme.primary.val,
      padding:         14,
      gap:             10,
      marginBottom:    10,
    }}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: theme.primary.val }}>
        {isEdit ? 'Edit saved option' : 'New saved option'}
      </Text>

      {([
        { key: 'title',  label: 'Title',       keyboard: 'default'      },
        { key: 'amount', label: 'Amount (€)',   keyboard: 'decimal-pad'  },
      ] as { key: keyof FormState; label: string; keyboard: any }[]).map(f => (
        <View key={f.key} style={{ gap: 4 }}>
          <Text style={{ fontSize: 11, color: theme.colorMuted.val }}>{f.label}</Text>
          <View style={{
            backgroundColor:   theme.background.val,
            borderRadius:      8,
            borderWidth:       0.5,
            borderColor:       theme.borderColor.val,
            paddingHorizontal: 12,
            paddingVertical:   10,
          }}>
            <TextInput
              value={form[f.key]}
              onChangeText={v => onChange(f.key, v)}
              keyboardType={f.keyboard}
              placeholder={f.label}
              placeholderTextColor={theme.colorMuted.val}
              style={{ fontSize: 14, color: theme.color.val }}
            />
          </View>
        </View>
      ))}

      <View style={{ gap: 4 }}>
        <Text style={{ fontSize: 11, color: theme.colorMuted.val }}>Type (required)</Text>
        <AppSelect
          options={typeOptions}
          value={form.typeId || null}
          onChange={v => onChange('typeId', v)}
          placeholder="Select type..."
        />
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable
          onPress={onCancel}
          style={{
            flex: 1, paddingVertical: 10, borderRadius: 8,
            borderWidth: 0.5, borderColor: theme.borderColor.val, alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 13, color: theme.colorMuted.val }}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={onSave}
          disabled={loading}
          style={({ pressed }) => ({
            flex: 2, paddingVertical: 10, borderRadius: 8,
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