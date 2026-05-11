// ─── Security Utilities ───
// Comprehensive security system for the luxury salon application
// Includes input sanitization, rate limiting, CSRF, CSP, and security headers

import { NextRequest } from "next/server";

// ─── Input Sanitization ───

const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi,
  /on\w+\s*=\s*[^\s>]*/gi,
  /data\s*:\s*text\/html/gi,
  /vbscript\s*:/gi,
  /expression\s*\(/gi,
  /url\s*\(\s*javascript:/gi,
  /@import\s+/gi,
  /<!--/gi,
  /-->/gi,
  /<embed\b/gi,
  /<object\b/gi,
  /<iframe\b/gi,
  /<link\b/gi,
  /<meta\b/gi,
  /<base\b/gi,
];

const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b)/gi,
  /(--\s*$)/gm,
  /(;\s*$)/gm,
  /(\bOR\b\s+\d+\s*=\s*\d+)/gi,
  /(\bAND\b\s+\d+\s*=\s*\d+)/gi,
  /('\s*(OR|AND)\s+')/gi,
  /(\b1\s*=\s*1\b)/gi,
  /(\bWAITFOR\b\s+\bDELAY\b)/gi,
  /(\bBENCHMARK\b\s*\()/gi,
  /(\bSLEEP\b\s*\()/gi,
  /(\bLOAD_FILE\b\s*\()/gi,
  /(\bINTO\s+OUTFILE\b)/gi,
  /(\bINTO\s+DUMPFILE\b)/gi,
  / CHAR\s*\(\s*\d+\s*\)/gi,
];

/**
 * Sanitize input string to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";

  let sanitized = input;

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, "");

  // Remove XSS patterns
  for (const pattern of XSS_PATTERNS) {
    sanitized = sanitized.replace(pattern, "");
  }

  // Encode HTML entities
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

  return sanitized.trim();
}

/**
 * Sanitize input for display (allows basic formatting but blocks scripts)
 */
export function sanitizeForDisplay(input: string): string {
  if (typeof input !== "string") return "";

  let sanitized = input;

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, "");

  // Remove dangerous tags but keep basic formatting
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  sanitized = sanitized.replace(/<iframe\b[^>]*>.*?<\/iframe>/gi, "");
  sanitized = sanitized.replace(/<object\b[^>]*>.*?<\/object>/gi, "");
  sanitized = sanitized.replace(/<embed\b[^>]*>/gi, "");
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, "");
  sanitized = sanitized.replace(/javascript\s*:/gi, "");

  return sanitized.trim();
}

/**
 * Detect SQL injection patterns in input
 */
export function detectSQLInjection(input: string): boolean {
  if (typeof input !== "string") return false;

  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return true;
    }
  }
  return false;
}

/**
 * Detect XSS patterns in input
 */
export function detectXSS(input: string): boolean {
  if (typeof input !== "string") return false;

  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(input)) {
      return true;
    }
  }
  return false;
}

/**
 * Sanitize a name field (allow letters, spaces, hyphens, apostrophes)
 */
export function sanitizeName(name: string): string {
  if (typeof name !== "string") return "";

  // Remove any HTML/script content
  const clean = sanitizeInput(name);

  // Only allow letters (including unicode), spaces, hyphens, apostrophes, dots
  return clean.replace(/[^a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s\-'.]/g, "").trim();
}

/**
 * Validate and sanitize a phone number (Pakistan format)
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== "string") return "";

  // Remove all non-digit characters except leading +
  let cleaned = phone.replace(/[^\d+]/g, "");

  // Pakistan format: +92XXXXXXXXXX or 0XXXXXXXXXX
  if (cleaned.startsWith("+92")) {
    cleaned = "+92" + cleaned.slice(3).replace(/\D/g, "");
  } else if (cleaned.startsWith("0092")) {
    cleaned = "+92" + cleaned.slice(4).replace(/\D/g, "");
  } else if (cleaned.startsWith("0")) {
    cleaned = "+92" + cleaned.slice(1).replace(/\D/g, "");
  }

  return cleaned;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== "string") return "";
  return email.trim().toLowerCase().replace(/[^a-zA-Z0-9._%+\-@]/g, "");
}

/**
 * Validate Pakistan phone number
 */
export function validatePakistanPhone(phone: string): boolean {
  if (typeof phone !== "string") return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");

  // +92XXXXXXXXXX (13 chars), 0XXXXXXXXXX (11 chars), 3XX (local)
  const pkPhoneRegex = /^(\+92|0)?3\d{9}$/;
  return pkPhoneRegex.test(cleaned);
}

// ─── Password Strength Validation ───

export interface PasswordStrengthResult {
  score: number; // 0-4
  label: string;
  feedback: string[];
  isAcceptable: boolean;
}

export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const feedback: string[] = [];
  let score = 0;

  if (!password || typeof password !== "string") {
    return { score: 0, label: "Invalid", feedback: ["Password is required"], isAcceptable: false };
  }

  // Length checks
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length < 8) feedback.push("Use at least 8 characters");

  // Character variety
  if (/[a-z]/.test(password)) score++;
  else feedback.push("Add lowercase letters");

  if (/[A-Z]/.test(password)) score++;
  else feedback.push("Add uppercase letters");

  if (/\d/.test(password)) score++;
  else feedback.push("Add numbers");

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
  else feedback.push("Add special characters");

  // Common patterns
  if (/^(123|abc|password|qwerty|admin)/i.test(password)) {
    score = Math.max(0, score - 2);
    feedback.push("Avoid common patterns");
  }

  // Repeated characters
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push("Avoid repeated characters");
  }

  const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const label = labels[Math.min(score, 4)] || "Very Weak";
  const isAcceptable = score >= 3;

  return { score: Math.min(score, 4), label, feedback, isAcceptable };
}

// ─── Rate Limiter (In-Memory, Sliding Window) ───

interface RateLimitEntry {
  timestamps: number[];
  blocked: boolean;
  blockedUntil: number;
}

interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Max requests per window
  blockDurationMs: number; // How long to block after exceeding limit
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
const CLEANUP_INTERVAL = 60_000; // 1 minute
let lastCleanup = Date.now();

function cleanupRateLimitStore(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  for (const [key, entry] of rateLimitStore.entries()) {
    // Remove entries that are no longer blocked and have no recent requests
    if (!entry.blocked && entry.timestamps.length === 0) {
      rateLimitStore.delete(key);
    } else if (!entry.blocked && entry.timestamps.length > 0) {
      // Remove timestamps older than the largest possible window (10 minutes)
      const cutoff = now - 600_000;
      entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
      if (entry.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }
  lastCleanup = now;
}

// Pre-configured rate limits for different route types
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // Public booking creation - moderate limit
  "booking-create": {
    windowMs: 60_000,       // 1 minute
    maxRequests: 5,
    blockDurationMs: 300_000, // 5 minutes
  },
  // Booking lookup - slightly higher
  "booking-lookup": {
    windowMs: 60_000,
    maxRequests: 15,
    blockDurationMs: 120_000, // 2 minutes
  },
  // Contact form submissions - strict
  "contact-submit": {
    windowMs: 300_000,      // 5 minutes
    maxRequests: 3,
    blockDurationMs: 900_000, // 15 minutes
  },
  // Admin API - generous for authenticated users
  "admin-api": {
    windowMs: 60_000,
    maxRequests: 60,
    blockDurationMs: 60_000,
  },
  // Auth/login attempts - very strict
  "auth-login": {
    windowMs: 900_000,      // 15 minutes
    maxRequests: 5,
    blockDurationMs: 900_000, // 15 minutes
  },
  // General API - default
  "general-api": {
    windowMs: 60_000,
    maxRequests: 30,
    blockDurationMs: 120_000,
  },
  // Gallery/media - moderate
  "gallery": {
    windowMs: 60_000,
    maxRequests: 40,
    blockDurationMs: 60_000,
  },
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

/**
 * Check rate limit for a given key and route type
 */
export function checkRateLimit(
  key: string,
  routeType: string = "general-api"
): RateLimitResult {
  cleanupRateLimitStore();

  const config = RATE_LIMIT_CONFIGS[routeType] || RATE_LIMIT_CONFIGS["general-api"];
  const now = Date.now();
  const entry = rateLimitStore.get(key) || {
    timestamps: [],
    blocked: false,
    blockedUntil: 0,
  };

  // Check if currently blocked
  if (entry.blocked && now < entry.blockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.blockedUntil,
      retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
    };
  }

  // Reset block if it has expired
  if (entry.blocked && now >= entry.blockedUntil) {
    entry.blocked = false;
    entry.blockedUntil = 0;
  }

  // Filter timestamps within the current window
  const windowStart = now - config.windowMs;
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  // Check if the limit is exceeded
  if (entry.timestamps.length >= config.maxRequests) {
    entry.blocked = true;
    entry.blockedUntil = now + config.blockDurationMs;
    rateLimitStore.set(key, entry);

    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.blockedUntil,
      retryAfter: Math.ceil(config.blockDurationMs / 1000),
    };
  }

  // Add the current request timestamp
  entry.timestamps.push(now);
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.timestamps.length,
    resetAt: now + config.windowMs,
  };
}

/**
 * Get rate limit stats for a key
 */
export function getRateLimitStats(key: string, routeType: string = "general-api"): {
  current: number;
  limit: number;
  remaining: number;
  resetAt: number;
  isBlocked: boolean;
} {
  const config = RATE_LIMIT_CONFIGS[routeType] || RATE_LIMIT_CONFIGS["general-api"];
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry) {
    return {
      current: 0,
      limit: config.maxRequests,
      remaining: config.maxRequests,
      resetAt: now + config.windowMs,
      isBlocked: false,
    };
  }

  const windowStart = now - config.windowMs;
  const currentTimestamps = entry.timestamps.filter((t) => t > windowStart);

  return {
    current: currentTimestamps.length,
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - currentTimestamps.length),
    resetAt: now + config.windowMs,
    isBlocked: entry.blocked && now < entry.blockedUntil,
  };
}

/**
 * Reset rate limit for a key (admin use)
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

// ─── CSRF Protection ───

const csrfTokenStore = new Map<string, { token: string; expiresAt: number }>();

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(sessionId?: string): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);

  const token = Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
  const key = sessionId || token.slice(0, 16);
  const expiresAt = Date.now() + 3_600_000; // 1 hour

  csrfTokenStore.set(key, { token, expiresAt });

  // Cleanup old tokens
  for (const [k, v] of csrfTokenStore.entries()) {
    if (v.expiresAt < Date.now()) {
      csrfTokenStore.delete(k);
    }
  }

  return token;
}

/**
 * Validate a CSRF token
 */
export function validateCSRFToken(token: string, sessionId?: string): boolean {
  if (!token) return false;

  const key = sessionId || token.slice(0, 16);
  const stored = csrfTokenStore.get(key);

  if (!stored) return false;
  if (stored.expiresAt < Date.now()) {
    csrfTokenStore.delete(key);
    return false;
  }

  // Constant-time comparison
  if (stored.token.length !== token.length) return false;

  let result = 0;
  for (let i = 0; i < stored.token.length; i++) {
    result |= stored.token.charCodeAt(i) ^ token.charCodeAt(i);
  }

  return result === 0;
}

// ─── Content Security Policy ───

export interface CSPDirectives {
  defaultSrc?: string[];
  scriptSrc?: string[];
  styleSrc?: string[];
  imgSrc?: string[];
  fontSrc?: string[];
  connectSrc?: string[];
  mediaSrc?: string[];
  frameSrc?: string[];
  objectSrc?: string[];
  baseUri?: string[];
  formAction?: string[];
  frameAncestors?: string[];
  upgradeInsecureRequests?: boolean;
}

/**
 * Build a Content Security Policy header value
 */
export function buildCSP(directives?: CSPDirectives): string {
  const defaultDirectives: CSPDirectives = {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:", "blob:"],
    fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
    connectSrc: ["'self'", "https://vitals.vercel-insights.com"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    upgradeInsecureRequests: true,
  };

  const merged = { ...defaultDirectives, ...directives };

  const parts: string[] = [];

  if (merged.defaultSrc) parts.push(`default-src ${merged.defaultSrc.join(" ")}`);
  if (merged.scriptSrc) parts.push(`script-src ${merged.scriptSrc.join(" ")}`);
  if (merged.styleSrc) parts.push(`style-src ${merged.styleSrc.join(" ")}`);
  if (merged.imgSrc) parts.push(`img-src ${merged.imgSrc.join(" ")}`);
  if (merged.fontSrc) parts.push(`font-src ${merged.fontSrc.join(" ")}`);
  if (merged.connectSrc) parts.push(`connect-src ${merged.connectSrc.join(" ")}`);
  if (merged.mediaSrc) parts.push(`media-src ${merged.mediaSrc.join(" ")}`);
  if (merged.frameSrc) parts.push(`frame-src ${merged.frameSrc.join(" ")}`);
  if (merged.objectSrc) parts.push(`object-src ${merged.objectSrc.join(" ")}`);
  if (merged.baseUri) parts.push(`base-uri ${merged.baseUri.join(" ")}`);
  if (merged.formAction) parts.push(`form-action ${merged.formAction.join(" ")}`);
  if (merged.frameAncestors) parts.push(`frame-ancestors ${merged.frameAncestors.join(" ")}`);
  if (merged.upgradeInsecureRequests) parts.push("upgrade-insecure-requests");

  return parts.join("; ");
}

// ─── Security Headers ───

export interface SecurityHeadersConfig {
  environment: "production" | "development";
  allowedOrigins?: string[];
  reportUri?: string;
}

/**
 * Generate security headers for responses
 */
export function getSecurityHeaders(config?: SecurityHeadersConfig): Record<string, string> {
  const isProduction = config?.environment === "production";
  const env = config?.environment || (process.env.NODE_ENV === "production" ? "production" : "development");

  const csp = buildCSP(
    env === "development"
      ? {
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "localhost:*"],
          connectSrc: ["'self'", "ws://localhost:*", "http://localhost:*"],
        }
      : undefined
  );

  return {
    // Prevent clickjacking
    "X-Frame-Options": "DENY",

    // Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",

    // XSS Protection (legacy, but still useful for older browsers)
    "X-XSS-Protection": "1; mode=block",

    // Control referrer information
    "Referrer-Policy": "strict-origin-when-cross-origin",

    // Content Security Policy
    "Content-Security-Policy": csp,

    // Permissions Policy - restrict browser features
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

    // HSTS - Force HTTPS (production only)
    ...(isProduction
      ? {
          "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
        }
      : {}),

    // Cross-origin policies
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "credentialless",

    // Cache control for API responses
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
  };
}

// ─── CORS Handling ───

const DEFAULT_ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
];

/**
 * Validate request origin against allowed origins
 */
export function validateOrigin(
  request: NextRequest,
  allowedOrigins?: string[]
): { allowed: boolean; origin: string } {
  const origin = request.headers.get("origin") || "";
  const referer = request.headers.get("referer") || "";

  const origins = allowedOrigins || DEFAULT_ALLOWED_ORIGINS;

  if (!origin && !referer) {
    // Same-origin requests (like form submissions) may not have origin
    return { allowed: true, origin: "same-origin" };
  }

  // Check origin first
  if (origin) {
    const isAllowed = origins.some(
      (allowed) => origin === allowed || origin.startsWith(allowed)
    );
    return { allowed: isAllowed, origin };
  }

  // Fallback to referer
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = refererUrl.origin;
      const isAllowed = origins.some(
        (allowed) => refererOrigin === allowed || refererOrigin.startsWith(allowed)
      );
      return { allowed: isAllowed, origin: refererOrigin };
    } catch {
      return { allowed: false, origin: referer };
    }
  }

  return { allowed: false, origin: "" };
}

/**
 * Generate CORS headers for a response
 */
export function getCORSHeaders(
  origin?: string,
  allowedOrigins?: string[]
): Record<string, string> {
  const origins = allowedOrigins || DEFAULT_ALLOWED_ORIGINS;
  const isAllowed = origin && origins.some((o) => origin === o || origin.startsWith(o));

  if (!isAllowed || !origin) {
    return {};
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400", // 24 hours
    Vary: "Origin",
  };
}

// ─── Bot Detection ───

const BOT_USER_AGENT_PATTERNS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /scrape/i,
  /curl/i,
  /wget/i,
  /python/i,
  /java/i,
  /httpclient/i,
  /node-fetch/i,
  /axios/i,
  /postman/i,
  /insomnia/i,
  /sqlmap/i,
  /nikto/i,
  /nmap/i,
  /masscan/i,
  /dirbuster/i,
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

/**
 * Detect if a request is likely from a bot
 */
export function detectBot(request: NextRequest): {
  isBot: boolean;
  isMalicious: boolean;
  confidence: number; // 0-1
  userAgent: string;
} {
  const userAgent = request.headers.get("user-agent") || "";

  if (!userAgent) {
    return { isBot: true, isMalicious: true, confidence: 0.9, userAgent: "" };
  }

  // Check if it is a legitimate bot
  const isLegitimateBot = LEGITIMATE_BOT_PATTERNS.some((p) => p.test(userAgent));
  if (isLegitimateBot) {
    return { isBot: true, isMalicious: false, confidence: 0.8, userAgent };
  }

  // Check for malicious bot patterns
  const isSuspiciousBot = BOT_USER_AGENT_PATTERNS.some((p) => p.test(userAgent));
  if (isSuspiciousBot) {
    return { isBot: true, isMalicious: true, confidence: 0.7, userAgent };
  }

  // Check for missing common browser headers
  const acceptHeader = request.headers.get("accept") || "";
  const acceptLanguage = request.headers.get("accept-language") || "";

  let suspicionScore = 0;

  if (!acceptHeader || acceptHeader === "*/*") suspicionScore += 0.3;
  if (!acceptLanguage) suspicionScore += 0.3;

  // Check for headless browser indicators
  if (/headless/i.test(userAgent)) suspicionScore += 0.5;
  if (/phantom/i.test(userAgent)) suspicionScore += 0.5;
  if (/selenium/i.test(userAgent)) suspicionScore += 0.5;
  if (/puppeteer/i.test(userAgent)) suspicionScore += 0.5;

  return {
    isBot: suspicionScore > 0.5,
    isMalicious: suspicionScore > 0.6,
    confidence: Math.min(suspicionScore, 1),
    userAgent,
  };
}

// ─── Request Size Validation ───

const MAX_REQUEST_SIZES: Record<string, number> = {
  "application/json": 1024 * 100,      // 100KB
  "multipart/form-data": 1024 * 1024 * 5, // 5MB
  "application/x-www-form-urlencoded": 1024 * 50, // 50KB
};

/**
 * Validate request content size
 */
export function validateRequestSize(request: NextRequest): {
  valid: boolean;
  maxSize: number;
  contentType: string;
} {
  const contentType = request.headers.get("content-type") || "application/json";
  const contentLength = parseInt(request.headers.get("content-length") || "0", 10);

  // Find matching max size
  let maxSize = MAX_REQUEST_SIZES["application/json"];
  for (const [key, size] of Object.entries(MAX_REQUEST_SIZES)) {
    if (contentType.includes(key)) {
      maxSize = size;
      break;
    }
  }

  return {
    valid: contentLength <= maxSize,
    maxSize,
    contentType,
  };
}

// ─── JWT Token Validation Helpers ───

/**
 * Extract Bearer token from Authorization header
 */
export function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;

  return parts[1];
}

/**
 * Basic JWT structure validation (not cryptographic verification)
 */
export function isValidJWTStructure(token: string): boolean {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  // Each part should be base64url encoded
  const base64UrlRegex = /^[A-Za-z0-9_\-]+$/;
  return parts.every((part) => base64UrlRegex.test(part) && part.length > 0);
}

// ─── IP Extraction ───

/**
 * Extract client IP from request headers
 */
export function getClientIP(request: NextRequest): string {
  // Check various headers that might contain the real IP
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim());
    return ips[0] || "unknown";
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) return realIP;

  // Cloudflare specific
  const cfIP = request.headers.get("cf-connecting-ip");
  if (cfIP) return cfIP;

  return "unknown";
}

// ─── File Upload Validation ───

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
];

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB

export interface FileValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate file upload
 */
export function validateFileUpload(file: {
  name: string;
  type: string;
  size: number;
}, options?: {
  allowedTypes?: string[];
  maxSize?: number;
}): FileValidationResult {
  const errors: string[] = [];
  const allowedTypes = options?.allowedTypes || [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
  const maxSize = options?.maxSize || MAX_FILE_SIZE;

  if (!file.name || typeof file.name !== "string") {
    errors.push("File name is required");
  }

  // Check for path traversal in filename
  if (file.name && (file.name.includes("..") || file.name.includes("/") || file.name.includes("\\"))) {
    errors.push("Invalid file name");
  }

  if (!file.type || !allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }

  if (file.size > maxSize) {
    errors.push(`File size exceeds maximum of ${Math.round(maxSize / 1024 / 1024)}MB`);
  }

  if (file.size === 0) {
    errors.push("File is empty");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get file extension from filename safely
 */
export function getSafeFileExtension(filename: string): string {
  if (!filename || typeof filename !== "string") return "";

  const parts = filename.split(".");
  if (parts.length < 2) return "";

  const ext = parts[parts.length - 1].toLowerCase();

  // Only allow alphanumeric extensions
  if (!/^[a-z0-9]{1,10}$/.test(ext)) return "";

  return ext;
}
