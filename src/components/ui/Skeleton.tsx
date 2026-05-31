import { useEffect, useRef } from 'react'
import { Animated, DimensionValue, ViewStyle } from 'react-native'
import { useTheme } from 'tamagui'

type Props = {
  width?:  DimensionValue
  height?: number
  radius?: number
  style?:  ViewStyle
}

export function Skeleton({ width = '100%', height = 16, radius = 8, style }: Props) {
  const theme   = useTheme()
  const opacity = useRef(new Animated.Value(0.4)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue:         1,
          duration:        800,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue:         0.4,
          duration:        800,
          useNativeDriver: false,
        }),
      ])
    ).start()
  }, [])

  return (
    <Animated.View
      style={[
        {
          width:           width as DimensionValue,
          height,
          borderRadius:    radius,
          backgroundColor: theme.borderColor.val,
          opacity,
        },
        style,
      ]}
    />
  )
}