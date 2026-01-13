import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, Pressable } from 'react-native' // Tambah Modal & Pressable
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { useBalance } from './_layout'

export default function ProductDetail() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { balance, setBalance, ownedProducts, setOwnedProducts } = useBalance()
  
  // full screen
  const [modalVisible, setModalVisible] = useState(false)
  
  const isOwned = ownedProducts.some((p: any) => p.id === params.id)
  const productPrice = Number(params.price)

  const handleBuy = () => {
    if (balance >= productPrice) {
      setBalance(balance - productPrice)
      setOwnedProducts([...ownedProducts, { id: params.id, title: params.title, price: productPrice, image: params.image }])
      Alert.alert("Success!", "Product purchased!")
    } else {
      Alert.alert("Oops!", "Insufficient coins.")
    }
  }

  const handleSell = () => {
    setBalance(balance + productPrice)
    setOwnedProducts(ownedProducts.filter((p: any) => p.id !== params.id))
    Alert.alert("Sold!", "Coins added back to your balance.")
  }

  return (
    <View style={styles.container}>
      
      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.fullscreenContainer}>
          {/* close */}
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close-circle" size={40} color="#fff" />
          </TouchableOpacity>
          
          <Image 
            source={{ uri: params.image as string }} 
            style={styles.fullscreenImage} 
            resizeMode="contain" 
          />
        </View>
      </Modal>

      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* click */}
        <Pressable onPress={() => setModalVisible(true)}>
          <Image 
            source={{ uri: params.image as string }} 
            style={styles.productImage} 
            resizeMode="contain" 
          />
          <View style={styles.zoomHint}>
            <Ionicons name="expand-outline" size={16} color="#999" />
            <Text style={styles.zoomText}>Tap to enlarge</Text>
          </View>
        </Pressable>
        
        <View style={styles.content}>
          <Text style={styles.category}>Official Storegg</Text>
          <Text style={styles.productTitle}>{params.title}</Text>
          
          <View style={styles.balanceBox}>
            <Text style={styles.balanceLabel}>Price:</Text>
            <Text style={styles.balanceText}>🪙 {productPrice}</Text>
          </View>
        </View>
      </ScrollView>

      {/* footer */}
      <View style={styles.footer}>
        {!isOwned ? (
          <TouchableOpacity style={styles.buyBtn} onPress={handleBuy}>
            <Text style={styles.buyBtnText}>Buy Now</Text>
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.ownedBadge}>
              <Ionicons name="checkmark-circle" size={18} color="#4B5563" />
              <Text style={styles.ownedText}>Already Owned</Text>
            </View>
            <TouchableOpacity style={styles.sellBtn} onPress={handleSell}>
              <Text style={styles.sellBtnText}>Sell Product</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  productImage: { width: '100%', height: 350 },
  zoomHint: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: -20, marginBottom: 10 },
  zoomText: { fontSize: 12, color: '#999', marginLeft: 4 },
  content: { padding: 20 },
  category: { color: '#9CA3AF', fontSize: 14 },
  productTitle: { fontSize: 22, fontWeight: 'bold', marginVertical: 8 },
  balanceBox: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, marginTop: 20 },
  balanceLabel: { color: '#4B5563' },
  balanceText: { fontWeight: 'bold', fontSize: 18 },
  footer: { padding: 20, paddingBottom: 30 },
  buyBtn: { backgroundColor: '#1F2937', padding: 16, borderRadius: 12, alignItems: 'center' },
  buyBtnText: { color: '#fff', fontWeight: 'bold' },
  ownedBadge: { flexDirection: 'row', backgroundColor: '#F3F4F6', padding: 14, borderRadius: 12, justifyContent: 'center', marginBottom: 12 },
  ownedText: { marginLeft: 8, color: '#4B5563' },
  sellBtn: { backgroundColor: '#4B5563', padding: 16, borderRadius: 12, alignItems: 'center' },
  sellBtnText: { color: '#fff', fontWeight: 'bold' },
  
  // STYLES UNTUK FULLSCREEN
  fullscreenContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  fullscreenImage: { width: '100%', height: '80%' },
  closeButton: { position: 'absolute', top: 50, right: 20, zIndex: 1 },
})