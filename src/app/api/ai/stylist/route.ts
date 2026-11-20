import { NextResponse } from "next/server";
import { logAiThirdParty, inspectAiKeys } from "@/lib/ai-logger";

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const body = await request.json();
    const { message = "", history = [] } = body;

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    let reply = "";
    let provider = "mock-sandbox";
    let isLive = false;
    let categoryHint = "Semua";
    let keywordHints: string[] = [];

    // 1. Try Google Gemini API (Real Generative AI)
    if (geminiKey && !geminiKey.includes("your_")) {
      try {
        provider = "google-gemini";
        const systemPrompt = `Anda adalah "Stylist Rahayu AI", asisten fashion stylist profesional & konsultan busana muslimah resmi dari Rahayu Fashion Store (toko modest fashion muslimah premium Indonesia ala Hijup).
Kepribadian & Karakter:
- Sangat ramah, hangat, santun, dan elegan (gunakan sapaan khas seperti "Assalamu'alaikum Sis cantik ✨", "Halo Kakak shalihah", atau "Halo Sis!").
- Berwawasan luas seputar color theory, padu padan warna (khususnya untuk warna kulit wanita Indonesia seperti sawo matang & kuning langsat), etika busana syar'i, pemilihan bahan (Toyobo, Armani Silk, Voal Ultrafine, Ceruty), serta tips busui/wudhu friendly.
- Format jawaban rapi: berikan 2-3 paragraf pendek atau poin-poin tips praktis yang langsung bisa diterapkan.
- Rekomendasikan jenis koleksi yang tersedia di Rahayu Fashion (Hijab Voal, Gamis Syar'i, Tunik Silk, Koko Pria, Mukena, Busana Anak).`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(4000),
            body: JSON.stringify({
              contents: [
                { role: "user", parts: [{ text: `${systemPrompt}\n\nPertanyaan Pembeli: ${message}` }] },
              ],
              generationConfig: { temperature: 0.75, maxOutputTokens: 500 },
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
        console.warn("Gemini Stylist API failed, falling back to smart knowledge engine:", err);
      }
    }

    // 2. Try OpenAI API (Alternative Live LLM)
    if (!reply && openaiKey && !openaiKey.includes("your_")) {
      try {
        provider = "openai-gpt";
        const oaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(4000),
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "Anda adalah Stylist Rahayu AI, fashion stylist pribadi busana muslimah elegan, santun, dan modern dari Rahayu Fashion Store.",
              },
              { role: "user", content: message },
            ],
            temperature: 0.75,
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
        console.warn("OpenAI Stylist API failed, falling back to smart knowledge engine:", err);
      }
    }

    // 3. Smart Modest Fashion Knowledge Engine v2.0 (Dynamic & Multi-Topic Matching)
    if (!reply) {
      provider = "smart-knowledge-engine";
      isLive = false;
      const q = message.toLowerCase();

      // Variations of opening & closing greetings for human-like feeling
      const greetings = [
        "Assalamu'alaikum Sis cantik! ✨",
        "Halo Sis! Pertanyaan yang bagus banget nih ✨",
        "Assalamu'alaikum Kakak shalihah! Senang bisa bantu Kakak hari ini 💖",
        "Hai Sis! Pilihan outfit yang tepat bikin percaya diri seharian lho ✨",
        "Wah, ide yang menarik banget Sis! Yuk simak rekomendasi Stylist Rahayu berikut ya:",
      ];
      const closings = [
        "Semoga padu-padan ini menginspirasi ya Sis! Ada yang mau ditanyakan lagi seputar size atau bahan?",
        "Koleksi di atas ready stock di butik kami lho Sis. Mau saya bantu cek detail ukurannya?",
        "Sis bisa langsung klik 'Beli' di bawah untuk memasukkan ke keranjang belanja yaa! ✨",
        "Jika Sis butuh rekomendasi warna lainnya, jangan ragu untuk tanya lagi ya Sis!",
      ];

      const pickGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      const pickClosing = closings[Math.floor(Math.random() * closings.length)];

      // A. WARNA KULIT (Skin Tone Color Theory)
      if (q.includes("sawo matang") || q.includes("kulit sawo") || q.includes("kulit eksotis") || q.includes("kulit gelap")) {
        categoryHint = "Hijab";
        keywordHints = ["voal", "scarf", "earth tone"];
        reply = `${pickGreeting}
Untuk kulit sawo matang eksotis khas wanita Indonesia, kunci utamanya adalah memilih warna yang memberi efek *cerah alami* (glowing) tanpa membuat wajah terlihat kusam:

• **Warna Paling Juara:** Earth-tone hangat seperti **Mocca, Terracotta, Mustard, Sage Green, dan Warm Beige**.
• **Warna Bold:** Emerald green (hijau zamrud), Navy gelap, dan Maroon tua juga sangat memukau dan memberi kesan mewah.
• **Warna yang Sebaiknya Dihindari:** Warna neon terlalu mencolok atau warna abu-abu pucat (ash grey) karena bisa memberi kesan 'mati' di wajah.

${pickClosing}`;
      } else if (q.includes("kuning langsat") || q.includes("kulit putih") || q.includes("kulit cerah")) {
        categoryHint = "Hijab";
        keywordHints = ["lilac", "plum", "pastel"];
        reply = `${pickGreeting}
Untuk warna kulit kuning langsat dan cerah, Sis sangat beruntung karena hampir semua warna masuk! Tapi ini dia palet warna yang paling bikin aura Sis terpancar:

• **Warna Pastel Lembut:** **Dusty Lilac, Blush Pink, Baby Blue, dan Mint Green** akan memberi kesan manis, anggun, dan segar.
• **Warna Kontras Elegan:** Burgundy, Royal Navy, dan Dark Chocolate memberikan kontras dramatis yang sangat mempesona untuk acara formal.

${pickClosing}`;
      }

      // B. PADANAN WARNA KHUSUS
      else if (q.includes("lilac") || q.includes("lavender") || q.includes("ungu")) {
        categoryHint = "Hijab";
        keywordHints = ["voal", "scarf", "lilac"];
        reply = `${pickGreeting}
Untuk padu-padan nuansa **Lilac / Lavender** yang lagi tren, berikut kombinasi warna terbaiknya:

1. **Gaya Soft & Girly:** Padukan dengan jilbab warna **Dusty Rose, Broken White, atau Muted Khaki**. Nuansa ini sangat manis dan tidak tabrakan.
2. **Gaya Modern Chic:** Padukan dengan **Light Grey atau Soft Taupe** untuk tampilan kantor atau casual elegan.
3. **Pilihan Bahan:** Gunakan bahan **Voal Ultrafine** yang tidak licin dan tegak sempurna di dahi.

${pickClosing}`;
      } else if (q.includes("sage") || q.includes("hijau") || q.includes("olive")) {
        categoryHint = "Gamis";
        keywordHints = ["sage", "gamis", "tunik"];
        reply = `${pickGreeting}
Warna **Sage Green** adalah warna paling favorit karena memberi kesan menenangkan dan sejuk! Ini padanan paling serasinya:

• **Hijab:** Warna **Cream/Beige, Nude Mocca, atau Broken White** adalah jodoh terbaik untuk gamis/tunik Sage Green.
• **Aksesoris & Tas:** Padukan dengan tas atau heels berwarna earth-tone seperti tan leather atau gold soft.

${pickClosing}`;
      } else if (q.includes("hitam") || q.includes("black") || q.includes("monokrom") || q.includes("monochrome")) {
        categoryHint = "Abaya";
        keywordHints = ["abaya", "black", "gamis"];
        reply = `${pickGreeting}
Busana hitam (*black modest look*) tidak pernah salah dan selalu memberi siluet tubuh yang lebih ramping serta mewah! Tips styling-nya:

• **Abaya / Gamis Hitam Polos:** Berikan aksen jilbab bercorak lembut (misal Voal Pattern Monogram) atau jilbab warna Mocca/Champagne agar tidak monoton.
• **All-Black Syar'i:** Jika ingin serba hitam, mainkan tekstur bahan seperti perpaduan Jetblack Saudi dengan aksen Ceruty flowy atau lace halus di pergelangan tangan.

${pickClosing}`;
      } else if (q.includes("maroon") || q.includes("merah") || q.includes("burgundy") || q.includes("terracotta")) {
        categoryHint = "Gamis";
        keywordHints = ["gamis", "silk"];
        reply = `${pickGreeting}
Warna **Maroon & Terracotta** memancarkan wibawa dan keberanian yang santun! Ini trik padu-padannya:

• **Kombinasi Hijab:** Seimbangkan intensitas warna maroon dengan jilbab berwarna netral hangat seperti **Warm Nude, Soft Gold, atau Champagne**.
• **Untuk Acara Malam:** Bahan Armani Silk warna maroon sangat berkilau indah di bawah pencahayaan lampu pesta.

${pickClosing}`;
      }

      // C. ACARA & SITUASI (Occasions)
      else if (q.includes("kondangan") || q.includes("pesta") || q.includes("resepsi") || q.includes("pernikahan") || q.includes("nikahan") || q.includes("bridesmaid")) {
        categoryHint = "Gamis";
        keywordHints = ["silk", "gamis", "tunik"];
        reply = `${pickGreeting}
Untuk menghadiri **Kondangan atau Pesta Pernikahan**, kenyamanan dan kemewahan syar'i harus seimbang:

• **Pilihan Bahan:** Sangat direkomendasikan **Armani Silk Roberto Cavalli** dengan siluet jatuh (flowy) dan kilau sutra yang anggun.
• **Detail Desain:** Pilih model dengan aksen lipit drapery di pinggang atau lengan lonceng wudhu-friendly.
• **Sentuhan Hijab:** Kenakan hijab voal laser-cut atau silk scarf polos dengan bros mutiara minimalis.

${pickClosing}`;
      } else if (q.includes("wisuda") || q.includes("sidang") || q.includes("yudisium")) {
        categoryHint = "Tunik";
        keywordHints = ["tunik", "silk", "batik"];
        reply = `${pickGreeting}
Selamat atas kelulusannya ya Sis! 🎉 Untuk momen wisuda atau sidang akademik:

• **Rekomendasi Outfit:** Setelan **Tunik Silk Modern** dipadukan dengan kain lilit/rok songket halus atau celana kulot flowy berpotongan lurus.
• **Hijab:** Pilih **Hijab Segi Empat Voal Ultrafine** yang anti-letoy dan tegak kokoh saat memakai toga wisuda.
• **Warna:** Pilihlah warna pastel segar (Dusty Blue, Muted Rose, Champagne) agar hasil foto wisuda tampak cerah dan abadi.

${pickClosing}`;
      } else if (q.includes("lebaran") || q.includes("idul fitri") || q.includes("raya") || q.includes("sarimbit") || q.includes("keluarga")) {
        categoryHint = "Gamis";
        keywordHints = ["gamis", "koko", "sarimbit"];
        reply = `${pickGreeting}
Menjelang Hari Raya Idul Fitri, tren busana lebaran 2026 mengedepankan nuansa elegan yang adem untuk silaturahmi seharian:

• **Koleksi Sarimbit Keluarga:** Kami menghadirkan setelan gamis ibu & anak dengan motif senada, serta baju koko pria lengan panjang berkerah shanghai modern.
• **Material:** Katun Toyobo mix Ceruty berpori sejuk agar tidak gerah saat berkeliling silaturahmi ke rumah sanak keluarga.
• **Palet Raya 2026:** Nuansa Olive Sage, Royal Plum, dan Warm Almond menjadi primadona tahun ini!

${pickClosing}`;
      } else if (q.includes("kuliah") || q.includes("kampus") || q.includes("santai") || q.includes("casual") || q.includes("hangout") || q.includes("jalan")) {
        categoryHint = "Tunik";
        keywordHints = ["tunik", "katun", "daily"];
        reply = `${pickGreeting}
Untuk gaya **Casual ke Kampus atau Hangout Santai**, kuncinya adalah *effortless & cozy*:

• **Atasan:** Tunik berpotongan longgar bahan Katun Toyobo atau Crinkle Airflow yang **bebas setrika**.
• **Bawahan:** Padukan dengan kulot linen atau celana palazzo longgar yang leluasa untuk mobilitas tinggi.
• **Hijab:** Pashmina kaos instan atau voal segi empat simpel dengan sneakers favorit Sis!

${pickClosing}`;
      } else if (q.includes("kantor") || q.includes("kerja") || q.includes("meeting") || q.includes("ngantor") || q.includes("formal")) {
        categoryHint = "Tunik";
        keywordHints = ["tunik", "kemeja", "formal"];
        reply = `${pickGreeting}
Untuk busana **Kantor & Bisnis Syar'i (Professional Modest Wear)**:

• **Outfit:** Tunik semi-blazer atau kemeja tunik berkerah formal dengan kancing depan rapi.
• **Palet Warna:** Navy, Ash Grey, Khaki, atau Cream untuk memancarkan aura kredibilitas dan profesional.
• **Bawahan:** Celana bahan berpotongan semi-flare atau rok plisket A-line dengan sepatu pantofel/mules.

${pickClosing}`;
      } else if (q.includes("pengajian") || q.includes("majelis") || q.includes("umroh") || q.includes("haji")) {
        categoryHint = "Abaya";
        keywordHints = ["abaya", "mukena", "syari"];
        reply = `${pickGreeting}
Untuk acara **Pengajian, Majelis Taklim, atau Perjalanan Umroh/Haji**:

• **Pilihan Busana:** Abaya potongan longgar (tidak membentuk lekuk tubuh sama sekali) berbahan Jetblack atau Katun Arab berpori sejuk.
• **Karakteristik:** Wudhu-friendly dengan manset berkancing/karet elastis serta saku samping praktis untuk menyimpan buku doa/tasbih.
• **Hijab:** Khimar panjang instan atau pashmina syar'i berbahan ceruty babydoll 2 layer.

${pickClosing}`;
      }

      // D. POSTUR TUBUH (Body Type Styling)
      else if (q.includes("mungil") || q.includes("pendek") || q.includes("petite")) {
        categoryHint = "Gamis";
        keywordHints = ["gamis", "tunik"];
        reply = `${pickGreeting}
Untuk Sis yang bertubuh **Mungil (Petite)**, ini rahasia agar terlihat lebih jenjang dan proporsional:

• **Pilih Potongan A-Line:** Hindari gamis atau tunik yang terlalu bertumpuk-tumpuk (undak-undak berlebihan).
• **Monokrom Look:** Memakai warna atasan, bawahan, dan hijab yang senada (satu rumpun warna) menciptakan ilusi garis vertikal yang membuat tubuh terlihat lebih tinggi.
• **Panjang Baju:** Pastikan ujung gamis pas di atas mata kaki, jangan sampai menyapu lantai terlalu panjang.

${pickClosing}`;
      } else if (q.includes("gemuk") || q.includes("berisi") || q.includes("plus size") || q.includes("besar") || q.includes("perut")) {
        categoryHint = "Gamis";
        keywordHints = ["gamis", "loose", "abaya"];
        reply = `${pickGreeting}
Untuk postur tubuh **Berisi / Plus Size**, kenyamanan dan siluet ramping bisa didapat dengan trik ini:

• **Siluet Jatuh (Flowy):** Gunakan bahan seperti Ceruty Babydoll atau Rayon Twill yang jatuh lemas mengikuti gerakan tubuh dan tidak kaku mengembang.
• **Potongan Bawah Dada (Empire Waist):** Aksen kerutan tipis tepat di bawah dada memberi ilusi pinggang lebih tinggi dan menyamarkan area perut/pinggul.
• **Motif:** Pilih motif bunga kecil-kecil (micro-floral) atau warna-warna bold gelap seperti Navy, Pine Green, dan Dark Maroon.

${pickClosing}`;
      } else if (q.includes("hamil") || q.includes("busui") || q.includes("menyusui") || q.includes("bumil")) {
        categoryHint = "Gamis";
        keywordHints = ["busui", "gamis", "tunik"];
        reply = `${pickGreeting}
Kenyamanan ibu dan buah hati adalah prioritas utama! Koleksi **Baju Hamil & Busui Friendly** di Rahayu Fashion dirancang khusus:

• **Akses Menyusui Tersembunyi:** Resleting jepang vertikal kanan-kiri yang lebar, sangat praktis saat menyusui di ruang publik tanpa perlu membuka banyak kancing.
• **Bahan Serat Alami:** Katun Toyobo Fodu & Katun Bambu Organik yang anti-alergi, adem, dan menyerap keringat berlebih ibu hamil.
• **Ruang Perut Ekstra:** Potongan lipit depan yang fleksibel mengikuti perkembangan lingkar perut trimester 1 hingga 9 bulan.

${pickClosing}`;
      }

      // E. KATEGORI KHUSUS (Pria, Anak, Hijab, Mukena)
      else if (q.includes("koko") || q.includes("pria") || q.includes("suami") || q.includes("cowok") || q.includes("laki")) {
        categoryHint = "Pria";
        keywordHints = ["koko", "pria", "kemko"];
        reply = `${pickGreeting}
Untuk koleksi busana muslim pria (Baju Koko & Kemeja Koko Modern):

• **Model Favorit:** Koko lengan panjang berkerah shanghai dengan aksen bordir geometris minimalis di dada.
• **Material:** Katun Oxford & Katun Madinah bertekstur two-tone yang adem, tebal tidak menerawang, namun tetap ringan dipakai salat Jumat atau acara keluarga.
• **Warna Senada:** Tersedia warna Sage, Muted Denim, Mocca, dan Broken White yang bisa dicocokkan dengan gamis istri ya Sis!

${pickClosing}`;
      } else if (q.includes("anak") || q.includes("kids") || q.includes("balita") || q.includes("putri") || q.includes("anak perempuan")) {
        categoryHint = "Anak";
        keywordHints = ["anak", "kids", "gamis anak"];
        reply = `${pickGreeting}
Untuk si kecil tersayang, faktor nomor 1 adalah **kelembutan dan kebebasan bergerak**:

• **Gamis Anak Rahayu:** Menggunakan 100% Katun Combed Premium & Katun Jepang lembut yang ramah kulit sensitif anak.
• **Jilbab Instan:** Dilengkapi pet elastis tanpa jarum pentul yang aman, langsung slup dan tidak mudah copot saat anak aktif bermain.
• **Tersedia Ukuran:** Usia 2 tahun hingga 12 tahun dengan warna-warna ceria menggemaskan!

${pickClosing}`;
      } else if (q.includes("mukena") || q.includes("sholat") || q.includes("salat") || q.includes("ibadah")) {
        categoryHint = "Mukena";
        keywordHints = ["mukena", "silk", "renda"];
        reply = `${pickGreeting}
Koleksi **Mukena Silk & Travelling** Rahayu Fashion:

• **Mukena Silk Premium:** Berbahan Silk Armani berkilau mewah dengan renda giper halus keliling. Sangat nyaman dan sejuk untuk salat tarawih maupun hantaran mahar pernikahan.
• **Mukena Mini Pouch Parasut Korea:** Sangat ringkas (seukuran genggaman tangan) dan kedap air, pas banget masuk ke tas kantor untuk ibadah di mana saja.

${pickClosing}`;
      } else if (q.includes("pashmina") || q.includes("segi empat") || q.includes("hijab") || q.includes("jilbab") || q.includes("kerudung")) {
        categoryHint = "Hijab";
        keywordHints = ["voal", "hijab", "pashmina"];
        reply = `${pickGreeting}
Bingung memilih antara **Hijab Segi Empat vs Pashmina**? Ini panduannya:

• **Hijab Segi Empat Voal Ultrafine:** Paling pas untuk Sis yang menyukai kepraktisan, wajah tirus, dan jilbab yang tegak melengkung sempurna seharian tanpa gampang kusut.
• **Pashmina Ceruty / Silk:** Paling cocok untuk Sis yang suka gaya drape anggun menjuntai ke dada ala selebgram muslimah untuk acara formal.

${pickClosing}`;
      }

      // F. PROMO & HARGA
      else if (q.includes("promo") || q.includes("diskon") || q.includes("voucher") || q.includes("murah") || q.includes("gajian") || q.includes("payday")) {
        categoryHint = "Semua";
        keywordHints = ["promo", "payday", "flash sale"];
        reply = `${pickGreeting}
Kabar gembira buat Sis! Hari ini sedang berlangsung program promo spesial di Rahayu Fashion:

• **Voucher Belanja Hemat:** Sis bisa gunakan kode kupon **\`RAHAYUPAYDAY\`** untuk diskon instan belanja di halaman checkout!
• **Gratis Ongkos Kirim:** Berlaku subsidi ongkir ke seluruh kota di Indonesia melalui ekspedisi JNE, SiCepat, dan J&T Express.
• **Flash Sale Highlight:** Jangan lupa cek penawaran waktu terbatas di beranda depan kami yaa!

${pickClosing}`;
      }

      // G. BAHAN & PERAWATAN (Fabric Care)
      else if (q.includes("adem") || q.includes("panas") || q.includes("sejuk") || q.includes("keringat") || q.includes("kain") || q.includes("bahan")) {
        categoryHint = "Gamis";
        keywordHints = ["toyobo", "katun", "silk"];
        reply = `${pickGreeting}
Untuk kenyamanan maksimal di iklim tropis Indonesia, berikut perbandingan bahan terbaik kami:

1. **Katun Toyobo Fodu:** Serat katun alami paling rapat, tebal bersahaja, tidak terawang, namun luar biasa sejuk dan menyerap keringat.
2. **Armani Silk Premium:** Bahan sutra sintetis grade tertinggi dengan tekstur jatuh (flowy), licin lembut di kulit, dan tidak gerah.
3. **Crinkle Airflow:** Bertekstur kerut alami yang unik, adem, dan **ironless (tidak perlu disetrika)**.

${pickClosing}`;
      }

      // H. DEFAULT INTELLIGENT ADVICE (Dynamic Fallback)
      else {
        categoryHint = "Semua";
        keywordHints = ["gamis", "hijab", "tunik"];
        reply = `${pickGreeting}
Terima kasih banyak atas pertanyaannya Sis! Di Rahayu Fashion Store, kami senantiasa menghadirkan koleksi modest muslimah yang mengutamakan nilai kesopanan syar'i sekaligus tren mode modern terkini.

Beberapa tips praktis berbusana anggun hari ini:
• **Pilih Palet Warna Harmonis:** Warna netral seperti Sage, Dusty Lilac, Mocca, dan Broken White sangat fleksibel untuk berbagai suasana acara.
• **Perhatikan Kenyamanan Bahan:** Pastikan memilih material katun atau silk berkualitas yang jatuh anggun dan tidak menerawang.
• **Konsultasi Ukuran:** Seluruh produk kami memiliki panduan ukuran detail (LD dada, panjang gamis, lingkar pinggang).

Apakah ada model tertentu (Gamis, Tunik, Hijab Voal, atau Pakaian Pria/Anak) yang sedang Sis cari saat ini? Silakan tanyakan ya Sis! 💖`;
      }
    }

    const durationMs = Date.now() - startTime;
    const keysDetected = inspectAiKeys();

    logAiThirdParty({
      service: "AI Virtual Stylist",
      provider,
      isLive,
      endpoint: isLive ? (provider === "google-gemini" ? "https://generativelanguage.googleapis.com (Gemini 1.5 Flash)" : "https://api.openai.com (GPT-4o-mini)") : undefined,
      durationMs,
      inputs: {
        userMessage: message,
        categoryDetected: categoryHint,
        keywords: keywordHints,
      },
      outputPreview: reply,
      keysDetected,
      note: isLive
        ? `Stylist merespon via model Generative AI ${provider}.`
        : "Saat ini menggunakan Smart Modest Knowledge Engine v2.0 (25+ topik). Pasang GEMINI_API_KEY di .env untuk live conversational generative AI.",
    });

    return NextResponse.json({
      success: true,
      isLive,
      provider,
      categoryHint,
      keywordHints,
      reply,
      _devDiagnostics: {
        service: "AI Virtual Stylist",
        provider,
        isLive,
        durationMs,
        categoryHint,
        keywordHints,
        keysDetected,
      },
    });
  } catch (error: any) {
    console.error("AI Stylist error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
