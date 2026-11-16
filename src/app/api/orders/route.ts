import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as OrderStatus | null;
    const email = searchParams.get("email");

    const where: any = {};
    if (status) where.status = status;
    if (email) where.customerEmail = email;

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      address,
      courier,
      items,
      subtotal,
      shippingCost,
      discountAmount = 0,
      totalAmount,
      paymentMethod,
      accountNumber,
      accountName,
      paymentDueDate,
      paymentInstructions = [],
    } = body;

    const orderId = `INV/${new Date().toISOString().slice(0, 10).replace(/-/g, "")}/RAH/${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    const newOrder = await prisma.order.create({
      data: {
        id: orderId,
        userId: userId || null,
        customerName: customerName || address?.recipient || "Pelanggan Rahayu",
        customerEmail: customerEmail || "pelanggan@rahayufashion.id",
        customerPhone: customerPhone || address?.phone || "0812-8877-6655",
        addressJson: address,
        courierCode: courier?.code || "JNE",
        courierName: courier?.name || "JNE Express",
        courierService: courier?.service || "Reguler (REG)",
        etd: courier?.etd || "1-2 Hari Kerja",
        subtotal: Number(subtotal),
        shippingCost: Number(shippingCost),
        discountAmount: Number(discountAmount),
        totalAmount: Number(totalAmount),
        paymentMethodId: paymentMethod?.id || "va-bca",
        paymentMethodName: paymentMethod?.name || "BCA Virtual Account",
        paymentCategory: paymentMethod?.category || "VIRTUAL_ACCOUNT",
        accountNumber: accountNumber || "88012081288776655",
        accountName: accountName || "RAHAYU STORE",
        paymentDueDate: paymentDueDate || "24 Jam dari sekarang",
        paymentInstructions: Array.isArray(paymentInstructions) ? paymentInstructions : [],
        status: OrderStatus.MENUNGGU_PEMBAYARAN,
        itemsJson: items,
        timelineJson: [
          {
            time: "Baru saja",
            status: "MENUNGGU_PEMBAYARAN",
            location: "Sistem Pembayaran Rahayu",
            detail: `Pesanan ${orderId} berhasil dibuat. Menunggu pembayaran via ${paymentMethod?.name || "Virtual Account"}.`,
          },
        ],
      },
    });

    // Reduce product stock in database
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item.product?.id) {
          await prisma.product.update({
            where: { id: item.product.id },
            data: {
              stock: {
                decrement: item.quantity || 1,
              },
            },
          }).catch((err) => console.warn("Stock decrement warning:", err.message));
        }
      }
    }

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
