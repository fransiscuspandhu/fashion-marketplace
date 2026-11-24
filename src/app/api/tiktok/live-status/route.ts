import { NextResponse } from "next/server";
import fs from "fs";

const CONFIG_FILE = "/tmp/rahayu_tiktok_live_state.json";

export interface TikTokServerState {
  username: string;
  nickname: string;
  avatarUrl: string;
  signature: string;
  verified: boolean;
  mode: "AUTO_SYNC" | "MANUAL_LIVE";
  isLive: boolean;
  isLiveOnTikTok: boolean;
  accountFound: boolean;
  viewers: number;
  enterCount: number;
  likes: number;
  followers: number;
  videoCount: number;
  title: string;
  voucherCode: string;
  schedule: string;
  pinnedProductId: number;
  instagramUrl: string;
  whatsappUrl: string;
  lastSyncedAt: string;
  connectionStatus: "CONNECTED_LIVE" | "ACCOUNT_SYNCED_OFFLINE" | "SIMULCAST_ACTIVE" | "OFFLINE";
  roomId?: string;
}

const DEFAULT_STATE: TikTokServerState = {
  username: process.env.TIKTOK_USERNAME || "rahayufashion.store",
  nickname: "Rahayu Fashion Store",
  avatarUrl: "",
  signature: "Koleksi Fashion Modern, Hijab, Baju Hamil & Anak Resmi",
  verified: false,
  mode: "AUTO_SYNC",
  isLive: false,
  isLiveOnTikTok: false,
  accountFound: false,
  viewers: 0,
  enterCount: 0,
  likes: 0,
  followers: 0,
  videoCount: 0,
  title: "Live Try-On & Flash Sale: Koleksi Fashion Modern & Hijab Voal",
  voucherCode: "RAHAYULIVE20",
  schedule: "Setiap Hari 19:00 – 22:00 WIB",
  pinnedProductId: 1,
  instagramUrl: "https://www.instagram.com/rahayufashion.id",
  whatsappUrl: "https://wa.me/6281288776655",
  lastSyncedAt: "Belum disinkronkan",
  connectionStatus: "OFFLINE",
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

export interface TikTokProbeResult {
  reachable: boolean;
  accountFound: boolean;
  nickname?: string;
  avatarUrl?: string;
  signature?: string;
  verified?: boolean;
  followers?: number;
  likes?: number;
  videoCount?: number;
  isLiveOnTikTok: boolean;
  roomId?: string;
  liveStatus?: number;
  viewers?: number;
  enterCount?: number;
  liveTitle?: string;
  errorReason?: string;
}

/**
 * Fetches real public profile stats (followers, total likes/hearts, nickname, avatar)
 * from https://www.tiktok.com/@username AND real live room stats (live status, current viewers,
 * total enterCount, live title) from https://www.tiktok.com/@username/live.
 */
async function probeTikTokPublicAccountAndLive(username: string): Promise<TikTokProbeResult> {
  const cleanUser = username.replace(/^@/, "").trim();
  const profileUrl = `https://www.tiktok.com/@${encodeURIComponent(cleanUser)}`;
  const liveUrl = `https://www.tiktok.com/@${encodeURIComponent(cleanUser)}/live`;

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
  };

  const result: TikTokProbeResult = {
    reachable: false,
    accountFound: false,
    isLiveOnTikTok: false,
  };

  try {
    const [profileRes, liveRes] = await Promise.allSettled([
      fetch(profileUrl, { method: "GET", headers, signal: AbortSignal.timeout(5500) }),
      fetch(liveUrl, { method: "GET", headers, signal: AbortSignal.timeout(5500) }),
    ]);

    // 1. Parse Profile HTML (__UNIVERSAL_DATA_FOR_REHYDRATION__)
    if (profileRes.status === "fulfilled" && profileRes.value.ok) {
      result.reachable = true;
      const html = await profileRes.value.text();
      const match = html.match(
        /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/
      );
      if (match && match[1]) {
        try {
          const json = JSON.parse(match[1]);
          const userDetail = json?.__DEFAULT_SCOPE__?.["webapp.user-detail"];
          const userInfo = userDetail?.userInfo;
          if (userInfo?.user && userDetail?.statusCode === 0) {
            result.accountFound = true;
            result.nickname = userInfo.user.nickname || cleanUser;
            result.avatarUrl =
              userInfo.user.avatarMedium || userInfo.user.avatarThumb || "";
            result.signature = userInfo.user.signature || "";
            result.verified = Boolean(userInfo.user.verified);
            if (userInfo.user.roomId && userInfo.user.roomId !== "0") {
              result.roomId = String(userInfo.user.roomId);
            }
          }
          if (userInfo?.stats) {
            const st = userInfo.stats;
            if (typeof st.followerCount === "number") result.followers = st.followerCount;
            const heartVal =
              typeof st.heartCount === "number"
                ? st.heartCount
                : typeof st.heart === "number"
                ? st.heart
                : undefined;
            if (typeof heartVal === "number") result.likes = heartVal;
            if (typeof st.videoCount === "number") result.videoCount = st.videoCount;
          }
        } catch (parseErr) {
          // Continue to live room parsing
        }
      }
    }

    // 2. Parse Live Room HTML (SIGI_STATE)
    if (liveRes.status === "fulfilled" && liveRes.value.ok) {
      result.reachable = true;
      const liveHtml = await liveRes.value.text();
      const sigiMatch = liveHtml.match(/<script id="SIGI_STATE"[^>]*>([\s\S]*?)<\/script>/);
      if (sigiMatch && sigiMatch[1]) {
        try {
          const sigi = JSON.parse(sigiMatch[1]);
          const lrUserInfo = sigi?.LiveRoom?.liveRoomUserInfo;
          if (lrUserInfo?.user && lrUserInfo.user.uniqueId) {
            result.accountFound = true;
            if (!result.nickname) result.nickname = lrUserInfo.user.nickname;
            if (!result.avatarUrl) result.avatarUrl = lrUserInfo.user.avatarMedium || lrUserInfo.user.avatarThumb;
            if (lrUserInfo.user.roomId) result.roomId = String(lrUserInfo.user.roomId);
          }
          if (lrUserInfo?.stats) {
            if (typeof lrUserInfo.stats.followerCount === "number" && result.followers === undefined) {
              result.followers = lrUserInfo.stats.followerCount;
            }
          }
          const liveRoom = lrUserInfo?.liveRoom;
          if (liveRoom) {
            const roomStatus = Number(liveRoom.status || lrUserInfo?.user?.status || 0);
            result.liveStatus = roomStatus;
            // On TikTok Webcast, status === 2 means LIVE STREAMING right now (4 = Live ended/Offline)
            result.isLiveOnTikTok = roomStatus === 2;
            if (liveRoom.title && typeof liveRoom.title === "string") {
              result.liveTitle = liveRoom.title;
            }
            if (liveRoom.liveRoomStats) {
              const userCount = Number(liveRoom.liveRoomStats.userCount ?? 0);
              const enterCount = Number(liveRoom.liveRoomStats.enterCount ?? 0);
              result.viewers = result.isLiveOnTikTok ? userCount : 0;
              result.enterCount = enterCount;
            }
          }
        } catch (sigiErr) {
          // Ignore parse error
        }
      }
    }

    if (!result.reachable) {
      result.errorReason = "TikTok endpoint unreachable from current network";
    }
    return result;
  } catch (err: any) {
    return {
      reachable: false,
      accountFound: false,
      isLiveOnTikTok: false,
      errorReason: err?.message || "Network timeout",
    };
  }
}

function applyProbeToState(
  state: TikTokServerState,
  probe: TikTokProbeResult,
  forceOverwriteLive = false
): TikTokServerState {
  const next = { ...state };
  next.lastSyncedAt =
    new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
    " WIB";

  if (probe.reachable && probe.accountFound) {
    next.accountFound = true;
    next.isLiveOnTikTok = probe.isLiveOnTikTok;
    next.nickname = probe.nickname || next.username;
    next.avatarUrl = probe.avatarUrl || "";
    next.signature = probe.signature || "";
    next.verified = Boolean(probe.verified);
    next.followers = typeof probe.followers === "number" ? probe.followers : 0;
    next.likes = typeof probe.likes === "number" ? probe.likes : 0;
    next.videoCount = typeof probe.videoCount === "number" ? probe.videoCount : 0;
    next.roomId = probe.roomId;

    if (probe.isLiveOnTikTok) {
      // Account is genuinely LIVE on TikTok right now!
      next.isLive = true;
      next.viewers = typeof probe.viewers === "number" ? probe.viewers : 0;
      next.enterCount = typeof probe.enterCount === "number" ? probe.enterCount : next.viewers;
      if (probe.liveTitle) next.title = probe.liveTitle;
      next.connectionStatus = "CONNECTED_LIVE";
    } else {
      // Account exists on TikTok, but is currently NOT live streaming
      next.viewers = 0;
      next.enterCount = typeof probe.enterCount === "number" ? probe.enterCount : 0;
      if (next.mode === "AUTO_SYNC" || forceOverwriteLive) {
        next.isLive = false;
        next.connectionStatus = "ACCOUNT_SYNCED_OFFLINE";
      } else {
        next.connectionStatus = next.isLive ? "SIMULCAST_ACTIVE" : "ACCOUNT_SYNCED_OFFLINE";
      }
    }
  } else if (probe.reachable && !probe.accountFound) {
    // Username does not exist on TikTok
    next.accountFound = false;
    next.isLiveOnTikTok = false;
    next.isLive = false;
    next.viewers = 0;
    next.enterCount = 0;
    next.likes = 0;
    next.followers = 0;
    next.videoCount = 0;
    next.nickname = next.username;
    next.connectionStatus = "OFFLINE";
  }
  return next;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let state = readSavedState();
    const queryUser = searchParams.get("username");
    const shouldProbe = searchParams.get("probe") !== "false";

    const username = (queryUser || state.username || "rahayufashion.store")
      .replace(/^@/, "")
      .trim();

    state.username = username;

    let probeResult: TikTokProbeResult | null = null;
    if (shouldProbe) {
      probeResult = await probeTikTokPublicAccountAndLive(username);
      state = applyProbeToState(state, probeResult, Boolean(queryUser));
      writeSavedState(state);
    }

    return NextResponse.json({
      success: true,
      ...state,
      username,
      profileUrl: `https://www.tiktok.com/@${username}`,
      liveUrl: `https://www.tiktok.com/@${username}/live`,
      probe: probeResult,
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

    const cleanUsername =
      (body.username ?? current.username).replace(/^@/, "").trim() || "rahayufashion.store";
    const isUsernameChanged = cleanUsername.toLowerCase() !== current.username.toLowerCase();
    const isExplicitSync = body.action === "TEST_CONNECTION" || body.action === "SYNC_NOW";

    let updated: TikTokServerState = {
      ...current,
      username: cleanUsername,
      mode: body.mode ?? current.mode,
      isLive: typeof body.isLive === "boolean" ? body.isLive : current.isLive,
      viewers: typeof body.viewers === "number" ? body.viewers : current.viewers,
      likes: typeof body.likes === "number" ? body.likes : current.likes,
      followers: typeof body.followers === "number" ? body.followers : current.followers,
      title: body.title ?? current.title,
      voucherCode: body.voucherCode ?? current.voucherCode,
      schedule: body.schedule ?? current.schedule,
      pinnedProductId:
        typeof body.pinnedProductId === "number" ? body.pinnedProductId : current.pinnedProductId,
      instagramUrl: body.instagramUrl ?? current.instagramUrl,
      whatsappUrl: body.whatsappUrl ?? current.whatsappUrl,
      lastSyncedAt:
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " WIB",
    };

    let probeResult: TikTokProbeResult | null = null;
    const shouldProbe = isExplicitSync || isUsernameChanged || updated.mode === "AUTO_SYNC";

    if (shouldProbe) {
      probeResult = await probeTikTokPublicAccountAndLive(updated.username);
      updated = applyProbeToState(updated, probeResult, isExplicitSync || isUsernameChanged);

      console.log(
        `\n┌────────────────────────────────────────────────────────────────────┐` +
          `\n│ 📡 TIKTOK LIVE & ACCOUNT REAL-TIME SYNC                            │` +
          `\n├────────────────────────────────────────────────────────────────────┤` +
          `\n│ • Username       : @${updated.username.padEnd(46)} │` +
          `\n│ • Account Found  : ${(probeResult.accountFound ? `YES (${updated.nickname})` : "NOT FOUND ON TIKTOK").padEnd(47)} │` +
          `\n│ • Followers      : ${updated.followers.toLocaleString("id-ID").padEnd(47)} │` +
          `\n│ • Total Likes    : ${updated.likes.toLocaleString("id-ID").padEnd(47)} │` +
          `\n│ • Live on TikTok : ${(probeResult.isLiveOnTikTok ? `🔴 YES (${updated.viewers} active / ${updated.enterCount} total)` : "⚪ NO (0 active viewers)").padEnd(47)} │` +
          `\n│ • Mode           : ${updated.mode.padEnd(47)} │` +
          `\n└────────────────────────────────────────────────────────────────────┘\n`
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
