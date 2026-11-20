"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Truck,
  CreditCard,
  QrCode,
  Building2,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Tag,
  AlertCircle,
  Plus,
  ArrowRight,
  Lock,
  Ticket,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
  Check,
  HelpCircle,
} from "lucide-react";
import { useStore, CustomerAddress, PaymentConfig, VoucherPromo } from "@/context/StoreContext";
import HeaderNavbar from "@/components/HeaderNavbar";
import Footer from "@/components/Footer";

interface CourierOption {
  code: string;
  name: string;
  service: string;
  cost: number;
  etd: string;
}

const AVAILABLE_COURIERS: CourierOption[] = [
  {
    code: "JNE",
    name: "JNE Express",
    service: "Reguler (REG)",
    cost: 14000,
    etd: "1-2 Hari Kerja",
  },
  {
    code: "SICEPAT",
    name: "SiCepat Ekspres",
    service: "BEST (Next Day)",
    cost: 18000,
    etd: "1 Hari Kerja",
  },
  {
    code: "JNT",
    name: "J&T Express",
    service: "EZ Standard",
    cost: 15000,
    etd: "1-3 Hari",
  },
  {
    code: "ANTERAJA",
    name: "AnterAja",
    service: "Reguler",
    cost: 12000,
    etd: "2-3 Hari",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    user,
    isLoggedIn,
    login,
    cart,
    cartTotal,
    paymentMethods,
    createOrder,
    showStoreToast,
    vouchers,
  } = useStore();

  // Active address
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Selected courier
  const [selectedCourier, setSelectedCourier] = useState<CourierOption>(AVAILABLE_COURIERS[0]);

  // Selected payment
  const activePayments = paymentMethods.filter((m) => m.isActive);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(
    activePayments[0]?.id || "qris-dynamic"
  );

  // Voucher
  const [voucherCode, setVoucherCode] = useState("RAHAYUPAYDAY");
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discount: number;
    description: string;
  } | null>({
    code: "RAHAYUPAYDAY",
    discount: 50000,
    description: "Voucher Payday Diskon Rp 50.000 Berhasil Diterapkan!",
  });
  const [voucherError, setVoucherError] = useState("");
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [expandedTermsVoucherId, setExpandedTermsVoucherId] = useState<string | null>(null);

  // Insurance checkbox
  const [useInsurance, setUseInsurance] = useState(true);
  const insuranceCost = useInsurance ? 1000 : 0;

  // Order notes
  const [orderNotes, setOrderNotes] = useState("");

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  const selectedPayment =
    activePayments.find((p) => p.id === selectedPaymentId) || activePayments[0];

  // If cart is empty
  if (cart.length === 0 && !orderSuccessId) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50">
        <HeaderNavbar />
        <main className="flex-1 max-w-[1320px] mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto bg-white p-8 border border-zinc-200 rounded-lg shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Truck className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-zinc-900 mb-2">Tas Belanja Anda Kosong</h1>
            <p className="text-xs text-zinc-500 mb-6">
              Tidak ada produk yang siap di-checkout. Silakan pilih koleksi hijab dan pakaian favorit Anda.
            </p>
            <Link
              href="/"
              className="inline-block py-3 px-6 bg-[#18181B] hover:bg-purple-900 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-md"
            >
              Belanja Koleksi Sekarang
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If not logged in, prompt Tokopedia-style login gate
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50">
        <HeaderNavbar />
        <main className="flex-1 max-w-[1320px] mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto bg-white p-8 border border-zinc-200 rounded-lg shadow-md text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-zinc-900 mb-2">
              Masuk Akun untuk Melanjutkan Checkout
            </h1>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
              Sesuai standar Tokopedia & Rahayu Store, alamat pengiriman dan pelacakan pesanan Anda
              tersimpan aman di akun profil pelanggan Anda.
            </p>

            <div className="space-y-3">
              <Link
                href="/login?redirect=/checkout"
                className="w-full py-3 bg-[#18181B] hover:bg-purple-900 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
              >
                <span>Masuk dengan Email / WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => login("siti.rahmawati@gmail.com", "Siti Rahmawati")}
                className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-semibold rounded transition cursor-pointer"
              >
                ⚡ 1-Click Fast Demo Login (Siti Rahmawati - Gold)
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const activeAddress: CustomerAddress =
    user.addresses[selectedAddressIndex] || user.addresses[0];

  const subtotal = cartTotal;
  const shippingCost = selectedCourier.cost;
  const paymentFee = selectedPayment?.fee || 0;
  const discountAmount = appliedVoucher ? appliedVoucher.discount : 0;
  const finalTotal = Math.max(0, subtotal + shippingCost + paymentFee + insuranceCost - discountAmount);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError("");
    const cleanCode = voucherCode.trim().toUpperCase();

    // 1. Check in dynamic vouchers from StoreContext
    const matchedVoucher = vouchers.find(
      (v) => v.code.toUpperCase() === cleanCode && v.isActive
    );

    if (matchedVoucher) {
      if (matchedVoucher.minSpend && subtotal < matchedVoucher.minSpend) {
        setVoucherError(
          `Minimal belanja Rp ${matchedVoucher.minSpend.toLocaleString("id-ID")} untuk klaim kode ${matchedVoucher.code}.`
        );
        return;
      }

      let calculatedDiscount = 0;
      if (matchedVoucher.discountType === "NOMINAL") {
        calculatedDiscount = matchedVoucher.discountValue;
      } else {
        // PERCENT
        calculatedDiscount = Math.round(subtotal * (matchedVoucher.discountValue / 100));
        if (matchedVoucher.maxDiscount && calculatedDiscount > matchedVoucher.maxDiscount) {
          calculatedDiscount = matchedVoucher.maxDiscount;
        }
      }

      setAppliedVoucher({
        code: matchedVoucher.code,
        discount: calculatedDiscount,
        description: `${matchedVoucher.title} (Hemat Rp ${calculatedDiscount.toLocaleString("id-ID")})`,
      });
      showStoreToast(
        "Voucher Berhasil Digunakan",
        `Kode ${matchedVoucher.code} memotong total belanja sebesar Rp ${calculatedDiscount.toLocaleString("id-ID")}.`,
        "success"
      );
      return;
    }

    // 2. Hardcoded fallbacks
    if (cleanCode === "RAHAYUPAYDAY") {
      setAppliedVoucher({
        code: "RAHAYUPAYDAY",
        discount: 50000,
        description: "Diskon Payday Rp 50.000 aktif!",
      });
      showStoreToast("Voucher Payday Aktif", "Potongan Rp 50.000 berhasil diterapkan.", "success");
    } else if (cleanCode === "ONGKIRGRATIS") {
      setAppliedVoucher({
        code: "ONGKIRGRATIS",
        discount: selectedCourier.cost,
        description: "Potongan Ongkir Gratis Berhasil Diterapkan!",
      });
      showStoreToast("Bebas Ongkir Aktif", "Biaya ongkir telah dipotong gratis.", "success");
    } else if (cleanCode === "RAHAYU10") {
      setAppliedVoucher({
        code: "RAHAYU10",
        discount: Math.round(subtotal * 0.1),
        description: "Diskon 10% Spesial Tokopedia Flow!",
      });
      showStoreToast("Diskon 10% Aktif", "Potongan 10% berhasil diterapkan.", "success");
    } else {
      setVoucherError("Kode voucher tidak valid atau telah kedaluwarsa.");
      setAppliedVoucher(null);
    }
  };

  const eligibleVouchersCount = vouchers.filter(
    (v) => v.isActive && subtotal >= (v.minSpend || 0)
  ).length;

  const applySelectedVoucher = (v: VoucherPromo) => {
    const minRequired = v.minSpend || 0;
    if (subtotal < minRequired) {
      showStoreToast(
        "Belum Memenuhi Syarat S&K",
        `Minimal transaksi belanja Rp ${minRequired.toLocaleString("id-ID")}. Belanja kurang Rp ${(minRequired - subtotal).toLocaleString("id-ID")} lagi.`,
        "warning"
      );
      return;
    }

    let calculatedDiscount = 0;
    if (v.discountType === "NOMINAL") {
      calculatedDiscount = v.discountValue;
    } else {
      calculatedDiscount = Math.round(subtotal * (v.discountValue / 100));
      if (v.maxDiscount && calculatedDiscount > v.maxDiscount) {
        calculatedDiscount = v.maxDiscount;
      }
    }

    setVoucherCode(v.code);
    setVoucherError("");
    setAppliedVoucher({
      code: v.code,
      discount: calculatedDiscount,
      description: `${v.title} (Hemat Rp ${calculatedDiscount.toLocaleString("id-ID")})`,
    });
    setIsPromoModalOpen(false);
    showStoreToast(
      "Kupon Berhasil Dipakai! 🎉",
      `Kode ${v.code} berhasil memotong subtotal pesanan sebesar Rp ${calculatedDiscount.toLocaleString("id-ID")}.`,
      "success"
    );
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const created = createOrder({
        items: cart,
        subtotal,
        shippingCost,
        discountAmount,
        totalAmount: finalTotal,
        courier: {
          code: selectedCourier.code,
          name: selectedCourier.name,
          service: selectedCourier.service,
          etd: selectedCourier.etd,
        },
        address: activeAddress,
        paymentMethod: {
          id: selectedPayment.id,
          name: selectedPayment.name,
          category: selectedPayment.category,
          fee: selectedPayment.fee,
        },
      });

      // Call payment create-transaction API endpoint
      fetch("/api/payment/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: created.id,
          grossAmount: finalTotal,
          customerDetails: {
            name: user?.name || activeAddress.recipient,
            email: user?.email || "customer@rahayufashion.id",
            phone: activeAddress.phone,
          },
          items: cart,
        }),
      }).catch((err) => console.warn("Payment API background error:", err));

      setIsSubmitting(false);
      setOrderSuccessId(created.id);
    }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <HeaderNavbar />

      {/* Checkout Progress Stepper (Tokopedia Flow) */}
      <div className="bg-white border-b border-zinc-200 py-3 px-4">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-zinc-900 uppercase tracking-widest text-sm">
              Checkout Pesanan
            </span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-500 hidden sm:inline">
              Alur Tokopedia Standard Checkout
            </span>
          </div>

          <div className="flex items-center gap-2 font-medium">
            <span className="text-purple-700 font-bold">1. Pengiriman</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-purple-700 font-bold">2. Pembayaran</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400">3. Selesai</span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 py-8">
        {orderSuccessId ? (
          /* Success Screen */
          <div className="max-w-xl mx-auto bg-white border border-zinc-200 rounded-lg p-8 shadow-sm text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Pesanan Berhasil Dibuat!
            </span>
            <h1 className="text-2xl font-bold text-zinc-900 mt-1 mb-2">
              Terima Kasih, {user.name}
            </h1>
            <p className="text-xs text-zinc-600 mb-6">
              Nomor Pesanan: <strong className="text-zinc-900 font-mono">{orderSuccessId}</strong>
            </p>

            <div className="bg-zinc-50 border border-zinc-200 rounded p-4 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-zinc-500">Metode Pembayaran:</span>
                <span className="font-semibold text-zinc-900">{selectedPayment.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Kurir Pengiriman:</span>
                <span className="font-semibold text-zinc-900">
                  {selectedCourier.name} ({selectedCourier.service})
                </span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-2 font-bold text-sm">
                <span>Total Tagihan:</span>
                <span className="text-purple-700">Rp {finalTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/profile?tab=orders"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#18181B] hover:bg-purple-900 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-md"
              >
                <span>Lihat Status & Lacak Resi di Halaman Profil</span>
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
        ) : (
          /* Normal Checkout Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column (Tokopedia Flow Steps: Address, Products, Courier, Payment) */}
            <div className="lg:col-span-8 space-y-6">
              {/* 1. Alamat Pengiriman */}
              <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-2xs">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-700" />
                    <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
                      1. Alamat Pengiriman
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="text-xs font-semibold text-purple-700 hover:text-purple-900 cursor-pointer"
                  >
                    Pilih Alamat Lain ({user.addresses.length})
                  </button>
                </div>

                <div className="text-xs text-zinc-700 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 text-sm">{activeAddress.recipient}</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-100 text-[10px] text-zinc-600 font-medium">
                      {activeAddress.label}
                    </span>
                    {activeAddress.isDefault && (
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-[10px] text-purple-800 font-semibold">
                        Utama
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-600 font-mono">{activeAddress.phone}</p>
                  <p className="text-zinc-800 leading-relaxed font-normal">
                    {activeAddress.fullAddress}, {activeAddress.city} {activeAddress.postalCode}
                  </p>
                </div>
              </div>

              {/* 2. Produk Pesanan */}
              <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-2xs">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
                  <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
                    2. Rincian Produk Pesanan ({cart.length} Jenis Produk)
                  </h2>
                  <span className="text-xs text-zinc-500 font-medium">
                    Dikirim dari:{" "}
                    <strong className="text-zinc-800">Fulfillment Hub Bandung</strong>
                  </span>
                </div>

                <div className="divide-y divide-zinc-100 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-center">
                      <div className="w-16 h-20 bg-zinc-100 rounded overflow-hidden shrink-0 border border-zinc-200">
                        <img
                          src={`https://images.unsplash.com/photo-${1584917865442 + item.product.id * 1000}?auto=format&fit=crop&w=200&q=80`}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 text-xs">
                        <h3 className="font-bold text-zinc-900 leading-snug">
                          {item.product.name}
                        </h3>
                        <div className="flex items-center gap-2 text-zinc-500 mt-1">
                          <span className="bg-zinc-100 px-2 py-0.5 rounded font-medium text-zinc-700">
                            Ukuran: {item.selectedSize}
                          </span>
                          <span>•</span>
                          <span>Warna: {item.selectedColor}</span>
                          <span>•</span>
                          <span className="font-semibold text-zinc-800">
                            {item.quantity} x Rp {item.product.priceIdr.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm font-bold text-zinc-900">
                        Rp {(item.product.priceIdr * item.quantity).toLocaleString("id-ID")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Catatan untuk Penjual */}
                <div className="mt-5 pt-4 border-t border-zinc-100">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Catatan untuk Penjual (Opsional)
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="cth. Tolong gunakan box pita rapi untuk hadiah ulang tahun..."
                    className="w-full px-3 py-2 border border-zinc-300 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              {/* 3. Kurir Pengiriman */}
              <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-2xs">
                <div className="flex items-center gap-2 pb-4 border-b border-zinc-100 mb-4">
                  <Truck className="w-4 h-4 text-purple-700" />
                  <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
                    3. Pilihan Jasa Pengiriman
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_COURIERS.map((courier) => {
                    const isSelected = selectedCourier.code === courier.code;
                    return (
                      <div
                        key={courier.code}
                        onClick={() => setSelectedCourier(courier)}
                        className={`p-3.5 border rounded-lg cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-purple-600 bg-purple-50/40 ring-1 ring-purple-600"
                            : "border-zinc-200 hover:border-zinc-400 bg-white"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-bold text-xs text-zinc-900">{courier.name}</span>
                            <span className="block text-[11px] text-zinc-500 font-medium">
                              {courier.service} ({courier.etd})
                            </span>
                          </div>
                          <span className="font-bold text-xs text-zinc-900">
                            Rp {courier.cost.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {isSelected ? (
                            <span className="text-purple-700 font-bold flex items-center gap-1">
                              ✓ Dipilih
                            </span>
                          ) : (
                            "Klik untuk memilih"
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Asuransi Pengiriman */}
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useInsurance}
                      onChange={(e) => setUseInsurance(e.target.checked)}
                      className="rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-zinc-700">
                      Proteksi Kerusakan & Kehilangan Paket (Asuransi Pengiriman)
                    </span>
                  </label>
                  <span className="font-semibold text-zinc-900">Rp 1.000</span>
                </div>
              </div>

              {/* 4. Metode Pembayaran (Synchronized with Admin Gateway Control) */}
              <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-2xs">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-700" />
                    <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
                      4. Metode Pembayaran
                    </h2>
                  </div>
                  <span className="text-[11px] text-zinc-500">
                    {activePayments.length} Gateway Aktif
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activePayments.map((method) => {
                    const isSelected = selectedPaymentId === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPaymentId(method.id)}
                        className={`p-3.5 border rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? "border-purple-600 bg-purple-50/40 ring-1 ring-purple-600"
                            : "border-zinc-200 hover:border-zinc-400 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700">
                            {method.category === "QRIS" && <QrCode className="w-4 h-4" />}
                            {method.category === "VIRTUAL_ACCOUNT" && (
                              <Building2 className="w-4 h-4" />
                            )}
                            {method.category === "CREDIT_CARD" && (
                              <CreditCard className="w-4 h-4" />
                            )}
                            {method.category === "COD" && <Banknote className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-zinc-900 block">
                              {method.name}
                            </span>
                            <span className="text-[11px] text-zinc-500 block">
                              {method.description}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-semibold text-zinc-700">
                            {method.fee === 0 ? "Bebas Biaya" : `+Rp ${method.fee.toLocaleString("id-ID")}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Pay Action */}
            <div className="lg:col-span-4 space-y-6">
              {/* Voucher Code Box */}
              <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-700" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                      Voucher Promo Rahayu
                    </h3>
                  </div>
                  {eligibleVouchersCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      {eligibleVouchersCount} Siap Dipakai
                    </span>
                  )}
                </div>

                <form onSubmit={handleApplyVoucher} className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Kode promo (cth. RAHAYUPAYDAY)"
                    className="flex-1 px-3 py-2 border border-zinc-300 rounded text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-zinc-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-900 hover:bg-purple-900 text-white text-xs font-semibold rounded transition cursor-pointer"
                  >
                    Pakai
                  </button>
                </form>

                {/* Quick Button to open full Promo Modal */}
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(true)}
                  className="w-full py-2.5 px-3 bg-purple-50/80 hover:bg-purple-100/80 border border-purple-200 rounded-lg text-xs font-semibold text-purple-900 flex items-center justify-between transition cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-purple-700" />
                    <span>Pilih Kupon Hemat Tersedia</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-purple-700 underline">
                      Lihat Semua &amp; S&amp;K
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-purple-700" />
                  </div>
                </button>

                {appliedVoucher && (
                  <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{appliedVoucher.code}</span>
                      </div>
                      <p className="text-[10px] text-emerald-700 mt-0.5">{appliedVoucher.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAppliedVoucher(null)}
                      className="text-xs text-rose-600 font-semibold hover:underline cursor-pointer ml-2"
                    >
                      Batal
                    </button>
                  </div>
                )}

                {voucherError && (
                  <div className="mt-2 text-[11px] text-rose-600 flex items-center gap-1 bg-rose-50 border border-rose-200 p-2 rounded">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{voucherError}</span>
                  </div>
                )}

                <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-500">
                  <Link
                    href="/promos"
                    target="_blank"
                    className="hover:text-purple-700 underline flex items-center gap-1"
                  >
                    <HelpCircle className="w-3 h-3 text-zinc-400" />
                    <span>Syarat &amp; Ketentuan Promo Lengkap</span>
                  </Link>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
                  Ringkasan Belanja
                </h3>

                <div className="text-xs text-zinc-600 space-y-2.5">
                  <div className="flex justify-between">
                    <span>Total Harga ({cart.reduce((a, b) => a + b.quantity, 0)} Barang)</span>
                    <span className="font-semibold text-zinc-900">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total Ongkos Kirim ({selectedCourier.code})</span>
                    <span className="font-semibold text-zinc-900">
                      Rp {shippingCost.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {insuranceCost > 0 && (
                    <div className="flex justify-between">
                      <span>Asuransi Pengiriman</span>
                      <span className="font-semibold text-zinc-900">
                        Rp {insuranceCost.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}

                  {paymentFee > 0 && (
                    <div className="flex justify-between">
                      <span>Biaya Layanan Pembayaran</span>
                      <span className="font-semibold text-zinc-900">
                        Rp {paymentFee.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Potongan Voucher Promo</span>
                      <span>-Rp {discountAmount.toLocaleString("id-ID")}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-zinc-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold text-zinc-900 uppercase block">
                      Total Tagihan
                    </span>
                    <span className="text-[10px] text-zinc-500">Termasuk PPN 11%</span>
                  </div>
                  <span className="text-xl font-extrabold text-purple-700">
                    Rp {finalTotal.toLocaleString("id-ID")}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="w-full py-3.5 bg-[#18181B] hover:bg-purple-900 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {isSubmitting ? (
                    <span>Memproses Transaksi...</span>
                  ) : (
                    <>
                      <span>Bayar Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-3 flex items-center justify-center gap-2 text-zinc-400 text-[10px] text-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Garansi 100% uang kembali jika paket tidak sesuai atau rusak.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Address Switcher Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="font-bold text-sm text-zinc-900">Pilih Alamat Pengiriman</h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 text-xs font-semibold"
              >
                ✕ Tutup
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {user.addresses.map((addr, idx) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    setSelectedAddressIndex(idx);
                    setIsAddressModalOpen(false);
                  }}
                  className={`p-3 border rounded text-xs cursor-pointer ${
                    selectedAddressIndex === idx
                      ? "border-purple-600 bg-purple-50/40"
                      : "border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-zinc-900">{addr.recipient}</span>
                    <span className="text-[10px] bg-zinc-100 px-1.5 py-0.2 rounded text-zinc-600">
                      {addr.label}
                    </span>
                  </div>
                  <p className="text-zinc-600 text-[11px]">{addr.fullAddress}, {addr.city}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setIsAddressModalOpen(false);
                showStoreToast(
                  "Kelola Alamat Pengiriman",
                  "Membuka halaman Buku Alamat di Profil Pelanggan Anda...",
                  "info"
                );
                router.push("/profile");
              }}
              className="w-full py-2 border border-dashed border-zinc-300 text-xs font-semibold text-zinc-700 rounded hover:bg-zinc-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Alamat Baru di Profil</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL PILIH KODE PROMO & S&K (CHECKOUT VALIDATION) */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-200 bg-gradient-to-r from-purple-50 via-white to-pink-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900">
                      Pilih Kupon Hemat &amp; Kode Promo
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      Pilih promo yang memenuhi syarat minimal belanja pesanan Anda.
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPromoModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Subtotal Status Pill */}
            <div className="px-5 py-2.5 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between text-xs">
              <span className="text-zinc-600 font-medium">Subtotal Belanja Saat Ini:</span>
              <span className="font-bold text-zinc-900 font-mono text-sm">
                Rp {subtotal.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Voucher List */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
              {vouchers.filter((v) => v.isActive).length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs">
                  Belum ada voucher aktif yang tersedia saat ini.
                </div>
              ) : (
                vouchers
                  .filter((v) => v.isActive)
                  .map((voucher) => {
                    const minRequired = voucher.minSpend || 0;
                    const isEligible = subtotal >= minRequired;
                    const shortfall = Math.max(0, minRequired - subtotal);
                    const isCurrentlyApplied = appliedVoucher?.code === voucher.code;

                    let potentialSavings = 0;
                    if (voucher.discountType === "NOMINAL") {
                      potentialSavings = voucher.discountValue;
                    } else {
                      potentialSavings = Math.round(subtotal * (voucher.discountValue / 100));
                      if (voucher.maxDiscount && potentialSavings > voucher.maxDiscount) {
                        potentialSavings = voucher.maxDiscount;
                      }
                    }

                    const isTermsExpanded = expandedTermsVoucherId === voucher.id;

                    return (
                      <div
                        key={voucher.id}
                        className={`rounded-xl border transition-all ${
                          isCurrentlyApplied
                            ? "border-emerald-500 bg-emerald-50/30 shadow-xs ring-1 ring-emerald-500"
                            : isEligible
                            ? "border-purple-200 bg-white hover:border-purple-400 shadow-2xs"
                            : "border-zinc-200 bg-zinc-50/70 opacity-70"
                        }`}
                      >
                        {/* Main Voucher Info */}
                        <div className="p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex-1 min-w-[200px]">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded bg-zinc-900 text-white tracking-wider">
                                  {voucher.code}
                                </span>
                                {voucher.categoryTag && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                                    {voucher.categoryTag}
                                  </span>
                                )}
                                {isEligible ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                    <Check className="w-3 h-3" />
                                    <span>Memenuhi S&amp;K</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>Belum Memenuhi S&amp;K</span>
                                  </span>
                                )}
                              </div>
                              <h4 className="font-bold text-xs text-zinc-900 mt-1">
                                {voucher.title}
                              </h4>
                              <p className="text-[11px] text-zinc-500 mt-0.5">
                                Min. belanja Rp {minRequired.toLocaleString("id-ID")} · Berlaku s/d {voucher.expiryDate}
                              </p>
                              {isEligible && (
                                <p className="text-[11px] font-bold text-emerald-700 mt-1 flex items-center gap-1">
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Potongan Diskon: Hemat Rp {potentialSavings.toLocaleString("id-ID")}</span>
                                </p>
                              )}
                            </div>

                            {/* Action Button: Enabled or Disabled */}
                            <div className="shrink-0 flex flex-col items-end">
                              {isCurrentlyApplied ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAppliedVoucher(null);
                                    showStoreToast("Voucher Dibatalkan", "Kupon promo telah dilepas.", "info");
                                  }}
                                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-rose-600 flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                                  title="Klik untuk membatalkan penggunaan voucher"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Aktif (Lepas)</span>
                                </button>
                              ) : isEligible ? (
                                <button
                                  type="button"
                                  onClick={() => applySelectedVoucher(voucher)}
                                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                                >
                                  <Ticket className="w-3.5 h-3.5" />
                                  <span>Gunakan Kupon</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled={true}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-200 text-zinc-400 border border-zinc-300 cursor-not-allowed"
                                  title="Belum memenuhi syarat minimal transaksi"
                                >
                                  Tidak Memenuhi S&amp;K
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Ineligible Shortfall Notice */}
                          {!isEligible && (
                            <div className="mt-3 p-2 rounded-lg bg-amber-50/90 border border-amber-200/80 text-[11px] text-amber-800 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>
                                Belanja <strong>Rp {shortfall.toLocaleString("id-ID")}</strong> lagi untuk mengaktifkan kode ini.
                              </span>
                            </div>
                          )}

                          {/* Terms & Conditions Accordion Toggle */}
                          <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedTermsVoucherId(isTermsExpanded ? null : voucher.id)
                              }
                              className="text-[11px] font-semibold text-zinc-500 hover:text-purple-700 flex items-center gap-1 cursor-pointer transition"
                            >
                              <span>Syarat &amp; Ketentuan (S&amp;K)</span>
                              {isTermsExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <span className="text-[10px] text-zinc-400">
                              Sisa kuota: {voucher.quota - voucher.usedCount}
                            </span>
                          </div>

                          {/* Expanded S&K Content */}
                          {isTermsExpanded && (
                            <div className="mt-2.5 p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600 space-y-1.5 animate-in fade-in">
                              <div className="font-bold text-zinc-800 text-[10px] uppercase tracking-wider mb-1">
                                Ketentuan Resmi Voucher:
                              </div>
                              {voucher.terms && voucher.terms.length > 0 ? (
                                voucher.terms.map((term, tIdx) => (
                                  <div key={tIdx} className="flex items-start gap-2">
                                    <span className="text-purple-600 font-bold shrink-0">•</span>
                                    <span>{term}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-zinc-500">
                                  Minimal transaksi Rp {minRequired.toLocaleString("id-ID")}. Berlaku s/d {voucher.expiryDate}.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <Link
                href="/promos"
                target="_blank"
                className="text-xs font-semibold text-purple-700 hover:underline flex items-center gap-1"
              >
                <span>Halaman Promo &amp; S&amp;K Lengkap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setIsPromoModalOpen(false)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg cursor-pointer transition"
              >
                Selesai / Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
