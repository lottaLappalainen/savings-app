import { Tabs } from 'expo-router'
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs/types'
import { Pressable, Text, View } from 'react-native'
import { useTheme } from 'tamagui'
import { useBootstrap } from '../../hooks/useBootstrap'

type Route = { name: string; key: string }

function TabBar({ state, navigation }: BottomTabBarProps) {
  const theme = useTheme()

  const tabs = [
    { name: 'logs',     icon: '📋', label: 'Logs'     },
    { name: 'index',    icon: '🏠', label: 'Home'     },
    { name: 'settings', icon: '⚙️',  label: 'Settings' },
  ]

  return (
    <View style={{
      flexDirection:     'row',
      backgroundColor:   theme.background.val,
      borderTopWidth:    0.5,
      borderTopColor:    theme.borderColor.val,
      paddingBottom:     24,
      paddingTop:        12,
      paddingHorizontal: 16,
    }}>
      {tabs.map((tab) => {
        const route      = state.routes.find((r: Route) => r.name === tab.name)
        if (!route) return null
        const routeIndex = state.routes.indexOf(route)
        const focused    = state.index === routeIndex
        const isCenter   = tab.name === 'index'

        return (
          <Pressable
            key={tab.name}
            onPress={() => navigation.navigate(tab.name)}
            style={({ pressed }) => ({
              flex:           1,
              alignItems:     'center',
              justifyContent: 'center',
              gap:            4,
              opacity:        pressed ? 0.7 : 1,
            })}
          >
            {isCenter ? (
              <View style={{
                width:           56,
                height:          56,
                borderRadius:    28,
                backgroundColor: focused ? theme.primary.val : theme.backgroundHover.val,
                borderWidth:     1,
                borderColor:     focused ? theme.primary.val : theme.borderColor.val,
                alignItems:      'center',
                justifyContent:  'center',
                marginTop:       -20,
              }}>
                <Text style={{ fontSize: 22 }}>{tab.icon}</Text>
              </View>
            ) : (
              <>
                <View style={{
                  width:           40,
                  height:          40,
                  borderRadius:    12,
                  backgroundColor: focused ? theme.soft.val : 'transparent',
                  alignItems:      'center',
                  justifyContent:  'center',
                }}>
                  <Text style={{ fontSize: 20 }}>{tab.icon}</Text>
                </View>
                <Text style={{
                  fontSize:   10,
                  color:      focused ? theme.primary.val : theme.colorMuted.val,
                  fontWeight: focused ? '600' : '400',
                }}>
                  {tab.label}
                </Text>
              </>
            )}
          </Pressable>
        )
      })}
    </View>
  )
}

export default function AppLayout() {
  useBootstrap()

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="logs"     />
      <Tabs.Screen name="index"    />
      <Tabs.Screen name="settings" />
    </Tabs>
  )
}