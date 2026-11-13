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
  Edit3,
  LayoutTemplate,
  Save,
  AlertTriangle,
  X,
  ShieldCheck,
  RefreshCw,
  Palette,
  Check,
  Shirt,
  ShoppingBag,
  Crown,
  Heart,
  Baby,
  Footprints,
  Tag,
  Gem,
  Feather,
} from "lucide-react";
import {
  useStore,
  OrderStatus,
  PaymentConfig,
  HomepageSectionConfig,
} from "@/context/StoreContext";
import { PRODUCTS_DATA, ProductItem, RahayuCategory, MarketplacePillar } from "@/data/mock-data";

export default function AdminPage() {
  const {
    orders,
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
    | "layout"
  >("analytics");

  // Pillar Management State (Kelompok Kategori Dinamis tanpa kata "Pilar")
  const [isPillarModalOpen, setIsPillarModalOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState<MarketplacePillar | null>(null);
  const [newPillarForm, setNewPillarForm] = useState<MarketplacePillar>({
    id: "",
    name: "",
    description: "",
  });

  // Category CRUD State
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || "Hijab");
  const [newSizeInput, setNewSizeInput] = useState<string>("");
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [newCatForm, setNewCatForm] = useState<RahayuCategory>({
    id: "",
    slug: "",
    nameId: "",
    nameEn: "",
    pillar: pillars[0]?.name || "Modest Fashion Wanita",
    iconBg: "bg-purple-100",
    colorHex: "#8A2BE2",
    measurementLabel: "Lingkar Dada (LD) & Panjang",
    variantAttr: "Ukuran Baju",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Default", hex: "#8A2BE2" }],
    iconName: "Sparkles",
    imageUrl: "",
  });
  const [editCatForm, setEditCatForm] = useState<Partial<RahayuCategory>>({});
  const [isEditingCat, setIsEditingCat] = useState(false);

  // Layout & Homepage Section Manager State
  const [layoutDraft, setLayoutDraft] = useState<HomepageSectionConfig>(homepageConfig);
  const [layoutSavedAlert, setLayoutSavedAlert] = useState(false);

  React.useEffect(() => {
    setLayoutDraft(homepageConfig);
  }, [homepageConfig]);

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

  const handleSavePillar = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPillar) {
      if (!editingPillar.name.trim()) return;
      updatePillar(editingPillar.id, {
        name: editingPillar.name.trim(),
        description: editingPillar.description?.trim(),
      });
      setEditingPillar(null);
      alert(`Kelompok kategori "${editingPillar.name}" berhasil diperbarui!`);
    } else {
      if (!newPillarForm.id.trim() || !newPillarForm.name.trim()) {
        alert("Harap isi ID dan Nama kelompok kategori!");
        return;
      }
      if (pillars.some((p) => p.id.toLowerCase() === newPillarForm.id.trim().toLowerCase())) {
        alert("ID kelompok kategori sudah terdaftar!");
        return;
      }
      addPillar({
        id: newPillarForm.id.trim().toLowerCase().replace(/\s+/g, "-"),
        name: newPillarForm.name.trim(),
        description: newPillarForm.description?.trim(),
      });
      setNewPillarForm({ id: "", name: "", description: "" });
      setIsPillarModalOpen(false);
      alert("Kelompok kategori baru berhasil ditambahkan!");
    }
  };

  const handleDeletePillar = (pillarId: string, pillarName: string) => {
    if (pillars.length <= 1) {
      alert("Minimal harus tersisa 1 kelompok kategori.");
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus kelompok kategori "${pillarName}"? Kategori di dalamnya tetap tersimpan.`)) {
      deletePillar(pillarId);
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatForm.id.trim() || !newCatForm.nameId.trim()) {
      alert("Harap lengkapi ID slug dan Nama Kategori!");
      return;
    }
    if (categories.some((c) => c.id.toLowerCase() === newCatForm.id.trim().toLowerCase())) {
      alert("ID / Slug kategori sudah digunakan! Gunakan ID lain.");
      return;
    }
    addCategory({
      ...newCatForm,
      id: newCatForm.id.trim(),
      slug: newCatForm.id.trim().toLowerCase(),
      nameId: newCatForm.nameId.trim(),
      nameEn: newCatForm.nameEn.trim() || newCatForm.nameId.trim(),
      pillar: newCatForm.pillar || pillars[0]?.name || "Modest Fashion Wanita",
      sizes: newCatForm.sizes.length > 0 ? newCatForm.sizes : ["All Size"],
      colors: newCatForm.colors || [{ name: "Default", hex: newCatForm.colorHex || "#8A2BE2" }],
      imageUrl: newCatForm.imageUrl?.trim() || undefined,
    });
    setSelectedCatId(newCatForm.id.trim());
    setIsAddCatModalOpen(false);
    setNewCatForm({
      id: "",
      slug: "",
      nameId: "",
      nameEn: "",
      pillar: pillars[0]?.name || "Modest Fashion Wanita",
      iconBg: "bg-purple-100",
      colorHex: "#8A2BE2",
      measurementLabel: "Lingkar Dada (LD) & Panjang",
      variantAttr: "Ukuran Baju",
      sizes: ["S", "M", "L", "XL"],
      colors: [{ name: "Default", hex: "#8A2BE2" }],
      iconName: "Sparkles",
      imageUrl: "",
    });
    alert("Kategori baru berhasil ditambahkan!");
  };

  const handleStartEditCategory = (cat: RahayuCategory) => {
    setSelectedCatId(cat.id);
    setEditCatForm({ ...cat });
    setIsEditingCat(true);
  };

  const handleSaveEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCategory) return;
    updateCategory(activeCategory.id, editCatForm);
    setIsEditingCat(false);
    alert(`Perubahan kategori "${editCatForm.nameId || activeCategory.nameId}" berhasil disimpan!`);
  };

  const handleDeleteCategory = (catId: string, catName: string) => {
    if (categories.length <= 1) {
      alert("Tidak dapat menghapus semua kategori. Minimal harus tersisa 1 kategori.");
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus kategori "${catName}"?`)) {
      deleteCategory(catId);
      const remaining = categories.filter((c) => c.id !== catId);
      if (remaining.length > 0) {
        setSelectedCatId(remaining[0].id);
      }
      setIsEditingCat(false);
    }
  };

  const handleSaveLayout = () => {
    updateHomepageConfig(layoutDraft);
    setLayoutSavedAlert(true);
    setTimeout(() => setLayoutSavedAlert(false), 3000);
  };

  const AVAILABLE_CATEGORY_ICONS = [
    { name: "Sparkles", label: "Sparkles ✨" },
    { name: "ShoppingBag", label: "Shopping Bag 🛍️" },
    { name: "Shirt", label: "Shirt 👚" },
    { name: "Heart", label: "Heart 💖" },
    { name: "Crown", label: "Crown 👑" },
    { name: "Footprints", label: "Footprints 👣" },
    { name: "Baby", label: "Baby 👶" },
    { name: "Tag", label: "Tag 🏷️" },
    { name: "Gem", label: "Gem 💎" },
    { name: "Feather", label: "Feather 🪶" },
    { name: "Package", label: "Package 📦" },
  ];

  const renderCatIcon = (iconName?: string, className = "w-4 h-4") => {
    switch (iconName) {
      case "Sparkles": return <Sparkles className={className} />;
      case "ShoppingBag": return <ShoppingBag className={className} />;
      case "Shirt": return <Shirt className={className} />;
      case "Heart": return <Heart className={className} />;
      case "Crown": return <Crown className={className} />;
      case "Footprints": return <Footprints className={className} />;
      case "Baby": return <Baby className={className} />;
      case "Tag": return <Tag className={className} />;
      case "Gem": return <Gem className={className} />;
      case "Feather": return <Feather className={className} />;
      default: return <Package className={className} />;
    }
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

            <button
              onClick={() => setActiveModule("layout")}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                activeModule === "layout"
                  ? "bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <LayoutTemplate className="w-4 h-4 text-purple-600" />
              <span>Tata Letak & Section Beranda</span>
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

          {/* MODULE 2: CATEGORIES & DYNAMIC SIZES PER CATEGORY (CRUD) */}
          {activeModule === "categories" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">
                    Manajemen Kategori, Icon Foto & Kelompok Dinamis
                  </h1>
                  <p className="text-xs text-zinc-500">
                    Tambah, edit nama/icon foto, hapus kategori, atur kelompok tanpa kata "pilar", dan preset ukuran dinamis.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPillar(null);
                      setIsPillarModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-zinc-300 transition"
                  >
                    <Layers className="w-4 h-4 text-purple-700" />
                    <span>Kelola Kelompok ({pillars.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddCatModalOpen(true)}
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Kategori Baru</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Category Picker List */}
                <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                      Daftar Kategori ({categories.length})
                    </h3>
                    <span className="text-[10px] text-zinc-400 font-medium">
                      {pillars.length} Kelompok
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
                    {categories.map((cat) => {
                      const isSelected = selectedCatId === cat.id;
                      return (
                        <div
                          key={cat.id}
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition ${
                            isSelected
                              ? "bg-purple-50/80 border-purple-300 shadow-2xs"
                              : "border-zinc-200/80 hover:bg-zinc-50"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCatId(cat.id);
                              setIsEditingCat(false);
                            }}
                            className="flex items-center gap-3 text-left flex-1 cursor-pointer"
                          >
                            <div
                              className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-zinc-200 flex items-center justify-center"
                              style={{ background: cat.iconBg || "#EDE9FE" }}
                            >
                              {cat.imageUrl ? (
                                <img
                                  src={cat.imageUrl}
                                  alt={cat.nameId}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div style={{ color: cat.colorHex || "#8A2BE2" }}>
                                  {renderCatIcon(cat.iconName, "w-4 h-4")}
                                </div>
                              )}
                            </div>
                            <div>
                              <span className="block font-semibold text-zinc-900 leading-tight">
                                {cat.nameId}
                              </span>
                              <span className="text-[10px] text-zinc-500">
                                {cat.pillar} • {cat.sizes.length} ukuran
                              </span>
                            </div>
                          </button>

                          <div className="flex items-center gap-1 ml-2">
                            <button
                              type="button"
                              onClick={() => handleStartEditCategory(cat)}
                              title="Edit Kategori"
                              className="p-1.5 text-zinc-500 hover:text-purple-700 hover:bg-purple-100/60 rounded cursor-pointer transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id, cat.nameId)}
                              title="Hapus Kategori"
                              className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Category Detail & Editor */}
                <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs space-y-6">
                  {isEditingCat && activeCategory ? (
                    /* FORM EDIT KATEGORI */
                    <form onSubmit={handleSaveEditCategory} className="space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                            Edit Detail Kategori
                          </span>
                          <h2 className="text-base font-bold text-zinc-900">
                            Ubah: {activeCategory.nameId}
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEditingCat(false)}
                          className="text-xs text-zinc-400 hover:text-zinc-600 cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block font-semibold text-zinc-700 mb-1">
                            Nama Kategori (Bahasa Indonesia) *
                          </label>
                          <input
                            type="text"
                            required
                            value={editCatForm.nameId || ""}
                            onChange={(e) =>
                              setEditCatForm({ ...editCatForm, nameId: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-zinc-700 mb-1">
                            Nama Kategori (Bahasa Inggris)
                          </label>
                          <input
                            type="text"
                            value={editCatForm.nameEn || ""}
                            onChange={(e) =>
                              setEditCatForm({ ...editCatForm, nameEn: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-zinc-700 mb-1">
                            Kelompok Kategori
                          </label>
                          <select
                            value={editCatForm.pillar || pillars[0]?.name || "Modest Fashion Wanita"}
                            onChange={(e) =>
                              setEditCatForm({ ...editCatForm, pillar: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs bg-white"
                          >
                            {pillars.map((p) => (
                              <option key={p.id} value={p.name}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block font-semibold text-zinc-700 mb-1">
                            Pilihan Icon Vektor
                          </label>
                          <div className="flex gap-2">
                            <select
                              value={editCatForm.iconName || "Sparkles"}
                              onChange={(e) =>
                                setEditCatForm({ ...editCatForm, iconName: e.target.value })
                              }
                              className="flex-1 px-3 py-2 border border-zinc-300 rounded-md text-xs bg-white"
                            >
                              {AVAILABLE_CATEGORY_ICONS.map((ic) => (
                                <option key={ic.name} value={ic.name}>
                                  {ic.label}
                                </option>
                              ))}
                            </select>
                            <div className="w-9 h-9 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
                              {renderCatIcon(editCatForm.iconName || "Sparkles", "w-4 h-4")}
                            </div>
                          </div>
                        </div>

                        {/* Custom Image / Photo Icon URL */}
                        <div className="sm:col-span-2">
                          <div className="flex items-center justify-between mb-1">
                            <label className="block font-semibold text-zinc-700">
                              Foto / Icon Kategori (URL Foto / Gambar)
                            </label>
                            <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                              Standar: Rasio 1:1, 200×200 px (Maks 500 KB)
                            </span>
                          </div>
                          <div className="flex gap-3 items-center">
                            <input
                              type="text"
                              value={editCatForm.imageUrl || ""}
                              onChange={(e) =>
                                setEditCatForm({ ...editCatForm, imageUrl: e.target.value })
                              }
                              placeholder="https://images.unsplash.com/... atau URL foto terupload"
                              className="flex-1 px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                            />
                            {editCatForm.imageUrl ? (
                              <div className="w-10 h-10 rounded-full border border-purple-300 overflow-hidden shrink-0">
                                <img
                                  src={editCatForm.imageUrl}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-400 text-[10px]">
                                Vector
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-1">
                            Format rekomendasi: PNG (transparan), WebP, atau JPG. Resolusi min. 120×120 px, maks. 500×500 px. Jika kosong, akan menggunakan icon grafis.
                          </p>
                        </div>

                        <div>
                          <label className="block font-semibold text-zinc-700 mb-1">
                            Warna Hex Tema
                          </label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={editCatForm.colorHex || "#8A2BE2"}
                              onChange={(e) =>
                                setEditCatForm({ ...editCatForm, colorHex: e.target.value })
                              }
                              className="w-9 h-9 rounded cursor-pointer border border-zinc-300 p-0.5"
                            />
                            <input
                              type="text"
                              value={editCatForm.colorHex || "#8A2BE2"}
                              onChange={(e) =>
                                setEditCatForm({ ...editCatForm, colorHex: e.target.value })
                              }
                              className="flex-1 px-3 py-2 border border-zinc-300 rounded-md text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-zinc-700 mb-1">
                            Background Icon (Tailwind Class)
                          </label>
                          <select
                            value={editCatForm.iconBg || "bg-purple-100"}
                            onChange={(e) =>
                              setEditCatForm({ ...editCatForm, iconBg: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs bg-white"
                          >
                            <option value="bg-purple-100">bg-purple-100 (Ungu)</option>
                            <option value="bg-rose-100">bg-rose-100 (Pink / Mawar)</option>
                            <option value="bg-pink-100">bg-pink-100 (Pink Muda)</option>
                            <option value="bg-emerald-100">bg-emerald-100 (Hijau Segar)</option>
                            <option value="bg-teal-100">bg-teal-100 (Teal)</option>
                            <option value="bg-amber-100">bg-amber-100 (Kuning Emas)</option>
                            <option value="bg-orange-100">bg-orange-100 (Oranye)</option>
                            <option value="bg-sky-100">bg-sky-100 (Biru Langit)</option>
                            <option value="bg-zinc-100">bg-zinc-100 (Abu-abu Netral)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-semibold text-zinc-700 mb-1">
                            Label Pengukuran PDP
                          </label>
                          <input
                            type="text"
                            value={editCatForm.measurementLabel || ""}
                            onChange={(e) =>
                              setEditCatForm({
                                ...editCatForm,
                                measurementLabel: e.target.value,
                              })
                            }
                            placeholder="cth. Lingkar Dada (LD) & Panjang Baju"
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-zinc-700 mb-1">
                            Nama Atribut Varian
                          </label>
                          <input
                            type="text"
                            value={editCatForm.variantAttr || ""}
                            onChange={(e) =>
                              setEditCatForm({ ...editCatForm, variantAttr: e.target.value })
                            }
                            placeholder="cth. Ukuran Baju / Ukuran Kain"
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-3 border-t border-zinc-100">
                        <button
                          type="button"
                          onClick={() => setIsEditingCat(false)}
                          className="px-4 py-2 border border-zinc-300 rounded-md text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Simpan Perubahan Kategori</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* VIEW OVERVIEW KATEGORI AKTIF */
                    <div>
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-200 flex items-center justify-center shrink-0"
                            style={{ background: activeCategory?.iconBg || "#EDE9FE" }}
                          >
                            {activeCategory?.imageUrl ? (
                              <img
                                src={activeCategory.imageUrl}
                                alt={activeCategory.nameId}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div style={{ color: activeCategory?.colorHex || "#8A2BE2" }}>
                                {renderCatIcon(activeCategory?.iconName, "w-6 h-6")}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                              {activeCategory?.pillar}
                            </span>
                            <h2 className="text-lg font-bold text-zinc-900">
                              {activeCategory?.nameId}
                            </h2>
                            <p className="text-xs text-zinc-500">
                              Slug: <code className="bg-zinc-100 px-1 py-0.5 rounded text-[11px] font-mono">{activeCategory?.id}</code> • Bahasa Inggris: <em>{activeCategory?.nameEn}</em>
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => activeCategory && handleStartEditCategory(activeCategory)}
                          className="px-3 py-1.5 border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Ubah Kategori</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 py-3 text-xs text-zinc-600 bg-zinc-50/70 p-3 rounded-lg border border-zinc-100 mt-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Label Pengukuran:</span>
                          <span className="font-semibold text-zinc-800">{activeCategory?.measurementLabel}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Atribut Varian:</span>
                          <span className="font-semibold text-zinc-800">{activeCategory?.variantAttr}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Sizes Chips */}
                  {activeCategory && (
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider">
                          Preset Ukuran Aktif ({activeCategory.sizes.length}):
                        </label>
                        <span className="text-[10px] text-zinc-400">
                          Muncul di opsi PDP produk kategori ini
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {activeCategory.sizes.map((sz) => (
                          <div
                            key={sz}
                            className="px-3 py-1.5 bg-zinc-100 border border-zinc-300 rounded-md text-xs font-medium text-zinc-800 flex items-center gap-2 group shadow-2xs"
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

                      {/* Add New Size Form */}
                      <form onSubmit={handleAddSize} className="mt-4 pt-4 border-t border-zinc-100">
                        <label className="block text-xs font-semibold text-zinc-700 mb-1">
                          Tambah Opsi Ukuran Baru ke Kategori Ini:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newSizeInput}
                            onChange={(e) => setNewSizeInput(e.target.value)}
                            placeholder="cth. XXL (LD 120), 140x140 cm, atau Newborn..."
                            className="flex-1 px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Tambah</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>

              {/* MODAL KELOLA KELOMPOK KATEGORI (PILLARS) */}
              {isPillarModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                      <div>
                        <h2 className="text-base font-bold text-zinc-900">
                          Kelola Kelompok Kategori
                        </h2>
                        <p className="text-xs text-zinc-500">
                          Tambah, ubah nama, dan hapus kelompok kategori (tanpa kata "pilar") untuk mega-menu.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsPillarModalOpen(false);
                          setEditingPillar(null);
                        }}
                        className="text-zinc-400 hover:text-zinc-600 p-1 rounded-full cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Pillar List */}
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {pillars.map((pillar) => (
                        <div
                          key={pillar.id}
                          className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs"
                        >
                          <div>
                            <span className="font-bold text-zinc-900 block">{pillar.name}</span>
                            <span className="text-[11px] text-zinc-500">{pillar.description || "ID: " + pillar.id}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingPillar({ ...pillar })}
                              className="p-1.5 text-zinc-500 hover:text-purple-700 hover:bg-purple-100/60 rounded cursor-pointer"
                              title="Edit Kelompok"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePillar(pillar.id, pillar.name)}
                              className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                              title="Hapus Kelompok"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add / Edit Pillar Form */}
                    <form onSubmit={handleSavePillar} className="pt-3 border-t border-zinc-100 space-y-3 text-xs">
                      <span className="font-bold text-zinc-800 uppercase tracking-wider text-[11px] block">
                        {editingPillar ? `Edit Kelompok: ${editingPillar.name}` : "Tambah Kelompok Baru:"}
                      </span>
                      {!editingPillar && (
                        <div>
                          <label className="block font-semibold text-zinc-700 mb-1">
                            ID Kelompok (Slug unik) *
                          </label>
                          <input
                            type="text"
                            required
                            value={newPillarForm.id}
                            onChange={(e) =>
                              setNewPillarForm({ ...newPillarForm, id: e.target.value })
                            }
                            placeholder="cth. busana-pria atau aksesoris"
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md font-mono text-xs focus:outline-none focus:border-purple-700"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block font-semibold text-zinc-700 mb-1">
                          Nama Kelompok *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingPillar ? editingPillar.name : newPillarForm.name}
                          onChange={(e) => {
                            if (editingPillar) {
                              setEditingPillar({ ...editingPillar, name: e.target.value });
                            } else {
                              setNewPillarForm({ ...newPillarForm, name: e.target.value });
                            }
                          }}
                          placeholder="cth. Busana Pria & Koko"
                          className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-zinc-700 mb-1">
                          Deskripsi Singkat
                        </label>
                        <input
                          type="text"
                          value={editingPillar ? (editingPillar.description || "") : (newPillarForm.description || "")}
                          onChange={(e) => {
                            if (editingPillar) {
                              setEditingPillar({ ...editingPillar, description: e.target.value });
                            } else {
                              setNewPillarForm({ ...newPillarForm, description: e.target.value });
                            }
                          }}
                          placeholder="cth. Kemeja Koko, Kurta & Sarung"
                          className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        {editingPillar && (
                          <button
                            type="button"
                            onClick={() => setEditingPillar(null)}
                            className="px-3 py-1.5 border border-zinc-300 text-zinc-600 rounded-md font-semibold cursor-pointer"
                          >
                            Batal Edit
                          </button>
                        )}
                        <button
                          type="submit"
                          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{editingPillar ? "Simpan Perubahan" : "Tambah Kelompok"}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* MODAL TAMBAH KATEGORI BARU */}
              {isAddCatModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                      <div>
                        <h2 className="text-base font-bold text-zinc-900">
                          Tambah Kategori Produk Baru
                        </h2>
                        <p className="text-xs text-zinc-500">
                          Kategori ini akan otomatis muncul di navigasi frontstore dan filter produk.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddCatModalOpen(false)}
                        className="text-zinc-400 hover:text-zinc-600 p-1 rounded-full cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateCategory} className="space-y-3.5 text-xs">
                      <div>
                        <label className="block font-semibold text-zinc-700 mb-1">
                          ID / Slug Kategori (Unik, tanpa spasi) *
                        </label>
                        <input
                          type="text"
                          required
                          value={newCatForm.id}
                          onChange={(e) =>
                            setNewCatForm({
                              ...newCatForm,
                              id: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                            })
                          }
                          placeholder="cth. gamis-syari atau mukena-premium"
                          className="w-full px-3 py-2 border border-zinc-300 rounded-md font-mono text-xs focus:outline-none focus:border-purple-700"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-zinc-700 mb-1">
                            Nama Kategori (ID) *
                          </label>
                          <input
                            type="text"
                            required
                            value={newCatForm.nameId}
                            onChange={(e) =>
                              setNewCatForm({ ...newCatForm, nameId: e.target.value })
                            }
                            placeholder="cth. Gamis & Abaya Syar'i"
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-zinc-700 mb-1">
                            Nama Kategori (EN)
                          </label>
                          <input
                            type="text"
                            value={newCatForm.nameEn}
                            onChange={(e) =>
                              setNewCatForm({ ...newCatForm, nameEn: e.target.value })
                            }
                            placeholder="cth. Syari Abaya & Robe"
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-zinc-700 mb-1">
                          Kelompok Kategori
                        </label>
                        <select
                          value={newCatForm.pillar}
                          onChange={(e) =>
                            setNewCatForm({
                              ...newCatForm,
                              pillar: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs bg-white"
                        >
                          {pillars.map((p) => (
                            <option key={p.id} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Custom Image / Photo Icon URL */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-semibold text-zinc-700">
                            Foto / Icon Kategori (Upload / Custom Image)
                          </label>
                          <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            Standar: Rasio 1:1, 200×200 px (Maks 500 KB)
                          </span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={newCatForm.imageUrl || ""}
                            onChange={(e) =>
                              setNewCatForm({ ...newCatForm, imageUrl: e.target.value })
                            }
                            placeholder="https://images.unsplash.com/... atau URL foto"
                            className="flex-1 px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                          />
                          {newCatForm.imageUrl && (
                            <div className="w-9 h-9 rounded-full border border-purple-300 overflow-hidden shrink-0">
                              <img
                                src={newCatForm.imageUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1">
                          Format: PNG transparan / WebP / JPG. Resolusi min 120×120 px, maks 500×500 px.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-zinc-700 mb-1">
                            Pilih Icon Vektor
                          </label>
                          <div className="flex gap-2">
                            <select
                              value={newCatForm.iconName || "Sparkles"}
                              onChange={(e) =>
                                setNewCatForm({ ...newCatForm, iconName: e.target.value })
                              }
                              className="flex-1 px-3 py-2 border border-zinc-300 rounded-md text-xs bg-white"
                            >
                              {AVAILABLE_CATEGORY_ICONS.map((ic) => (
                                <option key={ic.name} value={ic.name}>
                                  {ic.label}
                                </option>
                              ))}
                            </select>
                            <div className="w-9 h-9 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
                              {renderCatIcon(newCatForm.iconName, "w-4 h-4")}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-zinc-700 mb-1">
                            Warna Hex Tema
                          </label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={newCatForm.colorHex}
                              onChange={(e) =>
                                setNewCatForm({ ...newCatForm, colorHex: e.target.value })
                              }
                              className="w-9 h-9 rounded cursor-pointer border border-zinc-300 p-0.5"
                            />
                            <input
                              type="text"
                              value={newCatForm.colorHex}
                              onChange={(e) =>
                                setNewCatForm({ ...newCatForm, colorHex: e.target.value })
                              }
                              className="flex-1 px-3 py-2 border border-zinc-300 rounded-md text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-zinc-700 mb-1">
                            Label Pengukuran
                          </label>
                          <input
                            type="text"
                            value={newCatForm.measurementLabel}
                            onChange={(e) =>
                              setNewCatForm({
                                ...newCatForm,
                                measurementLabel: e.target.value,
                              })
                            }
                            placeholder="cth. Lingkar Dada (LD) & Panjang"
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-zinc-700 mb-1">
                            Atribut Varian
                          </label>
                          <input
                            type="text"
                            value={newCatForm.variantAttr}
                            onChange={(e) =>
                              setNewCatForm({ ...newCatForm, variantAttr: e.target.value })
                            }
                            placeholder="cth. Ukuran Baju"
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
                        <button
                          type="button"
                          onClick={() => setIsAddCatModalOpen(false)}
                          className="px-4 py-2 border border-zinc-300 text-zinc-700 hover:bg-zinc-50 rounded-md font-semibold cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Simpan Kategori Baru</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
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

          {/* MODULE 9: HOMEPAGE SECTIONS & BOTTOM LAYOUT MANAGER */}
          {activeModule === "layout" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">
                    Pengaturan Tata Letak & Section Beranda
                  </h1>
                  <p className="text-xs text-zinc-500">
                    Atur teks hero banner, tampilkan/sembunyikan section beranda, timer promo,
                    dan kustomisasi 4 kartu USP standar layanan di bagian bawah.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {layoutSavedAlert && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
                      <Check className="w-4 h-4" />
                      Pengaturan Berhasil Disimpan!
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveLayout}
                    className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Pengaturan Tata Letak</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Hero Banner Settings */}
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs space-y-4 text-xs">
                  <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-zinc-900">Hero Banner Utama</h3>
                      <p className="text-[11px] text-zinc-500">Headline dan tombol aksi utama beranda</p>
                    </div>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded">
                      Section 1
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Badge Atas</label>
                    <input
                      type="text"
                      value={layoutDraft.hero.badge}
                      onChange={(e) =>
                        setLayoutDraft({
                          ...layoutDraft,
                          hero: { ...layoutDraft.hero, badge: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Headline Utama (Title)</label>
                    <input
                      type="text"
                      value={layoutDraft.hero.title}
                      onChange={(e) =>
                        setLayoutDraft({
                          ...layoutDraft,
                          hero: { ...layoutDraft.hero, title: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Deskripsi Singkat</label>
                    <textarea
                      rows={2}
                      value={layoutDraft.hero.description}
                      onChange={(e) =>
                        setLayoutDraft({
                          ...layoutDraft,
                          hero: { ...layoutDraft.hero, description: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs"
                    />
                  </div>

                  {/* Background Image & Contrast Overlay */}
                  <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block font-semibold text-zinc-800">
                        Foto Background Banner Utama (Custom Image)
                      </label>
                      <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        Standar: 1920×640 px (Rasio 3:1 Widescreen), Maks 1.5 MB
                      </span>
                    </div>

                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={layoutDraft.hero.backgroundImageUrl || ""}
                        onChange={(e) =>
                          setLayoutDraft({
                            ...layoutDraft,
                            hero: { ...layoutDraft.hero, backgroundImageUrl: e.target.value },
                          })
                        }
                        placeholder="https://images.unsplash.com/... atau URL foto banner sendiri"
                        className="flex-1 px-3 py-2 border border-zinc-300 rounded-md text-xs font-mono bg-white focus:outline-none focus:border-purple-700"
                      />
                      {layoutDraft.hero.backgroundImageUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setLayoutDraft({
                              ...layoutDraft,
                              hero: { ...layoutDraft.hero, backgroundImageUrl: "" },
                            })
                          }
                          className="px-2.5 py-2 border border-zinc-300 hover:bg-zinc-100 text-zinc-600 rounded-md text-xs cursor-pointer whitespace-nowrap"
                          title="Hapus foto (gunakan warna polos)"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>

                    {/* Guidelines Card */}
                    <div className="text-[11px] text-zinc-500 bg-white p-2.5 rounded border border-zinc-200/80 space-y-1">
                      <div className="font-semibold text-zinc-700 flex items-center gap-1.5">
                        <span className="text-purple-600">📐</span> Aturan & Panduan Standar Ukuran Banner:
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-zinc-600 pl-1">
                        <li><strong>Rasio Aspek:</strong> ~3:1 (Widescreen Hero Banner).</li>
                        <li><strong>Rekomendasi Dimensi:</strong> <strong>1920 × 640 px</strong> (optimal desktop & retina) atau <strong>1600 × 600 px</strong>.</li>
                        <li><strong>Resolusi Minimal:</strong> 1200 × 480 px (agar tidak pecah saat dibuka di layar lebar).</li>
                        <li><strong>Format & Ukuran File:</strong> Format WebP atau JPG terkompresi, ukuran maksimal <strong>1.5 MB</strong> agar loading beranda instan.</li>
                        <li><strong>Tips Komposisi:</strong> Area fokus gambar sebaiknya di sisi kanan / tengah, karena sisi kiri akan memuat teks headline banner.</li>
                      </ul>
                    </div>

                    {/* Overlay Opacity Slider */}
                    {layoutDraft.hero.backgroundImageUrl && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-zinc-700">
                            Tingkat Kegelapan Overlay (Kontras Teks):
                          </span>
                          <span className="font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            {layoutDraft.hero.overlayOpacity ?? 40}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={85}
                          step={5}
                          value={layoutDraft.hero.overlayOpacity ?? 40}
                          onChange={(e) =>
                            setLayoutDraft({
                              ...layoutDraft,
                              hero: { ...layoutDraft.hero, overlayOpacity: Number(e.target.value) },
                            })
                          }
                          className="w-full accent-purple-700 cursor-pointer"
                        />
                        <p className="text-[10px] text-zinc-400">
                          Geser ke kanan untuk membuat background lebih gelap agar tulisan putih semakin kontras dan mudah dibaca pembeli.
                        </p>
                      </div>
                    )}

                    {/* Live Preview of Hero Banner */}
                    <div className="pt-2">
                      <div className="text-[11px] font-semibold text-zinc-700 mb-1.5">
                        Live Preview Tampilan Banner:
                      </div>
                      <div className="relative rounded-lg overflow-hidden border border-zinc-300 min-h-[140px] flex items-center p-4 bg-zinc-900 text-white">
                        {layoutDraft.hero.backgroundImageUrl ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={layoutDraft.hero.backgroundImageUrl}
                              alt="Preview"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div
                              className="absolute inset-0 bg-gradient-to-r from-zinc-950/85 via-zinc-900/60 to-transparent"
                              style={{
                                opacity: ((layoutDraft.hero.overlayOpacity ?? 40) / 100) + 0.35,
                              }}
                            />
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-950 via-zinc-900 to-zinc-950" />
                        )}

                        <div className="relative z-10 max-w-sm space-y-1.5">
                          <span className="inline-block px-1.5 py-0.5 bg-purple-600/80 text-[9px] uppercase tracking-wider font-bold rounded">
                            {layoutDraft.hero.badge || "BADGE PREVIEW"}
                          </span>
                          <h4 className="text-sm font-bold text-white line-clamp-1">
                            {layoutDraft.hero.title || "Headline Banner Utama"}
                          </h4>
                          <p className="text-[10px] text-zinc-200 line-clamp-2">
                            {layoutDraft.hero.description || "Deskripsi banner beranda"}
                          </p>
                          <div className="pt-1">
                            <span className="inline-block px-3 py-1 bg-purple-700 text-[10px] font-semibold uppercase text-white rounded">
                              {layoutDraft.hero.ctaText || "Belanja Sekarang"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-zinc-700 mb-1">Label Tombol CTA</label>
                      <input
                        type="text"
                        value={layoutDraft.hero.ctaText}
                        onChange={(e) =>
                          setLayoutDraft({
                            ...layoutDraft,
                            hero: { ...layoutDraft.hero, ctaText: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-zinc-700 mb-1">Link Target CTA</label>
                      <input
                        type="text"
                        value={layoutDraft.hero.ctaLink}
                        onChange={(e) =>
                          setLayoutDraft({
                            ...layoutDraft,
                            hero: { ...layoutDraft.hero, ctaLink: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Promo Highlight / Flash Sale Section */}
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs space-y-4 text-xs">
                  <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-zinc-900">Promo Highlight (Flash Sale)</h3>
                      <p className="text-[11px] text-zinc-500">Banner voucher & countdown timer</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={layoutDraft.promoHighlightSection.isActive}
                        onChange={(e) =>
                          setLayoutDraft({
                            ...layoutDraft,
                            promoHighlightSection: {
                              ...layoutDraft.promoHighlightSection,
                              isActive: e.target.checked,
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-700"></div>
                      <span className="ml-2 text-xs font-semibold text-zinc-700">
                        {layoutDraft.promoHighlightSection.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Judul Section Promo</label>
                    <input
                      type="text"
                      value={layoutDraft.promoHighlightSection.title}
                      onChange={(e) =>
                        setLayoutDraft({
                          ...layoutDraft,
                          promoHighlightSection: {
                            ...layoutDraft.promoHighlightSection,
                            title: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Teks Badge Flash Sale</label>
                    <input
                      type="text"
                      value={layoutDraft.promoHighlightSection.badgeText}
                      onChange={(e) =>
                        setLayoutDraft({
                          ...layoutDraft,
                          promoHighlightSection: {
                            ...layoutDraft.promoHighlightSection,
                            badgeText: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Countdown Timer</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <span className="text-[10px] text-zinc-500 block mb-0.5">Jam (Hours):</span>
                        <input
                          type="text"
                          value={layoutDraft.promoHighlightSection.countdownHours}
                          onChange={(e) =>
                            setLayoutDraft({
                              ...layoutDraft,
                              promoHighlightSection: {
                                ...layoutDraft.promoHighlightSection,
                                countdownHours: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs font-mono text-center font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block mb-0.5">Menit (Mins):</span>
                        <input
                          type="text"
                          value={layoutDraft.promoHighlightSection.countdownMins}
                          onChange={(e) =>
                            setLayoutDraft({
                              ...layoutDraft,
                              promoHighlightSection: {
                                ...layoutDraft.promoHighlightSection,
                                countdownMins: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs font-mono text-center font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block mb-0.5">Detik (Secs):</span>
                        <input
                          type="text"
                          value={layoutDraft.promoHighlightSection.countdownSecs}
                          onChange={(e) =>
                            setLayoutDraft({
                              ...layoutDraft,
                              promoHighlightSection: {
                                ...layoutDraft.promoHighlightSection,
                                countdownSecs: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs font-mono text-center font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Koleksi Terbaru (New Arrivals) Section */}
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs space-y-4 text-xs">
                  <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-zinc-900">Section Koleksi Terbaru</h3>
                      <p className="text-[11px] text-zinc-500">Menampilkan produk dengan status rilis terkini</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={layoutDraft.newArrivalsSection.isActive}
                        onChange={(e) =>
                          setLayoutDraft({
                            ...layoutDraft,
                            newArrivalsSection: {
                              ...layoutDraft.newArrivalsSection,
                              isActive: e.target.checked,
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-700"></div>
                      <span className="ml-2 text-xs font-semibold text-zinc-700">
                        {layoutDraft.newArrivalsSection.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Judul Section</label>
                    <input
                      type="text"
                      value={layoutDraft.newArrivalsSection.title}
                      onChange={(e) =>
                        setLayoutDraft({
                          ...layoutDraft,
                          newArrivalsSection: {
                            ...layoutDraft.newArrivalsSection,
                            title: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Subjudul / Keterangan</label>
                    <input
                      type="text"
                      value={layoutDraft.newArrivalsSection.subtitle}
                      onChange={(e) =>
                        setLayoutDraft({
                          ...layoutDraft,
                          newArrivalsSection: {
                            ...layoutDraft.newArrivalsSection,
                            subtitle: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Jumlah Maksimal Produk</label>
                    <input
                      type="number"
                      min={2}
                      max={12}
                      value={layoutDraft.newArrivalsSection.maxDisplay}
                      onChange={(e) =>
                        setLayoutDraft({
                          ...layoutDraft,
                          newArrivalsSection: {
                            ...layoutDraft.newArrivalsSection,
                            maxDisplay: Number(e.target.value) || 4,
                          },
                        })
                      }
                      className="w-32 px-3 py-2 border border-zinc-300 rounded-md text-xs"
                    />
                  </div>
                </div>

                {/* 4. Produk Terlaris (Best Sellers) Section */}
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs space-y-4 text-xs">
                  <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-zinc-900">Section Produk Terlaris</h3>
                      <p className="text-[11px] text-zinc-500">Menampilkan produk dengan rating dan penjualan tertinggi</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={layoutDraft.bestSellersSection.isActive}
                        onChange={(e) =>
                          setLayoutDraft({
                            ...layoutDraft,
                            bestSellersSection: {
                              ...layoutDraft.bestSellersSection,
                              isActive: e.target.checked,
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-700"></div>
                      <span className="ml-2 text-xs font-semibold text-zinc-700">
                        {layoutDraft.bestSellersSection.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Judul Section</label>
                    <input
                      type="text"
                      value={layoutDraft.bestSellersSection.title}
                      onChange={(e) =>
                        setLayoutDraft({
                          ...layoutDraft,
                          bestSellersSection: {
                            ...layoutDraft.bestSellersSection,
                            title: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Subjudul / Keterangan</label>
                    <input
                      type="text"
                      value={layoutDraft.bestSellersSection.subtitle}
                      onChange={(e) =>
                        setLayoutDraft({
                          ...layoutDraft,
                          bestSellersSection: {
                            ...layoutDraft.bestSellersSection,
                            subtitle: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Jumlah Maksimal Produk</label>
                    <input
                      type="number"
                      min={2}
                      max={12}
                      value={layoutDraft.bestSellersSection.maxDisplay}
                      onChange={(e) =>
                        setLayoutDraft({
                          ...layoutDraft,
                          bestSellersSection: {
                            ...layoutDraft.bestSellersSection,
                            maxDisplay: Number(e.target.value) || 4,
                          },
                        })
                      }
                      className="w-32 px-3 py-2 border border-zinc-300 rounded-md text-xs"
                    />
                  </div>
                </div>

                {/* 5. Section Bawah: Standar Layanan Rahayu (USP) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs space-y-4 text-xs">
                  <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-zinc-900">
                        Section Bawah: Standar Layanan Rahayu (USP Badges)
                      </h3>
                      <p className="text-[11px] text-zinc-500">
                        4 pilar jaminan kepuasan pelanggan sebelum footer web & aplikasi
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={layoutDraft.uspSection.isActive}
                        onChange={(e) =>
                          setLayoutDraft({
                            ...layoutDraft,
                            uspSection: {
                              ...layoutDraft.uspSection,
                              isActive: e.target.checked,
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-700"></div>
                      <span className="ml-2 text-xs font-semibold text-zinc-700">
                        {layoutDraft.uspSection.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Judul Section Bawah</label>
                    <input
                      type="text"
                      value={layoutDraft.uspSection.title}
                      onChange={(e) =>
                        setLayoutDraft({
                          ...layoutDraft,
                          uspSection: {
                            ...layoutDraft.uspSection,
                            title: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    {layoutDraft.uspSection.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200/80 space-y-2"
                      >
                        <span className="text-[10px] font-bold text-purple-700 uppercase">
                          Kartu USP {idx + 1}
                        </span>
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-700 mb-0.5">
                            Judul
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const newItems = [...layoutDraft.uspSection.items];
                              newItems[idx] = { ...newItems[idx], title: e.target.value };
                              setLayoutDraft({
                                ...layoutDraft,
                                uspSection: { ...layoutDraft.uspSection, items: newItems },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 border border-zinc-300 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-700 mb-0.5">
                            Keterangan
                          </label>
                          <textarea
                            rows={2}
                            value={item.desc}
                            onChange={(e) => {
                              const newItems = [...layoutDraft.uspSection.items];
                              newItems[idx] = { ...newItems[idx], desc: e.target.value };
                              setLayoutDraft({
                                ...layoutDraft,
                                uspSection: { ...layoutDraft.uspSection, items: newItems },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 border border-zinc-300 rounded text-xs bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="button"
                      onClick={handleSaveLayout}
                      className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan Tata Letak</span>
                    </button>
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
