import { Tabs } from 'expo-router'
import { Text } from 'tamagui'

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown:     false,
        tabBarStyle:     { backgroundColor: '#1a1520', borderTopColor: '#3a2f47' },
        tabBarActiveTintColor:   '#aa83d4',
        tabBarInactiveTintColor: '#a096b0',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title:    'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="save"
        options={{
          title:    'Save',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>＋</Text>,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title:    'Goals',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🎯</Text>,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title:    'History',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📋</Text>,
        }}
      />
    </Tabs>
  )
}