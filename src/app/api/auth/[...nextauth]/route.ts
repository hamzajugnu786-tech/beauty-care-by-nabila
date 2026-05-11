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

const handler = isFirebaseConfigured
  ? NextAuth(authOptions)
  : NextAuth({
      ...authOptions,
      providers: [], // No providers if Firebase not configured
      secret: process.env.NEXTAUTH_SECRET || "dev-secret-key-for-session",
    });

export { handler as GET, handler as POST };
