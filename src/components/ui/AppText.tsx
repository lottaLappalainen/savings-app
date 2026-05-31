import { Text, TextProps } from 'react-native'
import { useTheme } from 'tamagui'

type Variant = 'heading' | 'subheading' | 'body' | 'muted' | 'caption' | 'amount'

type Props = TextProps & {
  variant?: Variant
  children: React.ReactNode
}

export function AppText({ variant = 'body', style, children, ...props }: Props) {
  const theme = useTheme()

  const styles: Record<Variant, object> = {
    heading: {
      fontSize:   26,
      fontWeight: '700',
      color:      theme.color.val,
    },
    subheading: {
      fontSize:   18,
      fontWeight: '600',
      color:      theme.color.val,
    },
    body: {
      fontSize: 15,
      color:    theme.color.val,
    },
    muted: {
      fontSize: 13,
      color:    theme.colorMuted.val,
    },
    caption: {
      fontSize: 11,
      color:    theme.colorMuted.val,
    },
    amount: {
      fontSize:   38,
      fontWeight: '700',
      color:      theme.primary.val,
    },
  }

  return (
    <Text {...props} style={[styles[variant], style]}>
      {children}
    </Text>
  )
}