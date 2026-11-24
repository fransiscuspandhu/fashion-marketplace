"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Play, ArrowRight, ShieldCheck, RefreshCw, Sparkles, Check, X, Clock, Star, Truck, Flame, Minus, Plus, ShoppingBag } from "lucide-react";
import { CATEGORIES_DATA, PRODUCTS_DATA, ProductItem, RahayuCategory } from "@/data/mock-data";
import Footer from "@/components/Footer";
import HeaderNavbar from "@/components/HeaderNavbar";
import { useStore } from "@/context/StoreContext";
import AiSmartSizeModal from "@/components/AiSmartSizeModal";
import AiVirtualStylistChat from "@/components/AiVirtualStylistChat";

export default function HomePage() {
  const router = useRouter();
  const { categories, products, addToCart, homepageConfig, aiFeaturesConfig, tiktokConfig, showStoreToast } = useStore();
  const [isLiveModalOpen, setIsLiveModalOpen] = useState<boolean>(false);

  const pinnedLiveProduct =
    products.find((p) => p.id === tiktokConfig.pinnedProductId) || products[0] || PRODUCTS_DATA[0];
  const pinnedLiveCategory =
    categories.find((c) => c.id === pinnedLiveProduct?.category) || categories[0];

  // PDP Modal State
  const [activeModalProduct, setActiveModalProduct] = useState<ProductItem | null>(null);
  const [pdpMediaType, setPdpMediaType] = useState<"photo" | "video">("photo");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [pdpQuantity, setPdpQuantity] = useState<number>(1);
  const [isSmartSizeOpen, setIsSmartSizeOpen] = useState<boolean>(false);

  const promoHighlightProducts = products.filter((p) => p.isPromoHighlight);
  const newArrivalsProducts = products.filter((p) => p.promoBadge.includes("NEW") || p.id <= 4);
  const bestSellerProducts = products.filter((p) => p.promoBadge.includes("BEST") || p.rating >= 4.9);

  const openPdpModal = (product: ProductItem) => {
    setActiveModalProduct(product);
    const cat = categories.find((c) => c.id === product.category) || categories[0];
    setSelectedSize(cat.sizes[0] || "All Size");
    setSelectedColor(cat.colors[0]?.name || "Default");
    setPdpQuantity(1);
    setPdpMediaType("photo");
  };

  const handleAddToCart = (product: ProductItem) => {
    const cat = categories.find((c) => c.id === product.category) || categories[0];
    const sizeToUse = selectedSize || cat.sizes[0] || "All Size";
    const colorToUse = selectedColor || cat.colors[0]?.name || "Default";
    const qtyToUse = Math.max(1, pdpQuantity);
    addToCart(product, sizeToUse, colorToUse, qtyToUse);
    showStoreToast(
      "Dimasukkan ke Tas Belanja",
      `${qtyToUse}x "${product.name}" (${sizeToUse}, ${colorToUse}) siap dicheckout.`,
      "success"
    );
    setActiveModalProduct(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Editorial Header Navbar */}
      <HeaderNavbar onOpenLiveModal={() => setIsLiveModalOpen(true)} />

      {/* 3. Main Content Body */}
      <main className="flex-1">
        {/* Editorial Hero Banner + Live Showcase */}
        <section className="max-w-[1320px] mx-auto px-4 pt-5 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Hero */}
            <div className="lg:col-span-9 relative bg-[#F6F4F0] border border-zinc-200 overflow-hidden min-h-[360px] flex items-center">
              {/* Background Image if configured */}
              {homepageConfig.hero.backgroundImageUrl && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={homepageConfig.hero.backgroundImageUrl}
                    alt="Hero Banner Background"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-zinc-950/85 via-zinc-900/60 to-transparent"
                    style={{
                      opacity: (homepageConfig.hero.overlayOpacity ?? 40) / 100 + 0.35,
                    }}
                  />
                </div>
              )}

              <div
                className={`p-8 sm:p-12 max-w-xl z-10 space-y-4 ${
                  homepageConfig.hero.backgroundImageUrl ? "text-white" : "text-zinc-900"
                }`}
              >
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-semibold">
                  <span
                    className={
                      homepageConfig.hero.backgroundImageUrl
                        ? "text-purple-300 font-bold"
                        : "text-zinc-600"
                    }
                  >
                    {homepageConfig.hero.badge || "RAHAYU EXCLUSIVE COLLECTION"}
                  </span>
                  <span className="text-rose-500 font-bold">· UP TO 35% OFF</span>
                </div>
                <h1
                  className={`editorial-serif text-3xl sm:text-5xl leading-[1.12] font-normal ${
                    homepageConfig.hero.backgroundImageUrl ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {homepageConfig.hero.title || "Refined Modesty for Modern Women."}
                </h1>
                <p
                  className={`text-xs sm:text-sm leading-relaxed ${
                    homepageConfig.hero.backgroundImageUrl ? "text-zinc-200" : "text-zinc-600"
                  }`}
                >
                  {homepageConfig.hero.description ||
                    "Kurasi 11 kategori utama dengan panduan ukuran akurat, video singkat di setiap halaman produk, dan pengiriman cepat ke seluruh Indonesia."}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href={homepageConfig.hero.ctaLink || "/products"}
                    className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-semibold uppercase tracking-[0.18em] transition shadow-md"
                  >
                    {homepageConfig.hero.ctaText || "Belanja Sekarang"}
                  </Link>
                  <button
                    onClick={() => openPdpModal(PRODUCTS_DATA[0])}
                    className={`px-5 py-3 border text-[11px] font-semibold uppercase tracking-[0.15em] transition flex items-center gap-2 cursor-pointer ${
                      homepageConfig.hero.backgroundImageUrl
                        ? "bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-xs"
                        : "bg-white hover:bg-zinc-100 text-zinc-900 border-zinc-900"
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Tonton Video Produk
                  </button>
                </div>
              </div>

              {/* Graphic Backdrop (only if no custom photo background) */}
              {!homepageConfig.hero.backgroundImageUrl && (
                <div className="hidden sm:flex absolute right-0 top-0 bottom-0 w-80 items-end justify-center bg-gradient-to-l from-[#EDE8E0] to-transparent pointer-events-none">
                  <svg viewBox="0 0 260 340" className="w-64 h-80">
                    <path d="M40 340 V120 C40 55 90 20 135 20 C180 20 230 55 230 120 V340 Z" fill="#E5DFD5" />
                    <path d="M55 340 V130 C55 72 95 40 135 40 C175 40 215 72 215 130 V340 Z" fill="#FAF8F5" />
                    <path d="M82 340 L96 155 C96 135 112 124 135 124 C158 124 174 135 174 155 L188 340 Z" fill="#27272A" />
                    <path d="M98 135 L135 205 L172 135 L182 260 L88 260 Z" fill="#D6C7B2" />
                    <path d="M104 82 C104 52 166 52 166 82 C170 115 174 148 148 162 C120 168 98 140 104 82 Z" fill="#7C3AED" />
                    <circle cx="135" cy="86" r="20" fill="#F5CBA7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Right TikTok Live Widget (Connected to StoreContext tiktokConfig) */}
            <div className="lg:col-span-3 bg-zinc-900 text-white p-5 flex flex-col justify-between border border-zinc-800">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  {tiktokConfig.isLive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-600 text-[10px] font-bold uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> TIKTOK LIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-zinc-700 text-zinc-300 text-[10px] font-bold uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span> OFFLINE
                    </span>
                  )}
                  <span className="text-[11px] text-zinc-300 font-mono font-bold">
                    {tiktokConfig.viewers.toLocaleString("id-ID")} Penonton
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={tiktokConfig.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#E879F9] hover:underline truncate"
                  >
                    @{tiktokConfig.username} ↗
                  </a>
                  <span className="text-[10px] text-rose-400 font-mono shrink-0">
                    ♥ {tiktokConfig.likes.toLocaleString("id-ID")} Likes
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>Followers: <strong className="text-zinc-200">{(tiktokConfig.followers ?? 0).toLocaleString("id-ID")}</strong></span>
                  <span>·</span>
                  <span className="truncate">{tiktokConfig.schedule}</span>
                </div>
                <h3 className="editorial-serif text-base font-normal leading-snug pt-0.5">
                  {tiktokConfig.title}
                </h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Klaim kode voucher{" "}
                  <strong className="text-white font-mono">{tiktokConfig.voucherCode}</strong> saat checkout.
                </p>
              </div>

              <div
                onClick={() => openPdpModal(pinnedLiveProduct)}
                className="my-4 p-3 bg-zinc-800/90 hover:bg-zinc-800 border border-zinc-700 hover:border-purple-500/60 space-y-1.5 cursor-pointer transition"
              >
                <div className="text-[10px] uppercase tracking-wider text-amber-400 font-bold flex items-center justify-between">
                  <span>📌 Sedang Di-Spill di Live</span>
                  <span className="text-[9px] text-purple-300">Klik Detail →</span>
                </div>
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="font-medium truncate">{pinnedLiveProduct.name}</span>
                  <span className="text-rose-400 font-bold shrink-0">
                    Rp {pinnedLiveProduct.priceIdr.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400">
                  Ukuran tersedia: {(pinnedLiveCategory?.sizes || ["S", "M", "L", "XL"]).join(" · ")}
                </div>
              </div>

              <button
                onClick={() => setIsLiveModalOpen(true)}
                className="w-full py-2.5 bg-white text-zinc-900 hover:bg-[#E879F9] text-[11px] font-bold uppercase tracking-widest transition cursor-pointer"
              >
                Tonton Preview Live →
              </button>
            </div>
          </div>
        </section>

        {/* 4. Hijup-Style Circular Category Portraits */}
        <section className="max-w-[1320px] mx-auto px-4 py-6 border-t border-b border-zinc-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 block">EXPLORE BY CATEGORY</span>
              <h2 className="editorial-serif text-xl text-zinc-900">{homepageConfig.categoriesSection.title}</h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Buka Semua Katalog ({categories.length} Kategori)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-4">
            {categories.map((c) => {
              return (
                <button
                  key={c.id}
                  onClick={() => router.push(`/products?category=${encodeURIComponent(c.id)}`)}
                  className="group flex flex-col items-center text-center space-y-2 focus:outline-none cursor-pointer"
                  title={`Buka Katalog ${c.nameId}`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 ring-1 ring-zinc-200 group-hover:ring-purple-700 transition">
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
                      style={{ background: c.iconBg }}
                    >
                      {c.imageUrl ? (
                        <img
                          src={c.imageUrl}
                          alt={c.nameId}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      ) : (
                        <div className="w-11 h-14 group-hover:scale-105 transition">
                          <svg viewBox="0 0 80 100" className="w-full h-full">
                            <circle cx="40" cy="26" r="10" fill="#E6C2A6" />
                            <path d="M22 42 L15 88 L65 88 L58 42 Z" fill={c.colorHex} />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider leading-tight line-clamp-2 text-zinc-600 group-hover:text-purple-700">
                    {c.nameId}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. Promo Highlight Section */}
        {homepageConfig.promoHighlightSection.isActive && (
          <section id="promo-highlight-section" className="bg-[#FAF8F5] border-b border-zinc-200 py-10 my-6">
            <div className="max-w-[1320px] mx-auto px-4 space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-600 mb-1">
                    <span>{homepageConfig.promoHighlightSection.badgeText}</span>
                  </div>
                  <h2 className="editorial-serif text-2xl sm:text-3xl text-zinc-900">
                    {homepageConfig.promoHighlightSection.title}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-500 uppercase tracking-wider text-[11px]">Berakhir Dalam:</span>
                    {homepageConfig.promoHighlightSection.countdownText ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 text-rose-400 font-mono font-bold text-xs tracking-wider border border-zinc-700 shadow-xs">
                        <Clock className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                        <span>{homepageConfig.promoHighlightSection.countdownText}</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 font-mono font-bold text-white text-xs">
                        <span className="bg-zinc-900 px-2.5 py-1">
                          {homepageConfig.promoHighlightSection.countdownHours}
                        </span>:
                        <span className="bg-zinc-900 px-2.5 py-1">
                          {homepageConfig.promoHighlightSection.countdownMins}
                        </span>:
                        <span className="bg-rose-600 px-2.5 py-1">
                          {homepageConfig.promoHighlightSection.countdownSecs}
                        </span>
                      </div>
                    )}
                  </div>
                  <Link
                    href="/promos"
                    className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-full transition"
                  >
                    <span>🎟️ Kode Promo &amp; S&amp;K</span>
                  </Link>
                  <Link
                    href="/products?filter=promo"
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Lihat Semua ({promoHighlightProducts.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {promoHighlightProducts.map((p) => {
                const catCfg = CATEGORIES_DATA.find((c) => c.id === p.category) || CATEGORIES_DATA[0];
                return (
                  <article
                    key={p.id}
                    onClick={() => openPdpModal(p)}
                    className="group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[3/4] bg-[#F6F4F0] border border-zinc-200/80 overflow-hidden mb-3 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            p.imageUrl ||
                            `https://images.unsplash.com/photo-${1584917865442 + p.id * 1000}?auto=format&fit=crop&w=600&q=80`
                          }
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              `https://images.unsplash.com/photo-${1584917865442 + p.id * 1000}?auto=format&fit=crop&w=600&q=80`;
                          }}
                        />
                        {p.promoBadge && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest shadow">
                            {p.promoBadge}
                          </span>
                        )}
                        <span className="absolute top-3 right-3 w-7 h-7 bg-white/90 text-zinc-700 flex items-center justify-center text-xs">
                          <Heart className="w-3.5 h-3.5" />
                        </span>
                        {p.hasVideo && (
                          <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-zinc-900/90 text-white text-[9px] font-semibold uppercase tracking-widest flex items-center gap-1">
                            <span className="text-[#E879F9]">▶</span> VIDEO
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">{p.category}</span>
                          <div className="flex items-center gap-1">
                            {catCfg.colors.map((col) => (
                              <span key={col.name} className="w-2.5 h-2.5 rounded-full border border-zinc-300" style={{ background: col.hex }} />
                            ))}
                          </div>
                        </div>
                        <h3 className="text-xs sm:text-sm font-medium text-zinc-900 group-hover:underline line-clamp-1">{p.name}</h3>
                        <div className="flex items-baseline gap-2 pt-0.5">
                          <span className="text-xs sm:text-sm font-bold text-zinc-900">Rp {p.priceIdr.toLocaleString("id-ID")}</span>
                          {p.discountPct > 0 && (
                            <span className="text-[11px] text-zinc-400 line-through">Rp {p.origPriceIdr.toLocaleString("id-ID")}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        )}

        {/* 6. Section Produk Terbaru (New Arrivals) */}
        {homepageConfig.newArrivalsSection.isActive && (
          <section id="produk-terbaru" className="max-w-[1320px] mx-auto px-4 py-8 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-purple-700 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>NEW SEASON RELEASES</span>
                </div>
                <h2 className="editorial-serif text-2xl text-zinc-900">
                  {homepageConfig.newArrivalsSection.title}
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  {homepageConfig.newArrivalsSection.subtitle}
                </p>
              </div>

              <Link
                href="/products?filter=new"
                className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Semua Produk Terbaru ({newArrivalsProducts.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
              {newArrivalsProducts.slice(0, homepageConfig.newArrivalsSection.maxDisplay).map((p) => {
                const catCfg = categories.find((c) => c.id === p.category) || categories[0];
                return (
                  <article
                    key={p.id}
                    onClick={() => openPdpModal(p)}
                    className="group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-3/4 bg-[#F6F4F0] border border-zinc-200/80 overflow-hidden mb-3 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.imageUrl || `https://images.unsplash.com/photo-${1584917865442 + p.id * 1000}?auto=format&fit=crop&w=600&q=80`}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-widest">
                          {p.promoBadge || "NEW"}
                        </span>
                        {p.hasVideo && (
                          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-rose-600 text-white text-[9px] font-semibold uppercase tracking-widest flex items-center gap-1 shadow">
                            <Play className="w-2.5 h-2.5 fill-current" /> VIDEO 9:16
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block truncate">
                          {p.category}
                        </span>
                        <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-purple-700 transition-colors line-clamp-1">
                          {p.name}
                        </h3>
                        <div className="flex items-baseline gap-2 pt-0.5">
                          <span className="text-sm font-extrabold text-zinc-900">
                            Rp {p.priceIdr.toLocaleString("id-ID")}
                          </span>
                          {p.discountPct > 0 && (
                            <span className="text-[10px] text-zinc-400 line-through">
                              Rp {p.origPriceIdr.toLocaleString("id-ID")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* 7. Section Produk Terlaris (Best Sellers) */}
        {homepageConfig.bestSellersSection.isActive && (
          <section id="produk-terlaris" className="bg-[#FAF8F5] border-t border-b border-zinc-200 py-10 my-4">
            <div className="max-w-[1320px] mx-auto px-4 space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 mb-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>CUSTOMER FAVORITES</span>
                  </div>
                  <h2 className="editorial-serif text-2xl text-zinc-900">
                    {homepageConfig.bestSellersSection.title}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    {homepageConfig.bestSellersSection.subtitle}
                  </p>
                </div>

                <Link
                  href="/products?filter=bestseller"
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>Lihat Semua Produk Terlaris ({bestSellerProducts.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
                {bestSellerProducts.slice(0, homepageConfig.bestSellersSection.maxDisplay).map((p) => {
                  return (
                    <article
                      key={p.id}
                      onClick={() => openPdpModal(p)}
                      className="group cursor-pointer flex flex-col justify-between bg-white p-3 border border-zinc-200 rounded shadow-2xs hover:shadow-md transition"
                    >
                      <div>
                        <div className="relative aspect-3/4 bg-zinc-100 overflow-hidden mb-3 rounded">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.imageUrl || `https://images.unsplash.com/photo-${1584917865442 + p.id * 1000}?auto=format&fit=crop&w=600&q=80`}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-xs">
                            ★ BEST SELLER
                          </span>
                          {p.hasVideo && (
                            <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-zinc-900/90 text-white text-[9px] font-semibold uppercase tracking-widest flex items-center gap-1 rounded-xs">
                              <Play className="w-2.5 h-2.5 fill-current" /> 9:16
                            </span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block truncate">
                            {p.category}
                          </span>
                          <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-purple-700 transition-colors line-clamp-1">
                            {p.name}
                          </h3>
                          <div className="flex items-baseline gap-2 pt-0.5">
                            <span className="text-sm font-extrabold text-zinc-900">
                              Rp {p.priceIdr.toLocaleString("id-ID")}
                            </span>
                            <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">
                              ★ {p.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 8. Section Value Proposition / USP */}
        {homepageConfig.uspSection.isActive && (
          <section className="max-w-[1320px] mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-purple-700 block mb-1">
                STANDAR LAYANAN RAHAYU
              </span>
              <h2 className="editorial-serif text-2xl text-zinc-900">
                {homepageConfig.uspSection.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {homepageConfig.uspSection.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-50 border border-zinc-200 p-5 rounded-lg text-center space-y-2 hover:border-purple-300 transition"
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    {idx === 0 && <ShieldCheck className="w-5 h-5" />}
                    {idx === 1 && <Truck className="w-5 h-5" />}
                    {idx === 2 && <RefreshCw className="w-5 h-5" />}
                    {idx === 3 && <Clock className="w-5 h-5" />}
                  </div>
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 9. Footer Component */}
      <Footer
        onCategoryClick={(catId) => router.push(`/products?category=${encodeURIComponent(catId)}`)}
        onProfileClick={() => router.push("/profile")}
      />

      {/* =================================================================== */}
      {/* PRODUCT DETAIL MODAL (PDP WITH 9:16 SHORT PRODUCT VIDEO)            */}
      {/* =================================================================== */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-3xl w-full overflow-hidden shadow-2xl border border-zinc-200 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-500">
                  {activeModalProduct.category}
                </span>
                {activeModalProduct.promoBadge && (
                  <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    {activeModalProduct.promoBadge}
                  </span>
                )}
              </div>
              <button onClick={() => setActiveModalProduct(null)} className="w-8 h-8 hover:bg-zinc-100 flex items-center justify-center text-zinc-800 font-bold cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Media Column */}
              <div className="md:col-span-6 space-y-3">
                <div className="flex border border-zinc-200 text-xs font-semibold uppercase tracking-wider">
                  <button
                    onClick={() => setPdpMediaType("photo")}
                    className={`flex-1 py-2 cursor-pointer ${pdpMediaType === "photo" ? "bg-zinc-900 text-white" : "bg-white text-zinc-700"}`}
                  >
                    Foto Lookbook (3:4)
                  </button>
                  <button
                    onClick={() => setPdpMediaType("video")}
                    className={`flex-1 py-2 flex items-center justify-center gap-1 cursor-pointer ${
                      pdpMediaType === "video" ? "bg-rose-600 text-white" : "bg-white text-rose-600"
                    }`}
                  >
                    <Play className="w-3 h-3" /> Video Singkat (0:15)
                  </button>
                </div>

                {pdpMediaType === "photo" ? (
                  <div className="bg-[#F6F4F0] border border-zinc-200 aspect-[3/4] flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        activeModalProduct.imageUrl ||
                        `https://images.unsplash.com/photo-${1584917865442 + activeModalProduct.id * 1000}?auto=format&fit=crop&w=800&q=80`
                      }
                      alt={activeModalProduct.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          `https://images.unsplash.com/photo-${1584917865442 + activeModalProduct.id * 1000}?auto=format&fit=crop&w=800&q=80`;
                      }}
                    />
                  </div>
                ) : (
                  <div className="bg-zinc-900 text-white aspect-[3/4] relative overflow-hidden flex flex-col justify-between p-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-2 py-0.5 bg-rose-600 font-bold uppercase tracking-wider">▶ VIDEO SINGKAT PRODUK</span>
                      <span className="text-zinc-300 font-mono">00:09 / 00:15</span>
                    </div>
                    <div className="my-auto text-center space-y-2">
                      <div className="text-3xl">👗</div>
                      <div className="text-xs font-semibold">Preview Jatuhnya Bahan & Detail Jahitan</div>
                      <p className="text-[11px] text-zinc-400">Streaming Cloudflare R2 (Rp 0 Bandwidth)</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full bg-zinc-700 h-1">
                        <div className="bg-[#E879F9] h-full w-2/3"></div>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span>🔊 Audio Asli</span>
                        <a href={activeModalProduct.videoUrl} target="_blank" rel="noopener noreferrer" className="text-[#E879F9] underline font-semibold">
                          Buka Tautan di TikTok ↗
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info Column */}
              <div className="md:col-span-6 space-y-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">RAHAYU OFFICIAL</div>
                  <h2 className="editorial-serif text-2xl text-zinc-900 mt-0.5">{activeModalProduct.name}</h2>
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5">SKU: {activeModalProduct.sku}</p>
                </div>

                <div className="py-3 border-y border-zinc-200 flex items-baseline gap-3">
                  <span className="text-xl font-bold text-rose-600">
                    Rp {activeModalProduct.priceIdr.toLocaleString("id-ID")}
                  </span>
                  {activeModalProduct.discountPct > 0 && (
                    <span className="text-xs text-zinc-400 line-through">
                      Rp {activeModalProduct.origPriceIdr.toLocaleString("id-ID")}
                    </span>
                  )}
                  {activeModalProduct.discountPct > 0 && (
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5">
                      Hemat {activeModalProduct.discountPct}%
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed">{activeModalProduct.desc}</p>

                {/* Sizes Selector */}
                {(() => {
                  const catCfg = CATEGORIES_DATA.find((c) => c.id === activeModalProduct.category) || CATEGORIES_DATA[0];
                  return (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-800">
                          Pilih Ukuran ({catCfg.measurementLabel}):
                        </span>
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
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {catCfg.sizes.map((s) => (
                          <button
                            key={s}
                            onClick={() => setSelectedSize(s)}
                            className={`px-3.5 py-2 border text-xs font-mono transition cursor-pointer ${
                              selectedSize === s
                                ? "border-zinc-900 bg-zinc-900 text-white font-bold"
                                : "border-zinc-300 text-zinc-800 hover:border-zinc-900"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Colors Selector */}
                {(() => {
                  const catCfg = CATEGORIES_DATA.find((c) => c.id === activeModalProduct.category) || CATEGORIES_DATA[0];
                  return (
                    <div className="space-y-1.5 text-xs">
                      <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-800 block">
                        Pilihan Warna / Varian:
                      </span>
                      <div className="flex items-center gap-2">
                        {catCfg.colors.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => setSelectedColor(c.name)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 border text-xs cursor-pointer ${
                              selectedColor === c.name ? "border-zinc-900 font-semibold bg-zinc-50" : "border-zinc-200"
                            }`}
                          >
                            <span className="w-3 h-3 rounded-full border border-zinc-300" style={{ background: c.hex }}></span>
                            <span>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Quantity Selector */}
                <div className="pt-2 border-t border-zinc-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-800">
                      Jumlah Pembelian:
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Sisa Stok: <strong className="text-zinc-900 font-mono">{activeModalProduct.stock ?? 35} pcs</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center border border-zinc-300 rounded bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setPdpQuantity((prev) => Math.max(1, prev - 1))}
                        disabled={pdpQuantity <= 1}
                        className="w-9 h-9 flex items-center justify-center hover:bg-zinc-100 text-zinc-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Kurangi jumlah"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={activeModalProduct.stock ?? 99}
                        value={pdpQuantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) {
                            setPdpQuantity(Math.max(1, Math.min(activeModalProduct.stock ?? 99, val)));
                          }
                        }}
                        className="w-12 h-9 text-center text-xs font-mono font-bold text-zinc-900 border-x border-zinc-200 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setPdpQuantity((prev) =>
                            Math.min(activeModalProduct.stock ?? 99, prev + 1)
                          )
                        }
                        disabled={pdpQuantity >= (activeModalProduct.stock ?? 99)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-zinc-100 text-zinc-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Tambah jumlah"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 block uppercase font-bold">Subtotal Produk</span>
                      <span className="text-sm font-extrabold text-purple-800">
                        Rp {(activeModalProduct.priceIdr * Math.max(1, pdpQuantity)).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(activeModalProduct)}
                    className="flex-1 py-3 bg-zinc-900 hover:bg-[#7C3AED] text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Masukkan Tas Belanja ({pdpQuantity} Barang)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TIKTOK LIVE PREVIEW MODAL                                           */}
      {/* =================================================================== */}
      {isLiveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 text-white max-w-lg w-full overflow-hidden border border-zinc-700 shadow-2xl">
            <div className="p-4 bg-gradient-to-r from-rose-600 to-[#7C3AED] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
                <span className="text-xs font-bold tracking-wider uppercase">
                  TIKTOK LIVE PREVIEW · @{tiktokConfig.username}
                </span>
              </div>
              <button onClick={() => setIsLiveModalOpen(false)} className="w-7 h-7 bg-black/30 text-white text-xs font-bold cursor-pointer">
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 bg-zinc-800/80 border border-zinc-700 space-y-1">
                <div className="text-[11px] font-bold text-white">{tiktokConfig.title}</div>
                <div className="text-[11px] text-zinc-400">
                  Status:{" "}
                  {tiktokConfig.isLive ? (
                    <span className="text-emerald-400 font-bold">
                      ● LIVE ({tiktokConfig.viewers.toLocaleString("id-ID")} penonton ·{" "}
                      {tiktokConfig.likes.toLocaleString("id-ID")} likes)
                    </span>
                  ) : (
                    <span className="text-zinc-300">Jadwal: {tiktokConfig.schedule}</span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-zinc-800 border border-zinc-700 flex items-center justify-between gap-3">
                <div>
                  <div className="text-amber-400 font-bold">
                    🎁 Voucher Penonton Live: {tiktokConfig.voucherCode}
                  </div>
                  <div className="text-zinc-300 mt-0.5">
                    Klaim kode voucher saat checkout untuk potongan ekstra!
                  </div>
                </div>
                <a
                  href={tiktokConfig.isLive ? tiktokConfig.liveUrl : tiktokConfig.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase tracking-wider text-[10px] shrink-0 transition"
                >
                  Buka TikTok ↗
                </a>
              </div>
              <div className="space-y-2">
                {[
                  pinnedLiveProduct,
                  ...products.filter((p) => p.id !== pinnedLiveProduct?.id),
                ]
                  .slice(0, 4)
                  .map((p, idx) => (
                    <div
                      key={p.id}
                      className={`p-3 bg-zinc-800 border flex items-center justify-between gap-2 ${
                        idx === 0 ? "border-amber-400/70 ring-1 ring-amber-400/30" : "border-zinc-700"
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold text-rose-400">
                          Etalase #0{idx + 1} · {p.category}{" "}
                          {idx === 0 && (
                            <span className="ml-1 px-1.5 py-0.5 bg-amber-400/20 text-amber-300 rounded text-[9px]">
                              📌 SEDANG DI-SPILL
                            </span>
                          )}
                        </span>
                        <div className="font-bold text-white text-xs">{p.name}</div>
                        <div className="text-amber-300 font-bold text-xs mt-0.5">
                          Rp {p.priceIdr.toLocaleString("id-ID")}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsLiveModalOpen(false);
                          openPdpModal(p);
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-purple-200 text-zinc-900 text-[10px] font-bold uppercase tracking-wider shrink-0 cursor-pointer transition"
                      >
                        Pilih Ukuran
                      </button>
                    </div>
                  ))}
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
          onSelectSize={(sz) => setSelectedSize(sz)}
        />
      )}

      {/* AI Virtual Stylist Floating Chatbot */}
      <AiVirtualStylistChat />
    </div>
  );
}
