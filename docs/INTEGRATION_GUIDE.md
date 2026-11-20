# Panduan Resmi Integrasi API & Konfigurasi Kunci Lingkungan (Phase 4 Integration Guide)

Dokumen ini memuat panduan langkah-demi-langkah bagi pengembang, pemilik toko (*owner*), dan tim teknis untuk mengonfigurasi seluruh integrasi API pihak ketiga di **Rahayu Fashion Store** (Phase 4):
1. **AI Model Photoshoot & Virtual Try-On** (`fal.ai` / `Replicate` / `Google Imagen`)
2. **AI Virtual Stylist & Auto-Copywriter SEO** (`Google Gemini API` / `OpenAI`)
3. **Payment Gateway Otomatis QRIS & Virtual Account** (`Midtrans Snap` / `Xendit`)
4. **Konektor Statistik Siaran TikTok Live** (`@rahayufashion.store`)
5. **Cloudflare R2 Object Storage** (Penyimpanan Video Vertikal 9:16 & Foto Rp 0 Egress)

---

## 1. Matriks Rangkuman API Key & Kebutuhan `.env`

| Variabel Lingkungan | Layanan / Provider | Tautan Dashboard Pendaftaran | Fungsi di Aplikasi | Estimasi Biaya |
| :--- | :--- | :--- | :--- | :---: |
| `GEMINI_API_KEY` | **Google Gemini** | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) | Chatbot Virtual Stylist di beranda & Auto-Copywriting SEO di admin | **Gratis** *(Free Tier 15 RPM)* |
| `FAL_KEY` | **fal.ai** | [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys) | Generator Foto Model AI Virtual Try-On dari baju flatlay/manekin | ~Rp 500 / foto render |
| `REPLICATE_API_TOKEN` | **Replicate** | [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens) | Alternatif Virtual Try-On (`IDM-VTON` / `Flux Schnell`) | ~Rp 450 / foto render |
| `OPENAI_API_KEY` | **OpenAI** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | Alternatif LLM (GPT-4o-mini) & DALL-E 3 | Sesuai penggunaan token |
| `MIDTRANS_SERVER_KEY`<br>`MIDTRANS_CLIENT_KEY` | **Midtrans Snap** | [dashboard.midtrans.com](https://dashboard.midtrans.com) | Checkout QRIS Dinamis & Virtual Account bank (BCA, Mandiri, BRI, BNI) | 0.7% QRIS / Rp 4.000 VA per transaksi sukses |
| `TIKTOK_USERNAME` | **TikTok Live** | [tiktok.com](https://www.tiktok.com) | Banner notifikasi status siaran live streaming & jumlah penonton | **Gratis** |
| `R2_ACCESS_KEY_ID`<br>`R2_SECRET_ACCESS_KEY` | **Cloudflare R2** | [dash.cloudflare.com](https://dash.cloudflare.com) | Penyimpanan video PDP 9:16 & foto katalog bebas biaya kuota download | **Gratis 10 GB** (Rp 0 Egress) |

> [!NOTE]
> Seluruh endpoint API telah dilengkapi **Fallback Mode / Sandbox Simulator**. Jika API key belum dipasang, sistem tetap berjalan lancar tanpa error dan menampilkan notifikasi ramah bahwa sistem sedang dalam mode simulasi.

---

## 2. Setup AI Pipeline: Model Photoshoot & Virtual Try-On

Fitur ini berada di formulir tambah/edit produk admin ([`/admin`](file:///home/antigravity/fransiscuspandhu/fashion-marketplace/src/app/admin)) pada tab **`✨ Buat dengan AI`**.

### Pilihan A: Menggunakan fal.ai (Sangat Direkomendasikan)
1. Buka [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys) dan login/daftar menggunakan akun GitHub atau Google.
2. Klik tombol **"Add Key"**, beri nama `rahayu-photoshoot`, lalu salin kunci API (`Key ...`).
3. Tambahkan ke file `.env` di server:
   ```env
   FAL_KEY="f4l_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```
4. **Cara Kerja Mesin:** Saat admin mengunggah foto pakaian mentah (*flatlay*), endpoint backend `/api/ai/photoshoot` akan memproses segmentasi pakaian (`BiRefNet`) dan memakaikannya ke model virtual modest hijab Indonesia dengan pencahayaan studio mewah.

### Pilihan B: Menggunakan Replicate (Alternatif)
1. Daftar di [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens).
2. Salin token API yang berawalan `r8_...`.
3. Tambahkan ke `.env`:
   ```env
   REPLICATE_API_TOKEN="r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```

---

## 3. Setup AI Pipeline: Google Gemini API (Gratis)

Digunakan untuk 2 fitur penting:
1. **Asisten Chatbot Virtual Stylist Rahayu** (widget floating di beranda depan yang membantu pembeli memilih padu-padan hijab, ukuran gamis, dan bahan).
2. **Asisten Auto-Copywriting & Tagging SEO** (tombol di admin form produk untuk menyusun deskripsi persuasif, spesifikasi bahan, dan tagar Instagram/Google otomatis).

### Langkah Pendaftaran:
1. Kunjungi [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Login dengan akun Google Anda.
3. Klik tombol **"Create API Key"** ➔ Pilih proyek Google Cloud atau buat baru.
4. Salin kunci API yang berawalan `AIzaSy...`.
5. Masukkan ke file `.env`:
   ```env
   GEMINI_API_KEY="AIzaSyYourGeneratedGeminiApiKeyHere"
   ```
6. Model yang digunakan secara otomatis adalah `gemini-1.5-flash` yang sangat cepat (~0.8 detik), cerdas berbahasa Indonesia santun, dan masuk dalam **Free Tier** Google (bebas biaya hingga 15 permintaan per menit).

---

## 4. Setup Payment Gateway: Midtrans Snap & Webhook Otomatis

Integrasi ini memungkinkan pembeli membayar dengan **QRIS (Gopay, OVO, ShopeePay, BCA Mobile)** atau **Virtual Account (BCA, Mandiri, BRI, BNI)**, dan status pesanan otomatis berubah dari *Menunggu Pembayaran* menjadi *Sedang Dikemas* tanpa perlu cek mutasi bank manual.

### A. Mendapatkan Kunci Akses Sandbox & Production:
1. Masuk ke [dashboard.midtrans.com](https://dashboard.midtrans.com).
2. Pastikan tombol di kiri atas berada pada mode **"SANDBOX"** (untuk masa pengujian).
3. Buka menu **Settings** ➔ **Access Keys**.
4. Salin **Server Key** dan **Client Key**:
   ```env
   MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxxxxxxxxx"
   MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxxxxxx"
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxxxxxx"
   MIDTRANS_IS_PRODUCTION="false"
   ```
5. Saat toko siap menerima uang asli, ubah saklar dashboard ke **"PRODUCTION"**, perbarui Server Key produksi, dan set `MIDTRANS_IS_PRODUCTION="true"`.

### B. Mengonfigurasi Webhook URL (Notification Handler):
1. Di dashboard Midtrans, buka menu **Settings** ➔ **Configuration**.
2. Pada kolom **Payment Notification URL**, masukkan endpoint webhook toko Anda:
   ```text
   https://www.rahayufashion.id/api/webhooks/payment
   ```
   *(Untuk pengujian di komputer lokal, gunakan tunneling seperti ngrok: `https://xxxx.ngrok-free.app/api/webhooks/payment`).*
3. Centang metode pembayaran yang ingin diaktifkan: **QRIS**, **BCA Virtual Account**, **Mandiri Virtual Account**, **BNI VA**, dan **BRI VA**.
4. Klik **Save Changes**.

### C. Keamanan Verifikasi Tanda Tangan (Signature Key):
Endpoint [`/api/webhooks/payment`](file:///home/antigravity/fransiscuspandhu/fashion-marketplace/src/app/api/webhooks/payment/route.ts) memverifikasi setiap notifikasi yang masuk menggunakan enkripsi **SHA-512**:
$$\text{Signature} = \text{SHA512}(\text{order\_id} + \text{status\_code} + \text{gross\_amount} + \text{ServerKey})$$
Jika ada pihak jahat yang mencoba mengirim webhook palsu tanpa Server Key resmi Anda, permintaan otomatis ditolak dengan status HTTP 403 Forbidden.

---

## 5. Setup Konektor Siaran Langsung TikTok Live

Fitur ini mendeteksi siaran live streaming toko di TikTok dan menyalakan badge interaktif di baris atas toko: *"🔴 LIVE DI TIKTOK SEKARANG"*.

### Langkah Pengaturan:
1. Buka file `.env`.
2. Masukkan username resmi akun TikTok toko Anda (tanpa tanda `@`):
   ```env
   TIKTOK_USERNAME="rahayufashion.store"
   ```
3. Endpoint backend [`/api/tiktok/live-status`](file:///home/antigravity/fransiscuspandhu/fashion-marketplace/src/app/api/tiktok/live-status/route.ts) akan secara otomatis menyinkronkan status siaran langsung dan jumlah penonton.

---

## 6. Panduan Uji Coba Endpoint (Testing Verification)

Anda dapat menguji apakah endpoint backend Phase 4 berfungsi dengan menjalankan perintah cURL berikut di terminal:

### A. Uji Coba AI Photoshoot:
```bash
curl -X POST http://localhost:3000/api/ai/photoshoot \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Tunik Silk Royal Plum",
    "category": "Atasan Muslim Wanita",
    "modelType": "Wanita Hijabi Modest Editorial",
    "lighting": "Clean Minimalist Studio Lighting"
  }'
```
*Respons:* JSON berisi `outputUrl`, nama `provider`, `costIdr`, dan ID log database.

### B. Uji Coba AI Auto-Copywriter:
```bash
curl -X POST http://localhost:3000/api/ai/copywrite \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gamis Syari Armani Silk",
    "category": "Gamis",
    "material": "Armani Silk Grade A"
  }'
```
*Respons:* JSON berisi deskripsi persuasif, poin keunggulan, petunjuk cuci, dan hashtag SEO.

### C. Uji Coba Payment Transaction:
```bash
curl -X POST http://localhost:3000/api/payment/create-transaction \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "RHY-TEST-001",
    "grossAmount": 250000,
    "customerDetails": {
      "name": "Siti Rahmawati",
      "email": "siti@gmail.com"
    }
  }'
```
*Respons:* JSON token Snap Midtrans, URL redirect pembayaran, atau data simulasi sandbox.

---

*Dokumentasi ini disinkronkan secara resmi dengan arsitektur produksi [docs/WORK_PLAN.md](file:///home/antigravity/fransiscuspandhu/fashion-marketplace/docs/WORK_PLAN.md).*
