// ─── NextAuth API Route ───
// Always uses authOptions which includes the fallback credentials provider
// The authorize() function in authOptions handles both Firebase and fallback auth

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Always use full authOptions — the authorize() function already handles
// the Firebase-not-configured case by falling through to FALLBACK_ADMINS.
// Previously stripping providers when Firebase was unconfigured made login impossible.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
