import { Pressable, Text, TextInput, View } from 'react-native'
import { useTheme } from 'tamagui'
import type { SavingType } from '../../../types'
import { AppSelect } from '../../ui/AppSelect'

type Props = {
  search:        string
  onSearch:      (v: string) => void
  filterTypeId:  string | null
  onFilterType:  (v: string) => void
  filteredTotal: number
  isFiltering:   boolean
  onClearFilter: () => void
  types:         SavingType[]
}

function fmt(n: number) { return n.toFixed(2) }

export function LogsHeader({
  search, onSearch,
  filterTypeId, onFilterType,
  filteredTotal, isFiltering,
  onClearFilter, types,
}: Props) {
  const theme       = useTheme()
  const typeOptions = types.map(t => ({ label: t.name, value: t.id }))

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: theme.color.val }}>
        Logs
      </Text>

      {/* Total */}
      <View style={{
        backgroundColor: theme.backgroundHover.val,
        borderRadius:    12,
        borderWidth:     0.5,
        borderColor:     theme.borderColor.val,
        padding:         14,
        flexDirection:   'row',
        justifyContent:  'space-between',
        alignItems:      'center',
      }}>
        <Text style={{ fontSize: 13, color: theme.colorMuted.val }}>
          {isFiltering ? 'Filtered total' : 'Total saved'}
        </Text>
        <Text style={{ fontSize: 22, fontWeight: '700', color: theme.primary.val }}>
          €{fmt(filteredTotal)}
        </Text>
      </View>

      {/* Search */}
      <View style={{
        backgroundColor:   theme.backgroundHover.val,
        borderRadius:      10,
        borderWidth:       0.5,
        borderColor:       theme.borderColor.val,
        paddingHorizontal: 14,
        paddingVertical:   10,
        flexDirection:     'row',
        alignItems:        'center',
        gap:               8,
      }}>
        <Text style={{ fontSize: 16, color: theme.colorMuted.val }}>🔍</Text>
        <TextInput
          value={search}
          onChangeText={onSearch}
          placeholder="Search by title..."
          placeholderTextColor={theme.colorMuted.val}
          style={{ flex: 1, fontSize: 14, color: theme.color.val }}
        />
        {search !== '' && (
          <Pressable onPress={() => onSearch('')}>
            <Text style={{ fontSize: 14, color: theme.colorMuted.val }}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Type filter */}
      <AppSelect
        options={typeOptions}
        value={filterTypeId}
        onChange={v => onFilterType(filterTypeId === v ? '' : v)}
        placeholder="Filter by type"
      />

      {/* Clear filters */}
      {isFiltering && (
        <Pressable onPress={onClearFilter}>
          <Text style={{ fontSize: 12, color: theme.primary.val, textAlign: 'center' }}>
            Clear filters
          </Text>
        </Pressable>
      )}
    </View>
  )
}