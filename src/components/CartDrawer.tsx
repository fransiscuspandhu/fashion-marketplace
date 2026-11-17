"use client";

import React from "react";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function CartDrawer() {
  const {
    cart,
    isCartDrawerOpen,
    closeCartDrawer,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    showStoreToast,
  } = useStore();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCartDrawer}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-purple-700" />
              <h2 className="text-base font-bold text-zinc-900 tracking-wide uppercase">
                Tas Belanja ({cartCount})
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    showStoreToast("Tas Belanja Dikosongkan", "Seluruh item telah dihapus dari tas belanja.", "info");
                  }}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  Kosongkan
                </button>
              )}
              <button
                onClick={closeCartDrawer}
                className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-zinc-100">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-zinc-900 mb-1">
                  Tas Belanja Anda Kosong
                </h3>
                <p className="text-sm text-zinc-500 mb-6">
                  Yuk jelajahi koleksi hijab dan busana muslim terbaru kami.
                </p>
                <button
                  onClick={closeCartDrawer}
                  className="px-6 py-2.5 bg-[#18181B] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-purple-900 transition-colors cursor-pointer"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-26 rounded bg-zinc-100 overflow-hidden shrink-0 relative border border-zinc-200 flex items-center justify-center">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80";
                        }}
                      />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-purple-300" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent flex items-end p-1.5">
                      <span className="text-[9px] text-white font-semibold truncate">
                        {item.product.category}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-semibold text-zinc-900 leading-snug line-clamp-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title="Hapus item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <span className="bg-zinc-100 px-2 py-0.5 rounded text-[11px] font-medium text-zinc-700">
                          {item.selectedSize}
                        </span>
                        <span>•</span>
                        <span className="text-[11px]">{item.selectedColor}</span>
                      </div>

                      <div className="mt-2 text-sm font-bold text-zinc-900">
                        Rp {item.product.priceIdr.toLocaleString("id-ID")}
                      </div>
                    </div>

                    {/* Qty Controls */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-50">
                      <div className="flex items-center border border-zinc-300 rounded overflow-hidden">
                        <button
                          onClick={() => updateCartQty(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-zinc-100 text-zinc-600 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-zinc-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-zinc-100 text-zinc-600 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs text-zinc-500">
                        Total:{" "}
                        <span className="font-semibold text-zinc-900">
                          Rp {(item.product.priceIdr * item.quantity).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-zinc-200 bg-zinc-50 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                  Subtotal Produk
                </span>
                <span className="text-lg font-extrabold text-zinc-900">
                  Rp {cartTotal.toLocaleString("id-ID")}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Biaya ongkir dan potongan voucher promo akan dihitung pada langkah Checkout.
              </p>

              <div className="flex gap-3">
                <Link
                  href="/checkout"
                  onClick={closeCartDrawer}
                  className="flex-1 py-3 px-4 bg-[#18181B] hover:bg-purple-900 text-white text-xs font-bold uppercase tracking-widest text-center rounded transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span>Lanjut ke Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
