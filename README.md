# Rahayu Fashion Store — Marketplace, Control Panel & Mobile App

Repository resmi untuk pembangunan sistem **Rahayu Fashion Store** (Web Storefront, Internal Control Panel + AI Product Photo Studio, dan Mobile App iOS/Android).

## 1. Kategori Resmi Produk (11 Kategori)
1. **Celana Panjang & Legging** (`/c/celana-panjang-legging`)
2. **Pakaian Anak Perempuan** (`/c/pakaian-anak-perempuan`)
3. **Bawahan Muslim Wanita** (`/c/bawahan-muslim-wanita`)
4. **Pakaian Dalam** (`/c/pakaian-dalam`)
5. **Aksesoris Muslim** (`/c/aksesoris-muslim`)
6. **Hijab** (`/c/hijab`)
7. **Atasan Muslim Wanita** (`/c/atasan-muslim-wanita`)
8. **Pakaian Bayi** (`/c/pakaian-bayi`)
9. **Pakaian Wanita Lainnya** (`/c/pakaian-wanita-lainnya`)
10. **Baju Hamil** (`/c/baju-hamil`)
11. **Atasan** (`/c/atasan`)

## 2. Struktur File & Routes (Phase 1 & Phase 2)
- [`src/app/page.tsx`](./src/app/page.tsx) — Storefront editorial ala *Hijup.com*: circular category portraits, 3:4 portrait lookbook cards, TikTok Live modal drawer, PDP modal dengan 9:16 short product video player.
- [`src/app/login/page.tsx`](./src/app/login/page.tsx) — Auth Gate Pelanggan (Login & Register, 1-Click Fast Demo Credentials, redirect handling).
- [`src/app/checkout/page.tsx`](./src/app/checkout/page.tsx) — Alur Checkout Tokopedia: Pemilihan alamat pengiriman, ringkasan produk, kurir pengiriman (JNE, SiCepat, J&T, AnterAja), payment gateway terhubung dengan Admin, asuransi, dan voucher promo.
- [`src/app/profile/page.tsx`](./src/app/profile/page.tsx) — Dashboard Pelanggan: Tab transaksi (`Semua`, `Menunggu Pembayaran`, `Dikemas`, `Dikirim`, `Selesai`), Pelacakan Resi (AWB) real-time dengan timeline kurir, manajemen daftar alamat, dan pengaturan profil.
- [`src/app/admin/page.tsx`](./src/app/admin/page.tsx) — Internal Control Panel lengkap dengan 8 modul operasional:
  1. *Dashboard & Analisa Penjualan* (Omset, pesanan masuk, AOV, konversi TikTok Live).
  2. *Kategori & Ukuran Dinamis* (Pengaturan preset ukuran S/M/L, cm, All Size per kategori yang tersinkronisasi ke PDP).
  3. *Katalog & Video Singkat* (Manajemen produk, varian, dan link video 9:16).
  4. *Pesanan & No. Resi Kurir* (Status updater & input nomor resi pengiriman AWB).
  5. *Payment Gateway* (Toggle aktivasi QRIS, Virtual Account BCA/Mandiri/BRI, Kartu Kredit, COD, serta biaya admin).
  6. *Promo & Highlight Badges* (Voucher diskon, gratis ongkir, dan timer flash sale).
  7. *Studio Foto AI* (Generator foto produk on-model AI dengan kalkulator biaya ~Rp 500/foto).
  8. *SEO CMS & TikTok Live* (Pengaturan meta title, Schema.org ClothingStore, dan status broadcast siaran langsung).
- [`src/context/StoreContext.tsx`](./src/context/StoreContext.tsx) — State Management terpusat untuk sinkronisasi Cart, User Auth, Orders, Categories, dan Payment Gateways antar halaman.
- [`prisma/schema.prisma`](./prisma/schema.prisma) — Skema database PostgreSQL/Prisma v4.0.
- [`packages/shared/categories.ts`](./packages/shared/categories.ts) — Taksonomi 11 kategori resmi.

