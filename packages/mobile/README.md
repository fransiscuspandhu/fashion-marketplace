# Rahayu Fashion Store — Mobile Application (React Native Expo SDK 52)

Aplikasi mobile resmi untuk brand **Rahayu Fashion Store** yang dibangun menggunakan **React Native** dan **Expo SDK 52**, berbagi model data dan API backend dengan Next.js App Router.

---

## 📱 Fitur Utama Mobile App

1. **Beranda Editorial (Hijup Style):**
   * Banner hero editorial dengan kurasi koleksi Raya & Modest 2026.
   * Indikator siaran langsung TikTok Shop (@rahayufashion.store).
   * 11 Kategori resmi dalam scroll card horizontal.
   * Promo Highlight gajian dengan hitung mundur (countdown).
   * Katalog produk terlaris dengan rating dan ulasan.

2. **Katalog & Pencarian Real-Time:**
   * Tab filter kategori horizontal.
   * Kotak pencarian instan untuk hijab, tunik, gamis, legging, dsb.
   * Tampilan grid 2 kolom dengan badge promo dan status stok.

3. **Keranjang Belanja & Checkout Tokopedia:**
   * Manajemen kuantitas produk (+/-).
   * Penerapan otomatis voucher diskon (`RAHAYUPAYDAY`).
   * Rincian tagihan (subtotal, estimasi ongkir JNE/SiCepat, diskon voucher, total tagihan).
   * Tombol checkout mengambang (sticky bottom bar).

4. **Akun & Pelacakan Resi Kurir Real-Time (Tokopedia Vibe):**
   * Kartu profil pelanggan (Siti Rahmawati - Gold Member, 1.250 Poin).
   * Tab status pesanan (*Semua*, *Dalam Pengiriman*, *Sedang Dikemas*).
   * **Informasi Nomor Resi Kurir (AWB)** dengan status perjalanan paket real-time dari PostgreSQL database.

---

## 🛠️ Cara Menjalankan Aplikasi Mobile

### 1. Masuk ke Direktori Mobile:
```bash
cd packages/mobile
```

### 2. Install Dependencies:
```bash
npm install
```

### 3. Jalankan Development Server Expo:
```bash
npx expo start
```

* **Di Ponsel Nyata:** Pindai kode QR yang muncul di terminal menggunakan aplikasi **Expo Go** (tersedia di Google Play Store & Apple App Store).
* **Di Emulator Android:** Tekan tombol `a` di terminal.
* **Di Simulator iOS (macOS):** Tekan tombol `i` di terminal.
* **Di Web Browser:** Tekan tombol `w` di terminal.

---

## 🌐 Koneksi ke API Backend

Aplikasi mobile terhubung langsung ke API Next.js yang berjalan di `http://localhost:3000/api` (atau URL domain produksi `https://api.rahayufashion.co.id`):
* `GET /api/products`: Katalog produk lookbook & stok live.
* `GET /api/categories`: 11 Kategori resmi dan ukuran dinamis.
* `GET /api/orders`: Riwayat pesanan dan status pelacakan resi AWB.
