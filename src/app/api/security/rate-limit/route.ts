// ─── Rate Limit Status API ───
// Returns current rate limit status for the requesting IP

import { NextRequest, NextResponse } from "next/server";
import {
  getRateLimitStats,
  RATE_LIMIT_CONFIGS,
  getClientIP,
} from "@/lib/security";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const routeType = request.nextUrl.searchParams.get("type") || "general-api";

    // Validate route type
    const validRouteType = RATE_LIMIT_CONFIGS[routeType]
      ? routeType
      : "general-api";

    const stats = getRateLimitStats(ip, validRouteType);
    const config = RATE_LIMIT_CONFIGS[validRouteType];

    return NextResponse.json({
      ip: ip === "unknown" ? "unknown" : ip.slice(0, 3) + "***", // Partially mask IP
      routeType: validRouteType,
      current: stats.current,
      limit: stats.limit,
      remaining: stats.remaining,
      resetAt: stats.resetAt,
      isBlocked: stats.isBlocked,
      retryAfter: stats.isBlocked
        ? Math.ceil((stats.resetAt - Date.now()) / 1000)
        : null,
      windowMs: config.windowMs,
      windowLabel: formatDuration(config.windowMs),
      // Available route types for reference
      availableRouteTypes: Object.keys(RATE_LIMIT_CONFIGS),
    });
  } catch (error) {
    console.error("Rate limit status error:", error);
    return NextResponse.json(
      { error: "Failed to get rate limit status" },
      { status: 500 }
    );
  }
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)}m`;
  return `${Math.round(ms / 3_600_000)}h`;
}
