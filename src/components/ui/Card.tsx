import { View, ViewProps } from 'react-native'
import { useTheme } from 'tamagui'

type Props = ViewProps & {
  children: React.ReactNode
  padded?: boolean
}

export function Card({ children, padded = true, style, ...props }: Props) {
  const theme = useTheme()
  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: theme.backgroundHover.val,
          borderRadius:    16,
          borderWidth:     0.5,
          borderColor:     theme.borderColor.val,
          padding:         padded ? 16 : 0,
          overflow:        'hidden',
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}