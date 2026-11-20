import { NextResponse } from "next/server";
import { logAiThirdParty, inspectAiKeys } from "@/lib/ai-logger";

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const body = await request.json();
    const {
      name = "Busana Muslim Modest",
      category = "Gamis",
      material = "Katun Toyobo & Armani Silk",
      priceIdr,
    } = body;

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    let generatedDescription = "";
    let provider = "mock-sandbox";
    let isLive = false;

    // 1. Try Google Gemini API (gemini-2.5-flash / gemini-1.5-flash)
    if (geminiKey && !geminiKey.includes("your_")) {
      try {
        provider = "google-gemini";
        const promptText = `Anda adalah fashion copywriter profesional untuk brand modest muslimah Indonesia "Rahayu Fashion Store" (setara Hijup/Buttonscarves).
Tuliskan deskripsi produk yang elegan, persuasif, dan SEO friendly dalam Bahasa Indonesia untuk:
- Nama Produk: ${name}
- Kategori: ${category}
- Bahan Material: ${material}
${priceIdr ? `- Harga: Rp ${Number(priceIdr).toLocaleString("id-ID")}` : ""}

Format output:
1. Paragraf pembuka filosofi desain & keanggunan (2-3 kalimat santun).
2. "Keunggulan & Spesifikasi": poin-poin fitur utama (Bahan, Busui Friendly, Wudhu Friendly, Saku, Finishing).
3. "Petunjuk Perawatan": instruksi mencuci yang benar.
4. "Tagar SEO": 5 hashtag populer terkait modest fashion.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const candidateText =
            data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            generatedDescription = candidateText.trim();
            isLive = true;
          }
        }
      } catch (err) {
        console.warn("Gemini API call failed, falling back:", err);
      }
    }

    // 2. Try OpenAI API
    if (!generatedDescription && openaiKey && !openaiKey.includes("your_")) {
      try {
        provider = "openai-gpt";
        const oaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "Anda adalah fashion copywriter brand busana muslimah elegan ala Hijup.",
              },
              {
                role: "user",
                content: `Tuliskan deskripsi produk untuk "${name}" kategori "${category}".`,
              },
            ],
            temperature: 0.7,
          }),
        });

        if (oaiRes.ok) {
          const data = await oaiRes.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            generatedDescription = content.trim();
            isLive = true;
          }
        }
      } catch (err) {
        console.warn("OpenAI API call failed:", err);
      }
    }

    // 3. Fallback / Template Sandbox
    if (!generatedDescription) {
      provider = "template-engine";
      isLive = false;
      generatedDescription = `${name} dirancang khusus untuk wanita muslimah modern yang mengutamakan keanggunan, kenyamanan, dan nilai kesopanan syar'i. Dibuat dengan siluet jatuh (flowy) yang elegan dan tidak menjiplak lekuk tubuh.

Keunggulan & Spesifikasi:
• Material Utama: ${material || "Premium High-Grade Fabric"} bertekstur halus, sejuk di kulit, menyerap keringat, dan tidak menerawang.
• Akses Resleting: Resleting depan tersembunyi (Busui Friendly) yang praktis dan rapi.
• Desain Lengan: Manset elastis manis (Wudhu Friendly) yang mudah dinaikkan saat berwudhu.
• Fitur Tambahan: Saku samping fungsional kanan-kiri yang tersembunyi rapi.
• Rekomendasi Pemakaian: Ideal untuk busana kondangan, pesta keluarga, pengajian formal, hingga daily modest look.

Petunjuk Perawatan:
Cuci dengan tangan atau putaran mesin lembut suhu air normal. Hindari pemutih pakaian, jemur di tempat teduh, dan setrika dengan suhu sedang untuk menjaga kelembutan serat kain.

#RahayuFashion #${category.replace(/\s+/g, "")} #ModestFashionID #GamisSyari #HijabStyle2026`;
    }

    const durationMs = Date.now() - startTime;
    const keysDetected = inspectAiKeys();

    logAiThirdParty({
      service: "AI SEO Copywriter",
      provider,
      isLive,
      endpoint: isLive ? (provider === "google-gemini" ? "https://generativelanguage.googleapis.com (Gemini 1.5 Flash)" : "https://api.openai.com (GPT-4o-mini)") : undefined,
      durationMs,
      inputs: {
        productName: name,
        category,
        material,
        priceIdr: priceIdr ? `Rp ${priceIdr}` : "-",
      },
      outputPreview: generatedDescription,
      keysDetected,
      note: isLive
        ? `Copywriting berhasil di-generate secara live via model LLM ${provider}.`
        : "Saat ini menggunakan Template Engine Modest Standar. Pasang GEMINI_API_KEY di .env untuk generative AI live copywriting tanpa batas.",
    });

    return NextResponse.json({
      success: true,
      isLive,
      provider,
      description: generatedDescription,
      _devDiagnostics: {
        service: "AI SEO Copywriter",
        provider,
        isLive,
        durationMs,
        keysDetected,
      },
    });
  } catch (error: any) {
    console.error("AI Copywriting error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
