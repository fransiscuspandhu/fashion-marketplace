"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Layers,
  CreditCard,
  Percent,
  Sparkles,
  Search,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  Video,
  Play,
  Sliders,
  Settings,
  ChevronRight,
  Eye,
  Radio,
  Share2,
} from "lucide-react";
import {
  useStore,
  OrderStatus,
  PaymentConfig,
} from "@/context/StoreContext";
import { PRODUCTS_DATA, ProductItem, RahayuCategory } from "@/data/mock-data";

export default function AdminPage() {
  const {
    orders,
    updateOrderStatus,
    updateOrderAwb,
    categories,
    addCategorySize,
    removeCategorySize,
    paymentMethods,
    togglePaymentMethod,
    updatePaymentFee,
    isLiveActive,
    liveViewers,
    toggleLiveActive,
    aiLogs,
    generateAiPhoto,
  } = useStore();

  const [activeModule, setActiveModule] = useState<
    | "analytics"
    | "categories"
    | "products"
    | "orders"
    | "payments"
    | "promos"
    | "ai-studio"
    | "cms-seo"
  >("analytics");

  // Category Size Manager State
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || "Hijab");
  const [newSizeInput, setNewSizeInput] = useState<string>("");

  // AWB Input State
  const [awbInputs, setAwbInputs] = useState<Record<string, string>>({});

  // AI Studio Form State
  const [aiProduct, setAiProduct] = useState("Koleksi Baru Gamis Silk Lilac");
  const [aiCategory, setAiCategory] = useState("Atasan Muslim Wanita");
  const [aiModel, setAiModel] = useState("Wanita Indonesia Modest Elegance (Usia 26)");
  const [aiLighting, setAiLighting] = useState("Soft Golden Hour Natural Sunlight");
  const [aiBackground, setAiBackground] = useState("Scandinavian Arch with Warm Travertine");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Analytics Metrics Calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const activeShipments = orders.filter((o) => o.status === "DIKIRIM" || o.status === "DIKEMAS").length;

  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  const handleAddSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSizeInput.trim()) return;
    addCategorySize(selectedCatId, newSizeInput.trim());
    setNewSizeInput("");
  };

  const handleSaveAwb = (orderId: string) => {
    const val = awbInputs[orderId];
    if (!val || !val.trim()) {
      alert("Masukkan nomor resi terlebih dahulu!");
      return;
    }
    updateOrderAwb(orderId, val.trim());
    alert(`Nomor resi ${val.trim()} berhasil disimpan dan pelanggan dapat melacak paket!`);
  };

  const handleTriggerAiPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAiGenerating(true);
    setTimeout(() => {
      generateAiPhoto({
        productName: aiProduct,
        category: aiCategory,
        modelType: aiModel,
        lighting: aiLighting,
        background: aiBackground,
      });
      setIsAiGenerating(false);
      alert("Foto model AI berhasil dibuat (~Rp 500 terpotong dari saldo API)!");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col text-zinc-900">
      {/* 1. Admin Topbar */}
      <header className="bg-zinc-900 text-white border-b border-zinc-800 px-6 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-bold text-white text-xs">
              RF
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide block">
                Rahayu Control Panel
              </span>
              <span className="text-[10px] text-zinc-400 block">
                Internal Marketplace & Store Management (v4.0)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Live TikTok Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-full border border-zinc-700">
              <span
                className={`w-2 h-2 rounded-full ${
                  isLiveActive ? "bg-rose-500 animate-pulse" : "bg-zinc-500"
                }`}
              />
              <span className="text-[11px] font-medium text-zinc-300">
                TikTok Live:{" "}
                <strong className={isLiveActive ? "text-rose-400" : "text-zinc-400"}>
                  {isLiveActive ? `ONLINE (${liveViewers})` : "OFFLINE"}
                </strong>
              </span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <span>Lihat Toko (Frontstore)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-zinc-700">
              <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-300">
                O
              </div>
              <span className="hidden md:inline text-xs font-medium text-zinc-300">
                Owner Rahayu
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Admin Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (8 Internal Modules) */}
        <aside className="w-64 bg-white border-r border-zinc-200 p-4 shrink-0 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3 block mb-2">
              Menu Kontrol Marketplace
            </span>

            <button
              onClick={() => setActiveModule("analytics")}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                activeModule === "analytics"
                  ? "bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>Analisa & Dashboard</span>
            </button>

            <button
              onClick={() => setActiveModule("categories")}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                activeModule === "categories"
                  ? "bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Kategori & Ukuran Dinamis</span>
            </button>

            <button
              onClick={() => setActiveModule("products")}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                activeModule === "products"
                  ? "bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <Package className="w-4 h-4 text-purple-600" />
              <span>Katalog & Video Singkat</span>
            </button>

            <button
              onClick={() => setActiveModule("orders")}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                activeModule === "orders"
                  ? "bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-purple-600" />
                <span>Pesanan & No. Resi</span>
              </div>
              {orders.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveModule("payments")}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                activeModule === "payments"
                  ? "bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <CreditCard className="w-4 h-4 text-purple-600" />
              <span>Payment Gateway</span>
            </button>

            <button
              onClick={() => setActiveModule("promos")}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                activeModule === "promos"
                  ? "bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <Percent className="w-4 h-4 text-purple-600" />
              <span>Promo & Highlight Badges</span>
            </button>

            <button
              onClick={() => setActiveModule("ai-studio")}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                activeModule === "ai-studio"
                  ? "bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Studio Foto AI</span>
              </div>
              <span className="text-[10px] text-purple-700 font-bold bg-purple-100 px-1.5 py-0.5 rounded">
                ~Rp 500
              </span>
            </button>

            <button
              onClick={() => setActiveModule("cms-seo")}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                activeModule === "cms-seo"
                  ? "bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <Share2 className="w-4 h-4 text-purple-600" />
              <span>SEO CMS & TikTok Live</span>
            </button>
          </div>

          <div className="pt-4 border-t border-zinc-200 text-[11px] text-zinc-500 space-y-1">
            <span className="font-semibold text-zinc-700 block">Status Cloud Server:</span>
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All Systems Operational</span>
            </div>
            <p className="text-[10px] text-zinc-400">
              Biaya Egress: Rp 0 (Cloudflare R2 Free Tier)
            </p>
          </div>
        </aside>

        {/* Right Main Panel */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* MODULE 1: DASHBOARD & SALES ANALYTICS */}
          {activeModule === "analytics" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-zinc-900">
                  Dashboard & Analisa Penjualan Bisnis
                </h1>
                <p className="text-xs text-zinc-500">
                  Ringkasan metrik omset, nilai rata-rata pesanan, dan konversi pelanggan
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-2xs">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                      Total Penjualan Kotor
                    </span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-2xl font-extrabold text-zinc-900 block">
                    Rp {totalRevenue.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                    ↑ +24.8% vs minggu lalu
                  </span>
                </div>

                <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-2xs">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                      Total Pesanan Masuk
                    </span>
                    <ShoppingCart className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-2xl font-extrabold text-zinc-900 block">
                    {totalOrders} Transaksi
                  </span>
                  <span className="text-[11px] text-purple-600 font-semibold mt-1 block">
                    {activeShipments} Dalam Pengiriman
                  </span>
                </div>

                <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-2xs">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                      Rata-Rata Keranjang (AOV)
                    </span>
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-2xl font-extrabold text-zinc-900 block">
                    Rp {avgOrderValue.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 block">
                    Target AOV: Rp 300.000
                  </span>
                </div>

                <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-2xs">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                      Konversi TikTok Live
                    </span>
                    <Users className="w-4 h-4 text-rose-600" />
                  </div>
                  <span className="text-2xl font-extrabold text-zinc-900 block">
                    4.6%
                  </span>
                  <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
                    {liveViewers} Live Viewers Sekarang
                  </span>
                </div>
              </div>

              {/* Analytics Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sales by Top Category */}
                <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-zinc-200 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 mb-4">
                    Distribusi Penjualan per Kategori (Pilar Modest & Hamil)
                  </h3>
                  <div className="space-y-3 text-xs">
                    {[
                      { name: "Hijab (Voal Ultrafine)", pct: 38, rev: "Rp 12.450.000" },
                      { name: "Atasan Muslim Wanita (Tunik)", pct: 27, rev: "Rp 8.920.000" },
                      { name: "Baju Hamil & Busui", pct: 18, rev: "Rp 5.840.000" },
                      { name: "Bawahan Muslim & Kulot", pct: 11, rev: "Rp 3.600.000" },
                      { name: "Pakaian Bayi & Anak", pct: 6, rev: "Rp 1.950.000" },
                    ].map((cat, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-zinc-700 font-medium mb-1">
                          <span>{cat.name}</span>
                          <span className="font-bold text-zinc-900">{cat.rev} ({cat.pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-700 rounded-full"
                            style={{ width: `${cat.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Stream Traffic & Conversion Box */}
                <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-zinc-200 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                        TikTok Live Stream Monitor
                      </h3>
                      <button
                        onClick={toggleLiveActive}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                          isLiveActive
                            ? "bg-rose-100 text-rose-700"
                            : "bg-zinc-200 text-zinc-700"
                        }`}
                      >
                        {isLiveActive ? "Matikan Live" : "Aktifkan Live"}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-600 mb-4">
                      Host sedang menyematkan voucher <strong>RAHAYUPAYDAY</strong> dan produk
                      Voal Scarf & Tunik Royal Plum di keranjang kuning.
                    </p>
                    <div className="bg-zinc-50 p-3 rounded text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Pemirsa Aktif:</span>
                        <span className="font-bold text-zinc-900">{liveViewers} orang</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Checkout dari Live:</span>
                        <span className="font-bold text-emerald-600">64 pesanan hari ini</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 text-[11px] text-zinc-400">
                    Terhubung otomatis ke TikTok Live Shop API webhook
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: CATEGORIES & DYNAMIC SIZES PER CATEGORY */}
          {activeModule === "categories" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-zinc-900">
                  Manajemen Kategori & Ukuran Dinamis
                </h1>
                <p className="text-xs text-zinc-500">
                  Konfigurasikan preset ukuran (S/M/L, cm, All Size) untuk setiap 11 kategori
                  produk. Perubahan di sini langsung sinkron ke halaman PDP & keranjang.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Category Picker List */}
                <div className="lg:col-span-5 bg-white p-4 rounded-lg border border-zinc-200 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-3 px-2">
                    Daftar 11 Kategori Resmi
                  </h3>
                  <div className="space-y-1 max-h-[460px] overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCatId(cat.id)}
                        className={`w-full text-left p-3 rounded text-xs flex items-center justify-between cursor-pointer transition ${
                          selectedCatId === cat.id
                            ? "bg-purple-100/70 text-purple-900 font-bold border-l-4 border-purple-700"
                            : "hover:bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        <div>
                          <span className="block font-semibold">{cat.nameId}</span>
                          <span className="text-[10px] text-zinc-500">
                            Pilar {cat.pillar} • {cat.sizes.length} preset ukuran
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-400" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Category Detail & Size Editor */}
                <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-zinc-200 shadow-2xs space-y-6">
                  <div className="border-b border-zinc-100 pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                      Konfigurasi Ukuran & Varian
                    </span>
                    <h2 className="text-lg font-bold text-zinc-900 mt-0.5">
                      {activeCategory.nameId}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Label Pengukuran: <strong>{activeCategory.measurementLabel}</strong>
                    </p>
                  </div>

                  {/* Active Sizes Chips */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
                      Preset Ukuran Aktif di Frontstore:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {activeCategory.sizes.map((sz) => (
                        <div
                          key={sz}
                          className="px-3 py-1.5 bg-zinc-100 border border-zinc-300 rounded-md text-xs font-medium text-zinc-800 flex items-center gap-2 group"
                        >
                          <span>{sz}</span>
                          <button
                            type="button"
                            onClick={() => removeCategorySize(activeCategory.id, sz)}
                            className="text-zinc-400 hover:text-rose-600 transition cursor-pointer"
                            title="Hapus ukuran"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add New Size Form */}
                  <form onSubmit={handleAddSize} className="pt-4 border-t border-zinc-100">
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Tambah Opsi Ukuran Baru ke Kategori Ini:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSizeInput}
                        onChange={(e) => setNewSizeInput(e.target.value)}
                        placeholder="cth. XXL (LD 120) atau 140x140 cm..."
                        className="flex-1 px-3 py-2 border border-zinc-300 rounded text-xs focus:outline-none focus:border-purple-700"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 3: PRODUCTS & SHORT VIDEO MANAGER */}
          {activeModule === "products" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">
                    Katalog Produk & Video Singkat (9:16)
                  </h1>
                  <p className="text-xs text-zinc-500">
                    Kelola produk, tautan video singkat PDP, dan badge promo highlight
                  </p>
                </div>
                <button
                  onClick={() => alert("Form Tambah Produk Baru terbuka (simulasi)!")}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Produk Baru</span>
                </button>
              </div>

              {/* Table of Products */}
              <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-semibold text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Produk & SKU</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Harga Jual</th>
                      <th className="py-3 px-4">Badge Promo</th>
                      <th className="py-3 px-4">Video PDP (9:16)</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-700">
                    {PRODUCTS_DATA.map((product) => (
                      <tr key={product.id} className="hover:bg-zinc-50">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="w-10 h-12 bg-zinc-100 rounded overflow-hidden shrink-0 border border-zinc-200">
                            <img
                              src={`https://images.unsplash.com/photo-${1584917865442 + product.id * 1000}?auto=format&fit=crop&w=150&q=80`}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-zinc-900 block leading-snug">
                              {product.name}
                            </span>
                            <span className="font-mono text-[10px] text-zinc-400">
                              {product.sku}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{product.category}</td>
                        <td className="py-3 px-4 font-bold text-zinc-900">
                          Rp {product.priceIdr.toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">
                            {product.promoBadge}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {product.hasVideo ? (
                            <span className="inline-flex items-center gap-1 text-purple-700 font-semibold text-[11px]">
                              <Play className="w-3 h-3 fill-current" />
                              <span>Video Aktif</span>
                            </span>
                          ) : (
                            <span className="text-zinc-400 text-[11px]">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => alert(`Edit produk ${product.name}`)}
                            className="text-xs text-purple-700 hover:underline font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE 4: ORDERS & AWB RESI DISPATCHER */}
          {activeModule === "orders" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-zinc-900">
                  Manajemen Pesanan & Input Resi Pengiriman (AWB)
                </h1>
                <p className="text-xs text-zinc-500">
                  Ubah status pesanan pelanggan dan input nomor resi kurir JNE/SiCepat/J&T agar
                  langsung terlacak di halaman Profil pelanggan.
                </p>
              </div>

              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg border border-zinc-200 p-5 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100 text-xs">
                      <div>
                        <span className="font-bold text-zinc-900 font-mono text-sm block">
                          {order.id}
                        </span>
                        <span className="text-zinc-500">{order.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value as OrderStatus)
                          }
                          className="px-3 py-1.5 border border-zinc-300 rounded text-xs font-semibold focus:outline-none"
                        >
                          <option value="MENUNGGU_PEMBAYARAN">MENUNGGU PEMBAYARAN</option>
                          <option value="DIKEMAS">SEDANG DIKEMAS</option>
                          <option value="DIKIRIM">DIKIRIM (DALAM PERJALANAN)</option>
                          <option value="SELESAI">SELESAI (DELIVERED)</option>
                          <option value="DIBATALKAN">DIBATALKAN</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-zinc-400 uppercase font-semibold text-[10px] block">
                          Penerima & Alamat:
                        </span>
                        <p className="font-bold text-zinc-800">
                          {order.address.recipient} ({order.address.phone})
                        </p>
                        <p className="text-zinc-600 text-[11px] truncate">
                          {order.address.fullAddress}, {order.address.city}
                        </p>
                      </div>

                      <div>
                        <span className="text-zinc-400 uppercase font-semibold text-[10px] block">
                          Kurir & Total Bayar:
                        </span>
                        <p className="font-bold text-zinc-800">
                          {order.courier.name} ({order.courier.service})
                        </p>
                        <p className="text-purple-700 font-bold text-sm">
                          Rp {order.totalAmount.toLocaleString("id-ID")}
                        </p>
                      </div>

                      {/* Input Nomor Resi AWB */}
                      <div className="space-y-1.5">
                        <span className="text-zinc-400 uppercase font-semibold text-[10px] block">
                          Nomor Resi Kurir (AWB):
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            defaultValue={order.awb || ""}
                            onChange={(e) =>
                              setAwbInputs({ ...awbInputs, [order.id]: e.target.value })
                            }
                            placeholder="cth. JNE-88291029"
                            className="flex-1 px-2.5 py-1.5 border border-zinc-300 rounded font-mono text-xs focus:outline-none uppercase"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveAwb(order.id)}
                            className="px-3 py-1.5 bg-zinc-900 hover:bg-purple-900 text-white rounded text-xs font-semibold cursor-pointer"
                          >
                            Simpan
                          </button>
                        </div>
                        {order.awb && (
                          <span className="text-[10px] text-emerald-600 font-semibold block">
                            ✓ Resi aktif terlacak oleh pelanggan
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 5: PAYMENT GATEWAYS CONTROL PANEL */}
          {activeModule === "payments" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-zinc-900">
                  Pengaturan Metode Pembayaran (Payment Gateway)
                </h1>
                <p className="text-xs text-zinc-500">
                  Aktifkan atau nonaktifkan channel pembayaran (QRIS, VA Bank, CC, COD) dan atur
                  biaya admin bank yang dibebankan.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden shadow-2xs">
                <div className="divide-y divide-zinc-200">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-zinc-50"
                    >
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => togglePaymentMethod(method.id)}
                          className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                            method.isActive ? "bg-purple-700" : "bg-zinc-300"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                              method.isActive ? "left-7" : "left-1"
                            }`}
                          />
                        </button>

                        <div>
                          <span className="font-bold text-xs text-zinc-900 block">
                            {method.name}
                          </span>
                          <span className="text-[11px] text-zinc-500 block">
                            {method.description}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-zinc-500">Biaya Admin:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-zinc-700">Rp</span>
                          <input
                            type="number"
                            value={method.fee}
                            onChange={(e) =>
                              updatePaymentFee(method.id, parseInt(e.target.value) || 0)
                            }
                            className="w-20 px-2 py-1 border border-zinc-300 rounded text-xs font-mono font-bold"
                          />
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            method.isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-zinc-200 text-zinc-600"
                          }`}
                        >
                          {method.isActive ? "Aktif di Checkout" : "Nonaktif"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 6: PROMOS, BADGES & FLASH SALES */}
          {activeModule === "promos" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-zinc-900">
                  Manajemen Promo, Badges & Countdown Flash Sale
                </h1>
                <p className="text-xs text-zinc-500">
                  Atur voucher diskon, banner pengumuman atas, dan label promo highlight di toko.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-100 pb-2">
                    Voucher Aktif
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="font-mono font-bold text-purple-900 text-sm block">
                          RAHAYUPAYDAY
                        </span>
                        <span className="text-[11px] text-purple-700">
                          Diskon Rp 50.000 (Min. Belanja Rp 200.000)
                        </span>
                      </div>
                      <span className="bg-purple-200 text-purple-800 text-[10px] px-2 py-0.5 rounded font-bold">
                        Aktif
                      </span>
                    </div>

                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="font-mono font-bold text-emerald-900 text-sm block">
                          ONGKIRGRATIS
                        </span>
                        <span className="text-[11px] text-emerald-700">
                          Gratis Ongkir se-Indonesia hingga Rp 14.000
                        </span>
                      </div>
                      <span className="bg-emerald-200 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                        Aktif
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-100 pb-2">
                    Countdown Timer Promo Highlight
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-zinc-600 mb-1">Durasi Flash Sale</label>
                      <input
                        type="text"
                        defaultValue="06 Jam : 42 Menit : 19 Detik"
                        className="w-full px-3 py-2 border border-zinc-300 rounded font-mono font-bold"
                      />
                    </div>
                    <button
                      onClick={() => alert("Timer promo diperbarui!")}
                      className="px-4 py-2 bg-zinc-900 hover:bg-purple-900 text-white rounded text-xs font-bold"
                    >
                      Update Countdown
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 7: AI PRODUCT PHOTO GENERATOR STUDIO */}
          {activeModule === "ai-studio" && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-zinc-900">
                    Studio Foto Produk AI (On-Model Photoshoot)
                  </h1>
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    Cost Estimasi: ~Rp 480 – Rp 600 / foto
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Hasilkan foto katalog model profesional tanpa biaya sewa studio jutaan rupiah.
                  Hemat hingga 90% budget foto produk brand Rahayu.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Generation Form */}
                <form
                  onSubmit={handleTriggerAiPhoto}
                  className="lg:col-span-6 bg-white p-6 rounded-lg border border-zinc-200 shadow-2xs space-y-4 text-xs"
                >
                  <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-800 border-b border-zinc-100 pb-2">
                    Parameter Photoshoot AI
                  </h3>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Nama Produk</label>
                    <input
                      type="text"
                      required
                      value={aiProduct}
                      onChange={(e) => setAiProduct(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Kategori</label>
                    <select
                      value={aiCategory}
                      onChange={(e) => setAiCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded text-xs"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nameId}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Tipe Model</label>
                    <select
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded text-xs"
                    >
                      <option value="Wanita Indonesia Modest Elegance (Usia 26)">
                        Wanita Indonesia Modest Elegance (Usia 26)
                      </option>
                      <option value="Ibu Hamil Anggun & Bersahaja (Usia 30)">
                        Ibu Hamil Anggun & Bersahaja (Usia 30)
                      </option>
                      <option value="Model Remaja Ceria Muslimah (Usia 21)">
                        Model Remaja Ceria Muslimah (Usia 21)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Pencahayaan Studio</label>
                    <select
                      value={aiLighting}
                      onChange={(e) => setAiLighting(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded text-xs"
                    >
                      <option value="Soft Golden Hour Natural Sunlight">
                        Soft Golden Hour Natural Sunlight
                      </option>
                      <option value="High-End Studio Softbox Lighting">
                        High-End Studio Softbox Lighting
                      </option>
                      <option value="Warm Mediterranean Diffused Light">
                        Warm Mediterranean Diffused Light
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Latar Belakang / Setting</label>
                    <select
                      value={aiBackground}
                      onChange={(e) => setAiBackground(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded text-xs"
                    >
                      <option value="Scandinavian Arch with Warm Travertine">
                        Scandinavian Arch with Warm Travertine
                      </option>
                      <option value="Monochrome Concrete & Olive Shadow">
                        Monochrome Concrete & Olive Shadow
                      </option>
                      <option value="Minimalist Luxury Living Room">
                        Minimalist Luxury Living Room
                      </option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isAiGenerating}
                      className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      {isAiGenerating ? (
                        <span>Sedang Memproses AI (~5 detik)...</span>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate Foto Model AI (~Rp 500)</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* AI History & Gallery */}
                <div className="lg:col-span-6 space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-800">
                    Hasil Render AI Terakhir
                  </h3>
                  <div className="space-y-3">
                    {aiLogs.map((log) => (
                      <div
                        key={log.id}
                        className="bg-white p-4 rounded-lg border border-zinc-200 shadow-2xs flex gap-4 text-xs"
                      >
                        <div className="w-20 h-26 bg-zinc-100 rounded overflow-hidden shrink-0 border border-zinc-200">
                          <img
                            src={log.outputUrl}
                            alt={log.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-zinc-900">{log.productName}</h4>
                              <span className="font-mono text-[10px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded">
                                Biaya: Rp {log.costIdr}
                              </span>
                            </div>
                            <span className="text-[10px] text-zinc-400 block mt-0.5">
                              {log.timestamp} • {log.category}
                            </span>
                            <p className="text-zinc-600 text-[11px] mt-1.5 line-clamp-2">
                              Prompt: {log.prompt}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 pt-2 border-t border-zinc-50">
                            <span className="text-[10px] text-emerald-600 font-semibold">
                              ✓ Siap Dipasang di Katalog
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 8: SEO CMS & TIKTOK LIVE BROADCAST */}
          {activeModule === "cms-seo" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-zinc-900">
                  SEO CMS & Pengaturan Media Sosial / TikTok Live
                </h1>
                <p className="text-xs text-zinc-500">
                  Konfigurasikan meta tag SEO, Schema.org ClothingStore, dan jadwal siaran langsung
                  TikTok Live.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-2xs space-y-4 text-xs">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-800 border-b border-zinc-100 pb-2">
                    Pengaturan Meta SEO & Schema.org
                  </h3>
                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">
                      Meta Title Utama
                    </label>
                    <input
                      type="text"
                      defaultValue="Rahayu Fashion Store — Koleksi Hijab, Busana Muslim Wanita, Baju Hamil & Anak Resmi"
                      className="w-full px-3 py-2 border border-zinc-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">
                      Meta Keywords Silo
                    </label>
                    <input
                      type="text"
                      defaultValue="Rahayu Fashion, Hijab Voal, Tunik Modest, Baju Hamil Busui, Celana Legging, Pakaian Anak"
                      className="w-full px-3 py-2 border border-zinc-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">
                      Schema.org Store Type
                    </label>
                    <input
                      type="text"
                      disabled
                      defaultValue="https://schema.org/ClothingStore (Terpasang)"
                      className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50 rounded text-xs text-zinc-500"
                    />
                  </div>
                  <button
                    onClick={() => alert("Pengaturan SEO berhasil diperbarui!")}
                    className="px-4 py-2 bg-zinc-900 hover:bg-purple-900 text-white rounded text-xs font-bold"
                  >
                    Simpan SEO
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-2xs space-y-4 text-xs">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-800 border-b border-zinc-100 pb-2">
                    Tautan Media Sosial Resmi
                  </h3>
                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">
                      TikTok (@rahayufashion.store)
                    </label>
                    <input
                      type="text"
                      defaultValue="https://www.tiktok.com/@rahayufashion.store"
                      className="w-full px-3 py-2 border border-zinc-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">
                      Instagram (@rahayufashion.id)
                    </label>
                    <input
                      type="text"
                      defaultValue="https://www.instagram.com/rahayufashion.id"
                      className="w-full px-3 py-2 border border-zinc-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">
                      WhatsApp CS Resmi
                    </label>
                    <input
                      type="text"
                      defaultValue="https://wa.me/6281288776655"
                      className="w-full px-3 py-2 border border-zinc-300 rounded text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
