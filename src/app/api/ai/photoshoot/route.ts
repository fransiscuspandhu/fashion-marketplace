import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logAiThirdParty, inspectAiKeys } from "@/lib/ai-logger";

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const body = await request.json();
    const {
      productName = "Busana Muslim Modest",
      category = "Modest Wear",
      modelType = "Wanita Hijabi Modest Editorial",
      lighting = "Clean Minimalist Studio Lighting",
      background = "Studio Modest Minimalist Aesthetic",
      rawImageUrl,
      prompt: customPrompt,
    } = body;

    const falKey = process.env.FAL_KEY;
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    let outputUrl = "";
    let provider = "mock";
    let isLive = false;
    let costIdr = Math.floor(480 + Math.random() * 80);

    const prompt =
      customPrompt ||
      `Photorealistic Indonesian high-fashion modest lookbook of female model (${modelType}) wearing "${productName}" (${category}). Set in ${background}, illuminated by ${lighting}. 8k resolution, elegant drapery, commercial editorial quality.`;

    // 1. Try fal.ai (Virtual Try-on / Flux)
    if (falKey && !falKey.includes("your_")) {
      try {
        provider = "fal.ai";
        // Call fal.ai API endpoint (e.g. Flux Realism or Fashn VTON)
        const falEndpoint = rawImageUrl
          ? "https://queue.fal.run/fal-ai/fashn-tryon"
          : "https://queue.fal.run/fal-ai/flux/dev";

        const falPayload = rawImageUrl
          ? {
              model_image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
              garment_image: rawImageUrl,
              category: "tops",
            }
          : {
              prompt,
              image_size: "portrait_4_3",
              num_inference_steps: 28,
              guidance_scale: 3.5,
            };

        const res = await fetch(falEndpoint, {
          method: "POST",
          headers: {
            Authorization: `Key ${falKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(falPayload),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.images && data.images[0]?.url) {
            outputUrl = data.images[0].url;
            isLive = true;
            costIdr = 650;
          }
        }
      } catch (err) {
        console.warn("fal.ai API call failed, falling back to next provider:", err);
      }
    }

    // 2. Try Replicate (IDM-VTON / Flux Schnell)
    if (!outputUrl && replicateToken && !replicateToken.includes("your_")) {
      try {
        provider = "replicate";
        const repRes = await fetch("https://api.replicate.com/v1/predictions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${replicateToken}`,
            "Content-Type": "application/json",
            Prefer: "wait",
          },
          body: JSON.stringify({
            version: "c871d2c9c7f66a2e4e15865063b4b5742feeb3cf4d2073998bde9989b6a1bf58", // Flux Schnell
            input: { prompt, aspect_ratio: "3:4" },
          }),
        });

        if (repRes.ok) {
          const data = await repRes.json();
          if (data.output && Array.isArray(data.output) && data.output[0]) {
            outputUrl = data.output[0];
            isLive = true;
            costIdr = 450;
          }
        }
      } catch (err) {
        console.warn("Replicate API call failed, falling back to next provider:", err);
      }
    }

    // 3. Try OpenAI DALL-E 3
    if (!outputUrl && openaiKey && !openaiKey.includes("your_")) {
      try {
        provider = "openai-dalle3";
        const oaiRes = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
          }),
        });

        if (oaiRes.ok) {
          const data = await oaiRes.json();
          if (data.data && data.data[0]?.url) {
            outputUrl = data.data[0].url;
            isLive = true;
            costIdr = 600;
          }
        }
      } catch (err) {
        console.warn("OpenAI DALL-E call failed:", err);
      }
    }

    // 4. Fallback / Mock Simulation Mode
    if (!outputUrl) {
      provider = "mock-sandbox";
      isLive = false;
      const sampleEditorialImages = [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=800&q=80",
      ];
      outputUrl = sampleEditorialImages[Math.floor(Math.random() * sampleEditorialImages.length)];
    }

    // Persist to Prisma Database if DB is connected
    const nowStr =
      new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB";

    const logId = `AI-GEN-${Math.floor(1000 + Math.random() * 9000)}`;

    let savedLog = {
      id: logId,
      productName,
      category,
      modelType,
      lighting,
      background,
      costIdr,
      status: "COMPLETED",
      prompt,
      outputUrl,
      timestamp: nowStr,
    };

    try {
      savedLog = await prisma.aiGenerationLog.create({
        data: {
          id: logId,
          productName,
          category,
          modelType,
          lighting,
          background,
          costIdr,
          status: "COMPLETED",
          prompt,
          outputUrl,
          timestamp: nowStr,
        },
      });
    } catch (e) {
      // Database not reachable in dev or offline, fallback safely
      console.warn("Could not save to PostgreSQL, returning in-memory log:", e);
    }

    const durationMs = Date.now() - startTime;
    const keysDetected = inspectAiKeys();

    logAiThirdParty({
      service: "AI Photoshoot Studio",
      provider,
      isLive,
      endpoint: isLive ? (provider === "fal.ai" ? "https://queue.fal.run/fal-ai/flux/dev" : "https://api.replicate.com") : undefined,
      durationMs,
      costEstimate: `Rp ${costIdr} (~$${(costIdr / 16000).toFixed(3)} USD)`,
      inputs: {
        productName,
        category,
        modelType,
        lighting,
        background,
        hasRawImage: !!rawImageUrl,
      },
      outputPreview: outputUrl,
      keysDetected,
      note: isLive
        ? `Model AI berhasil memproses gambar via server cloud ${provider}.`
        : "Saat ini berjalan di Mode Sandbox Simulator. Untuk merender baju mentah secara live via Cloud AI, pasang FAL_KEY asli di file .env.",
    });

    return NextResponse.json({
      success: true,
      isLive,
      provider,
      outputUrl,
      costIdr,
      prompt,
      log: savedLog,
      message: isLive
        ? `Foto model berhasil di-generate secara live via ${provider}!`
        : "Foto model AI beresolusi tinggi berhasil dibuat & siap dipasang ke produk! (Mode Sandbox Simulator Aktif).",
      _devDiagnostics: {
        service: "AI Photoshoot Studio",
        provider,
        isLive,
        durationMs,
        costEstimate: `Rp ${costIdr}`,
        keysDetected,
      },
    });
  } catch (error: any) {
    console.error("AI Photoshoot error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
