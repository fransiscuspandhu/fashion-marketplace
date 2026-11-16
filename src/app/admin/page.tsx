"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  BarChart3,
  Boxes,
  ArrowUpDown,
  Upload,
  Camera,
  Wand2,
  Ruler,
  Lock,
  LogOut,
  UserCheck,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react";
import {
  useStore,
  OrderStatus,
  PaymentConfig,
  HomepageSectionConfig,
  AdminRole,
  AdminModuleId,
  ADMIN_ROLES_CONFIG,
  DEMO_ADMIN_ACCOUNTS,
} from "@/context/StoreContext";
import { ProductItem, RahayuCategory, MarketplacePillar } from "@/data/mock-data";
import ImageUploader from "@/components/ImageUploader";

export default function AdminPage() {
  const router = useRouter();
  const {
    adminUser,
    isAdminLoggedIn,
    adminLogout,
    adminSwitchRole,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
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
    updatePaymentMethod,
    isLiveActive,
    liveViewers,
    toggleLiveActive,
    aiFeaturesConfig,
    updateAiFeaturesConfig,
    aiLogs,
    generateAiPhoto,
  } = useStore();

  const [isMounted, setIsMounted] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [lockedModuleNotice, setLockedModuleNotice] = useState<{
    moduleId: AdminModuleId;
    moduleName: string;
    requiredRole: string;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auth gate: redirect to /admin/login if not authenticated
  useEffect(() => {
    if (isMounted && !isAdminLoggedIn) {
      router.push("/admin/login");
    }
  }, [isMounted, isAdminLoggedIn, router]);

  const [activeModule, setActiveModule] = useState<AdminModuleId>("analytics");

  // Adjust activeModule if switching to a role that does not have access
  useEffect(() => {
    if (adminUser) {
      const allowed = ADMIN_ROLES_CONFIG[adminUser.role]?.allowedModules || [];
      if (!allowed.includes(activeModule) && allowed.length > 0) {
        setActiveModule(allowed[0]);
      }
    }
  }, [adminUser, activeModule]);

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

  // Analytics State
  const [analyticsChartMode, setAnalyticsChartMode] = useState<"omzet" | "orders">("omzet");
  const [stockFilterLow, setStockFilterLow] = useState<boolean>(false);
  const [stockSearch, setStockSearch] = useState<string>("");

  // Orders Flow Tabs & Resi State
  const [adminOrderFilter, setAdminOrderFilter] = useState<string>("ALL");
  const [awbInputs, setAwbInputs] = useState<Record<string, string>>({});
  const [activeResiModalOrder, setActiveResiModalOrder] = useState<string | null>(null);

  // Product CRUD State
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [productCatFilter, setProductCatFilter] = useState("ALL");
  const [productForm, setProductForm] = useState<Omit<ProductItem, "id">>({
    sku: "",
    name: "",
    category: categories[0]?.id || "Hijab",
    priceIdr: 150000,
    origPriceIdr: 199000,
    discountPct: 25,
    promoBadge: "PROMO -25%",
    isPromoHighlight: false,
    hasVideo: true,
    videoUrl: "https://www.tiktok.com/@rahayufashion.store/video/740001",
    desc: "",
    rating: 5.0,
    reviewCount: 1,
    stock: 45,
    imageUrl: "",
    promoType: "Flash Sale 25%",
  });

  // Product Image Source Tab & AI Wizard State
  const [productImageTab, setProductImageTab] = useState<"upload" | "ai">("upload");
  const [aiProductRawImage, setAiProductRawImage] = useState<string>("");
  const [aiProductModel, setAiProductModel] = useState<string>("Wanita Hijabi Modest Editorial");
  const [aiProductTone, setAiProductTone] = useState<string>("Warm Sunlight Golden Hour");
  const [aiProductResult, setAiProductResult] = useState<string>("");
  const [isProductAiGenerating, setIsProductAiGenerating] = useState(false);
  const [isAiCopywriting, setIsAiCopywriting] = useState(false);

  // Payment Methods Step & Description Editor State
  const [editingPayment, setEditingPayment] = useState<PaymentConfig | null>(null);
  const [paymentEditForm, setPaymentEditForm] = useState<{
    description: string;
    fee: number;
    accountNumber: string;
    accountName: string;
    qrImageUrl: string;
    instructions: string[];
  }>({
    description: "",
    fee: 0,
    accountNumber: "",
    accountName: "",
    qrImageUrl: "",
    instructions: [],
  });
  const [newInstructionText, setNewInstructionText] = useState("");



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
    setActiveResiModalOrder(null);
    alert(`Nomor resi ${val.trim()} berhasil disimpan dan pelanggan dapat melacak paket!`);
  };

  // Product CRUD Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      sku: `RHY-${categories[0]?.id.slice(0, 3).toUpperCase() || "MOD"}-${Math.floor(100 + Math.random() * 900)}`,
      name: "",
      category: categories[0]?.id || "Hijab",
      priceIdr: 189000,
      origPriceIdr: 249000,
      discountPct: 24,
      promoBadge: "PROMO -24%",
      isPromoHighlight: false,
      hasVideo: true,
      videoUrl: "https://www.tiktok.com/@rahayufashion.store/video/740001",
      desc: "",
      rating: 5.0,
      reviewCount: 0,
      stock: 35,
      imageUrl: "",
      promoType: "Flash Sale 24%",
    });
    setAiProductRawImage("");
    setAiProductResult("");
    setProductImageTab("upload");
    setIsAddProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: ProductItem) => {
    setEditingProduct(p);
    setProductForm({
      sku: p.sku,
      name: p.name,
      category: p.category,
      priceIdr: p.priceIdr,
      origPriceIdr: p.origPriceIdr,
      discountPct: p.discountPct,
      promoBadge: p.promoBadge,
      isPromoHighlight: p.isPromoHighlight,
      hasVideo: p.hasVideo,
      videoUrl: p.videoUrl,
      desc: p.desc,
      rating: p.rating,
      reviewCount: p.reviewCount,
      stock: p.stock ?? 30,
      imageUrl: p.imageUrl || "",
      promoType: p.promoType || "None",
    });
    setAiProductRawImage("");
    setAiProductResult("");
    setProductImageTab("upload");
    setIsAddProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.sku.trim()) {
      alert("Nama produk dan SKU wajib diisi!");
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...productForm,
      });
    } else {
      const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
      addProduct({
        id: newId,
        ...productForm,
      });
    }
    setIsAddProductModalOpen(false);
  };

  const handleDeleteProduct = (productId: number, productName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk "${productName}"?`)) {
      deleteProduct(productId);
    }
  };

  const handleRunProductAiGenerate = () => {
    setIsProductAiGenerating(true);
    setTimeout(() => {
      const generated = generateAiPhoto({
        productName: productForm.name || "Koleksi Fashion Modest",
        category: productForm.category,
        modelType: aiProductModel,
        lighting: aiProductTone,
        background: "Studio Modest Minimalist Aesthetic",
      });
      setAiProductResult(generated.outputUrl);
      setIsProductAiGenerating(false);
    }, 1500);
  };

  const handleApplyAiImageToProduct = () => {
    if (aiProductResult) {
      setProductForm((prev) => ({ ...prev, imageUrl: aiProductResult }));
      alert("Foto hasil AI berhasil dipasang sebagai foto produk!");
    }
  };

  const handleAiAutoCopywriting = () => {
    setIsAiCopywriting(true);
    setTimeout(() => {
      const name = productForm.name.trim() || "Busana Modest Syar'i Modern";
      const cat = productForm.category || "Gamis";
      const generatedDesc = `${name} dirancang khusus untuk wanita muslimah modern yang mengutamakan keanggunan, kenyamanan, dan nilai kesopanan syar'i. Dibuat dengan siluet jatuh (flowy) yang elegan dan tidak menjiplak lekuk tubuh.

Keunggulan & Spesifikasi:
• Material Utama: Premium High-Grade Fabric bertekstur halus, adem, menyerap keringat, dan tidak menerawang.
• Akses Resleting: Resleting depan tersembunyi (Busui Friendly) yang praktis dan rapi.
• Desain Lengan: Manset elastis manis (Wudhu Friendly) yang mudah dinaikkan saat berwudhu.
• Fitur Tambahan: Saku samping fungsional kanan-kiri yang tersembunyi rapi.
• Rekomendasi Pemakaian: Ideal untuk busana kondangan, pesta keluarga, pengajian formal, hingga daily modest look.

Petunjuk Perawatan:
Cuci dengan tangan atau putaran mesin lembut suhu air normal. Hindari pemutih pakaian, jemur di tempat teduh, dan setrika dengan suhu sedang untuk menjaga kelembutan serat kain.

#RahayuFashion #${cat.replace(/\s+/g, "")} #BusanaMuslimah #ModestOOTD #BusuiFriendly #HijabChic`;

      setProductForm((prev) => ({
        ...prev,
        desc: generatedDesc,
        promoBadge: prev.promoBadge || "HOT REKOMENDASI",
      }));
      setIsAiCopywriting(false);
    }, 600);
  };

  // Payment Method Handlers
  const handleOpenEditPayment = (method: PaymentConfig) => {
    setEditingPayment(method);
    setPaymentEditForm({
      description: method.description,
      fee: method.fee,
      accountNumber: method.accountNumber || "",
      accountName: method.accountName || "",
      qrImageUrl: method.qrImageUrl || "",
      instructions: method.instructions ? [...method.instructions] : [],
    });
    setNewInstructionText("");
  };

  const handleSavePaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;
    updatePaymentMethod(editingPayment.id, {
      description: paymentEditForm.description,
      fee: paymentEditForm.fee,
      accountNumber: paymentEditForm.accountNumber,
      accountName: paymentEditForm.accountName,
      qrImageUrl: paymentEditForm.qrImageUrl,
      instructions: paymentEditForm.instructions,
    });
    setEditingPayment(null);
  };

  const handleAddInstructionStep = () => {
    if (!newInstructionText.trim()) return;
    setPaymentEditForm((prev) => ({
      ...prev,
      instructions: [...prev.instructions, newInstructionText.trim()],
    }));
    setNewInstructionText("");
  };

  const handleRemoveInstructionStep = (index: number) => {
    setPaymentEditForm((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, idx) => idx !== index),
    }));
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

  // Auth gate check
  if (!isMounted || !isAdminLoggedIn || !adminUser) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-14 h-14 rounded-2xl bg-purple-900/50 border border-purple-500/50 flex items-center justify-center mb-4 animate-pulse">
          <Lock className="w-7 h-7 text-purple-400" />
        </div>
        <h2 className="text-xl font-bold mb-2">Memeriksa Izin Akses Admin Internal...</h2>
        <p className="text-xs text-zinc-400 mb-6 max-w-sm">
          Akses portal ini khusus untuk staf internal Rahayu Fashion Store. Jika Anda belum masuk, silakan login melalui portal internal.
        </p>
        <Link
          href="/admin/login"
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white transition shadow-lg shadow-purple-900/40"
        >
          Buka Halaman Login Admin Internal
        </Link>
      </div>
    );
  }

  const currentRoleConfig = ADMIN_ROLES_CONFIG[adminUser.role] || ADMIN_ROLES_CONFIG.SUPER_ADMIN;
  const isModuleAllowed = (mod: AdminModuleId) => currentRoleConfig.allowedModules.includes(mod);

  const handleModuleClick = (mod: AdminModuleId, moduleName: string) => {
    if (!isModuleAllowed(mod)) {
      setLockedModuleNotice({
        moduleId: mod,
        moduleName,
        requiredRole: mod === "payments" ? "Super Admin atau Finance" : "Super Admin",
      });
      return;
    }
    setActiveModule(mod);
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
                Internal Marketplace & Store Management (v4.2 RBAC)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs">
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

            {/* Staff profile with Role Badge, Switch Role button, and Logout button */}
            <div className="flex items-center gap-2 pl-3 border-l border-zinc-700">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-purple-900 border border-purple-500 shrink-0">
                {adminUser.avatarUrl ? (
                  <img src={adminUser.avatarUrl} alt={adminUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-xs text-purple-200">
                    {adminUser.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="hidden lg:block text-left">
                <span className="text-xs font-bold text-white block leading-tight truncate max-w-[130px]">
                  {adminUser.name}
                </span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${currentRoleConfig.badgeBg} ${currentRoleConfig.badgeColor}`}>
                  {currentRoleConfig.label.split(" ")[0]}
                </span>
              </div>

              {/* Role Switcher Button */}
              <button
                onClick={() => setIsRoleModalOpen(true)}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Ganti Peran / Role Akses Admin"
              >
                <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Ganti Role</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={() => {
                  if (confirm("Keluar dari Portal Admin Internal?")) {
                    adminLogout();
                    router.push("/admin/login");
                  }
                }}
                className="p-1.5 rounded bg-zinc-800 hover:bg-rose-950/70 text-zinc-400 hover:text-rose-400 border border-zinc-700 hover:border-rose-800 transition cursor-pointer"
                title="Keluar dari Akun Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Admin Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (9 Internal Modules with RBAC) */}
        <aside className="w-64 bg-white border-r border-zinc-200 p-4 shrink-0 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-1">
            {/* Active Staff Role Card in Sidebar */}
            <div className="p-3 mb-3 rounded-xl bg-purple-50/70 border border-purple-100">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentRoleConfig.badgeBg} ${currentRoleConfig.badgeColor} ${currentRoleConfig.badgeBorder}`}>
                  {currentRoleConfig.label}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono font-semibold">
                  {currentRoleConfig.allowedModules.length}/9 Modul
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 font-medium truncate">{adminUser.department}</p>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3 block mb-2">
              Menu Kontrol Marketplace
            </span>

            {/* 1. Analytics & Dashboard */}
            <button
              onClick={() => handleModuleClick("analytics", "Analisa & Dashboard")}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                activeModule === "analytics"
                  ? "bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold"
                  : isModuleAllowed("analytics")
                  ? "text-zinc-600 hover:bg-zinc-100"
                  : "text-zinc-400 bg-zinc-50/60 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className={`w-4 h-4 ${isModuleAllowed("analytics") ? "text-purple-600" : "text-zinc-400"}`} />
                <span>Analisa & Dashboard</span>
              </div>
              {!isModuleAllowed("analytics") && <Lock className="w-3 h-3 text-zinc-400" />}
            </button>

            {/* 2. Categories */}
            <button
              onClick={() => handleModuleClick("categories", "Kategori & Ukuran Dinamis")}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                activeModule === "categories"
                  ? "bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold"
                  : isModuleAllowed("categories")
                  ? "text-zinc-600 hover:bg-zinc-100"
                  : "text-zinc-400 bg-zinc-50/60 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className={`w-4 h-4 ${isModuleAllowed("categories") ? "text-purple-600" : "text-zinc-400"}`} />
                <span>Kategori & Ukuran</span>
              </div>
              {!isModuleAllowed("categories") && (
                <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Kunci</span>
                </span>
              )}
            </button>

            {/* 3. Products */}
            <button
              onClick={() => handleModuleClick("products", "Katalog & Video Singkat")}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                activeModule === "products"
                  ? "bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold"
                  : isModuleAllowed("products")
                  ? "text-zinc-600 hover:bg-zinc-100"
                  : "text-zinc-400 bg-zinc-50/60 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className={`w-4 h-4 ${isModuleAllowed("products") ? "text-purple-600" : "text-zinc-400"}`} />
                <span>Katalog & Video PDP</span>
              </div>
              {!isModuleAllowed("products") && (
                <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Kunci</span>
                </span>
              )}
            </button>

            {/* 4. Orders */}
            <button
              onClick={() => handleModuleClick("orders", "Pesanan & No. Resi (AWB)")}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                activeModule === "orders"
                  ? "bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold"
                  : isModuleAllowed("orders")
                  ? "text-zinc-600 hover:bg-zinc-100"
                  : "text-zinc-400 bg-zinc-50/60 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Truck className={`w-4 h-4 ${isModuleAllowed("orders") ? "text-purple-600" : "text-zinc-400"}`} />
                <span>Pesanan & No. Resi</span>
              </div>
              {isModuleAllowed("orders") ? (
                orders.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                    {orders.length}
                  </span>
                )
              ) : (
                <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Kunci</span>
                </span>
              )}
            </button>

            {/* 5. Payments */}
            <button
              onClick={() => handleModuleClick("payments", "Payment Gateway Control Panel")}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                activeModule === "payments"
                  ? "bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold"
                  : isModuleAllowed("payments")
                  ? "text-zinc-600 hover:bg-zinc-100"
                  : "text-zinc-400 bg-zinc-50/60 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className={`w-4 h-4 ${isModuleAllowed("payments") ? "text-purple-600" : "text-zinc-400"}`} />
                <span>Payment Gateway</span>
              </div>
              {!isModuleAllowed("payments") && (
                <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Kunci</span>
                </span>
              )}
            </button>

            {/* 6. Promos */}
            <button
              onClick={() => handleModuleClick("promos", "Promo & Highlight Badges")}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                activeModule === "promos"
                  ? "bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold"
                  : isModuleAllowed("promos")
                  ? "text-zinc-600 hover:bg-zinc-100"
                  : "text-zinc-400 bg-zinc-50/60 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Percent className={`w-4 h-4 ${isModuleAllowed("promos") ? "text-purple-600" : "text-zinc-400"}`} />
                <span>Promo & Flash Sale</span>
              </div>
              {!isModuleAllowed("promos") && (
                <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Kunci</span>
                </span>
              )}
            </button>

            {/* 7. AI Studio */}
            <button
              onClick={() => handleModuleClick("ai-studio", "Pusat Fitur AI & Switchboard")}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                activeModule === "ai-studio"
                  ? "bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold"
                  : isModuleAllowed("ai-studio")
                  ? "text-zinc-600 hover:bg-zinc-100"
                  : "text-zinc-400 bg-zinc-50/60 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className={`w-4 h-4 ${isModuleAllowed("ai-studio") ? "text-purple-600" : "text-zinc-400"}`} />
                <span>Pusat Fitur AI</span>
              </div>
              {isModuleAllowed("ai-studio") ? (
                <span className="text-[10px] text-purple-700 font-bold bg-purple-100 px-1.5 py-0.5 rounded">
                  Modular
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Kunci</span>
                </span>
              )}
            </button>

            {/* 8. SEO CMS & TikTok Live */}
            <button
              onClick={() => handleModuleClick("cms-seo", "SEO CMS & TikTok Live")}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                activeModule === "cms-seo"
                  ? "bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold"
                  : isModuleAllowed("cms-seo")
                  ? "text-zinc-600 hover:bg-zinc-100"
                  : "text-zinc-400 bg-zinc-50/60 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Share2 className={`w-4 h-4 ${isModuleAllowed("cms-seo") ? "text-purple-600" : "text-zinc-400"}`} />
                <span>SEO & TikTok Live</span>
              </div>
              {!isModuleAllowed("cms-seo") && (
                <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Kunci</span>
                </span>
              )}
            </button>

            {/* 9. Layout Beranda */}
            <button
              onClick={() => handleModuleClick("layout", "Tata Letak & Section Beranda")}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                activeModule === "layout"
                  ? "bg-purple-50 text-purple-800 border-l-4 border-purple-700 font-bold"
                  : isModuleAllowed("layout")
                  ? "text-zinc-600 hover:bg-zinc-100"
                  : "text-zinc-400 bg-zinc-50/60 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutTemplate className={`w-4 h-4 ${isModuleAllowed("layout") ? "text-purple-600" : "text-zinc-400"}`} />
                <span>Tata Letak Beranda</span>
              </div>
              {!isModuleAllowed("layout") && (
                <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Kunci</span>
                </span>
              )}
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

                </div>
              </div>

              {/* SALES CHART (OMZET & ORDER VOLUME) */}
              <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-purple-700" />
                      <span>Grafik Tren Penjualan 7 Hari Terakhir</span>
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Performa omset harian dan lonjakan pesanan dari live stream
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setAnalyticsChartMode("omzet")}
                      className={`px-3 py-1 rounded-md transition cursor-pointer ${
                        analyticsChartMode === "omzet"
                          ? "bg-white text-purple-800 shadow-xs font-bold"
                          : "text-zinc-600 hover:text-zinc-900"
                      }`}
                    >
                      Omzet (Rp)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnalyticsChartMode("orders")}
                      className={`px-3 py-1 rounded-md transition cursor-pointer ${
                        analyticsChartMode === "orders"
                          ? "bg-white text-purple-800 shadow-xs font-bold"
                          : "text-zinc-600 hover:text-zinc-900"
                      }`}
                    >
                      Volume Pesanan (Order)
                    </button>
                  </div>
                </div>

                {/* Visual Chart Bars */}
                <div className="pt-2">
                  <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-52 pt-6 pb-2 border-b border-zinc-200">
                    {[
                      { day: "Senin", omzet: 3450000, orders: 12, label: "3.4M", barH: "30%" },
                      { day: "Selasa", omzet: 4890000, orders: 18, label: "4.8M", barH: "42%" },
                      { day: "Rabu", omzet: 6120000, orders: 24, label: "6.1M", barH: "52%" },
                      { day: "Kamis", omzet: 5750000, orders: 21, label: "5.7M", barH: "48%" },
                      { day: "Jumat", omzet: 8400000, orders: 32, label: "8.4M", barH: "68%" },
                      { day: "Sabtu (Live)", omzet: 12650000, orders: 48, label: "12.6M", barH: "88%", isPeak: true },
                      { day: "Minggu (Peak)", omzet: 14280000, orders: 54, label: "14.2M", barH: "100%", isPeak: true },
                    ].map((item, idx) => {
                      const displayVal =
                        analyticsChartMode === "omzet"
                          ? `Rp ${item.label}`
                          : `${item.orders} Order`;
                      const heightPct =
                        analyticsChartMode === "omzet"
                          ? item.barH
                          : `${Math.round((item.orders / 54) * 100)}%`;

                      return (
                        <div key={idx} className="flex flex-col items-center h-full justify-end group">
                          {/* Value on Hover / Top */}
                          <span className="text-[10px] font-bold text-zinc-700 mb-1 group-hover:text-purple-700 transition">
                            {displayVal}
                          </span>
                          {/* Bar */}
                          <div className="w-full bg-zinc-100 rounded-t-md h-full flex items-end overflow-hidden">
                            <div
                              className={`w-full rounded-t-md transition-all duration-500 group-hover:brightness-110 ${
                                item.isPeak
                                  ? "bg-gradient-to-t from-purple-800 to-pink-500"
                                  : "bg-purple-700"
                              }`}
                              style={{ height: heightPct }}
                            />
                          </div>
                          {/* Day Label */}
                          <span className="text-[10.5px] font-medium text-zinc-500 mt-2 truncate max-w-full">
                            {item.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-zinc-400 pt-2">
                    <span>* Data tersinkronisasi otomatis setiap 15 menit dari checkout webfront</span>
                    <span className="text-emerald-600 font-semibold">
                      Peak tertinggi: Minggu (TikTok Live Showcase)
                    </span>
                  </div>
                </div>
              </div>

              {/* AI DEMAND & SEASONAL INVENTORY FORECAST (Modular with Toggle) */}
              {aiFeaturesConfig.enableDemandForecast && (
                <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-zinc-900 text-white p-6 rounded-xl shadow-lg border border-purple-500/30 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                        <Sparkles className="w-4 h-4 fill-amber-300" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                          <span>AI Demand & Seasonal Inventory Forecast</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                            🟢 AI Engine Aktif
                          </span>
                        </h3>
                        <p className="text-xs text-purple-200">
                          Prediksi lonjakan pesanan musiman & peringatan habisnya stok berbasis data tren belanja
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-purple-300 bg-white/5 px-3 py-1 rounded-full border border-white/10 font-mono">
                      Analisis Periode: Menjelang Ramadhan & Gajian
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Spike Prediction */}
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10 space-y-2">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs uppercase tracking-wider">
                        <TrendingUp className="w-4 h-4" />
                        <span>Prediksi Lonjakan Musim Ramadhan</span>
                      </div>
                      <p className="text-purple-100 leading-relaxed">
                        Diproyeksikan terjadi lonjakan pesanan <strong>+185%</strong> dalam 2–3 minggu ke depan. Kategori <strong>Gamis Silk</strong> dan <strong>Hijab Voal</strong> akan menjadi produk paling dicari.
                      </p>
                      <div className="pt-2 flex items-center justify-between text-[11px] text-purple-200 border-t border-white/10">
                        <span>Rekomendasi Safety Stock:</span>
                        <strong className="text-amber-300 font-bold">Naikkan 2.5× lipat</strong>
                      </div>
                    </div>

                    {/* Stockout Alert */}
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10 space-y-2">
                      <div className="flex items-center gap-1.5 text-rose-300 font-bold text-xs uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Risiko Kehabisan Stok (&lt; 20 Pcs)</span>
                      </div>
                      <div className="space-y-1.5">
                        {products
                          .filter((p) => p.stock < 20)
                          .slice(0, 2)
                          .map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center justify-between bg-black/20 px-2.5 py-1.5 rounded"
                            >
                              <span className="font-medium text-white truncate max-w-[180px]">
                                {p.name}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-rose-300 font-bold font-mono">
                                  {p.stock} pcs
                                </span>
                                <span className="text-[10px] text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded">
                                  Habis dlm ~2 hari
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          products
                            .filter((p) => p.stock < 20)
                            .forEach((p) => updateProductStock(p.id, p.stock + 50));
                          alert("Permintaan PO restock otomatis (+50 pcs untuk setiap SKU kritis) berhasil diajukan!");
                        }}
                        className="w-full mt-1 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-950 font-bold rounded text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Ajukan PO Restock Otomatis (+50 Semua SKU Kritis)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* REALTIME STOCK MONITOR & LOW STOCK WARNINGS */}
              <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                      <Boxes className="w-4 h-4 text-purple-700" />
                      <span>Data Stok Produk Real-Time</span>
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Pantau jumlah inventaris produk secara langsung dan peringatan stok menipis
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Filter Low Stock Button */}
                    <button
                      type="button"
                      onClick={() => setStockFilterLow(!stockFilterLow)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        stockFilterLow
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>
                        {stockFilterLow ? "Tampilkan Semua" : "Hanya Stok Menipis (<20)"}
                      </span>
                    </button>

                    {/* Stock Search Input */}
                    <input
                      type="text"
                      placeholder="Cari SKU / nama produk..."
                      value={stockSearch}
                      onChange={(e) => setStockSearch(e.target.value)}
                      className="px-3 py-1.5 border border-zinc-300 rounded-lg text-xs w-48 focus:outline-none focus:border-purple-700"
                    />
                  </div>
                </div>

                {/* Low Stock Warning Banner */}
                {(() => {
                  const lowCount = products.filter((p) => (p.stock ?? 0) < 20).length;
                  if (lowCount === 0) return null;
                  return (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-center justify-between text-xs text-amber-900">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          <strong>Peringatan Restock:</strong> Ada <strong>{lowCount} produk</strong> dengan sisa stok di bawah 20 pcs. Disarankan segera hubungi bagian produksi/konveksi.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStockFilterLow(true)}
                        className="text-amber-800 underline font-bold hover:text-amber-950 cursor-pointer text-[11px]"
                      >
                        Lihat Produk Menipis
                      </button>
                    </div>
                  );
                })()}

                {/* Stock Table */}
                <div className="overflow-x-auto border border-zinc-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-semibold text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Produk</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4">Harga</th>
                        <th className="py-3 px-4">Status Stok</th>
                        <th className="py-3 px-4 text-center">Stok Realtime</th>
                        <th className="py-3 px-4 text-right">Aksi Cepat Restock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-700">
                      {products
                        .filter((p) => {
                          if (stockFilterLow && (p.stock ?? 0) >= 20) return false;
                          if (stockSearch.trim()) {
                            const q = stockSearch.toLowerCase();
                            return (
                              p.name.toLowerCase().includes(q) ||
                              p.sku.toLowerCase().includes(q) ||
                              p.category.toLowerCase().includes(q)
                            );
                          }
                          return true;
                        })
                        .map((p) => {
                          const stockVal = p.stock ?? 0;
                          const isLow = stockVal < 20 && stockVal > 0;
                          const isOut = stockVal === 0;

                          return (
                            <tr key={p.id} className="hover:bg-zinc-50">
                              <td className="py-2.5 px-4 flex items-center gap-3">
                                <div className="w-9 h-11 bg-zinc-100 rounded overflow-hidden shrink-0 border border-zinc-200">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={
                                      p.imageUrl ||
                                      `https://images.unsplash.com/photo-${1584917865442 + p.id * 1000}?auto=format&fit=crop&w=150&q=80`
                                    }
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <span className="font-bold text-zinc-900 block leading-tight">
                                    {p.name}
                                  </span>
                                  <span className="font-mono text-[10px] text-zinc-400">
                                    {p.sku}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2.5 px-4 font-medium text-zinc-600">
                                {p.category}
                              </td>
                              <td className="py-2.5 px-4 font-bold text-zinc-900">
                                Rp {p.priceIdr.toLocaleString("id-ID")}
                              </td>
                              <td className="py-2.5 px-4">
                                {isOut ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                                    Habis (0 pcs)
                                  </span>
                                ) : isLow ? (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1 w-max">
                                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                                    <span>Menipis ({stockVal} pcs)</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                    Aman ({stockVal} pcs)
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-4 text-center">
                                <span className="font-mono text-sm font-extrabold text-zinc-900">
                                  {stockVal}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => updateProductStock(p.id, stockVal - 1)}
                                    className="w-6 h-6 border border-zinc-300 hover:bg-zinc-100 rounded text-xs font-bold text-zinc-600 cursor-pointer"
                                    title="Kurang 1"
                                  >
                                    -
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateProductStock(p.id, stockVal + 1)}
                                    className="w-6 h-6 border border-zinc-300 hover:bg-zinc-100 rounded text-xs font-bold text-zinc-600 cursor-pointer"
                                    title="Tambah 1"
                                  >
                                    +
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateProductStock(p.id, stockVal + 10)}
                                    className="px-2 py-1 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded text-[10px] font-bold cursor-pointer"
                                  >
                                    +10
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateProductStock(p.id, stockVal + 50)}
                                    className="px-2 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded text-[10px] font-bold cursor-pointer"
                                  >
                                    +50
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
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
                          <ImageUploader
                            label="Foto / Icon Kategori (Upload ke Server)"
                            value={editCatForm.imageUrl || ""}
                            onChange={(url) =>
                              setEditCatForm({ ...editCatForm, imageUrl: url })
                            }
                            hint="Standar: Rasio 1:1, 200×200 px (Maks 5 MB). Format: PNG transparan, WebP, atau JPG. Gambar disimpan di server local /public/uploads."
                          />
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
                        <ImageUploader
                          label="Foto / Icon Kategori (Upload ke Server)"
                          value={newCatForm.imageUrl || ""}
                          onChange={(url) =>
                            setNewCatForm({ ...newCatForm, imageUrl: url })
                          }
                          hint="Standar: Rasio 1:1, 200×200 px (Maks 5 MB). Format: PNG transparan, WebP, atau JPG. Gambar disimpan di server local /public/uploads."
                        />
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

          {/* MODULE 3: PRODUCTS & SHORT VIDEO MANAGER (FULL CRUD + AI PHOTO GENERATOR) */}
          {activeModule === "products" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">
                    Katalog Produk & Video Singkat (9:16)
                  </h1>
                  <p className="text-xs text-zinc-500">
                    Kelola data produk, update stok real-time, pasang promo badge, dan generate foto model AI
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Produk Baru</span>
                </button>
              </div>

              {/* Filters & Low Stock Warning */}
              <div className="space-y-3">
                {(() => {
                  const lowCount = products.filter((p) => (p.stock ?? 0) < 20).length;
                  if (lowCount === 0) return null;
                  return (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-center justify-between text-xs text-amber-900">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          Perhatian: Ada <strong>{lowCount} produk</strong> dengan sisa stok di bawah 20 pcs.
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Stok Menipis
                      </span>
                    </div>
                  );
                })()}

                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-zinc-200 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      placeholder="Cari produk / SKU..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="px-3 py-1.5 border border-zinc-300 rounded-md text-xs w-56 focus:outline-none focus:border-purple-700"
                    />
                    <select
                      value={productCatFilter}
                      onChange={(e) => setProductCatFilter(e.target.value)}
                      className="px-3 py-1.5 border border-zinc-300 rounded-md text-xs bg-white"
                    >
                      <option value="ALL">Semua Kategori ({products.length})</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nameId} ({products.filter((p) => p.category === c.id).length})
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-zinc-500 font-medium">
                    Total: <strong>{products.length}</strong> SKU terdaftar
                  </span>
                </div>
              </div>

              {/* Table of Products */}
              <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-semibold text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Produk & SKU</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4">Harga Jual</th>
                        <th className="py-3 px-4">Stok Inventaris</th>
                        <th className="py-3 px-4">Badge Promo</th>
                        <th className="py-3 px-4">Video PDP</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-700">
                      {products
                        .filter((p) => {
                          if (productCatFilter !== "ALL" && p.category !== productCatFilter) return false;
                          if (productSearch.trim()) {
                            const q = productSearch.toLowerCase();
                            return (
                              p.name.toLowerCase().includes(q) ||
                              p.sku.toLowerCase().includes(q) ||
                              p.category.toLowerCase().includes(q)
                            );
                          }
                          return true;
                        })
                        .map((product) => {
                          const stockVal = product.stock ?? 0;
                          const isLow = stockVal < 20 && stockVal > 0;
                          const isOut = stockVal === 0;

                          return (
                            <tr key={product.id} className="hover:bg-zinc-50">
                              <td className="py-3 px-4 flex items-center gap-3">
                                <div className="w-11 h-14 bg-zinc-100 rounded-lg overflow-hidden shrink-0 border border-zinc-200">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={
                                      product.imageUrl ||
                                      `https://images.unsplash.com/photo-${1584917865442 + product.id * 1000}?auto=format&fit=crop&w=150&q=80`
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <span className="font-bold text-zinc-900 block leading-snug truncate max-w-xs">
                                    {product.name}
                                  </span>
                                  <span className="font-mono text-[10px] text-zinc-400">
                                    {product.sku}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-medium text-zinc-700">
                                {product.category}
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-bold text-zinc-900 block">
                                  Rp {product.priceIdr.toLocaleString("id-ID")}
                                </span>
                                {product.discountPct > 0 && (
                                  <span className="text-[10px] text-zinc-400 line-through">
                                    Rp {product.origPriceIdr.toLocaleString("id-ID")}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-extrabold text-zinc-900 text-xs">
                                      {stockVal} pcs
                                    </span>
                                    {isOut ? (
                                      <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[9px] font-bold">
                                        Habis
                                      </span>
                                    ) : isLow ? (
                                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold flex items-center gap-0.5">
                                        <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                                        <span>&lt;20</span>
                                      </span>
                                    ) : (
                                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                                        Aman
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => updateProductStock(product.id, stockVal - 1)}
                                      className="px-1.5 py-0.5 border border-zinc-300 rounded text-[10px] font-bold hover:bg-zinc-100 cursor-pointer"
                                      title="Kurang 1"
                                    >
                                      -1
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => updateProductStock(product.id, stockVal + 1)}
                                      className="px-1.5 py-0.5 border border-zinc-300 rounded text-[10px] font-bold hover:bg-zinc-100 cursor-pointer"
                                      title="Tambah 1"
                                    >
                                      +1
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => updateProductStock(product.id, stockVal + 10)}
                                      className="px-1.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded text-[10px] font-bold hover:bg-purple-100 cursor-pointer"
                                      title="Restock 10"
                                    >
                                      +10
                                    </button>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold block w-max">
                                  {product.promoBadge}
                                </span>
                                {product.promoType && product.promoType !== "None" && (
                                  <span className="text-[10px] text-zinc-400 block mt-0.5">
                                    {product.promoType}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                {product.hasVideo ? (
                                  <span className="inline-flex items-center gap-1 text-purple-700 font-semibold text-[11px]">
                                    <Play className="w-3 h-3 fill-current" />
                                    <span>9:16 Aktif</span>
                                  </span>
                                ) : (
                                  <span className="text-zinc-400 text-[11px]">-</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditProduct(product)}
                                    className="p-1.5 text-zinc-500 hover:text-purple-700 hover:bg-purple-50 rounded cursor-pointer"
                                    title="Edit Produk"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProduct(product.id, product.name)}
                                    className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                                    title="Hapus Produk"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MODAL TAMBAH / EDIT PRODUK + AI GENERATOR */}
              {isAddProductModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                  <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 animate-in fade-in max-h-[92vh] overflow-y-auto shadow-2xl">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                      <div>
                        <h2 className="text-base font-bold text-zinc-900">
                          {editingProduct ? `Edit Produk: ${editingProduct.name}` : "Tambah Produk Baru"}
                        </h2>
                        <p className="text-xs text-zinc-500">
                          Lengkapi data produk, atur promo badge, update stok, dan pilih foto (upload / AI generator).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddProductModalOpen(false)}
                        className="text-zinc-400 hover:text-zinc-700 p-1 rounded-full cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                      {/* Section 1: Informasi Dasar */}
                      <div className="space-y-3 p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg">
                        <span className="font-bold text-zinc-800 text-xs block">
                          1. Informasi Produk
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold text-zinc-700 mb-1">
                              SKU Produk (Kode Unik) *
                            </label>
                            <input
                              type="text"
                              required
                              value={productForm.sku}
                              onChange={(e) =>
                                setProductForm({ ...productForm, sku: e.target.value.toUpperCase() })
                              }
                              placeholder="cth. RHY-HJB-012"
                              className="w-full px-3 py-2 border border-zinc-300 rounded-md font-mono text-xs uppercase focus:outline-none focus:border-purple-700 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-zinc-700 mb-1">
                              Kategori Produk *
                            </label>
                            <select
                              value={productForm.category}
                              onChange={(e) =>
                                setProductForm({ ...productForm, category: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs bg-white"
                            >
                              {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.nameId}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-zinc-700 mb-1">
                            Nama Produk *
                          </label>
                          <input
                            type="text"
                            required
                            value={productForm.name}
                            onChange={(e) =>
                              setProductForm({ ...productForm, name: e.target.value })
                            }
                            placeholder="cth. Amira Armani Silk Pleated Tunic"
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700 bg-white"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block font-semibold text-zinc-700">
                              Deskripsi Produk & Spesifikasi
                            </label>
                            {aiFeaturesConfig.enableAutoCopywriter && (
                              <button
                                type="button"
                                onClick={handleAiAutoCopywriting}
                                disabled={isAiCopywriting}
                                className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded text-[10.5px] font-bold shadow-2xs cursor-pointer transition disabled:opacity-50"
                                title="Buat deskripsi persuasif, spesifikasi, dan hashtag SEO otomatis dengan AI"
                              >
                                <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                                <span>{isAiCopywriting ? "Menyusun Deskripsi AI..." : "✨ Buat Deskripsi & SEO dengan AI"}</span>
                              </button>
                            )}
                          </div>
                          <textarea
                            rows={4}
                            value={productForm.desc}
                            onChange={(e) =>
                              setProductForm({ ...productForm, desc: e.target.value })
                            }
                            placeholder="Deskripsi bahan, keunggulan wudhu & busui friendly, serta panduan ukuran..."
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs bg-white focus:outline-none focus:border-purple-700 font-sans"
                          />
                        </div>
                      </div>

                      {/* Section 2: Harga, Stok & Promo */}
                      <div className="space-y-3 p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg">
                        <span className="font-bold text-zinc-800 text-xs block">
                          2. Harga, Stok Realtime & Promo
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-semibold text-zinc-700 mb-1">
                              Harga Jual (Rp) *
                            </label>
                            <input
                              type="number"
                              required
                              value={productForm.priceIdr}
                              onChange={(e) =>
                                setProductForm({
                                  ...productForm,
                                  priceIdr: parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs font-mono bg-white"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-zinc-700 mb-1">
                              Harga Asli / Coret (Rp)
                            </label>
                            <input
                              type="number"
                              value={productForm.origPriceIdr}
                              onChange={(e) =>
                                setProductForm({
                                  ...productForm,
                                  origPriceIdr: parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs font-mono bg-white"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block font-semibold text-zinc-700">
                                Stok Inventaris *
                              </label>
                              {productForm.stock < 20 && (
                                <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.2 rounded">
                                  Menipis
                                </span>
                              )}
                            </div>
                            <input
                              type="number"
                              required
                              value={productForm.stock}
                              onChange={(e) =>
                                setProductForm({
                                  ...productForm,
                                  stock: parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs font-mono bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block font-semibold text-zinc-700 mb-1">
                              Badge Promo Kustom (Teks Tampil di Foto) *
                            </label>
                            <input
                              type="text"
                              value={productForm.promoBadge}
                              onChange={(e) =>
                                setProductForm({ ...productForm, promoBadge: e.target.value })
                              }
                              placeholder="cth. SALE -30%, BUY 1 GET 1, HOT DEAL"
                              className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs bg-white font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-zinc-700 mb-1">
                              Attach ke Kampanye Promo yang Berjalan
                            </label>
                            <select
                              value={productForm.promoType}
                              onChange={(e) =>
                                setProductForm({ ...productForm, promoType: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs bg-white"
                            >
                              <option value="None">Tidak ada promo khusus</option>
                              <option value="Flash Sale 35%">Flash Sale 35%</option>
                              <option value="Ramadan Raya Mega Sale">Ramadan Raya Mega Sale</option>
                              <option value="Payday Special">Payday Special 20%</option>
                              <option value="Maternity Busui Care">Maternity Busui Care</option>
                              <option value="New Arrival Launch">New Arrival Launch</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="checkbox"
                            id="isPromoHighlightCheck"
                            checked={productForm.isPromoHighlight}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                isPromoHighlight: e.target.checked,
                              })
                            }
                            className="accent-purple-700"
                          />
                          <label
                            htmlFor="isPromoHighlightCheck"
                            className="font-semibold text-zinc-700 cursor-pointer text-xs"
                          >
                            Tampilkan di Banner Promo Highlight Beranda (Flash Sale Countdown)
                          </label>
                        </div>
                      </div>

                      {/* Section 3: Video PDP 9:16 */}
                      <div className="space-y-2 p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg">
                        <span className="font-bold text-zinc-800 text-xs block">
                          3. Video Singkat PDP (Format 9:16)
                        </span>
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={productForm.videoUrl}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                videoUrl: e.target.value,
                                hasVideo: !!e.target.value.trim(),
                              })
                            }
                            placeholder="https://www.tiktok.com/@rahayufashion.store/video/... atau URL video MP4"
                            className="flex-1 px-3 py-2 border border-zinc-300 rounded-md text-xs font-mono bg-white"
                          />
                        </div>
                      </div>

                      {/* Section 4: Foto Produk (Pilihan: Upload ke Server vs AI Model Generator) */}
                      <div className="space-y-3 p-3.5 bg-zinc-50 border border-purple-200 rounded-lg">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2">
                          <span className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                            <span>4. Foto Produk (Upload Server vs AI Fashion Model)</span>
                          </span>

                          {/* Tab Switcher */}
                          <div className="flex bg-zinc-200/80 p-0.5 rounded-lg text-[11px] font-semibold">
                            <button
                              type="button"
                              onClick={() => setProductImageTab("upload")}
                              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                                productImageTab === "upload"
                                  ? "bg-white text-purple-800 font-bold shadow-xs"
                                  : "text-zinc-600 hover:text-zinc-900"
                              }`}
                            >
                              📁 Upload Server
                            </button>
                            <button
                              type="button"
                              onClick={() => setProductImageTab("ai")}
                              className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                                productImageTab === "ai"
                                  ? "bg-purple-700 text-white font-bold shadow-xs"
                                  : "text-purple-700 hover:text-purple-950 font-bold"
                              }`}
                            >
                              <Wand2 className="w-3 h-3" />
                              <span>✨ Buat dengan AI</span>
                            </button>
                          </div>
                        </div>

                        {/* OPSI A: Upload Langsung ke Server */}
                        {productImageTab === "upload" && (
                          <div className="space-y-2">
                            <ImageUploader
                              label="Upload Foto Produk ke Server Lokal"
                              value={productForm.imageUrl}
                              onChange={(url) => setProductForm({ ...productForm, imageUrl: url })}
                              badgeStandard="Rasio 3:4 Portrait, Max 1.5 MB"
                              helperText="File disimpan langsung di folder server /public/uploads/..."
                              previewHeight="h-44"
                            />
                          </div>
                        )}

                        {/* OPSI B: Generate Foto Model Fashion AI (5 Langkah) */}
                        {productImageTab === "ai" && (
                          <div className="space-y-3 bg-white p-3 rounded-lg border border-purple-200">
                            <div className="text-[11px] text-purple-900 font-bold flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                              <span>Alur Generator Foto Model Fashion AI:</span>
                            </div>

                            {/* 1. Upload Product Raw */}
                            <div className="space-y-1">
                              <label className="block font-semibold text-zinc-700 text-[11px]">
                                1. Upload Foto Baju Mentah (Flatlay / Manekin):
                              </label>
                              <ImageUploader
                                value={aiProductRawImage}
                                onChange={(url) => setAiProductRawImage(url)}
                                badgeStandard="Foto Baju Mentah"
                                helperText="Upload foto baju flatlay yang ingin dikenakan model AI"
                                previewHeight="h-28"
                                compact
                              />
                            </div>

                            {/* 2. Pilih Model Fashion */}
                            <div>
                              <label className="block font-semibold text-zinc-700 text-[11px] mb-1">
                                2. Pilih Tipe Model Fashion:
                              </label>
                              <select
                                value={aiProductModel}
                                onChange={(e) => setAiProductModel(e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded text-xs bg-white"
                              >
                                <option value="Wanita Hijabi Modest Editorial">
                                  Wanita Hijabi Modest Editorial (Usia 25-28, Elegan)
                                </option>
                                <option value="Casual Modest Muda Indonesia">
                                  Casual Modest Muda Indonesia (Look Segar & Enerjik)
                                </option>
                                <option value="Studio Hijab Nusantara Dewasa">
                                  Studio Hijab Nusantara Dewasa (Gamis Syar&apos;i Formal)
                                </option>
                                <option value="Ibu Muda Maternity & Busui">
                                  Ibu Muda Maternity &amp; Busui (Ramah &amp; Hangat)
                                </option>
                                <option value="Model Anak & Remaja Ceria">
                                  Model Anak &amp; Remaja Ceria (Pakaian Anak &amp; Bayi)
                                </option>
                              </select>
                            </div>

                            {/* 3. Tone Image & Pencahayaan */}
                            <div>
                              <label className="block font-semibold text-zinc-700 text-[11px] mb-1">
                                3. Tone Warna &amp; Pencahayaan:
                              </label>
                              <select
                                value={aiProductTone}
                                onChange={(e) => setAiProductTone(e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded text-xs bg-white"
                              >
                                <option value="Warm Sunlight Golden Hour">
                                  Warm Sunlight Golden Hour (Cahaya Hangat Alami)
                                </option>
                                <option value="Clean Minimalist Studio Lighting">
                                  Clean Minimalist Studio Lighting (Putih Bersih Lookbook)
                                </option>
                                <option value="High-Fashion Editorial Earthy Tone">
                                  High-Fashion Editorial Earthy Tone (Estetik Mewah)
                                </option>
                                <option value="Soft Pastel Feminine Chic">
                                  Soft Pastel Feminine Chic (Lembut Feminin)
                                </option>
                              </select>
                            </div>

                            {/* 4. Trigger Generator */}
                            <div className="pt-1">
                              <button
                                type="button"
                                disabled={isProductAiGenerating}
                                onClick={handleRunProductAiGenerate}
                                className="w-full py-2 bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-800 hover:to-pink-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-60"
                              >
                                {isProductAiGenerating ? (
                                  <>
                                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                                    <span>Memproses Model AI (~Rp 500 API)...</span>
                                  </>
                                ) : (
                                  <>
                                    <Wand2 className="w-3.5 h-3.5" />
                                    <span>4. Generate Foto Model AI Sekarang</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* 5. Result & Apply */}
                            {aiProductResult && (
                              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg space-y-2">
                                <span className="font-bold text-purple-900 text-xs block">
                                  5. Hasil Render Foto Model AI:
                                </span>
                                <div className="h-44 w-32 mx-auto rounded-lg overflow-hidden border border-purple-300 shadow-sm">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={aiProductResult}
                                    alt="Hasil AI"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={handleApplyAiImageToProduct}
                                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Gunakan Foto AI Ini untuk Produk</span>
                                </button>
                              </div>
                            )}

                            {productForm.imageUrl && (
                              <div className="text-[11px] text-zinc-500 pt-1">
                                Foto aktif yang akan disimpan:{" "}
                                <strong className="text-zinc-800 font-mono truncate block">
                                  {productForm.imageUrl}
                                </strong>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Modal Actions */}
                      <div className="flex gap-2 pt-2 border-t border-zinc-100">
                        <button
                          type="button"
                          onClick={() => setIsAddProductModalOpen(false)}
                          className="flex-1 py-2.5 border border-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-50 cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{editingProduct ? "Simpan Perubahan Produk" : "Tambah Produk"}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODULE 4: ORDERS & AWB RESI DISPATCHER (FLOW-BASED TABS) */}
          {activeModule === "orders" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-zinc-900">
                  Manajemen Pesanan & Input Resi Pengiriman (AWB)
                </h1>
                <p className="text-xs text-zinc-500">
                  Kelola alur transaksi per tahap (Menunggu Bayar $\rightarrow$ Dikemas $\rightarrow$ Dikirim $\rightarrow$ Selesai) tersinkron dengan halaman Profil Pelanggan
                </p>
              </div>

              {/* Order Flow Tabs */}
              <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  {[
                    { label: "Semua Pesanan", value: "ALL", count: orders.length },
                    {
                      label: "Menunggu Pembayaran",
                      value: "MENUNGGU_PEMBAYARAN",
                      count: orders.filter((o) => o.status === "MENUNGGU_PEMBAYARAN").length,
                    },
                    {
                      label: "Sedang Dikemas",
                      value: "DIKEMAS",
                      count: orders.filter((o) => o.status === "DIKEMAS").length,
                    },
                    {
                      label: "Dalam Pengiriman",
                      value: "DIKIRIM",
                      count: orders.filter((o) => o.status === "DIKIRIM").length,
                    },
                    {
                      label: "Pesanan Selesai",
                      value: "SELESAI",
                      count: orders.filter((o) => o.status === "SELESAI").length,
                    },
                    {
                      label: "Dibatalkan",
                      value: "DIBATALKAN",
                      count: orders.filter((o) => o.status === "DIBATALKAN").length,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setAdminOrderFilter(tab.value)}
                      className={`px-3.5 py-2 rounded-lg font-bold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                        adminOrderFilter === tab.value
                          ? "bg-purple-700 text-white shadow-xs"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          adminOrderFilter === tab.value
                            ? "bg-white/20 text-white"
                            : "bg-zinc-200 text-zinc-700"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Cards List */}
              <div className="space-y-4">
                {orders
                  .filter((o) => {
                    if (adminOrderFilter === "ALL") return true;
                    return o.status === adminOrderFilter;
                  })
                  .map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs space-y-4 hover:border-purple-200 transition"
                    >
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-zinc-900 font-mono text-sm">
                            {order.id}
                          </span>
                          <span className="text-zinc-400">•</span>
                          <span className="text-zinc-500">{order.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-500">Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value as OrderStatus)
                            }
                            className="px-2.5 py-1 border border-zinc-300 rounded text-xs font-bold bg-white focus:outline-none focus:border-purple-700"
                          >
                            <option value="MENUNGGU_PEMBAYARAN">MENUNGGU PEMBAYARAN</option>
                            <option value="DIKEMAS">SEDANG DIKEMAS</option>
                            <option value="DIKIRIM">DIKIRIM (DALAM PENGIRIMAN)</option>
                            <option value="SELESAI">SELESAI (DELIVERED)</option>
                            <option value="DIBATALKAN">DIBATALKAN</option>
                          </select>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        {/* Penerima */}
                        <div className="space-y-1">
                          <span className="text-zinc-400 uppercase font-semibold text-[10px] block">
                            Penerima &amp; Alamat Tujuan:
                          </span>
                          <p className="font-bold text-zinc-900">
                            {order.address.recipient} ({order.address.phone})
                          </p>
                          <p className="text-zinc-600 text-[11px] leading-relaxed">
                            {order.address.fullAddress}, {order.address.city}
                          </p>
                          {order.address.tagLocation && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold">
                              📍 {order.address.tagLocation}
                            </span>
                          )}
                        </div>

                        {/* Metode Pembayaran & Kurir */}
                        <div className="space-y-1">
                          <span className="text-zinc-400 uppercase font-semibold text-[10px] block">
                            Pembayaran &amp; Kurir:
                          </span>
                          <p className="font-semibold text-zinc-800">
                            {order.paymentMethod.name}
                          </p>
                          {order.accountNumber && (
                            <p className="font-mono text-zinc-500 text-[11px]">
                              VA / Rek: {order.accountNumber}
                            </p>
                          )}
                          <p className="text-zinc-600 text-[11px] pt-1">
                            Kurir: <strong>{order.courier.name}</strong> ({order.courier.service})
                          </p>
                          <p className="text-purple-700 font-bold text-sm">
                            Total: Rp {order.totalAmount.toLocaleString("id-ID")}
                          </p>
                        </div>

                        {/* Flow Action & Nomor Resi AWB */}
                        <div className="space-y-2 bg-zinc-50 p-3 rounded-lg border border-zinc-200/80">
                          <span className="text-zinc-700 uppercase font-bold text-[10px] block">
                            Aksi Alur Pesanan:
                          </span>

                          {/* 1. Menunggu Pembayaran Action */}
                          {order.status === "MENUNGGU_PEMBAYARAN" && (
                            <div className="space-y-1.5">
                              <button
                                type="button"
                                onClick={() => updateOrderStatus(order.id, "DIKEMAS")}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Verifikasi Lunas &rarr; Pindah ke Dikemas</span>
                              </button>
                              <span className="text-[10px] text-zinc-400 block text-center">
                                Mengubah status agar gudang segera mem-packing pesanan
                              </span>
                            </div>
                          )}

                          {/* 2. Dikemas Action: Input Resi */}
                          {order.status === "DIKEMAS" && (
                            <div className="space-y-2">
                              <span className="text-[11px] font-semibold text-blue-800 block">
                                Input Nomor Resi untuk Mengirim:
                              </span>
                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  placeholder="cth. JNE-99481029"
                                  value={awbInputs[order.id] || order.awb || ""}
                                  onChange={(e) =>
                                    setAwbInputs({ ...awbInputs, [order.id]: e.target.value.toUpperCase() })
                                  }
                                  className="flex-1 px-2.5 py-1.5 border border-zinc-300 rounded font-mono text-xs uppercase bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveAwb(order.id)}
                                  className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded text-xs font-bold cursor-pointer shadow-xs"
                                >
                                  Kirim
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 3. Dikirim Action: Lacak & Selesaikan */}
                          {order.status === "DIKIRIM" && (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-mono font-bold text-purple-800">
                                  Resi: {order.awb || "Belum ada resi"}
                                </span>
                                <span className="text-emerald-600 font-semibold text-[10px]">
                                  ✓ Live Kurir
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => updateOrderStatus(order.id, "SELESAI")}
                                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Tandai Selesai (Diterima)</span>
                              </button>
                            </div>
                          )}

                          {/* 4. Selesai */}
                          {order.status === "SELESAI" && (
                            <div className="text-center py-1">
                              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Pesanan Telah Selesai</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="pt-2 border-t border-zinc-100 flex items-center gap-2 text-xs text-zinc-500 overflow-x-auto">
                        <span className="font-semibold text-zinc-700 shrink-0">Produk ({order.items.length}):</span>
                        {order.items.map((it, idx) => (
                          <span
                            key={idx}
                            className="bg-zinc-100 px-2 py-0.5 rounded text-[11px] text-zinc-700 whitespace-nowrap"
                          >
                            {it.product.name} ({it.selectedSize}, {it.quantity}x)
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* MODULE 5: PAYMENT GATEWAYS CONTROL PANEL (EDIT PROCEDURES & QR UPLOAD) */}
          {activeModule === "payments" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-zinc-900">
                  Pengaturan Metode Pembayaran (Payment Gateway)
                </h1>
                <p className="text-xs text-zinc-500">
                  Kelola channel pembayaran, ubah deskripsi, upload foto QRIS ke server, dan sesuaikan petunjuk/prosedur langkah pembayaran untuk pembeli di webfront.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-2xs divide-y divide-zinc-200">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-zinc-50 transition"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      {/* Toggle Active Button */}
                      <button
                        type="button"
                        onClick={() => togglePaymentMethod(method.id)}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                          method.isActive ? "bg-purple-700" : "bg-zinc-300"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                            method.isActive ? "left-7" : "left-1"
                          }`}
                        />
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-zinc-900">
                            {method.name}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                            {method.category}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-500 block truncate mt-0.5">
                          {method.description}
                        </span>
                        {method.accountNumber && (
                          <span className="text-[11px] font-mono text-purple-800 block mt-0.5">
                            No. VA / Rek: {method.accountNumber} {method.accountName ? `(${method.accountName})` : ""}
                          </span>
                        )}
                        {method.instructions && method.instructions.length > 0 && (
                          <span className="text-[10px] text-zinc-400 block mt-0.5">
                            ✓ {method.instructions.length} langkah petunjuk tersimpan
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="text-zinc-500 text-[11px]">Biaya:</span>
                        <span className="font-mono font-bold text-zinc-800">
                          Rp {method.fee.toLocaleString("id-ID")}
                        </span>
                      </div>

                      {/* Edit Procedure & Details Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditPayment(method)}
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Prosedur &amp; Detail</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* MODAL EDIT DETAIL & PROSEDUR PEMBAYARAN */}
              {editingPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                  <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 animate-in fade-in max-h-[92vh] overflow-y-auto shadow-2xl">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                      <div>
                        <h2 className="text-base font-bold text-zinc-900">
                          Edit Detail Pembayaran: {editingPayment.name}
                        </h2>
                        <p className="text-xs text-zinc-500">
                          Data dan petunjuk langkah ini akan langsung muncul di checkout &amp; detail pesanan webfront.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingPayment(null)}
                        className="text-zinc-400 hover:text-zinc-700 p-1 rounded-full cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSavePaymentMethod} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-zinc-700 mb-1">
                          Deskripsi Singkat Channel *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={paymentEditForm.description}
                          onChange={(e) =>
                            setPaymentEditForm({ ...paymentEditForm, description: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-zinc-700 mb-1">
                            Nomor VA / Rekening Bank
                          </label>
                          <input
                            type="text"
                            value={paymentEditForm.accountNumber}
                            onChange={(e) =>
                              setPaymentEditForm({ ...paymentEditForm, accountNumber: e.target.value })
                            }
                            placeholder="cth. 88012081288776655"
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md font-mono text-xs focus:outline-none focus:border-purple-700"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-zinc-700 mb-1">
                            Nama Pemilik Rekening / Merchant
                          </label>
                          <input
                            type="text"
                            value={paymentEditForm.accountName}
                            onChange={(e) =>
                              setPaymentEditForm({ ...paymentEditForm, accountName: e.target.value })
                            }
                            placeholder="cth. RAHAYU STORE - BCA"
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-purple-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-zinc-700 mb-1">
                          Biaya Admin Bank (Rp)
                        </label>
                        <input
                          type="number"
                          value={paymentEditForm.fee}
                          onChange={(e) =>
                            setPaymentEditForm({
                              ...paymentEditForm,
                              fee: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs font-mono"
                        />
                      </div>

                      {/* Image Uploader for QRIS */}
                      {editingPayment.category === "QRIS" && (
                        <div className="space-y-1.5 p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                          <ImageUploader
                            label="Upload Gambar QR Code / QRIS ke Server"
                            value={paymentEditForm.qrImageUrl}
                            onChange={(url) =>
                              setPaymentEditForm({ ...paymentEditForm, qrImageUrl: url })
                            }
                            badgeStandard="QRIS Code Image"
                            helperText="File QR code disimpan di server /public/uploads"
                            previewHeight="h-32"
                            compact
                          />
                        </div>
                      )}

                      {/* Step-by-Step Payment Instructions */}
                      <div className="space-y-2.5 p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <label className="block font-bold text-zinc-800 text-xs">
                            Prosedur / Langkah Petunjuk Pembayaran:
                          </label>
                          <span className="text-[10px] text-purple-700 font-semibold">
                            {paymentEditForm.instructions.length} Langkah
                          </span>
                        </div>

                        {/* Existing steps */}
                        <div className="space-y-1.5 max-h-44 overflow-y-auto">
                          {paymentEditForm.instructions.map((step, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-2 p-2 bg-white border border-zinc-200 rounded text-xs"
                            >
                              <div className="flex items-start gap-2">
                                <span className="font-bold text-purple-700 shrink-0">{idx + 1}.</span>
                                <span className="text-zinc-700 leading-snug">{step}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveInstructionStep(idx)}
                                className="p-1 text-zinc-400 hover:text-rose-600 rounded cursor-pointer shrink-0"
                                title="Hapus langkah"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add Step Input */}
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Ketik petunjuk langkah baru (cth. Masukkan PIN m-BCA)..."
                            value={newInstructionText}
                            onChange={(e) => setNewInstructionText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddInstructionStep();
                              }
                            }}
                            className="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-white focus:outline-none focus:border-purple-700"
                          />
                          <button
                            type="button"
                            onClick={handleAddInstructionStep}
                            className="px-3 py-1.5 bg-zinc-800 hover:bg-purple-800 text-white rounded text-xs font-bold cursor-pointer"
                          >
                            + Tambah
                          </button>
                        </div>
                      </div>

                      {/* Modal Actions */}
                      <div className="flex gap-2 pt-2 border-t border-zinc-100">
                        <button
                          type="button"
                          onClick={() => setEditingPayment(null)}
                          className="flex-1 py-2.5 border border-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-50 cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Simpan Prosedur Pembayaran</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
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

          {/* MODULE 7: AI PRODUCT PHOTO GENERATOR STUDIO & SWITCHBOARD */}
          {activeModule === "ai-studio" && (
            <div className="space-y-6">
              {/* AI MODULAR SWITCHBOARD (LEPAS-PASANG FITUR AI) */}
              <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-700 fill-purple-700" />
                      <span>Pusat Kontrol Lepas-Pasang Fitur AI (AI Switchboard)</span>
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Aktifkan atau nonaktifkan fitur AI secara modular kapan saja. Fitur bersifat opsional dan sistem inti toko tetap berjalan 100% normal tanpa hambatan saat dimatikan.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                    Sistem Modular & Fleksibel
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                  {/* Switch 1: Smart Size */}
                  <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                          <Ruler className="w-3.5 h-3.5 text-purple-600" />
                          <span>AI Smart Size & Fit</span>
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            aiFeaturesConfig.enableSmartSize
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-zinc-200 text-zinc-600"
                          }`}
                        >
                          {aiFeaturesConfig.enableSmartSize ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-snug">
                        Tombol rekomendasi ukuran otomatis di halaman produk (PDP) pembeli. Jika dinonaktifkan, tombol AI di PDP disembunyikan.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateAiFeaturesConfig({
                          enableSmartSize: !aiFeaturesConfig.enableSmartSize,
                        })
                      }
                      className={`w-full py-1.5 rounded font-bold text-xs cursor-pointer transition ${
                        aiFeaturesConfig.enableSmartSize
                          ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                          : "bg-purple-700 hover:bg-purple-800 text-white"
                      }`}
                    >
                      {aiFeaturesConfig.enableSmartSize ? "Matikan Fitur" : "Aktifkan Fitur"}
                    </button>
                  </div>

                  {/* Switch 2: Virtual Stylist */}
                  <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>AI Virtual Stylist Chat</span>
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            aiFeaturesConfig.enableVirtualStylist
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-zinc-200 text-zinc-600"
                          }`}
                        >
                          {aiFeaturesConfig.enableVirtualStylist ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-snug">
                        Floating chatbot "Tanya Stylist Rahayu" di pojok kanan bawah frontstore. Jika dinonaktifkan, widget chat tidak ditampilkan sama sekali.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateAiFeaturesConfig({
                          enableVirtualStylist: !aiFeaturesConfig.enableVirtualStylist,
                        })
                      }
                      className={`w-full py-1.5 rounded font-bold text-xs cursor-pointer transition ${
                        aiFeaturesConfig.enableVirtualStylist
                          ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                          : "bg-purple-700 hover:bg-purple-800 text-white"
                      }`}
                    >
                      {aiFeaturesConfig.enableVirtualStylist ? "Matikan Fitur" : "Aktifkan Fitur"}
                    </button>
                  </div>

                  {/* Switch 3: Auto Copywriter */}
                  <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                          <span>AI Auto-Copywriting</span>
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            aiFeaturesConfig.enableAutoCopywriter
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-zinc-200 text-zinc-600"
                          }`}
                        >
                          {aiFeaturesConfig.enableAutoCopywriter ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-snug">
                        Tombol generator deskripsi persuasif & hashtag SEO di form tambah/edit produk admin. Jika dimatikan, admin cukup ketik manual.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateAiFeaturesConfig({
                          enableAutoCopywriter: !aiFeaturesConfig.enableAutoCopywriter,
                        })
                      }
                      className={`w-full py-1.5 rounded font-bold text-xs cursor-pointer transition ${
                        aiFeaturesConfig.enableAutoCopywriter
                          ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                          : "bg-purple-700 hover:bg-purple-800 text-white"
                      }`}
                    >
                      {aiFeaturesConfig.enableAutoCopywriter ? "Matikan Fitur" : "Aktifkan Fitur"}
                    </button>
                  </div>

                  {/* Switch 4: Demand Forecast */}
                  <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                          <span>AI Demand Forecast</span>
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            aiFeaturesConfig.enableDemandForecast
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-zinc-200 text-zinc-600"
                          }`}
                        >
                          {aiFeaturesConfig.enableDemandForecast ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-snug">
                        Kartu prediksi lonjakan musiman dan peringatan habisnya stok di dashboard analisa. Jika dimatikan, modul forecast disembunyikan.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateAiFeaturesConfig({
                          enableDemandForecast: !aiFeaturesConfig.enableDemandForecast,
                        })
                      }
                      className={`w-full py-1.5 rounded font-bold text-xs cursor-pointer transition ${
                        aiFeaturesConfig.enableDemandForecast
                          ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                          : "bg-purple-700 hover:bg-purple-800 text-white"
                      }`}
                    >
                      {aiFeaturesConfig.enableDemandForecast ? "Matikan Fitur" : "Aktifkan Fitur"}
                    </button>
                  </div>

                  {/* Switch 5: Model Photoshoot */}
                  <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-pink-600" />
                          <span>AI Model Photoshoot</span>
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            aiFeaturesConfig.enableModelPhotoshoot
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-zinc-200 text-zinc-600"
                          }`}
                        >
                          {aiFeaturesConfig.enableModelPhotoshoot ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-snug">
                        Generator foto model virtual 5-step untuk foto katalog busana muslimah dari pakaian flatlay / manekin.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateAiFeaturesConfig({
                          enableModelPhotoshoot: !aiFeaturesConfig.enableModelPhotoshoot,
                        })
                      }
                      className={`w-full py-1.5 rounded font-bold text-xs cursor-pointer transition ${
                        aiFeaturesConfig.enableModelPhotoshoot
                          ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                          : "bg-purple-700 hover:bg-purple-800 text-white"
                      }`}
                    >
                      {aiFeaturesConfig.enableModelPhotoshoot ? "Matikan Fitur" : "Aktifkan Fitur"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Integration Banner Notice */}
              <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-zinc-50 p-5 rounded-xl border border-purple-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                      <span>Generator Foto Model AI Terintegrasi di Input Produk</span>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                        Lebih Praktis & Cepat
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed max-w-2xl">
                      Fitur photoshoot model AI kini telah disatukan langsung ke dalam formulir input produk. Anda dapat mengunggah foto mentah baju, memilih persona model muslimah, memilih tone pencahayaan, dan langsung memasangnya ke katalog hanya dalam 1 alur kerja.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModule("products");
                      handleOpenAddProduct();
                    }}
                    className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Produk & Buat Foto AI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModule("products")}
                    className="px-3.5 py-2.5 bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-700 rounded-lg text-xs font-semibold cursor-pointer transition"
                  >
                    Buka Katalog
                  </button>
                </div>
              </div>

              {/* AI History & Gallery */}
              <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-purple-700" />
                      <span>Riwayat & Arsip Foto Model AI Terbaru</span>
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Daftar foto katalog lookbook yang telah dibuat melalui generator AI pada input produk
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-zinc-500">
                    Total: {aiLogs.length} Foto
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-zinc-50/70 p-4 rounded-xl border border-zinc-200 flex gap-4 text-xs hover:border-purple-300 transition"
                    >
                      <div className="w-20 h-28 bg-zinc-200 rounded-lg overflow-hidden shrink-0 border border-zinc-300 shadow-2xs">
                        <img
                          src={log.outputUrl}
                          alt={log.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-zinc-900 truncate">{log.productName}</h4>
                            <span className="font-mono text-[10px] text-purple-700 font-bold bg-purple-100 px-1.5 py-0.5 rounded shrink-0">
                              ~Rp {log.costIdr}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-400 block mt-0.5 font-medium">
                            {log.timestamp} • {log.category}
                          </span>
                          <p className="text-zinc-600 text-[11px] mt-1.5 line-clamp-2 leading-relaxed">
                            Prompt: {log.prompt}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 text-[10px]">
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Siap Dipakai di Produk
                          </span>
                          <span className="text-zinc-400 font-mono">{log.id}</span>
                        </div>
                      </div>
                    </div>
                  ))}
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
                    <ImageUploader
                      label="Foto Background Banner Utama (Upload ke Server)"
                      value={layoutDraft.hero.backgroundImageUrl || ""}
                      onChange={(url) =>
                        setLayoutDraft({
                          ...layoutDraft,
                          hero: { ...layoutDraft.hero, backgroundImageUrl: url },
                        })
                      }
                      hint="Standar: 1920×640 px (Rasio ~3:1 Widescreen), Maks 5 MB. Gambar disimpan di server local /public/uploads."
                    />

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

      {/* MODAL 1: Role Switcher Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-900/60 border border-purple-500/60 flex items-center justify-center text-purple-300">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Ganti Peran Akses Internal (RBAC)</h3>
                  <p className="text-[11px] text-zinc-400">Pilih peran staf untuk menguji batasan hak akses modul</p>
                </div>
              </div>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {(["SUPER_ADMIN", "PRODUCT_MANAGER", "ORDER_FULFILLMENT", "MARKETING_STREAMER", "FINANCE_OPS"] as AdminRole[]).map((r) => {
                const cfg = ADMIN_ROLES_CONFIG[r];
                const isActive = adminUser?.role === r;
                return (
                  <button
                    key={r}
                    onClick={() => {
                      adminSwitchRole(r);
                      setIsRoleModalOpen(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-start justify-between gap-3 cursor-pointer ${
                      isActive
                        ? "bg-purple-950/60 border-purple-600 ring-1 ring-purple-600"
                        : "bg-zinc-800/60 border-zinc-750 hover:bg-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-white">{cfg.label}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${cfg.badgeBg} ${cfg.badgeColor} ${cfg.badgeBorder}`}>
                          {cfg.allowedModules.length} Modul
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed mb-2">{cfg.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {cfg.allowedModules.map((m) => (
                          <span key={m} className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                    {isActive ? (
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-500 font-semibold shrink-0 pt-0.5">Pilih</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500">
              <span>Peran aktif: <strong className="text-purple-300">{currentRoleConfig.label}</strong></span>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Locked Module Access Notice */}
      {lockedModuleNotice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-600/60 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-base text-white mb-1.5">
              Akses Dibatasi: {lockedModuleNotice.moduleName}
            </h3>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Peran Anda saat ini (<strong className="text-white">{currentRoleConfig.label}</strong>) tidak memiliki izin akses untuk membuka modul ini. Modul ini memerlukan peran <strong className="text-purple-300">{lockedModuleNotice.requiredRole}</strong>.
            </p>

            <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-[11px] text-zinc-300 text-left mb-5">
              <span className="font-bold text-zinc-200 block mb-1">Kenapa modul ini dikunci?</span>
              Sistem membatasi modul sensitif (seperti konfigurasi rekening payment gateway atau pengaturan toko) khusus untuk peran yang berwenang demi keamanan operasional toko.
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  adminSwitchRole("SUPER_ADMIN");
                  setActiveModule(lockedModuleNotice.moduleId);
                  setLockedModuleNotice(null);
                }}
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-900/30"
              >
                <UserCheck className="w-4 h-4" />
                <span>Ganti ke Super Admin & Buka Modul Ini</span>
              </button>
              <button
                onClick={() => setLockedModuleNotice(null)}
                className="w-full py-2 px-4 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Tutup Notifikasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
