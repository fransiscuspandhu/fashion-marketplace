"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CATEGORIES_DATA,
  PRODUCTS_DATA,
  ProductItem,
  RahayuCategory,
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
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: string;
  points: number;
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
}

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

interface StoreContextType {
  // Auth
  user: CustomerUser | null;
  isLoggedIn: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateUserAddresses: (addresses: CustomerAddress[]) => void;

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

  // Orders
  orders: OrderRecord[];
  createOrder: (orderData: Omit<OrderRecord, "id" | "createdAt" | "status" | "timeline" | "awb">) => OrderRecord;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  updateOrderAwb: (orderId: string, awb: string, courierName?: string) => void;

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

  // Live Stream
  isLiveActive: boolean;
  liveViewers: number;
  toggleLiveActive: () => void;

  // AI Photos
  aiLogs: AiPhotoLog[];
  generateAiPhoto: (data: {
    productName: string;
    category: string;
    modelType: string;
    lighting: string;
    background: string;
  }) => AiPhotoLog;
}

export interface HomepageSectionConfig {
  hero: {
    badge: string;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    backgroundImageUrl?: string; // Standar: 1920x640 px (3:1 Widescreen), min 1200x480 px, maks 1.5 MB
    overlayOpacity?: number; // 0 - 100%
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

const DEFAULT_USER: CustomerUser = {
  id: "CUST-88192",
  name: "Siti Rahmawati",
  email: "siti.rahmawati@gmail.com",
  phone: "0812-8877-6655",
  tier: "Rahayu Gold Member",
  points: 1250,
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
  },
  {
    id: "va-bca",
    name: "BCA Virtual Account",
    category: "VIRTUAL_ACCOUNT",
    isActive: true,
    fee: 2000,
    icon: "Building2",
    description: "Nomor VA instan 8009-xxxx-xxxx otomatis dicek 24/7",
  },
  {
    id: "va-mandiri",
    name: "Mandiri Virtual Account",
    category: "VIRTUAL_ACCOUNT",
    isActive: true,
    fee: 2000,
    icon: "Building2",
    description: "Pembayaran via Mandiri Livin atau ATM",
  },
  {
    id: "va-bri",
    name: "BRI Virtual Account (BRIVA)",
    category: "VIRTUAL_ACCOUNT",
    isActive: true,
    fee: 2000,
    icon: "Building2",
    description: "Pembayaran instan via BRImo",
  },
  {
    id: "cc-visa-master",
    name: "Kartu Kredit / Debit (Visa, Mastercard, JCB)",
    category: "CREDIT_CARD",
    isActive: true,
    fee: 2500,
    icon: "CreditCard",
    description: "Aman dengan 3D Secure OTP & proteksi bank",
  },
  {
    id: "cod-cash",
    name: "Cash on Delivery (COD / Bayar di Tempat)",
    category: "COD",
    isActive: true,
    fee: 5000,
    icon: "Banknote",
    description: "Bayar tunai ke kurir SiCepat / J&T saat pesanan tiba di rumah",
  },
];

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: "INV/20261112/RAH/00912",
    createdAt: "12 Nov 2026, 14:30 WIB",
    status: "DIKIRIM",
    items: [
      {
        id: "item-1",
        product: PRODUCTS_DATA[0], // Hijab Voal
        selectedSize: "115x115 cm",
        selectedColor: "Dusty Lilac",
        quantity: 2,
      },
      {
        id: "item-2",
        product: PRODUCTS_DATA[1], // Tunik Silk
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
        time: "13 Nov 2026, 08:30 WIB",
        status: "SEDANG_DIANTAR",
        location: "Kebayoran Baru Hub",
        detail: "Paket dibawa kurir [Bpk. Agus] menuju alamat penerima.",
      },
      {
        time: "12 Nov 2026, 21:15 WIB",
        status: "TRANSIT",
        location: "Jakarta Gateway DC",
        detail: "Paket telah tiba di pusat sortir transit Jakarta Selatan.",
      },
      {
        time: "12 Nov 2026, 16:45 WIB",
        status: "MANIFEST",
        location: "Rahayu Fulfillment Center, Bandung",
        detail: "Paket telah diserahkan kepada kurir JNE Express.",
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
        product: PRODUCTS_DATA[3], // Kulot Plisket
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
  // 1. Auth State
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

  const updateUserAddresses = (addresses: CustomerAddress[]) => {
    if (user) {
      setUser({ ...user, addresses });
    }
  };

  // 2. Cart State
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

  // 3. Orders State
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

    const newOrder: OrderRecord = {
      ...orderData,
      id: newId,
      createdAt: nowStr,
      status: "MENUNGGU_PEMBAYARAN",
      awb: null,
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

  // 3b. Pillars State (Dynamic CRUD from Admin, without the word "Pilar")
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

  // 4. Categories State (Dynamic CRUD & Sizes per Category)
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

  // 4b. Homepage & Section Layout Config State (Admin control)
  const [homepageConfig, setHomepageConfig] = useState<HomepageSectionConfig>(INITIAL_HOMEPAGE_CONFIG);

  const updateHomepageConfig = (newConfig: Partial<HomepageSectionConfig>) => {
    setHomepageConfig((prev) => ({
      ...prev,
      ...newConfig,
    }));
  };

  // 5. Payment Methods Config State
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

  // 6. Live Stream State
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [liveViewers] = useState<number>(1420);

  const toggleLiveActive = () => setIsLiveActive((prev) => !prev);

  // 7. AI Photo Studio Logs
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
        updateUserAddresses,
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
        isLiveActive,
        liveViewers,
        toggleLiveActive,
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
