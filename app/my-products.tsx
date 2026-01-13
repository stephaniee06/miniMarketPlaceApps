import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useBalance } from './_layout';  

export default function MyProducts() {
  const router = useRouter();
  const { ownedProducts } = useBalance();  

   
  const totalValue = ownedProducts.reduce((sum: number, item: any) => sum + item.price, 0);

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Products</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* summary */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Items:</Text>
          <Text style={styles.summaryValue}>{ownedProducts.length}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Value:</Text>
          <Text style={styles.summaryValue}>🪙 {totalValue} coins</Text>
        </View>
      </View>

      {/* products */}
      <FlatList
        data={ownedProducts}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            // nav back
            onPress={() => router.push({
              pathname: '/product-detail',
              params: { 
                id: item.id, 
                title: item.title, 
                price: item.price, 
                image: item.image 
              }
            })}
          >
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
            <Text style={styles.name} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.price}>🪙 {item.price}</Text>
            <View style={styles.ownedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#4B5563" />
              <Text style={styles.ownedText}>Owned</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={50} color="#D1D5DB" />
            <Text style={styles.empty}>You don't own any products yet.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7F9', padding: 16, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  summaryBox: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#E5E7EB', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: '#6B7280', fontWeight: '500' },
  summaryValue: { fontWeight: 'bold', color: '#111827' },
  card: { flex: 0.5, backgroundColor: '#fff', margin: 6, borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  image: { width: '100%', height: 100, marginBottom: 8 },
  name: { fontWeight: '600', fontSize: 13, textAlign: 'center', color: '#1F2937' },
  price: { color: '#4B5563', fontSize: 12, marginVertical: 4, fontWeight: '500' },
  ownedBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ownedText: { fontSize: 11, color: '#4B5563', marginLeft: 4, fontWeight: '500' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  empty: { textAlign: 'center', marginTop: 10, color: '#9CA3AF', fontSize: 14 }
});