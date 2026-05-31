import { useState } from 'react'
import { Alert, Pressable, ScrollView, Text, View } from 'react-native'
import { useTheme } from 'tamagui'
import { createSavingType, deleteSavingType, updateSavingType } from '../../../../actions/types'
import { useToast } from '../../../../hooks/useToast'
import { useTypeStore } from '../../../../store'
import type { SavingType } from '../../../../types'
import { ScreenWrapper } from '../../../ui/ScreenWrapper'
import { Toast } from '../../../ui/Toast'
import { SectionHeader } from '../SectionHeader'
import { TypeForm } from './TypeForm'

export function TypesSection({ onBack }: { onBack: () => void }) {
  const theme = useTheme()
  const types = useTypeStore(s => s.types)
  const { addType, updateType: updateTypeStore, removeType } = useTypeStore()
  const { toast, showToast, hideToast } = useToast()

  const [adding,    setAdding]    = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name,      setName]      = useState('')
  const [loading,   setLoading]   = useState(false)

  function startAdd()                { setEditingId(null); setName(''); setAdding(true) }
  function startEdit(t: SavingType)  { setAdding(false); setName(t.name); setEditingId(t.id) }
  function cancel()                  { setAdding(false); setEditingId(null); setName('') }

  async function handleSave() {
    if (!name.trim()) { showToast('Name is required', 'error'); return }
    setLoading(true)
    try {
      if (adding) {
        const t = await createSavingType({ name: name.trim() })
        addType(t)
        showToast('Type created', 'success')
      } else if (editingId) {
        const t = await updateSavingType(editingId, name.trim())
        updateTypeStore(t)
        showToast('Type updated', 'success')
      }
      cancel()
    } catch { showToast('Something went wrong', 'error') }
    finally { setLoading(false) }
  }

  function confirmDelete(id: string) {
    Alert.alert('Delete type', 'Presets using this type must be removed first.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDelete(id) },
    ])
  }

  async function handleDelete(id: string) {
    setLoading(true)
    try {
      await deleteSavingType(id)
      removeType(id)
      showToast('Type deleted', 'success')
    } catch (e: any) {
      if (e.message?.includes('restrict')) {
        showToast('Remove presets using this type first', 'error')
      } else {
        showToast('Something went wrong', 'error')
      }
    } finally { setLoading(false) }
  }

  return (
    <ScreenWrapper padded={false}>
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onHide={hideToast} />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SectionHeader title="Types" onBack={onBack} />

        {adding && (
          <TypeForm
            value={name}
            onChange={setName}
            onSave={handleSave}
            onCancel={cancel}
            loading={loading}
            isEdit={false}
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
              + Add type
            </Text>
          </Pressable>
        )}

        {types.length === 0 && (
          <Text style={{ color: theme.colorMuted.val, fontSize: 13, textAlign: 'center' }}>
            No types yet
          </Text>
        )}

        {types.map(t => (
          <View key={t.id}>
            {editingId === t.id ? (
              <TypeForm
                value={name}
                onChange={setName}
                onSave={handleSave}
                onCancel={cancel}
                loading={loading}
                isEdit
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
                <Text style={{ flex: 1, fontSize: 15, color: theme.color.val }}>{t.name}</Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Pressable onPress={() => startEdit(t)} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                    <Text style={{ fontSize: 16 }}>✏️</Text>
                  </Pressable>
                  <Pressable onPress={() => confirmDelete(t.id)} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
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