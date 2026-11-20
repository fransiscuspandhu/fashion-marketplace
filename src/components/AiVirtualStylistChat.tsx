"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  ShoppingBag,
  Bot,
  User,
  ChevronDown,
  RefreshCw,
  ArrowRight,
  Check,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ProductItem } from "@/data/mock-data";

interface ChatMessage {
  id: string;
  sender: "stylist" | "user";
  text: string;
  time: string;
  recommendedProducts?: ProductItem[];
}

export default function AiVirtualStylistChat() {
  const { aiFeaturesConfig, products, addToCart, showStoreToast } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreeting: ChatMessage = {
    id: "m-0",
    sender: "stylist",
    time: "Baru saja",
    text: "Assalamu'alaikum Sis! ✨ Saya **Stylist Rahayu AI**. Bingung padu padan warna jilbab, ukuran baju, atau mencari outfit kondangan & harian yang anggun? Tanyakan saja yaa!",
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && mounted) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, mounted]);

  // If component is not mounted yet or disabled in switchboard, do not render to avoid SSR hydration mismatch
  if (!mounted || !aiFeaturesConfig.enableVirtualStylist) {
    return null;
  }

  const quickPrompts = [
    "Padu padan jilbab untuk Gamis Lilac",
    "Warna jilbab untuk kulit sawo matang",
    "Outfit kondangan syar'i & elegan",
    "Bahan yang paling adem untuk cuaca panas",
    "Koleksi koko pria sarimbit senada",
    "Rekomendasi baju hamil & busui friendly",
    "Tips gamis untuk tubuh mungil (petite)",
    "Voucher promo diskon hari ini",
  ];

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: userText,
      time: "Baru saja",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    let replyText = "";
    let matchedProds: ProductItem[] = [];
    let returnedHints: string[] = [];
    let returnedCategory = "";

    try {
      const res = await fetch("/api/ai/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(4000),
        body: JSON.stringify({ message: userText }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.reply) {
          replyText = data.reply;
          returnedHints = Array.isArray(data.keywordHints) ? data.keywordHints : [];
          returnedCategory = data.categoryHint || "";
        }
      }
    } catch (e) {
      console.warn("AI Stylist API fallback:", e);
    }

    const query = userText.toLowerCase();

    // 1. Dynamic product matching from API hints
    if (returnedHints.length > 0 || returnedCategory) {
      matchedProds = products
        .filter((p) => {
          const nameL = p.name.toLowerCase();
          const catL = p.category.toLowerCase();
          const descL = (p.desc || "").toLowerCase();

          const matchesCat =
            returnedCategory && returnedCategory !== "Semua"
              ? catL.includes(returnedCategory.toLowerCase())
              : false;
          const matchesKw = returnedHints.some(
            (h) =>
              nameL.includes(h.toLowerCase()) ||
              catL.includes(h.toLowerCase()) ||
              descL.includes(h.toLowerCase())
          );
          return matchesCat || matchesKw;
        })
        .slice(0, 2);
    }

    // 2. Keyword fallback matching from user query
    if (matchedProds.length === 0) {
      matchedProds = products
        .filter((p) => {
          const nameL = p.name.toLowerCase();
          const catL = p.category.toLowerCase();
          return query
            .split(" ")
            .some((w) => w.length >= 3 && (nameL.includes(w) || catL.includes(w)));
        })
        .slice(0, 2);
    }

    // 3. Smart diverse fallback: ambil 2 produk acak agar tidak selalu menampilkan produk yang sama
    if (matchedProds.length === 0 && products.length > 0) {
      const shuffled = [...products].sort(() => Math.random() - 0.5);
      matchedProds = shuffled.slice(0, 2);
    }

    if (!replyText) {
      replyText = `Terima kasih atas pertanyaannya Sis! Untuk gaya yang anggun dan santun, kami merekomendasikan busana modest bernuansa earth-tone atau pastel lembut dengan hijab voal premium. Berikut pilihan terbaik dari koleksi kami untuk Sis:`;
    }

    const botReply: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: "stylist",
      text: replyText,
      time: "Baru saja",
      recommendedProducts: matchedProds.length > 0 ? matchedProds : undefined,
    };

    setMessages((prev) => [...prev, botReply]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-full shadow-xl hover:shadow-2xl transition duration-200 cursor-pointer group border-2 border-white/20"
          title="Tanya Stylist Rahayu AI"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 fill-amber-300 text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <span className="text-xs font-bold tracking-wide">Tanya Stylist AI</span>
        </button>
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 p-3.5 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">Stylist Rahayu AI</h4>
                <p className="text-[10px] text-purple-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Online • Asisten Padu Padan Muslimah
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-zinc-50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "stylist" && (
                  <div className="w-6 h-6 rounded-full bg-purple-700 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                    R
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3 rounded-2xl ${
                    m.sender === "user"
                      ? "bg-purple-700 text-white rounded-tr-xs"
                      : "bg-white text-zinc-800 border border-zinc-200 shadow-2xs rounded-tl-xs"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{m.text}</p>

                  {/* Recommended Products Attachment */}
                  {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-zinc-100 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                        Koleksi yang Direkomendasikan:
                      </p>
                      {m.recommendedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="p-1.5 bg-zinc-50 rounded-lg border border-zinc-200 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded bg-white overflow-hidden shrink-0 border border-zinc-200">
                              <img
                                src={prod.imageUrl || `https://images.unsplash.com/photo-${1584917865442 + prod.id * 1000}?auto=format&fit=crop&w=150&q=80`}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="truncate">
                              <p className="text-[11px] font-semibold text-zinc-900 truncate">
                                {prod.name}
                              </p>
                              <p className="text-[10px] text-purple-700 font-bold">
                                Rp {prod.priceIdr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              addToCart(prod, "M", "Default", 1);
                              showStoreToast(
                                "Rekomendasi Stylist Ditambahkan",
                                `${prod.name} berhasil masuk ke keranjang belanja Anda!`,
                                "success"
                              );
                            }}
                            className="px-2 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            <ShoppingBag className="w-2.5 h-2.5" />
                            <span>Beli</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1 ${
                      m.sender === "user" ? "text-purple-200 text-right" : "text-zinc-400"
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs italic pl-8">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce delay-200"></span>
                <span>Stylist sedang mengetik saran...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-white border-t border-zinc-100 flex gap-1.5 overflow-x-auto scrollbar-none text-[10px]">
            {quickPrompts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 font-medium rounded-full border border-purple-200 whitespace-nowrap cursor-pointer transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputMessage);
            }}
            className="p-2.5 bg-white border-t border-zinc-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tanya padu padan warna jilbab / baju..."
              className="flex-1 px-3 py-2 border border-zinc-300 rounded-full text-xs focus:outline-none focus:border-purple-700"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-8 h-8 rounded-full bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white flex items-center justify-center cursor-pointer transition shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
