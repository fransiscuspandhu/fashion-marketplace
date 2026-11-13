"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  User as UserIcon,
  PackageCheck,
  MapPin,
  Heart,
  Settings,
  LogOut,
  Truck,
  ExternalLink,
  Copy,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Plus,
  ShieldCheck,
  AlertCircle,
  X,
} from "lucide-react";
import { useStore, OrderRecord, OrderStatus, TrackingStep, CustomerAddress } from "@/context/StoreContext";
import HeaderNavbar from "@/components/HeaderNavbar";
import Footer from "@/components/Footer";

function ProfileContent() {
  const searchParams = useSearchParams();
  const defaultTab = (searchParams.get("tab") as "orders" | "address" | "wishlist" | "settings") || "orders";

  const { user, isLoggedIn, logout, orders, addToCart, updateUserAddresses } = useStore();
  const [activeTab, setActiveTab] = useState<"orders" | "address" | "wishlist" | "settings">(defaultTab);
  const [orderFilter, setOrderFilter] = useState<string>("ALL");

  // Tracking Modal
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<OrderRecord | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Address form modal
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newRecipient, setNewRecipient] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newPostal, setNewPostal] = useState("");

  if (!isLoggedIn || !user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-zinc-200 rounded-lg shadow-sm text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
          <UserIcon className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-zinc-900 mb-2">Halaman Profil Pelanggan</h1>
        <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
          Silakan masuk terlebih dahulu untuk melihat histori transaksi pesanan, nomor resi kurir, dan alamat tersimpan.
        </p>
        <Link
          href="/login?redirect=/profile"
          className="inline-block w-full py-3 bg-[#18181B] hover:bg-purple-900 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-md"
        >
          Masuk ke Akun Anda
        </Link>
      </div>
    );
  }

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (orderFilter === "ALL") return true;
    return order.status === orderFilter;
  });

  const handleCopyAwb = (awbText: string) => {
    navigator.clipboard.writeText(awbText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: CustomerAddress = {
      id: `ADDR-${Date.now()}`,
      label: newLabel || "Alamat Tambahan",
      recipient: newRecipient,
      phone: newPhone,
      fullAddress: newAddress,
      city: newCity,
      postalCode: newPostal,
      isDefault: false,
    };
    updateUserAddresses([...user.addresses, newAddr]);
    setIsAddAddressOpen(false);
    setNewLabel("");
    setNewRecipient("");
    setNewPhone("");
    setNewAddress("");
    setNewCity("");
    setNewPostal("");
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "MENUNGGU_PEMBAYARAN":
        return (
          <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 text-[11px] font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Menunggu Pembayaran
          </span>
        );
      case "DIKEMAS":
        return (
          <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-[11px] font-semibold flex items-center gap-1">
            <PackageCheck className="w-3 h-3" />
            Sedang Dikemas Seller
          </span>
        );
      case "DIKIRIM":
        return (
          <span className="px-2.5 py-1 rounded bg-purple-100 text-purple-800 text-[11px] font-semibold flex items-center gap-1">
            <Truck className="w-3 h-3 text-purple-700" />
            Dalam Pengiriman Kurir
          </span>
        );
      case "SELESAI":
        return (
          <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Pesanan Selesai
          </span>
        );
      case "DIBATALKAN":
        return (
          <span className="px-2.5 py-1 rounded bg-rose-100 text-rose-800 text-[11px] font-semibold">
            Dibatalkan
          </span>
        );
    }
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
        <Link href="/" className="hover:text-zinc-900">
          Beranda
        </Link>
        <span>/</span>
        <span className="text-zinc-900 font-medium">Akun Pelanggan (Tokopedia Flow)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar (Customer Card & Navigation) */}
        <div className="lg:col-span-4 space-y-6">
          {/* User Profile Card */}
          <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-2xs">
            <div className="flex items-center gap-4 pb-4 border-b border-zinc-100">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-700 to-pink-500 text-white flex items-center justify-center text-xl font-bold shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900">{user.name}</h2>
                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-800 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>{user.tier}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-1 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-zinc-50 p-2.5 rounded">
                <span className="block text-[10px] text-zinc-400 font-medium uppercase">
                  Rahayu Poin
                </span>
                <span className="font-extrabold text-zinc-900 text-sm">
                  {user.points.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="bg-zinc-50 p-2.5 rounded">
                <span className="block text-[10px] text-zinc-400 font-medium uppercase">
                  Total Transaksi
                </span>
                <span className="font-extrabold text-purple-700 text-sm">
                  {orders.length} Pesanan
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation Menu */}
          <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-2xs divide-y divide-zinc-100 text-xs">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left px-5 py-3.5 flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === "orders"
                  ? "bg-purple-50 text-purple-800 font-bold border-l-4 border-purple-700"
                  : "text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <PackageCheck className="w-4 h-4 text-purple-600" />
                <span>Daftar Transaksi Pesanan</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("address")}
              className={`w-full text-left px-5 py-3.5 flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === "address"
                  ? "bg-purple-50 text-purple-800 font-bold border-l-4 border-purple-700"
                  : "text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-zinc-500" />
                <span>Daftar Alamat Pengiriman</span>
              </div>
              <span className="text-[10px] text-zinc-400">{user.addresses.length} Alamat</span>
            </button>

            <button
              onClick={() => setActiveTab("wishlist")}
              className={`w-full text-left px-5 py-3.5 flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === "wishlist"
                  ? "bg-purple-50 text-purple-800 font-bold border-l-4 border-purple-700"
                  : "text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Wishlist Favorit Saya</span>
              </div>
              <span className="text-[10px] text-zinc-400">4 Produk</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full text-left px-5 py-3.5 flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === "settings"
                  ? "bg-purple-50 text-purple-800 font-bold border-l-4 border-purple-700"
                  : "text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-zinc-500" />
                <span>Pengaturan Akun & Keamanan</span>
              </div>
            </button>

            <button
              onClick={logout}
              className="w-full text-left px-5 py-3.5 flex items-center gap-3 text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-8">
          {/* TAB 1: DAFTAR TRANSAKSI (TOKOPEDIA-STYLE) */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-2xs">
                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wide mb-3">
                  Status Transaksi Belanja
                </h2>

                {/* Tokopedia-Style Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
                  {[
                    { label: "Semua", value: "ALL" },
                    { label: "Menunggu Pembayaran", value: "MENUNGGU_PEMBAYARAN" },
                    { label: "Dikemas", value: "DIKEMAS" },
                    { label: "Dikirim", value: "DIKIRIM" },
                    { label: "Selesai", value: "SELESAI" },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setOrderFilter(tab.value)}
                      className={`px-3 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition font-medium text-[11px] ${
                        orderFilter === tab.value
                          ? "bg-zinc-900 text-white font-bold"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Cards List */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center">
                    <PackageCheck className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-zinc-800">
                      Tidak Ada Pesanan dengan Status Ini
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 mb-4">
                      Belum ada transaksi di tab &quot;{orderFilter}&quot;.
                    </p>
                    <Link
                      href="/"
                      className="inline-block px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded hover:bg-purple-900"
                    >
                      Lihat Koleksi Belanja
                    </Link>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-zinc-200 rounded-lg p-5 shadow-2xs space-y-4"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100 text-xs">
                        <div className="flex items-center gap-3">
                          <ShoppingBag className="w-4 h-4 text-purple-700" />
                          <span className="font-bold text-zinc-900">Rahayu Official Store</span>
                          <span className="text-zinc-400">•</span>
                          <span className="text-zinc-500">{order.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(order.status)}
                          <span className="font-mono text-[11px] text-zinc-400">
                            {order.id}
                          </span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4 items-center">
                            <div className="w-16 h-20 bg-zinc-100 rounded overflow-hidden shrink-0 border border-zinc-200">
                              <img
                                src={`https://images.unsplash.com/photo-${1584917865442 + item.product.id * 1000}?auto=format&fit=crop&w=200&q=80`}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 text-xs">
                              <h4 className="font-bold text-zinc-900 leading-snug">
                                {item.product.name}
                              </h4>
                              <div className="text-zinc-500 mt-1 flex items-center gap-2">
                                <span className="bg-zinc-100 px-2 py-0.5 rounded text-[11px] font-medium text-zinc-700">
                                  {item.selectedSize}
                                </span>
                                <span>•</span>
                                <span>{item.selectedColor}</span>
                                <span>•</span>
                                <span>{item.quantity} barang</span>
                              </div>
                            </div>
                            <div className="text-right text-xs">
                              <span className="font-bold text-zinc-900 block text-sm">
                                Rp {(item.product.priceIdr * item.quantity).toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer & Actions */}
                      <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                        <div>
                          <span className="text-zinc-500 block text-[11px]">Total Belanja:</span>
                          <span className="font-bold text-sm text-zinc-900">
                            Rp {order.totalAmount.toLocaleString("id-ID")}
                          </span>
                          <span className="text-[10px] text-zinc-400 ml-2">
                            ({order.courier.name} - {order.paymentMethod.name})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Live Resi Tracking Button */}
                          {order.awb ? (
                            <button
                              onClick={() => setSelectedOrderForTracking(order)}
                              className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Lacak Paket ({order.awb})</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-zinc-400 italic">
                              Nomor resi akan muncul saat paket diserahkan ke kurir
                            </span>
                          )}

                          {order.status === "SELESAI" && (
                            <button
                              onClick={() => {
                                order.items.forEach((item) =>
                                  addToCart(item.product, item.selectedSize, item.selectedColor, 1)
                                );
                              }}
                              className="px-3 py-2 border border-zinc-300 hover:border-zinc-900 text-zinc-800 rounded text-xs font-semibold transition cursor-pointer"
                            >
                              Beli Lagi
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DAFTAR ALAMAT */}
          {activeTab === "address" && (
            <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
                  Daftar Alamat Pengiriman
                </h2>
                <button
                  onClick={() => setIsAddAddressOpen(true)}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-purple-900 text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Alamat Baru</span>
                </button>
              </div>

              <div className="space-y-3">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 border border-zinc-200 rounded-lg text-xs space-y-2 hover:border-purple-300 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900">{addr.recipient}</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-100 text-[10px] text-zinc-600 font-semibold">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded bg-purple-100 text-[10px] text-purple-800 font-bold">
                            Utama
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-zinc-600 font-mono text-[11px]">{addr.phone}</p>
                    <p className="text-zinc-800">{addr.fullAddress}</p>
                    <p className="text-zinc-500 text-[11px]">
                      {addr.city} • Kode Pos: {addr.postalCode}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wide border-b border-zinc-100 pb-3">
                Wishlist Produk Favorit Anda
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    name: "Voal Ultrafine Laser Cut - Dusty Lilac",
                    price: 99000,
                    category: "Hijab",
                  },
                  {
                    name: "Tunik Silk Royal Plum Busui Friendly",
                    price: 299000,
                    category: "Atasan Muslim Wanita",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="border border-zinc-200 rounded-lg p-3 flex gap-3">
                    <div className="w-16 h-20 bg-zinc-100 rounded overflow-hidden shrink-0">
                      <img
                        src={`https://images.unsplash.com/photo-${1584917865442 + idx * 2000}?auto=format&fit=crop&w=200&q=80`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-400 block">{item.category}</span>
                        <h4 className="font-bold text-zinc-900 leading-snug">{item.name}</h4>
                        <span className="font-extrabold text-purple-700 mt-1 block">
                          Rp {item.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <button
                        onClick={() => alert(`Produk "${item.name}" berhasil dipindahkan ke tas!`)}
                        className="text-left text-xs font-semibold text-purple-700 hover:underline"
                      >
                        + Tambah ke Tas
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PENGATURAN AKUN */}
          {activeTab === "settings" && (
            <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-2xs space-y-6">
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wide border-b border-zinc-100 pb-3">
                Pengaturan Profil & Keamanan Akun
              </h2>

              <div className="space-y-4 max-w-md text-xs">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full px-3 py-2 border border-zinc-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Email</label>
                  <input
                    type="email"
                    disabled
                    defaultValue={user.email}
                    className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 rounded text-xs text-zinc-500"
                  />
                  <span className="text-[10px] text-zinc-400">Email telah terverifikasi</span>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    defaultValue={user.phone}
                    className="w-full px-3 py-2 border border-zinc-300 rounded text-xs"
                  />
                </div>
                <button
                  onClick={() => alert("Perubahan profil berhasil disimpan!")}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-purple-900 text-white font-semibold rounded uppercase tracking-wider text-[11px] cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LIVE AWB RESI TRACKING MODAL */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 space-y-5 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-zinc-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                  Status Pengiriman Real-Time
                </span>
                <h3 className="text-base font-bold text-zinc-900">
                  {selectedOrderForTracking.courier.name} ({selectedOrderForTracking.courier.service})
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForTracking(null)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AWB Lockup */}
            <div className="bg-purple-50/80 border border-purple-200 rounded-lg p-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-purple-800 font-semibold block">
                  Nomor Resi (AWB)
                </span>
                <span className="font-mono text-sm font-bold text-zinc-900">
                  {selectedOrderForTracking.awb}
                </span>
              </div>
              <button
                onClick={() => handleCopyAwb(selectedOrderForTracking.awb || "")}
                className="px-3 py-1.5 bg-white border border-purple-300 text-purple-900 rounded font-semibold text-[11px] hover:bg-purple-100 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isCopied ? "Tersalin!" : "Salin Resi"}</span>
              </button>
            </div>

            {/* Recipient summary */}
            <div className="text-xs text-zinc-600 bg-zinc-50 p-3 rounded">
              <span className="font-semibold text-zinc-800 block">Tujuan Pengiriman:</span>
              <p>
                {selectedOrderForTracking.address.recipient} ({selectedOrderForTracking.address.phone})
              </p>
              <p className="text-zinc-500 text-[11px] truncate">
                {selectedOrderForTracking.address.fullAddress}, {selectedOrderForTracking.address.city}
              </p>
            </div>

            {/* Tracking Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 mb-3">
                Riwayat Perjalanan Paket
              </h4>
              <div className="border-l-2 border-purple-600 pl-4 space-y-4 text-xs ml-2">
                {selectedOrderForTracking.timeline.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-purple-600 border-2 border-white ring-2 ring-purple-100" />
                    <span className="text-[10px] font-mono text-zinc-400 block">{step.time}</span>
                    <span className="font-bold text-zinc-900 block text-xs">{step.location}</span>
                    <p className="text-zinc-600 text-[11px] mt-0.5 leading-relaxed">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderForTracking(null)}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Tutup Pelacakan
            </button>
          </div>
        </div>
      )}

      {/* ADD ADDRESS MODAL */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleAddAddress}
            className="bg-white rounded-lg max-w-md w-full p-6 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="font-bold text-sm text-zinc-900">Tambah Alamat Baru</h3>
              <button
                type="button"
                onClick={() => setIsAddAddressOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 text-xs font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Label Alamat</label>
                <input
                  type="text"
                  required
                  placeholder="cth. Rumah, Kantor, Kosan"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Nama Penerima</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">No. WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Kota / Kabupaten</label>
                  <input
                    type="text"
                    required
                    placeholder="Jakarta Selatan"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Kode Pos</label>
                  <input
                    type="text"
                    required
                    placeholder="12110"
                    value={newPostal}
                    onChange={(e) => setNewPostal(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddAddressOpen(false)}
                className="flex-1 py-2 border border-zinc-300 text-xs font-semibold rounded hover:bg-zinc-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-zinc-900 hover:bg-purple-900 text-white text-xs font-semibold rounded"
              >
                Simpan Alamat
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <HeaderNavbar />
      <main className="flex-1">
        <Suspense fallback={<div className="text-center p-12 text-sm text-zinc-500">Memuat profil pelanggan...</div>}>
          <ProfileContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
