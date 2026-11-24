import { NextResponse } from "next/server";
import fs from "fs";

const CONFIG_FILE = "/tmp/rahayu_tiktok_live_state.json";

export interface TikTokServerState {
  username: string;
  mode: "AUTO_SYNC" | "MANUAL_LIVE";
  isLive: boolean;
  viewers: number;
  likes: number;
  title: string;
  voucherCode: string;
  schedule: string;
  pinnedProductId: number;
  instagramUrl: string;
  whatsappUrl: string;
  lastSyncedAt: string;
  connectionStatus: "CONNECTED_LIVE" | "SIMULCAST_ACTIVE" | "OFFLINE";
  roomId?: string;
}

const DEFAULT_STATE: TikTokServerState = {
  username: process.env.TIKTOK_USERNAME || "rahayufashion.store",
  mode: "MANUAL_LIVE",
  isLive: true,
  viewers: 1428,
  likes: 48200,
  title: "Live Try-On & Flash Sale: Koleksi Fashion Modern & Hijab Voal",
  voucherCode: "RAHAYULIVE20",
  schedule: "Setiap Hari 19:00 – 22:00 WIB",
  pinnedProductId: 1,
  instagramUrl: "https://www.instagram.com/rahayufashion.id",
  whatsappUrl: "https://wa.me/6281288776655",
  lastSyncedAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
  connectionStatus: "SIMULCAST_ACTIVE",
};

function readSavedState(): TikTokServerState {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
      return { ...DEFAULT_STATE, ...JSON.parse(raw) };
    }
  } catch (e) {
    // Fallback to default state
  }
  return { ...DEFAULT_STATE };
}

function writeSavedState(state: TikTokServerState) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (e) {
    console.warn("Failed to persist TikTok state file:", e);
  }
}

/**
 * Probes TikTok's public live endpoint for @username to detect active webcast room
 */
async function probeTikTokPublicLive(username: string): Promise<{
  reachable: boolean;
  isLiveOnTikTok: boolean;
  roomId?: string;
  viewers?: number;
  title?: string;
  errorReason?: string;
}> {
  const cleanUser = username.replace(/^@/, "").trim();
  const targetUrl = `https://www.tiktok.com/@${encodeURIComponent(cleanUser)}/live`;

  try {
    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      signal: AbortSignal.timeout(3500),
    });

    if (!res.ok) {
      return {
        reachable: false,
        isLiveOnTikTok: false,
        errorReason: `HTTP ${res.status}`,
      };
    }

    const html = await res.text();

    // Check for roomId & live status in SIGI_STATE or __UNIVERSAL_DATA_FOR_REHYDRATION__
    const roomIdMatch =
      html.match(/"roomId"\s*:\s*"(\d+)"/) || html.match(/"room_id"\s*:\s*"(\d+)"/);
    const statusMatch = html.match(/"status"\s*:\s*(\d+)/);
    const viewerMatch =
      html.match(/"user_count"\s*:\s*(\d+)/) || html.match(/"viewerCount"\s*:\s*(\d+)/);
    const titleMatch = html.match(/"title"\s*:\s*"([^"]{3,120})"/);

    const roomId = roomIdMatch ? roomIdMatch[1] : undefined;
    // On TikTok Webcast, status === 2 indicates an active live broadcast
    const isLiveOnTikTok = Boolean(roomId && roomId !== "0" && (!statusMatch || statusMatch[1] === "2"));

    return {
      reachable: true,
      isLiveOnTikTok,
      roomId,
      viewers: viewerMatch ? parseInt(viewerMatch[1], 10) : undefined,
      title: titleMatch ? titleMatch[1] : undefined,
    };
  } catch (err: any) {
    return {
      reachable: false,
      isLiveOnTikTok: false,
      errorReason: err?.message || "Network/Proxy timeout",
    };
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = readSavedState();
    const queryUser = searchParams.get("username");
    const forceProbe = searchParams.get("probe") === "true";

    const username = (queryUser || state.username || "rahayufashion.store")
      .replace(/^@/, "")
      .trim();

    let probeResult = null;
    if (forceProbe || state.mode === "AUTO_SYNC") {
      probeResult = await probeTikTokPublicLive(username);
      if (probeResult.reachable && probeResult.isLiveOnTikTok) {
        state.isLive = true;
        state.viewers = probeResult.viewers || state.viewers || 1420;
        if (probeResult.title) state.title = probeResult.title;
        state.roomId = probeResult.roomId;
        state.connectionStatus = "CONNECTED_LIVE";
      } else if (state.mode === "AUTO_SYNC" && probeResult.reachable && !probeResult.isLiveOnTikTok) {
        // Account reachable on TikTok but not currently streaming live
        state.connectionStatus = state.isLive ? "SIMULCAST_ACTIVE" : "OFFLINE";
      }
      state.lastSyncedAt =
        new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
      state.username = username;
      writeSavedState(state);
    }

    return NextResponse.json({
      success: true,
      ...state,
      username,
      profileUrl: `https://www.tiktok.com/@${username}`,
      liveUrl: `https://www.tiktok.com/@${username}/live`,
      probe: probeResult,
      envConfigured: Boolean(process.env.TIKTOK_USERNAME || process.env.TIKTOK_SESSION_ID),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch TikTok status" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = readSavedState();

    const updated: TikTokServerState = {
      ...current,
      username: (body.username ?? current.username).replace(/^@/, "").trim() || "rahayufashion.store",
      mode: body.mode ?? current.mode,
      isLive: typeof body.isLive === "boolean" ? body.isLive : current.isLive,
      viewers: typeof body.viewers === "number" ? body.viewers : current.viewers,
      likes: typeof body.likes === "number" ? body.likes : current.likes,
      title: body.title ?? current.title,
      voucherCode: body.voucherCode ?? current.voucherCode,
      schedule: body.schedule ?? current.schedule,
      pinnedProductId:
        typeof body.pinnedProductId === "number" ? body.pinnedProductId : current.pinnedProductId,
      instagramUrl: body.instagramUrl ?? current.instagramUrl,
      whatsappUrl: body.whatsappUrl ?? current.whatsappUrl,
      lastSyncedAt:
        new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
    };

    let probeResult = null;
    if (body.action === "TEST_CONNECTION" || updated.mode === "AUTO_SYNC") {
      probeResult = await probeTikTokPublicLive(updated.username);
      if (probeResult.reachable && probeResult.isLiveOnTikTok) {
        updated.isLive = true;
        updated.viewers = probeResult.viewers || updated.viewers || 1540;
        updated.roomId = probeResult.roomId;
        updated.connectionStatus = "CONNECTED_LIVE";
      } else {
        updated.connectionStatus = updated.isLive ? "SIMULCAST_ACTIVE" : "OFFLINE";
      }

      console.log(
        `\n┌──────────────────────────────────────────────────────────────┐` +
        `\n│ 📡 TIKTOK LIVE CONNECTOR DIAGNOSTIC                          │` +
        `\n├──────────────────────────────────────────────────────────────┤` +
        `\n│ • Username       : @${updated.username.padEnd(40)} │` +
        `\n│ • Mode           : ${updated.mode.padEnd(41)} │` +
        `\n│ • Public Probe   : ${(probeResult.reachable ? "REACHABLE" : `FALLBACK (${probeResult.errorReason || "Sandbox"})`).padEnd(41)} │` +
        `\n│ • Status Toko    : ${(updated.isLive ? `🔴 LIVE (${updated.viewers} viewers)` : "⚪ OFFLINE").padEnd(41)} │` +
        `\n└──────────────────────────────────────────────────────────────┘\n`
      );
    } else {
      updated.connectionStatus = updated.isLive ? "SIMULCAST_ACTIVE" : "OFFLINE";
    }

    writeSavedState(updated);

    return NextResponse.json({
      success: true,
      ...updated,
      profileUrl: `https://www.tiktok.com/@${updated.username}`,
      liveUrl: `https://www.tiktok.com/@${updated.username}/live`,
      probe: probeResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update TikTok configuration" },
      { status: 500 }
    );
  }
}
