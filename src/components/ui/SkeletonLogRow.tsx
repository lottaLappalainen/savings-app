import { View } from 'react-native'
import { useTheme } from 'tamagui'
import { Skeleton } from './Skeleton'

export function SkeletonLogRow() {
  const theme = useTheme()
  return (
    <View style={{
      backgroundColor:   theme.backgroundHover.val,
      borderRadius:      12,
      borderWidth:       0.5,
      borderColor:       theme.borderColor.val,
      paddingVertical:   10,
      paddingHorizontal: 14,
      flexDirection:     'row',
      alignItems:        'center',
      gap:               10,
    }}>
      <Skeleton width={60} height={20} radius={6} />
      <View style={{ flex: 1, gap: 6 }}>
        <Skeleton width="70%" height={14} radius={6} />
        <Skeleton width="40%" height={10} radius={4} />
      </View>
    </View>
  )
}