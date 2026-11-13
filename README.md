# Rahayu Fashion Store — Marketplace & Internal Control Panel

Platform e-commerce marketplace busana muslim wanita, pakaian anak, dan baju hamil modern untuk brand **Rahayu Fashion Store**. Sistem ini mencakup **Web Storefront (Hijup.com Editorial Vibe)**, **Alur Belanja Standard Tokopedia**, **Internal Control Panel (8 Modul Operasional + AI Product Photo Studio)**, serta arsitektur yang siap dihubungkan ke **Mobile Apps (iOS & Android)**.

---

## 1. Tech Stack

| Layer | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend Web** | [Next.js 16 (App Router)](https://nextjs.org) + [React 19](https://react.dev) | Server-side rendering (SSR), Incremental Static Regeneration (ISR), & SEO Metadata |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) | Modern styling engine dengan utility-first tokens |
| **Icons & UI** | [Lucide React](https://lucide.dev) | Paket ikon antarmuka e-commerce |
| **Database & ORM** | [Prisma 5+](https://www.prisma.io) + PostgreSQL / SQLite | Database schema multi-kategori, varian, pesanan, payment config, dan log AI |
| **State Management** | React Context (`StoreContext`) | Sinkronisasi reactive state antarmuka Frontstore, Checkout, Profil, dan Admin |
| **Media & Storage** | [Cloudflare R2](https://developers.cloudflare.com/r2/) | Penyimpanan short video PDP (9:16) & foto katalog dengan **Rp 0 Egress Bandwidth** |
| **Payment Gateway** | Midtrans / Xendit Ready | QRIS Instant, Virtual Account Bank (BCA, Mandiri, BRI), Kartu Kredit, dan COD |
| **Mobile App (Add-on)** | [React Native](https://reactnative.dev) + [Expo SDK 52](https://expo.dev) | Mobile application cross-platform (iOS & Android) |

---

## 2. Struktur Direktori Project

```text
fashion-marketplace/
├── docs/
│   └── WORK_PLAN.md            # Master roadmap 6-phase, estimasi server & AI cost, arsitektur teknis
├── packages/
│   └── shared/
│       └── categories.ts       # Taksonomi resmi 11 kategori & interface TypeScript
├── prisma/
│   └── schema.prisma           # Skema database relasional (User, Category, Product, Order, dll.)
├── public/
│   ├── logo-rahayu.png         # Logo resmi Rahayu Fashion Store
│   └── ...                     # Static image assets & SVG icons
├── src/
│   ├── app/
│   │   ├── page.tsx            # Beranda Storefront (Hijup style, lookbook 3:4, video PDP, TikTok live)
│   │   ├── login/page.tsx      # Customer Auth Gate (Login/Register, 1-Click Fast Demo)
│   │   ├── checkout/page.tsx   # Checkout Stepper Tokopedia (Alamat, Kurir, Payment, Voucher)
│   │   ├── profile/page.tsx    # Profil Pelanggan (Tab Pesanan, Lacak Resi AWB Live, Alamat)
│   │   ├── admin/page.tsx      # Internal Admin Control Panel (8 Modul Lengkap)
│   │   ├── globals.css         # Styling global Tailwind CSS 4
│   │   └── layout.tsx          # Root Layout + StoreProvider + CartDrawer + Schema.org
│   ├── components/
│   │   ├── HeaderNavbar.tsx    # Editorial Navbar, Mega Menu 11 Kategori, Dropdown Profil
│   │   ├── CartDrawer.tsx      # Quick Shopping Bag Drawer (+/- quantity, subtotal, checkout CTA)
│   │   └── Footer.tsx          # Footer SEO semantik, Category Silos, Social Media
│   ├── context/
│   │   └── StoreContext.tsx    # Global State Store (Auth, Cart, Orders, Categories, Gateway, AI)
│   └── data/
│       └── mock-data.ts        # Seed data 11 kategori, produk lookbook, dan preset warna/ukuran
├── next.config.ts              # Konfigurasi Next.js (Image remote patterns & optimasi build)
├── package.json                # Dependencies & scripts project
├── tsconfig.json               # Konfigurasi TypeScript compiler
└── README.md                   # Dokumentasi teknis utama repositori
```

---

## 3. Taksonomi 11 Kategori Resmi Produk

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

## 4. Cara Menjalankan & Membangun Project (How to Build & Run)

### Prasyarat Sistem
* [Node.js](https://nodejs.org/) versi `20.x` atau lebih baru (`Node.js 22 LTS` direkomendasikan).
* Package manager `npm` (atau `pnpm` / `yarn`).
* Database PostgreSQL (opsional untuk dev lokal, dapat menggunakan SQLite).

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
   Salin berkas `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```

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

## 5. Rute Navigasi Aplikasi

| URL Path | Akses | Fungsi & Antarmuka |
| :--- | :---: | :--- |
| `/` | Publik | Beranda Frontstore (Layout Hijup, Koleksi 11 Kategori, PDP Video 9:16, TikTok Live) |
| `/login` | Publik | Auth Gate (Masuk & Daftar Pelanggan dengan tombol 1-Click Fast Demo) |
| `/checkout` | Pelanggan | Alur Checkout Tokopedia (Alamat, Kurir JNE/SiCepat, Payment Gateway, Voucher) |
| `/profile` | Pelanggan | Profil Pelanggan (Tab Pesanan, **Lacak Resi Kurir Real-Time**, Alamat, Wishlist) |
| `/admin` | Internal | Internal Control Panel (8 Modul Operasional, Analisa Penjualan & Studio Foto AI) |

---

## 6. Dokumentasi Internal & Roadmap

Rincian proses pengerjaan bertahap, arsitektur server bulanan (OPEX Rp 500rb–1jt/bln), estimasi biaya photoshoot AI (~Rp 500/foto), dan timeline single engineer didokumentasikan secara terpisah di:

👉 **[docs/WORK_PLAN.md](./docs/WORK_PLAN.md)**

---

**Hak Cipta © 2026 Rahayu Fashion Store. All Rights Reserved.**
