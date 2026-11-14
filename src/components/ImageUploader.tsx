"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon, CheckCircle2, Link as LinkIcon } from "lucide-react";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  hint?: string;
  badgeStandard?: string;
  aspectRatioNotice?: string;
  previewHeight?: string;
  compact?: boolean;
}

export default function ImageUploader({
  value,
  onChange,
  label,
  helperText,
  hint,
  badgeStandard,
  aspectRatioNotice,
  previewHeight = "h-36",
  compact = false,
}: ImageUploaderProps) {
  const effectiveHelper = helperText || hint;
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Ukuran file terlalu besar (maksimal 5 MB).");
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengunggah gambar ke server");
      }

      onChange(data.url);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Terjadi kesalahan saat upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-1.5 text-xs">
      {(label || badgeStandard) && (
        <div className="flex items-center justify-between gap-2">
          {label && <label className="block font-semibold text-zinc-800">{label}</label>}
          {badgeStandard && (
            <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              {badgeStandard}
            </span>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview or Upload Zone */}
      {value ? (
        <div className="relative border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50 group">
          <div className={`${previewHeight} w-full flex items-center justify-center bg-zinc-900/5`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://placehold.co/400x300/f4f4f5/71717a?text=Preview+Gambar";
              }}
            />
          </div>

          <div className="p-2.5 bg-white border-t border-zinc-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-mono text-[10px] text-zinc-600 truncate" title={value}>
                {value.startsWith("/uploads/") ? `Server: ${value}` : value}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold rounded text-[11px] cursor-pointer flex items-center gap-1"
              >
                {isUploading ? (
                  <Loader2 className="w-3 h-3 animate-spin text-purple-700" />
                ) : (
                  <Upload className="w-3 h-3 text-zinc-600" />
                )}
                <span>Ganti</span>
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                title="Hapus gambar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-zinc-300 hover:border-purple-600 rounded-lg p-4 text-center cursor-pointer bg-zinc-50/50 hover:bg-purple-50/20 transition-all ${
            compact ? "py-3" : "py-6"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <Loader2 className="w-6 h-6 text-purple-700 animate-spin" />
              <p className="text-xs font-semibold text-zinc-700">Mengunggah ke server...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1.5">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                <Upload className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-zinc-800">
                Pilih File dari Komputer / Upload Foto
              </div>
              <p className="text-[11px] text-zinc-500">
                Disimpan langsung di server lokal ({badgeStandard || "PNG, JPG, WebP"})
              </p>
            </div>
          )}
        </div>
      )}

      {/* Manual URL toggle if needed */}
      <div className="flex items-center justify-between pt-0.5 text-[10px]">
        {effectiveHelper ? (
          <span className="text-zinc-500">{effectiveHelper}</span>
        ) : (
          <span className="text-zinc-400">{aspectRatioNotice || "File tersimpan di /public/uploads"}</span>
        )}

        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-purple-700 hover:underline flex items-center gap-1 cursor-pointer font-medium"
        >
          <LinkIcon className="w-2.5 h-2.5" />
          <span>{showManualInput ? "Tutup input URL" : "Atau masukkan URL gambar"}</span>
        </button>
      </div>

      {showManualInput && (
        <div className="pt-1">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... atau /uploads/..."
            className="w-full px-2.5 py-1.5 border border-zinc-300 rounded text-xs font-mono bg-white focus:outline-none focus:border-purple-700"
          />
        </div>
      )}

      {errorMessage && (
        <p className="text-[11px] text-rose-600 font-medium">{errorMessage}</p>
      )}
    </div>
  );
}
