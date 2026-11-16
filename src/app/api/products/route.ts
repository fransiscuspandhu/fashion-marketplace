import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category");
    const search = searchParams.get("search");

    const where: any = { isActive: true };
    if (categoryId && categoryId !== "all") {
      where.categoryId = categoryId;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { desc: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { id: "asc" },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      sku,
      name,
      categoryId,
      priceIdr,
      origPriceIdr,
      discountPct = 0,
      promoBadge,
      promoType = "None",
      isPromoHighlight = false,
      hasVideo = false,
      videoUrl = "",
      desc = "",
      rating = 5.0,
      reviewCount = 0,
      stock = 30,
      imageUrl = "",
      weightGrams = 350,
    } = body;

    if (!name || !sku || !categoryId) {
      return NextResponse.json(
        { success: false, error: "Nama produk, SKU, dan Kategori wajib diisi" },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") + `-${Date.now().toString().slice(-4)}`;

    const newProduct = await prisma.product.create({
      data: {
        sku,
        slug,
        name,
        categoryId,
        priceIdr: Number(priceIdr),
        origPriceIdr: Number(origPriceIdr || priceIdr),
        discountPct: Number(discountPct),
        promoBadge,
        promoType,
        isPromoHighlight: Boolean(isPromoHighlight),
        hasVideo: Boolean(hasVideo),
        videoUrl,
        desc,
        rating: Number(rating),
        reviewCount: Number(reviewCount),
        stock: Number(stock),
        imageUrl,
        weightGrams: Number(weightGrams),
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
