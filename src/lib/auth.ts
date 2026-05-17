// ─── NextAuth Configuration with Firebase + Fallback ───
// Handles admin authentication with email/password + role-based access
// Falls back to direct credential check when Firebase is unavailable

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { isFirebaseConfigured } from "@/lib/firebase";

// Lazy-load Firebase only when configured
// eslint-disable-next-line @typescript-eslint/no-require-imports
let firebaseAuth: any = null;
if (typeof window !== "undefined" && isFirebaseConfigured) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const firebase = require("@/lib/firebase");
    firebaseAuth = firebase.auth;
  } catch {
    // Firebase not available
  }
}

// Fallback admin credentials (used when Firebase is not configured)
const FALLBACK_ADMINS = [
  { email: "admin@nabilalahore.com", password: "admin1234", name: "Nabila Admin", role: "super-admin" },
];

const isProduction = process.env.NODE_ENV === "production";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "firebase-credentials",
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Try Firebase Auth first if configured
        if (isFirebaseConfigured && firebaseAuth) {
          try {
            const { signInWithEmailAndPassword } = await import("firebase/auth");
            const userCredential = await signInWithEmailAndPassword(
              firebaseAuth,
              credentials.email,
              credentials.password
            );

            const user = userCredential.user;
            const idToken = await user.getIdToken();

            // Fetch the user's role from our API
            const roleRes = await fetch(
              `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/admin/auth/role`,
              {
                headers: { Authorization: `Bearer ${idToken}` },
              }
            );

            const roleData = await roleRes.json();
            const role = roleData.role || "staff";

            return {
              id: user.uid,
              email: user.email,
              name: user.displayName || user.email?.split("@")[0],
              image: user.photoURL,
              role,
              idToken,
            };
          } catch (error) {
            console.error("Firebase auth error, trying fallback:", error);
            // Fall through to fallback
          }
        }

        // Fallback: Direct credential check (when Firebase is unavailable)
        const admin = FALLBACK_ADMINS.find(
          (a) => a.email === credentials.email && a.password === credentials.password
        );

        if (admin) {
          return {
            id: `fallback-${admin.email.replace(/[^a-z0-9]/g, "-")}`,
            email: admin.email,
            name: admin.name,
            image: null,
            role: admin.role,
            idToken: "fallback-token",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = (user as any).role;
        token.idToken = (user as any).idToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).uid = token.uid;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || "beauty-care-nabila-lahore-secret-2026",
  cookies: {
    sessionToken: {
      name: `${isProduction ? "__Host-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: isProduction ? "lax" : "lax",
        path: isProduction ? "/" : "/",
        secure: isProduction,
      },
    },
    callbackUrl: {
      name: `${isProduction ? "__Secure-" : ""}next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: isProduction,
      },
    },
    csrfToken: {
      name: `${isProduction ? "__Host-" : ""}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
      },
    },
  },
  debug: !isProduction,
};
