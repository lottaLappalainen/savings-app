import { useState } from 'react'
import { Alert, Pressable, ScrollView, Text, View } from 'react-native'
import { useTheme } from 'tamagui'
import { createPreset, deletePreset, updatePreset } from '../../../../actions/presets'
import { useToast } from '../../../../hooks/useToast'
import { usePresetStore, useTypeStore } from '../../../../store'
import type { PresetWithType } from '../../../../types'
import { ScreenWrapper } from '../../../ui/ScreenWrapper'
import { Toast } from '../../../ui/Toast'
import { SectionHeader } from '../SectionHeader'
import { PresetForm } from './PresetForm'

type FormState = { title: string; amount: string; typeId: string }
const emptyForm: FormState = { title: '', amount: '', typeId: '' }
function fmt(n: number) { return Number(n).toFixed(2) }

export function PresetsSection({ onBack }: { onBack: () => void }) {
  const theme   = useTheme()
  const presets = usePresetStore(s => s.presets)
  const types   = useTypeStore(s => s.types)
  const { addPreset, updatePreset: updatePresetStore, removePreset } = usePresetStore()
  const { toast, showToast, hideToast } = useToast()

  const [adding,    setAdding]    = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form,      setForm]      = useState<FormState>(emptyForm)
  const [loading,   setLoading]   = useState(false)

  function startAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setAdding(true)
  }

  function startEdit(p: PresetWithType) {
    setAdding(false)
    setForm({ title: p.title, amount: fmt(Number(p.amount)), typeId: p.type_id })
    setEditingId(p.id)
  }

  function cancel() { setAdding(false); setEditingId(null) }

  function handleChange(key: keyof FormState, value: string) {
    setForm(p => ({ ...p, [key]: value }))
  }

  async function handleSave() {
    if (!form.title.trim()) { showToast('Title is required', 'error'); return }
    if (!form.typeId)        { showToast('Type is required', 'error'); return }
    const amount = parseFloat(form.amount.replace(',', '.'))
    if (isNaN(amount) || amount <= 0) { showToast('Enter a valid amount', 'error'); return }
    setLoading(true)
    try {
      if (adding) {
        const p = await createPreset({ title: form.title.trim(), amount, typeId: form.typeId })
        addPreset(p)
        showToast('Preset created', 'success')
      } else if (editingId) {
        const p = await updatePreset({ id: editingId, title: form.title.trim(), amount, typeId: form.typeId })
        updatePresetStore(p)
        showToast('Preset updated', 'success')
      }
      cancel()
    } catch { showToast('Something went wrong', 'error') }
    finally { setLoading(false) }
  }

  function confirmDelete(id: string) {
    Alert.alert('Delete preset', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDelete(id) },
    ])
  }

  async function handleDelete(id: string) {
    setLoading(true)
    try {
      await deletePreset(id)
      removePreset(id)
      showToast('Preset deleted', 'success')
    } catch { showToast('Something went wrong', 'error') }
    finally { setLoading(false) }
  }

  return (
    <ScreenWrapper padded={false}>
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onHide={hideToast} />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SectionHeader title="Saved options" onBack={onBack} />

        {adding && (
          <PresetForm
            form={form}
            onChange={handleChange}
            onSave={handleSave}
            onCancel={cancel}
            loading={loading}
            isEdit={false}
            types={types}
          />
        )}

        {!adding && (
          <Pressable
            onPress={startAdd}
            style={({ pressed }) => ({
              backgroundColor: theme.primary.val,
              borderRadius:    10,
              paddingVertical: 12,
              alignItems:      'center',
              marginBottom:    16,
              opacity:         pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: theme.background.val }}>
              + Add saved option
            </Text>
          </Pressable>
        )}

        {presets.length === 0 && (
          <Text style={{ color: theme.colorMuted.val, fontSize: 13, textAlign: 'center' }}>
            No saved options yet
          </Text>
        )}

        {presets.map(p => (
          <View key={p.id}>
            {editingId === p.id ? (
              <PresetForm
                form={form}
                onChange={handleChange}
                onSave={handleSave}
                onCancel={cancel}
                loading={loading}
                isEdit
                types={types}
              />
            ) : (
              <View style={{
                backgroundColor:   theme.backgroundHover.val,
                borderRadius:      10,
                borderWidth:       0.5,
                borderColor:       theme.borderColor.val,
                paddingVertical:   12,
                paddingHorizontal: 14,
                flexDirection:     'row',
                alignItems:        'center',
                marginBottom:      8,
              }}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ fontSize: 15, color: theme.color.val, fontWeight: '500' }}>
                    {p.title}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, color: theme.accent.val, fontWeight: '600' }}>
                      €{fmt(Number(p.amount))}
                    </Text>
                    {p.saving_type && (
                      <Text style={{ fontSize: 11, color: theme.colorMuted.val }}>
                        {p.saving_type.name}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Pressable onPress={() => startEdit(p)} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                    <Text style={{ fontSize: 16 }}>✏️</Text>
                  </Pressable>
                  <Pressable onPress={() => confirmDelete(p.id)} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                    <Text style={{ fontSize: 16 }}>🗑️</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  )
}