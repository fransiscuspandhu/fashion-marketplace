import Link from "next/link";

interface FooterProps {
  onCategoryClick?: (categoryId: string) => void;
  onProfileClick?: () => void;
}

export default function Footer({ onCategoryClick, onProfileClick }: FooterProps) {
  return (
    <footer aria-label="Footer Situs & Navigasi SEO" className="bg-[#141416] text-zinc-400 text-xs pt-14 pb-10 px-4 mt-12 border-t border-zinc-800">
      <div className="max-w-[1320px] mx-auto space-y-10">

        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-zinc-800">
          
          {/* Col 1: Brand Info & Social Media Links */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#7C3AED] text-white font-bold flex items-center justify-center text-sm">R</div>
              <span className="text-white font-bold tracking-[0.22em] text-base">RAHAYU FASHION STORE</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-xs">
              <strong>Rahayu Fashion Store</strong> adalah destinasi belanja online busana muslim wanita modern, hijab voal ultrafine, pakaian kontemporer wanita, baju hamil ramah menyusui (<em>busui friendly</em>), serta pakaian anak dan bayi berkualitas di Indonesia.
            </p>
            <div className="text-[11px] text-zinc-400 space-y-1">
              <div>📍 <strong>Butik & Gudang Utama:</strong> Jakarta Selatan, DKI Jakarta, Indonesia</div>
              <div>💬 <strong>WhatsApp CS Resmi:</strong> <a href="https://wa.me/6281288997744" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#E879F9] underline">+62 812-8899-7744</a> (Senin–Minggu, 08:00–21:00 WIB)</div>
            </div>

            {/* Social Media Channels */}
            <div className="pt-2 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Ikuti Media Sosial Resmi Kami</div>
              <div className="flex flex-wrap items-center gap-2">
                <a href="https://www.tiktok.com/@rahayufashion.store" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-rose-600 text-white text-[11px] font-semibold transition border border-zinc-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>TikTok @rahayufashion.store</span>
                </a>
                <a href="https://www.instagram.com/rahayufashion.id" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-[#7C3AED] text-white text-[11px] font-semibold transition border border-zinc-700">
                  <span>📸 Instagram @rahayufashion.id</span>
                </a>
                <a href="https://www.youtube.com/@rahayufashion" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-red-600 text-white text-[11px] font-semibold transition border border-zinc-700">
                  <span>▶ YouTube Official</span>
                </a>
                <a href="https://www.facebook.com/rahayufashionstore" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-blue-600 text-white text-[11px] font-semibold transition border border-zinc-700">
                  <span>📘 Facebook Page</span>
                </a>
                <a href="https://id.pinterest.com/rahayufashion" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-amber-600 text-white text-[11px] font-semibold transition border border-zinc-700">
                  <span>📌 Pinterest</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: SEO Category Silo Part 1 */}
          <nav aria-label="Kategori Busana Muslim & Wanita" className="lg:col-span-3 space-y-2.5">
            <div className="text-white font-semibold uppercase tracking-widest text-[11px]">Koleksi Muslim & Wanita (SEO Silo)</div>
            <ul className="space-y-2 text-zinc-400">
              <li><button onClick={() => onCategoryClick?.('Hijab')} className="hover:text-white transition text-left">Jual Hijab Voal, Pashmina & Khimar</button></li>
              <li><button onClick={() => onCategoryClick?.('Atasan Muslim Wanita')} className="hover:text-white transition text-left">Atasan Muslim Wanita & Tunik Silk</button></li>
              <li><button onClick={() => onCategoryClick?.('Bawahan Muslim Wanita')} className="hover:text-white transition text-left">Bawahan Muslim Wanita, Rok Plisket & Kulot</button></li>
              <li><button onClick={() => onCategoryClick?.('Aksesoris Muslim')} className="hover:text-white transition text-left">Aksesoris Muslim, Bros & Scrunchie Hijab</button></li>
              <li><button onClick={() => onCategoryClick?.('Atasan')} className="hover:text-white transition text-left">Atasan Wanita, Kemeja Kerja & Blouse</button></li>
              <li><button onClick={() => onCategoryClick?.('Celana Panjang & Legging')} className="hover:text-white transition text-left">Celana Panjang Wanita & Legging Stretch</button></li>
            </ul>
          </nav>

          {/* Col 3: SEO Category Silo Part 2 */}
          <nav aria-label="Kategori Ibu Hamil, Anak & Akun" className="lg:col-span-3 space-y-2.5">
            <div className="text-white font-semibold uppercase tracking-widest text-[11px]">Koleksi Ibu, Anak & Akun Member</div>
            <ul className="space-y-2 text-zinc-400">
              <li><button onClick={() => onCategoryClick?.('Pakaian Wanita Lainnya')} className="hover:text-white transition text-left">Pakaian Wanita Lainnya, Dress & Outerwear</button></li>
              <li><button onClick={() => onCategoryClick?.('Pakaian Dalam')} className="hover:text-white transition text-left">Pakaian Dalam, Inner Ciput & Manset Bambu</button></li>
              <li><button onClick={() => onCategoryClick?.('Baju Hamil')} className="hover:text-white transition text-left">Baju Hamil Modern & Dress Menyusui (Busui)</button></li>
              <li><button onClick={() => onCategoryClick?.('Pakaian Anak Perempuan')} className="hover:text-white transition text-left">Pakaian Anak Perempuan & Gamis Anak</button></li>
              <li><button onClick={() => onCategoryClick?.('Pakaian Bayi')} className="hover:text-white transition text-left">Pakaian Bayi Katun Organik (0–24 Bulan)</button></li>
              <li><button onClick={() => onProfileClick?.()} className="text-[#E879F9] hover:underline font-semibold text-left">Akun Saya · Daftar Transaksi & Lacak Resi →</button></li>
            </ul>
          </nav>

          {/* Col 4: Payments & Couriers */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-white font-semibold uppercase tracking-widest text-[11px]">Pembayaran Resmi</div>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-zinc-300">
              <span className="px-2 py-1 bg-zinc-800 rounded">QRIS</span>
              <span className="px-2 py-1 bg-zinc-800 rounded">BCA VA</span>
              <span className="px-2 py-1 bg-zinc-800 rounded">MANDIRI</span>
              <span className="px-2 py-1 bg-zinc-800 rounded">BNI / BRI</span>
              <span className="px-2 py-1 bg-zinc-800 rounded">SHOPEEPAY</span>
              <span className="px-2 py-1 bg-zinc-800 rounded">VISA / MC</span>
            </div>
            <div className="text-white font-semibold uppercase tracking-widest text-[11px] pt-2">Mitra Pengiriman</div>
            <p className="text-[11px] text-zinc-400">JNE, SiCepat, J&T Express, GoSend/Grab Instant, & Pos Indonesia.</p>
          </div>
        </div>

        {/* Middle Long-tail SEO Keyword Paragraph */}
        <div className="bg-zinc-900/70 p-5 rounded-xl border border-zinc-800 space-y-2 text-[11px] text-zinc-400 leading-relaxed">
          <h2 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
            Belanja Fashion Muslim Wanita, Hijab & Baju Hamil Terbaru di Rahayu Fashion Store
          </h2>
          <p>
            Temukan pengalaman belanja fashion modern yang nyaman dan mudah di <strong>Rahayu Fashion Store</strong>. Setiap produk dilengkapi <strong>video singkat produk asli</strong> untuk melihat detail jatuhnya bahan, panduan ukuran lengkap yang dapat disesuaikan per kategori, serta penawaran spesial di sesi <strong>TikTok Live @rahayufashion.store</strong>. Tersedia lengkap 11 kategori: <em>Hijab, Atasan Muslim Wanita, Bawahan Muslim Wanita, Aksesoris Muslim, Atasan, Celana Panjang & Legging, Pakaian Wanita Lainnya, Pakaian Dalam, Baju Hamil, Pakaian Anak Perempuan,</em> dan <em>Pakaian Bayi</em>.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>© 2026 <strong>Rahayu Fashion Store</strong>. Hak Cipta Dilindungi.</div>
          <div className="flex items-center gap-4">
            <span>Sitemap XML Ready</span>
            <span>·</span>
            <span>Schema.org Product JSON-LD Active</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
