import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native'
import { useTheme } from 'tamagui'
import { getProfile } from '../../actions/auth'
import { addEntry, getHistory } from '../../actions/savings'
import { GoalWidget } from '../../components/features/home/GoalWidget'
import { LogForm } from '../../components/features/home/LogForm'
import { GoalCelebration } from '../../components/ui/GoalCelebration'
import { ScreenWrapper } from '../../components/ui/ScreenWrapper'
import { Toast } from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { useAuthStore, useGoalStore, useHistoryStore, usePresetStore, useTypeStore } from '../../store'

type Mode = 'new' | 'preset'

export default function HomeScreen() {
  const router   = useRouter()
  const theme    = useTheme()
  const profile  = useAuthStore(s => s.profile)
  const goals    = useGoalStore(s => s.goals)
  const types    = useTypeStore(s => s.types)
  const presets  = usePresetStore(s => s.presets)
  const { setHistory }  = useHistoryStore()
  const { setProfile }  = useAuthStore()
  const { toast, showToast, hideToast } = useToast()

  const [mode,        setMode]        = useState<Mode>('new')
  const [presetId,    setPresetId]    = useState<string | null>(null)
  const [amount,      setAmount]      = useState('')
  const [typeId,      setTypeId]      = useState<string | null>(null)
  const [title,       setTitle]       = useState('')
  const [loading,     setLoading]     = useState(false)
  const [celebration, setCelebration] = useState(false)
  const completedGoalRef = useRef<{ name: string; amount: number } | null>(null)

  const currentGoal = goals.find(g => g.id === profile?.current_goal_id) ?? null
  const totalSaved  = Number(profile?.total_saved ?? 0)
  const goalAmount  = Number(profile?.current_goal_amount ?? 0)

  function handleModeChange(m: Mode) {
    setMode(m)
    setPresetId(null)
    setAmount('')
    setTypeId(null)
    setTitle('')
  }

  function handlePresetSelect(id: string) {
    setPresetId(id)
    const preset = presets.find(p => p.id === id)
    if (preset) {
      setAmount(Number(preset.amount).toFixed(2))
      setTitle(preset.title)
      setTypeId(preset.type_id)
    }
  }

  async function handleSave() {
    const parsed = parseFloat(amount.replace(',', '.'))
    if (isNaN(parsed) || parsed <= 0) { showToast('Enter a valid amount', 'error'); return }

    const goalBeforeSave = currentGoal
    setLoading(true)
    try {
      await addEntry({
        amount:   parsed,
        typeId:   typeId  ?? null,
        title:    title.trim() || null,
        presetId: mode === 'preset' ? presetId : null,
      })
      const [fresh, history] = await Promise.all([getProfile(), getHistory()])
      setProfile(fresh)
      setHistory(history)

      if (goalBeforeSave && !fresh.current_goal_id) {
        completedGoalRef.current = {
          name:   goalBeforeSave.name,
          amount: Number(goalBeforeSave.target_amount),
        }
        setCelebration(true)
      } else {
        showToast('Saved!', 'success')
      }

      setAmount('')
      setTypeId(null)
      setTitle('')
      setPresetId(null)
    } catch {
      showToast('Something went wrong', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScreenWrapper padded={false}>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />

      <GoalCelebration
        visible={celebration}
        goalName={completedGoalRef.current?.name ?? ''}
        amount={completedGoalRef.current?.amount ?? 0}
        onSetNext={() => { setCelebration(false); setTimeout(() => router.push('/(app)/settings'), 300) }}
        onDismiss={() => setCelebration(false)}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <GoalWidget
            currentGoal={currentGoal}
            totalSaved={totalSaved}
            goalAmount={goalAmount}
            onSetGoal={() => router.push('/(app)/settings')}
          />

          {/* Preset shortcut if none exist */}
          {presets.length === 0 && types.length === 0 && (
            <Pressable
              onPress={() => router.push('/(app)/settings')}
              style={({ pressed }) => ({
                backgroundColor: theme.backgroundHover.val,
                borderRadius:    12,
                borderWidth:     0.5,
                borderColor:     theme.borderColor.val,
                padding:         14,
                flexDirection:   'row',
                alignItems:      'center',
                gap:             12,
                opacity:         pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontSize: 20 }}>⚡</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.color.val }}>
                  Add saved options
                </Text>
                <Text style={{ fontSize: 12, color: theme.colorMuted.val }}>
                  Save items like "Coffee 3.50€" for quick logging
                </Text>
              </View>
              <Text style={{ fontSize: 16, color: theme.colorMuted.val }}>›</Text>
            </Pressable>
          )}

          <LogForm
            mode={mode}
            onModeChange={handleModeChange}
            amount={amount}
            onAmount={setAmount}
            title={title}
            onTitle={setTitle}
            typeId={typeId}
            onTypeId={setTypeId}
            presetId={presetId}
            onPresetSelect={handlePresetSelect}
            onSave={handleSave}
            loading={loading}
            types={types}
            presets={presets}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}