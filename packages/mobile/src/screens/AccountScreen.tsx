import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { mobileApi, MobileOrder } from "../api/client";

export default function AccountScreen() {
  const [orders, setOrders] = useState<MobileOrder[]>([]);
  const [activeTab, setActiveTab] = useState<"semua" | "dikemas" | "dikirim">("semua");

  useEffect(() => {
    mobileApi.getOrders().then(setOrders);
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "dikemas") return o.status === "DIKEMAS";
    if (activeTab === "dikirim") return o.status === "DIKIRIM";
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
          }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>Siti Rahmawati</Text>
          <Text style={styles.userEmail}>siti.rahmawati@gmail.com</Text>
          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>👑 Rahayu Gold Member</Text>
            <Text style={styles.pointsText}>• 1.250 Poin</Text>
          </View>
        </View>
      </View>

      {/* Orders Tracking Header */}
      <View style={styles.ordersSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pesanan Saya (Lacak Resi Live)</Text>
        </View>

        {/* Status Filter Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            onPress={() => setActiveTab("semua")}
            style={[styles.tabBtn, activeTab === "semua" && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, activeTab === "semua" && styles.tabTextActive]}>
              Semua
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("dikirim")}
            style={[styles.tabBtn, activeTab === "dikirim" && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, activeTab === "dikirim" && styles.tabTextActive]}>
              Dalam Pengiriman
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("dikemas")}
            style={[styles.tabBtn, activeTab === "dikemas" && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, activeTab === "dikemas" && styles.tabTextActive]}>
              Sedang Dikemas
            </Text>
          </TouchableOpacity>
        </View>

        {/* Order Cards List with Tokopedia-Style AWB Tracking */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
          {filteredOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderCardHeader}>
                <View>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderDate}>{order.createdAt}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    order.status === "DIKIRIM"
                      ? styles.statusBadgeDelivering
                      : order.status === "SELESAI"
                      ? styles.statusBadgeSuccess
                      : styles.statusBadgeWarning,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      order.status === "DIKIRIM"
                        ? styles.statusTextDelivering
                        : order.status === "SELESAI"
                        ? styles.statusTextSuccess
                        : styles.statusTextWarning,
                    ]}
                  >
                    {order.status === "DIKIRIM"
                      ? "SEDANG DIKIRIM"
                      : order.status === "SELESAI"
                      ? "SELESAI"
                      : "MENUNGGU BAYAR"}
                  </Text>
                </View>
              </View>

              {/* Courier & AWB Tracking Info */}
              {order.awb ? (
                <View style={styles.awbContainer}>
                  <Text style={styles.awbCourier}>{order.courierName}</Text>
                  <Text style={styles.awbNumber}>No. Resi: {order.awb}</Text>
                  <Text style={styles.awbTrackingTip}>Paket dalam perjalanan menuju alamat Anda</Text>
                </View>
              ) : null}

              {/* Order Total & Action */}
              <View style={styles.orderCardFooter}>
                <View>
                  <Text style={styles.totalLabel}>Total Belanja</Text>
                  <Text style={styles.totalAmount}>
                    Rp {order.totalAmount.toLocaleString("id-ID")}
                  </Text>
                </View>
                <TouchableOpacity style={styles.detailBtn}>
                  <Text style={styles.detailBtnText}>Lacak Paket</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 14 },
  profileInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: "700", color: "#18181B" },
  userEmail: { fontSize: 12, color: "#71717A", marginTop: 2 },
  tierBadge: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  tierText: { fontSize: 11, fontWeight: "700", color: "#B45309" },
  pointsText: { fontSize: 11, color: "#71717A", marginLeft: 4 },
  ordersSection: { flex: 1, padding: 16 },
  sectionHeader: { marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#18181B" },
  tabRow: { flexDirection: "row", marginBottom: 12 },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F4F4F5",
    marginRight: 8,
  },
  tabBtnActive: { backgroundColor: "#18181B" },
  tabText: { fontSize: 11, fontWeight: "600", color: "#52525B" },
  tabTextActive: { color: "#FFFFFF" },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    padding: 14,
    marginBottom: 12,
  },
  orderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  orderId: { fontSize: 12, fontWeight: "700", color: "#18181B" },
  orderDate: { fontSize: 10, color: "#71717A", marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusBadgeDelivering: { backgroundColor: "#DBEAFE" },
  statusBadgeSuccess: { backgroundColor: "#DCFCE7" },
  statusBadgeWarning: { backgroundColor: "#FEF3C7" },
  statusBadgeText: { fontSize: 9, fontWeight: "800" },
  statusTextDelivering: { color: "#1D4ED8" },
  statusTextSuccess: { color: "#15803D" },
  statusTextWarning: { color: "#B45309" },
  awbContainer: {
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  awbCourier: { fontSize: 11, fontWeight: "700", color: "#0F172A" },
  awbNumber: { fontSize: 11, fontWeight: "600", color: "#3B82F6", marginTop: 2 },
  awbTrackingTip: { fontSize: 10, color: "#64748B", marginTop: 2 },
  orderCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F4F4F5",
    paddingTop: 10,
  },
  totalLabel: { fontSize: 10, color: "#71717A" },
  totalAmount: { fontSize: 14, fontWeight: "800", color: "#7C3AED" },
  detailBtn: {
    borderWidth: 1,
    borderColor: "#18181B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  detailBtnText: { fontSize: 11, fontWeight: "700", color: "#18181B" },
});
