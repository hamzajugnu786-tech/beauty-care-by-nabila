// ─── NextAuth Configuration with Firebase ───
// Handles admin authentication with email/password + role-based access

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth as firebaseAuth } from "@/lib/firebase";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "firebase-credentials",
      name: "Firebase Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Sign in with Firebase Auth
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
          console.error("Auth error:", error);
          return null;
        }
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
  secret: process.env.NEXTAUTH_SECRET,
};
