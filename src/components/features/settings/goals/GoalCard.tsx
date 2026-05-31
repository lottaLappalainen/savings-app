import { Image, Pressable, Text, View } from 'react-native'
import { useTheme } from 'tamagui'
import type { Goal } from '../../../../types'

type Props = {
  goal:       Goal
  currentId:  string | null | undefined
  onEdit:     (g: Goal) => void
  onDelete:   (id: string) => void
  onSetCurrent: (id: string) => void
}

function fmt(n: number) { return Number(n).toFixed(2) }

export function GoalCard({ goal, currentId, onEdit, onDelete, onSetCurrent }: Props) {
  const theme     = useTheme()
  const isCurrent = goal.id === currentId

  return (
    <View style={{
      backgroundColor: theme.backgroundHover.val,
      borderRadius:    14,
      borderWidth:     isCurrent ? 1.5 : 0.5,
      borderColor:     isCurrent ? theme.primary.val : theme.borderColor.val,
      overflow:        'hidden',
      marginBottom:    10,
    }}>
      {goal.photo_url ? (
        <Image
          source={{ uri: goal.photo_url }}
          style={{ width: '100%', height: 120, backgroundColor: theme.borderColor.val }}
          resizeMode="cover"
        />
      ) : null}

      <View style={{ padding: 14, gap: 8 }}>
        {isCurrent && (
          <View style={{
            alignSelf:         'flex-start',
            backgroundColor:   theme.primary.val,
            borderRadius:      99,
            paddingHorizontal: 10,
            paddingVertical:   3,
          }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: theme.background.val }}>
              Current goal
            </Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.color.val, flex: 1 }}>
            {goal.name}
          </Text>
          <Text style={{ fontSize: 13, color: theme.colorMuted.val }}>
            €{fmt(Number(goal.target_amount))}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          {!isCurrent && (
            <Pressable
              onPress={() => onSetCurrent(goal.id)}
              style={({ pressed }) => ({
                flex:            1,
                paddingVertical: 8,
                borderRadius:    8,
                backgroundColor: theme.soft.val,
                alignItems:      'center',
                opacity:         pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontSize: 12, color: theme.primary.val, fontWeight: '600' }}>
                Set as current
              </Text>
            </Pressable>
          )}
          <Pressable
            onPress={() => onEdit(goal)}
            style={({ pressed }) => ({
              flex:            1,
              paddingVertical: 8,
              borderRadius:    8,
              borderWidth:     0.5,
              borderColor:     theme.borderColor.val,
              alignItems:      'center',
              opacity:         pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ fontSize: 12, color: theme.colorMuted.val }}>Edit</Text>
          </Pressable>
          <Pressable
            onPress={() => onDelete(goal.id)}
            style={({ pressed }) => ({
              paddingVertical:  8,
              paddingHorizontal: 14,
              borderRadius:     8,
              borderWidth:      0.5,
              borderColor:      '#ef444460',
              alignItems:       'center',
              opacity:          pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ fontSize: 12, color: '#ef4444' }}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}