"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, ShoppingBag, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";

/**
 * Luxury Editorial Skeleton Grid for Product Cards & Categories
 * Used during category filtering, search transitions, and route loading
 */
export function ProductGridSkeleton({
  count = 4,
  label = "Menyaring Koleksi Terbaik Rahayu...",
}: {
  count?: number;
  label?: string;
}) {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Fancy Filter Loading Pill */}
      <div className="flex items-center justify-center py-2">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-purple-950 via-purple-900 to-zinc-900 text-white shadow-lg shadow-purple-900/20 border border-purple-500/30">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span className="text-xs font-semibold tracking-wide">{label}</span>
        </div>
      </div>

      {/* Shimmer Product Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-xs p-3 space-y-3"
          >
            <div className="relative aspect-[3/4] w-full rounded-xl bg-gradient-to-br from-purple-100/70 via-zinc-100 to-amber-50/60 animate-pulse overflow-hidden">
              <div className="absolute top-3 left-3 h-5 w-20 rounded-full bg-white/80" />
              <div className="absolute bottom-3 right-3 h-7 w-7 rounded-full bg-white/80" />
            </div>
            <div className="space-y-2 pt-1">
              <div className="h-3 w-24 rounded-full bg-purple-100/80 animate-pulse" />
              <div className="h-4 w-full rounded-full bg-zinc-200/80 animate-pulse" />
              <div className="h-4 w-2/3 rounded-full bg-zinc-200/60 animate-pulse" />
              <div className="pt-2 flex items-center justify-between">
                <div className="h-5 w-28 rounded-full bg-purple-200/70 animate-pulse" />
                <div className="h-7 w-7 rounded-lg bg-zinc-100 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FrontstoreFancyLoader() {
  const pathname = usePathname();
  const {
    isStoreLoading,
    isSyncingData,
    syncMessage,
    storeToast,
    dismissStoreToast,
  } = useStore();

  const isAdminRoute = pathname?.startsWith("/admin");

  const [isRouteTransitioning, setIsRouteTransitioning] = useState(false);
  const [routeLabel, setRouteLabel] = useState("Memuat Halaman Butik...");
  const [progress, setProgress] = useState(25);

  // Detect route navigation on Frontstore and show a sleek fancy transition bar + badge
  useEffect(() => {
    if (isAdminRoute) return;

    const labelMap: Record<string, string> = {
      "/": "Memuat Beranda Koleksi Rahayu...",
      "/products": "Menyiapkan Katalog 11 Kategori Resmi...",
      "/profile": "Memuat Profil & Pelacakan Resi Pesanan...",
      "/checkout": "Menyiapkan Halaman Checkout Aman...",
      "/login": "Memuat Portal Pelanggan Rahayu...",
    };

    setRouteLabel(labelMap[pathname || "/"] || "Memuat Koleksi Rahayu...");
    setIsRouteTransitioning(true);
    setProgress(35);

    const t1 = setTimeout(() => setProgress(82), 160);
    const t2 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setIsRouteTransitioning(false), 180);
    }, 480);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, isAdminRoute]);

  const showTopBar = !isAdminRoute && (isStoreLoading || isRouteTransitioning || isSyncingData);

  return (
    <>
      {/* 1. TOP LUXURY SHIMMER PROGRESS BAR + FLOATING PILL (Always visible during any frontstore load) */}
      {showTopBar && (
        <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
          {/* Glowing Gradient Bar */}
          <div className="h-1 w-full bg-purple-950/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-700 via-amber-400 to-fuchsia-600 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(168,85,247,0.8)]"
              style={{ width: `${isStoreLoading ? 68 : progress}%` }}
            />
          </div>

          {/* Floating Glassmorphic Status Pill */}
          <div className="flex justify-center mt-3 px-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-950/90 backdrop-blur-md text-white border border-purple-500/40 shadow-xl shadow-purple-950/25">
              <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-tr from-purple-600 to-amber-400">
                <Sparkles className="w-3 h-3 text-white animate-spin" />
              </div>
              <span className="text-xs font-semibold tracking-wide">
                {isSyncingData && syncMessage ? syncMessage : routeLabel}
              </span>
              <span className="flex gap-1 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. INITIAL BOUTIQUE SPLASH OVERLAY (When Frontstore first hydrates from PostgreSQL) */}
      {!isAdminRoute && isStoreLoading && (
        <div className="fixed inset-0 z-[95] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="max-w-sm w-full text-center space-y-6">
            {/* Animated Luxury Emblem */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-300 animate-spin [animation-duration:6s]" />
              {/* Middle pulsing ring */}
              <div className="absolute inset-2 rounded-full border-2 border-t-purple-700 border-r-amber-400 border-b-purple-200 border-l-transparent animate-spin" />
              {/* Inner Royal Crest */}
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-900 via-purple-800 to-zinc-900 flex items-center justify-center text-white shadow-xl shadow-purple-900/30 border border-amber-400/40">
                <ShoppingBag className="w-6 h-6 text-amber-300" />
              </div>
            </div>

            {/* Boutique Brand Typography */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-[10px] font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Official Modest Boutique</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                RAHAYU FASHION
              </h2>
              <p className="text-xs text-zinc-500">
                {syncMessage || "Menyiapkan koleksi busana muslimah & hijab terbaik..."}
              </p>
            </div>

            {/* Shimmer Progress Bar */}
            <div className="w-56 mx-auto space-y-2">
              <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden p-0.5 border border-zinc-200/60">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-purple-700 via-amber-400 to-purple-700 animate-pulse" />
              </div>
              <div className="flex justify-between text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <span>11 Kategori Resmi</span>
                <span className="text-purple-700">Live Sync</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. LUXURY FRONTSTORE FLOATING POPUP TOAST (Replaces native alert() on Frontstore) */}
      {storeToast && !isAdminRoute && (
        <div className="fixed bottom-6 right-6 z-[110] max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-zinc-950/95 backdrop-blur-md text-white rounded-2xl border border-purple-500/40 p-4 shadow-2xl flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                storeToast.type === "warning"
                  ? "bg-amber-500/20 border-amber-400/40 text-amber-300"
                  : storeToast.type === "info"
                  ? "bg-blue-500/20 border-blue-400/40 text-blue-300"
                  : "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
              }`}
            >
              {storeToast.type === "warning" ? (
                <AlertTriangle className="w-5 h-5" />
              ) : storeToast.type === "info" ? (
                <Info className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Rahayu Store
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mt-0.5">{storeToast.title}</h4>
              <p className="text-[11px] text-zinc-300 leading-relaxed mt-0.5">
                {storeToast.message}
              </p>
            </div>
            <button
              onClick={dismissStoreToast}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
