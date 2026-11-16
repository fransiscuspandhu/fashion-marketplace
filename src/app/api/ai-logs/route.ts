import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.aiGenerationLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productName, category, modelType, lighting, background, outputUrl, prompt, costIdr } = body;

    const count = await prisma.aiGenerationLog.count();
    const id = `AI-GEN-${(count + 1).toString().padStart(2, "0")}`;

    const newLog = await prisma.aiGenerationLog.create({
      data: {
        id,
        productName: productName || "Produk Rahayu",
        category: category || "Modest Wear",
        modelType: modelType || "Model Wanita Indonesia",
        lighting: lighting || "Natural Daylight",
        background: background || "Studio Minimalis",
        costIdr: costIdr || 495,
        status: "COMPLETED",
        prompt: prompt || `Foto lookbook profesional modest fashion untuk ${productName}`,
        outputUrl: outputUrl || "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
        timestamp: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) + " WIB",
      },
    });

    return NextResponse.json({ success: true, data: newLog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
