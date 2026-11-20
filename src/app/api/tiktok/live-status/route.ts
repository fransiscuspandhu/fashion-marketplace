import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username") || "rahayufashion.store";

    // Read configured username or token if present
    const isMock = process.env.NODE_ENV !== "production" || !process.env.TIKTOK_SESSION_ID;

    // Simulated / live-connector payload
    // If during live stream hours (e.g. 19:00 - 22:00 WIB), returns active status
    const now = new Date();
    // UTC+7 for WIB
    const wibHour = (now.getUTCHours() + 7) % 24;
    const isLiveHour = wibHour >= 19 && wibHour <= 22;

    const liveData = {
      success: true,
      username,
      isLive: isLiveHour,
      viewers: isLiveHour ? Math.floor(1200 + Math.random() * 500) : 0,
      likes: isLiveHour ? Math.floor(45000 + Math.random() * 10000) : 0,
      title: "Spesial Diskon Flash Sale Live & Hijab Voal Ultrafine Try-on",
      schedule: "Setiap Hari 19:00 – 22:00 WIB",
      profileUrl: `https://www.tiktok.com/@${username}`,
      liveUrl: `https://www.tiktok.com/@${username}/live`,
    };

    return NextResponse.json(liveData);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch TikTok status" },
      { status: 500 }
    );
  }
}
