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
  Copy,
  CheckCircle2,
  Clock,
  Sparkles,
  ShoppingBag,
  Plus,
  X,
  CreditCard,
  QrCode,
  Building2,
  Banknote,
  Edit3,
  Trash2,
  Check,
  ChevronRight,
  Info,
  Calendar,
  Phone,
  FileText,
} from "lucide-react";
import {
  useStore,
  OrderRecord,
  OrderStatus,
  CustomerAddress,
} from "@/context/StoreContext";
import HeaderNavbar from "@/components/HeaderNavbar";
import Footer from "@/components/Footer";
import ImageUploader from "@/components/ImageUploader";

function ProfileContent() {
  const searchParams = useSearchParams();
  const defaultTab =
    (searchParams.get("tab") as "orders" | "address" | "wishlist" | "settings") || "orders";

  const {
    user,
    isLoggedIn,
    logout,
    orders,
    addToCart,
    updateUserProfile,
    updateUserAddresses,
    updateAddress,
    setDefaultAddress,
    deleteAddress,
    completeOrder,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"orders" | "address" | "wishlist" | "settings">(
    defaultTab
  );
  const [orderFilter, setOrderFilter] = useState<string>("ALL");

  // Order Detail Modal
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderRecord | null>(null);

  // Tracking Modal
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<OrderRecord | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isCopiedVa, setIsCopiedVa] = useState(false);

  // Address Modals
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: "Rumah",
    tagLocation: "Rumah",
    recipient: "",
    phone: "",
    fullAddress: "",
    city: "",
    postalCode: "",
    notes: "",
    isDefault: false,
  });

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileBio, setProfileBio] = useState(user?.bio || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [profileAvatar, setProfileAvatar] = useState(user?.avatarUrl || "");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

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

  const getStatusCount = (status: OrderStatus) => {
    return orders.filter((o) => o.status === status).length;
  };

  const handleCopyAwb = (awbText: string) => {
    navigator.clipboard.writeText(awbText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyVa = (vaText: string) => {
    navigator.clipboard.writeText(vaText);
    setIsCopiedVa(true);
    setTimeout(() => setIsCopiedVa(false), 2000);
  };

  // Address Handlers
  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      label: "Rumah Utama",
      tagLocation: "Rumah",
      recipient: user.name,
      phone: user.phone,
      fullAddress: "",
      city: "Jakarta Selatan, DKI Jakarta",
      postalCode: "",
      notes: "",
      isDefault: user.addresses.length === 0,
    });
    setIsAddAddressOpen(true);
  };

  const handleOpenEditAddress = (addr: CustomerAddress) => {
    setEditingAddress(addr);
    setAddressForm({
      label: addr.label,
      tagLocation: addr.tagLocation || "Rumah",
      recipient: addr.recipient,
      phone: addr.phone,
      fullAddress: addr.fullAddress,
      city: addr.city,
      postalCode: addr.postalCode,
      notes: addr.notes || "",
      isDefault: addr.isDefault,
    });
    setIsAddAddressOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddress(editingAddress.id, {
        label: addressForm.label,
        tagLocation: addressForm.tagLocation,
        recipient: addressForm.recipient,
        phone: addressForm.phone,
        fullAddress: addressForm.fullAddress,
        city: addressForm.city,
        postalCode: addressForm.postalCode,
        notes: addressForm.notes,
        isDefault: addressForm.isDefault,
      });
      if (addressForm.isDefault) {
        setDefaultAddress(editingAddress.id);
      }
    } else {
      const newAddr: CustomerAddress = {
        id: `ADDR-${Date.now()}`,
        label: addressForm.label || "Alamat Baru",
        tagLocation: addressForm.tagLocation || "Rumah",
        recipient: addressForm.recipient,
        phone: addressForm.phone,
        fullAddress: addressForm.fullAddress,
        city: addressForm.city,
        postalCode: addressForm.postalCode,
        notes: addressForm.notes,
        isDefault: addressForm.isDefault || user.addresses.length === 0,
      };
      if (newAddr.isDefault) {
        const updated = user.addresses.map((a) => ({ ...a, isDefault: false }));
        updateUserAddresses([...updated, newAddr]);
      } else {
        updateUserAddresses([...user.addresses, newAddr]);
      }
    }
    setIsAddAddressOpen(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: profileName,
      bio: profileBio,
      phone: profilePhone,
      avatarUrl: profileAvatar,
    });
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "MENUNGGU_PEMBAYARAN":
        return (
          <span className="px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold flex items-center gap-1.5 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Menunggu Pembayaran
          </span>
        );
      case "DIKEMAS":
        return (
          <span className="px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold flex items-center gap-1.5 shadow-2xs">
            <PackageCheck className="w-3.5 h-3.5 text-blue-600" />
            Sedang Dikemas Seller
          </span>
        );
      case "DIKIRIM":
        return (
          <span className="px-2.5 py-1 rounded bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-bold flex items-center gap-1.5 shadow-2xs">
            <Truck className="w-3.5 h-3.5 text-purple-700" />
            Dalam Pengiriman Kurir
          </span>
        );
      case "SELESAI":
        return (
          <span className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Pesanan Selesai
          </span>
        );
      case "DIBATALKAN":
        return (
          <span className="px-2.5 py-1 rounded bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold">
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
        <span className="text-zinc-900 font-medium">Akun Pelanggan (Rahayu Profile)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar (Customer Card & Navigation) */}
        <div className="lg:col-span-4 space-y-6">
          {/* User Profile Card */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-2xs">
            <div className="flex items-center gap-4 pb-4 border-b border-zinc-100">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-200 shadow-xs shrink-0 bg-purple-100">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-purple-700 to-pink-500 text-white flex items-center justify-center text-xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-bold text-zinc-900 truncate">{user.name}</h2>
                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-800 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>{user.tier}</span>
                </div>
              </div>
            </div>

            {user.bio && (
              <p className="text-[11px] text-zinc-500 italic mt-3 line-clamp-2">
                &ldquo;{user.bio}&rdquo;
              </p>
            )}

            <div className="mt-4 pt-1 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                <span className="block text-[10px] text-zinc-400 font-medium uppercase">
                  Rahayu Poin
                </span>
                <span className="font-extrabold text-zinc-900 text-sm">
                  {user.points.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
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
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs divide-y divide-zinc-100 text-xs">
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
              <span className="text-[10px] text-zinc-400 font-medium">
                {user.addresses.length} Alamat
              </span>
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
              <span className="text-[10px] text-zinc-400 font-medium">4 Produk</span>
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
                <span>Edit Profil & Foto Akun</span>
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
          {/* TAB 1: DAFTAR TRANSAKSI (FANCY STEPPER STATUS & FLOW) */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              {/* Fancy Status Header Bar */}
              <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
                      Status Transaksi Belanja
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Pantau proses pembayaran, pengemasan, dan pelacakan kurir secara transparan.
                    </p>
                  </div>
                </div>

                {/* Fancy Interactive Status Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                  {[
                    {
                      label: "Semua",
                      value: "ALL",
                      count: orders.length,
                      icon: ShoppingBag,
                      color: "border-zinc-300",
                    },
                    {
                      label: "Menunggu Bayar",
                      value: "MENUNGGU_PEMBAYARAN",
                      count: getStatusCount("MENUNGGU_PEMBAYARAN"),
                      icon: Clock,
                      color: "border-amber-400 text-amber-700",
                    },
                    {
                      label: "Dikemas",
                      value: "DIKEMAS",
                      count: getStatusCount("DIKEMAS"),
                      icon: PackageCheck,
                      color: "border-blue-400 text-blue-700",
                    },
                    {
                      label: "Dikirim",
                      value: "DIKIRIM",
                      count: getStatusCount("DIKIRIM"),
                      icon: Truck,
                      color: "border-purple-400 text-purple-700",
                    },
                    {
                      label: "Selesai",
                      value: "SELESAI",
                      count: getStatusCount("SELESAI"),
                      icon: CheckCircle2,
                      color: "border-emerald-400 text-emerald-700",
                    },
                  ].map((tab) => {
                    const IconComp = tab.icon;
                    const isSelected = orderFilter === tab.value;
                    return (
                      <button
                        key={tab.value}
                        type="button"
                        onClick={() => setOrderFilter(tab.value)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? "bg-zinc-900 text-white border-zinc-900 shadow-md ring-2 ring-purple-600/30"
                            : "bg-zinc-50/70 hover:bg-zinc-100 text-zinc-700 border-zinc-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <IconComp
                            className={`w-4 h-4 ${
                              isSelected ? "text-purple-300" : "text-zinc-500"
                            }`}
                          />
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-zinc-200/80 text-zinc-700"
                            }`}
                          >
                            {tab.count}
                          </span>
                        </div>
                        <div className="font-bold text-[11px] leading-tight truncate">
                          {tab.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order Cards List */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center shadow-2xs">
                    <PackageCheck className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-zinc-800">
                      Tidak Ada Pesanan di Tab Ini
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 mb-4">
                      Belum ada transaksi dengan status &quot;{orderFilter}&quot;.
                    </p>
                    <Link
                      href="/products"
                      className="inline-block px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded shadow-xs"
                    >
                      Jelajahi Produk Rahayu
                    </Link>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs space-y-4 hover:border-purple-200 transition-all"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100 text-xs">
                        <div className="flex items-center gap-2.5">
                          <ShoppingBag className="w-4 h-4 text-purple-700" />
                          <span className="font-bold text-zinc-900">Rahayu Official Store</span>
                          <span className="text-zinc-300">•</span>
                          <span className="text-zinc-500 flex items-center gap-1 text-[11px]">
                            <Calendar className="w-3 h-3 text-zinc-400" />
                            {order.createdAt}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(order.status)}
                          <span className="font-mono text-[11px] text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100">
                            {order.id}
                          </span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div
                        onClick={() => setSelectedOrderDetail(order)}
                        className="space-y-3 cursor-pointer group"
                      >
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-3.5 items-center">
                            <div className="w-14 h-16 bg-zinc-100 rounded-lg overflow-hidden shrink-0 border border-zinc-200">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={
                                  item.product.imageUrl ||
                                  `https://images.unsplash.com/photo-${1584917865442 + item.product.id * 1000}?auto=format&fit=crop&w=200&q=80`
                                }
                                alt={item.product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                            </div>
                            <div className="flex-1 min-w-0 text-xs">
                              <h4 className="font-bold text-zinc-900 leading-snug group-hover:text-purple-700 transition truncate">
                                {item.product.name}
                              </h4>
                              <div className="text-zinc-500 mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                                <span className="bg-zinc-100 px-2 py-0.5 rounded text-zinc-700 font-medium">
                                  {item.selectedSize}
                                </span>
                                <span>•</span>
                                <span>{item.selectedColor}</span>
                                <span>•</span>
                                <span>{item.quantity} barang</span>
                              </div>
                            </div>
                            <div className="text-right text-xs shrink-0">
                              <span className="font-bold text-zinc-900 block text-sm">
                                Rp {(item.product.priceIdr * item.quantity).toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Payment Notice Banner if Menunggu Pembayaran */}
                      {order.status === "MENUNGGU_PEMBAYARAN" && (
                        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900">
                          <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-amber-600 shrink-0" />
                            <div>
                              <span className="font-bold">
                                {order.paymentMethod.name}
                                {order.accountNumber ? `: ${order.accountNumber}` : ""}
                              </span>
                              <span className="text-[11px] text-amber-700 block">
                                Batas Pembayaran: {order.paymentDueDate || "Segera selesaikan pembayaran"}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedOrderDetail(order)}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[11px] cursor-pointer"
                          >
                            Petunjuk Pembayaran
                          </button>
                        </div>
                      )}

                      {/* Footer Summary & Dynamic Actions */}
                      <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="text-zinc-500 block text-[11px]">Total Belanja:</span>
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-sm text-zinc-900">
                              Rp {order.totalAmount.toLocaleString("id-ID")}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              ({order.courier.name} • {order.paymentMethod.name})
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* Detail Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedOrderDetail(order)}
                            className="px-3 py-1.5 border border-zinc-300 hover:border-zinc-900 text-zinc-700 font-semibold rounded text-xs transition cursor-pointer"
                          >
                            Detail Pesanan
                          </button>

                          {/* 1. Menunggu Pembayaran Flow */}
                          {order.status === "MENUNGGU_PEMBAYARAN" && (
                            <button
                              type="button"
                              onClick={() => setSelectedOrderDetail(order)}
                              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Lihat Cara Bayar</span>
                            </button>
                          )}

                          {/* 2. Dikemas Flow */}
                          {order.status === "DIKEMAS" && (
                            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100 flex items-center gap-1">
                              <PackageCheck className="w-3.5 h-3.5" />
                              <span>Menunggu Kurir Pick Up</span>
                            </span>
                          )}

                          {/* 3. Dikirim Flow: Lacak Resi */}
                          {order.status === "DIKIRIM" && (
                            <>
                              {order.awb && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedOrderForTracking(order)}
                                  className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  <span>Lacak Resi ({order.awb})</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => completeOrder(order.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Pesanan Diterima</span>
                              </button>
                            </>
                          )}

                          {/* 4. Selesai Flow */}
                          {order.status === "SELESAI" && (
                            <button
                              type="button"
                              onClick={() => {
                                order.items.forEach((item) =>
                                  addToCart(item.product, item.selectedSize, item.selectedColor, 1)
                                );
                              }}
                              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-purple-900 text-white rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Beli Lagi</span>
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

          {/* TAB 2: DAFTAR ALAMAT (TAG LOCATION & EDIT) */}
          {activeTab === "address" && (
            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
                    Daftar Alamat Pengiriman
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Kelola alamat dengan tag lokasi (Rumah, Kantor, dll.) dan pilih satu sebagai alamat utama.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddAddress}
                  className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Alamat Baru</span>
                </button>
              </div>

              <div className="space-y-3">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 border rounded-xl text-xs space-y-2.5 transition-all ${
                      addr.isDefault
                        ? "border-purple-300 bg-purple-50/20 shadow-xs"
                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900 text-sm">{addr.recipient}</span>
                        {/* Tag Location Badge */}
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[10px] text-purple-800 font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-purple-600" />
                          {addr.tagLocation || addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[10px] text-emerald-800 font-bold">
                            Alamat Utama
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-purple-700 hover:underline font-semibold text-[11px] cursor-pointer"
                          >
                            Jadikan Utama
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEditAddress(addr)}
                          className="p-1.5 text-zinc-500 hover:text-purple-700 hover:bg-purple-50 rounded cursor-pointer"
                          title="Edit Alamat"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => deleteAddress(addr.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                            title="Hapus Alamat"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-zinc-600 font-mono text-[11px] flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-zinc-400" />
                      {addr.phone}
                    </p>
                    <p className="text-zinc-800 leading-relaxed">{addr.fullAddress}</p>
                    <p className="text-zinc-500 text-[11px]">
                      {addr.city} • Kode Pos: <strong>{addr.postalCode}</strong>
                    </p>

                    {addr.notes && (
                      <p className="text-[11px] text-zinc-500 bg-zinc-50 p-2 rounded border border-zinc-100 italic">
                        <strong>Catatan Kurir:</strong> {addr.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wide border-b border-zinc-100 pb-3">
                Wishlist Produk Favorit Anda
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    name: "Voal Ultrafine Laser Cut - Dusty Lilac",
                    price: 119000,
                    category: "Hijab",
                    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80",
                  },
                  {
                    name: "Tunik Silk Royal Plum Busui Friendly",
                    price: 249000,
                    category: "Atasan Muslim Wanita",
                    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="border border-zinc-200 rounded-xl p-3 flex gap-3 hover:border-purple-300 transition">
                    <div className="w-16 h-20 bg-zinc-100 rounded-lg overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
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
                      <Link
                        href="/products"
                        className="text-left text-xs font-semibold text-purple-700 hover:underline"
                      >
                        + Lihat di Katalog
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EDIT PROFIL & FOTO AKUN */}
          {activeTab === "settings" && (
            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-2xs space-y-6">
              <div className="border-b border-zinc-100 pb-3">
                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
                  Edit Profil & Gambar Akun
                </h2>
                <p className="text-xs text-zinc-500">
                  Perbarui identitas profil dan foto avatar Anda (tersimpan langsung di server lokal).
                </p>
              </div>

              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Profil dan foto berhasil diperbarui!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg text-xs">
                {/* Profile Photo Uploader */}
                <ImageUploader
                  label="Foto Profil / Avatar Akun"
                  value={profileAvatar}
                  onChange={(url) => setProfileAvatar(url)}
                  badgeStandard="Rasio 1:1, Max 500 KB"
                  helperText="Foto profil disimpan langsung di server lokal (/uploads)."
                  previewHeight="h-28"
                  compact
                />

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Bio Singkat</label>
                  <textarea
                    rows={2}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    placeholder="Ceritakan sedikit tentang selera gaya fashion Anda..."
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Email</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 rounded-md text-xs text-zinc-500 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">Email akun terverifikasi</span>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg uppercase tracking-wider text-[11px] cursor-pointer shadow-xs"
                  >
                    Simpan Perubahan Profil
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: ORDER DETAIL POPUP (FLOW MENUNGGU BAYAR, RINCIAN & PETUNJUK) */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 animate-in fade-in max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-zinc-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  Detail Transaksi Belanja
                </span>
                <h3 className="text-base font-bold text-zinc-900">{selectedOrderDetail.id}</h3>
                <span className="text-xs text-zinc-500">{selectedOrderDetail.createdAt}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedOrderDetail.status)}
                <button
                  type="button"
                  onClick={() => setSelectedOrderDetail(null)}
                  className="text-zinc-400 hover:text-zinc-700 p-1 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* FLOW 1: PETUNJUK PEMBAYARAN KHUSUS (Jika status Menunggu Pembayaran) */}
            {selectedOrderDetail.status === "MENUNGGU_PEMBAYARAN" && (
              <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Instruksi Pembayaran: {selectedOrderDetail.paymentMethod.name}</span>
                  </div>
                  {selectedOrderDetail.paymentDueDate && (
                    <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">
                      {selectedOrderDetail.paymentDueDate}
                    </span>
                  )}
                </div>

                {/* Account Number / VA Lockup */}
                {selectedOrderDetail.accountNumber && (
                  <div className="bg-white border border-amber-200 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-zinc-400 font-bold block">
                        Nomor Virtual Account / Rekening:
                      </span>
                      <span className="font-mono text-base font-extrabold text-zinc-900">
                        {selectedOrderDetail.accountNumber}
                      </span>
                      {selectedOrderDetail.accountName && (
                        <span className="text-[11px] text-zinc-500 block">
                          a/n {selectedOrderDetail.accountName}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyVa(selectedOrderDetail.accountNumber || "")}
                      className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isCopiedVa ? "Tersalin!" : "Salin No. VA"}</span>
                    </button>
                  </div>
                )}

                {/* QRIS Code Image if QRIS */}
                {selectedOrderDetail.paymentMethod.category === "QRIS" &&
                  selectedOrderDetail.qrImageUrl && (
                    <div className="text-center p-3 bg-white border border-amber-200 rounded-lg space-y-2">
                      <span className="text-[11px] font-bold text-zinc-800 block">
                        Scan QRIS di bawah untuk membayar:
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedOrderDetail.qrImageUrl}
                        alt="QRIS Code"
                        className="w-40 h-40 mx-auto object-cover rounded-lg border border-zinc-200"
                      />
                    </div>
                  )}

                {/* Step by Step Procedures */}
                {selectedOrderDetail.paymentInstructions &&
                  selectedOrderDetail.paymentInstructions.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="font-bold text-amber-950 text-[11px] block">
                        Cara / Langkah Pembayaran:
                      </span>
                      <ol className="list-decimal list-inside space-y-1 text-zinc-700 text-[11px] pl-1">
                        {selectedOrderDetail.paymentInstructions.map((step, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
              </div>
            )}

            {/* FLOW 3: Resi Tracking Link if Dikirim */}
            {selectedOrderDetail.status === "DIKIRIM" && selectedOrderDetail.awb && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-purple-700 font-bold uppercase block">
                    Paket Telah Dikirim ({selectedOrderDetail.courier.name})
                  </span>
                  <span className="font-mono text-sm font-bold text-zinc-900">
                    No. Resi: {selectedOrderDetail.awb}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOrderForTracking(selectedOrderDetail);
                  }}
                  className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Lihat Timeline Lacak</span>
                </button>
              </div>
            )}

            {/* Alamat Pengiriman */}
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  Alamat Tujuan ({selectedOrderDetail.address.tagLocation || selectedOrderDetail.address.label})
                </span>
                <span className="text-[11px] text-zinc-500">
                  Kurir: {selectedOrderDetail.courier.name} ({selectedOrderDetail.courier.service})
                </span>
              </div>
              <p className="font-semibold text-zinc-800">
                {selectedOrderDetail.address.recipient} ({selectedOrderDetail.address.phone})
              </p>
              <p className="text-zinc-600 text-[11px] leading-relaxed">
                {selectedOrderDetail.address.fullAddress}, {selectedOrderDetail.address.city} (Kode Pos: {selectedOrderDetail.address.postalCode})
              </p>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
                Daftar Produk ({selectedOrderDetail.items.length})
              </span>
              <div className="divide-y divide-zinc-100 max-h-48 overflow-y-auto">
                {selectedOrderDetail.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-12 bg-zinc-100 rounded overflow-hidden shrink-0 border border-zinc-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            item.product.imageUrl ||
                            `https://images.unsplash.com/photo-${1584917865442 + item.product.id * 1000}?auto=format&fit=crop&w=150&q=80`
                          }
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-zinc-900 block truncate">
                          {item.product.name}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {item.selectedSize} • {item.selectedColor} • {item.quantity} pcs
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-zinc-900 whitespace-nowrap">
                      Rp {(item.product.priceIdr * item.quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="border-t border-zinc-100 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal Produk</span>
                <span>Rp {selectedOrderDetail.subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Biaya Pengiriman ({selectedOrderDetail.courier.name})</span>
                <span>Rp {selectedOrderDetail.shippingCost.toLocaleString("id-ID")}</span>
              </div>
              {selectedOrderDetail.discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Diskon Voucher</span>
                  <span>-Rp {selectedOrderDetail.discountAmount.toLocaleString("id-ID")}</span>
                </div>
              )}
              {selectedOrderDetail.paymentMethod.fee > 0 && (
                <div className="flex justify-between text-zinc-600">
                  <span>Biaya Layanan Pembayaran</span>
                  <span>Rp {selectedOrderDetail.paymentMethod.fee.toLocaleString("id-ID")}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-zinc-900 pt-1.5 border-t border-zinc-100">
                <span>Total Tagihan Akhir</span>
                <span className="text-purple-700">
                  Rp {selectedOrderDetail.totalAmount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Flow 4: Selesaikan Order Button if Dikirim */}
            {selectedOrderDetail.status === "DIKIRIM" && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    completeOrder(selectedOrderDetail.id);
                    setSelectedOrderDetail((prev) =>
                      prev ? { ...prev, status: "SELESAI" } : null
                    );
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Konfirmasi Pesanan Diterima (Selesaikan Order)</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedOrderDetail(null)}
              className="w-full py-2 border border-zinc-300 text-zinc-700 font-semibold rounded-lg text-xs hover:bg-zinc-50 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: LIVE AWB RESI TRACKING (FLOW 3) */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in max-h-[90vh] overflow-y-auto">
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
                type="button"
                onClick={() => setSelectedOrderForTracking(null)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AWB Lockup */}
            <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-purple-800 font-semibold block">
                  Nomor Resi (AWB)
                </span>
                <span className="font-mono text-sm font-bold text-zinc-900">
                  {selectedOrderForTracking.awb}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyAwb(selectedOrderForTracking.awb || "")}
                className="px-3 py-1.5 bg-white border border-purple-300 text-purple-900 rounded font-semibold text-[11px] hover:bg-purple-100 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isCopied ? "Tersalin!" : "Salin Resi"}</span>
              </button>
            </div>

            {/* Recipient summary */}
            <div className="text-xs text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
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
              type="button"
              onClick={() => setSelectedOrderForTracking(null)}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Tutup Pelacakan
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: TAMBAH / EDIT ALAMAT DENGAN TAG LOCATION */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSaveAddress}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in max-h-[92vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="font-bold text-sm text-zinc-900">
                {editingAddress ? "Edit Alamat Pengiriman" : "Tambah Alamat Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddAddressOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Tag Location Buttons */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1.5">
                  Tag Lokasi Alamat *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["Rumah", "Kantor", "Apartemen", "Toko"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setAddressForm({ ...addressForm, tagLocation: tag })}
                      className={`py-2 px-2 text-center rounded-lg border font-semibold text-xs cursor-pointer transition ${
                        addressForm.tagLocation === tag
                          ? "bg-purple-700 text-white border-purple-700 shadow-xs"
                          : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Nama Label Alamat
                </label>
                <input
                  type="text"
                  required
                  placeholder="cth. Rumah Utama, Kosan Putri, Kantor Cabang"
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">
                    Nama Penerima *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap"
                    value={addressForm.recipient}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, recipient: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">
                    No. WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Alamat Lengkap & Jalan *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Nama jalan, nomor rumah/kantor, RT/RW, kelurahan, kecamatan"
                  value={addressForm.fullAddress}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, fullAddress: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Catatan untuk Kurir (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="cth. Pagar hitam dekat pohon mangga, titip pos satpam"
                  value={addressForm.notes}
                  onChange={(e) => setAddressForm({ ...addressForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">
                    Kota / Kabupaten *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jakarta Selatan, DKI Jakarta"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Kode Pos *</label>
                  <input
                    type="text"
                    required
                    placeholder="12110"
                    value={addressForm.postalCode}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, postalCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, isDefault: e.target.checked })
                  }
                  className="accent-purple-700 rounded"
                />
                <span className="font-semibold text-zinc-800">
                  Jadikan sebagai Alamat Utama
                </span>
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddAddressOpen(false)}
                className="flex-1 py-2 border border-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
              >
                {editingAddress ? "Simpan Perubahan" : "Simpan Alamat"}
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
        <Suspense
          fallback={
            <div className="text-center p-12 text-sm text-zinc-500">
              Memuat profil pelanggan...
            </div>
          }
        >
          <ProfileContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
