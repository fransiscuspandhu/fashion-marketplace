"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, User as UserIcon, Phone, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import HeaderNavbar from "@/components/HeaderNavbar";
import Footer from "@/components/Footer";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/profile";
  const { login, isLoggedIn, user } = useStore();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("siti.rahmawati@gmail.com");
  const [password, setPassword] = useState("rahayu2026");
  const [name, setName] = useState("Siti Rahmawati");
  const [phone, setPhone] = useState("0812-8877-6655");
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, show user info and redirect button
  if (isLoggedIn && user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-zinc-200 rounded-lg shadow-sm text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 mb-1">Anda Sedang Masuk</h2>
        <p className="text-sm text-zinc-600 mb-6">
          Sebagai <strong className="text-zinc-900">{user.name}</strong> ({user.email})
        </p>
        <div className="space-y-3">
          <Link
            href={redirectTarget}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#18181B] hover:bg-purple-900 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
          >
            <span>Lanjutkan ke Halaman {redirectTarget.includes("checkout") ? "Checkout" : "Profil"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="w-full inline-block text-xs text-zinc-500 hover:text-zinc-800 py-2"
          >
            Kembali ke Beranda Belanja
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email, activeTab === "register" ? name : undefined);
      setIsLoading(false);
      router.push(redirectTarget);
    }, 600);
  };

  const handleDemoLogin = (demoEmail: string, demoName: string) => {
    setIsLoading(true);
    setTimeout(() => {
      login(demoEmail, demoName);
      setIsLoading(false);
      router.push(redirectTarget);
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      {/* Brand Icon & Welcome Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-13 mx-auto mb-3">
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
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {activeTab === "login" ? "Selamat Datang Kembali" : "Buat Akun Rahayu"}
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          {activeTab === "login"
            ? "Masuk untuk melihat pesanan, pelacakan resi kurir, dan voucher eksklusif."
            : "Daftar sekarang dan dapatkan voucher selamat datang diskon Rp 50.000."}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("login")}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition-colors ${
            activeTab === "login"
              ? "border-b-2 border-zinc-900 text-zinc-950"
              : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          Masuk ke Akun
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("register")}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition-colors ${
            activeTab === "register"
              ? "border-b-2 border-zinc-900 text-zinc-950"
              : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          Daftar Akun Baru
        </button>
      </div>

      {/* Fast Demo Accounts Helper */}
      <div className="bg-purple-50/80 border border-purple-200 rounded-md p-3.5 mb-6 text-xs text-purple-900">
        <div className="flex items-center gap-1.5 font-bold mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-700" />
          <span>Demo 1-Click Login (Alur Tokopedia):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin("siti.rahmawati@gmail.com", "Siti Rahmawati")}
            className="px-2.5 py-1 bg-white hover:bg-purple-100 border border-purple-300 rounded text-[11px] font-medium transition cursor-pointer shadow-2xs"
          >
            Siti Rahmawati (Gold Member)
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin("dian.permata@gmail.com", "Dian Permata")}
            className="px-2.5 py-1 bg-white hover:bg-purple-100 border border-purple-300 rounded text-[11px] font-medium transition cursor-pointer shadow-2xs"
          >
            Dian Permata (Pelanggan Baru)
          </button>
        </div>
      </div>

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === "register" && (
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth. Siti Rahmawati"
                className="w-full pl-9 pr-3 py-2.5 border border-zinc-300 rounded text-xs focus:outline-none focus:border-zinc-900 transition"
              />
              <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Alamat Email Aktif
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full pl-9 pr-3 py-2.5 border border-zinc-300 rounded text-xs focus:outline-none focus:border-zinc-900 transition"
            />
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          </div>
        </div>

        {activeTab === "register" && (
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Nomor WhatsApp / HP
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full pl-9 pr-3 py-2.5 border border-zinc-300 rounded text-xs focus:outline-none focus:border-zinc-900 transition"
              />
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-zinc-700">Password</label>
            {activeTab === "login" && (
              <a href="#" className="text-[11px] text-purple-700 hover:underline">
                Lupa Password?
              </a>
            )}
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2.5 border border-zinc-300 rounded text-xs focus:outline-none focus:border-zinc-900 transition"
            />
            <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#18181B] hover:bg-purple-900 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {isLoading ? (
            <span>Memproses...</span>
          ) : (
            <>
              <span>{activeTab === "login" ? "Masuk ke Akun" : "Daftar Akun Baru"}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Distinction banner: Internal Staff Admin Portal */}
      <div className="mt-6 p-4 rounded-xl bg-purple-50/80 border border-purple-200 text-center">
        <p className="text-xs text-zinc-700 font-semibold mb-1">
          🔐 Anda Karyawan, Staf Gudang, atau Mitra Internal?
        </p>
        <p className="text-[11px] text-zinc-500 mb-2.5">
          Halaman ini khusus akun pelanggan webfront. Untuk mengelola pesanan, stok, atau input resi kurir, silakan masuk ke Portal Internal.
        </p>
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-purple-900 text-white text-xs font-bold transition shadow-xs"
        >
          <span>Masuk ke Portal Internal Admin & Gudang</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Security Guarantee */}
      <div className="mt-6 pt-5 border-t border-zinc-200 flex items-center justify-center gap-2 text-zinc-400 text-[11px]">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Data & privasi Anda terlindungi enkripsi SSL 256-bit standar industri.</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <HeaderNavbar />
      <main className="flex-1 flex items-center justify-center py-8">
        <Suspense fallback={<div className="text-center p-12 text-sm text-zinc-500">Memuat halaman...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
