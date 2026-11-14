"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Play,
  Heart,
  Check,
  X,
  Sparkles,
  Star,
  RefreshCw,
  ShoppingBag,
  ArrowUpDown,
  Flame,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import HeaderNavbar from "@/components/HeaderNavbar";
import Footer from "@/components/Footer";
import { useStore } from "@/context/StoreContext";
import { PRODUCTS_DATA, ProductItem } from "@/data/mock-data";
import AiSmartSizeModal from "@/components/AiSmartSizeModal";
import AiVirtualStylistChat from "@/components/AiVirtualStylistChat";

function ProductCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryCategory = searchParams.get("category") || "all";
  const querySearch = searchParams.get("search") || "";
  const queryFilter = searchParams.get("filter") || ""; // "new", "bestseller", "promo"

  const { categories, products, addToCart, aiFeaturesConfig } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(queryCategory);
  const [searchQuery, setSearchQuery] = useState<string>(querySearch);
  const [selectedFilter, setSelectedFilter] = useState<string>(queryFilter);
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"relevance" | "newest" | "price-asc" | "price-desc" | "rating">("relevance");

  // PDP Modal State
  const [activeModalProduct, setActiveModalProduct] = useState<ProductItem | null>(null);
  const [pdpMediaType, setPdpMediaType] = useState<"photo" | "video">("photo");
  const [pdpSelectedSize, setPdpSelectedSize] = useState<string>("");
  const [pdpSelectedColor, setPdpSelectedColor] = useState<string>("");
  const [isSmartSizeOpen, setIsSmartSizeOpen] = useState<boolean>(false);

  // Keep state synced with URL params when they change
  React.useEffect(() => {
    setSelectedCategory(queryCategory);
    setSearchQuery(querySearch);
    setSelectedFilter(queryFilter);
  }, [queryCategory, querySearch, queryFilter]);

  // Available sizes across categories
  const allAvailableSizes = useMemo(() => {
    const set = new Set<string>();
    categories.forEach((c) => c.sizes.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [categories]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category Filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchCat = product.category.toLowerCase().includes(query);
        const matchDesc = product.desc.toLowerCase().includes(query);
        const matchSku = product.sku.toLowerCase().includes(query);
        if (!matchName && !matchCat && !matchDesc && !matchSku) return false;
      }

      // 3. Quick Badges / Navbar Filters
      if (selectedFilter === "new" && !product.promoBadge.includes("NEW")) {
        return false;
      }
      if (selectedFilter === "bestseller" && !product.promoBadge.includes("BEST")) {
        return false;
      }
      if (selectedFilter === "promo" && !product.isPromoHighlight && product.discountPct === 0) {
        return false;
      }

      // 4. Price Range Filter
      if (selectedPriceRange === "under-100") {
        if (product.priceIdr >= 100000) return false;
      } else if (selectedPriceRange === "100-200") {
        if (product.priceIdr < 100000 || product.priceIdr > 200000) return false;
      } else if (selectedPriceRange === "200-300") {
        if (product.priceIdr < 200000 || product.priceIdr > 300000) return false;
      } else if (selectedPriceRange === "above-300") {
        if (product.priceIdr < 300000) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "newest") return b.id - a.id;
      if (sortBy === "price-asc") return a.priceIdr - b.priceIdr;
      if (sortBy === "price-desc") return b.priceIdr - a.priceIdr;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // relevance
    });
  }, [selectedCategory, searchQuery, selectedFilter, selectedPriceRange, sortBy]);

  const openPdpModal = (product: ProductItem) => {
    setActiveModalProduct(product);
    const cat = categories.find((c) => c.id === product.category) || categories[0];
    setPdpSelectedSize(cat?.sizes[0] || "All Size");
    setPdpSelectedColor(cat?.colors[0]?.name || "Default");
    setPdpMediaType("photo");
  };

  const handleAddToCart = (product: ProductItem) => {
    const cat = categories.find((c) => c.id === product.category) || categories[0];
    const sizeToUse = pdpSelectedSize || cat?.sizes[0] || "All Size";
    const colorToUse = pdpSelectedColor || cat?.colors[0]?.name || "Default";
    addToCart(product, sizeToUse, colorToUse, 1);
    setActiveModalProduct(null);
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSelectedFilter("");
    setSelectedSize("all");
    setSelectedPriceRange("all");
    setSortBy("relevance");
    router.push("/products");
  };

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="max-w-[1320px] mx-auto px-4 py-6">
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
        <Link href="/" className="hover:text-zinc-900 transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-zinc-900 transition-colors">
          Katalog Produk
        </Link>
        {selectedCategory !== "all" && (
          <>
            <span>/</span>
            <span className="text-zinc-900 font-semibold">{activeCategoryObj?.nameId || selectedCategory}</span>
          </>
        )}
        {selectedFilter && (
          <>
            <span>/</span>
            <span className="text-purple-700 font-semibold capitalize">
              {selectedFilter === "new" ? "Produk Terbaru" : selectedFilter === "bestseller" ? "Produk Terlaris" : "Promo Highlight"}
            </span>
          </>
        )}
      </nav>

      {/* 2. Header & Title Section */}
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4 border-b border-zinc-100 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-purple-700 block mb-1">
            Official Lookbook & Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            {selectedCategory !== "all"
              ? activeCategoryObj?.nameId || selectedCategory
              : selectedFilter === "new"
              ? "Koleksi Produk Terbaru"
              : selectedFilter === "bestseller"
              ? "Produk Terlaris (Best Sellers)"
              : selectedFilter === "promo"
              ? "Koleksi Promo Highlight"
              : "Seluruh Katalog Busana & Hijab"}
          </h1>
          <p className="text-xs text-zinc-500 mt-1 max-w-2xl leading-relaxed">
            {activeCategoryObj?.measurementLabel
              ? `Standar Pengukuran: ${activeCategoryObj.measurementLabel}. Dilengkapi preview video 9:16 dan panduan ukuran akurat.`
              : "Jelajahi busana muslim modern wanita, hijab voal ultrafine, baju hamil busui friendly, dan pakaian anak."}
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 border border-zinc-300 rounded text-xs font-semibold focus:outline-none focus:border-zinc-900 bg-white"
          >
            <option value="relevance">Paling Relevan</option>
            <option value="newest">Terbaru Rilis</option>
            <option value="price-asc">Harga: Terendah ke Tertinggi</option>
            <option value="price-desc">Harga: Tertinggi ke Terendah</option>
            <option value="rating">Rating Tertinggi</option>
          </select>
        </div>
      </div>

      {/* 3. Main Catalog Grid (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar Filters */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Quick Badges Filter */}
          <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 text-xs space-y-2">
            <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-800 block mb-2">
              Koleksi Spesial
            </span>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedFilter(selectedFilter === "new" ? "" : "new")}
                className={`w-full text-left px-3 py-1.5 rounded transition flex items-center justify-between cursor-pointer ${
                  selectedFilter === "new" ? "bg-purple-700 text-white font-bold" : "hover:bg-zinc-200 text-zinc-700"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Produk Terbaru</span>
                </span>
                <span className="text-[10px] opacity-75">Baru Rilis</span>
              </button>

              <button
                onClick={() => setSelectedFilter(selectedFilter === "bestseller" ? "" : "bestseller")}
                className={`w-full text-left px-3 py-1.5 rounded transition flex items-center justify-between cursor-pointer ${
                  selectedFilter === "bestseller" ? "bg-purple-700 text-white font-bold" : "hover:bg-zinc-200 text-zinc-700"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" />
                  <span>Produk Terlaris</span>
                </span>
                <span className="text-[10px] opacity-75">Favorit</span>
              </button>

              <button
                onClick={() => setSelectedFilter(selectedFilter === "promo" ? "" : "promo")}
                className={`w-full text-left px-3 py-1.5 rounded transition flex items-center justify-between cursor-pointer ${
                  selectedFilter === "promo" ? "bg-rose-600 text-white font-bold" : "hover:bg-zinc-200 text-zinc-700"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Promo Highlight</span>
                </span>
                <span className="text-[10px] opacity-75">Diskon</span>
              </button>
            </div>
          </div>

          {/* Category Tree Filter */}
          <div className="border border-zinc-200 p-4 rounded-lg text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-800">
                Kategori Produk
              </span>
              {selectedCategory !== "all" && (
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="text-[11px] text-purple-700 hover:underline cursor-pointer"
                >
                  Semua
                </button>
              )}
            </div>

            <div className="space-y-1 max-h-72 overflow-y-auto no-scrollbar">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition cursor-pointer flex items-center justify-between ${
                  selectedCategory === "all" ? "bg-purple-50 text-purple-900 font-bold border-l-2 border-purple-700" : "hover:bg-zinc-100 text-zinc-700"
                }`}
              >
                <span>Semua Kategori</span>
                <span className="text-[10px] text-zinc-400">{products.length}</span>
              </button>

              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition cursor-pointer flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? "bg-purple-50 text-purple-900 font-bold border-l-2 border-purple-700"
                        : "hover:bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    <span className="truncate pr-1">{cat.nameId}</span>
                    <span className="text-[10px] text-zinc-400 shrink-0">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="border border-zinc-200 p-4 rounded-lg text-xs space-y-2.5">
            <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-800 block border-b border-zinc-100 pb-2">
              Rentang Harga
            </span>
            <div className="space-y-1">
              {[
                { label: "Semua Harga", value: "all" },
                { label: "Di bawah Rp 100.000", value: "under-100" },
                { label: "Rp 100.000 - Rp 200.000", value: "100-200" },
                { label: "Rp 200.000 - Rp 300.000", value: "200-300" },
                { label: "Di atas Rp 300.000", value: "above-300" },
              ].map((range) => (
                <label key={range.value} className="flex items-center gap-2 cursor-pointer py-0.5">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange === range.value}
                    onChange={() => setSelectedPriceRange(range.value)}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-zinc-700 text-xs">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters CTA */}
          {(selectedCategory !== "all" || searchQuery || selectedFilter || selectedPriceRange !== "all") && (
            <button
              onClick={clearAllFilters}
              className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Semua Filter</span>
            </button>
          )}
        </aside>

        {/* Right Product Grid */}
        <div className="lg:col-span-9 space-y-4">
          {/* Active Chips & Product Count */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-50 p-3 rounded-lg border border-zinc-200 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-zinc-500 font-medium">
                Menampilkan <strong>{filteredProducts.length}</strong> produk
              </span>

              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-medium text-[11px]">
                  <span>Kategori: {selectedCategory}</span>
                  <button onClick={() => setSelectedCategory("all")} className="cursor-pointer hover:text-purple-950">
                    ✕
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-200 text-zinc-800 font-medium text-[11px]">
                  <span>Pencarian: &quot;{searchQuery}&quot;</span>
                  <button onClick={() => setSearchQuery("")} className="cursor-pointer hover:text-zinc-950">
                    ✕
                  </button>
                </span>
              )}

              {selectedFilter && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-medium text-[11px]">
                  <span>Filter: {selectedFilter}</span>
                  <button onClick={() => setSelectedFilter("")} className="cursor-pointer hover:text-rose-950">
                    ✕
                  </button>
                </span>
              )}

              {selectedPriceRange !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-200 text-zinc-800 font-medium text-[11px]">
                  <span>Harga: {selectedPriceRange}</span>
                  <button onClick={() => setSelectedPriceRange("all")} className="cursor-pointer hover:text-zinc-950">
                    ✕
                  </button>
                </span>
              )}
            </div>

            {(selectedCategory !== "all" || searchQuery || selectedFilter || selectedPriceRange !== "all") && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
              >
                Hapus Semua
              </button>
            )}
          </div>

          {/* Product Grid (3:4 Lookbook Ratio ala Hijup/Zalora) */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-zinc-200 rounded-lg p-8">
              <Search className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-800">Produk Tidak Ditemukan</h3>
              <p className="text-xs text-zinc-500 mt-1 mb-6">
                Tidak ada produk yang cocok dengan kriteria filter atau pencarian Anda.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-zinc-900 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-purple-900 transition"
              >
                Lihat Semua Koleksi
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white border border-zinc-200 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative"
                >
                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
                    {product.promoBadge && (
                      <span className="bg-[#18181B] text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
                        {product.promoBadge}
                      </span>
                    )}
                    {product.discountPct > 0 && (
                      <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5">
                        -{product.discountPct}%
                      </span>
                    )}
                  </div>

                  {/* Video Indicator / Play Trigger */}
                  {product.hasVideo && (
                    <button
                      onClick={() => openPdpModal(product)}
                      className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs text-purple-700 flex items-center justify-center shadow hover:scale-110 transition cursor-pointer"
                      title="Tonton Video Detail Produk (9:16)"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  )}

                  {/* 3:4 Portrait Image Container */}
                  <div
                    onClick={() => openPdpModal(product)}
                    className="aspect-3/4 relative bg-zinc-100 overflow-hidden cursor-pointer"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl || `https://images.unsplash.com/photo-${1584917865442 + product.id * 1000}?auto=format&fit=crop&w=600&q=80`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                      <span className="w-full py-2 bg-white/95 text-zinc-900 text-[10px] font-bold uppercase tracking-wider text-center shadow-md">
                        Lihat Detail & Ukuran
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block truncate">
                        {product.category}
                      </span>
                      <h3
                        onClick={() => openPdpModal(product)}
                        className="text-xs font-semibold text-zinc-900 line-clamp-2 leading-snug group-hover:text-purple-700 transition-colors cursor-pointer mt-0.5"
                      >
                        {product.name}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-zinc-100">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-extrabold text-zinc-900">
                          Rp {product.priceIdr.toLocaleString("id-ID")}
                        </span>
                        {product.origPriceIdr > product.priceIdr && (
                          <span className="text-[10px] text-zinc-400 line-through">
                            Rp {product.origPriceIdr.toLocaleString("id-ID")}
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-bold text-zinc-800">{product.rating}</span>
                          <span className="text-[10px] text-zinc-400">({product.reviewCount})</span>
                        </div>
                        <button
                          onClick={() => openPdpModal(product)}
                          className="text-[11px] font-bold text-purple-700 hover:text-purple-900 cursor-pointer"
                        >
                          + Beli
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. PRODUCT DETAIL MODAL (PDP with 9:16 Short Video Player) */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl animate-in fade-in flex flex-col md:flex-row overflow-hidden relative">
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 text-zinc-600 hover:text-zinc-950 flex items-center justify-center shadow-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Media Area: Photo vs 9:16 Video Player */}
            <div className="md:w-1/2 bg-zinc-900 relative flex flex-col items-center justify-center min-h-[380px] p-4">
              {pdpMediaType === "video" && activeModalProduct.hasVideo ? (
                <div className="w-full max-w-[280px] aspect-9/16 bg-black rounded-lg overflow-hidden relative shadow-2xl border border-zinc-700 flex items-center justify-center">
                  <video
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider">
                    Short Video (9:16)
                  </div>
                </div>
              ) : (
                <div className="w-full h-full max-h-[480px] flex items-center justify-center">
                  <img
                    src={`https://images.unsplash.com/photo-${1584917865442 + activeModalProduct.id * 1000}?auto=format&fit=crop&w=800&q=80`}
                    alt={activeModalProduct.name}
                    className="max-h-[460px] w-auto object-contain rounded"
                  />
                </div>
              )}

              {/* Media Switcher Buttons */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPdpMediaType("photo")}
                  className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition ${
                    pdpMediaType === "photo" ? "bg-white text-zinc-900" : "bg-black/60 text-white hover:bg-black/80"
                  }`}
                >
                  Foto Produk
                </button>
                {activeModalProduct.hasVideo && (
                  <button
                    type="button"
                    onClick={() => setPdpMediaType("video")}
                    className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${
                      pdpMediaType === "video" ? "bg-rose-600 text-white" : "bg-black/60 text-white hover:bg-black/80"
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Video Singkat (9:16)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Information Area */}
            <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                  {activeModalProduct.category} • {activeModalProduct.sku}
                </span>
                <h2 className="text-lg font-bold text-zinc-900 mt-1 leading-snug">
                  {activeModalProduct.name}
                </h2>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-2xl font-extrabold text-zinc-900">
                    Rp {activeModalProduct.priceIdr.toLocaleString("id-ID")}
                  </span>
                  {activeModalProduct.origPriceIdr > activeModalProduct.priceIdr && (
                    <span className="text-xs text-zinc-400 line-through">
                      Rp {activeModalProduct.origPriceIdr.toLocaleString("id-ID")}
                    </span>
                  )}
                  {activeModalProduct.discountPct > 0 && (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      Hemat {activeModalProduct.discountPct}%
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-600 mt-3 leading-relaxed">
                  {activeModalProduct.desc}
                </p>

                {/* Size Selector */}
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-zinc-800">Pilih Ukuran:</span>
                    <div className="flex items-center gap-2">
                      {aiFeaturesConfig.enableSmartSize && (
                        <button
                          type="button"
                          onClick={() => setIsSmartSizeOpen(true)}
                          className="text-[10px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1 cursor-pointer transition shadow-2xs"
                        >
                          <Sparkles className="w-3 h-3 fill-purple-700" />
                          <span>Rekomendasi Ukuran AI</span>
                        </button>
                      )}
                      <span className="text-zinc-500 text-[11px]">
                        {categories.find((c) => c.id === activeModalProduct.category)?.measurementLabel || "Ukuran Standar"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(
                      categories.find((c) => c.id === activeModalProduct.category)?.sizes || [
                        "S",
                        "M",
                        "L",
                        "XL",
                      ]
                    ).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setPdpSelectedSize(sz)}
                        className={`px-3 py-1.5 border rounded text-xs font-medium cursor-pointer transition ${
                          pdpSelectedSize === sz
                            ? "border-purple-700 bg-purple-50 text-purple-900 font-bold ring-1 ring-purple-700"
                            : "border-zinc-300 text-zinc-700 hover:border-zinc-400"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div className="mt-4 space-y-2">
                  <span className="font-semibold text-zinc-800 text-xs block">
                    Pilihan Warna: <strong className="text-purple-700">{pdpSelectedColor}</strong>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(
                      categories.find((c) => c.id === activeModalProduct.category)?.colors || [
                        { name: "Dusty Lilac", hex: "#C084FC" },
                        { name: "Onyx Black", hex: "#18181B" },
                        { name: "Warm Oat", hex: "#D6C7B2" },
                      ]
                    ).map((col) => (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => setPdpSelectedColor(col.name)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs cursor-pointer transition ${
                          pdpSelectedColor === col.name
                            ? "border-purple-700 bg-purple-50 text-purple-900 font-bold"
                            : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: col.hex }} />
                        <span>{col.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <div className="pt-4 border-t border-zinc-100 space-y-2">
                <button
                  type="button"
                  onClick={() => handleAddToCart(activeModalProduct)}
                  className="w-full py-3 bg-[#18181B] hover:bg-purple-900 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Tambah ke Tas Belanja</span>
                </button>
                <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Garansi original 100% & kemudahan tukar ukuran 7 hari.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* AI Smart Size Modal */}
      {isSmartSizeOpen && activeModalProduct && (
        <AiSmartSizeModal
          isOpen={isSmartSizeOpen}
          onClose={() => setIsSmartSizeOpen(false)}
          product={activeModalProduct}
          onSelectSize={(sz) => setPdpSelectedSize(sz)}
        />
      )}

      {/* AI Virtual Stylist Floating Chat */}
      <AiVirtualStylistChat />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HeaderNavbar />
      <main className="flex-1">
        <Suspense fallback={<div className="text-center p-16 text-sm text-zinc-500">Memuat katalog produk...</div>}>
          <ProductCatalogContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
