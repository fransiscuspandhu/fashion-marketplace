import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        pillar: true,
        _count: {
          select: { products: true },
        },
      },
    });

    const pillars = await prisma.marketplacePillar.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, data: categories, pillars });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      tagline,
      description,
      pillarId,
      sizes = [],
      measurementLabel = "Ukuran Standar",
      variantAttributeLabel = "Warna & Bahan",
      icon = "Sparkles",
      imageUrl,
    } = body;

    if (!id || !name) {
      return NextResponse.json({ success: false, error: "ID dan Nama Kategori wajib diisi" }, { status: 400 });
    }

    const slug = id
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newCategory = await prisma.category.create({
      data: {
        id,
        slug,
        name,
        tagline,
        description,
        pillarId,
        sizes: Array.isArray(sizes) ? sizes : [],
        measurementLabel,
        variantAttributeLabel,
        icon,
        imageUrl,
      },
    });

    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
