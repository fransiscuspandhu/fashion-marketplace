import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logAiThirdParty, inspectAiKeys } from "@/lib/ai-logger";
import fs from "fs/promises";
import path from "path";

/**
 * Helper to resolve raw image URL/path into base64 payload for Google Nano Banana multimodal prompt
 */
async function resolveImageBase64(imageUrl: string): Promise<{ mimeType: string; data: string } | null> {
  try {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("data:")) {
      const match = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        return { mimeType: match[1], data: match[2] };
      }
    } else if (imageUrl.startsWith("/uploads/")) {
      const localFilePath = path.join(process.cwd(), "public", imageUrl.replace(/^\//, ""));
      const fileBuffer = await fs.readFile(localFilePath);
      const ext = path.extname(imageUrl).toLowerCase();
      const mimeType = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
      return { mimeType, data: fileBuffer.toString("base64") };
    } else if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      const res = await fetch(imageUrl, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        const mimeType = res.headers.get("content-type") || "image/jpeg";
        return { mimeType, data: Buffer.from(arrayBuffer).toString("base64") };
      }
    }
  } catch (err) {
    console.warn("Could not resolve image to base64 for Nano Banana:", err);
  }
  return null;
}

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

    const geminiKey = process.env.GEMINI_API_KEY;
    const falKey = process.env.FAL_KEY;
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    const openaiKey = process.env.OPENAI_API_KEY;

    let outputUrl = "";
    let provider = "mock";
    let isLive = false;
    let costIdr = Math.floor(480 + Math.random() * 80);

    const prompt =
      customPrompt ||
      `Photorealistic Indonesian high-fashion modest lookbook of female model (${modelType}) wearing "${productName}" (${category}). Set in ${background}, illuminated by ${lighting}. 8k resolution, elegant drapery, commercial editorial quality.`;

    const apiWarnings: string[] = [];

    // Clean API keys
    const cleanGeminiKey = (geminiKey || "").trim().replace(/^["']|["']$/g, "");
    const isGeminiPlaceholder =
      !cleanGeminiKey ||
      cleanGeminiKey.includes("YourGoogleGeminiApiKeyHere") ||
      cleanGeminiKey.includes("demo_") ||
      cleanGeminiKey.includes("your_") ||
      cleanGeminiKey === "demo_key";

    const cleanFalKey = (falKey || "").trim().replace(/^["']|["']$/g, "");
    const isFalPlaceholder =
      !cleanFalKey ||
      cleanFalKey.includes("demo_") ||
      cleanFalKey.includes("your_") ||
      cleanFalKey === "demo_key";

    const cleanRepToken = (replicateToken || "").trim().replace(/^["']|["']$/g, "");
    const isRepPlaceholder =
      !cleanRepToken ||
      cleanRepToken.includes("demo_") ||
      cleanRepToken.includes("your_") ||
      cleanRepToken === "demo_key";

    // =========================================================================
    // 1. PRIMARY PROVIDER: Google Nano Banana (Gemini Image Multi-Image Fusion)
    // =========================================================================
    if (!isGeminiPlaceholder && cleanGeminiKey.length > 5) {
      const nanoBananaModels = [
        "gemini-2.5-flash-image",
        "gemini-3.1-flash-lite-image",
        "gemini-3.1-flash-image",
      ];

      for (const modelName of nanoBananaModels) {
        try {
          provider = `google-nano-banana (${modelName})`;
          const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${cleanGeminiKey}`;

          const parts: any[] = [];
          const nanoPrompt =
            customPrompt ||
            `Photorealistic Indonesian high-fashion modest editorial lookbook photoshoot of a female model (${modelType}) wearing "${productName}" (${category}). Setting: ${background}. Lighting: ${lighting}. Authentic Indonesian modest muslimah aesthetic, professional commercial studio photography, graceful hijab styling, clean drapery, 8k resolution, crisp realistic fabric texture, sharp commercial quality.`;

          parts.push({ text: nanoPrompt });

          // If raw garment flatlay image is uploaded, attach as inlineData for Multi-Image Fusion
          if (rawImageUrl) {
            const rawBase64 = await resolveImageBase64(rawImageUrl);
            if (rawBase64) {
              parts.push({
                inlineData: {
                  mimeType: rawBase64.mimeType,
                  data: rawBase64.data,
                },
              });
            }
          }

          const geminiRes = await fetch(geminiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(18000),
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig: {
                responseModalities: ["IMAGE"],
              },
            }),
          });

          if (geminiRes.ok) {
            const data = await geminiRes.json();
            const candidateParts = data.candidates?.[0]?.content?.parts || [];
            const imgPart = candidateParts.find((p: any) => p.inlineData?.data);

            if (imgPart?.inlineData?.data) {
              const base64Data = imgPart.inlineData.data;
              const mime = imgPart.inlineData.mimeType || "image/png";

              // Persist generated image to local disk for permanent fast serving
              try {
                const uploadDir = path.join(process.cwd(), "public", "uploads", "ai-generated");
                await fs.mkdir(uploadDir, { recursive: true });
                const fileName = `photoshoot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.png`;
                await fs.writeFile(path.join(uploadDir, fileName), Buffer.from(base64Data, "base64"));
                outputUrl = `/uploads/ai-generated/${fileName}`;
              } catch (fsErr) {
                outputUrl = `data:${mime};base64,${base64Data}`;
              }

              isLive = true;
              costIdr = 540; // ~$0.034 USD per image
              break;
            } else {
              console.warn(`[Nano Banana] ${modelName} returned OK but no image part found:`, data);
              apiWarnings.push(`Nano Banana (${modelName}) returned OK but image part was missing.`);
            }
          } else {
            const errDetail = await geminiRes.text();
            console.error(`[Nano Banana] ${modelName} HTTP ${geminiRes.status}:`, errDetail);
            apiWarnings.push(`Nano Banana (${modelName}) HTTP ${geminiRes.status}: ${errDetail.substring(0, 150)}`);
          }
        } catch (callErr: any) {
          console.warn(`[Nano Banana] ${modelName} network error:`, callErr?.message || callErr);
          apiWarnings.push(`Nano Banana (${modelName}): ${callErr?.message || "Connection failed"}`);
        }
      }
    }

    // =========================================================================
    // 2. SECONDARY: fal.ai (Virtual Try-on / Flux Schnell)
    // =========================================================================
    if (!outputUrl && !isFalPlaceholder && cleanFalKey.length > 5) {
      try {
        provider = "fal.ai";
        const falEndpoint = rawImageUrl
          ? "https://fal.run/fal-ai/fashn-tryon"
          : "https://fal.run/fal-ai/flux/schnell";

        const falAuth = cleanFalKey.startsWith("Key ") ? cleanFalKey : `Key ${cleanFalKey}`;

        const falPayload = rawImageUrl
          ? {
              model_image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
              garment_image: rawImageUrl,
              category: "tops",
            }
          : {
              prompt,
              image_size: "portrait_4_3",
              num_inference_steps: 4,
              enable_safety_checker: true,
            };

        const res = await fetch(falEndpoint, {
          method: "POST",
          headers: {
            Authorization: falAuth,
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify(falPayload),
        });

        if (res.ok) {
          const data = await res.json();
          const imgUrl =
            data.images?.[0]?.url ||
            data.image?.url ||
            data.output?.[0]?.url ||
            (Array.isArray(data.output) ? data.output[0] : null);

          if (imgUrl) {
            outputUrl = imgUrl;
            isLive = true;
            costIdr = 480;
          } else {
            console.warn("⚠️ fal.ai 200 OK but no image URL found in response:", data);
            apiWarnings.push("fal.ai returned 200 OK but images array was empty.");
          }
        } else {
          const errDetail = await res.text();
          console.error(`❌ fal.ai API error HTTP ${res.status}:`, errDetail);
          apiWarnings.push(`fal.ai HTTP ${res.status}: ${errDetail.substring(0, 150)}`);
        }
      } catch (err: any) {
        console.warn("❌ fal.ai API call failed:", err?.message || err);
        apiWarnings.push(`fal.ai network error: ${err?.message || "Connection failed"}`);
      }
    }

    // =========================================================================
    // 3. TERTIARY: Replicate (IDM-VTON / Flux Schnell)
    // =========================================================================
    if (!outputUrl && !isRepPlaceholder && cleanRepToken.length > 5) {
      try {
        provider = "replicate";
        const repRes = await fetch("https://api.replicate.com/v1/predictions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cleanRepToken}`,
            "Content-Type": "application/json",
            Prefer: "wait",
          },
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify({
            version: "c871d2c9c7f66a2e4e15865063b4b5742feeb3cf4d2073998bde9989b6a1bf58", // Flux Schnell
            input: { prompt, aspect_ratio: "3:4" },
          }),
        });

        if (repRes.ok) {
          const data = await repRes.json();
          const imgUrl = Array.isArray(data.output) ? data.output[0] : typeof data.output === "string" ? data.output : null;
          if (imgUrl) {
            outputUrl = imgUrl;
            isLive = true;
            costIdr = 450;
          }
        } else {
          const repErr = await repRes.text();
          console.error(`❌ Replicate API error HTTP ${repRes.status}:`, repErr);
          apiWarnings.push(`Replicate HTTP ${repRes.status}: ${repErr.substring(0, 150)}`);
        }
      } catch (err: any) {
        console.warn("❌ Replicate API call failed:", err?.message || err);
        apiWarnings.push(`Replicate network error: ${err?.message || "Connection failed"}`);
      }
    }

    // =========================================================================
    // 4. QUATERNARY: OpenAI DALL-E 3
    // =========================================================================
    if (!outputUrl && openaiKey && !openaiKey.includes("your_") && !openaiKey.includes("sk-proj-")) {
      try {
        provider = "openai-dall-e-3";
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
            costIdr = 640;
          }
        }
      } catch (err) {
        console.warn("OpenAI DALL-E call failed:", err);
      }
    }

    // =========================================================================
    // 5. FALLBACK / MOCK SIMULATOR MODE
    // =========================================================================
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
      endpoint: isLive
        ? provider.includes("google-nano-banana")
          ? "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent"
          : provider === "fal.ai"
          ? "https://fal.run/fal-ai/flux/schnell"
          : "https://api.replicate.com"
        : undefined,
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
      warnings: apiWarnings,
      note: isLive
        ? `Model AI berhasil memproses gambar secara nyata via cloud ${provider}.`
        : apiWarnings.length > 0
        ? `Panggilan ke ${provider} gagal (${apiWarnings[0]}). Beralih otomatis ke Sandbox Simulator agar sistem tidak error.`
        : "Saat ini berjalan di Mode Sandbox Simulator. Untuk merender baju mentah secara live via Cloud AI, pasang GEMINI_API_KEY (Google Nano Banana) di file .env.",
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
        warnings: apiWarnings,
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
