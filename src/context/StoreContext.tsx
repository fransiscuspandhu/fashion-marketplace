"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ProductItem,
  PRODUCTS_DATA,
  RahayuCategory,
  CATEGORIES_DATA,
  MarketplacePillar,
  DEFAULT_PILLARS,
} from "@/data/mock-data";

export interface CustomerAddress {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  fullAddress: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
  tagLocation?: "Rumah" | "Kantor" | "Apartemen" | "Toko" | string;
  notes?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: string;
  points: number;
  avatarUrl?: string;
  bio?: string;
  addresses: CustomerAddress[];
}

export interface CartItem {
  id: string; // unique item id: productId-size-color
  product: ProductItem;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface TrackingStep {
  time: string;
  status: string;
  location: string;
  detail: string;
}

export type OrderStatus = "MENUNGGU_PEMBAYARAN" | "DIKEMAS" | "DIKIRIM" | "SELESAI" | "DIBATALKAN";

export interface OrderRecord {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  courier: {
    code: string;
    name: string;
    service: string;
    etd: string;
  };
  awb: string | null;
  address: CustomerAddress;
  paymentMethod: {
    id: string;
    name: string;
    category: string;
    fee: number;
  };
  paymentInstructions?: string[];
  accountNumber?: string;
  accountName?: string;
  qrImageUrl?: string;
  paymentDueDate?: string;
  timeline: TrackingStep[];
}

export interface PaymentConfig {
  id: string;
  name: string;
  category: "QRIS" | "VIRTUAL_ACCOUNT" | "CREDIT_CARD" | "COD" | "TRANSFER_MANUAL";
  isActive: boolean;
  fee: number;
  icon: string;
  description: string;
  accountNumber?: string;
  accountName?: string;
  instructions?: string[];
  qrImageUrl?: string;
}

export interface AiFeaturesConfig {
  enableSmartSize: boolean;         // Rekomendasi Ukuran Cerdas (PDP/Frontstore)
  enableAutoCopywriter: boolean;     // Asisten Copywriting & Tagging SEO (Admin Product CRUD)
  enableVirtualStylist: boolean;     // Asisten Virtual Stylist Rahayu (Floating Chatbot Frontstore)
  enableDemandForecast: boolean;     // Prediksi Kebutuhan Stok & Musiman (Admin Dashboard Analisa)
  enableModelPhotoshoot: boolean;    // Studio Foto Model Fashion AI (Admin)
}

export const DEFAULT_AI_FEATURES_CONFIG: AiFeaturesConfig = {
  enableSmartSize: true,
  enableAutoCopywriter: true,
  enableVirtualStylist: true,
  enableDemandForecast: true,
  enableModelPhotoshoot: true,
};

export interface AiPhotoLog {
  id: string;
  timestamp: string;
  productName: string;
  category: string;
  modelType: string;
  lighting: string;
  background: string;
  costIdr: number;
  status: "COMPLETED" | "FAILED";
  prompt: string;
  outputUrl: string;
}

export interface HomepageSectionConfig {
  hero: {
    badge: string;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    backgroundImageUrl?: string;
    overlayOpacity?: number;
  };
  categoriesSection: {
    isActive: boolean;
    title: string;
    subtitle: string;
  };
  promoHighlightSection: {
    isActive: boolean;
    title: string;
    badgeText: string;
    countdownHours: string;
    countdownMins: string;
    countdownSecs: string;
    countdownText?: string;
  };
  newArrivalsSection: {
    isActive: boolean;
    title: string;
    subtitle: string;
    maxDisplay: number;
  };
  bestSellersSection: {
    isActive: boolean;
    title: string;
    subtitle: string;
    maxDisplay: number;
  };
  uspSection: {
    isActive: boolean;
    title: string;
    items: Array<{ title: string; desc: string; icon: string }>;
  };
}

export interface VoucherPromo {
  id: string;
  code: string;
  title: string;
  discountType: "NOMINAL" | "PERCENT";
  discountValue: number;
  minSpend: number;
  maxDiscount?: number;
  quota: number;
  usedCount: number;
  isActive: boolean;
  expiryDate: string;
  categoryTag?: "Diskon Belanja" | "Gratis Ongkir" | "Live Special" | "Pelanggan Baru" | "Kategori Hijab";
  terms?: string[];
}

export const INITIAL_VOUCHERS: VoucherPromo[] = [
  {
    id: "vouch-1",
    code: "RAHAYUPAYDAY",
    title: "Promo Gajian Payday Diskon Rp 50.000",
    discountType: "NOMINAL",
    discountValue: 50000,
    minSpend: 200000,
    quota: 500,
    usedCount: 142,
    isActive: true,
    expiryDate: "30 Nov 2026",
    categoryTag: "Diskon Belanja",
    terms: [
      "Berlaku untuk seluruh produk busana muslim, hijab voal, baju hamil, dan pakaian anak tanpa terkecuali.",
      "Minimal transaksi Rp 200.000 pada subtotal keranjang belanja (sebelum ongkos kirim dan biaya proteksi).",
      "Potongan langsung flat senilai Rp 50.000 dari total belanja pesanan.",
      "Voucher hanya dapat digunakan 1 (satu) kali per akun pelanggan selama periode promo gajian berlangsung.",
      "Dapat digabungkan dengan diskon langsung harga coret / promo flash sale produk.",
      "Berlaku hingga 30 November 2026 pukul 23:59 WIB atau selama kuota masih tersedia.",
    ],
  },
  {
    id: "vouch-2",
    code: "ONGKIRGRATIS",
    title: "Potongan Bebas Ongkir se-Indonesia",
    discountType: "NOMINAL",
    discountValue: 14000,
    minSpend: 100000,
    quota: 1000,
    usedCount: 388,
    isActive: true,
    expiryDate: "31 Des 2026",
    categoryTag: "Gratis Ongkir",
    terms: [
      "Potongan subsidi ongkos kirim hingga Rp 14.000 untuk pengiriman ke seluruh wilayah Indonesia.",
      "Minimal transaksi belanja Rp 100.000 dalam satu keranjang pesanan.",
      "Berlaku untuk layanan kurir ekspedisi Reguler (JNE, SiCepat, J&T Express, Pos Indonesia).",
      "Jika tarif ongkos kirim melebihi batas subsidi Rp 14.000, sisa kekurangan biaya ongkir ditanggung oleh pembeli.",
      "Berlaku untuk semua metode pembayaran resmi (QRIS, VA BCA, Mandiri, COD, Kartu Kredit).",
      "Masa berlaku kupon sampai dengan 31 Desember 2026 pukul 23:59 WIB.",
    ],
  },
  {
    id: "vouch-3",
    code: "RAHAYULIVE20",
    title: "Voucher Diskon 20% TikTok Live",
    discountType: "PERCENT",
    discountValue: 20,
    minSpend: 150000,
    maxDiscount: 40000,
    quota: 300,
    usedCount: 97,
    isActive: true,
    expiryDate: "30 Nov 2026",
    categoryTag: "Live Special",
    terms: [
      "Diskon 20% khusus penonton setia sesi interaktif TikTok Live & Webstore Live Streaming Rahayu Fashion.",
      "Minimal total belanja Rp 150.000 dengan batas maksimal potongan sebesar Rp 40.000.",
      "Berlaku untuk seluruh koleksi hijab premium, tunik silk, dress muslimah, dan bundle hemat.",
      "Kuota terbatas 300 kali transaksi klaim per sesi tayangan live show.",
      "Wajib memasukkan atau memilih kode voucher sebelum menyelesaikan pembayaran checkout.",
      "Promo berlaku hingga 30 November 2026 pukul 23:59 WIB.",
    ],
  },
  {
    id: "vouch-4",
    code: "RAHAYU10",
    title: "Voucher Pelanggan Baru 10%",
    discountType: "PERCENT",
    discountValue: 10,
    minSpend: 100000,
    maxDiscount: 25000,
    quota: 200,
    usedCount: 64,
    isActive: true,
    expiryDate: "31 Des 2026",
    categoryTag: "Pelanggan Baru",
    terms: [
      "Diskon sambutan 10% khusus untuk transaksi pertama pelanggan baru di Rahayu Fashion Store.",
      "Minimal transaksi Rp 100.000 dengan maksimal potongan nilai diskon Rp 25.000.",
      "Berlaku untuk semua metode pembayaran online dan bayar di tempat (COD).",
      "Tidak dapat diuangkan atau dipindahtangankan ke akun pengguna lain.",
      "Berlaku sampai dengan 31 Desember 2026 pukul 23:59 WIB.",
    ],
  },
  {
    id: "vouch-5",
    code: "FLASHRAYA30",
    title: "Super Promo Raya Diskon 30%",
    discountType: "PERCENT",
    discountValue: 30,
    minSpend: 250000,
    maxDiscount: 60000,
    quota: 150,
    usedCount: 42,
    isActive: true,
    expiryDate: "15 Des 2026",
    categoryTag: "Diskon Belanja",
    terms: [
      "Potongan harga 30% untuk persiapan busana Hari Raya & Modest Festive 2026.",
      "Minimal belanja Rp 250.000 dengan batas potongan diskon tertinggi hingga Rp 60.000.",
      "Berlaku untuk koleksi Gamis Syari, Tunik Silk, Abaya Modern, dan Kaftan Premium.",
      "Batas kuota harian berlaku, siapa cepat dia dapat saat checkout.",
      "Berlaku hingga 15 Desember 2026 pukul 23:59 WIB.",
    ],
  },
  {
    id: "vouch-6",
    code: "VOALLOVERS",
    title: "Kupon Spesial Hijab Voal Rp 20.000",
    discountType: "NOMINAL",
    discountValue: 20000,
    minSpend: 120000,
    quota: 400,
    usedCount: 118,
    isActive: true,
    expiryDate: "31 Des 2026",
    categoryTag: "Kategori Hijab",
    terms: [
      "Potongan langsung Rp 20.000 khusus pembelian aneka Hijab Voal Ultrafine & Pashmina Plisket.",
      "Minimal belanja Rp 120.000 untuk kategori hijab dan aksesoris muslim.",
      "Dapat digunakan untuk pembelian grosir mini (paket 3 hijab voal).",
      "Berlaku hingga 31 Desember 2026 pukul 23:59 WIB.",
    ],
  },
];

export type AdminRole =
  | "SUPER_ADMIN"
  | "PRODUCT_MANAGER"
  | "ORDER_FULFILLMENT"
  | "MARKETING_STREAMER"
  | "FINANCE_OPS";

export type AdminModuleId =
  | "analytics"
  | "categories"
  | "products"
  | "orders"
  | "payments"
  | "promos"
  | "ai-studio"
  | "cms-seo"
  | "layout";

export interface AdminRoleConfig {
  role: AdminRole;
  label: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  department: string;
  description: string;
  allowedModules: AdminModuleId[];
  defaultEmail: string;
  defaultName: string;
  defaultPhone: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  department: string;
  lastLogin: string;
  phone?: string;
}

export const ADMIN_ROLES_CONFIG: Record<AdminRole, AdminRoleConfig> = {
  SUPER_ADMIN: {
    role: "SUPER_ADMIN",
    label: "Super Admin (Owner)",
    badgeColor: "text-purple-800",
    badgeBg: "bg-purple-100",
    badgeBorder: "border-purple-300",
    department: "Executive & Ownership",
    description: "Akses penuh tanpa batas ke seluruh 9 modul sistem, switchboard AI, finansial, dan audit log.",
    allowedModules: [
      "analytics",
      "categories",
      "products",
      "orders",
      "payments",
      "promos",
      "ai-studio",
      "cms-seo",
      "layout",
    ],
    defaultEmail: "owner@rahayufashion.id",
    defaultName: "Hj. Rahayu Kusuma (Owner)",
    defaultPhone: "0811-9988-7766",
  },
  PRODUCT_MANAGER: {
    role: "PRODUCT_MANAGER",
    label: "Product & Merchandiser",
    badgeColor: "text-blue-800",
    badgeBg: "bg-blue-100",
    badgeBorder: "border-blue-300",
    department: "Merchandising & Katalog",
    description: "Manajemen katalog produk, upload foto studio AI, asisten copywriting, kategori dinamis, dan promo flash sale.",
    allowedModules: ["analytics", "categories", "products", "promos", "ai-studio"],
    defaultEmail: "merchandiser@rahayufashion.id",
    defaultName: "Dewi Lestari (Product Lead)",
    defaultPhone: "0812-3344-5566",
  },
  ORDER_FULFILLMENT: {
    role: "ORDER_FULFILLMENT",
    label: "Gudang & Fulfillment (Resi AWB)",
    badgeColor: "text-emerald-800",
    badgeBg: "bg-emerald-100",
    badgeBorder: "border-emerald-300",
    department: "Logistik & Ekspedisi",
    description: "Pemrosesan pesanan masuk, cetak label pengiriman, input nomor resi kurir (AWB), dan monitor stok gudang.",
    allowedModules: ["analytics", "products", "orders"],
    defaultEmail: "gudang@rahayufashion.id",
    defaultName: "Budi Santoso (Kepala Gudang)",
    defaultPhone: "0813-7788-9900",
  },
  MARKETING_STREAMER: {
    role: "MARKETING_STREAMER",
    label: "Marketing & TikTok Live",
    badgeColor: "text-pink-800",
    badgeBg: "bg-pink-100",
    badgeBorder: "border-pink-300",
    department: "Digital Marketing & Live Show",
    description: "Penjadwalan siaran TikTok Live, pengaturan banner hero beranda, SEO keywords, dan kode voucher promo.",
    allowedModules: ["analytics", "promos", "cms-seo", "layout"],
    defaultEmail: "marketing@rahayufashion.id",
    defaultName: "Annisa Putri (Host & Marketing)",
    defaultPhone: "0815-1122-3344",
  },
  FINANCE_OPS: {
    role: "FINANCE_OPS",
    label: "Finance & Accounting",
    badgeColor: "text-amber-800",
    badgeBg: "bg-amber-100",
    badgeBorder: "border-amber-300",
    department: "Keuangan & Rekonsiliasi",
    description: "Pengaturan payment gateway, rekening/VA/QRIS, analisa omzet, dan verifikasi manual transaksi.",
    allowedModules: ["analytics", "orders", "payments"],
    defaultEmail: "finance@rahayufashion.id",
    defaultName: "Hendra Wijaya (Finance Ops)",
    defaultPhone: "0819-5566-7788",
  },
};

export const DEMO_ADMIN_ACCOUNTS: AdminUser[] = [
  {
    id: "ADM-001",
    name: "Hj. Rahayu Kusuma",
    email: "owner@rahayufashion.id",
    role: "SUPER_ADMIN",
    department: "Executive & Ownership",
    lastLogin: "Hari ini, 09:15 WIB",
    phone: "0811-9988-7766",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "ADM-002",
    name: "Dewi Lestari",
    email: "merchandiser@rahayufashion.id",
    role: "PRODUCT_MANAGER",
    department: "Merchandising & Katalog",
    lastLogin: "Hari ini, 08:40 WIB",
    phone: "0812-3344-5566",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "ADM-003",
    name: "Budi Santoso",
    email: "gudang@rahayufashion.id",
    role: "ORDER_FULFILLMENT",
    department: "Logistik & Ekspedisi",
    lastLogin: "Hari ini, 07:30 WIB",
    phone: "0813-7788-9900",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "ADM-004",
    name: "Annisa Putri",
    email: "marketing@rahayufashion.id",
    role: "MARKETING_STREAMER",
    department: "Digital Marketing & Live Show",
    lastLogin: "Kemarin, 19:45 WIB",
    phone: "0815-1122-3344",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "ADM-005",
    name: "Hendra Wijaya",
    email: "finance@rahayufashion.id",
    role: "FINANCE_OPS",
    department: "Keuangan & Rekonsiliasi",
    lastLogin: "Kemarin, 17:10 WIB",
    phone: "0819-5566-7788",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
];

export interface TikTokLiveConfig {
  username: string;
  nickname?: string;
  avatarUrl?: string;
  signature?: string;
  verified?: boolean;
  accountFound?: boolean;
  isLiveOnTikTok?: boolean;
  mode: "AUTO_SYNC" | "MANUAL_LIVE";
  isLive: boolean;
  viewers: number;
  enterCount?: number;
  likes: number;
  followers?: number;
  videoCount?: number;
  title: string;
  voucherCode: string;
  schedule: string;
  pinnedProductId: number;
  instagramUrl: string;
  whatsappUrl: string;
  profileUrl: string;
  liveUrl: string;
  lastSyncedAt: string;
  connectionStatus: "CONNECTED_LIVE" | "ACCOUNT_SYNCED_OFFLINE" | "SIMULCAST_ACTIVE" | "OFFLINE";
}

interface StoreContextType {
  // Customer Auth & Profile (Frontweb Store)
  user: CustomerUser | null;
  isLoggedIn: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<CustomerUser>) => void;
  updateUserAddresses: (addresses: CustomerAddress[]) => void;
  updateAddress: (addressId: string, updated: Partial<CustomerAddress>) => void;
  setDefaultAddress: (addressId: string) => void;
  deleteAddress: (addressId: string) => void;

  // Admin Internal Auth & RBAC Roles (Admin Portal)
  adminUser: AdminUser | null;
  isAdminLoggedIn: boolean;
  adminLogin: (email: string, password?: string, role?: AdminRole) => boolean;
  adminSwitchRole: (newRole: AdminRole) => void;
  adminLogout: () => void;

  // Cart
  cart: CartItem[];
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addToCart: (product: ProductItem, size: string, color: string, qty?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQty: (itemId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // Products (CRUD & Stock)
  products: ProductItem[];
  addProduct: (newProduct: ProductItem) => void;
  updateProduct: (productId: number, updated: Partial<ProductItem>) => void;
  deleteProduct: (productId: number) => void;
  updateProductStock: (productId: number, newStock: number) => void;

  // Orders
  orders: OrderRecord[];
  createOrder: (orderData: Omit<OrderRecord, "id" | "createdAt" | "status" | "timeline" | "awb">) => OrderRecord;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  updateOrderAwb: (orderId: string, awb: string, courierName?: string) => void;
  completeOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;

  // Pillars (Admin control)
  pillars: MarketplacePillar[];
  addPillar: (newPillar: MarketplacePillar) => void;
  updatePillar: (pillarId: string, updated: Partial<MarketplacePillar>) => void;
  deletePillar: (pillarId: string) => void;

  // Categories & Dynamic Sizes (Admin control)
  categories: RahayuCategory[];
  addCategory: (newCategory: RahayuCategory) => void;
  updateCategory: (categoryId: string, updated: Partial<RahayuCategory>) => void;
  deleteCategory: (categoryId: string) => void;
  addCategorySize: (categoryId: string, newSize: string) => void;
  removeCategorySize: (categoryId: string, sizeToRemove: string) => void;

  // Homepage & Section Management (Admin control)
  homepageConfig: HomepageSectionConfig;
  updateHomepageConfig: (newConfig: Partial<HomepageSectionConfig>) => void;

  // Vouchers & Promo Redeem (Admin & Checkout)
  vouchers: VoucherPromo[];
  addVoucher: (newVoucher: VoucherPromo) => void;
  updateVoucher: (voucherId: string, updated: Partial<VoucherPromo>) => void;
  deleteVoucher: (voucherId: string) => void;
  toggleVoucherStatus: (voucherId: string) => void;

  // Payment Methods (Admin control)
  paymentMethods: PaymentConfig[];
  togglePaymentMethod: (methodId: string) => void;
  updatePaymentFee: (methodId: string, fee: number) => void;
  updatePaymentMethod: (methodId: string, updated: Partial<PaymentConfig>) => void;

  // Live Stream & TikTok Connector
  isLiveActive: boolean;
  liveViewers: number;
  toggleLiveActive: () => void;
  tiktokConfig: TikTokLiveConfig;
  updateTikTokConfig: (partial: Partial<TikTokLiveConfig>) => Promise<void>;
  syncTikTokLiveNow: (customUsername?: string) => Promise<any>;

  // AI Switchboard & Modular Features
  aiFeaturesConfig: AiFeaturesConfig;
  updateAiFeaturesConfig: (newConfig: Partial<AiFeaturesConfig>) => void;
  aiLogs: AiPhotoLog[];
  generateAiPhoto: (data: {
    productName: string;
    category: string;
    modelType: string;
    lighting: string;
    background: string;
  }) => AiPhotoLog;

  // Fancy Loading & Store Notification State
  isStoreLoading: boolean;
  isSyncingData: boolean;
  syncMessage: string | null;
  triggerFancyLoading: (message?: string, durationMs?: number) => void;
  storeToast: {
    id: number;
    title: string;
    message: string;
    type: "success" | "info" | "warning";
  } | null;
  showStoreToast: (
    title: string,
    message: string,
    type?: "success" | "info" | "warning"
  ) => void;
  dismissStoreToast: () => void;
}

const DEFAULT_USER: CustomerUser = {
  id: "CUST-88192",
  name: "Siti Rahmawati",
  email: "siti.rahmawati@gmail.com",
  phone: "0812-8877-6655",
  tier: "Rahayu Gold Member",
  points: 1250,
  avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
  bio: "Pecinta modest fashion dan hijab silk elegan bernuansa earthy pastel.",
  addresses: [
    {
      id: "ADDR-1",
      label: "Rumah Utama",
      recipient: "Siti Rahmawati",
      phone: "0812-8877-6655",
      fullAddress: "Jl. Senopati No. 42, RT 04/RW 03, Selong, Kebayoran Baru",
      city: "Jakarta Selatan, DKI Jakarta",
      postalCode: "12110",
      isDefault: true,
      tagLocation: "Rumah",
      notes: "Pagar putih di samping pos satpam, titip sekuriti jika tidak di tempat.",
    },
    {
      id: "ADDR-2",
      label: "Kantor (SCBD)",
      recipient: "Siti Rahmawati (Divisi Marketing)",
      phone: "0812-8877-6655",
      fullAddress: "Pacific Place Lt. 12, Jl. Jend. Sudirman Kav 52-53",
      city: "Jakarta Selatan, DKI Jakarta",
      postalCode: "12190",
      isDefault: false,
      tagLocation: "Kantor",
      notes: "Kirim saat jam kerja 09.00 - 17.00 WIB, drop di meja resepsionis lobi utama.",
    },
  ],
};

const INITIAL_PAYMENT_METHODS: PaymentConfig[] = [
  {
    id: "qris-dynamic",
    name: "QRIS Instant (GoPay, OVO, ShopeePay, Dana, BCA)",
    category: "QRIS",
    isActive: true,
    fee: 0,
    icon: "QrCode",
    description: "Scan QR otomatis langsung diverifikasi dalam 5 detik via Midtrans/Xendit",
    accountNumber: "ID1020088912301",
    accountName: "NMID: RAHAYU FASHION STORE",
    qrImageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80",
    instructions: [
      "Buka aplikasi e-wallet atau mobile banking apa saja (BCA Mobile, GoPay, OVO, ShopeePay, Dana, LinkAja).",
      "Pilih menu 'Scan / Bayar' lalu arahkan kamera ke kode QR di layar.",
      "Periksa nama penerima: RAHAYU FASHION STORE dan total tagihan yang tertera.",
      "Konfirmasi pembayaran dengan memasukkan PIN aplikasi Anda. Status otomatis lunas dalam hitungan detik.",
    ],
  },
  {
    id: "va-bca",
    name: "BCA Virtual Account",
    category: "VIRTUAL_ACCOUNT",
    isActive: true,
    fee: 2000,
    icon: "Building2",
    description: "Nomor VA instan 8801-xxxx-xxxx otomatis dicek 24/7 tanpa perlu upload bukti",
    accountNumber: "88012081288776655",
    accountName: "RAHAYU - SITI RAHMAWATI",
    instructions: [
      "Buka aplikasi BCA Mobile / myBCA / KlikBCA, lalu pilih menu 'Transfer' > 'BCA Virtual Account'.",
      "Masukkan 16 digit Nomor Virtual Account: 88012081288776655.",
      "Pastikan nama merchant tertera 'RAHAYU STORE' dengan nominal yang sesuai.",
      "Masukkan PIN m-BCA Anda. Transaksi selesai dan sistem otomatis mengemas barang Anda.",
    ],
  },
  {
    id: "va-mandiri",
    name: "Mandiri Virtual Account",
    category: "VIRTUAL_ACCOUNT",
    isActive: true,
    fee: 2000,
    icon: "Building2",
    description: "Pembayaran via Mandiri Livin atau ATM dengan kode perusahaan 89123",
    accountNumber: "89123081288776655",
    accountName: "RAHAYU STORE - MANDIRI",
    instructions: [
      "Buka aplikasi Livin' by Mandiri, pilih menu 'Bayar' > 'Pembayaran Baru'.",
      "Pilih 'Multi Payment', cari penyedia jasa 'RAHAYU STORE' atau kode perusahaan 89123.",
      "Ketik nomor Virtual Account Mandiri Anda, lalu tekan 'Lanjutkan'.",
      "Konfirmasi tagihan dan masukkan MPIN Livin' Anda.",
    ],
  },
  {
    id: "va-bri",
    name: "BRI Virtual Account (BRIVA)",
    category: "VIRTUAL_ACCOUNT",
    isActive: true,
    fee: 2000,
    icon: "Building2",
    description: "Pembayaran instan 24 jam via aplikasi BRImo atau ATM BRI",
    accountNumber: "12844081288776655",
    accountName: "BRIVA RAHAYU FASHION",
    instructions: [
      "Buka aplikasi BRImo, pilih menu 'BRIVA'.",
      "Pilih 'Pembayaran Baru' dan masukkan nomor BRIVA: 12844081288776655.",
      "Periksa nama pelanggan dan rincian nominal pembayaran.",
      "Tekan 'Bayar' dan masukkan PIN BRImo Anda.",
    ],
  },
  {
    id: "transfer-manual-bca",
    name: "Transfer Bank Manual (BCA Verifikasi CS)",
    category: "TRANSFER_MANUAL",
    isActive: true,
    fee: 0,
    icon: "Building2",
    description: "Transfer langsung ke rekening utama PT Rahayu Busana Nusantara",
    accountNumber: "731-098-7721",
    accountName: "PT RAHAYU BUSANA NUSANTARA",
    instructions: [
      "Transfer jumlah tepat sesuai tagihan ke Rekening BCA: 731-098-7721 a/n PT RAHAYU BUSANA NUSANTARA.",
      "Tuliskan Nomor Invoice pada berita transfer.",
      "Simpan struk / bukti transfer m-banking.",
      "Admin akan memverifikasi dalam waktu maksimal 15 menit pada jam kerja (08.00 - 21.00 WIB).",
    ],
  },
  {
    id: "cc-visa-master",
    name: "Kartu Kredit / Debit (Visa, Mastercard, JCB)",
    category: "CREDIT_CARD",
    isActive: true,
    fee: 2500,
    icon: "CreditCard",
    description: "Aman dengan 3D Secure OTP & proteksi enkripsi bank berstandar PCI-DSS",
    instructions: [
      "Masukkan 16 digit nomor kartu kredit/debit, tanggal kedaluwarsa (MM/YY), dan kode CVV di belakang kartu.",
      "Sistem akan mengarahkan ke halaman verifikasi bank (3D Secure).",
      "Masukkan kode OTP yang dikirim melalui SMS oleh bank penerbit kartu Anda.",
      "Pembayaran selesai secara instan.",
    ],
  },
  {
    id: "cod-cash",
    name: "Cash on Delivery (COD / Bayar di Tempat)",
    category: "COD",
    isActive: true,
    fee: 5000,
    icon: "Banknote",
    description: "Bayar tunai ke kurir SiCepat / J&T saat paket pesanan tiba di depan pintu rumah",
    instructions: [
      "Pastikan nomor telepon WhatsApp Anda aktif untuk konfirmasi kurir sebelum pengantaran.",
      "Siapkan uang tunai pas sesuai total belanja saat kurir tiba di alamat Anda.",
      "Periksa kemasan segel paket Rahayu Store sebelum membuka paket.",
      "Lakukan serah terima pembayaran kepada kurir resmi.",
    ],
  },
];

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: "INV/20261113/RAH/00995",
    createdAt: "13 Nov 2026, 21:10 WIB",
    status: "MENUNGGU_PEMBAYARAN",
    items: [
      {
        id: "item-va-1",
        product: PRODUCTS_DATA[0], // Amira Armani Silk Tunic
        selectedSize: "M (LD 100)",
        selectedColor: "Royal Plum",
        quantity: 1,
      },
      {
        id: "item-va-2",
        product: PRODUCTS_DATA[1], // Signature Voal
        selectedSize: "115x115 cm",
        selectedColor: "Dusty Lilac",
        quantity: 1,
      },
    ],
    subtotal: 368000,
    shippingCost: 10000,
    discountAmount: 30000,
    totalAmount: 350000,
    courier: {
      code: "JNE",
      name: "JNE Express",
      service: "Reguler (REG)",
      etd: "1-2 Hari Kerja",
    },
    awb: null,
    address: DEFAULT_USER.addresses[0],
    paymentMethod: {
      id: "va-bca",
      name: "BCA Virtual Account",
      category: "VIRTUAL_ACCOUNT",
      fee: 2000,
    },
    accountNumber: "88012081288776655",
    accountName: "RAHAYU - SITI RAHMAWATI",
    paymentDueDate: "14 Nov 2026, 21:10 WIB (Sisa 23 Jam)",
    paymentInstructions: [
      "Buka aplikasi BCA Mobile / KlikBCA, lalu pilih menu 'Transfer' > 'BCA Virtual Account'.",
      "Masukkan 16 digit Nomor Virtual Account: 88012081288776655.",
      "Pastikan nama merchant tertera 'RAHAYU STORE' dengan nominal Rp 350.000.",
      "Masukkan PIN m-BCA Anda. Transaksi selesai dan status pesanan otomatis berubah ke 'DIKEMAS'.",
    ],
    timeline: [
      {
        time: "13 Nov 2026, 21:10 WIB",
        status: "MENUNGGU_PEMBAYARAN",
        location: "Sistem Pembayaran Rahayu",
        detail: "Pesanan berhasil dibuat. Menunggu transfer ke BCA Virtual Account: 88012081288776655 sebelum batas waktu.",
      },
    ],
  },
  {
    id: "INV/20261113/RAH/00940",
    createdAt: "13 Nov 2026, 11:20 WIB",
    status: "DIKEMAS",
    items: [
      {
        id: "item-pack-1",
        product: PRODUCTS_DATA[2], // Nadine Nursing Maternity Dress
        selectedSize: "L (LD 106)",
        selectedColor: "Sage Green",
        quantity: 1,
      },
    ],
    subtotal: 265000,
    shippingCost: 12000,
    discountAmount: 25000,
    totalAmount: 252000,
    courier: {
      code: "SICEPAT",
      name: "SiCepat Ekspres",
      service: "Reguler",
      etd: "1-2 Hari Kerja",
    },
    awb: null,
    address: DEFAULT_USER.addresses[1],
    paymentMethod: {
      id: "qris-dynamic",
      name: "QRIS Instant",
      category: "QRIS",
      fee: 0,
    },
    accountNumber: "ID1020088912301",
    accountName: "NMID: RAHAYU FASHION STORE",
    timeline: [
      {
        time: "13 Nov 2026, 11:35 WIB",
        status: "DIKEMAS",
        location: "Warehouse Rahayu Bandung",
        detail: "Pembayaran lunas diverifikasi. Pesanan sedang dipacking rapi dan menunggu penjemputan oleh kurir SiCepat.",
      },
      {
        time: "13 Nov 2026, 11:20 WIB",
        status: "ORDER_DIBUAT",
        location: "Sistem Online",
        detail: "Pesanan masuk dan pembayaran QRIS berhasil diverifikasi instan.",
      },
    ],
  },
  {
    id: "INV/20261112/RAH/00912",
    createdAt: "12 Nov 2026, 14:30 WIB",
    status: "DIKIRIM",
    items: [
      {
        id: "item-1",
        product: PRODUCTS_DATA[0],
        selectedSize: "115x115 cm",
        selectedColor: "Dusty Lilac",
        quantity: 2,
      },
      {
        id: "item-2",
        product: PRODUCTS_DATA[1],
        selectedSize: "M (LD 100)",
        selectedColor: "Royal Plum",
        quantity: 1,
      },
    ],
    subtotal: 497000,
    shippingCost: 14000,
    discountAmount: 50000,
    totalAmount: 461000,
    courier: {
      code: "JNE",
      name: "JNE Express",
      service: "Reguler (REG)",
      etd: "1-2 Hari Kerja",
    },
    awb: "JNE-RAH88492019",
    address: DEFAULT_USER.addresses[0],
    paymentMethod: {
      id: "qris-dynamic",
      name: "QRIS Instant",
      category: "QRIS",
      fee: 0,
    },
    timeline: [
      {
        time: "13 Nov 2026, 14:30 WIB",
        status: "SEDANG_DIANTAR",
        location: "Kebayoran Baru Hub",
        detail: "Paket dibawa kurir JNE [Bpk. Agus Salim] menuju alamat penerima.",
      },
      {
        time: "13 Nov 2026, 08:15 WIB",
        status: "TRANSIT",
        location: "Jakarta Gateway DC",
        detail: "Paket telah tiba di pusat sortir transit Jakarta Selatan.",
      },
      {
        time: "12 Nov 2026, 19:45 WIB",
        status: "MANIFEST",
        location: "Rahayu Fulfillment Center, Bandung",
        detail: "Paket telah diserahkan kepada kurir JNE Express dengan nomor resi JNE-RAH88492019.",
      },
      {
        time: "12 Nov 2026, 14:35 WIB",
        status: "ORDER_DIBUAT",
        location: "Sistem Rahayu Store",
        detail: "Pembayaran QRIS lunas terverifikasi. Pesanan dikemas seller.",
      },
    ],
  },
  {
    id: "INV/20261108/RAH/00783",
    createdAt: "08 Nov 2026, 10:12 WIB",
    status: "SELESAI",
    items: [
      {
        id: "item-3",
        product: PRODUCTS_DATA[3],
        selectedSize: "All Size Fit XL",
        selectedColor: "Cream Matte",
        quantity: 1,
      },
    ],
    subtotal: 189000,
    shippingCost: 0,
    discountAmount: 20000,
    totalAmount: 169000,
    courier: {
      code: "SICEPAT",
      name: "SiCepat Ekspres",
      service: "BEST (Next Day)",
      etd: "1 Hari",
    },
    awb: "003889127764",
    address: DEFAULT_USER.addresses[0],
    paymentMethod: {
      id: "va-bca",
      name: "BCA Virtual Account",
      category: "VIRTUAL_ACCOUNT",
      fee: 2000,
    },
    timeline: [
      {
        time: "10 Nov 2026, 13:40 WIB",
        status: "DELIVERED",
        location: "Rumah Utama, Kebayoran Baru",
        detail: "Pesanan diterima oleh [Siti Rahmawati - Penerima Langsung]. Transaksi selesai.",
      },
    ],
  },
];

const INITIAL_AI_LOGS: AiPhotoLog[] = [
  {
    id: "AI-GEN-01",
    timestamp: "13 Nov 2026, 09:15 WIB",
    productName: "Voal Ultrafine Scarf - Dusty Lilac",
    category: "Hijab",
    modelType: "Wanita Indonesia Modest Elegance (Usia 26)",
    lighting: "Soft Natural Morning Sunlight (Golden Hour)",
    background: "Minimalist Scandinavian Interior with Warm Travertine Arch",
    costIdr: 495,
    status: "COMPLETED",
    prompt: "Indonesian modest fashion model wearing luxury dusty lilac silk voal scarf, draped elegantly, soft warm daylight, high fashion editorial lookbook, 8k resolution.",
    outputUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "AI-GEN-02",
    timestamp: "12 Nov 2026, 16:40 WIB",
    productName: "Tunik Silk Royal Plum Busui",
    category: "Atasan Muslim Wanita",
    modelType: "Wanita Hijab Cantik Nusantara (Usia 29)",
    lighting: "High-End Studio Softbox Lighting",
    background: "Monochrome Concrete & Olive Tree Branch Shadow",
    costIdr: 520,
    status: "COMPLETED",
    prompt: "Full-body portrait of Indonesian woman wearing royal plum loose silk tunic, standing gracefully against clean textured beige wall, natural soft shadows, luxury studio editorial aesthetic.",
    outputUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
  },
];

const INITIAL_HOMEPAGE_CONFIG: HomepageSectionConfig = {
  hero: {
    badge: "KOLEKSI FASHION MODERN 2026",
    title: "Eksplorasi Gaya Fashion Modern Setiap Hari",
    description: "Koleksi pakaian wanita modern, atasan & bawahan kasual, celana & legging, hijab voal ultrafine, baju hamil nyaman, hingga pakaian anak berkualitas tinggi.",
    ctaText: "Jelajahi Koleksi",
    ctaLink: "/products",
    backgroundImageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80",
    overlayOpacity: 40,
  },
  categoriesSection: {
    isActive: true,
    title: "11 Kategori Resmi",
    subtitle: "Pilih kategori untuk melihat katalog lengkap ukuran & video detail",
  },
  promoHighlightSection: {
    isActive: true,
    title: "Promo Highlight Hari Ini",
    badgeText: "VOUCHER: RAHAYUPAYDAY",
    countdownHours: "06",
    countdownMins: "42",
    countdownSecs: "19",
    countdownText: "06 Jam : 42 Menit : 19 Detik",
  },
  newArrivalsSection: {
    isActive: true,
    title: "Koleksi Terbaru (New Arrivals)",
    subtitle: "Desain terkini rilisan minggu ini dengan finishing tepi laser cut presisi",
    maxDisplay: 4,
  },
  bestSellersSection: {
    isActive: true,
    title: "Produk Terlaris (Best Sellers)",
    subtitle: "Pilihan favorit ribuan muslimah Indonesia dengan rating tertinggi",
    maxDisplay: 4,
  },
  uspSection: {
    isActive: true,
    title: "Kenapa Memilih Rahayu Fashion?",
    items: [
      {
        title: "100% Produk Original",
        desc: "Jaminan bahan berkualitas tinggi, jahitan butik, dan lolos QC ketat.",
        icon: "ShieldCheck",
      },
      {
        title: "Gratis Ongkir se-Indonesia",
        desc: "Didukung kurir terpercaya JNE, SiCepat, J&T dengan pelacakan resi real-time.",
        icon: "Truck",
      },
      {
        title: "Garansi Tukar Ukuran 7 Hari",
        desc: "Kekecilan atau kebesaran? Tukar ukuran mudah tanpa ribet.",
        icon: "RefreshCw",
      },
      {
        title: "Customer Support 24/7",
        desc: "Layanan konsultasi ukuran dan pemesanan via WhatsApp resmi.",
        icon: "Clock",
      },
    ],
  },
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // 1. Customer Auth & Profile State (Frontstore)
  const [user, setUser] = useState<CustomerUser | null>(DEFAULT_USER);
  const isLoggedIn = !!user;

  const login = (email: string, name?: string) => {
    setUser({
      ...DEFAULT_USER,
      email,
      name: name || email.split("@")[0].toUpperCase(),
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserProfile = (data: Partial<CustomerUser>) => {
    if (user) {
      setUser((prev) => (prev ? { ...prev, ...data } : null));
    }
  };

  const updateUserAddresses = (addresses: CustomerAddress[]) => {
    if (user) {
      setUser({ ...user, addresses });
    }
  };

  const updateAddress = (addressId: string, updated: Partial<CustomerAddress>) => {
    if (!user) return;
    const newAddresses = user.addresses.map((a) => (a.id === addressId ? { ...a, ...updated } : a));
    setUser({ ...user, addresses: newAddresses });
  };

  const setDefaultAddress = (addressId: string) => {
    if (!user) return;
    const newAddresses = user.addresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    setUser({ ...user, addresses: newAddresses });
  };

  const deleteAddress = (addressId: string) => {
    if (!user) return;
    const newAddresses = user.addresses.filter((a) => a.id !== addressId);
    setUser({ ...user, addresses: newAddresses });
  };

  // 1b. Admin Internal Auth & RBAC State (Admin Portal - Separated from Customer)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // 1c. Fancy Loading & Store Notification State
  const [isStoreLoading, setIsStoreLoading] = useState<boolean>(false);
  const [isSyncingData, setIsSyncingData] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [storeToast, setStoreToast] = useState<{
    id: number;
    title: string;
    message: string;
    type: "success" | "info" | "warning";
  } | null>(null);

  const triggerFancyLoading = (message = "Memuat Koleksi Rahayu...", durationMs = 550) => {
    setIsSyncingData(true);
    setSyncMessage(message);
    setTimeout(() => {
      setIsSyncingData(false);
    }, durationMs);
  };

  const showStoreToast = (
    title: string,
    message: string,
    type: "success" | "info" | "warning" = "success"
  ) => {
    const id = Date.now();
    setStoreToast({ id, title, message, type });
    setTimeout(() => {
      setStoreToast((prev) => (prev?.id === id ? null : prev));
    }, 3600);
  };

  const dismissStoreToast = () => setStoreToast(null);

  // Synchronize admin session from localStorage after initial client mount to prevent SSR hydration mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rahayu_admin_session");
      if (saved) {
        setAdminUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to parse admin session", e);
    }
  }, []);

  // Synchronize live data from PostgreSQL database silently in background without blocking UI
  useEffect(() => {
    async function loadDatabaseData() {
      try {
        const fetchWithTimeout = (url: string) =>
          fetch(url, { signal: AbortSignal.timeout(1500) }).then((r) => r.json());

        const [prodRes, catRes, orderRes, payRes, homeRes] = await Promise.allSettled([
          fetchWithTimeout("/api/products"),
          fetchWithTimeout("/api/categories"),
          fetchWithTimeout("/api/orders"),
          fetchWithTimeout("/api/payment-methods"),
          fetchWithTimeout("/api/homepage-config"),
        ]);

        if (prodRes.status === "fulfilled" && prodRes.value?.success && Array.isArray(prodRes.value.data) && prodRes.value.data.length > 0) {
          const dbProducts = prodRes.value.data.map((p: any) => ({
            id: p.id,
            sku: p.sku,
            name: p.name,
            category: p.categoryId,
            priceIdr: p.priceIdr,
            origPriceIdr: p.origPriceIdr,
            discountPct: p.discountPct,
            promoBadge: p.promoBadge || "",
            promoType: p.promoType || "None",
            isPromoHighlight: p.isPromoHighlight,
            hasVideo: p.hasVideo,
            videoUrl: p.videoUrl || "",
            desc: p.desc,
            rating: p.rating,
            reviewCount: p.reviewCount,
            stock: p.stock,
            imageUrl: p.imageUrl,
          }));

          setProducts((prev) => {
            const merged = dbProducts.map((dbp: any) => {
              const localMatch = prev.find((lp) => lp.id === dbp.id);
              if (localMatch) {
                return {
                  ...dbp,
                  isPromoHighlight: localMatch.isPromoHighlight ?? dbp.isPromoHighlight,
                  promoBadge: localMatch.promoBadge || dbp.promoBadge,
                  discountPct: localMatch.discountPct ?? dbp.discountPct,
                  priceIdr: localMatch.priceIdr ?? dbp.priceIdr,
                  origPriceIdr: localMatch.origPriceIdr ?? dbp.origPriceIdr,
                };
              }
              return dbp;
            });
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem("rahayu_products", JSON.stringify(merged));
              } catch (e) {
                console.warn("Failed to cache merged products", e);
              }
            }
            return merged;
          });
        }

        if (catRes.status === "fulfilled" && catRes.value?.success && Array.isArray(catRes.value.data) && catRes.value.data.length > 0) {
          setCategories(
            catRes.value.data.map((c: any) => {
              const fallbackCat = CATEGORIES_DATA.find((d) => d.id === c.id || d.slug === c.slug);
              return {
                id: c.id,
                slug: c.slug,
                nameId: c.name || fallbackCat?.nameId || c.id,
                nameEn: fallbackCat?.nameEn || c.name || c.id,
                pillar: c.pillar?.title || fallbackCat?.pillar || "Modest Fashion Wanita",
                iconBg: fallbackCat?.iconBg || "#EDE9FE",
                colorHex: fallbackCat?.colorHex || "#7C3AED",
                iconName: c.icon || fallbackCat?.iconName || "Sparkles",
                imageUrl:
                  typeof c.imageUrl === "string"
                    ? c.imageUrl
                    : fallbackCat?.imageUrl || "",
                measurementLabel: c.measurementLabel || fallbackCat?.measurementLabel || "Dimensi",
                variantAttr: c.variantAttributeLabel || fallbackCat?.variantAttr || "Varian",
                sizes: Array.isArray(c.sizes) && c.sizes.length > 0 ? c.sizes : fallbackCat?.sizes || ["All Size"],
                colors: fallbackCat?.colors || [{ name: "Default", hex: "#7C3AED" }],
              };
            })
          );
        }

        if (orderRes.status === "fulfilled" && orderRes.value?.success && Array.isArray(orderRes.value.data) && orderRes.value.data.length > 0) {
          setOrders(
            orderRes.value.data.map((o: any) => ({
              id: o.id,
              createdAt:
                new Date(o.createdAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }) + " WIB",
              status: o.status || "MENUNGGU_PEMBAYARAN",
              items: Array.isArray(o.itemsJson)
                ? o.itemsJson.map((it: any, idx: number) => {
                    const matchedProd =
                      PRODUCTS_DATA.find((p) => p.id === Number(it.product?.id ?? it.productId)) ||
                      PRODUCTS_DATA[0];
                    return {
                      id: it.id || `item-${o.id}-${idx}`,
                      selectedSize: it.selectedSize || "All Size",
                      selectedColor: it.selectedColor || "Default",
                      quantity: Number(it.quantity ?? 1),
                      product:
                        it.product && it.product.name
                          ? {
                              ...matchedProd,
                              ...it.product,
                              priceIdr: Number(it.product.priceIdr ?? matchedProd.priceIdr),
                            }
                          : {
                              ...matchedProd,
                              id: Number(it.productId ?? matchedProd.id),
                              name: it.productName || matchedProd.name,
                              priceIdr: Number(it.priceIdr ?? matchedProd.priceIdr),
                              imageUrl: it.imageUrl || matchedProd.imageUrl,
                            },
                    };
                  })
                : [],
              subtotal: Number(o.subtotal ?? 0),
              shippingCost: Number(o.shippingCost ?? 0),
              discountAmount: Number(o.discountAmount ?? 0),
              totalAmount: Number(o.totalAmount ?? 0),
              courier: {
                code: o.courierCode || "JNE",
                name: o.courierName || "JNE Express",
                service: o.courierService || "Reguler (REG)",
                etd: o.etd || "1-2 Hari",
              },
              awb: o.awb || null,
              address: {
                id: o.addressJson?.id || "ADDR-1",
                label: o.addressJson?.label || "Rumah Utama",
                recipient: o.addressJson?.recipient || o.customerName || "Pelanggan Rahayu",
                phone: o.addressJson?.phone || o.customerPhone || "0812-8877-6655",
                fullAddress:
                  o.addressJson?.fullAddress || "Jl. Senopati No. 42, Kebayoran Baru",
                city: o.addressJson?.city || "Jakarta Selatan, DKI Jakarta",
                postalCode: o.addressJson?.postalCode || "12110",
                isDefault: true,
                tagLocation: o.addressJson?.tagLocation || "Rumah",
              },
              paymentMethod: {
                id: o.paymentMethodId || "va-bca",
                name: o.paymentMethodName || "BCA Virtual Account",
                category: o.paymentCategory || "VIRTUAL_ACCOUNT",
                fee: 0,
              },
              accountNumber: o.accountNumber || undefined,
              accountName: o.accountName || undefined,
              paymentDueDate: o.paymentDueDate || undefined,
              paymentInstructions: Array.isArray(o.paymentInstructions)
                ? o.paymentInstructions
                : [],
              timeline: Array.isArray(o.timelineJson) ? o.timelineJson : [],
            }))
          );
        }

        if (payRes.status === "fulfilled" && payRes.value?.success && Array.isArray(payRes.value.data) && payRes.value.data.length > 0) {
          setPaymentMethods(
            payRes.value.data.map((m: any) => ({
              id: m.id,
              name: m.name,
              category: m.category,
              isActive: m.isActive ?? true,
              fee: Number(m.fee ?? 0),
              icon: m.icon || "Building2",
              description: m.description || "",
              accountNumber: m.accountNumber || undefined,
              accountName: m.accountName || undefined,
              qrImageUrl: m.qrImageUrl || undefined,
              instructions: Array.isArray(m.instructions) ? m.instructions : [],
            }))
          );
        }
      } catch (err) {
        console.warn("Could not sync from database API, fallback to default state", err);
      } finally {
        setIsStoreLoading(false);
        setIsSyncingData(false);
      }
    }

    loadDatabaseData();
  }, []);

  const isAdminLoggedIn = !!adminUser;

  const adminLogin = (email: string, password?: string, role?: AdminRole): boolean => {
    // Check if email matches any demo account
    const matched = DEMO_ADMIN_ACCOUNTS.find(
      (acc) =>
        acc.email.toLowerCase() === email.toLowerCase() ||
        (role && acc.role === role)
    );
    const selectedRole: AdminRole = role || (matched ? matched.role : "SUPER_ADMIN");
    const roleConfig = ADMIN_ROLES_CONFIG[selectedRole];

    const loggedUser: AdminUser = matched
      ? { ...matched, lastLogin: "Baru saja" }
      : {
          id: `ADM-${Date.now().toString().slice(-4)}`,
          name: email.split("@")[0].toUpperCase(),
          email,
          role: selectedRole,
          department: roleConfig.department,
          lastLogin: "Baru saja",
          avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
          phone: "0812-3456-7890",
        };

    setAdminUser(loggedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("rahayu_admin_session", JSON.stringify(loggedUser));
    }
    return true;
  };

  const adminSwitchRole = (newRole: AdminRole) => {
    const demo = DEMO_ADMIN_ACCOUNTS.find((d) => d.role === newRole);
    const roleConfig = ADMIN_ROLES_CONFIG[newRole];
    const updated: AdminUser = demo
      ? { ...demo, lastLogin: "Baru saja (Switch Role)" }
      : {
          id: adminUser?.id || "ADM-SW",
          name: adminUser?.name || "Admin Staff",
          email: adminUser?.email || roleConfig.defaultEmail,
          role: newRole,
          department: roleConfig.department,
          lastLogin: "Baru saja (Switch Role)",
          avatarUrl: adminUser?.avatarUrl,
        };
    setAdminUser(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("rahayu_admin_session", JSON.stringify(updated));
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("rahayu_admin_session");
    }
  };

  // 2. Products State (CRUD & Stock with localStorage & PostgreSQL Persistence)
  const [products, setProducts] = useState<ProductItem[]>(PRODUCTS_DATA);
  const [isProductsHydrated, setIsProductsHydrated] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem("rahayu_products");
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load products from localStorage", e);
    } finally {
      setIsProductsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isProductsHydrated) return;
    try {
      localStorage.setItem("rahayu_products", JSON.stringify(products));
    } catch (e) {
      console.warn("Failed to save products to localStorage", e);
    }
  }, [products, isProductsHydrated]);

  const addProduct = (newProduct: ProductItem) => {
    setProducts((prev) => {
      const next = [newProduct, ...prev];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("rahayu_products", JSON.stringify(next));
        } catch (e) {
          console.warn("Failed to persist new product to localStorage:", e);
        }
      }
      return next;
    });
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sku: newProduct.sku,
        name: newProduct.name,
        categoryId: newProduct.category,
        priceIdr: newProduct.priceIdr,
        origPriceIdr: newProduct.origPriceIdr,
        discountPct: newProduct.discountPct,
        promoBadge: newProduct.promoBadge,
        promoType: newProduct.promoType,
        isPromoHighlight: newProduct.isPromoHighlight,
        hasVideo: newProduct.hasVideo,
        videoUrl: newProduct.videoUrl,
        desc: newProduct.desc,
        rating: newProduct.rating,
        reviewCount: newProduct.reviewCount,
        stock: newProduct.stock,
        imageUrl: newProduct.imageUrl,
      }),
    }).catch((err) => console.warn("Failed to persist new product to DB:", err));
  };

  const updateProduct = (productId: number, updated: Partial<ProductItem>) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === productId ? { ...p, ...updated } : p));
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("rahayu_products", JSON.stringify(next));
        } catch (e) {
          console.warn("Failed to persist updated product to localStorage:", e);
        }
      }
      return next;
    });
    fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: updated.name,
        sku: updated.sku,
        categoryId: updated.category,
        priceIdr: updated.priceIdr,
        origPriceIdr: updated.origPriceIdr,
        discountPct: updated.discountPct,
        promoBadge: updated.promoBadge,
        promoType: updated.promoType,
        isPromoHighlight: updated.isPromoHighlight,
        hasVideo: updated.hasVideo,
        videoUrl: updated.videoUrl,
        desc: updated.desc,
        stock: updated.stock,
        imageUrl: updated.imageUrl,
      }),
    }).catch((err) => console.warn("Failed to update product in DB:", err));
  };

  const deleteProduct = (productId: number) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("rahayu_products", JSON.stringify(next));
        } catch (e) {
          console.warn("Failed to delete product from localStorage:", e);
        }
      }
      return next;
    });
    fetch(`/api/products/${productId}`, { method: "DELETE" }).catch((err) =>
      console.warn("Failed to delete product from DB:", err)
    );
  };

  const updateProductStock = (productId: number, newStock: number) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p));
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("rahayu_products", JSON.stringify(next));
        } catch (e) {
          console.warn("Failed to persist stock to localStorage:", e);
        }
      }
      return next;
    });
    fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: Math.max(0, newStock) }),
    }).catch((err) => console.warn("Failed to update product stock in DB:", err));
  };

  // 3. Cart State (with localStorage Persistence)
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: `${PRODUCTS_DATA[0].id}-115x115 cm-Dusty Lilac`,
      product: PRODUCTS_DATA[0],
      selectedSize: "115x115 cm",
      selectedColor: "Dusty Lilac",
      quantity: 1,
    },
    {
      id: `${PRODUCTS_DATA[1].id}-M (LD 100)-Royal Plum`,
      product: PRODUCTS_DATA[1],
      selectedSize: "M (LD 100)",
      selectedColor: "Royal Plum",
      quantity: 1,
    },
  ]);
  const [isCartHydrated, setIsCartHydrated] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("rahayu_cart_items");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load cart from localStorage", e);
    } finally {
      setIsCartHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isCartHydrated) return;
    try {
      localStorage.setItem("rahayu_cart_items", JSON.stringify(cart));
    } catch (e) {
      console.warn("Failed to save cart to localStorage", e);
    }
  }, [cart, isCartHydrated]);

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const addToCart = (product: ProductItem, size: string, color: string, qty = 1) => {
    const itemId = `${product.id}-${size}-${color}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity: qty,
        },
      ];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateCartQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.product.priceIdr * item.quantity, 0);

  // 4. Orders State & Flow
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);

  const createOrder = (orderData: Omit<OrderRecord, "id" | "createdAt" | "status" | "timeline" | "awb">) => {
    const newId = `INV/${new Date().toISOString().slice(0, 10).replace(/-/g, "")}/RAH/${Math.floor(100000 + Math.random() * 900000)}`;
    const nowStr = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";

    // Grab payment method instructions
    const matchedMethod = paymentMethods.find((p) => p.id === orderData.paymentMethod.id);

    const newOrder: OrderRecord = {
      ...orderData,
      id: newId,
      createdAt: nowStr,
      status: "MENUNGGU_PEMBAYARAN",
      awb: null,
      accountNumber: matchedMethod?.accountNumber,
      accountName: matchedMethod?.accountName,
      paymentInstructions: matchedMethod?.instructions,
      qrImageUrl: matchedMethod?.qrImageUrl,
      paymentDueDate: "24 Jam dari sekarang",
      timeline: [
        {
          time: nowStr,
          status: "MENUNGGU_PEMBAYARAN",
          location: "Sistem Pembayaran Rahayu",
          detail: `Menunggu konfirmasi pembayaran via ${orderData.paymentMethod.name}.`,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Persist to PostgreSQL database
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user?.id,
        customerName: user?.name,
        customerEmail: user?.email,
        customerPhone: user?.phone,
        address: orderData.address,
        courier: orderData.courier,
        items: orderData.items,
        subtotal: orderData.subtotal,
        shippingCost: orderData.shippingCost,
        discountAmount: orderData.discountAmount,
        totalAmount: orderData.totalAmount,
        paymentMethod: orderData.paymentMethod,
        accountNumber: matchedMethod?.accountNumber,
        accountName: matchedMethod?.accountName,
        paymentDueDate: "24 Jam dari sekarang",
        paymentInstructions: matchedMethod?.instructions,
      }),
    }).catch((err) => console.warn("Failed to persist order in DB:", err));

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const nowStr = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const newStep: TrackingStep = {
          time: nowStr,
          status: newStatus,
          location: "Rahayu Hub Control",
          detail: `Status pesanan diperbarui menjadi [${newStatus}].`,
        };
        return {
          ...order,
          status: newStatus,
          timeline: [newStep, ...order.timeline],
        };
      })
    );

    fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).catch((err) => console.warn("Failed to update order status in DB:", err));
  };

  const updateOrderAwb = (orderId: string, awb: string, courierName?: string) => {
    const nowStr = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const newStep: TrackingStep = {
          time: nowStr,
          status: "DIKIRIM",
          location: "Fulfillment Center",
          detail: `Paket diserahkan ke kurir ${courierName || order.courier.name}. Nomor Resi: ${awb}`,
        };
        return {
          ...order,
          status: "DIKIRIM",
          awb,
          timeline: [newStep, ...order.timeline],
        };
      })
    );

    fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ awb, courierName }),
    }).catch((err) => console.warn("Failed to update order AWB in DB:", err));
  };

  const completeOrder = (orderId: string) => {
    updateOrderStatus(orderId, "SELESAI");
  };

  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, "DIBATALKAN");
  };

  // 5. Pillars State (Dynamic CRUD from Admin)
  const [pillars, setPillars] = useState<MarketplacePillar[]>(DEFAULT_PILLARS);

  const addPillar = (newPillar: MarketplacePillar) => {
    setPillars((prev) => [...prev, newPillar]);
  };

  const updatePillar = (pillarId: string, updated: Partial<MarketplacePillar>) => {
    setPillars((prev) =>
      prev.map((p) => (p.id === pillarId ? { ...p, ...updated } : p))
    );
  };

  const deletePillar = (pillarId: string) => {
    setPillars((prev) => prev.filter((p) => p.id !== pillarId));
  };

  // 6. Categories State
  const [categories, setCategories] = useState<RahayuCategory[]>(CATEGORIES_DATA);

  const addCategory = (newCat: RahayuCategory) => {
    setCategories((prev) => [...prev, newCat]);
    const matchedPillar = pillars.find(
      (p) => p.name.toLowerCase() === (newCat.pillar || "").toLowerCase() || p.id === newCat.pillar
    );
    fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: newCat.id,
        name: newCat.nameId,
        tagline: newCat.nameEn || newCat.nameId,
        pillarId: matchedPillar?.id || pillars[0]?.id || "pillar-modest",
        sizes: newCat.sizes,
        measurementLabel: newCat.measurementLabel,
        variantAttributeLabel: newCat.variantAttr,
        icon: newCat.iconName || "Sparkles",
        imageUrl: newCat.imageUrl ?? "",
      }),
    }).catch((err) => console.error("Failed to create category in DB:", err));
  };

  const updateCategory = (categoryId: string, updated: Partial<RahayuCategory>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, ...updated } : cat))
    );

    const payload: Record<string, unknown> = {};
    if (updated.nameId !== undefined) payload.name = updated.nameId;
    if (updated.nameEn !== undefined) payload.tagline = updated.nameEn;
    if (updated.imageUrl !== undefined) payload.imageUrl = updated.imageUrl;
    if (updated.iconName !== undefined) payload.icon = updated.iconName;
    if (updated.measurementLabel !== undefined) payload.measurementLabel = updated.measurementLabel;
    if (updated.variantAttr !== undefined) payload.variantAttributeLabel = updated.variantAttr;
    if (updated.sizes !== undefined) payload.sizes = updated.sizes;
    if (updated.pillar !== undefined) {
      const matchedPillar = pillars.find(
        (p) => p.name.toLowerCase() === updated.pillar!.toLowerCase() || p.id === updated.pillar
      );
      if (matchedPillar) {
        payload.pillarId = matchedPillar.id;
      }
    }

    fetch(`/api/categories/${encodeURIComponent(categoryId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => console.error("Failed to update category in DB:", err));
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    fetch(`/api/categories/${encodeURIComponent(categoryId)}`, {
      method: "DELETE",
    }).catch((err) => console.error("Failed to delete category in DB:", err));
  };

  const addCategorySize = (categoryId: string, newSize: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId && !cat.sizes.includes(newSize)) {
          const nextSizes = [...cat.sizes, newSize];
          fetch(`/api/categories/${encodeURIComponent(categoryId)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sizes: nextSizes }),
          }).catch((err) => console.error("Failed to add category size in DB:", err));
          return { ...cat, sizes: nextSizes };
        }
        return cat;
      })
    );
  };

  const removeCategorySize = (categoryId: string, sizeToRemove: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          const nextSizes = cat.sizes.filter((s) => s !== sizeToRemove);
          fetch(`/api/categories/${encodeURIComponent(categoryId)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sizes: nextSizes }),
          }).catch((err) => console.error("Failed to remove category size in DB:", err));
          return { ...cat, sizes: nextSizes };
        }
        return cat;
      })
    );
  };

  // 7. Homepage Layout Config
  const [homepageConfig, setHomepageConfig] = useState<HomepageSectionConfig>(INITIAL_HOMEPAGE_CONFIG);
  const [isHomepageConfigHydrated, setIsHomepageConfigHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rahayu_homepage_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setHomepageConfig((prev) => ({
            ...prev,
            ...parsed,
            promoHighlightSection: {
              ...prev.promoHighlightSection,
              ...(parsed.promoHighlightSection || {}),
              countdownText:
                parsed.promoHighlightSection?.countdownText ||
                prev.promoHighlightSection.countdownText ||
                "06 Jam : 42 Menit : 19 Detik",
            },
          }));
        }
      }
    } catch (e) {
      console.warn("Failed to load homepage config from localStorage", e);
    } finally {
      setIsHomepageConfigHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHomepageConfigHydrated) return;
    try {
      localStorage.setItem("rahayu_homepage_config", JSON.stringify(homepageConfig));
    } catch (e) {
      console.warn("Failed to save homepage config to localStorage", e);
    }
  }, [homepageConfig, isHomepageConfigHydrated]);

  const updateHomepageConfig = (newConfig: Partial<HomepageSectionConfig>) => {
    setHomepageConfig((prev) => {
      const updated = {
        ...prev,
        ...newConfig,
      };
      try {
        localStorage.setItem("rahayu_homepage_config", JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to sync homepage config to localStorage", e);
      }
      return updated;
    });
    fetch("/api/homepage-config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newConfig),
    }).catch((err) => console.warn("Failed to update homepage config in DB:", err));
  };

  // 7.b Vouchers & Promo Redeem State
  const [vouchers, setVouchers] = useState<VoucherPromo[]>(INITIAL_VOUCHERS);
  const [isVouchersHydrated, setIsVouchersHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rahayu_vouchers");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge terms & new initial vouchers if any are missing
          const enriched: VoucherPromo[] = parsed.map((item: VoucherPromo) => {
            const initialMatch = INITIAL_VOUCHERS.find(
              (iv) => iv.id === item.id || iv.code === item.code
            );
            return {
              ...item,
              categoryTag: item.categoryTag || initialMatch?.categoryTag || "Diskon Belanja",
              terms: (item.terms && item.terms.length > 0) ? item.terms : (initialMatch?.terms || [
                `Berlaku untuk transaksi minimal Rp ${(item.minSpend || 0).toLocaleString("id-ID")}.`,
                `Voucher berlaku hingga ${item.expiryDate}.`,
                "Hanya dapat digunakan 1 kali per akun pengguna.",
                "Tidak dapat digabungkan dengan kode promo sejenis lainnya.",
              ]),
            };
          });

          // Add any newly introduced initial vouchers not yet in user's saved list
          const existingCodes = new Set(enriched.map((e: VoucherPromo) => e.code));
          INITIAL_VOUCHERS.forEach((iv) => {
            if (!existingCodes.has(iv.code)) {
              enriched.push(iv);
            }
          });

          setVouchers(enriched);
        }
      }
    } catch (e) {
      console.warn("Failed to load vouchers from localStorage", e);
    } finally {
      setIsVouchersHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isVouchersHydrated) return;
    try {
      localStorage.setItem("rahayu_vouchers", JSON.stringify(vouchers));
    } catch (e) {
      console.warn("Failed to save vouchers to localStorage", e);
    }
  }, [vouchers, isVouchersHydrated]);

  const addVoucher = (newVoucher: VoucherPromo) => {
    setVouchers((prev) => [newVoucher, ...prev]);
  };

  const updateVoucher = (voucherId: string, updated: Partial<VoucherPromo>) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, ...updated } : v))
    );
  };

  const deleteVoucher = (voucherId: string) => {
    setVouchers((prev) => prev.filter((v) => v.id !== voucherId));
  };

  const toggleVoucherStatus = (voucherId: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, isActive: !v.isActive } : v))
    );
  };

  // 8. Payment Methods Config State
  const [paymentMethods, setPaymentMethods] = useState<PaymentConfig[]>(INITIAL_PAYMENT_METHODS);

  const togglePaymentMethod = (methodId: string) => {
    const target = paymentMethods.find((m) => m.id === methodId);
    setPaymentMethods((prev) =>
      prev.map((m) => (m.id === methodId ? { ...m, isActive: !m.isActive } : m))
    );
    if (target) {
      fetch("/api/payment-methods", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: methodId, isActive: !target.isActive }),
      }).catch((err) => console.warn("Failed to toggle payment method in DB:", err));
    }
  };

  const updatePaymentFee = (methodId: string, fee: number) => {
    setPaymentMethods((prev) =>
      prev.map((m) => (m.id === methodId ? { ...m, fee } : m))
    );
    fetch("/api/payment-methods", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: methodId, fee }),
    }).catch((err) => console.warn("Failed to update payment fee in DB:", err));
  };

  const updatePaymentMethod = (methodId: string, updated: Partial<PaymentConfig>) => {
    setPaymentMethods((prev) =>
      prev.map((m) => (m.id === methodId ? { ...m, ...updated } : m))
    );
    fetch("/api/payment-methods", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: methodId, ...updated }),
    }).catch((err) => console.warn("Failed to update payment method in DB:", err));
  };

  // 9. Live Stream & TikTok Connector State
  const [tiktokConfig, setTiktokConfig] = useState<TikTokLiveConfig>({
    username: "rahayufashion.store",
    nickname: "Rahayu Fashion Store",
    avatarUrl: "",
    signature: "",
    verified: false,
    accountFound: false,
    isLiveOnTikTok: false,
    mode: "AUTO_SYNC",
    isLive: false,
    viewers: 0,
    enterCount: 0,
    likes: 0,
    followers: 0,
    videoCount: 0,
    title: "Live Try-On & Flash Sale: Koleksi Fashion Modern & Hijab Voal",
    voucherCode: "RAHAYULIVE20",
    schedule: "Setiap Hari 19:00 – 22:00 WIB",
    pinnedProductId: 1,
    instagramUrl: "https://www.instagram.com/rahayufashion.id",
    whatsappUrl: "https://wa.me/6281288776655",
    profileUrl: "https://www.tiktok.com/@rahayufashion.store",
    liveUrl: "https://www.tiktok.com/@rahayufashion.store/live",
    lastSyncedAt: "Menyinkronkan...",
    connectionStatus: "OFFLINE",
  });

  useEffect(() => {
    async function loadTikTokState() {
      try {
        // Clear legacy v1 localStorage cache that held hardcoded 1428/48200
        localStorage.removeItem("rahayu_tiktok_config");
        const saved = localStorage.getItem("rahayu_tiktok_live_v2");
        if (saved) {
          const parsed = JSON.parse(saved);
          setTiktokConfig((prev) => ({ ...prev, ...parsed }));
        }
        const res = await fetch("/api/tiktok/live-status?probe=true", {
          signal: AbortSignal.timeout(10000),
        });
        const data = await res.json();
        if (data?.success) {
          setTiktokConfig((prev) => {
            const merged: TikTokLiveConfig = {
              ...prev,
              username: data.username || prev.username,
              nickname: data.nickname ?? prev.nickname,
              avatarUrl: data.avatarUrl ?? prev.avatarUrl,
              signature: data.signature ?? prev.signature,
              verified: Boolean(data.verified),
              accountFound: Boolean(data.accountFound),
              isLiveOnTikTok: Boolean(data.isLiveOnTikTok),
              mode: data.mode || prev.mode,
              isLive: typeof data.isLive === "boolean" ? data.isLive : prev.isLive,
              viewers: typeof data.viewers === "number" ? data.viewers : 0,
              enterCount: typeof data.enterCount === "number" ? data.enterCount : 0,
              likes: typeof data.likes === "number" ? data.likes : 0,
              followers: typeof data.followers === "number" ? data.followers : 0,
              videoCount: typeof data.videoCount === "number" ? data.videoCount : 0,
              title: data.title || prev.title,
              voucherCode: data.voucherCode || prev.voucherCode,
              schedule: data.schedule || prev.schedule,
              pinnedProductId:
                typeof data.pinnedProductId === "number"
                  ? data.pinnedProductId
                  : prev.pinnedProductId,
              instagramUrl: data.instagramUrl || prev.instagramUrl,
              whatsappUrl: data.whatsappUrl || prev.whatsappUrl,
              profileUrl: data.profileUrl || `https://www.tiktok.com/@${data.username || prev.username}`,
              liveUrl: data.liveUrl || `https://www.tiktok.com/@${data.username || prev.username}/live`,
              lastSyncedAt: data.lastSyncedAt || prev.lastSyncedAt,
              connectionStatus: data.connectionStatus || prev.connectionStatus,
            };
            localStorage.setItem("rahayu_tiktok_live_v2", JSON.stringify(merged));
            return merged;
          });
        }
      } catch (e) {
        // Fallback silently to local/default state
      }
    }
    loadTikTokState();
    const interval = setInterval(loadTikTokState, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateTikTokConfig = async (partial: Partial<TikTokLiveConfig>) => {
    const cleanUsername = (partial.username ?? tiktokConfig.username).replace(/^@/, "").trim() || "rahayufashion.store";
    const nextState: TikTokLiveConfig = {
      ...tiktokConfig,
      ...partial,
      username: cleanUsername,
      profileUrl: `https://www.tiktok.com/@${cleanUsername}`,
      liveUrl: `https://www.tiktok.com/@${cleanUsername}/live`,
      lastSyncedAt:
        new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " WIB",
    };
    setTiktokConfig(nextState);
    if (typeof window !== "undefined") {
      localStorage.setItem("rahayu_tiktok_live_v2", JSON.stringify(nextState));
    }
    try {
      const res = await fetch("/api/tiktok/live-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partial.username ? { ...nextState, action: "SYNC_NOW" } : nextState),
      });
      const data = await res.json();
      if (data?.success) {
        setTiktokConfig((prev) => {
          const updated: TikTokLiveConfig = {
            ...prev,
            ...data,
            profileUrl: data.profileUrl || prev.profileUrl,
            liveUrl: data.liveUrl || prev.liveUrl,
          };
          if (typeof window !== "undefined") {
            localStorage.setItem("rahayu_tiktok_live_v2", JSON.stringify(updated));
          }
          return updated;
        });
      }
    } catch (e) {
      console.warn("Could not persist TikTok config to API:", e);
    }
  };

  const syncTikTokLiveNow = async (customUsername?: string) => {
    const targetUser = (customUsername ?? tiktokConfig.username).replace(/^@/, "").trim() || "rahayufashion.store";
    try {
      const res = await fetch("/api/tiktok/live-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: targetUser,
          mode: tiktokConfig.mode,
          action: "TEST_CONNECTION",
        }),
      });
      const data = await res.json();
      if (data?.success) {
        const nextState: TikTokLiveConfig = {
          ...tiktokConfig,
          ...data,
          username: data.username || targetUser,
          profileUrl: `https://www.tiktok.com/@${data.username || targetUser}`,
          liveUrl: `https://www.tiktok.com/@${data.username || targetUser}/live`,
        };
        setTiktokConfig(nextState);
        if (typeof window !== "undefined") {
          localStorage.setItem("rahayu_tiktok_live_v2", JSON.stringify(nextState));
        }
        return data;
      }
      return data;
    } catch (err: any) {
      return { success: false, error: err?.message || "Connection test failed" };
    }
  };

  const isLiveActive = tiktokConfig.isLive;
  const liveViewers = tiktokConfig.viewers;
  const toggleLiveActive = () => {
    const nextLive = !tiktokConfig.isLive;
    updateTikTokConfig({
      mode: "MANUAL_LIVE",
      isLive: nextLive,
      connectionStatus: nextLive ? "SIMULCAST_ACTIVE" : "OFFLINE",
    });
  };

  // 10. AI Modular Features Switchboard State
  const [aiFeaturesConfig, setAiFeaturesConfig] = useState<AiFeaturesConfig>(DEFAULT_AI_FEATURES_CONFIG);

  const updateAiFeaturesConfig = (newConfig: Partial<AiFeaturesConfig>) => {
    setAiFeaturesConfig((prev) => ({
      ...prev,
      ...newConfig,
    }));
  };

  // 11. AI Photo Studio Logs
  const [aiLogs, setAiLogs] = useState<AiPhotoLog[]>(INITIAL_AI_LOGS);

  const generateAiPhoto = (data: {
    productName: string;
    category: string;
    modelType: string;
    lighting: string;
    background: string;
  }): AiPhotoLog => {
    const cost = Math.floor(480 + Math.random() * 80);
    const nowStr = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";

    const prompt = `Photorealistic editorial shot of Indonesian woman (${data.modelType}) wearing "${data.productName}" (${data.category}). Set in ${data.background}, lit by ${data.lighting}. Clean modest fashion commercial quality, 8k resolution.`;

    const sampleImages = [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
    ];
    const outputUrl = sampleImages[Math.floor(Math.random() * sampleImages.length)];

    const newLog: AiPhotoLog = {
      id: `AI-GEN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: nowStr,
      productName: data.productName,
      category: data.category,
      modelType: data.modelType,
      lighting: data.lighting,
      background: data.background,
      costIdr: cost,
      status: "COMPLETED",
      prompt,
      outputUrl,
    };

    setAiLogs((prev) => [newLog, ...prev]);
    return newLog;
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        logout,
        updateUserProfile,
        updateUserAddresses,
        updateAddress,
        setDefaultAddress,
        deleteAddress,
        adminUser,
        isAdminLoggedIn,
        adminLogin,
        adminSwitchRole,
        adminLogout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,
        cart,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartCount,
        cartTotal,
        orders,
        createOrder,
        updateOrderStatus,
        updateOrderAwb,
        completeOrder,
        cancelOrder,
        pillars,
        addPillar,
        updatePillar,
        deletePillar,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        addCategorySize,
        removeCategorySize,
        homepageConfig,
        updateHomepageConfig,
        vouchers,
        addVoucher,
        updateVoucher,
        deleteVoucher,
        toggleVoucherStatus,
        paymentMethods,
        togglePaymentMethod,
        updatePaymentFee,
        updatePaymentMethod,
        isLiveActive,
        liveViewers,
        toggleLiveActive,
        tiktokConfig,
        updateTikTokConfig,
        syncTikTokLiveNow,
        aiFeaturesConfig,
        updateAiFeaturesConfig,
        aiLogs,
        generateAiPhoto,
        isStoreLoading,
        isSyncingData,
        syncMessage,
        triggerFancyLoading,
        storeToast,
        showStoreToast,
        dismissStoreToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
