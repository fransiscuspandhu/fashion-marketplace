"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Ticket,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Tag,
  Flame,
  Info,
  Gift,
  Truck,
  CheckCircle2,
} from "lucide-react";
import HeaderNavbar from "@/components/HeaderNavbar";
import Footer from "@/components/Footer";
import { useStore, VoucherPromo } from "@/context/StoreContext";

export default function PromosPage() {
  const { vouchers, cart, showStoreToast } = useStore();
  const [selectedTag, setSelectedTag] = useState<string>("ALL");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeVouchers = vouchers.filter((v) => v.isActive);

  const tags = [
    { id: "ALL", label: "Semua Promo", icon: Ticket },
    { id: "Diskon Belanja", label: "Diskon Belanja", icon: Tag },
    { id: "Gratis Ongkir", label: "Gratis Ongkir", icon: Truck },
    { id: "Live Special", label: "Live Promo", icon: Flame },
    { id: "Pelanggan Baru", label: "Pelanggan Baru", icon: Gift },
  ];

  const filteredVouchers =
    selectedTag === "ALL"
      ? activeVouchers
      : activeVouchers.filter((v) => v.categoryTag === selectedTag);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showStoreToast(
      "Kode Promo Berhasil Disalin! 📋",
      `Kode ${code} siap digunakan di halaman checkout.`,
      "success"
    );
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <HeaderNavbar />

      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/" className="hover:text-purple-700 transition">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-900 font-semibold">Daftar Kode Promo &amp; S&amp;K</span>
        </nav>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-zinc-900 text-white p-8 md:p-12 shadow-lg">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-bold uppercase tracking-widest backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Official Voucher &amp; Promo Center</span>
            </div>
            <h1 className="editorial-serif text-3xl md:text-4xl text-white font-normal leading-tight">
              Hemat Belanja Busana Muslim &amp; Hijab Voal Favorit
            </h1>
            <p className="text-xs md:text-sm text-purple-100/90 leading-relaxed">
              Klaim berbagai kode voucher potongan langsung, diskon persentase, dan subsidi bebas ongkir se-Indonesia. 
              Salin kode kupon dan gunakan saat menyelesaikan transaksi checkout.
            </p>
          </div>

          {/* Background Decorative Rings */}
          <div className="absolute -right-12 -bottom-24 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
          <div className="absolute right-32 -top-20 w-60 h-60 rounded-full bg-pink-500/20 blur-2xl pointer-events-none" />
        </div>

        {/* Filter Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {tags.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedTag === tab.id;
            const count =
              tab.id === "ALL"
                ? activeVouchers.length
                : activeVouchers.filter((v) => v.categoryTag === tab.id).length;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTag(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? "bg-purple-900 text-white shadow-xs"
                    : "bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-purple-300" : "text-zinc-500"}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-purple-700 text-white" : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Voucher Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVouchers.map((v) => {
            const isCopied = copiedCode === v.code;
            const discountLabel =
              v.discountType === "NOMINAL"
                ? `Rp ${v.discountValue.toLocaleString("id-ID")}`
                : `${v.discountValue}% OFF`;

            return (
              <div
                key={v.id}
                className="relative bg-white rounded-2xl border border-zinc-200/90 shadow-2xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
              >
                {/* Top Voucher Section */}
                <div className="p-6">
                  {/* Category & Expiry Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      {v.categoryTag || "Voucher Resmi"}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Berlaku s/d {v.expiryDate}</span>
                    </div>
                  </div>

                  {/* Discount Big Callout */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                      {discountLabel}
                    </span>
                    {v.maxDiscount && (
                      <span className="text-xs text-zinc-500">
                        (Maks. Rp {v.maxDiscount.toLocaleString("id-ID")})
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-zinc-900 mb-1">
                    {v.title}
                  </h3>
                  <p className="text-xs text-zinc-600">
                    Min. transaksi Rp {(v.minSpend || 0).toLocaleString("id-ID")}
                  </p>

                  {/* Voucher Code Box with Copy Button */}
                  <div className="mt-4 p-3 bg-zinc-50 border border-dashed border-purple-300 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                        Kode Voucher
                      </span>
                      <span className="font-mono text-sm font-extrabold text-purple-900 tracking-widest">
                        {v.code}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(v.code)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                        isCopied
                          ? "bg-emerald-600 text-white"
                          : "bg-purple-700 hover:bg-purple-800 text-white shadow-xs"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Kode</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Syarat & Ketentuan (S&K) Section */}
                  <div className="mt-5 pt-4 border-t border-zinc-100 space-y-2">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                      <span>Syarat &amp; Ketentuan (S&amp;K):</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-zinc-600">
                      {v.terms && v.terms.length > 0 ? (
                        v.terms.map((term, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold shrink-0 mt-0.5">•</span>
                            <span className="leading-relaxed">{term}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 font-bold shrink-0">•</span>
                          <span>
                            Minimal transaksi belanja Rp {(v.minSpend || 0).toLocaleString("id-ID")}. Berlaku s/d {v.expiryDate}.
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="px-6 py-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 text-[11px]">
                    Sisa Kuota: <strong>{v.quota - v.usedCount}</strong> / {v.quota}
                  </span>
                  <Link
                    href={cart.length > 0 ? "/checkout" : "/products"}
                    className="font-bold text-purple-800 hover:text-purple-950 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>{cart.length > 0 ? "Pakai di Checkout" : "Belanja Sekarang"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4-Step Voucher Usage Guide */}
        <section className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-2xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-700">
              Panduan Praktis
            </span>
            <h2 className="editorial-serif text-2xl text-zinc-900">
              Cara Menggunakan Kode Promo &amp; Kupon Rahayu
            </h2>
            <p className="text-xs text-zinc-500">
              Ikuti 4 langkah mudah berikut untuk menikmati potongan harga langsung pada pesanan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
              <div className="w-8 h-8 rounded-full bg-purple-800 text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h3 className="font-bold text-xs text-zinc-900">Pilih Produk Favorit</h3>
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                Jelajahi koleksi hijab voal, tunik, gamis, atau baju hamil dan masukkan ke dalam tas belanja.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
              <div className="w-8 h-8 rounded-full bg-purple-800 text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h3 className="font-bold text-xs text-zinc-900">Salin Kode Promo</h3>
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                Pilih kupon pada daftar di atas yang sesuai dengan nilai transaksi Anda, lalu klik tombol Salin Kode.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
              <div className="w-8 h-8 rounded-full bg-purple-800 text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h3 className="font-bold text-xs text-zinc-900">Buka Halaman Checkout</h3>
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                Tekan tombol Checkout dan buka dialog <em>Pilih Kupon Hemat</em> atau tempel kode promo di kolom kupon.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
              <div className="w-8 h-8 rounded-full bg-purple-800 text-white font-bold flex items-center justify-center text-xs">
                4
              </div>
              <h3 className="font-bold text-xs text-zinc-900">Diskon Otomatis Terpotong</h3>
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                Sistem akan memverifikasi syarat S&amp;K, dan subtotal pembayaran pesanan Anda langsung terpotong.
              </p>
            </div>
          </div>
        </section>

        {/* Need Help Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-400" />
              <span>Pertanyaan Seputar Syarat &amp; Ketentuan Promo?</span>
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl">
              Tim Customer Service Rahayu Fashion siap membantu Anda mengecek status kupon dan memberikan rekomendasi promo terbaik setiap hari (08:00–21:00 WIB).
            </p>
          </div>
          <a
            href="https://wa.me/6281288997744?text=Halo%20Admin%20Rahayu%20Fashion,%20saya%20mau%20tanya%20seputar%20kode%20promo%20dan%20S&K"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-md"
          >
            <span>Hubungi WhatsApp CS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
