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

// Validate NextAuth secret is available
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret && process.env.NODE_ENV === "production") {
  throw new Error(
    "NEXTAUTH_SECRET environment variable is required in production. " +
    "Generate one with: openssl rand -base64 32"
  );
}

const handler = isFirebaseConfigured
  ? NextAuth(authOptions)
  : NextAuth({
      ...authOptions,
      providers: [], // No providers if Firebase not configured
      secret: nextAuthSecret || undefined, // Let NextAuth handle dev mode internally
    });

export { handler as GET, handler as POST };
