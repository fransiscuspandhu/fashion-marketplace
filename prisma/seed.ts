import { PrismaClient, AdminRole, OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Rahayu Fashion Store Database Seeding...");

  // 1. Clean existing records in dependency order
  console.log("🧹 Clearing old records...");
  await prisma.aiGenerationLog.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productMedia.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.marketplacePillar.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customerAddress.deleteMany();
  await prisma.customerUser.deleteMany();
  await prisma.adminStaffUser.deleteMany();
  await prisma.paymentConfig.deleteMany();
  await prisma.homepageConfig.deleteMany();

  // 2. Seed Marketplace Pillars (Kelompok Kategori)
  console.log("🏛️ Seeding Marketplace Pillars...");
  const pillars = [
    {
      id: "pilar-modest",
      title: "Modest Fashion Wanita",
      description: "Hijab, Tunik, Abaya & Busana Muslimah Modern",
      icon: "Sparkles",
      sortOrder: 1,
      isActive: true,
    },
    {
      id: "pilar-kehamilan",
      title: "Kehamilan, Busui & Nifas",
      description: "Baju Hamil, Maternity & Menyusui Nyaman",
      icon: "Baby",
      sortOrder: 2,
      isActive: true,
    },
    {
      id: "pilar-anak",
      title: "Bayi & Anak",
      description: "Pakaian Bayi & Anak Perempuan/Laki-laki Lembut",
      icon: "Footprints",
      sortOrder: 3,
      isActive: true,
    },
  ];

  for (const p of pillars) {
    await prisma.marketplacePillar.create({ data: p });
  }

  // 3. Seed 11 Official Categories
  console.log("🏷️ Seeding 11 Official Categories...");
  const categoriesData = [
    {
      id: "Hijab",
      slug: "hijab",
      name: "Hijab",
      tagline: "Hijab Voal Ultrafine, Silk Scarf & Pashmina Elegan",
      description: "Koleksi hijab premium berserat lembut, mudah dibentuk, tidak kedap suara, dan memiliki finishing tepi laser cut presisi tinggi.",
      pillarId: "pilar-modest",
      sizes: ["110x110 cm", "115x115 cm", "130x130 cm (Syari)", "180x75 cm (Pashmina)"],
      measurementLabel: "Dimensi Hijab (cm)",
      variantAttributeLabel: "Finishing Tepi (Laser Cut / Jahit Tepi)",
      icon: "Sparkles",
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80",
      sortOrder: 1,
    },
    {
      id: "Atasan Muslim Wanita",
      slug: "atasan-muslim-wanita",
      name: "Atasan Muslim Wanita",
      tagline: "Tunik Silk, Blouse Modest & Kemeja Busui Friendly",
      description: "Atasan muslimah dengan siluet longgar, cutting elegan, aksen manset wudhu friendly, dan kancing depan untuk kemudahan ibu menyusui.",
      pillarId: "pilar-modest",
      sizes: ["XS (LD 90)", "S (LD 94)", "M (LD 100)", "L (LD 106)", "XL (LD 112)", "XXL (LD 120)"],
      measurementLabel: "Lingkar Dada (LD) & Panjang Tunik",
      variantAttributeLabel: "Akses Wudhu & Busui Friendly",
      icon: "Shirt",
      imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=300&q=80",
      sortOrder: 2,
    },
    {
      id: "Bawahan Muslim Wanita",
      slug: "bawahan-muslim-wanita",
      name: "Bawahan Muslim Wanita",
      tagline: "Rok Plisket Flare, Kulot Linen & Celana Pallazo",
      description: "Bawahan anggun bersiluet A-line yang tidak menerawang, pinggang full karet elastis, dan bahan jatuh yang sangat nyaman untuk aktivitas seharian.",
      pillarId: "pilar-modest",
      sizes: ["All Size (LP 65-105 cm)", "Size M (LP 70-95 cm)", "Size XL (LP 85-115 cm)"],
      measurementLabel: "Lingkar Pinggang (LP) & Panjang Celana/Rok",
      variantAttributeLabel: "Bahan & Jenis Lipit",
      icon: "Layers",
      imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80",
      sortOrder: 3,
    },
    {
      id: "Aksesoris Muslim",
      slug: "aksesoris-muslim",
      name: "Aksesoris Muslim",
      tagline: "Bros Kristal Rose Gold, Ciput Rajut & Tuspin Signature",
      description: "Sentuhan akhir penyempurna penampilan hijab Anda dengan bros premium anti karat bertatahkan kristal berkilau dan ciput anti pusing.",
      pillarId: "pilar-modest",
      sizes: ["Standard One Size", "Diameter 4.5 cm", "Set 3 pcs Mini Pin"],
      measurementLabel: "Ukuran Diameter / Dimensi Bros",
      variantAttributeLabel: "Lapisan Logam & Jenis Pengait",
      icon: "Crown",
      imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=300&q=80",
      sortOrder: 4,
    },
    {
      id: "Baju Hamil",
      slug: "baju-hamil",
      name: "Baju Hamil",
      tagline: "Maternity Dress, Gamis Hamil & Daster Modern Katun Rayon",
      description: "Dirancang khusus mengikuti perubahan bentuk tubuh ibu hamil dari trimester awal hingga pasca melahirkan dengan fitur ritsleting menyusui praktis.",
      pillarId: "pilar-kehamilan",
      sizes: ["All Size Maternity (LD 110-120)", "Size L (LD 105)", "Size XL (LD 115)", "Size XXL (LD 125)"],
      measurementLabel: "Lingkar Perut & Lingkar Dada (LD)",
      variantAttributeLabel: "Akses Ritsleting / Kancing Menyusui",
      icon: "Heart",
      imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=300&q=80",
      sortOrder: 5,
    },
    {
      id: "Celana Panjang & Legging",
      slug: "celana-panjang-legging",
      name: "Celana Panjang & Legging",
      tagline: "Legging Hamil Support Band, Ankle Pants & Kulot Crinkle",
      description: "Dilengkapi kantong penopang perut (belly support band) berbahan katun stretch elastis yang tidak menekan janin dan menyerap keringat dengan baik.",
      pillarId: "pilar-kehamilan",
      sizes: ["M-L (BB 45-65 kg)", "XL-XXL (BB 66-85 kg)", "Jumbo (BB > 85 kg)"],
      measurementLabel: "Perkiraan Berat Badan (BB) & Lingkar Paha",
      variantAttributeLabel: "Panel Penopang Perut (Overbelly Support)",
      icon: "Footprints",
      imageUrl: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=300&q=80",
      sortOrder: 6,
    },
    {
      id: "Atasan",
      slug: "atasan",
      name: "Atasan",
      tagline: "Kemeja Casual Wanita, Knitwear & Outer Cardigan Santai",
      description: "Koleksi atasan harian bergaya modern kontemporer yang mudah dipadupadankan untuk acara kasual maupun semi-formal di kantor.",
      pillarId: "pilar-kehamilan",
      sizes: ["S (LD 92)", "M (LD 98)", "L (LD 104)", "XL (LD 110)"],
      measurementLabel: "Lingkar Dada (LD) & Lebar Bahu",
      variantAttributeLabel: "Tekstur Bahan & Kerah",
      icon: "Shirt",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      sortOrder: 7,
    },
    {
      id: "Pakaian Dalam",
      slug: "pakaian-dalam",
      name: "Pakaian Dalam",
      tagline: "Bra Menyusui Seamless, Maternity Briefs & Korset Pasca Nifas",
      description: "Bra menyusui tanpa kawat dengan klip pembuka satu tangan serta celana dalam maternity berpotongan tinggi untuk kenyamanan maksimal ibu.",
      pillarId: "pilar-kehamilan",
      sizes: ["34B/C", "36B/C", "38B/C/D", "40C/D", "42D"],
      measurementLabel: "Ukuran Cup & Lingkar Bawah Payudara",
      variantAttributeLabel: "Bukaan Klip Depan & Tanpa Kawat",
      icon: "Gem",
      imageUrl: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?auto=format&fit=crop&w=300&q=80",
      sortOrder: 8,
    },
    {
      id: "Pakaian Wanita Lainnya",
      slug: "pakaian-wanita-lainnya",
      name: "Pakaian Wanita Lainnya",
      tagline: "Manset Gamis, Legging Wudhu, Kaos Kaki Silk & Ciput Ninja",
      description: "Essential innerwear muslimah untuk memastikan busana luar tidak menerawang dan aurat tetap tertutup sempurna saat bergerak.",
      pillarId: "pilar-kehamilan",
      sizes: ["Standard Fit M-L", "Jumbo Fit XL-XXL"],
      measurementLabel: "Tingkat Elastisitas & Panjang Badan",
      variantAttributeLabel: "Fitur Bukaan Telapak Kaki (Wudhu Friendly)",
      icon: "Feather",
      imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=300&q=80",
      sortOrder: 9,
    },
    {
      id: "Pakaian Bayi",
      slug: "pakaian-bayi",
      name: "Pakaian Bayi",
      tagline: "Jumper Bayi Katun Organik, Sleepsuit Zipper & Romper New Born",
      description: "Material 100% serat katun organik bersertifikasi SNI dan OEKO-TEX yang hipoalergenik, sangat lembut dan aman bagi kulit sensitif bayi baru lahir.",
      pillarId: "pilar-anak",
      sizes: ["0-3 Bulan (BB 3-5 kg)", "3-6 Bulan (BB 5-7 kg)", "6-12 Bulan (BB 7-10 kg)", "12-18 Bulan (BB 10-12 kg)"],
      measurementLabel: "Rentang Usia & Berat Badan Bayi",
      variantAttributeLabel: "Fitur Resleting 2 Arah & Sarung Tangan Balik",
      icon: "Baby",
      imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=300&q=80",
      sortOrder: 10,
    },
    {
      id: "Pakaian Anak Perempuan",
      slug: "pakaian-anak-perempuan",
      name: "Pakaian Anak Perempuan",
      tagline: "Gamis Anak Katun Jepang Ruffle, Set Hijab Cilik & Tunik Bunga",
      description: "Busana muslim cilik yang ceria, adem saat dipakai bermain, dengan kombinasi warna pastel lembut dan jahitan halus tanpa rasa gatal.",
      pillarId: "pilar-anak",
      sizes: ["Size 2 (Usia 2-3 Th)", "Size 4 (Usia 4-5 Th)", "Size 6 (Usia 6-7 Th)", "Size 8 (Usia 8-9 Th)", "Size 10 (Usia 10-11 Th)"],
      measurementLabel: "Panjang Gaun & Lingkar Dada Anak",
      variantAttributeLabel: "Termasuk Jilbab Instant Cilik",
      icon: "Footprints",
      imageUrl: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=300&q=80",
      sortOrder: 11,
    },
  ];

  for (const c of categoriesData) {
    await prisma.category.create({ data: c });
  }

  // 4. Seed Lookbook Products
  console.log("👗 Seeding Lookbook Products & Variants...");
  const productsData = [
    {
      id: 1,
      sku: "RHY-AT-001",
      slug: "amira-armani-silk-tunic-royal-plum",
      name: "Amira Armani Silk Tunic — Royal Plum (Busui & Wudhu Friendly)",
      categoryId: "Atasan Muslim Wanita",
      priceIdr: 249000,
      origPriceIdr: 329000,
      discountPct: 24,
      promoBadge: "PROMO GAJIAN -24%",
      promoType: "Flash Sale 24%",
      isPromoHighlight: true,
      hasVideo: true,
      videoUrl: "https://www.tiktok.com/@rahayufashion.store/video/740001",
      desc: "Tunik mewah berbahan Armani Silk premium dengan kilau lembut yang elegan. Didesain dengan kancing depan tersembunyi untuk akses menyusui yang mudah dan manset kancing wudhu friendly.",
      rating: 4.9,
      reviewCount: 148,
      stock: 45,
      imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80",
      weightGrams: 350,
      isActive: true,
    },
    {
      id: 2,
      sku: "RHY-HJ-002",
      slug: "signature-voal-ultrafine-laser-cut-scarf",
      name: "Signature Voal Ultrafine Laser Cut Scarf — 115x115 cm",
      categoryId: "Hijab",
      priceIdr: 119000,
      origPriceIdr: 149000,
      discountPct: 20,
      promoBadge: "BEST SELLER",
      promoType: "None",
      isPromoHighlight: true,
      hasVideo: true,
      videoUrl: "https://www.tiktok.com/@rahayufashion.store/video/740002",
      desc: "Hijab voal ultrafine grade A yang tegak sempurna di dahi tanpa perlu disemprot hairspray. Finishing tepi laser cut bergerigi halus berstandar butik dengan emblem plat logam emas Rahayu Store.",
      rating: 5.0,
      reviewCount: 382,
      stock: 120,
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      weightGrams: 150,
      isActive: true,
    },
    {
      id: 3,
      sku: "RHY-BW-003",
      slug: "nafisa-pleated-modest-maxi-skirt-sage-green",
      name: "Nafisa Pleated Modest Maxi Skirt — Sage Green",
      categoryId: "Bawahan Muslim Wanita",
      priceIdr: 189000,
      origPriceIdr: 229000,
      discountPct: 17,
      promoBadge: "TERLARIS",
      promoType: "None",
      isPromoHighlight: false,
      hasVideo: false,
      videoUrl: "",
      desc: "Rok plisket lidi simetris dengan bahan heavy crepe yang jatuh anggun dan tidak menerawang. Pinggang full elastis nyaman hingga lingkar 105 cm.",
      rating: 4.8,
      reviewCount: 96,
      stock: 35,
      imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
      weightGrams: 420,
      isActive: true,
    },
    {
      id: 4,
      sku: "RHY-BH-004",
      slug: "zahra-maternity-a-line-relaxed-dress",
      name: "Zahra Maternity A-Line Relaxed Dress — Soft Terracotta",
      categoryId: "Baju Hamil",
      priceIdr: 269000,
      origPriceIdr: 359000,
      discountPct: 25,
      promoBadge: "PROMO IBU & BAYI",
      promoType: "Flash Sale 25%",
      isPromoHighlight: true,
      hasVideo: true,
      videoUrl: "https://www.tiktok.com/@rahayufashion.store/video/740004",
      desc: "Dress hamil berbahan katun rayon twill premium yang sangat adem dan menyerap keringat. Dilengkapi ritsleting menyusui vertikal di sisi kanan dan kiri payudara.",
      rating: 4.9,
      reviewCount: 88,
      stock: 28,
      imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
      weightGrams: 400,
      isActive: true,
    },
    {
      id: 5,
      sku: "RHY-CP-005",
      slug: "high-waist-maternity-support-legging",
      name: "High-Waist Maternity Support Legging — Midnight Black",
      categoryId: "Celana Panjang & Legging",
      priceIdr: 129000,
      origPriceIdr: 169000,
      discountPct: 23,
      promoBadge: "RECOMMENDED",
      promoType: "None",
      isPromoHighlight: false,
      hasVideo: false,
      videoUrl: "",
      desc: "Legging hamil elastis tinggi dengan panel khusus penopang perut (belly support band) yang mengurangi beban pinggang ibu hamil.",
      rating: 4.9,
      reviewCount: 215,
      stock: 90,
      imageUrl: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80",
      weightGrams: 280,
      isActive: true,
    },
    {
      id: 6,
      sku: "RHY-AK-006",
      slug: "little-princess-ruffle-dress-katun-jepang",
      name: "Little Princess Ruffle Dress Katun Jepang — Dusty Rose",
      categoryId: "Pakaian Anak Perempuan",
      priceIdr: 145000,
      origPriceIdr: 185000,
      discountPct: 21,
      promoBadge: "EDISI LEBARAN",
      promoType: "None",
      isPromoHighlight: false,
      hasVideo: true,
      videoUrl: "https://www.tiktok.com/@rahayufashion.store/video/740006",
      desc: "Gaun cilik anak berbahan katun Jepang original motif bunga mini vintage dengan aksen renda katun lembut di bagian dada dan ujung lengan.",
      rating: 5.0,
      reviewCount: 64,
      stock: 40,
      imageUrl: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
      weightGrams: 220,
      isActive: true,
    },
  ];

  for (const p of productsData) {
    await prisma.product.create({ data: p });
  }

  // 5. Seed 5 Admin Staff Accounts with Multi-Role RBAC
  console.log("👥 Seeding 5 Internal Admin Staff Accounts with RBAC...");
  const adminStaff = [
    {
      staffCode: "ADM-001",
      email: "owner@rahayufashion.id",
      fullName: "Hj. Rahayu Kusuma",
      role: AdminRole.SUPER_ADMIN,
      department: "Executive & Ownership",
      phone: "0811-9988-7766",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      isActive: true,
      lastLogin: new Date(),
    },
    {
      staffCode: "ADM-002",
      email: "merchandiser@rahayufashion.id",
      fullName: "Dewi Lestari",
      role: AdminRole.PRODUCT_MANAGER,
      department: "Merchandising & Katalog",
      phone: "0812-3344-5566",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      isActive: true,
      lastLogin: new Date(),
    },
    {
      staffCode: "ADM-003",
      email: "gudang@rahayufashion.id",
      fullName: "Budi Santoso",
      role: AdminRole.ORDER_FULFILLMENT,
      department: "Logistik & Ekspedisi",
      phone: "0813-7788-9900",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      isActive: true,
      lastLogin: new Date(),
    },
    {
      staffCode: "ADM-004",
      email: "marketing@rahayufashion.id",
      fullName: "Annisa Putri",
      role: AdminRole.MARKETING_STREAMER,
      department: "Digital Marketing & Live Show",
      phone: "0815-1122-3344",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      isActive: true,
      lastLogin: new Date(),
    },
    {
      staffCode: "ADM-005",
      email: "finance@rahayufashion.id",
      fullName: "Hendra Wijaya",
      role: AdminRole.FINANCE_OPS,
      department: "Keuangan & Rekonsiliasi",
      phone: "0819-5566-7788",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      isActive: true,
      lastLogin: new Date(),
    },
  ];

  for (const staff of adminStaff) {
    await prisma.adminStaffUser.create({ data: staff });
  }

  // 6. Seed Customer User & Addresses
  console.log("🛒 Seeding Customer User & Address Book...");
  const customer = await prisma.customerUser.create({
    data: {
      id: "CUST-88192",
      email: "siti.rahmawati@gmail.com",
      fullName: "Siti Rahmawati",
      phone: "0812-8877-6655",
      tier: "Rahayu Gold Member",
      loyaltyPoints: 1250,
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
      bio: "Pecinta modest fashion dan hijab silk elegan bernuansa earthy pastel.",
      addresses: {
        create: [
          {
            id: "ADDR-1",
            label: "Rumah Utama",
            recipient: "Siti Rahmawati",
            phone: "0812-8877-6655",
            fullAddress: "Jl. Senopati No. 42, RT 04/RW 03, Selong, Kebayoran Baru",
            city: "Jakarta Selatan, DKI Jakarta",
            postalCode: "12110",
            isDefault: true,
            tagLocation: "Rumah",
            notes: "Pagar hitam depan pos satpam, titip di sekuriti jika sedang keluar",
          },
          {
            id: "ADDR-2",
            label: "Kantor Jakarta",
            recipient: "Siti Rahmawati (Divisi Keuangan)",
            phone: "0812-8877-6655",
            fullAddress: "Menara Sentraya Lt. 18, Jl. Iskandarsyah II No. 2, Melawai",
            city: "Jakarta Selatan, DKI Jakarta",
            postalCode: "12160",
            isDefault: false,
            tagLocation: "Kantor",
            notes: "Pengiriman pada jam kerja 09.00 - 17.00 WIB",
          },
        ],
      },
    },
  });

  // 7. Seed Payment Methods
  console.log("💳 Seeding Payment Configs...");
  const paymentConfigs = [
    {
      id: "va-bca",
      name: "BCA Virtual Account",
      category: "VIRTUAL_ACCOUNT",
      isActive: true,
      fee: 2000,
      icon: "Building2",
      description: "Pembayaran instan 24 jam dengan verifikasi otomatis via BCA Mobile, myBCA, atau ATM BCA",
      accountNumber: "88012081288776655",
      accountName: "RAHAYU STORE - BCA",
      instructions: [
        "Buka aplikasi BCA Mobile / myBCA / KlikBCA, lalu pilih menu 'Transfer' > 'BCA Virtual Account'.",
        "Masukkan 16 digit Nomor Virtual Account: 88012081288776655.",
        "Pastikan nama merchant tertera 'RAHAYU STORE' dengan nominal yang sesuai.",
        "Masukkan PIN m-BCA Anda. Transaksi selesai dan sistem otomatis mengemas barang Anda.",
      ],
      sortOrder: 1,
    },
    {
      id: "va-mandiri",
      name: "Mandiri Virtual Account",
      category: "VIRTUAL_ACCOUNT",
      isActive: true,
      fee: 2000,
      icon: "Building2",
      description: "Pembayaran via Mandiri Livin atau ATM dengan kode perusahaan 89123",
      accountNumber: "89123081288776655",
      accountName: "RAHAYU STORE - MANDIRI",
      instructions: [
        "Buka aplikasi Livin' by Mandiri, pilih menu 'Bayar' > 'Pembayaran Baru'.",
        "Pilih 'Multi Payment', cari penyedia jasa 'RAHAYU STORE' atau kode perusahaan 89123.",
        "Ketik nomor Virtual Account Mandiri Anda, lalu tekan 'Lanjutkan'.",
        "Konfirmasi tagihan dan masukkan MPIN Livin' Anda.",
      ],
      sortOrder: 2,
    },
    {
      id: "va-bri",
      name: "BRI Virtual Account (BRIVA)",
      category: "VIRTUAL_ACCOUNT",
      isActive: true,
      fee: 2000,
      icon: "Building2",
      description: "Pembayaran instan 24 jam via aplikasi BRImo atau ATM BRI",
      accountNumber: "12844081288776655",
      accountName: "BRIVA RAHAYU FASHION",
      instructions: [
        "Buka aplikasi BRImo, pilih menu 'BRIVA'.",
        "Pilih 'Pembayaran Baru' dan masukkan nomor BRIVA: 12844081288776655.",
        "Periksa nama pelanggan dan rincian nominal pembayaran.",
        "Tekan 'Bayar' dan masukkan PIN BRImo Anda.",
      ],
      sortOrder: 3,
    },
    {
      id: "qris",
      name: "QRIS Instant (GoPay / OVO / ShopeePay / BCA)",
      category: "QRIS",
      isActive: true,
      fee: 1000,
      icon: "Radio",
      description: "Pindai kode QRIS menggunakan seluruh aplikasi mobile banking atau e-wallet Indonesia",
      qrImageUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021226600016ID.CO.RAHAYU.WWW01189360091100223344550215INV20261113009955204599953033605802ID5912RAHAYUSTORE6007JAKARTA6304A1B2",
      instructions: [
        "Buka aplikasi e-wallet atau mobile banking favorit Anda (BCA, Mandiri, GoPay, ShopeePay, OVO, Dana).",
        "Pilih menu 'Scan QR' atau 'Bayar dengan QRIS'.",
        "Arahkan kamera ke kode QRIS yang tampil di layar kasir.",
        "Periksa nama merchant 'RAHAYU STORE' dan konfirmasi pembayaran dengan PIN Anda.",
      ],
      sortOrder: 4,
    },
    {
      id: "transfer-manual-bca",
      name: "Transfer Bank Manual (BCA Verifikasi CS)",
      category: "TRANSFER_MANUAL",
      isActive: true,
      fee: 0,
      icon: "Building2",
      description: "Transfer langsung ke rekening utama PT Rahayu Busana Nusantara",
      accountNumber: "731-098-7721",
      accountName: "PT RAHAYU BUSANA NUSANTARA",
      instructions: [
        "Transfer jumlah tepat sesuai tagihan ke Rekening BCA: 731-098-7721 a/n PT RAHAYU BUSANA NUSANTARA.",
        "Tuliskan Nomor Invoice pada berita transfer.",
        "Simpan struk / bukti transfer m-banking.",
        "Admin akan memverifikasi dalam waktu maksimal 15 menit pada jam kerja (08.00 - 21.00 WIB).",
      ],
      sortOrder: 5,
    },
    {
      id: "cc-visa-master",
      name: "Kartu Kredit / Debit (Visa, Mastercard, JCB)",
      category: "CREDIT_CARD",
      isActive: true,
      fee: 2500,
      icon: "CreditCard",
      description: "Aman dengan 3D Secure OTP & proteksi enkripsi bank berstandar PCI-DSS",
      instructions: [
        "Masukkan 16 digit nomor kartu kredit/debit, tanggal kedaluwarsa (MM/YY), dan kode CVV di belakang kartu.",
        "Sistem akan mengarahkan ke halaman verifikasi bank (3D Secure).",
        "Masukkan kode OTP yang dikirim melalui SMS oleh bank penerbit kartu Anda.",
        "Pembayaran selesai secara instan.",
      ],
      sortOrder: 6,
    },
    {
      id: "cod-cash",
      name: "Cash on Delivery (COD / Bayar di Tempat)",
      category: "COD",
      isActive: true,
      fee: 5000,
      icon: "Banknote",
      description: "Bayar tunai ke kurir SiCepat / J&T saat paket pesanan tiba di depan pintu rumah",
      instructions: [
        "Pastikan nomor telepon WhatsApp Anda aktif untuk konfirmasi kurir sebelum pengantaran.",
        "Siapkan uang tunai pas sesuai total belanja saat kurir tiba di alamat Anda.",
        "Periksa kemasan segel paket Rahayu Store sebelum membuka paket.",
        "Lakukan serah terima pembayaran kepada kurir resmi.",
      ],
      sortOrder: 7,
    },
  ];

  for (const pm of paymentConfigs) {
    await prisma.paymentConfig.create({ data: pm });
  }

  // 8. Seed Orders with Tokopedia-style Live AWB Tracking
  console.log("📦 Seeding Orders & AWB Tracking Timelines...");
  const orders = [
    {
      id: "INV/20261113/RAH/00995",
      userId: customer.id,
      customerName: "Siti Rahmawati",
      customerEmail: "siti.rahmawati@gmail.com",
      customerPhone: "0812-8877-6655",
      addressJson: {
        id: "ADDR-1",
        label: "Rumah Utama",
        recipient: "Siti Rahmawati",
        phone: "0812-8877-6655",
        fullAddress: "Jl. Senopati No. 42, RT 04/RW 03, Selong, Kebayoran Baru",
        city: "Jakarta Selatan, DKI Jakarta",
        postalCode: "12110",
      },
      courierCode: "JNE",
      courierName: "JNE Express",
      courierService: "Reguler (REG)",
      etd: "1-2 Hari Kerja",
      awb: null,
      subtotal: 368000,
      shippingCost: 10000,
      discountAmount: 30000,
      totalAmount: 350000,
      paymentMethodId: "va-bca",
      paymentMethodName: "BCA Virtual Account",
      paymentCategory: "VIRTUAL_ACCOUNT",
      accountNumber: "88012081288776655",
      accountName: "RAHAYU - SITI RAHMAWATI",
      paymentDueDate: "14 Nov 2026, 21:10 WIB (Sisa 23 Jam)",
      paymentInstructions: [
        "Buka aplikasi BCA Mobile / KlikBCA, lalu pilih menu 'Transfer' > 'BCA Virtual Account'.",
        "Masukkan 16 digit Nomor Virtual Account: 88012081288776655.",
        "Pastikan nama merchant tertera 'RAHAYU STORE' dengan nominal Rp 350.000.",
        "Masukkan PIN m-BCA Anda. Transaksi selesai dan status pesanan otomatis berubah ke 'DIKEMAS'.",
      ],
      status: OrderStatus.MENUNGGU_PEMBAYARAN,
      itemsJson: [
        {
          id: "item-va-1",
          productId: 1,
          productName: "Amira Armani Silk Tunic — Royal Plum",
          selectedSize: "M (LD 100)",
          selectedColor: "Royal Plum",
          quantity: 1,
          priceIdr: 249000,
          imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: "item-va-2",
          productId: 2,
          productName: "Signature Voal Ultrafine Laser Cut Scarf",
          selectedSize: "115x115 cm",
          selectedColor: "Dusty Lilac",
          quantity: 1,
          priceIdr: 119000,
          imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
        },
      ],
      timelineJson: [
        {
          time: "13 Nov 2026, 21:10 WIB",
          status: "MENUNGGU_PEMBAYARAN",
          location: "Sistem Pembayaran Rahayu",
          detail: "Pesanan berhasil dibuat. Menunggu transfer ke BCA Virtual Account: 88012081288776655 sebelum batas waktu.",
        },
      ],
    },
    {
      id: "INV/20261112/RAH/00891",
      userId: customer.id,
      customerName: "Siti Rahmawati",
      customerEmail: "siti.rahmawati@gmail.com",
      customerPhone: "0812-8877-6655",
      addressJson: {
        id: "ADDR-1",
        label: "Rumah Utama",
        recipient: "Siti Rahmawati",
        phone: "0812-8877-6655",
        fullAddress: "Jl. Senopati No. 42, RT 04/RW 03, Selong, Kebayoran Baru",
        city: "Jakarta Selatan, DKI Jakarta",
        postalCode: "12110",
      },
      courierCode: "JNE",
      courierName: "JNE Express",
      courierService: "YES (Yakin Esok Sampai)",
      etd: "Besok Tiba",
      awb: "JNE-RAH88492019",
      subtotal: 269000,
      shippingCost: 18000,
      discountAmount: 25000,
      totalAmount: 262000,
      paymentMethodId: "qris",
      paymentMethodName: "QRIS Instant",
      paymentCategory: "QRIS",
      status: OrderStatus.DIKIRIM,
      itemsJson: [
        {
          id: "item-2",
          productId: 4,
          productName: "Zahra Maternity A-Line Relaxed Dress",
          selectedSize: "Size L (LD 105)",
          selectedColor: "Soft Terracotta",
          quantity: 1,
          priceIdr: 269000,
          imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
        },
      ],
      timelineJson: [
        {
          time: "13 Nov 2026, 14:10 WIB",
          status: "ON_DELIVERY",
          location: "Kurir JNE Senopati Hub",
          detail: "Paket dibawa kurir [Sdr. Dimas Prasetyo] menuju alamat pengantaran.",
        },
        {
          time: "13 Nov 2026, 08:15 WIB",
          status: "TRANSIT",
          location: "Jakarta Gateway DC",
          detail: "Paket telah tiba di pusat sortir transit Jakarta Selatan.",
        },
        {
          time: "12 Nov 2026, 19:45 WIB",
          status: "MANIFEST",
          location: "Rahayu Fulfillment Center, Bandung",
          detail: "Paket telah diserahkan kepada kurir JNE Express dengan nomor resi JNE-RAH88492019.",
        },
        {
          time: "12 Nov 2026, 14:35 WIB",
          status: "ORDER_DIBUAT",
          location: "Sistem Rahayu Store",
          detail: "Pembayaran QRIS lunas terverifikasi. Pesanan dikemas seller.",
        },
      ],
    },
    {
      id: "INV/20261108/RAH/00783",
      userId: customer.id,
      customerName: "Siti Rahmawati",
      customerEmail: "siti.rahmawati@gmail.com",
      customerPhone: "0812-8877-6655",
      addressJson: {
        id: "ADDR-1",
        label: "Rumah Utama",
        recipient: "Siti Rahmawati",
        phone: "0812-8877-6655",
        fullAddress: "Jl. Senopati No. 42, RT 04/RW 03, Selong, Kebayoran Baru",
        city: "Jakarta Selatan, DKI Jakarta",
        postalCode: "12110",
      },
      courierCode: "SICEPAT",
      courierName: "SiCepat Ekspres",
      courierService: "BEST (Next Day)",
      etd: "1 Hari",
      awb: "003889127764",
      subtotal: 189000,
      shippingCost: 0,
      discountAmount: 20000,
      totalAmount: 169000,
      paymentMethodId: "va-bca",
      paymentMethodName: "BCA Virtual Account",
      paymentCategory: "VIRTUAL_ACCOUNT",
      status: OrderStatus.SELESAI,
      itemsJson: [
        {
          id: "item-3",
          productId: 3,
          productName: "Nafisa Pleated Modest Maxi Skirt",
          selectedSize: "All Size (LP 65-105 cm)",
          selectedColor: "Sage Green",
          quantity: 1,
          priceIdr: 189000,
          imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
        },
      ],
      timelineJson: [
        {
          time: "10 Nov 2026, 13:40 WIB",
          status: "DELIVERED",
          location: "Rumah Utama, Kebayoran Baru",
          detail: "Pesanan diterima oleh [Siti Rahmawati - Penerima Langsung]. Transaksi selesai.",
        },
      ],
    },
  ];

  for (const o of orders) {
    await prisma.order.create({ data: o });
  }

  // 9. Seed Homepage Configuration
  console.log("🎨 Seeding Homepage CMS Configuration...");
  await prisma.homepageConfig.create({
    data: {
      id: "singleton",
      heroBadge: "KOLEKSI RAYA & MODEST 2026",
      heroTitle: "Elegansi Kesederhanaan Busana Muslimah",
      heroDescription: "Koleksi busana muslim wanita, hijab voal ultrafine, baju hamil busui friendly, dan pakaian anak dengan material katun & silk bersertifikasi standar tinggi.",
      heroCtaText: "Jelajahi Koleksi",
      heroCtaLink: "/products",
      heroBackgroundImageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80",
      heroOverlayOpacity: 40,
      categoriesTitle: "11 Kategori Resmi",
      categoriesSubtitle: "Pilih kategori untuk melihat katalog lengkap ukuran & video detail",
      categoriesActive: true,
      promoTitle: "Promo Highlight Hari Ini",
      promoBadgeText: "VOUCHER: RAHAYUPAYDAY",
      promoCountdownHours: "06",
      promoCountdownMins: "42",
      promoCountdownSecs: "19",
      promoActive: true,
      newArrivalsTitle: "Koleksi Terbaru (New Arrivals)",
      newArrivalsSubtitle: "Desain terkini rilisan minggu ini dengan finishing tepi laser cut presisi",
      newArrivalsMax: 4,
      newArrivalsActive: true,
      bestSellersTitle: "Produk Terlaris (Best Sellers)",
      bestSellersSubtitle: "Pilihan favorit ribuan muslimah Indonesia dengan rating tertinggi",
      bestSellersMax: 4,
      bestSellersActive: true,
      uspTitle: "Kenapa Memilih Rahayu Fashion?",
      uspActive: true,
      uspItemsJson: [
        {
          title: "100% Produk Original",
          desc: "Jaminan bahan berkualitas tinggi, jahitan butik, dan lolos QC ketat.",
          icon: "ShieldCheck",
        },
        {
          title: "Gratis Ongkir se-Indonesia",
          desc: "Didukung kurir terpercaya JNE, SiCepat, J&T dengan pelacakan resi real-time.",
          icon: "Truck",
        },
        {
          title: "Garansi Tukar Ukuran 7 Hari",
          desc: "Kekecilan atau kebesaran? Tukar ukuran mudah tanpa ribet.",
          icon: "RefreshCw",
        },
        {
          title: "Customer Support 24/7",
          desc: "Layanan konsultasi ukuran dan pemesanan via WhatsApp resmi.",
          icon: "Clock",
        },
      ],
    },
  });

  // 10. Seed Sample AI Studio Logs
  console.log("🤖 Seeding AI Generation Logs...");
  const aiLogs = [
    {
      id: "AI-GEN-01",
      timestamp: "13 Nov 2026, 09:15 WIB",
      productName: "Voal Ultrafine Scarf - Dusty Lilac",
      category: "Hijab",
      modelType: "Wanita Indonesia Modest Elegance (Usia 26)",
      lighting: "Soft Natural Morning Sunlight (Golden Hour)",
      background: "Minimalist Scandinavian Interior with Warm Travertine Arch",
      costIdr: 495,
      status: "COMPLETED",
      prompt: "Indonesian modest fashion model wearing luxury dusty lilac silk voal scarf, draped elegantly, soft warm daylight, high fashion editorial lookbook, 8k resolution.",
      outputUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "AI-GEN-02",
      timestamp: "12 Nov 2026, 16:40 WIB",
      productName: "Tunik Silk Royal Plum Busui",
      category: "Atasan Muslim Wanita",
      modelType: "Wanita Hijab Cantik Nusantara (Usia 29)",
      lighting: "High-End Studio Softbox Lighting",
      background: "Monochrome Concrete & Olive Tree Branch Shadow",
      costIdr: 520,
      status: "COMPLETED",
      prompt: "Full-body portrait of Indonesian woman wearing royal plum modest loose tunic, standing gracefully against clean textured beige wall, natural soft shadows, Zalora premium aesthetic.",
      outputUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    },
  ];

  for (const log of aiLogs) {
    await prisma.aiGenerationLog.create({ data: log });
  }

  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
