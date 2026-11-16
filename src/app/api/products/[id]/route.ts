import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ success: false, error: "ID tidak valid" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true, variants: true, media: true },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "Produk tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ success: false, error: "ID tidak valid" }, { status: 400 });
    }

    const body = await request.json();

    // Support single field updates (like stock) or full updates
    const updateData: any = {};
    if (body.stock !== undefined) updateData.stock = Number(body.stock);
    if (body.name !== undefined) updateData.name = body.name;
    if (body.sku !== undefined) updateData.sku = body.sku;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.priceIdr !== undefined) updateData.priceIdr = Number(body.priceIdr);
    if (body.origPriceIdr !== undefined) updateData.origPriceIdr = Number(body.origPriceIdr);
    if (body.discountPct !== undefined) updateData.discountPct = Number(body.discountPct);
    if (body.promoBadge !== undefined) updateData.promoBadge = body.promoBadge;
    if (body.promoType !== undefined) updateData.promoType = body.promoType;
    if (body.isPromoHighlight !== undefined) updateData.isPromoHighlight = Boolean(body.isPromoHighlight);
    if (body.hasVideo !== undefined) updateData.hasVideo = Boolean(body.hasVideo);
    if (body.videoUrl !== undefined) updateData.videoUrl = body.videoUrl;
    if (body.desc !== undefined) updateData.desc = body.desc;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);

    const updated = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ success: false, error: "ID tidak valid" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ success: true, message: `Produk ID ${productId} berhasil dihapus` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
