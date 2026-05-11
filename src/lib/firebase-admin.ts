// ─── Firebase Admin SDK ───
// Server-side Firebase Admin for secure operations (token verification, admin writes)

import * as admin from "firebase-admin";

let adminApp: admin.app.App;

if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  // In dev without real credentials, initialize with minimal config
  if (process.env.NODE_ENV === "development" && !serviceAccount.projectId) {
    adminApp = admin.initializeApp({
      projectId: "nabila-salon-dev",
    });
  } else {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }
} else {
  adminApp = admin.apps[0]!;
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();

/**
 * Verify a Firebase ID token and return the decoded token.
 * Used by API routes to authenticate admin requests.
 */
export async function verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken | null> {
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Get custom claims (role) for a user.
 */
export async function getUserRole(uid: string): Promise<string> {
  try {
    const user = await adminAuth.getUser(uid);
    return (user.customClaims?.role as string) || "staff";
  } catch {
    return "staff";
  }
}

/**
 * Set custom claims (role) for a user.
 * Roles: "super-admin" | "manager" | "staff"
 */
export async function setUserRole(uid: string, role: string): Promise<void> {
  await adminAuth.setCustomUserClaims(uid, { role });
}

export default adminApp;
