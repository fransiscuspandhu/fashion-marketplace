"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

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
  const { user, isLoggedIn, logout, cartCount, openCartDrawer, isLiveActive, liveViewers, categories, orders } = useStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  // Count active orders
  const activeOrdersCount = orders.filter(
    (o) => o.status === "MENUNGGU_PEMBAYARAN" || o.status === "DIKEMAS" || o.status === "DIKIRIM"
  ).length;

  const handleCategoryClick = (catId: string) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      router.push(`/?category=${encodeURIComponent(catId)}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname !== "/") {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
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

            {/* Quick Link to Control Panel Admin */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Control Panel</span> Admin
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header (Hijup.com Editorial Look) */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-[1320px] mx-auto px-4">
          <div className="py-4 grid grid-cols-12 items-center gap-4">
            {/* Left: Minimal Search Bar */}
            <div className="col-span-4 hidden md:flex items-center">
              <form onSubmit={handleSearchSubmit} className="relative w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                  placeholder="Cari tunik, hijab voal, baju hamil..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-transparent border-b border-zinc-300 focus:border-zinc-900 focus:outline-none transition placeholder:text-zinc-400"
                />
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-1 top-2" />
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

          {/* Lower Category Navigation Bar (Hijup Uppercase Style) */}
          <nav
            aria-label="Navigasi Utama Kategori"
            className="border-t border-zinc-100 flex items-center justify-start md:justify-center gap-6 lg:gap-8 py-3 overflow-x-auto no-scrollbar text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-700"
          >
            <button
              onClick={() => handleCategoryClick("all")}
              className={`hover:text-zinc-950 pb-1 whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === "all" ? "border-b-2 border-zinc-900 text-zinc-950 font-bold" : ""
              }`}
            >
              Semua Koleksi
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`hover:text-zinc-950 pb-1 whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === cat.id ? "border-b-2 border-zinc-900 text-zinc-950 font-bold" : ""
                }`}
              >
                {cat.nameId}
              </button>
            ))}

            <button
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              className="inline-flex items-center gap-1 text-[#7C3AED] hover:text-[#6D28D9] pb-1 whitespace-nowrap font-bold cursor-pointer"
            >
              <span>Semua Kategori</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </nav>

          {/* Mega Menu Dropdown */}
          {isMegaMenuOpen && (
            <div
              className="border-t border-zinc-200 py-6 bg-zinc-50 animate-in fade-in"
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-3 border-b border-purple-200 pb-1">
                    Pilar 1: Modest & Muslimah Wear
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-700">
                    <li>
                      <button
                        onClick={() => {
                          handleCategoryClick("Hijab");
                          setIsMegaMenuOpen(false);
                        }}
                        className="hover:text-purple-700 cursor-pointer"
                      >
                        Hijab (Voal Ultrafine, Pashmina, Syari)
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleCategoryClick("Atasan Muslim Wanita");
                          setIsMegaMenuOpen(false);
                        }}
                        className="hover:text-purple-700 cursor-pointer"
                      >
                        Atasan Muslim Wanita (Tunik Silk, Blouse)
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleCategoryClick("Bawahan Muslim Wanita");
                          setIsMegaMenuOpen(false);
                        }}
                        className="hover:text-purple-700 cursor-pointer"
                      >
                        Bawahan Muslim Wanita (Rok Plisket, Kulot)
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleCategoryClick("Aksesoris Muslim");
                          setIsMegaMenuOpen(false);
                        }}
                        className="hover:text-purple-700 cursor-pointer"
                      >
                        Aksesoris Muslim (Bros Rose Gold, Ciput Rajut)
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-3 border-b border-rose-200 pb-1">
                    Pilar 2: Baju Hamil & Busana Wanita
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-700">
                    <li>
                      <button
                        onClick={() => {
                          handleCategoryClick("Baju Hamil");
                          setIsMegaMenuOpen(false);
                        }}
                        className="hover:text-rose-700 cursor-pointer"
                      >
                        Baju Hamil (Maternity Dress, Busui Friendly)
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleCategoryClick("Celana Panjang & Legging");
                          setIsMegaMenuOpen(false);
                        }}
                        className="hover:text-rose-700 cursor-pointer"
                      >
                        Celana Panjang & Legging (Maternity & Seamless)
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleCategoryClick("Atasan");
                          setIsMegaMenuOpen(false);
                        }}
                        className="hover:text-rose-700 cursor-pointer"
                      >
                        Atasan (Casual Blouse, Knit Top)
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleCategoryClick("Pakaian Dalam");
                          setIsMegaMenuOpen(false);
                        }}
                        className="hover:text-rose-700 cursor-pointer"
                      >
                        Pakaian Dalam (Bra Menyusui, Seamless Panty)
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleCategoryClick("Pakaian Wanita Lainnya");
                          setIsMegaMenuOpen(false);
                        }}
                        className="hover:text-rose-700 cursor-pointer"
                      >
                        Pakaian Wanita Lainnya (Outerwear, Kimono)
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-3 border-b border-amber-200 pb-1">
                    Pilar 3: Koleksi Bayi & Anak
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-700">
                    <li>
                      <button
                        onClick={() => {
                          handleCategoryClick("Pakaian Bayi");
                          setIsMegaMenuOpen(false);
                        }}
                        className="hover:text-amber-700 cursor-pointer"
                      >
                        Pakaian Bayi (Jumper Organic Cotton, Sleepsuit)
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleCategoryClick("Pakaian Anak Perempuan");
                          setIsMegaMenuOpen(false);
                        }}
                        className="hover:text-amber-700 cursor-pointer"
                      >
                        Pakaian Anak Perempuan (Gamis Anak, Dress Katun)
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
