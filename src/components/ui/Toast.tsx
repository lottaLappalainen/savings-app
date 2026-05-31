import { useEffect, useRef } from 'react'
import { Animated, Text, View } from 'react-native'
import { useTheme } from 'tamagui'

type Props = {
  message:  string
  type:     'success' | 'error'
  visible:  boolean
  onHide:   () => void
}

export function Toast({ message, type, visible, onHide }: Props) {
  const theme   = useTheme()
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(-20)).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity,     { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(translateY,  { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start()

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity,    { toValue: 0, duration: 250, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -20, duration: 250, useNativeDriver: true }),
        ]).start(() => onHide())
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [visible])

  if (!visible) return null

  const bg = type === 'success' ? '#1a2e1a' : '#2e1a1a'
  const border = type === 'success' ? theme.accent.val : '#ef4444'
  const text = type === 'success' ? theme.accent.val : '#ef4444'

  return (
    <Animated.View
      style={{
        position:        'absolute',
        top:             16,
        left:            16,
        right:           16,
        zIndex:          999,
        opacity,
        transform:       [{ translateY }],
      }}
    >
      <View style={{
        backgroundColor: bg,
        borderWidth:     1,
        borderColor:     border,
        borderRadius:    12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection:   'row',
        alignItems:      'center',
        gap:             10,
      }}>
        <Text style={{ fontSize: 16 }}>
          {type === 'success' ? '✓' : '✕'}
        </Text>
        <Text style={{ color: text, fontSize: 14, fontWeight: '500', flex: 1 }}>
          {message}
        </Text>
      </View>
    </Animated.View>
  )
}