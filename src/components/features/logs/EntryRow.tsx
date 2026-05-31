import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { useTheme } from 'tamagui'
import type { EntryWithType } from '../../../types'

type Props = {
  entry:     EntryWithType
  isDeleting: boolean
  onEdit:    (entry: EntryWithType) => void
  onDelete:  (id: string) => void
}

function fmt(n: number) { return Number(n).toFixed(2) }

export function EntryRow({ entry, isDeleting, onEdit, onDelete }: Props) {
  const theme = useTheme()

  return (
    <View style={{
      backgroundColor:   theme.backgroundHover.val,
      borderRadius:      12,
      borderWidth:       0.5,
      borderColor:       theme.borderColor.val,
      paddingVertical:   10,
      paddingHorizontal: 14,
      flexDirection:     'row',
      alignItems:        'center',
      gap:               10,
    }}>
      {/* Amount */}
      <Text style={{
        fontSize:   17,
        fontWeight: '700',
        color:      theme.accent.val,
        minWidth:   60,
      }}>
        €{fmt(Number(entry.amount))}
      </Text>

      {/* Title + type */}
      <View style={{ flex: 1 }}>
        {entry.title && (
          <Text style={{ fontSize: 14, color: theme.color.val }} numberOfLines={1}>
            {entry.title}
          </Text>
        )}
        {entry.saving_type && (
          <Text style={{ fontSize: 11, color: theme.colorMuted.val }}>
            {entry.saving_type.name}
          </Text>
        )}
      </View>

      {/* Edit / delete */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable
          onPress={() => onEdit(entry)}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 4 })}
        >
          <Text style={{ fontSize: 16 }}>✏️</Text>
        </Pressable>
        <Pressable
          onPress={() => onDelete(entry.id)}
          disabled={isDeleting}
          style={({ pressed }) => ({ opacity: pressed || isDeleting ? 0.5 : 1, padding: 4 })}
        >
          {isDeleting
            ? <ActivityIndicator size="small" color="#ef4444" />
            : <Text style={{ fontSize: 16 }}>🗑️</Text>
          }
        </Pressable>
      </View>
    </View>
  )
}