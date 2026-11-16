import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import { mobileApi, MobileProduct, MobileCategory } from "../api/client";

export default function HomeScreen({ navigation }: any) {
  const [products, setProducts] = useState<MobileProduct[]>([]);
  const [categories, setCategories] = useState<MobileCategory[]>([]);

  useEffect(() => {
    mobileApi.getProducts().then(setProducts);
    mobileApi.getCategories().then(setCategories);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar with Editorial Brand & TikTok Live Indicator */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>RAHAYU</Text>
          <Text style={styles.brandSubtitle}>MODEST FASHION STORE</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE TIKTOK</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Editorial Hero Banner */}
        <View style={styles.heroBanner}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
            }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTag}>KOLEKSI RAYA & MODEST 2026</Text>
            <Text style={styles.heroHeading}>Elegansi Kesederhanaan Busana Muslimah</Text>
            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() => navigation?.navigate("Katalog")}
            >
              <Text style={styles.heroBtnText}>JELAJAHI KOLEKSI</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 11 Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>11 Kategori Resmi</Text>
          <Text style={styles.sectionSubtitle}>Pilihan lengkap modest, maternity & anak</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => navigation?.navigate("Katalog", { category: cat.id })}
            >
              <Image
                source={{
                  uri:
                    cat.imageUrl ||
                    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=200&q=80",
                }}
                style={styles.categoryIcon}
              />
              <Text style={styles.categoryName} numberOfLines={2}>
                {cat.nameId}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Promo Highlight Banner */}
        <View style={styles.promoHighlight}>
          <View style={styles.promoHeader}>
            <Text style={styles.promoTag}>VOUCHER: RAHAYUPAYDAY</Text>
            <Text style={styles.countdownText}>Sisa 06:42:19</Text>
          </View>
          <Text style={styles.promoTitle}>Promo Highlight Gajian — Diskon s/d 35%</Text>
          <Text style={styles.promoDesc}>
            Gratis Ongkir se-Indonesia dengan minimum belanja Rp 100.000.
          </Text>
        </View>

        {/* Featured Products Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Produk Terlaris</Text>
          <Text style={styles.sectionSubtitle}>Pilihan favorit muslimah Indonesia</Text>
        </View>

        <View style={styles.productGrid}>
          {products.map((item) => (
            <TouchableOpacity key={item.id} style={styles.productCard}>
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
                <View style={styles.ratingRow}>
                  <Text style={styles.ratingText}>★ {item.rating.toFixed(1)}</Text>
                  <Text style={styles.soldText}>• {item.reviewCount} ulasan</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
  },
  brandTitle: { fontSize: 18, fontWeight: "800", color: "#18181B", letterSpacing: 2 },
  brandSubtitle: { fontSize: 9, color: "#71717A", letterSpacing: 1 },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE4E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#E11D48", marginRight: 6 },
  liveText: { fontSize: 10, fontWeight: "700", color: "#E11D48" },
  heroBanner: { height: 200, margin: 16, borderRadius: 16, overflow: "hidden", position: "relative" },
  heroImage: { width: "100%", height: "100%" },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(24, 24, 27, 0.45)",
    padding: 16,
    justifyContent: "flex-end",
  },
  heroTag: { fontSize: 10, fontWeight: "700", color: "#F472B6", letterSpacing: 1, marginBottom: 4 },
  heroHeading: { fontSize: 16, fontWeight: "700", color: "#FFFFFF", marginBottom: 10 },
  heroBtn: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  heroBtnText: { fontSize: 11, fontWeight: "800", color: "#18181B", letterSpacing: 1 },
  sectionHeader: { paddingHorizontal: 16, marginTop: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#18181B" },
  sectionSubtitle: { fontSize: 12, color: "#71717A" },
  categoryScroll: { paddingHorizontal: 12, paddingVertical: 8 },
  categoryCard: {
    width: 80,
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  categoryIcon: { width: 50, height: 50, borderRadius: 25, marginBottom: 6 },
  categoryName: { fontSize: 10, fontWeight: "600", color: "#27272A", textAlign: "center" },
  promoHighlight: {
    margin: 16,
    backgroundColor: "#18181B",
    borderRadius: 12,
    padding: 16,
  },
  promoHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  promoTag: { fontSize: 10, fontWeight: "700", color: "#F472B6" },
  countdownText: { fontSize: 10, fontWeight: "700", color: "#FDE047" },
  promoTitle: { fontSize: 14, fontWeight: "700", color: "#FFFFFF", marginBottom: 4 },
  promoDesc: { fontSize: 11, color: "#A1A1AA" },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
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
  productPrice: { fontSize: 13, fontWeight: "700", color: "#7C3AED", marginBottom: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 11, fontWeight: "700", color: "#EAB308", marginRight: 4 },
  soldText: { fontSize: 10, color: "#71717A" },
});
