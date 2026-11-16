import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);

    const order = await prisma.order.findUnique({
      where: { id: decodedId },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
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
    const decodedId = decodeURIComponent(id);
    const body = await request.json();

    const existingOrder = await prisma.order.findUnique({
      where: { id: decodedId },
    });

    if (!existingOrder) {
      return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    const currentTimeline = Array.isArray(existingOrder.timelineJson)
      ? (existingOrder.timelineJson as any[])
      : [];

    const updateData: any = {};

    // Update status
    if (body.status && Object.values(OrderStatus).includes(body.status)) {
      updateData.status = body.status;

      let detail = `Status pesanan diperbarui menjadi ${body.status}.`;
      if (body.status === "DIKEMAS") {
        detail = "Pembayaran terverifikasi. Paket pesanan sedang disiapkan & dipacking oleh tim gudang.";
      } else if (body.status === "DIKIRIM") {
        detail = `Paket telah diserahkan kepada kurir ${existingOrder.courierName} dengan resi ${body.awb || existingOrder.awb || "-"}.`;
      } else if (body.status === "SELESAI") {
        detail = "Pesanan telah diterima oleh pelanggan. Transaksi selesai.";
      } else if (body.status === "DIBATALKAN") {
        detail = "Pesanan dibatalkan.";
      }

      const newTimelineItem = {
        time: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) + " WIB",
        status: body.status,
        location: body.location || "Pusat Operasional Rahayu",
        detail,
      };

      updateData.timelineJson = [newTimelineItem, ...currentTimeline];
    }

    // Update AWB resi
    if (body.awb !== undefined) {
      updateData.awb = body.awb;
      if (body.courierName) {
        updateData.courierName = body.courierName;
      }
    }

    const updated = await prisma.order.update({
      where: { id: decodedId },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
