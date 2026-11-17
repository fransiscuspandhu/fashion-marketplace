import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma, AdminRole, OrderStatus } from "@prisma/client";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  let dbConnected = false;
  let dbVersion = "unknown";
  let counts = {
    products: 0,
    categories: 0,
    orders: 0,
    adminUsers: 0,
    paymentConfigs: 0,
    pillars: 0,
  };
  let seedResult: string | null = null;

  try {
    // 1. Check raw database connection
    const rawResult: any = await prisma.$queryRaw`SELECT version();`;
    if (rawResult && rawResult.length > 0) {
      dbConnected = true;
      dbVersion = rawResult[0].version || "PostgreSQL";
    }

    // 2. If seed requested and db is connected, perform quick seed
    if (action === "seed" && dbConnected) {
      seedResult = await triggerSeed();
    }

    // 3. Count table records
    if (dbConnected) {
      const [products, categories, orders, adminUsers, paymentConfigs, pillars] = await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.order.count(),
        prisma.adminStaffUser.count(),
        prisma.paymentConfig.count(),
        prisma.marketplacePillar.count(),
      ]);

      counts = {
        products,
        categories,
        orders,
        adminUsers,
        paymentConfigs,
        pillars,
      };
    }

    return NextResponse.json({
      status: dbConnected ? "ok" : "degraded",
      message: dbConnected
        ? "Rahayu Fashion Store backend & database terhubung dengan sempurna."
        : "Database belum terhubung. Periksa konfigurasi DATABASE_URL.",
      database: {
        connected: dbConnected,
        provider: "PostgreSQL",
        version: dbVersion,
        isSeeded: counts.products > 0 && counts.categories > 0,
        counts,
      },
      seedResult,
      system: {
        nodeVersion: process.version,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Gagal terhubung ke database PostgreSQL.",
        database: {
          connected: false,
          error: error.message || String(error),
        },
        hint: "Pastikan container rahayu_postgres aktif dengan perintah: docker compose ps",
        system: {
          nodeVersion: process.version,
          environment: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (body.action === "seed") {
      const message = await triggerSeed();
      return NextResponse.json({ success: true, message });
    }
    return NextResponse.json({ success: false, error: "Action tidak dikenali. Gunakan { action: 'seed' }" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

async function triggerSeed(): Promise<string> {
  // Check if pillars already exist
  const existingPillars = await prisma.marketplacePillar.count();
  if (existingPillars === 0) {
    await prisma.marketplacePillar.createMany({
      data: [
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
      ],
      skipDuplicates: true,
    });
  }

  // Seed categories
  const existingCategories = await prisma.category.count();
  if (existingCategories === 0) {
    const catList = [
      {
        id: "Hijab",
        slug: "hijab",
        name: "Hijab",
        tagline: "Hijab Voal Ultrafine, Silk Scarf & Pashmina Elegan",
        description: "Koleksi hijab premium berserat lembut dan finishing laser cut.",
        pillarId: "pilar-modest",
        sizes: ["110x110 cm", "115x115 cm", "130x130 cm (Syari)", "180x75 cm (Pashmina)"],
        measurementLabel: "Dimensi Hijab (cm)",
        variantAttributeLabel: "Finishing Tepi",
        icon: "Sparkles",
        imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80",
        sortOrder: 1,
      },
      {
        id: "Atasan Muslim Wanita",
        slug: "atasan-muslim-wanita",
        name: "Atasan Muslim Wanita",
        tagline: "Tunik Silk, Blouse Modest & Kemeja Busui Friendly",
        description: "Atasan muslimah dengan siluet longgar dan manset wudhu friendly.",
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
        description: "Bawahan anggun bersiluet A-line yang tidak menerawang.",
        pillarId: "pilar-modest",
        sizes: ["All Size (LP 65-105 cm)", "Size M (LP 70-95 cm)", "Size XL (LP 85-115 cm)"],
        measurementLabel: "Lingkar Pinggang (LP)",
        variantAttributeLabel: "Bahan & Jenis Lipit",
        icon: "Layers",
        imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80",
        sortOrder: 3,
      },
      {
        id: "Baju Hamil",
        slug: "baju-hamil",
        name: "Baju Hamil",
        tagline: "Maternity Dress, Gamis Hamil & Daster Modern Katun Rayon",
        description: "Dirancang khusus mengikuti perubahan bentuk tubuh ibu hamil.",
        pillarId: "pilar-kehamilan",
        sizes: ["All Size Maternity (LD 110-120)", "Size L (LD 105)", "Size XL (LD 115)"],
        measurementLabel: "Lingkar Perut & Lingkar Dada (LD)",
        variantAttributeLabel: "Akses Ritsleting / Kancing Menyusui",
        icon: "Heart",
        imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=300&q=80",
        sortOrder: 5,
      },
    ];

    for (const c of catList) {
      await prisma.category.upsert({
        where: { id: c.id },
        update: {},
        create: c,
      });
    }
  }

  // Seed Admin Users
  const existingAdmin = await prisma.adminStaffUser.count();
  if (existingAdmin === 0) {
    await prisma.adminStaffUser.createMany({
      data: [
        {
          staffCode: "ADM-001",
          fullName: "Siti Rahmawati (Owner)",
          email: "superadmin@rahayufashion.id",
          role: AdminRole.SUPER_ADMIN,
          department: "Direksi & Operasional Utama",
          phone: "0811-9988-7766",
          avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
        },
        {
          staffCode: "ADM-002",
          fullName: "Dewi Lestari",
          email: "merchandiser@rahayufashion.id",
          role: AdminRole.PRODUCT_MANAGER,
          department: "Merchandising & Katalog",
          phone: "0812-3344-5566",
          avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
        },
      ],
      skipDuplicates: true,
    });
  }

  // Seed Products if none
  const existingProducts = await prisma.product.count();
  if (existingProducts === 0) {
    await prisma.product.create({
      data: {
        id: 1,
        sku: "RHY-AT-001",
        slug: "amira-armani-silk-tunic-royal-plum",
        name: "Amira Armani Silk Tunic — Royal Plum (Busui & Wudhu Friendly)",
        categoryId: "Atasan Muslim Wanita",
        priceIdr: 289000,
        origPriceIdr: 349000,
        discountPct: 17,
        promoBadge: "BEST SELLER",
        promoType: "FlashSale",
        isPromoHighlight: true,
        hasVideo: true,
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-purple-dress-41381-large.mp4",
        desc: "Tunik berbahan Armani Silk premium dengan kilau mewah yang elegan.",
        rating: 4.9,
        reviewCount: 312,
        stock: 45,
        imageUrl: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80",
        weightGrams: 350,
      },
    });
  }

  return "Seeding berhasil diselesaikan.";
}
