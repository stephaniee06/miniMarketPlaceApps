import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { useBalance } from './_layout'

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export default function Home() {
  const router = useRouter()
 
  const { balance, theme, isDark, toggleTheme } = useBalance();
  
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [isGridView, setIsGridView] = useState(true)

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Gagal mengambil data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.title, { color: theme.text }]}>Storegg</Text>
          
          {/* theme */}
          <TouchableOpacity onPress={toggleTheme} style={{ marginLeft: 12 }}>
            <Ionicons 
              name={isDark ? "sunny" : "moon"} 
              size={22} 
              color={isDark ? "#FBBF24" : "#4B5563"} 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.coinBox, { backgroundColor: theme.card }]} 
          onPress={() => router.push('/lucky-egg')}
        >
          <Ionicons name="wallet-outline" size={16} color={theme.text} />
          <Text style={[styles.coinText, { color: theme.text }]}>{balance}</Text> 
        </TouchableOpacity>
      </View>

      {/* search */}
      <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
        <Ionicons name="search" size={18} color="#999" />
        <TextInput 
          placeholder="Search products..." 
          placeholderTextColor="#999"
          style={[styles.searchInput, { color: theme.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* action */}
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.myProductBtn} 
          onPress={() => router.push('/my-products')}
        >
          <Ionicons name="cube-outline" size={16} color="#fff" />
          <Text style={styles.myProductText}>My Products</Text>
        </TouchableOpacity>

        <View style={[styles.toggleContainer, { backgroundColor: theme.border }]}>
          <TouchableOpacity 
            style={[styles.toggleBtn, isGridView && styles.toggleBtnActive]} 
            onPress={() => setIsGridView(true)}
          >
            <Ionicons name="grid" size={20} color={isGridView ? "#fff" : "#666"} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, !isGridView && styles.toggleBtnActive]} 
            onPress={() => setIsGridView(false)}
          >
            <Ionicons name="list" size={20} color={!isGridView ? "#fff" : "#666"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* lsits */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          key={isGridView ? 'grid' : 'list'}
          data={filteredProducts}
          numColumns={isGridView ? 2 : 1}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => router.push({
                pathname: '/product-detail',
                params: { 
                  id: item.id.toString(), 
                  title: item.title, 
                  price: Math.floor(item.price), 
                  image: item.image 
                }
              })}
              style={[
                isGridView ? styles.cardGrid : styles.cardList, 
                { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }
              ]}
            >
              <Image source={{ uri: item.image }} style={isGridView ? styles.imageGrid : styles.imageList} resizeMode="contain" />
              <View style={!isGridView && { flex: 1, marginLeft: 12 }}>
                <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>{item.title}</Text>
                <Text style={[styles.price, { color: theme.text + 'CC' }]}>🪙 {Math.floor(item.price)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold' },
  coinBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, elevation: 2 },
  coinText: { marginLeft: 6, fontWeight: 'bold' },
  searchBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, marginVertical: 12 },
  searchInput: { marginLeft: 8, flex: 1 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  myProductBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F2937', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  myProductText: { color: '#fff', marginLeft: 6, fontWeight: '600' },
  toggleContainer: { flexDirection: 'row', borderRadius: 8, padding: 2 },
  toggleBtn: { padding: 6, borderRadius: 6 },
  toggleBtnActive: { backgroundColor: '#1F2937' },
  cardGrid: { flex: 1, margin: 6, borderRadius: 14, padding: 10 },
  imageGrid: { width: '100%', height: 120, borderRadius: 10, marginBottom: 6 },
  cardList: { flexDirection: 'row', marginBottom: 10, borderRadius: 14, padding: 12, alignItems: 'center' },
  imageList: { width: 80, height: 80, borderRadius: 10 },
  name: { fontWeight: '600', fontSize: 14 },
  price: { marginTop: 4, fontWeight: '500' },
})