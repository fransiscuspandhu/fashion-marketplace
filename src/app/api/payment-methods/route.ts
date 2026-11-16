import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const paymentMethods = await prisma.paymentConfig.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, data: paymentMethods });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isActive, fee, description, instructions, accountNumber, accountName, qrImageUrl } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID Metode Pembayaran wajib diisi" }, { status: 400 });
    }

    const updateData: any = {};
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (fee !== undefined) updateData.fee = Number(fee);
    if (description !== undefined) updateData.description = description;
    if (instructions !== undefined && Array.isArray(instructions)) updateData.instructions = instructions;
    if (accountNumber !== undefined) updateData.accountNumber = accountNumber;
    if (accountName !== undefined) updateData.accountName = accountName;
    if (qrImageUrl !== undefined) updateData.qrImageUrl = qrImageUrl;

    const updated = await prisma.paymentConfig.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
