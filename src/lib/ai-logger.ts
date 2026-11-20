// =============================================================================
// RAHAYU FASHION STORE — AI THIRD-PARTY DIAGNOSTIC LOGGER (DEVELOPMENT MODE)
// =============================================================================

export interface AiLogContext {
  service: "AI Photoshoot Studio" | "AI SEO Copywriter" | "AI Virtual Stylist";
  provider: string;
  isLive: boolean;
  endpoint?: string;
  durationMs?: number;
  costEstimate?: string;
  inputs?: Record<string, any>;
  outputPreview?: string;
  keysDetected?: Record<string, { present: boolean; masked?: string; status: "VALID" | "MISSING" | "PLACEHOLDER" }>;
  note?: string;
}

/**
 * Pretty-print diagnostic logs to the terminal/Docker container in development mode
 */
export function logAiThirdParty(ctx: AiLogContext) {
  // Always log in development or when FORCE_AI_LOGS is set
  const isDev = process.env.NODE_ENV !== "production" || process.env.FORCE_AI_LOGS === "true";

  const divider = "─".repeat(74);
  const statusBadge = ctx.isLive
    ? "\x1b[42m\x1b[30m 🟢 LIVE CLOUD API CALL \x1b[0m"
    : "\x1b[43m\x1b[30m 🟡 SANDBOX SIMULATOR (PREVIEW MODE) \x1b[0m";

  const cyan = "\x1b[36m";
  const magenta = "\x1b[35m";
  const yellow = "\x1b[33m";
  const gray = "\x1b[90m";
  const green = "\x1b[32m";
  const red = "\x1b[31m";
  const reset = "\x1b[0m";
  const bold = "\x1b[1m";

  console.log("");
  console.log(`${magenta}┌${divider}┐${reset}`);
  console.log(`${magenta}│${bold} 🤖 [AI THIRD-PARTY PIPELINE DIAGNOSTIC] ${gray}• ${new Date().toLocaleTimeString("id-ID")} WIB${reset}`);
  console.log(`${magenta}├${divider}┤${reset}`);
  console.log(`│ ${bold}📌 Fitur Layanan${reset}  : ${cyan}${ctx.service}${reset}`);
  console.log(`│ ${bold}📡 Status Alur${reset}    : ${statusBadge}`);
  console.log(`│ ${bold}🔌 Provider Aktif${reset} : ${yellow}${bold}${ctx.provider.toUpperCase()}${reset}`);

  if (ctx.endpoint) {
    console.log(`│ ${bold}🌐 Target Endpoint${reset}: ${gray}${ctx.endpoint}${reset}`);
  }
  if (ctx.durationMs !== undefined) {
    console.log(`│ ${bold}⏱️ Waktu Eksekusi${reset} : ${green}${ctx.durationMs} ms${reset}`);
  }
  if (ctx.costEstimate) {
    console.log(`│ ${bold}💰 Estimasi Biaya${reset} : ${yellow}${ctx.costEstimate}${reset}`);
  }

  // Key detection summary
  if (ctx.keysDetected) {
    console.log(`│ ${bold}🔑 Status API Key${reset} :`);
    Object.entries(ctx.keysDetected).forEach(([key, info]) => {
      const icon = info.status === "VALID" ? `${green}✓ TERPASANG${reset}` : info.status === "PLACEHOLDER" ? `${yellow}⚠️ DUMMY / PLACEHOLDER${reset}` : `${red}✗ KOSONG${reset}`;
      console.log(`│    ${gray}•${reset} ${bold}${key.padEnd(20)}${reset}: ${icon} ${info.masked ? `${gray}(${info.masked})${reset}` : ""}`);
    });
  }

  // Input summary
  if (ctx.inputs && Object.keys(ctx.inputs).length > 0) {
    console.log(`│ ${bold}📥 Payload Input${reset}  :`);
    Object.entries(ctx.inputs).forEach(([k, v]) => {
      const valStr = typeof v === "object" ? JSON.stringify(v) : String(v || "-");
      const truncated = valStr.length > 55 ? valStr.substring(0, 52) + "..." : valStr;
      console.log(`│    ${gray}•${reset} ${k.padEnd(16)}: ${cyan}${truncated}${reset}`);
    });
  }

  // Output preview
  if (ctx.outputPreview) {
    const preview = ctx.outputPreview.length > 70 ? ctx.outputPreview.substring(0, 67) + "..." : ctx.outputPreview;
    console.log(`│ ${bold}📤 Output Ringkas${reset} : ${green}${preview}${reset}`);
  }

  // Helpful hint
  if (ctx.note) {
    console.log(`${magenta}├${divider}┤${reset}`);
    console.log(`│ ${yellow}💡 Hint: ${ctx.note}${reset}`);
  }

  console.log(`${magenta}└${divider}┘${reset}`);
  console.log("");
}

/**
 * Utility to inspect available AI keys safely (without leaking secrets)
 */
export function inspectAiKeys() {
  const falKey = process.env.FAL_KEY;
  const replicateToken = process.env.REPLICATE_API_TOKEN;
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  const mask = (val?: string) => {
    if (!val) return "";
    if (val.length <= 8) return "••••";
    return val.substring(0, 4) + "••••" + val.substring(val.length - 4);
  };

  const getStatus = (val?: string): "VALID" | "MISSING" | "PLACEHOLDER" => {
    if (!val) return "MISSING";
    if (val.includes("demo_") || val.includes("your_") || val === "demo_key") return "PLACEHOLDER";
    return "VALID";
  };

  return {
    FAL_KEY: {
      present: !!falKey,
      masked: mask(falKey),
      status: getStatus(falKey),
    },
    REPLICATE_API_TOKEN: {
      present: !!replicateToken,
      masked: mask(replicateToken),
      status: getStatus(replicateToken),
    },
    GEMINI_API_KEY: {
      present: !!geminiKey,
      masked: mask(geminiKey),
      status: getStatus(geminiKey),
    },
    OPENAI_API_KEY: {
      present: !!openaiKey,
      masked: mask(openaiKey),
      status: getStatus(openaiKey),
    },
  };
}
