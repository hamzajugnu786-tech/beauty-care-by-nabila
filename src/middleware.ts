// ─── Enhanced Middleware: Security + Route Protection ───
// Combines admin route authentication with comprehensive security headers,
// CORS, rate limiting, bot detection, and request validation

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// ─── Original Auth Configuration (PRESERVED) ───

// Routes that don't require authentication
const publicRoutes = ["/admin/login", "/api/auth"];

// Role-based route access
const roleRoutes: Record<string, string[]> = {
  "super-admin": ["/admin"],
  manager: ["/admin", "/admin/bookings", "/admin/services", "/admin/staff", "/admin/gallery", "/admin/testimonials"],
  staff: ["/admin", "/admin/bookings"],
};

// ─── Security: Rate Limiter (In-Memory, Sliding Window) ───

interface RateLimitEntry {
  timestamps: number[];
  blocked: boolean;
  blockedUntil: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  blockDurationMs: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
let lastCleanup = Date.now();

const MIDDLEWARE_RATE_LIMITS: Record<string, RateLimitConfig> = {
  "api-general": { windowMs: 60_000, maxRequests: 30, blockDurationMs: 120_000 },
  "api-booking": { windowMs: 60_000, maxRequests: 5, blockDurationMs: 300_000 },
  "api-auth": { windowMs: 60_000, maxRequests: 20, blockDurationMs: 120_000 },
  "api-contact": { windowMs: 300_000, maxRequests: 3, blockDurationMs: 900_000 },
  "api-admin": { windowMs: 60_000, maxRequests: 60, blockDurationMs: 60_000 },
};

function getRouteType(pathname: string): string {
  if (pathname.startsWith("/api/auth")) return "api-auth";
  if (pathname.startsWith("/api/bookings") || pathname.startsWith("/api/availability")) return "api-booking";
  if (pathname.startsWith("/api/contact")) return "api-contact";
  if (pathname.startsWith("/api/admin")) return "api-admin";
  if (pathname.startsWith("/api/")) return "api-general";
  return "api-general";
}

function checkRateLimit(ip: string, routeType: string): {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
} {
  const now = Date.now();

  // Cleanup periodically
  if (now - lastCleanup > 60_000) {
    for (const [key, entry] of rateLimitStore.entries()) {
      if (!entry.blocked && entry.timestamps.length === 0) {
        rateLimitStore.delete(key);
      } else if (!entry.blocked) {
        entry.timestamps = entry.timestamps.filter((t) => t > now - 600_000);
        if (entry.timestamps.length === 0) rateLimitStore.delete(key);
      }
    }
    lastCleanup = now;
  }

  const config = MIDDLEWARE_RATE_LIMITS[routeType] || MIDDLEWARE_RATE_LIMITS["api-general"];
  const key = `${ip}:${routeType}`;
  const entry = rateLimitStore.get(key) || { timestamps: [], blocked: false, blockedUntil: 0 };

  // Check if blocked
  if (entry.blocked && now < entry.blockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
    };
  }

  // Reset expired block
  if (entry.blocked && now >= entry.blockedUntil) {
    entry.blocked = false;
    entry.blockedUntil = 0;
  }

  // Filter timestamps within window
  const windowStart = now - config.windowMs;
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  // Check limit
  if (entry.timestamps.length >= config.maxRequests) {
    entry.blocked = true;
    entry.blockedUntil = now + config.blockDurationMs;
    rateLimitStore.set(key, entry);
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil(config.blockDurationMs / 1000),
    };
  }

  // Record request
  entry.timestamps.push(now);
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.timestamps.length,
  };
}

// ─── Security: Bot Detection ───

const MALICIOUS_BOT_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /nmap/i,
  /masscan/i,
  /dirbuster/i,
  /gobuster/i,
  /wfuzz/i,
  /ffuf/i,
  // Note: curl/wget/headless/phantom/selenium/puppeteer removed from blocking
  // as they block legitimate preview agents and health checks.
  // Only block actual attack tools above.
];

const LEGITIMATE_BOT_PATTERNS = [
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegrambot/i,
];

function isMaliciousBot(request: NextRequest): boolean {
  const userAgent = request.headers.get("user-agent") || "";

  // No user agent is suspicious for API requests
  if (!userAgent && request.nextUrl.pathname.startsWith("/api/")) {
    return true;
  }

  // Allow legitimate bots
  if (LEGITIMATE_BOT_PATTERNS.some((p) => p.test(userAgent))) {
    return false;
  }

  return MALICIOUS_BOT_PATTERNS.some((p) => p.test(userAgent));
}

// ─── Security: IP Extraction ───

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim());
    return ips[0] || "unknown";
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) return realIP;

  const cfIP = request.headers.get("cf-connecting-ip");
  if (cfIP) return cfIP;

  return "unknown";
}

// ─── Security: Content Security Policy ───

function buildCSP(): string {
  const isDev = process.env.NODE_ENV === "development";

  const frameAncestors = isDev
    ? `frame-ancestors 'self' 'unsafe-inline' https://*.space-z.ai https://*.space.chatglm.site https://*.chatglm.site http://localhost:*`
    : `frame-ancestors 'self' https://*.space-z.ai https://*.space.chatglm.site https://*.chatglm.site`;

  // Allow NextAuth to work on Vercel by including the deployed domain in connect-src
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";

  const directives: string[] = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' 'unsafe-eval'${isDev ? " localhost:*" : ""}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https: blob:`,
    `font-src 'self' data: https://fonts.gstatic.com`,
    `connect-src 'self' https:${appUrl ? ` ${appUrl}` : ""}${isDev ? " ws://localhost:* http://localhost:*" : ""}`,
    `media-src 'self'`,
    `frame-src 'none'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    frameAncestors,
  ];

  if (!isDev) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}

// ─── Security: Security Headers ───

function getSecurityHeaders(): Record<string, string> {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    // X-Frame-Options removed - using CSP frame-ancestors instead (modern standard)
    // This allows the preview iframe to embed our site across origins
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy": buildCSP(),
    "Permissions-Policy": [
      "camera=()",
      "microphone=()",
      "geolocation=(self)",
      "payment=(self)",
      "usb=()",
      "magnetometer=()",
      "gyroscope=()",
      "accelerometer=()",
      "screen-wake-lock=()",
      "fullscreen=(self)",
    ].join(", "),
    ...(isProduction
      ? { "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload" }
      : {}),
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    "Cross-Origin-Resource-Policy": "cross-origin",
    "Cross-Origin-Embedder-Policy": "unsafe-none",
  };
}

// ─── Security: CORS Handling ───

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  // Preview iframe domains (exact matches)
  "https://space-z.ai",
  "https://space.chatglm.site",
  "https://chatglm.site",
  // Preview subdomain patterns (checked via startsWith)
  "https://preview-chat-",
  "https://preview-",
  "http://localhost:",
];

function getCORSHeaders(origin: string): Record<string, string> {
  const isAllowed = ALLOWED_ORIGINS.some(
    (allowed) => origin === allowed || origin.startsWith(allowed)
  );

  // Also allow any subdomain of space-z.ai, space.chatglm.site, chatglm.site
  const isPreviewDomain = [
    ".space-z.ai",
    ".space.chatglm.site",
    ".chatglm.site",
  ].some((domain) => origin.endsWith(domain) || origin.includes(domain + "/"));

  if (!isAllowed && !isPreviewDomain) return {};

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

// ─── Security: Request Size Validation ───

const MAX_REQUEST_SIZES: Record<string, number> = {
  "application/json": 1024 * 100,           // 100KB
  "multipart/form-data": 1024 * 1024 * 5,   // 5MB
  "application/x-www-form-urlencoded": 1024 * 50, // 50KB
};

function validateRequestSize(request: NextRequest): boolean {
  const contentType = request.headers.get("content-type") || "application/json";
  const contentLength = parseInt(request.headers.get("content-length") || "0", 10);

  // No body = valid
  if (contentLength === 0) return true;

  let maxSize = MAX_REQUEST_SIZES["application/json"];
  for (const [key, size] of Object.entries(MAX_REQUEST_SIZES)) {
    if (contentType.includes(key)) {
      maxSize = size;
      break;
    }
  }

  return contentLength <= maxSize;
}

// ─── Security: Apply Headers to Response ───

function applySecurityHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  // Apply security headers
  const securityHeaders = getSecurityHeaders();
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // Apply CORS headers if origin is present
  const origin = request.headers.get("origin");
  if (origin) {
    const corsHeaders = getCORSHeaders(origin);
    for (const [key, value] of Object.entries(corsHeaders)) {
      response.headers.set(key, value);
    }
  }

  // Apply rate limit headers
  const ip = getClientIP(request);
  const routeType = getRouteType(request.nextUrl.pathname);
  const rateLimitResult = checkRateLimit(ip, routeType);

  response.headers.set("X-RateLimit-Remaining", String(rateLimitResult.remaining));
  if (rateLimitResult.retryAfter) {
    response.headers.set("X-RateLimit-Reset", String(Math.ceil(Date.now() / 1000) + rateLimitResult.retryAfter));
  }

  return response;
}

// ─── Main Middleware ───

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    const origin = request.headers.get("origin");
    const corsHeaders = getCORSHeaders(origin || "");
    const securityHeaders = getSecurityHeaders();

    return new NextResponse(null, {
      status: 204,
      headers: {
        ...securityHeaders,
        ...corsHeaders,
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Bot detection - block malicious bots
  if (isMaliciousBot(request)) {
    return new NextResponse(null, { status: 403 });
  }

  // Request size validation for mutating requests
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    if (!validateRequestSize(request)) {
      return NextResponse.json(
        { error: "Request payload too large" },
        { status: 413 }
      );
    }
  }

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    const ip = getClientIP(request);
    const routeType = getRouteType(pathname);
    const rateLimitResult = checkRateLimit(ip, routeType);

    if (!rateLimitResult.allowed) {
      const response = NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
      response.headers.set("Retry-After", String(rateLimitResult.retryAfter || 60));
      response.headers.set("X-RateLimit-Remaining", "0");
      return applySecurityHeaders(response, request);
    }
  }

  // ─── PRESERVED: Admin Route Protection ───

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    const response = NextResponse.next();
    return applySecurityHeaders(response, request);
  }

  // Only protect admin routes
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    const response = NextResponse.next();
    return applySecurityHeaders(response, request);
  }

  // Check for JWT token
  // Use the same fallback secret as authOptions in lib/auth.ts
  // to ensure token signing and validation use the same secret
  const nextAuthSecret = process.env.NEXTAUTH_SECRET || "beauty-care-nabila-lahore-secret-2026";
  const token = await getToken({
    req: request,
    secret: nextAuthSecret,
  });

  // No token -> redirect to login
  if (!token) {
    if (pathname.startsWith("/api/")) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return applySecurityHeaders(response, request);
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access for specific routes
  const userRole = (token as any).role as string;
  const allowedRoutes = roleRoutes[userRole] || [];

  // Super-admin has access to everything
  if (userRole === "super-admin") {
    const response = NextResponse.next();
    return applySecurityHeaders(response, request);
  }

  // Check if the current path is allowed for the user's role
  const isAllowed = allowedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));

  if (!isAllowed) {
    if (pathname.startsWith("/api/")) {
      const response = NextResponse.json({ error: "Forbidden" }, { status: 403 });
      return applySecurityHeaders(response, request);
    }
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const response = NextResponse.next();
  return applySecurityHeaders(response, request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files) - handled by Next.js dev server CORS
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     *
     * Note: _next/static CORS is handled by allowedDevOrigins in next.config.ts
     */
    "/((?!_next/static|_next/image|favicon\\.ico|images/|fonts/).*)",
  ],
};
