import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const body = await request.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.tagline !== undefined) updateData.tagline = body.tagline;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.sizes !== undefined) updateData.sizes = body.sizes;
    if (body.measurementLabel !== undefined) updateData.measurementLabel = body.measurementLabel;
    if (body.variantAttributeLabel !== undefined) updateData.variantAttributeLabel = body.variantAttributeLabel;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.pillarId !== undefined) updateData.pillarId = body.pillarId;
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);

    const updated = await prisma.category.update({
      where: { id: decodedId },
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
    const decodedId = decodeURIComponent(id);

    await prisma.category.delete({
      where: { id: decodedId },
    });

    return NextResponse.json({ success: true, message: `Kategori ${decodedId} berhasil dihapus` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
