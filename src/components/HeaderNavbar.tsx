"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  LogOut,
  PackageCheck,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Flame,
  Star,
  Grid,
} from "lucide-react";
import { useStore, ADMIN_ROLES_CONFIG } from "@/context/StoreContext";

interface HeaderNavbarProps {
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  onOpenLiveModal?: () => void;
}

export default function HeaderNavbar({
  selectedCategory = "all",
  onSelectCategory,
  searchQuery = "",
  onSearchChange,
  onOpenLiveModal,
}: HeaderNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    user,
    isLoggedIn,
    logout,
    adminUser,
    isAdminLoggedIn,
    cartCount,
    openCartDrawer,
    isLiveActive,
    liveViewers,
    categories,
    pillars,
    orders,
  } = useStore();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Count active orders
  const activeOrdersCount = orders.filter(
    (o) => o.status === "MENUNGGU_PEMBAYARAN" || o.status === "DIKEMAS" || o.status === "DIKIRIM"
  ).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSearch.trim()) {
      router.push("/products");
      return;
    }
    if (onSearchChange) {
      onSearchChange(localSearch);
    }
    router.push(`/products?search=${encodeURIComponent(localSearch.trim())}`);
  };

  const handleCategoryNav = (catId: string) => {
    setIsMegaMenuOpen(false);
    if (onSelectCategory && pathname === "/products") {
      onSelectCategory(catId);
    } else {
      router.push(`/products?category=${encodeURIComponent(catId)}`);
    }
  };

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#18181B] text-white text-[11px] tracking-wide py-2 px-4 border-b border-zinc-800">
        <div className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#E879F9]">PROMO GAJIAN: RAHAYUPAYDAY</span>
            <span className="text-zinc-300 hidden sm:inline">
              EXTRA DISKON HINGGA 35% + GRATIS ONGKIR SE-INDONESIA
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            {/* TikTok Live Stream Toggle / Alert */}
            {isLiveActive ? (
              <button
                onClick={onOpenLiveModal}
                className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-bold tracking-wider uppercase cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span>LIVE DI TIKTOK SEKARANG ({liveViewers.toLocaleString("id-ID")})</span>
              </button>
            ) : (
              <span className="text-zinc-400">Jadwal Live: Setiap Hari 19:00 WIB</span>
            )}

            <span className="text-zinc-700">|</span>

            {/* Separate Admin Access Link */}
            {isAdminLoggedIn && adminUser ? (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                <span>Portal Admin</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40 hidden sm:inline">
                  {ADMIN_ROLES_CONFIG[adminUser.role]?.label.split(" ")[0] || "Staff"}
                </span>
              </Link>
            ) : (
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-amber-300 font-medium transition-colors"
                title="Akses Portal Khusus Karyawan & Gudang"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Portal</span> Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Header (Hijup.com Editorial Look) */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-[1320px] mx-auto px-4">
          <div className="py-4 grid grid-cols-12 items-center gap-4">
            {/* Left: Minimal Search Bar (Redirects to /products?search=...) */}
            <div className="col-span-4 hidden md:flex items-center">
              <form onSubmit={handleSearchSubmit} className="relative w-80">
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                    if (onSearchChange) onSearchChange(e.target.value);
                  }}
                  placeholder="Cari tunik, hijab voal, baju hamil..."
                  className="w-full pl-8 pr-8 py-1.5 text-xs bg-transparent border-b border-zinc-300 focus:border-zinc-900 focus:outline-none transition placeholder:text-zinc-400"
                />
                <button
                  type="submit"
                  className="w-3.5 h-3.5 text-zinc-500 absolute left-1 top-2 cursor-pointer hover:text-purple-700"
                  title="Cari Produk"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
                {localSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocalSearch("");
                      if (onSearchChange) onSearchChange("");
                    }}
                    className="absolute right-1 top-2 text-[10px] text-zinc-400 hover:text-zinc-700"
                  >
                    ✕
                  </button>
                )}
              </form>
            </div>

            {/* Center: Official Rahayu Brand Lockup */}
            <div className="col-span-6 md:col-span-4 flex md:justify-center items-center">
              <Link href="/" className="flex items-center gap-3 group text-left cursor-pointer">
                <div className="w-10 h-11 flex items-center justify-center">
                  <svg viewBox="0 0 120 135" className="w-full h-full">
                    <path
                      d="M24 95 V46 C24 23 43 10 64 10 C86 10 102 24 102 45 C102 65 86 79 64 79 H44 V95 Z"
                      fill="#E879F9"
                    />
                    <circle cx="63" cy="45" r="20" fill="#FFFFFF" />
                    <polygon points="56,64 73,54 81,62 53,75" fill="#A855F7" />
                    <polygon points="58,61 75,52 103,100 78,100" fill="#D8B4FE" />
                    <text
                      x="60"
                      y="126"
                      textAnchor="middle"
                      fill="#7C3AED"
                      fontFamily="sans-serif"
                      fontWeight="700"
                      fontSize="22"
                      letterSpacing="4"
                    >
                      rahayu
                    </text>
                  </svg>
                </div>
                <div>
                  <span className="block text-xl font-bold tracking-[0.22em] text-zinc-900">
                    RAHAYU
                  </span>
                  <span className="block text-[9px] uppercase tracking-[0.26em] text-zinc-400">
                    Fashion Store
                  </span>
                </div>
              </Link>
            </div>

            {/* Right: Utility Buttons (Bag & User Tokopedia Flow) */}
            <div className="col-span-6 md:col-span-4 flex items-center justify-end gap-3 sm:gap-4 text-xs">
              {/* Shopping Bag trigger */}
              <button
                onClick={openCartDrawer}
                className="flex items-center gap-1.5 text-zinc-900 hover:text-[#7C3AED] font-semibold cursor-pointer relative py-1"
                aria-label="Buka Tas Belanja"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wider hidden sm:inline">Tas</span>
                {cartCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <span className="text-zinc-200 hidden sm:inline">|</span>

              {/* User Auth Profile Dropdown */}
              {isLoggedIn && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 hover:border-purple-400 bg-zinc-50 hover:bg-white text-zinc-900 font-medium text-xs transition-colors cursor-pointer"
                  >
                    <div className="w-5 h-5 rounded-full bg-purple-700 text-white flex items-center justify-center text-[10px] font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                    {activeOrdersCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white border border-zinc-200 rounded-lg shadow-xl py-2 z-50 text-xs animate-in fade-in"
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/60">
                        <p className="font-bold text-zinc-900">{user.name}</p>
                        <p className="text-zinc-500 text-[11px] truncate">{user.email}</p>
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-semibold">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{user.tier}</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profile?tab=orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-2 hover:bg-purple-50 text-zinc-700 hover:text-purple-700 font-medium"
                        >
                          <span className="flex items-center gap-2">
                            <PackageCheck className="w-4 h-4 text-purple-600" />
                            Daftar Transaksi Pesanan
                          </span>
                          {activeOrdersCount > 0 && (
                            <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.2 rounded font-bold">
                              {activeOrdersCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/profile?tab=address"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-purple-50 text-zinc-700 hover:text-purple-700"
                        >
                          <MapPin className="w-4 h-4 text-zinc-400" />
                          Daftar Alamat Pengiriman
                        </Link>
                        <Link
                          href="/profile?tab=settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-purple-50 text-zinc-700 hover:text-purple-700"
                        >
                          <UserIcon className="w-4 h-4 text-zinc-400" />
                          Pengaturan Akun
                        </Link>
                      </div>

                      <div className="border-t border-zinc-100 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 font-medium cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Keluar dari Akun
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-300 hover:border-[#7C3AED] bg-white text-zinc-900 font-semibold text-xs cursor-pointer hover:bg-purple-50 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-[10px] font-bold">
                    <UserIcon className="w-3 h-3" />
                  </span>
                  <span>Masuk / Daftar</span>
                </Link>
              )}
            </div>
          </div>

          {/* 3. Refined Lower Navigation Menu (Clean, Uncluttered, Non-Redundant) */}
          <nav
            aria-label="Navigasi Utama"
            className="border-t border-zinc-100 flex items-center justify-center gap-8 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-700"
          >
            <Link
              href="/"
              className={`hover:text-zinc-950 pb-1 whitespace-nowrap transition-colors ${
                pathname === "/" ? "border-b-2 border-zinc-900 text-zinc-950 font-bold" : ""
              }`}
            >
              Beranda
            </Link>

            {/* Dropdown Koleksi & Kategori (Mega Menu) */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className={`hover:text-purple-700 pb-1 whitespace-nowrap flex items-center gap-1 cursor-pointer transition-colors ${
                  pathname.startsWith("/products")
                    ? "text-purple-700 font-bold border-b-2 border-purple-700"
                    : ""
                }`}
              >
                <span>Koleksi & Kategori</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMegaMenuOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            <a
              href="/#produk-terbaru"
              className="hover:text-zinc-950 pb-1 whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span>Produk Terbaru</span>
            </a>

            <a
              href="/#produk-terlaris"
              className="hover:text-zinc-950 pb-1 whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Produk Terlaris</span>
            </a>

            <a
              href="/#promo-highlight-section"
              className="text-rose-600 hover:text-rose-700 font-bold pb-1 whitespace-nowrap flex items-center gap-1 transition-colors"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Promo Highlight</span>
            </a>
          </nav>

          {/* Mega Menu Dropdown */}
          {isMegaMenuOpen && (
            <div
              className="border-t border-zinc-200 py-6 bg-zinc-50 animate-in fade-in"
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <div className="max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
                {pillars.map((pillar) => {
                  const pillarCategories = categories.filter(
                    (c) =>
                      c.pillar === pillar.name ||
                      c.pillar === pillar.id ||
                      (pillar.id === "modest" && (c.pillar === "Modest Fashion Wanita" || (c.pillar as any) === 1)) ||
                      (pillar.id === "kehamilan" && (c.pillar === "Kehamilan, Busui & Nifas" || (c.pillar as any) === 2)) ||
                      (pillar.id === "anak" && (c.pillar === "Bayi & Anak" || (c.pillar as any) === 3))
                  );
                  return (
                    <div key={pillar.id}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3 border-b border-zinc-200 pb-1">
                        {pillar.name}
                      </h4>
                      <ul className="space-y-2 text-zinc-700">
                        {pillarCategories.map((c) => (
                          <li key={c.id}>
                            <button
                              onClick={() => handleCategoryNav(c.id)}
                              className="hover:text-purple-700 text-left w-full py-0.5 cursor-pointer flex items-center justify-between transition-colors"
                            >
                              <span className="font-medium">{c.nameId}</span>
                              <span className="text-[10px] text-zinc-400">
                                {c.sizes.length} ukuran
                              </span>
                            </button>
                          </li>
                        ))}
                        {pillarCategories.length === 0 && (
                          <li className="text-zinc-400 text-[11px] italic">
                            Belum ada kategori di kelompok ini
                          </li>
                        )}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <div className="max-w-[1320px] mx-auto mt-4 pt-3 border-t border-zinc-200/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-zinc-500">
                  Total {categories.length} kategori aktif
                </span>
                <Link
                  href="/products"
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Halaman Katalog Lengkap →</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
