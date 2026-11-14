"use client";

import React, { useState } from "react";
import { Sparkles, X, Check, Ruler, Info, ArrowRight } from "lucide-react";
import { ProductItem } from "@/data/mock-data";

interface AiSmartSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
  onSelectSize: (size: string) => void;
}

export default function AiSmartSizeModal({
  isOpen,
  onClose,
  product,
  onSelectSize,
}: AiSmartSizeModalProps) {
  const [heightCm, setHeightCm] = useState<number>(160);
  const [weightKg, setWeightKg] = useState<number>(56);
  const [fitPref, setFitPref] = useState<"slim" | "regular" | "loose">("regular");
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  if (!isOpen || !product) return null;

  // AI Smart Calculation Logic
  const calcEstimatedBust = () => {
    let base = weightKg * 1.25 + heightCm * 0.14;
    if (fitPref === "loose") base += 5;
    if (fitPref === "slim") base -= 3;
    return Math.round(base);
  };

  const estimatedBust = calcEstimatedBust();

  // Match size
  let recommendedSize = "M";
  let matchScore = 95;
  let adviceNotes = "Ukuran pas nyaman di lingkar dada dan leluasa untuk aktivitas harian.";

  if (estimatedBust < 92) {
    recommendedSize = "S";
    matchScore = 96;
    adviceNotes = "Potongan jatuh rapi di bahu tanpa terasa kebesaran.";
  } else if (estimatedBust <= 99) {
    recommendedSize = "M";
    matchScore = 95;
    adviceNotes = "Proporsi lingkar dada dan panjang baju sangat ideal untuk postur tubuh Anda.";
  } else if (estimatedBust <= 108) {
    recommendedSize = "L";
    matchScore = 94;
    adviceNotes = "Memberikan ruang gerak syar'i yang anggun dan tidak menjiplak bentuk tubuh.";
  } else if (estimatedBust <= 118) {
    recommendedSize = "XL";
    matchScore = 93;
    adviceNotes = "Sangat leluasa, panjang lengan dan lingkar ketiak nyaman untuk wudhu.";
  } else {
    recommendedSize = "XXL";
    matchScore = 92;
    adviceNotes = "Oversized loose fit yang menutup aurat dengan sempurna dan sejuk.";
  }

  const handleApply = () => {
    onSelectSize(recommendedSize);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-100 relative animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 fill-purple-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">AI Smart Size & Fit</h3>
              <p className="text-[11px] text-zinc-500">Rekomendasi ukuran otomatis akurat 95%+</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-100 text-zinc-500 hover:text-zinc-800 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Reference */}
        <div className="mt-3.5 p-2.5 bg-zinc-50 rounded-lg flex items-center gap-3 border border-zinc-200/70">
          <div className="w-10 h-10 rounded bg-white overflow-hidden border border-zinc-200 shrink-0">
            <img
              src={product.imageUrl || `https://images.unsplash.com/photo-${1584917865442 + product.id * 1000}?auto=format&fit=crop&w=200&q=80`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-800 truncate">{product.name}</p>
            <p className="text-[10px] text-purple-700 font-medium">Kategori: {product.category}</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="mt-4 space-y-3.5 text-xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-zinc-700">Tinggi Badan:</span>
              <span className="font-bold text-purple-700 font-mono bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {heightCm} cm
              </span>
            </div>
            <input
              type="range"
              min={140}
              max={185}
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full accent-purple-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>140 cm</span>
              <span>160 cm</span>
              <span>185 cm</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-zinc-700">Berat Badan:</span>
              <span className="font-bold text-purple-700 font-mono bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {weightKg} kg
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={110}
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full accent-purple-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>40 kg</span>
              <span>65 kg</span>
              <span>110 kg</span>
            </div>
          </div>

          {/* Fit Preference */}
          <div>
            <span className="font-semibold text-zinc-700 block mb-1.5">Preferensi Kenyamanan Potongan:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFitPref("slim")}
                className={`py-1.5 px-2 rounded-lg border text-center font-medium cursor-pointer transition ${
                  fitPref === "slim"
                    ? "border-purple-700 bg-purple-50 text-purple-900 font-bold"
                    : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                Pas di Badan
              </button>
              <button
                type="button"
                onClick={() => setFitPref("regular")}
                className={`py-1.5 px-2 rounded-lg border text-center font-medium cursor-pointer transition ${
                  fitPref === "regular"
                    ? "border-purple-700 bg-purple-50 text-purple-900 font-bold"
                    : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                Regular Nyaman
              </button>
              <button
                type="button"
                onClick={() => setFitPref("loose")}
                className={`py-1.5 px-2 rounded-lg border text-center font-medium cursor-pointer transition ${
                  fitPref === "loose"
                    ? "border-purple-700 bg-purple-50 text-purple-900 font-bold"
                    : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                Loose / Syar'i
              </button>
            </div>
          </div>
        </div>

        {/* AI Result Card */}
        <div className="mt-4 p-3.5 bg-gradient-to-br from-purple-50 to-purple-100/60 rounded-xl border border-purple-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider">
              Rekomendasi AI Terbaik:
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" /> {matchScore}% Cocok
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-700 text-white flex items-center justify-center font-black text-xl shadow-xs">
              {recommendedSize}
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900">
                Ukuran {recommendedSize} (Estimasi LD ~{estimatedBust} cm)
              </p>
              <p className="text-[11px] text-zinc-600 mt-0.5 leading-snug">
                {adviceNotes}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-zinc-200 text-zinc-600 hover:bg-zinc-100 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition"
          >
            <span>Pilih Ukuran {recommendedSize}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
