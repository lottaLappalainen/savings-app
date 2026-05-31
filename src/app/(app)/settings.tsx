import { useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { useTheme } from 'tamagui'
import { AppText } from '../../components/ui/AppText'
import { Card } from '../../components/ui/Card'
import { ScreenWrapper } from '../../components/ui/ScreenWrapper'

type Section = 'main' | 'goals' | 'presets' | 'types' | 'account'

export default function SettingsScreen() {
  const theme = useTheme()
  const [section, setSection] = useState<Section>('main')

  if (section !== 'main') {
    return (
      <ScreenWrapper>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Pressable
            onPress={() => setSection('main')}
            style={{
              width:           36,
              height:          36,
              borderRadius:    10,
              backgroundColor: theme.backgroundHover.val,
              borderWidth:     0.5,
              borderColor:     theme.borderColor.val,
              alignItems:      'center',
              justifyContent:  'center',
            }}
          >
            <AppText variant="body">←</AppText>
          </Pressable>
          <AppText variant="heading">
            {section === 'goals'   && 'Goals'}
            {section === 'presets' && 'Saved options'}
            {section === 'types'   && 'Types'}
            {section === 'account' && 'Account'}
          </AppText>
        </View>

        {section === 'goals'   && <GoalsSection />}
        {section === 'presets' && <PresetsSection />}
        {section === 'types'   && <TypesSection />}
        {section === 'account' && <AccountSection />}
      </ScreenWrapper>
    )
  }

  const items = [
    {
      section:     'goals' as Section,
      icon:        '🎯',
      label:       'Goals',
      description: 'Add, edit and delete savings goals',
    },
    {
      section:     'presets' as Section,
      icon:        '⚡',
      label:       'Saved options',
      description: 'Quick-pick items for logging savings',
    },
    {
      section:     'types' as Section,
      icon:        '🏷️',
      label:       'Types',
      description: 'Manage categories like food, substances',
    },
    {
      section:     'account' as Section,
      icon:        '👤',
      label:       'Account',
      description: 'Profile and sign out',
    },
  ]

  return (
    <ScreenWrapper>
      <AppText variant="heading" style={{ marginBottom: 8 }}>Settings</AppText>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ gap: 10 }}>
          {items.map((item, i) => (
            <Pressable key={i} onPress={() => setSection(item.section)}>
              {({ pressed }) => (
                <Card style={{ opacity: pressed ? 0.7 : 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <View style={{
                      width:           44,
                      height:          44,
                      borderRadius:    12,
                      backgroundColor: theme.soft.val,
                      alignItems:      'center',
                      justifyContent:  'center',
                    }}>
                      <AppText variant="body">{item.icon}</AppText>
                    </View>
                    <View style={{ flex: 1 }}>
                      <AppText variant="body" style={{ fontWeight: '600' }}>{item.label}</AppText>
                      <AppText variant="muted">{item.description}</AppText>
                    </View>
                    <AppText variant="muted">›</AppText>
                  </View>
                </Card>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}

function GoalsSection() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <AppText variant="muted">Goals management — coming in phase 3</AppText>
    </View>
  )
}

function PresetsSection() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <AppText variant="muted">Saved options — coming in phase 3</AppText>
    </View>
  )
}

function TypesSection() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <AppText variant="muted">Types management — coming in phase 3</AppText>
    </View>
  )
}

function AccountSection() {
  const theme  = useTheme()
  const router = require('expo-router').useRouter()
  const { clear } = require('../../store').useAuthStore()
  const { signOut } = require('../../actions/auth')
  const [loading, setLoading] = useState(false)
  const { AppButton } = require('../../components/ui/AppButton')

  async function handleSignOut() {
    setLoading(true)
    try {
      await signOut()
      clear()
      router.replace('/(auth)/register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{ gap: 16 }}>
      <Card>
        <AppText variant="muted" style={{ textAlign: 'center' }}>
          Manage your account settings here
        </AppText>
      </Card>
      <AppButton variant="danger" onPress={handleSignOut} loading={loading}>
        Sign out
      </AppButton>
    </View>
  )
}