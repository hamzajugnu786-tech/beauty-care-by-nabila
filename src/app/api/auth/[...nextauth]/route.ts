// ─── NextAuth API Route ───
// Gracefully handles the case where Firebase is not configured yet

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Check if Firebase is properly configured (not placeholder values)
const isFirebaseConfigured =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your-api-key" &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "your-project-id";

// NextAuth secret — warn at runtime if missing in production, but don't crash the build
// The build process runs in "production" mode but shouldn't require runtime secrets
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!nextAuthSecret && process.env.NODE_ENV === "production" && typeof window === "undefined") {
  // Only log a warning — don't throw, as this runs during build too
  // NextAuth itself will throw a proper error at request time if secret is missing
  console.warn(
    "[auth] NEXTAUTH_SECRET is not set. Authentication will not work in production. " +
    "Generate one with: openssl rand -base64 32"
  );
}

const handler = isFirebaseConfigured
  ? NextAuth(authOptions)
  : NextAuth({
      ...authOptions,
      providers: [], // No providers if Firebase not configured
      secret: nextAuthSecret || undefined, // NextAuth will handle missing secret at request time
    });

export { handler as GET, handler as POST };
