"use client";

import React, { createContext, useContext, useState } from "react";
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

  // Payment Methods (Admin control)
  paymentMethods: PaymentConfig[];
  togglePaymentMethod: (methodId: string) => void;
  updatePaymentFee: (methodId: string, fee: number) => void;
  updatePaymentMethod: (methodId: string, updated: Partial<PaymentConfig>) => void;

  // Live Stream
  isLiveActive: boolean;
  liveViewers: number;
  toggleLiveActive: () => void;

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
    prompt: "Full-body portrait of Indonesian woman wearing royal plum modest loose tunic, standing gracefully against clean textured beige wall, natural soft shadows, Zalora premium aesthetic.",
    outputUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
  },
];

const INITIAL_HOMEPAGE_CONFIG: HomepageSectionConfig = {
  hero: {
    badge: "KOLEKSI RAYA & MODEST 2026",
    title: "Elegansi Kesederhanaan Busana Muslimah",
    description: "Koleksi busana muslim wanita, hijab voal ultrafine, baju hamil busui friendly, dan pakaian anak dengan material katun & silk bersertifikasi standar tinggi.",
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
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("rahayu_admin_session");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse admin session", e);
        }
      }
    }
    return null;
  });

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

  // 2. Products State (CRUD & Stock)
  const [products, setProducts] = useState<ProductItem[]>(PRODUCTS_DATA);

  const addProduct = (newProduct: ProductItem) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (productId: number, updated: Partial<ProductItem>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updated } : p))
    );
  };

  const deleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateProductStock = (productId: number, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p))
    );
  };

  // 3. Cart State
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
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

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
  };

  const updateCategory = (categoryId: string, updated: Partial<RahayuCategory>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, ...updated } : cat))
    );
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
  };

  const addCategorySize = (categoryId: string, newSize: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId && !cat.sizes.includes(newSize)) {
          return { ...cat, sizes: [...cat.sizes, newSize] };
        }
        return cat;
      })
    );
  };

  const removeCategorySize = (categoryId: string, sizeToRemove: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return { ...cat, sizes: cat.sizes.filter((s) => s !== sizeToRemove) };
        }
        return cat;
      })
    );
  };

  // 7. Homepage Layout Config
  const [homepageConfig, setHomepageConfig] = useState<HomepageSectionConfig>(INITIAL_HOMEPAGE_CONFIG);

  const updateHomepageConfig = (newConfig: Partial<HomepageSectionConfig>) => {
    setHomepageConfig((prev) => ({
      ...prev,
      ...newConfig,
    }));
  };

  // 8. Payment Methods Config State
  const [paymentMethods, setPaymentMethods] = useState<PaymentConfig[]>(INITIAL_PAYMENT_METHODS);

  const togglePaymentMethod = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.map((m) => (m.id === methodId ? { ...m, isActive: !m.isActive } : m))
    );
  };

  const updatePaymentFee = (methodId: string, fee: number) => {
    setPaymentMethods((prev) =>
      prev.map((m) => (m.id === methodId ? { ...m, fee } : m))
    );
  };

  const updatePaymentMethod = (methodId: string, updated: Partial<PaymentConfig>) => {
    setPaymentMethods((prev) =>
      prev.map((m) => (m.id === methodId ? { ...m, ...updated } : m))
    );
  };

  // 9. Live Stream State
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [liveViewers] = useState<number>(1420);

  const toggleLiveActive = () => setIsLiveActive((prev) => !prev);

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
        paymentMethods,
        togglePaymentMethod,
        updatePaymentFee,
        updatePaymentMethod,
        isLiveActive,
        liveViewers,
        toggleLiveActive,
        aiFeaturesConfig,
        updateAiFeaturesConfig,
        aiLogs,
        generateAiPhoto,
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
