import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      grossAmount,
      customerDetails = {},
      items = [],
    } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // 1. If Midtrans Server Key is configured
    if (serverKey && !serverKey.includes("xxxx")) {
      const snapUrl = isProduction
        ? "https://app.midtrans.com/snap/v1/transactions"
        : "https://app.sandbox.midtrans.com/snap/v1/transactions";

      const authHeader = `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`;

      const payload = {
        transaction_details: {
          order_id: orderId || `RHY-${Date.now()}`,
          gross_amount: Math.round(Number(grossAmount)),
        },
        customer_details: {
          first_name: customerDetails.name || "Pelanggan Rahayu",
          email: customerDetails.email || "customer@rahayufashion.id",
          phone: customerDetails.phone || "081288997744",
        },
        item_details: (items && items.length > 0)
          ? items.map((it: any) => ({
              id: it.id ? String(it.id) : "ITEM",
              price: Math.round(it.product?.priceIdr || it.price || grossAmount),
              quantity: it.quantity || 1,
              name: (it.product?.name || it.name || "Produk Rahayu").substring(0, 50),
            }))
          : undefined,
        callbacks: {
          finish: `${siteUrl}/profile?tab=orders`,
        },
      };

      const res = await fetch(snapUrl, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({
          success: true,
          isLive: true,
          provider: "midtrans-snap",
          token: data.token,
          redirect_url: data.redirect_url,
        });
      } else {
        const errData = await res.text();
        console.warn("Midtrans Snap error response:", errData);
      }
    }

    // 2. Fallback / Sandbox Simulation Mode (when MIDTRANS_SERVER_KEY is not set)
    const mockSnapToken = `SNAP-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
    const mockQrString = `00020101021226670016ID.CO.QRIS.WWW01189360099900000000010215${orderId || Date.now()}51046012520459995303360540${grossAmount}5802ID5919RAHAYU FASHION STORE6007JAKARTA62070703A016304E07B`;

    return NextResponse.json({
      success: true,
      isLive: false,
      provider: "sandbox-simulation",
      token: mockSnapToken,
      qrString: mockQrString,
      vaNumber: `12808${Math.floor(100000000 + Math.random() * 900000000)}`,
      bankName: "BCA / Mandiri Virtual Account",
      message: "Transaksi dibuat dalam mode simulasi sandbox. Masukkan MIDTRANS_SERVER_KEY di .env untuk mengaktifkan Midtrans Snap live.",
    });
  } catch (error: any) {
    console.error("Create payment transaction error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create transaction" },
      { status: 500 }
    );
  }
}
