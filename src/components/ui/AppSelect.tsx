import { useState } from 'react'
import { FlatList, Modal, Pressable, Text, View } from 'react-native'
import { useTheme } from 'tamagui'

type Option = {
  label: string
  value: string
}

type Props = {
  options:       Option[]
  value:         string | null
  onChange:      (value: string) => void
  placeholder?:  string
  error?:        boolean
}

export function AppSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  error = false,
}: Props) {
  const theme    = useTheme()
  const [open, setOpen] = useState(false)
  const selected = options.find(o => o.value === value)

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          backgroundColor:  theme.backgroundHover.val,
          borderColor:      error ? '#ef4444' : theme.borderColor.val,
          borderWidth:      1,
          borderRadius:     10,
          paddingHorizontal: 14,
          paddingVertical:   12,
          flexDirection:    'row',
          justifyContent:   'space-between',
          alignItems:       'center',
        }}
      >
        <Text style={{
          fontSize: 15,
          color:    selected ? theme.color.val : theme.colorMuted.val,
        }}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text style={{ color: theme.colorMuted.val, fontSize: 12 }}>▼</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
          onPress={() => setOpen(false)}
        >
          <View style={{
            backgroundColor: theme.backgroundHover.val,
            borderTopLeftRadius:  20,
            borderTopRightRadius: 20,
            padding: 16,
            maxHeight: '60%',
          }}>
            <Text style={{
              fontSize:     16,
              fontWeight:   '600',
              color:        theme.color.val,
              marginBottom: 12,
              textAlign:    'center',
            }}>
              {placeholder}
            </Text>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => { onChange(item.value); setOpen(false) }}
                  style={({ pressed }) => ({
                    paddingVertical:   14,
                    paddingHorizontal: 12,
                    borderRadius:      10,
                    backgroundColor:   item.value === value
                      ? theme.soft.val
                      : pressed
                        ? theme.borderColor.val
                        : 'transparent',
                    marginBottom: 4,
                  })}
                >
                  <Text style={{
                    fontSize: 15,
                    color:    item.value === value ? theme.primary.val : theme.color.val,
                    fontWeight: item.value === value ? '600' : '400',
                  }}>
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  )
}