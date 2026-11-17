import React from "react";
import { ShoppingBag, Sparkles } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Shimmer Bar */}
      <div className="h-1 w-full bg-purple-950/20 overflow-hidden">
        <div className="h-full w-2/3 bg-gradient-to-r from-purple-700 via-amber-400 to-fuchsia-600 animate-pulse" />
      </div>

      {/* Header Skeleton */}
      <header className="border-b border-zinc-100 px-4 sm:px-8 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-900 to-zinc-900 flex items-center justify-center text-amber-300 shadow-sm">
            <ShoppingBag className="w-4 h-4 animate-bounce" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3.5 w-32 rounded-full bg-zinc-200 animate-pulse" />
            <div className="h-2.5 w-20 rounded-full bg-purple-100 animate-pulse" />
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="h-8 w-64 rounded-full bg-zinc-100 animate-pulse" />
          <div className="h-8 w-24 rounded-full bg-purple-100 animate-pulse" />
        </div>
      </header>

      {/* Center Boutique Loader + Editorial Skeletons */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        {/* Fancy Boutique Status Banner */}
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-300 animate-spin [animation-duration:5s]" />
            <div className="absolute inset-1.5 rounded-full border-2 border-t-purple-700 border-r-amber-400 border-b-transparent border-l-transparent animate-spin" />
            <div className="w-10 h-10 rounded-xl bg-purple-900 flex items-center justify-center text-amber-300 shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700 bg-purple-50 px-3 py-0.5 rounded-full border border-purple-200">
              Rahayu Modest Boutique
            </span>
            <h3 className="text-sm font-bold text-zinc-900 pt-1">
              Menyiapkan Koleksi Busana Terbaik...
            </h3>
          </div>
        </div>

        {/* Hero Skeleton */}
        <div className="h-56 sm:h-72 w-full rounded-3xl bg-gradient-to-r from-purple-100/70 via-zinc-100 to-amber-50/70 animate-pulse p-8 flex flex-col justify-end space-y-3">
          <div className="h-4 w-36 rounded-full bg-white/80" />
          <div className="h-7 w-72 sm:w-96 rounded-full bg-white/90" />
          <div className="h-4 w-60 rounded-full bg-white/70" />
        </div>

        {/* 11 Circular Categories Skeleton */}
        <div className="flex items-center gap-5 overflow-hidden py-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-100 to-zinc-100 animate-pulse border-2 border-white shadow-xs" />
              <div className="h-2.5 w-14 rounded-full bg-zinc-200 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-100 p-3 space-y-3 shadow-2xs"
            >
              <div className="aspect-[3/4] w-full rounded-xl bg-zinc-100 animate-pulse" />
              <div className="h-3 w-20 rounded-full bg-purple-100 animate-pulse" />
              <div className="h-4 w-full rounded-full bg-zinc-200 animate-pulse" />
              <div className="h-5 w-28 rounded-full bg-purple-200/70 animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
