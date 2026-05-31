import { useMemo, useState } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { useTheme } from 'tamagui'
import { getProfile } from '../../actions/auth'
import { deleteEntry, getHistory, updateEntry } from '../../actions/savings'
import { EntryEditForm } from '../../components/features/logs/EntryEditForm'
import { EntryRow } from '../../components/features/logs/EntryRow'
import { LogsHeader } from '../../components/features/logs/LogsHeader'
import { ScreenWrapper } from '../../components/ui/ScreenWrapper'
import { Toast } from '../../components/ui/Toast'
import { useToast } from '../../hooks/useToast'
import { useAuthStore, useHistoryStore, useTypeStore } from '../../store'
import type { EntryWithType } from '../../types'

type EditState = {
  id:     string
  amount: string
  title:  string
  typeId: string | null
}

function fmt(n: number) { return n.toFixed(2) }

export default function LogsScreen() {
  const theme   = useTheme()
  const history = useHistoryStore(s => s.history)
  const types   = useTypeStore(s => s.types)
  const { setHistory } = useHistoryStore()
  const { setProfile } = useAuthStore()
  const { toast, showToast, hideToast } = useToast()

  const [search,       setSearch]       = useState('')
  const [filterTypeId, setFilterTypeId] = useState<string | null>(null)
  const [edit,         setEdit]         = useState<EditState | null>(null)
  const [saving,       setSaving]       = useState(false)
  const [deleting,     setDeleting]     = useState<string | null>(null)

  const allEntries = useMemo(() => history.flatMap(d => d.entries), [history])

  const filtered = useMemo(() => allEntries.filter(e => {
    const matchSearch = search.trim() === '' ||
      (e.title ?? '').toLowerCase().includes(search.toLowerCase())
    const matchType = filterTypeId === null || e.type_id === filterTypeId
    return matchSearch && matchType
  }), [allEntries, search, filterTypeId])

  const grouped = useMemo(() => {
    const groups: Record<string, EntryWithType[]> = {}
    for (const entry of filtered) {
      const date = new Date(entry.created_at).toLocaleDateString('fi-FI')
      if (!groups[date]) groups[date] = []
      groups[date].push(entry)
    }
    return Object.entries(groups)
  }, [filtered])

  const filteredTotal = useMemo(() =>
    filtered.reduce((s, e) => s + Number(e.amount), 0), [filtered])

  const isFiltering = search.trim() !== '' || filterTypeId !== null

  function startEdit(entry: EntryWithType) {
    setEdit({
      id:     entry.id,
      amount: fmt(Number(entry.amount)),
      title:  entry.title ?? '',
      typeId: entry.type_id ?? null,
    })
  }

  async function handleSaveEdit() {
    if (!edit) return
    const parsed = parseFloat(edit.amount.replace(',', '.'))
    if (isNaN(parsed) || parsed <= 0) { showToast('Enter a valid amount', 'error'); return }
    setSaving(true)
    try {
      await updateEntry({ id: edit.id, amount: parsed, title: edit.title.trim() || null, typeId: edit.typeId })
      const [fresh, freshHistory] = await Promise.all([getProfile(), getHistory()])
      setProfile(fresh)
      setHistory(freshHistory)
      setEdit(null)
      showToast('Entry updated', 'success')
    } catch { showToast('Something went wrong', 'error') }
    finally { setSaving(false) }
  }

  function confirmDelete(id: string) {
    Alert.alert('Delete entry', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDelete(id) },
    ])
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await deleteEntry(id)
      const [fresh, freshHistory] = await Promise.all([getProfile(), getHistory()])
      setProfile(fresh)
      setHistory(freshHistory)
      showToast('Entry deleted', 'success')
    } catch { showToast('Something went wrong', 'error') }
    finally { setDeleting(null) }
  }

  return (
    <ScreenWrapper padded={false}>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />

      <LogsHeader
        search={search}
        onSearch={setSearch}
        filterTypeId={filterTypeId}
        onFilterType={(v) => setFilterTypeId(prev => prev === v ? null : v)}
        filteredTotal={filteredTotal}
        isFiltering={isFiltering}
        onClearFilter={() => { setSearch(''); setFilterTypeId(null) }}
        types={types}
      />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {grouped.length === 0 && (
          <View style={{ paddingTop: 40, alignItems: 'center' }}>
            <Text style={{ color: theme.colorMuted.val, fontSize: 14 }}>
              {isFiltering ? 'No entries match your search' : 'No entries yet'}
            </Text>
          </View>
        )}

        {grouped.map(([date, entries]) => (
          <View key={date} style={{ gap: 6 }}>
            <Text style={{
              fontSize:     12,
              color:        theme.colorMuted.val,
              fontWeight:   '600',
              marginBottom: 2,
            }}>
              {date}
            </Text>

            {entries.map(entry => (
              <View key={entry.id}>
                {edit?.id === entry.id ? (
                  <EntryEditForm
                    edit={edit}
                    onChange={update => setEdit(e => e ? { ...e, ...update } : e)}
                    onSave={handleSaveEdit}
                    onCancel={() => setEdit(null)}
                    loading={saving}
                    types={types}
                  />
                ) : (
                  <EntryRow
                    entry={entry}
                    isDeleting={deleting === entry.id}
                    onEdit={startEdit}
                    onDelete={confirmDelete}
                  />
                )}
              </View>
            ))}

            <Text style={{
              fontSize:  12,
              color:     theme.colorMuted.val,
              textAlign: 'right',
              marginTop: 2,
            }}>
              Day total: €{fmt(entries.reduce((s, e) => s + Number(e.amount), 0))}
            </Text>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  )
}