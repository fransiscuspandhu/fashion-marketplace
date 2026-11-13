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

## 2. Struktur File Phase 1
- [`prisma/schema.prisma`](./prisma/schema.prisma) — Skema database PostgreSQL yang mendukung 11 kategori, varian ukuran/warna, tautan video singkat produk, status TikTok Live, pengaturan promo & badge, serta log penggunaan AI Product Photo Generator.
- [`packages/shared/categories.ts`](./packages/shared/categories.ts) — Definisi tipe data & taksonomi 11 kategori siap multi-bahasa (`ID` & `EN`).
