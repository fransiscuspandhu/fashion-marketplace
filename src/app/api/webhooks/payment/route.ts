import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

    // 1. Identify Provider (Midtrans or Xendit)
    const isMidtrans = !!body.signature_key || !!body.transaction_status;
    const isXendit = !!body.event || !!body.external_id;

    let orderId = "";
    let isPaymentSuccess = false;
    let paymentChannel = "Midtrans Gateway";
    let failureReason = "";

    if (isMidtrans) {
      const {
        order_id,
        status_code,
        gross_amount,
        signature_key,
        transaction_status,
        fraud_status,
        payment_type,
      } = body;

      orderId = order_id;
      paymentChannel = `Midtrans (${payment_type || "Online"})`;

      // Verify SHA-512 Signature if serverKey is set
      if (serverKey && !serverKey.includes("xxxx")) {
        const expectedSignature = crypto
          .createHash("sha512")
          .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
          .digest("hex");

        if (signature_key !== expectedSignature) {
          console.warn("Invalid Midtrans signature key received:", signature_key);
          return NextResponse.json(
            { success: false, error: "Invalid cryptographic signature" },
            { status: 403 }
          );
        }
      }

      // Check transaction status
      if (
        transaction_status === "settlement" ||
        (transaction_status === "capture" && fraud_status === "accept")
      ) {
        isPaymentSuccess = true;
      } else if (
        transaction_status === "deny" ||
        transaction_status === "cancel" ||
        transaction_status === "expire"
      ) {
        failureReason = `Transaksi ${transaction_status}`;
      }
    } else if (isXendit) {
      // Xendit Webhook format
      orderId = body.external_id || body.id;
      paymentChannel = "Xendit Gateway";
      if (body.status === "PAID" || body.status === "COMPLETED") {
        isPaymentSuccess = true;
      }
    } else {
      // Generic payload
      orderId = body.orderId || body.order_id;
      if (body.status === "PAID" || body.status === "SUCCESS") {
        isPaymentSuccess = true;
      }
    }

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing order_id" },
        { status: 400 }
      );
    }

    // 2. Update Database Record if Connected
    const nowStr =
      new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB";

    if (isPaymentSuccess) {
      try {
        // Find existing order
        const existing = await prisma.order.findUnique({
          where: { id: orderId },
        });

        if (existing) {
          const currentTimeline = Array.isArray(existing.timelineJson)
            ? (existing.timelineJson as any[])
            : [];

          const updatedTimeline = [
            ...currentTimeline,
            {
              time: nowStr,
              status: "DIKEMAS",
              location: "Gateway Otomatis Rahayu",
              detail: `Pembayaran berhasil diverifikasi otomatis oleh ${paymentChannel}. Status pesanan diubah menjadi Sedang Dikemas Gudang.`,
            },
          ];

          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: "DIKEMAS",
              timelineJson: updatedTimeline,
            },
          });
        }
      } catch (dbErr) {
        console.warn("Could not update order in PostgreSQL:", dbErr);
      }

      return NextResponse.json({
        success: true,
        orderId,
        status: "DIKEMAS",
        message: `Pembayaran untuk order ${orderId} berhasil diverifikasi. Status pesanan kini DIKEMAS.`,
      });
    }

    return NextResponse.json({
      success: true,
      orderId,
      status: "UNPAID",
      message: failureReason || "Notifikasi pembayaran diterima.",
    });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Webhook error" },
      { status: 500 }
    );
  }
}
