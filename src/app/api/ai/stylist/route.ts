import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message = "", history = [] } = body;

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    let reply = "";
    let provider = "mock-sandbox";
    let isLive = false;

    // 1. Try Google Gemini API
    if (geminiKey && !geminiKey.includes("your_")) {
      try {
        provider = "google-gemini";
        const systemPrompt = `Anda adalah "Stylist Rahayu AI", asisten fashion stylist pribadi resmi dari Rahayu Fashion Store.
Karakter Anda:
- Ramah, anggun, santun (menggunakan sapaan hangat seperti "Sis" / "Kakak", "Assalamu'alaikum Sis").
- Ahli dalam modest muslimah fashion, padu-padan hijab voal ultrafine, gamis syari, tunik silk, baju hamil & menyusui (busui friendly), dan pakaian anak.
- Selalu memberikan rekomendasi warna yang serasi, tips bahan yang adem untuk iklim tropis, dan mengarahkan ke koleksi Rahayu Fashion Store.
- Jawab dengan ringkas (2-3 paragraf pendek), berikan bullet point jika memberikan tips padanan.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                { role: "user", parts: [{ text: `${systemPrompt}\n\nPertanyaan pembeli: ${message}` }] },
              ],
              generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            reply = candidateText.trim();
            isLive = true;
          }
        }
      } catch (err) {
        console.warn("Gemini Stylist API failed, falling back:", err);
      }
    }

    // 2. Try OpenAI API
    if (!reply && openaiKey && !openaiKey.includes("your_")) {
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
                  "Anda adalah Stylist Rahayu AI, asisten fashion stylist busana muslimah santun dan elegan.",
              },
              { role: "user", content: message },
            ],
            temperature: 0.7,
          }),
        });

        if (oaiRes.ok) {
          const data = await oaiRes.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            reply = content.trim();
            isLive = true;
          }
        }
      } catch (err) {
        console.warn("OpenAI Stylist API failed:", err);
      }
    }

    // 3. Fallback / Knowledge Engine
    if (!reply) {
      provider = "built-in-knowledge";
      isLive = false;
      const q = message.toLowerCase();

      if (q.includes("lilac") || q.includes("gamis") || q.includes("jilbab")) {
        reply =
          "Untuk nuansa **Gamis Lilac**, padanan terbaik adalah jilbab warna **Muted Khaki, Dusty Rose, atau Broken White**. Warna-warna ini memberikan kontras lembut yang anggun tanpa membuat tampilan terlihat mencolok. Sis bisa padukan dengan koleksi Hijab Voal Ultrafine kami yaa!";
      } else if (q.includes("kondangan") || q.includes("pesta") || q.includes("elegan")) {
        reply =
          "Untuk acara **Kondangan Formal**, kami sangat rekomendasikan bahan **Silk Roberto Cavalli** dengan aksen drapery halus. Tambahkan sentuhan jilbab silk berkilau lembut dan clutch bag berwarna gold/champagne agar terlihat mewah namun tetap syar'i.";
      } else if (q.includes("adem") || q.includes("harian") || q.includes("panas")) {
        reply =
          "Bahan paling sejuk dan menyerap keringat seharian adalah **Katun Toyobo Fodu** dan **Rayon Twill**. Karakteristik serat alaminya membuat Sis tetap sejuk seharian di cuaca tropis tanpa gerah sama sekali!";
      } else if (q.includes("hamil") || q.includes("busui") || q.includes("menyusui")) {
        reply =
          "Untuk ibu hamil dan menyusui, pilihlah potongan A-line longgar dengan **resleting depan tersembunyi (Busui Friendly)** berbahan katun organik atau katun bambu elastis yang tidak menekan perut dan memudahkan pemberian ASI.";
      } else {
        reply =
          `Terima kasih atas pertanyaannya Sis! Untuk gaya yang anggun dan nyaman sehari-hari, Rahayu Fashion merekomendasikan paduan warna earth-tone lembut (seperti Sage, Muted Rose, atau Warm Cream) dengan hijab voal premium. Ada yang ingin Sis tanyakan lebih lanjut seputar ukuran atau bahan?`;
      }
    }

    return NextResponse.json({
      success: true,
      isLive,
      provider,
      reply,
    });
  } catch (error: any) {
    console.error("AI Stylist error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
