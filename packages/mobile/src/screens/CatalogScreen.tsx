import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";
import { mobileApi, MobileProduct, MobileCategory } from "../api/client";

export default function CatalogScreen({ route }: any) {
  const initialCategory = route?.params?.category || "all";
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [categories, setCategories] = useState<MobileCategory[]>([]);
  const [products, setProducts] = useState<MobileProduct[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    mobileApi.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    mobileApi.getProducts(selectedCategory).then(setProducts);
  }, [selectedCategory]);

  const filteredProducts = products.filter((p) =>
    search ? p.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TextInput
          placeholder="Cari hijab voal, tunik silk, dress..."
          placeholderTextColor="#A1A1AA"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Category Horizontal Filter Tabs */}
      <View style={styles.tabsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: "all", nameId: "Semua Kategori" } as any, ...categories]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.id;
            return (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item.id)}
                style={[styles.tabBtn, isSelected && styles.tabBtnActive]}
              >
                <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                  {item.nameId}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        />
      </View>

      {/* Catalog Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada produk ditemukan</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productCard}>
            <Image
              source={{
                uri:
                  item.imageUrl ||
                  "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=400&q=80",
              }}
              style={styles.productImg}
            />
            {item.promoBadge ? (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{item.promoBadge}</Text>
              </View>
            ) : null}
            <View style={styles.productInfo}>
              <Text style={styles.productCategory}>{item.category}</Text>
              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.productPrice}>
                Rp {item.priceIdr.toLocaleString("id-ID")}
              </Text>
              <Text style={styles.stockText}>Stok: {item.stock} pcs</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  searchHeader: {
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
  },
  searchInput: {
    backgroundColor: "#F4F4F5",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: "#18181B",
  },
  tabsContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F4F4F5",
    marginHorizontal: 4,
  },
  tabBtnActive: { backgroundColor: "#18181B" },
  tabText: { fontSize: 11, fontWeight: "600", color: "#52525B" },
  tabTextActive: { color: "#FFFFFF" },
  listContent: { padding: 12 },
  emptyContainer: { padding: 40, alignItems: "center" },
  emptyText: { fontSize: 13, color: "#71717A" },
  productCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    marginBottom: 12,
    overflow: "hidden",
  },
  productImg: { width: "100%", height: 160 },
  badgeContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#BE185D",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: { fontSize: 9, fontWeight: "700", color: "#FFFFFF" },
  productInfo: { padding: 10 },
  productCategory: { fontSize: 10, color: "#71717A", marginBottom: 2 },
  productName: { fontSize: 12, fontWeight: "600", color: "#18181B", marginBottom: 6, height: 32 },
  productPrice: { fontSize: 13, fontWeight: "700", color: "#7C3AED", marginBottom: 2 },
  stockText: { fontSize: 10, color: "#10B981", fontWeight: "600" },
});
