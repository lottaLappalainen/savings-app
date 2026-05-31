import { View } from 'react-native'
import { useTheme } from 'tamagui'
import { Skeleton } from './Skeleton'

export function SkeletonGoalWidget() {
  const theme = useTheme()
  return (
    <View style={{ gap: 16 }}>
      {/* Total saved skeleton */}
      <View style={{ alignItems: 'center', paddingVertical: 8, gap: 8 }}>
        <Skeleton width={80} height={14} radius={6} />
        <Skeleton width={180} height={64} radius={12} />
      </View>

      {/* Goal card skeleton */}
      <View style={{
        backgroundColor: theme.backgroundHover.val,
        borderRadius:    16,
        borderWidth:     0.5,
        borderColor:     theme.borderColor.val,
        padding:         16,
        gap:             12,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ gap: 6 }}>
            <Skeleton width={80}  height={10} radius={4} />
            <Skeleton width={140} height={16} radius={6} />
          </View>
          <Skeleton width={70} height={10} radius={4} />
        </View>
        <Skeleton width="100%" height={6} radius={99} />
        <Skeleton width={160} height={32} radius={8} style={{ alignSelf: 'center' }} />
      </View>
    </View>
  )
}