import { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useTheme } from 'tamagui'
import { AccountSection } from '../../components/features/settings/AccountSection'
import { GoalsSection } from '../../components/features/settings/goals/GoalsSection'
import { PresetsSection } from '../../components/features/settings/presets/PresetsSection'
import { TypesSection } from '../../components/features/settings/types/TypesSection'
import { ScreenWrapper } from '../../components/ui/ScreenWrapper'

type Section = 'main' | 'goals' | 'presets' | 'types' | 'account'

export default function SettingsScreen() {
  const theme = useTheme()
  const [section, setSection] = useState<Section>('main')

  if (section === 'goals')   return <GoalsSection   onBack={() => setSection('main')} />
  if (section === 'presets') return <PresetsSection onBack={() => setSection('main')} />
  if (section === 'types')   return <TypesSection   onBack={() => setSection('main')} />
  if (section === 'account') return <AccountSection onBack={() => setSection('main')} />

  const items = [
    { section: 'goals'   as Section, icon: '🎯', label: 'Goals',         description: 'Add and manage savings goals'        },
    { section: 'presets' as Section, icon: '⚡',  label: 'Saved options', description: 'Quick-pick items for logging savings' },
    { section: 'types'   as Section, icon: '🏷️',  label: 'Types',         description: 'Categories like food, substances'    },
    { section: 'account' as Section, icon: '👤',  label: 'Account',       description: 'Profile and sign out'                },
  ]

  return (
    <ScreenWrapper>
      <Text style={{ fontSize: 22, fontWeight: '700', color: theme.color.val, marginBottom: 8 }}>
        Settings
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ gap: 10 }}>
          {items.map(item => (
            <Pressable key={item.section} onPress={() => setSection(item.section)}>
              {({ pressed }) => (
                <View style={{
                  backgroundColor: theme.backgroundHover.val,
                  borderRadius:    14,
                  borderWidth:     0.5,
                  borderColor:     theme.borderColor.val,
                  padding:         16,
                  flexDirection:   'row',
                  alignItems:      'center',
                  gap:             14,
                  opacity:         pressed ? 0.7 : 1,
                }}>
                  <View style={{
                    width:           44,
                    height:          44,
                    borderRadius:    12,
                    backgroundColor: theme.soft.val,
                    alignItems:      'center',
                    justifyContent:  'center',
                  }}>
                    <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: theme.color.val }}>
                      {item.label}
                    </Text>
                    <Text style={{ fontSize: 12, color: theme.colorMuted.val }}>
                      {item.description}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 18, color: theme.colorMuted.val }}>›</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}