/**
 * Environment Configuration Module
 *
 * This module provides a centralized, type-safe way to access all environment
 * variables for the Beauty Care by Nabila Lahore project. Every value is
 * read from process.env, ensuring complete isolation between projects and
 * smooth client ownership transfer.
 *
 * NO hardcoded values — all configuration is environment-based.
 */

// ─── Validation Helper ───
function required(key: string, value: string | undefined): string {
  if (!value || value === "") {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    console.warn(`[env] Missing optional env var in development: ${key}`);
    return "";
  }
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

// ─── Application Config ───
export const APP_CONFIG = {
  name: optional("NEXT_PUBLIC_APP_NAME", "Beauty Care by Nabila Lahore"),
  url: optional("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  version: optional("NEXT_PUBLIC_APP_VERSION", "1.0.0"),
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
} as const;

// ─── Site Config ───
export const SITE_CONFIG = {
  url: optional("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  name: optional("NEXT_PUBLIC_SITE_NAME", "Beauty Care by Nabila Lahore"),
  description: optional(
    "NEXT_PUBLIC_SITE_DESCRIPTION",
    "Luxury Salon & Bridal Studio — M.M. Alam Road, Gulberg III, Lahore"
  ),
} as const;

// ─── Contact Config ───
export const CONTACT_CONFIG = {
  phone: optional("NEXT_PUBLIC_PHONE", "+92-300-1234567"),
  whatsapp: optional("NEXT_PUBLIC_WHATSAPP", "+923001234567"),
  email: optional("NEXT_PUBLIC_EMAIL", "hello@nabilalahore.com"),
  address: optional(
    "NEXT_PUBLIC_ADDRESS",
    "M.M. Alam Road, Gulberg III, Lahore, Pakistan"
  ),
} as const;

// ─── Firebase Client Config (Public) ───
export const FIREBASE_CLIENT_CONFIG = {
  apiKey: required("NEXT_PUBLIC_FIREBASE_API_KEY", process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: optional(
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "nabila-lahore.firebaseapp.com"
  ),
  projectId: optional("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "nabila-lahore"),
  storageBucket: optional(
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "nabila-lahore.appspot.com"
  ),
  messagingSenderId: required(
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  ),
  appId: required("NEXT_PUBLIC_FIREBASE_APP_ID", process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  measurementId: optional("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID", ""),
} as const;

// ─── Firebase Admin Config (Server-Only) ───
export const FIREBASE_ADMIN_CONFIG = {
  projectId: optional("FIREBASE_ADMIN_PROJECT_ID", "nabila-lahore"),
  clientEmail: optional(
    "FIREBASE_ADMIN_CLIENT_EMAIL",
    "firebase-adminsdk@nabila-lahore.iam.gserviceaccount.com"
  ),
  privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(
    /\\n/g,
    "\n"
  ),
} as const;

// ─── Sanity CMS Config ───
export const SANITY_CONFIG = {
  projectId: required("NEXT_PUBLIC_SANITY_PROJECT_ID", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
  dataset: optional("NEXT_PUBLIC_SANITY_DATASET", "production"),
  apiToken: process.env.SANITY_API_TOKEN || "",
  apiVersion: optional("SANITY_API_VERSION", "2024-01-01"),
} as const;

// ─── Cloudinary Config ───
export const CLOUDINARY_CONFIG = {
  cloudName: required("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME),
  apiKey: process.env.CLOUDINARY_API_KEY || "",
  apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  uploadPreset: optional("CLOUDINARY_UPLOAD_PRESET", "nabila-lahore-uploads"),
} as const;

// ─── Database Config ───
export const DATABASE_CONFIG = {
  url: optional("DATABASE_URL", "file:./db/custom.db"),
} as const;

// ─── NextAuth Config ───
export const NEXTAUTH_CONFIG = {
  url: optional("NEXTAUTH_URL", "http://localhost:3000"),
  secret: required("NEXTAUTH_SECRET", process.env.NEXTAUTH_SECRET),
} as const;

// ─── Admin Config ───
export const ADMIN_CONFIG = {
  email: optional("ADMIN_EMAIL", "admin@nabilalahore.com"),
  role: optional("ADMIN_ROLE", "super-admin"),
} as const;

// ─── Booking Config ───
export const BOOKING_CONFIG = {
  confirmationPrefix: optional("BOOKING_CONFIRMATION_PREFIX", "NBL"),
  maxAdvanceDays: parseInt(optional("BOOKING_MAX_ADVANCE_DAYS", "30"), 10),
  slotsStart: optional("BOOKING_SLOTS_START", "10:00"),
  slotsEnd: optional("BOOKING_SLOTS_END", "20:00"),
  slotInterval: parseInt(optional("BOOKING_SLOT_INTERVAL", "60"), 10),
} as const;

// ─── Security Config ───
export const SECURITY_CONFIG = {
  rateLimitMaxRequests: parseInt(optional("RATE_LIMIT_MAX_REQUESTS", "100"), 10),
  rateLimitWindowMs: parseInt(optional("RATE_LIMIT_WINDOW_MS", "60000"), 10),
  csrfSecret: optional("CSRF_SECRET", ""),
} as const;

// ─── Social Media Config ───
export const SOCIAL_CONFIG = {
  instagram: optional("NEXT_PUBLIC_INSTAGRAM_URL", "https://instagram.com/nabilalahore"),
  facebook: optional("NEXT_PUBLIC_FACEBOOK_URL", "https://facebook.com/nabilalahore"),
  tiktok: optional("NEXT_PUBLIC_TIKTOK_URL", "https://tiktok.com/@nabilalahore"),
  youtube: optional("NEXT_PUBLIC_YOUTUBE_URL", "https://youtube.com/@nabilalahore"),
} as const;

// ─── SEO Config ───
export const SEO_CONFIG = {
  googleVerification: optional("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION", ""),
  yandexVerification: optional("NEXT_PUBLIC_YANDEX_VERIFICATION", ""),
  gaMeasurementId: optional("NEXT_PUBLIC_GA_MEASUREMENT_ID", ""),
  gtmId: optional("NEXT_PUBLIC_GTM_ID", ""),
} as const;

// ─── Project Isolation Check ───
export function validateProjectIsolation(): { isolated: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Check that Firebase project ID is set and project-specific
  const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!firebaseProjectId) {
    warnings.push("Firebase project ID not set — using default placeholder");
  } else if (!firebaseProjectId.includes("nabila")) {
    warnings.push(`Firebase project ID "${firebaseProjectId}" may not be project-specific`);
  }

  // Check that NextAuth secret is set
  if (!process.env.NEXTAUTH_SECRET) {
    warnings.push("NEXTAUTH_SECRET not set — authentication will not work in production");
  }

  // Check that Sanity project ID is set
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    warnings.push("Sanity project ID not set — CMS will not connect");
  }

  // Check that admin email is not a generic placeholder
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && (adminEmail.includes("example") || adminEmail.includes("test"))) {
    warnings.push(`Admin email "${adminEmail}" looks like a placeholder`);
  }

  return {
    isolated: warnings.length === 0,
    warnings,
  };
}
