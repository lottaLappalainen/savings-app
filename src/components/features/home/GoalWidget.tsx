import { Pressable, Text, View } from 'react-native'
import { useTheme } from 'tamagui'
import type { Goal } from '../../../types'

type Props = {
  currentGoal:  Goal | null
  totalSaved:   number
  goalAmount:   number
  onSetGoal:    () => void
}

function fmt(n: number) { return n.toFixed(2) }

export function GoalWidget({ currentGoal, totalSaved, goalAmount, onSetGoal }: Props) {
  const theme     = useTheme()
  const target    = Number(currentGoal?.target_amount ?? 0)
  const remaining = Math.max(0, target - goalAmount)
  const progress  = target > 0 ? Math.min(1, goalAmount / target) : 0

  return (
    <View style={{ gap: 16 }}>
      {/* Total saved */}
      <View style={{ alignItems: 'center', paddingVertical: 8 }}>
        <Text style={{ fontSize: 13, color: theme.colorMuted.val, marginBottom: 4 }}>
          Total saved
        </Text>
        <Text style={{
          fontSize:   64,
          fontWeight: '700',
          color:      theme.primary.val,
          lineHeight: 72,
        }}>
          €{fmt(totalSaved)}
        </Text>
      </View>

      {/* Goal card */}
      {currentGoal ? (
        <View style={{
          backgroundColor: theme.backgroundHover.val,
          borderRadius:    16,
          borderWidth:     0.5,
          borderColor:     theme.borderColor.val,
          padding:         16,
          gap:             10,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ fontSize: 11, color: theme.colorMuted.val, marginBottom: 2 }}>
                current goal
              </Text>
              <Text style={{ fontSize: 15, color: theme.color.val, fontWeight: '600' }}>
                {currentGoal.name}
              </Text>
            </View>
            <Text style={{ fontSize: 11, color: theme.colorMuted.val }}>
              €{fmt(goalAmount)} / €{fmt(target)}
            </Text>
          </View>

          {/* Progress bar */}
          <View style={{
            backgroundColor: theme.borderColor.val,
            borderRadius:    99,
            height:          6,
            overflow:        'hidden',
          }}>
            <View style={{
              backgroundColor: theme.primary.val,
              height:          6,
              width:           `${(progress * 100).toFixed(1)}%` as `${number}%`,
              borderRadius:    99,
            }} />
          </View>

          <Text style={{
            fontSize:   32,
            fontWeight: '700',
            color:      theme.accent.val,
            textAlign:  'center',
            marginTop:  4,
          }}>
            €{fmt(remaining)} to go
          </Text>
        </View>
      ) : (
        /* ── No goal — shortcut card ── */
        <Pressable
          onPress={onSetGoal}
          style={({ pressed }) => ({
            backgroundColor: theme.backgroundHover.val,
            borderRadius:    16,
            borderWidth:     1,
            borderColor:     theme.primary.val,
            borderStyle:     'dashed',
            padding:         24,
            alignItems:      'center',
            gap:             10,
            opacity:         pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ fontSize: 32 }}>🎯</Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: theme.primary.val }}>
            Set a goal
          </Text>
          <Text style={{ fontSize: 13, color: theme.colorMuted.val, textAlign: 'center' }}>
            Tap to add your first savings goal and start tracking
          </Text>
          <View style={{
            backgroundColor: theme.primary.val,
            borderRadius:    10,
            paddingVertical: 10,
            paddingHorizontal: 24,
            marginTop:       4,
          }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: theme.background.val }}>
              Add goal
            </Text>
          </View>
        </Pressable>
      )}
    </View>
  )
}