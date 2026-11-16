# Rahayu Fashion Store — Marketplace & Internal Control Panel

Platform e-commerce marketplace busana muslim wanita, pakaian anak, dan baju hamil modern untuk brand **Rahayu Fashion Store**. Sistem ini mengintegrasikan **Customer Webfront (Hijup.com Editorial Vibe)**, **Alur Belanja & Checkout Standar Tokopedia**, serta **Internal Admin Portal Terisolasi (9 Modul Operasional + RBAC Multi-Role + Studio Foto AI & Server-Side Upload Engine)**, dengan arsitektur siap sambung ke **Mobile Apps (iOS & Android)**.

---

## 1. Tech Stack

| Layer | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend Web** | [Next.js 16 (App Router)](https://nextjs.org) + [React 19](https://react.dev) | Server-side rendering (SSR), Incremental Static Regeneration (ISR), & SEO Metadata |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) | Modern styling engine dengan utility-first tokens |
| **Icons & UI** | [Lucide React](https://lucide.dev) | Paket ikon antarmuka e-commerce |
| **Database & ORM** | [Prisma 5+](https://www.prisma.io) + PostgreSQL / SQLite | Database schema multi-kategori, varian, pesanan, payment config, dan log AI |
| **State & Auth** | React Context (`StoreContext`) | Dual-session management terpisah (Customer Session & Admin RBAC Session) |
| **Media & Storage** | Local Uploads (`/api/upload`) & [Cloudflare R2](https://developers.cloudflare.com/r2/) | Upload foto produk server-side (JPG/PNG/WebP maks 10MB) + video short PDP (9:16) |
| **Payment Gateway** | Midtrans / Xendit Ready | QRIS Instant, Virtual Account Bank (BCA, Mandiri, BRI), Kartu Kredit, dan COD |
| **Mobile App (Add-on)** | [React Native](https://reactnative.dev) + [Expo SDK 52](https://expo.dev) | Mobile application cross-platform (iOS & Android) |

---

## 2. Fitur Utama & Pemisahan Akses (Frontstore vs Admin)

### A. Customer Webfront (Publik & Pelanggan)
* **Editorial Aesthetic (Hijup Style):** Tampilan mewah minimalis, banner kurasi editorial, typography clean, dan navigasi mega menu 11 kategori.
* **Katalog & PDP Interaktif:** Filter harga, pencarian realtime, modal detail produk, video short 9:16 ala TikTok Shop, panduan ukuran (Size Guide), dan rekomendasi padanan AI Stylist.
* **Alur Belanja Standard Tokopedia:** Shopping bag drawer, pemilihan varian warna/ukuran dinamis, kalkulator ongkir otomatis (JNE, SiCepat, J&T), pemilihan metode pembayaran (QRIS, VA Bank, CC, COD), dan sistem voucher promo.
* **Customer Auth & Profil:** Halaman login pelanggan mandiri (`/login`) dengan 1-click fast demo, pelacakan status pesanan real-time dengan nomor resi kurir (AWB), serta manajemen buku alamat.

### B. Internal Admin Portal (Terisolasi dengan RBAC Multi-Role)
* **Portal Login Terpisah (`/admin/login`):** Tampilan enterprise dark mode yang terpisah secara tegas dari login pelanggan, dilengkapi security badges, enterprise form, dan 1-click role demo accounts.
* **Role-Based Access Control (RBAC 5 Peran):**
  1. 👑 **Super Admin (Owner):** Akses penuh tanpa batas ke 9 modul, finansial, dan switchboard sistem.
  2. 👗 **Product & Merchandiser:** Manajemen produk, upload foto studio AI, copywriting asisten, kategori, dan flash sale.
  3. 📦 **Order Fulfillment (Gudang):** Manajemen antrean order, input resi pengiriman (AWB), dan stok inventori.
  4. 📢 **Marketing & Live Streamer:** Pengaturan jadwal TikTok Live, flash sale countdown, promo banner, dan CMS layout.
  5. 💳 **Finance & Operations:** Rekonsiliasi transaksi pesanan dan konfigurasi fee gateway pembayaran.
* **Route Protection:** Rute `/admin` dilindungi secara ketat. Akses tanpa login akan dialihkan otomatis ke `/admin/login`, dan staf yang mencoba membuka modul di luar wewenangnya akan menerima dialog hak akses terkunci (Locked Module Notice).
* **Role Switcher Modal:** Fasilitas demo instan untuk beralih peran antar-staf secara live tanpa perlu logout manual.
* **Studio Foto & Server Upload (`/api/upload`):** Upload foto katalog asli dari komputer lokal dengan preview instan, drag-and-drop, validasi MIME type, auto-sanitize nama berkas, dan auto-inject ke form katalog produk.

### C. Strategi Dual-Build & Demo Connector Switchboard
* **Produksi (Strict Isolation):** Webstore pelanggan (`www.rahayufashion.id`) dan Admin Portal (`ops.rahayufashion.id`) dapat dibuild secara terpisah atau dipisah via domain middleware sehingga bundle publik bersih 0 KB dari kode admin.
* **Demo Connector Toggle (`NEXT_PUBLIC_SHOW_DEMO_CONNECTOR`):**
  * `NEXT_PUBLIC_SHOW_DEMO_CONNECTOR="true"` (Default / Staging): Menampilkan tautan connector dan status peran staf pada header untuk kemudahan testing.
  * `NEXT_PUBLIC_SHOW_DEMO_CONNECTOR="false"` (Produksi): Menghapus seluruh tombol, banner, dan tautan akses admin internal dari DOM webstore pelanggan secara menyeluruh.

---

## 3. Struktur Direktori Project

```text
fashion-marketplace/
├── docs/
│   └── WORK_PLAN.md            # Master roadmap 6-phase, arsitektur dual-build, estimasi server & AI cost
├── packages/
│   └── shared/
│       └── categories.ts       # Taksonomi resmi 11 kategori & interface TypeScript
├── prisma/
│   └── schema.prisma           # Skema database relasional (User, Category, Product, Order, AdminUser, dll.)
├── public/
│   ├── logo-rahayu.png         # Logo resmi Rahayu Fashion Store
│   ├── uploads/                # Direktori server-side upload foto produk (gitignored)
│   └── ...                     # Static image assets & SVG icons
├── src/
│   ├── app/
│   │   ├── page.tsx            # Beranda Storefront (Hijup style, curated sections, TikTok live showcase)
│   │   ├── products/page.tsx   # Dedicated Catalog Page (Category tabs, search query, price filter, sorting)
│   │   ├── login/page.tsx      # Customer Auth Gate (Login/Register pelanggan & 1-Click Fast Demo)
│   │   ├── checkout/page.tsx   # Checkout Stepper Tokopedia (Alamat, Kurir, Payment, Voucher)
│   │   ├── profile/page.tsx    # Profil Pelanggan (Tab Pesanan, Lacak Resi AWB Live, Alamat)
│   │   ├── admin/
│   │   │   ├── page.tsx        # Internal Admin Control Panel (9 Modul Operasional, RBAC Gate, Modals)
│   │   │   └── login/page.tsx  # Dedicated Dark Enterprise Login Portal untuk Staf Internal & Gudang
│   │   ├── api/
│   │   │   └── upload/route.ts # Server-side image upload handler (Multipart formdata, sanitize, disk storage)
│   │   ├── globals.css         # Styling global Tailwind CSS 4
│   │   └── layout.tsx          # Root Layout + StoreProvider + CartDrawer + Schema.org + Hydration Safety
│   ├── components/
│   │   ├── HeaderNavbar.tsx    # Editorial Navbar, Mega Menu 11 Kategori, Dropdown Profil, Demo Connector
│   │   ├── ImageUploader.tsx   # Komponen Drag-and-drop server file upload dengan preview & progress bar
│   │   ├── CartDrawer.tsx      # Quick Shopping Bag Drawer (+/- quantity, subtotal, checkout CTA)
│   │   └── Footer.tsx          # Footer SEO semantik, Category Silos, Social Media
│   ├── context/
│   │   └── StoreContext.tsx    # Global State Store (Dual-auth RBAC, Cart, Orders, Categories, Gateway, AI)
│   └── data/
│       └── mock-data.ts        # Seed data 11 kategori, produk lookbook, dan preset warna/ukuran
├── next.config.ts              # Konfigurasi Next.js (Image remote patterns & optimasi build)
├── package.json                # Dependencies & scripts project
├── tsconfig.json               # Konfigurasi TypeScript compiler
└── README.md                   # Dokumentasi teknis utama repositori
```

---

## 4. Taksonomi 11 Kategori Resmi Produk

Sistem mendukung 11 kategori resmi yang dibagi menjadi 3 pilar utama:

* **Pilar 1: Modest & Muslimah Wear**
  1. `Hijab` (`/c/hijab`) — Voal Ultrafine, Pashmina Silk, Syari (Laser Cut / Jahit Tepi).
  2. `Atasan Muslim Wanita` (`/c/atasan-muslim-wanita`) — Tunik Silk, Modest Blouse (Akses Busui & Wudhu).
  3. `Bawahan Muslim Wanita` (`/c/bawahan-muslim-wanita`) — Rok Plisket, Kulot Linen A-Line.
  4. `Aksesoris Muslim` (`/c/aksesoris-muslim`) — Bros Hijab Rose Gold, Ciput Rajut Anti Pusing.
* **Pilar 2: Baju Hamil & Busana Wanita Modern**
  5. `Baju Hamil` (`/c/baju-hamil`) — Maternity Dress, Tunik Hamil Kancing Depan Busui.
  6. `Celana Panjang & Legging` (`/c/celana-panjang-legging`) — Legging Hamil High-Waist Support, Ankle Pants.
  7. `Atasan` (`/c/atasan`) — Casual Blouse, Knit Top Wanita.
  8. `Pakaian Dalam` (`/c/pakaian-dalam`) — Bra Menyusui Seamless, Panty Katun Lembut.
  9. `Pakaian Wanita Lainnya` (`/c/pakaian-wanita-lainnya`) — Outerwear, Kimono Cardigan.
* **Pilar 3: Koleksi Bayi & Anak**
  10. `Pakaian Bayi` (`/c/pakaian-bayi`) — Jumper Bayi Organic Cotton, Sleepsuit.
  11. `Pakaian Anak Perempuan` (`/c/pakaian-anak-perempuan`) — Gamis Anak Katun Jepang, Dress Ruffle.

---

## 5. Rute Navigasi & Hak Akses Aplikasi

| URL Path | Akses | Role / Otoritas | Fungsi & Antarmuka |
| :--- | :---: | :---: | :--- |
| `/` | Publik | Semua Pengunjung | Beranda Storefront (Hero banner, Portal Kategori, Produk Terbaru & Terlaris, TikTok Live) |
| `/products` | Publik | Semua Pengunjung | Halaman Katalog Produk (Filter Kategori Dinamis, Pencarian, Rentang Harga, PDP Modal) |
| `/login` | Publik | Calon Pembeli | Auth Gate Pelanggan (Masuk/Daftar belanja dengan 1-Click Fast Demo) |
| `/checkout` | Pelanggan | Customer Terautentikasi | Alur Checkout Tokopedia (Alamat, Kurir JNE/SiCepat, Payment Gateway, Voucher) |
| `/profile` | Pelanggan | Customer Terautentikasi | Profil Pelanggan (Tab Pesanan, **Lacak Resi Kurir Real-Time**, Alamat, Wishlist) |
| `/admin/login` | Internal | Staff / Gudang / Admin | Dedicated Dark Enterprise Portal (Security badges, 1-Click Role Login) |
| `/admin` | Terproteksi | 5 Role Staf Internal | Internal Control Panel (9 Modul Operasional dengan Permission Matrix & Locked Alert) |
| `/api/upload` | Internal | API Endpoint | Handler Server-side Upload Foto Produk (Maks 10MB, JPG/PNG/WebP) |

---

## 6. Akun Uji Coba Demo (Demo Accounts)

Untuk mempermudah review dan pengujian sistem, tersedia akun demo instan 1-click di masing-masing portal login:

### A. Akun Pelanggan (`/login`):
* **Email:** `siti.rahmawati@gmail.com`
* **Nama:** Siti Rahmawati (Gold Member)

### B. Akun Staf Admin Internal (`/admin/login`):
| Peran (Role) | Nama Akun | Email Default | Modul yang Dapat Diakses |
| :--- | :--- | :--- | :--- |
| **Super Admin (Owner)** | Hj. Rahayu Kusuma | `owner@rahayufashion.id` | Seluruh 9 Modul Sistem |
| **Product & Merchandiser** | Dewi Lestari | `merchandiser@rahayufashion.id` | Analytics, Kategori, Produk, Promo, Studio AI |
| **Order Fulfillment (Gudang)** | Budi Santoso | `gudang@rahayufashion.id` | Analytics, Produk (Stok), Pesanan (Resi AWB) |
| **Marketing & Live Streamer** | Annisa Putri | `marketing@rahayufashion.id` | Analytics, Promo Flash Sale, CMS Banner, Layout |
| **Finance & Operations** | Hendra Wijaya | `finance@rahayufashion.id` | Analytics, Pesanan, Payment Gateway Config |

---

## 7. Cara Menjalankan & Membangun Project (How to Build & Run)

### Prasyarat Sistem
* [Node.js](https://nodejs.org/) versi `20.x` atau lebih baru (`Node.js 22/24 LTS` direkomendasikan).
* Package manager `npm` (atau `pnpm` / `yarn`).
* Database PostgreSQL (opsional untuk dev lokal, skema Prisma sudah kompatibel).

### Langkah-langkah Instalasi:

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/fransiscuspandhu/fashion-marketplace.git
   cd fashion-marketplace
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**:
   Salin berkas `.env.example` ke `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *Atur `NEXT_PUBLIC_SHOW_DEMO_CONNECTOR="false"` saat ingin menguji isolasi penuh admin di production.*

4. **Inisialisasi Database (Prisma)**:
   ```bash
   npx prisma generate
   # Opsional: sinkronkan skema ke database
   npx prisma db push
   ```

5. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Buka peramban di `http://localhost:3000`.

6. **Membangun untuk Production (Production Build)**:
   ```bash
   npm run build
   npm run start
   ```

---

## 8. Dokumentasi Internal & Roadmap

Rincian proses pengerjaan bertahap (Phase 1–6), estimasi biaya server bulanan (OPEX Rp 500rb–1jt/bln), arsitektur dual-build subdomain, serta kalkulasi photoshoot AI didokumentasikan di:

👉 **[docs/WORK_PLAN.md](./docs/WORK_PLAN.md)**

---

**Hak Cipta © 2026 Rahayu Fashion Store. All Rights Reserved.**
