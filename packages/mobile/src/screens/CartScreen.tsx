import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

interface CartItem {
  id: string;
  name: string;
  size: string;
  color: string;
  price: number;
  qty: number;
  imageUrl: string;
}

export default function CartScreen({ navigation }: any) {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: "item-1",
      name: "Amira Armani Silk Tunic — Royal Plum",
      size: "M (LD 100)",
      color: "Royal Plum",
      price: 249000,
      qty: 1,
      imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "item-2",
      name: "Signature Voal Ultrafine Laser Cut Scarf",
      size: "115x115 cm",
      color: "Dusty Lilac",
      price: 119000,
      qty: 1,
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80",
    },
  ]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 10000;
  const discount = 30000;
  const total = subtotal + shipping - discount;

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Keranjang Belanja ({items.length})</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.itemVariant}>
                Varian: {item.size} • {item.color}
              </Text>
              <Text style={styles.itemPrice}>
                Rp {item.price.toLocaleString("id-ID")}
              </Text>

              <View style={styles.qtyRow}>
                <TouchableOpacity
                  onPress={() => updateQty(item.id, -1)}
                  style={styles.qtyBtn}
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.qty}</Text>
                <TouchableOpacity
                  onPress={() => updateQty(item.id, 1)}
                  style={styles.qtyBtn}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Voucher Promo Row */}
        <View style={styles.voucherCard}>
          <Text style={styles.voucherBadge}>VOUCHER AKTIF</Text>
          <Text style={styles.voucherText}>RAHAYUPAYDAY (Hemat Rp 30.000)</Text>
        </View>

        {/* Price Breakdown */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Ringkasan Belanja</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Harga ({items.length} Barang)</Text>
            <Text style={styles.summaryValue}>Rp {subtotal.toLocaleString("id-ID")}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ongkos Kirim (JNE Reguler)</Text>
            <Text style={styles.summaryValue}>Rp {shipping.toLocaleString("id-ID")}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: "#E11D48" }]}>Diskon Voucher</Text>
            <Text style={[styles.summaryValue, { color: "#E11D48" }]}>
              -Rp {discount.toLocaleString("id-ID")}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Tagihan</Text>
            <Text style={styles.totalValue}>Rp {total.toLocaleString("id-ID")}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Total Pembayaran</Text>
          <Text style={styles.bottomPrice}>Rp {total.toLocaleString("id-ID")}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutBtnText}>CHECKOUT SEKARANG</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#18181B" },
  content: { padding: 16, paddingBottom: 100 },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    padding: 12,
    marginBottom: 12,
  },
  itemImage: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  itemDetails: { flex: 1, justifyContent: "space-between" },
  itemName: { fontSize: 13, fontWeight: "600", color: "#18181B" },
  itemVariant: { fontSize: 11, color: "#71717A", marginTop: 2 },
  itemPrice: { fontSize: 13, fontWeight: "700", color: "#7C3AED", marginTop: 4 },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#F4F4F5",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: { fontSize: 14, fontWeight: "700", color: "#18181B" },
  qtyText: { marginHorizontal: 12, fontSize: 13, fontWeight: "600" },
  voucherCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDF2F8",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FBCFE8",
    marginBottom: 16,
  },
  voucherBadge: {
    fontSize: 9,
    fontWeight: "700",
    color: "#BE185D",
    backgroundColor: "#FCE7F3",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  voucherText: { fontSize: 11, fontWeight: "600", color: "#9D174D" },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    padding: 16,
  },
  summaryTitle: { fontSize: 14, fontWeight: "700", color: "#18181B", marginBottom: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryLabel: { fontSize: 12, color: "#71717A" },
  summaryValue: { fontSize: 12, fontWeight: "600", color: "#18181B" },
  totalRow: { borderTopWidth: 1, borderTopColor: "#E4E4E7", paddingTop: 10, marginTop: 4 },
  totalLabel: { fontSize: 14, fontWeight: "700", color: "#18181B" },
  totalValue: { fontSize: 15, fontWeight: "800", color: "#7C3AED" },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E4E4E7",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bottomLabel: { fontSize: 10, color: "#71717A" },
  bottomPrice: { fontSize: 16, fontWeight: "800", color: "#7C3AED" },
  checkoutBtn: {
    backgroundColor: "#18181B",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkoutBtnText: { fontSize: 12, fontWeight: "800", color: "#FFFFFF", letterSpacing: 0.5 },
});
