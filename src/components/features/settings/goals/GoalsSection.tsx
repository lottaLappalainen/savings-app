import { useState } from 'react'
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native'
import { useTheme } from 'tamagui'
import { getProfile } from '../../../../actions/auth'
import { createGoal, deleteGoal, setCurrentGoal, updateGoal } from '../../../../actions/goals'
import { useToast } from '../../../../hooks/useToast'
import { useAuthStore, useGoalStore } from '../../../../store'
import type { Goal } from '../../../../types'
import { ScreenWrapper } from '../../../ui/ScreenWrapper'
import { Toast } from '../../../ui/Toast'
import { SectionHeader } from '../SectionHeader'
import { GoalCard } from './GoalCard'
import { GoalForm } from './GoalForm'

type FormState = { name: string; targetAmount: string; photoUrl: string }
const emptyForm: FormState = { name: '', targetAmount: '', photoUrl: '' }
function fmt(n: number) { return Number(n).toFixed(2) }

export function GoalsSection({ onBack }: { onBack: () => void }) {
  const theme   = useTheme()
  const goals   = useGoalStore(s => s.goals)
  const profile = useAuthStore(s => s.profile)
  const { addGoal, updateGoal: updateGoalStore, removeGoal } = useGoalStore()
  const { setProfile } = useAuthStore()
  const { toast, showToast, hideToast } = useToast()

  const [showCompleted, setShowCompleted] = useState(false)
  const [adding,        setAdding]        = useState(false)
  const [editingId,     setEditingId]     = useState<string | null>(null)
  const [form,          setForm]          = useState<FormState>(emptyForm)
  const [loading,       setLoading]       = useState(false)

  const active    = goals.filter(g => !g.is_completed)
  const completed = goals.filter(g =>  g.is_completed)
  const currentId = profile?.current_goal_id

  function startAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setAdding(true)
  }

  function startEdit(g: Goal) {
    setAdding(false)
    setForm({
      name:         g.name,
      targetAmount: fmt(Number(g.target_amount)),
      photoUrl:     g.photo_url ?? '',
    })
    setEditingId(g.id)
  }

  function cancelForm() {
    setAdding(false)
    setEditingId(null)
  }

  function handleChange(key: keyof FormState, value: string) {
    setForm(p => ({ ...p, [key]: value }))
  }

  async function handleSave() {
    if (!form.name.trim()) { showToast('Name is required', 'error'); return }
    const amount = parseFloat(form.targetAmount.replace(',', '.'))
    if (isNaN(amount) || amount <= 0) { showToast('Enter a valid amount', 'error'); return }
    setLoading(true)
    try {
      if (adding) {
        const g = await createGoal({
          name:         form.name.trim(),
          targetAmount: amount,
          photoUrl:     form.photoUrl.trim() || null,
        })
        addGoal(g)
        showToast('Goal created', 'success')
      } else if (editingId) {
        const g = await updateGoal({
          id:           editingId,
          name:         form.name.trim(),
          targetAmount: amount,
          photoUrl:     form.photoUrl.trim() || null,
        })
        updateGoalStore(g)
        showToast('Goal updated', 'success')
      }
      cancelForm()
    } catch { showToast('Something went wrong', 'error') }
    finally { setLoading(false) }
  }

  function confirmDelete(id: string) {
    Alert.alert('Delete goal', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDelete(id) },
    ])
  }

  async function handleDelete(id: string) {
    setLoading(true)
    try {
      await deleteGoal(id)
      removeGoal(id)
      const fresh = await getProfile()
      setProfile(fresh)
      showToast('Goal deleted', 'success')
    } catch { showToast('Something went wrong', 'error') }
    finally { setLoading(false) }
  }

  async function handleSetCurrent(id: string) {
    setLoading(true)
    try {
      await setCurrentGoal(id)
      const fresh = await getProfile()
      setProfile(fresh)
      showToast('Current goal updated', 'success')
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
        <SectionHeader title="Goals" onBack={onBack} />

        {adding && (
          <GoalForm
            form={form}
            onChange={handleChange}
            onSave={handleSave}
            onCancel={cancelForm}
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
              + Add goal
            </Text>
          </Pressable>
        )}

        {active.length === 0 && (
          <Text style={{ color: theme.colorMuted.val, fontSize: 13, textAlign: 'center', marginBottom: 16 }}>
            No active goals yet
          </Text>
        )}

        {/* Current goal first */}
        {active
          .filter(g => g.id === currentId)
          .map(g => editingId === g.id
            ? <GoalForm key={g.id} form={form} onChange={handleChange} onSave={handleSave} onCancel={cancelForm} loading={loading} isEdit />
            : <GoalCard key={g.id} goal={g} currentId={currentId} onEdit={startEdit} onDelete={confirmDelete} onSetCurrent={handleSetCurrent} />
          )
        }

        {/* Rest of active */}
        {active
          .filter(g => g.id !== currentId)
          .map(g => editingId === g.id
            ? <GoalForm key={g.id} form={form} onChange={handleChange} onSave={handleSave} onCancel={cancelForm} loading={loading} isEdit />
            : <GoalCard key={g.id} goal={g} currentId={currentId} onEdit={startEdit} onDelete={confirmDelete} onSetCurrent={handleSetCurrent} />
          )
        }

        {/* Completed toggle */}
        {completed.length > 0 && (
          <Pressable
            onPress={() => setShowCompleted(p => !p)}
            style={{
              flexDirection:   'row',
              alignItems:      'center',
              justifyContent:  'space-between',
              paddingVertical: 12,
              borderTopWidth:  0.5,
              borderTopColor:  theme.borderColor.val,
              marginTop:       8,
            }}
          >
            <Text style={{ fontSize: 13, color: theme.colorMuted.val }}>
              Achieved goals ({completed.length})
            </Text>
            <Text style={{ fontSize: 13, color: theme.colorMuted.val }}>
              {showCompleted ? '▲' : '▼'}
            </Text>
          </Pressable>
        )}

        {showCompleted && completed.map(g => (
          <View key={g.id} style={{
            backgroundColor: theme.backgroundHover.val,
            borderRadius:    14,
            borderWidth:     0.5,
            borderColor:     theme.borderColor.val,
            padding:         14,
            marginBottom:    10,
            flexDirection:   'row',
            alignItems:      'center',
            gap:             12,
            opacity:         0.7,
          }}>
            {g.photo_url && (
              <Image
                source={{ uri: g.photo_url }}
                style={{ width: 44, height: 44, borderRadius: 8 }}
                resizeMode="cover"
              />
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.color.val }}>{g.name}</Text>
              <Text style={{ fontSize: 11, color: theme.accent.val }}>
                ✓ Achieved · €{fmt(Number(g.target_amount))}
              </Text>
            </View>
            <Pressable onPress={() => confirmDelete(g.id)}>
              <Text style={{ fontSize: 16, color: '#ef4444' }}>🗑️</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  )
}