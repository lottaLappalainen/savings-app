import { useEffect, useRef } from 'react'
import {
    Animated,
    Dimensions,
    Modal,
    Platform,
    Pressable,
    Text,
    View,
} from 'react-native'
import { useTheme } from 'tamagui'

const useNative = Platform.OS !== 'web'
const { width: W, height: H } = Dimensions.get('window')
const COLORS = ['#aa83d4', '#bfe0a6', '#d0bedd', '#cfdac3', '#8d7b9f']
const PARTICLE_COUNT = 30

type Particle = {
  x:       Animated.Value
  y:       Animated.Value
  opacity: Animated.Value
  color:   string
  size:    number
}

type Props = {
  visible:   boolean
  goalName:  string
  amount:    number
  onSetNext: () => void
  onDismiss: () => void
}

function fmt(n: number) { return n.toFixed(2) }

function useParticles() {
  const particles = useRef<Particle[]>(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      x:       new Animated.Value(W / 2),
      y:       new Animated.Value(H / 3),
      opacity: new Animated.Value(0),
      color:   COLORS[Math.floor(Math.random() * COLORS.length)],
      size:    6 + Math.random() * 8,
    }))
  ).current

  function burst() {
    particles.forEach(p => {
      p.x.setValue(W / 2 + (Math.random() - 0.5) * 60)
      p.y.setValue(H / 3)
      p.opacity.setValue(1)

      Animated.parallel([
        Animated.timing(p.x, {
          toValue:         W / 2 + (Math.random() - 0.5) * W * 0.8,
          duration:        1200 + Math.random() * 600,
          useNativeDriver: useNative,
        }),
        Animated.timing(p.y, {
          toValue:         H / 3 + 200 + Math.random() * 300,
          duration:        1200 + Math.random() * 600,
          useNativeDriver: useNative,
        }),
        Animated.sequence([
          Animated.delay(600),
          Animated.timing(p.opacity, {
            toValue:         0,
            duration:        400,
            useNativeDriver: useNative,
          }),
        ]),
      ]).start()
    })
  }

  return { particles, burst }
}

export function GoalCelebration({ visible, goalName, amount, onSetNext, onDismiss }: Props) {
  const theme       = useTheme()
  const { particles, burst } = useParticles()
  const scaleAnim   = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!visible) return

    scaleAnim.setValue(0)
    opacityAnim.setValue(0)

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue:         1,
        tension:         60,
        friction:        8,
        useNativeDriver: useNative,
      }),
      Animated.timing(opacityAnim, {
        toValue:         1,
        duration:        300,
        useNativeDriver: useNative,
      }),
    ]).start()

    burst()
    const interval = setInterval(burst, 2000)
    return () => clearInterval(interval)
  }, [visible])

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={{
        flex:            1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        alignItems:      'center',
        justifyContent:  'center',
      }}>
        {/* Particles */}
        {particles.map((p, i) => (
          <Animated.View
            key={i}
            style={{
              position:        'absolute',
              width:           p.size,
              height:          p.size,
              borderRadius:    p.size / 2,
              backgroundColor: p.color,
              opacity:         p.opacity,
              transform:       [{ translateX: p.x }, { translateY: p.y }],
            }}
          />
        ))}

        {/* Card */}
        <Animated.View style={{
          width:           300,
          backgroundColor: theme.background.val,
          borderRadius:    24,
          borderWidth:     1,
          borderColor:     theme.primary.val,
          padding:         28,
          alignItems:      'center',
          transform:       [{ scale: scaleAnim }],
          opacity:         opacityAnim,
        }}>
          <Text style={{ fontSize: 56, marginBottom: 8 }}>🎉</Text>

          <Text style={{
            fontSize:     24,
            fontWeight:   '700',
            color:        theme.primary.val,
            textAlign:    'center',
            marginBottom: 4,
          }}>
            Goal achieved!
          </Text>

          <Text style={{
            fontSize:     16,
            fontWeight:   '600',
            color:        theme.color.val,
            textAlign:    'center',
            marginBottom: 4,
          }}>
            {goalName}
          </Text>

          <Text style={{
            fontSize:     13,
            color:        theme.colorMuted.val,
            textAlign:    'center',
            marginBottom: 20,
          }}>
            You saved €{fmt(amount)}
          </Text>

          <View style={{
            width:           '100%',
            height:          0.5,
            backgroundColor: theme.borderColor.val,
            marginBottom:    20,
          }} />

          <Text style={{
            fontSize:     13,
            color:        theme.colorMuted.val,
            textAlign:    'center',
            marginBottom: 16,
          }}>
            Pick your next goal to keep going
          </Text>

          <Pressable
            onPress={onSetNext}
            style={({ pressed }) => ({
              width:           '100%',
              backgroundColor: theme.primary.val,
              borderRadius:    12,
              paddingVertical: 14,
              alignItems:      'center',
              marginBottom:    10,
              opacity:         pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: theme.background.val }}>
              Set next goal
            </Text>
          </Pressable>

          <Pressable onPress={onDismiss} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
            <Text style={{ fontSize: 13, color: theme.colorMuted.val }}>
              Maybe later
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  )
}