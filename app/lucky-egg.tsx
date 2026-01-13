import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence, 
  withTiming,
  interpolate
} from 'react-native-reanimated'
import { useBalance } from './_layout'  //glob var

export default function LuckyEgg() {
  const router = useRouter()
  const { balance, setBalance } = useBalance() 
  const [isOpened, setIsOpened] = useState(false)
  const [currentReward, setCurrentReward] = useState<number | null>(null)

  // animation
  const scale = useSharedValue(1)
  const shake = useSharedValue(0)
  const rewardOpacity = useSharedValue(0)
  const rewardY = useSharedValue(0)

  const rewards = [10, 25, 50]

  // egg
  const animatedEggStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: shake.value }
      ],
    }
  })

  // coins
  const animatedRewardStyle = useAnimatedStyle(() => {
    return {
      opacity: rewardOpacity.value,
      transform: [{ translateY: rewardY.value }]
    }
  })

  const tapEgg = () => {
    if (!isOpened) {
      // effects
      shake.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      )

      // 2. random
      const reward = rewards[Math.floor(Math.random() * rewards.length)]
      setCurrentReward(reward)
      setBalance(balance + reward)  
      setIsOpened(true)

      // 3. anm
      rewardOpacity.value = withTiming(1, { duration: 500 })
      rewardY.value = withSpring(-100)
      scale.value = withSpring(1.2) 
    } else {
      
      setIsOpened(false)
      setCurrentReward(null)
      rewardOpacity.value = withTiming(0)
      rewardY.value = withTiming(0)
      scale.value = withSpring(1)
    }
  }

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Lucky Egg</Text>
        <View style={styles.coinBox}>
           <Text style={styles.coinText}>🪙 {balance}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.mainText}>Tap the egg to win coins!</Text>
        <Text style={styles.subText}>You can win 10, 25, or 50 coins</Text>

        {/* egg container */}
        <TouchableOpacity 
          activeOpacity={0.9} 
          style={styles.eggContainer} 
          onPress={tapEgg}
        >
          <Animated.View style={[styles.eggWrapper, animatedEggStyle]}>
            <Image 
              source={isOpened ? require('../assets/Opened_Egg.png') : require('../assets/Egg.png')} 
              style={styles.eggImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* badge */}
          <Animated.View style={[styles.rewardBadge, animatedRewardStyle]}>
            <Text style={styles.sparkle}>✨</Text>
            <Text style={styles.rewardBadgeText}>+{currentReward} coins!</Text>
            <Text style={styles.sparkle}>✨</Text>
          </Animated.View>
        </TouchableOpacity>

        {isOpened && (
          <Text style={styles.tapHint}>👆 Tap again for a new egg!</Text>
        )}

        <View style={styles.rewardBox}>
          <Text style={styles.rewardTitle}>Possible Rewards</Text>
          <View style={styles.rewardRow}>
            {rewards.map((r) => (
              <View key={r} style={styles.rewardItem}>
                <Text style={{ fontWeight: '600' }}>🪙 {r}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7F9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 50, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold' },
  coinBox: { backgroundColor: '#1F2937', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  coinText: { color: '#fff', fontWeight: 'bold' },
  content: { alignItems: 'center', padding: 20, flex: 1 },
  mainText: { fontSize: 22, fontWeight: 'bold', marginTop: 40, color: '#1F2937' },
  subText: { color: '#6B7280', marginTop: 8, fontSize: 16 },
  eggContainer: { width: 250, height: 350, justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  eggWrapper: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  eggImage: { width: 220, height: 220 },
  rewardBadge: { position: 'absolute', backgroundColor: '#FFD700', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, flexDirection: 'row', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
  rewardBadgeText: { fontWeight: '900', fontSize: 20, color: '#333', marginHorizontal: 8 },
  sparkle: { fontSize: 20 },
  tapHint: { color: '#4B5563', marginBottom: 20, fontSize: 16, fontWeight: '500' },
  rewardBox: { backgroundColor: '#fff', padding: 24, borderRadius: 20, width: '100%', alignItems: 'center', marginTop: 'auto', marginBottom: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  rewardTitle: { fontWeight: '700', marginBottom: 15, color: '#374151', fontSize: 16 },
  rewardRow: { flexDirection: 'row', gap: 15 },
  rewardItem: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 15, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB' },
})