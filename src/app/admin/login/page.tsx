"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  Package,
  Truck,
  CreditCard,
  Percent,
  Radio,
  Building2,
  ChevronRight,
  CheckCircle2,
  UserCheck,
  LogOut,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import {
  useStore,
  AdminRole,
  ADMIN_ROLES_CONFIG,
  DEMO_ADMIN_ACCOUNTS,
} from "@/context/StoreContext";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/admin";

  const { adminUser, isAdminLoggedIn, adminLogin, adminLogout, adminSwitchRole } = useStore();

  const [selectedRole, setSelectedRole] = useState<AdminRole>("SUPER_ADMIN");
  const [email, setEmail] = useState("owner@rahayufashion.id");
  const [password, setPassword] = useState("Rahayu#Admin2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"quick_roles" | "custom_form">("quick_roles");

  // If already logged in, show session state with options
  if (isAdminLoggedIn && adminUser) {
    const roleConfig = ADMIN_ROLES_CONFIG[adminUser.role];
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl text-white">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-800">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-purple-900/40">
            RF
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Sesi Internal Aktif</h2>
            <p className="text-xs text-zinc-400">Portal Manajemen Toko & Marketplace Rahayu</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-800/80 border border-zinc-700/80 mb-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-purple-900 shrink-0 border border-purple-500">
            {adminUser.avatarUrl ? (
              <img src={adminUser.avatarUrl} alt={adminUser.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-purple-200">
                {adminUser.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold text-white text-sm">{adminUser.name}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleConfig?.badgeBg} ${roleConfig?.badgeColor} ${roleConfig?.badgeBorder}`}>
                {roleConfig?.label}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-2 truncate">{adminUser.email} • {adminUser.department}</p>
            <p className="text-[11px] text-zinc-300 bg-zinc-900/60 p-2 rounded border border-zinc-750">
              {roleConfig?.description}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push(redirectTarget)}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-purple-900/30 cursor-pointer"
          >
            <span>Buka Workspace Admin ({roleConfig?.label.split(" ")[0]})</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                adminLogout();
              }}
              className="py-2.5 px-3 rounded-xl border border-zinc-700 hover:border-rose-700 hover:bg-rose-950/40 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Ganti Akun / Logout</span>
            </button>
            <Link
              href="/"
              className="py-2.5 px-3 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Webfront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleRoleQuickLogin = (demoRole: AdminRole) => {
    setIsLoading(true);
    const demo = DEMO_ADMIN_ACCOUNTS.find((a) => a.role === demoRole);
    setTimeout(() => {
      adminLogin(demo ? demo.email : `staff.${demoRole.toLowerCase()}@rahayufashion.id`, "Rahayu#2026", demoRole);
      setIsLoading(false);
      router.push(redirectTarget);
    }, 450);
  };

  const handleCustomFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      adminLogin(email.trim(), password, selectedRole);
      setIsLoading(false);
      router.push(redirectTarget);
    }, 550);
  };

  return (
    <div className="max-w-4xl mx-auto my-8 sm:my-12 px-4 text-white">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300 text-[11px] font-semibold mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Sistem Akses Internal Khusus Karyawan & Mitra (RBAC v4.2)</span>
        </div>
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 shadow-xl shadow-purple-900/30">
          <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
            <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              RF
            </span>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          Portal Internal Rahayu Store
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Masuk ke sistem operasional internal untuk mengelola pesanan, nomor resi kurir, katalog busana, dan analisa penjualan sesuai hak akses peran Anda.
        </p>
      </div>

      {/* Tabs: Quick Demo Roles vs Manual Form */}
      <div className="flex items-center justify-center gap-2 mb-6 border-b border-zinc-800 pb-4">
        <button
          onClick={() => setActiveTab("quick_roles")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "quick_roles"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Pilih Cepat Berdasarkan Role (5 Akun Demo)</span>
        </button>
        <button
          onClick={() => setActiveTab("custom_form")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "custom_form"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Login Manual (Email & Password)</span>
        </button>
      </div>

      {/* TAB 1: 5 QUICK ROLE CARDS */}
      {activeTab === "quick_roles" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <span>Pilih salah satu peran untuk simulasi hak akses instan:</span>
            <span className="text-[11px] text-purple-400 font-medium">1-Click Fast Auth</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEMO_ADMIN_ACCOUNTS.map((account) => {
              const meta = ADMIN_ROLES_CONFIG[account.role];
              return (
                <div
                  key={account.id}
                  className="bg-zinc-900/90 border border-zinc-800 hover:border-purple-600 rounded-2xl p-5 transition flex flex-col justify-between group hover:shadow-xl hover:shadow-purple-950/30"
                >
                  <div>
                    {/* Top Role Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${meta.badgeBg} ${meta.badgeColor} ${meta.badgeBorder}`}>
                        {meta.label}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {meta.allowedModules.length} Modul
                      </span>
                    </div>

                    {/* Staff Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={account.avatarUrl}
                        alt={account.name}
                        className="w-10 h-10 rounded-full object-cover border border-zinc-700 group-hover:border-purple-500"
                      />
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition truncate">
                          {account.name}
                        </h3>
                        <p className="text-[11px] text-zinc-400 truncate">{account.email}</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed mb-4 line-clamp-3">
                      {meta.description}
                    </p>

                    {/* Module Badges Preview */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {meta.allowedModules.slice(0, 4).map((mod) => (
                        <span key={mod} className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {mod}
                        </span>
                      ))}
                      {meta.allowedModules.length > 4 && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-purple-400 font-semibold">
                          +{meta.allowedModules.length - 4} lagi
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    disabled={isLoading}
                    onClick={() => handleRoleQuickLogin(account.role)}
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-purple-600 text-white text-xs font-bold transition flex items-center justify-center gap-2 group-hover:bg-purple-600 cursor-pointer disabled:opacity-50"
                  >
                    <span>Masuk sebagai {account.name.split(" ")[0]}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MANUAL LOGIN FORM */}
      {activeTab === "custom_form" && (
        <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleCustomFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Pilih Peran Internal (Role)
              </label>
              <select
                value={selectedRole}
                onChange={(e) => {
                  const r = e.target.value as AdminRole;
                  setSelectedRole(r);
                  const demo = DEMO_ADMIN_ACCOUNTS.find((a) => a.role === r);
                  if (demo) setEmail(demo.email);
                }}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 transition"
              >
                <option value="SUPER_ADMIN">👑 Super Admin (Owner - Akses Penuh 9 Modul)</option>
                <option value="PRODUCT_MANAGER">👗 Product & Merchandiser (Katalog, AI Photoshoot)</option>
                <option value="ORDER_FULFILLMENT">📦 Gudang & Fulfillment (Resi AWB, Kurir)</option>
                <option value="MARKETING_STREAMER">📱 Marketing & TikTok Live (Jadwal, Layout, Promo)</option>
                <option value="FINANCE_OPS">💳 Finance & Accounting (Payment Gateway, VA/QRIS)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Alamat Email Perusahaan
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@rahayufashion.id"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Kata Sandi Internal
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-zinc-800 border-zinc-700 text-purple-600 focus:ring-purple-500"
                />
                <span>Simpan sesi aktif (30 Hari)</span>
              </label>
              <span className="text-[11px] text-purple-400">Bantuan IT? 0811-9988-7766</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              {isLoading ? (
                <span>Memverifikasi Hak Akses...</span>
              ) : (
                <>
                  <span>Masuk ke Portal Internal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Footer Navigation: Links back to customer webfront */}
      <div className="mt-12 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kunjungi Frontstore Toko</span>
          </Link>
          <span className="text-zinc-700">|</span>
          <Link
            href="/login"
            className="text-purple-400 hover:text-purple-300 font-semibold transition"
          >
            Masuk sebagai Pelanggan (Customer Login)
          </Link>
        </div>
        <div className="text-[11px] text-zinc-500">
          © 2026 Rahayu Fashion Store • PT Rahayu Modest Nusantara
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-6">
      <Suspense fallback={<div className="text-center text-zinc-500 py-12">Memuat Portal Internal...</div>}>
        <AdminLoginContent />
      </Suspense>
    </div>
  );
}
