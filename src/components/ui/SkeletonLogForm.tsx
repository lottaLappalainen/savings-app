import { View } from 'react-native'
import { useTheme } from 'tamagui'
import { Skeleton } from './Skeleton'

export function SkeletonLogForm() {
  const theme = useTheme()
  return (
    <View style={{
      backgroundColor: theme.backgroundHover.val,
      borderRadius:    16,
      borderWidth:     0.5,
      borderColor:     theme.borderColor.val,
      padding:         16,
      gap:             12,
    }}>
      <Skeleton width="100%" height={40} radius={10} />
      <Skeleton width="100%" height={56} radius={10} />
      <Skeleton width="100%" height={44} radius={10} />
      <Skeleton width="100%" height={44} radius={10} />
      <Skeleton width="100%" height={48} radius={10} />
    </View>
  )
}