import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native'
import { useTheme } from 'tamagui'
import type { PresetWithType, SavingType } from '../../../types'
import { AppSelect } from '../../ui/AppSelect'

type Mode = 'new' | 'preset'

type Props = {
  mode:          Mode
  onModeChange:  (m: Mode) => void
  amount:        string
  onAmount:      (v: string) => void
  title:         string
  onTitle:       (v: string) => void
  typeId:        string | null
  onTypeId:      (v: string) => void
  presetId:      string | null
  onPresetSelect:(id: string) => void
  onSave:        () => void
  loading:       boolean
  types:         SavingType[]
  presets:       PresetWithType[]
}

function fmt(n: number) { return Number(n).toFixed(2) }

export function LogForm({
  mode, onModeChange,
  amount, onAmount,
  title, onTitle,
  typeId, onTypeId,
  presetId, onPresetSelect,
  onSave, loading,
  types, presets,
}: Props) {
  const theme = useTheme()

  const typeOptions   = types.map(t => ({ label: t.name, value: t.id }))
  const presetOptions = presets.map(p => ({
    label: `${p.title}  €${fmt(Number(p.amount))}`,
    value: p.id,
  }))

  const canSave = amount.trim() !== '' && parseFloat(amount.replace(',', '.')) > 0
  const showFields = mode === 'new' || (mode === 'preset' && presetId !== null)

  return (
    <View style={{
      backgroundColor: theme.backgroundHover.val,
      borderRadius:    16,
      borderWidth:     0.5,
      borderColor:     theme.borderColor.val,
      padding:         16,
      gap:             12,
    }}>
      {/* Mode toggle */}
      <View style={{
        flexDirection:   'row',
        backgroundColor: theme.background.val,
        borderRadius:    10,
        borderWidth:     0.5,
        borderColor:     theme.borderColor.val,
        padding:         3,
        gap:             3,
      }}>
        {(['new', 'preset'] as Mode[]).map(m => (
          <Pressable
            key={m}
            onPress={() => onModeChange(m)}
            style={{
              flex:            1,
              paddingVertical: 8,
              borderRadius:    8,
              alignItems:      'center',
              backgroundColor: mode === m ? theme.primary.val : 'transparent',
            }}
          >
            <Text style={{
              fontSize:   13,
              fontWeight: '600',
              color:      mode === m ? theme.background.val : theme.colorMuted.val,
            }}>
              {m === 'new' ? '✦  New' : '⚡  Saved option'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Preset picker */}
      {mode === 'preset' && (
        <AppSelect
          options={presetOptions}
          value={presetId}
          onChange={onPresetSelect}
          placeholder={presets.length === 0 ? 'No saved options yet' : 'Choose saved option...'}
        />
      )}

      {/* Fields */}
      {showFields && (
        <View style={{ gap: 10 }}>
          {/* Amount */}
          <View style={{
            backgroundColor:   theme.background.val,
            borderRadius:      10,
            borderWidth:       0.5,
            borderColor:       theme.borderColor.val,
            paddingHorizontal: 14,
            paddingVertical:   10,
            flexDirection:     'row',
            alignItems:        'center',
            gap:               6,
          }}>
            <Text style={{ fontSize: 28, fontWeight: '700', color: theme.colorMuted.val }}>€</Text>
            <TextInput
              value={amount}
              onChangeText={onAmount}
              placeholder="0.00"
              placeholderTextColor={theme.colorMuted.val}
              keyboardType="decimal-pad"
              style={{ flex: 1, fontSize: 28, fontWeight: '700', color: theme.color.val }}
            />
          </View>

          {/* Type */}
          <AppSelect
            options={typeOptions}
            value={typeId}
            onChange={onTypeId}
            placeholder="Type (optional)"
          />

          {/* Title */}
          <View style={{
            backgroundColor:   theme.background.val,
            borderRadius:      10,
            borderWidth:       0.5,
            borderColor:       theme.borderColor.val,
            paddingHorizontal: 14,
            paddingVertical:   12,
          }}>
            <TextInput
              value={title}
              onChangeText={onTitle}
              placeholder="Title (optional)"
              placeholderTextColor={theme.colorMuted.val}
              style={{ fontSize: 15, color: theme.color.val }}
            />
          </View>

          {/* Save button */}
          <Pressable
            onPress={onSave}
            disabled={loading || !canSave}
            style={({ pressed }) => ({
              backgroundColor: theme.primary.val,
              borderRadius:    10,
              paddingVertical: 14,
              alignItems:      'center',
              opacity:         pressed || loading || !canSave ? 0.5 : 1,
            })}
          >
            {loading
              ? <ActivityIndicator color={theme.background.val} />
              : <Text style={{ fontSize: 15, fontWeight: '700', color: theme.background.val }}>
                  Save
                </Text>
            }
          </Pressable>
        </View>
      )}

      {/* Empty preset state */}
      {mode === 'preset' && presetId === null && presets.length > 0 && (
        <Text style={{
          fontSize:       13,
          color:          theme.colorMuted.val,
          textAlign:      'center',
          paddingVertical: 8,
        }}>
          Select a saved option above to fill the fields
        </Text>
      )}
    </View>
  )
}