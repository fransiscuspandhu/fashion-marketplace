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
  const { aiFeaturesConfig, products, addToCart } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If feature is disabled in admin switchboard, do not render anything
  if (!aiFeaturesConfig.enableVirtualStylist) {
    return null;
  }

  const initialGreeting: ChatMessage = {
    id: "m-0",
    sender: "stylist",
    time: "Baru saja",
    text: "Assalamu'alaikum Sis! ✨ Saya **Stylist Rahayu AI**. Bingung padu padan warna jilbab, ukuran baju, atau mencari outfit kondangan & harian yang anggun? Tanyakan saja yaa!",
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "Padu padan jilbab untuk Gamis Lilac",
    "Outfit kondangan syar'i & elegan",
    "Bahan yang paling adem untuk harian",
    "Koleksi koko pria yang senada",
  ];

  const handleSend = (userText: string) => {
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

    // AI intelligent answer generation
    setTimeout(() => {
      let replyText = "";
      let matchedProds: ProductItem[] = [];

      const query = userText.toLowerCase();

      if (query.includes("lilac") || query.includes("gamis") || query.includes("jilbab")) {
        replyText =
          "Untuk nuansa **Gamis Lilac**, padanan terbaik adalah jilbab warna **Muted Khaki, Dusty Rose, atau Broken White**. Warna-warna ini memberikan kontras lembut yang anggun tanpa membuat tampilan terlihat mencolok. Berikut koleksi hijab & gamis yang sangat serasi:";
        matchedProds = products.filter(
          (p) => p.category.toLowerCase().includes("hijab") || p.name.toLowerCase().includes("gamis")
        ).slice(0, 2);
      } else if (query.includes("kondangan") || query.includes("pesta") || query.includes("elegan")) {
        replyText =
          "Untuk acara **Kondangan Formal**, kami rekomendasikan bahan **Silk Roberto Cavalli** dengan aksen drapery atau bordir halus. Tambahkan sentuhan jilbab silk berkilau lembut dan clutch bag berwarna gold/champagne:";
        matchedProds = products.filter(
          (p) => p.name.toLowerCase().includes("silk") || p.priceIdr > 200000
        ).slice(0, 2);
      } else if (query.includes("adem") || query.includes("harian") || query.includes("panas")) {
        replyText =
          "Bahan paling sejuk dan menyerap keringat adalah **Katun Toyobo Fodu** dan **Rayon Twill**. Karakteristik serat alaminya membuat Anda tetap nyaman seharian di cuaca tropis tanpa gerah:";
        matchedProds = products.slice(0, 2);
      } else if (query.includes("koko") || query.includes("pria")) {
        replyText =
          "Untuk busana pria sarimbit atau koko harian, pilihlah warna netral seperti **Sage, Denim Grey, atau Muted Brown** agar senada dengan gamis wanita:";
        matchedProds = products.filter((p) => p.category.toLowerCase().includes("pria")).slice(0, 2);
      } else {
        replyText = `Tentu Sis! Berdasarkan koleksi terbaru di Rahayu Fashion, kami memiliki berbagai pilihan model modest dengan potongan syar'i dan bahan jatuh berkualitas. Berikut rekomendasi pilihan terbaik untuk Sis:`;
        matchedProds = products.slice(0, 2);
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
    }, 700);
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
                                Rp {prod.priceIdr.toLocaleString("id-ID")}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              addToCart(prod, "M", "Default", 1);
                              alert(`${prod.name} berhasil ditambahkan ke keranjang belanja!`);
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
