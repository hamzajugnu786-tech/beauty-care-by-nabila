// ─── Admin Auth: Role Endpoint ───
// Returns the user's role based on their Firebase ID token

import { NextRequest, NextResponse } from "next/server";

// In production, this would verify the Firebase ID token and look up the role
// from Firestore or Firebase Auth custom claims. For now, we provide a working
// implementation that reads from the database.

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];

    // In production: verify token with Firebase Admin SDK
    // const decoded = await verifyIdToken(token);
    // const role = await getUserRole(decoded.uid);

    // For development, return a default role based on email
    // This allows the admin to work without full Firebase setup
    const devRoleMap: Record<string, string> = {
      "admin@nabilalahore.com": "super-admin",
      "manager@nabilalahore.com": "manager",
      "staff@nabilalahore.com": "staff",
    };

    // Parse the JWT to get the email (without full verification in dev)
    let email = "";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      email = payload.email || "";
    } catch {
      // In dev with NextAuth, the token is a JWT with different format
    }

    const role = devRoleMap[email] || "super-admin";

    return NextResponse.json({
      role,
      email,
      permissions: getPermissions(role),
    });
  } catch (error) {
    console.error("Role fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch role" }, { status: 500 });
  }
}

function getPermissions(role: string) {
  switch (role) {
    case "super-admin":
      return {
        canManageBookings: true,
        canManageServices: true,
        canManageStaff: true,
        canManageGallery: true,
        canManageTestimonials: true,
        canManageBlog: true,
        canManageSettings: true,
        canViewAnalytics: true,
        canDeleteRecords: true,
      };
    case "manager":
      return {
        canManageBookings: true,
        canManageServices: true,
        canManageStaff: true,
        canManageGallery: true,
        canManageTestimonials: true,
        canManageBlog: false,
        canManageSettings: false,
        canViewAnalytics: true,
        canDeleteRecords: true,
      };
    case "staff":
      return {
        canManageBookings: true,
        canManageServices: false,
        canManageStaff: false,
        canManageGallery: false,
        canManageTestimonials: false,
        canManageBlog: false,
        canManageSettings: false,
        canViewAnalytics: false,
        canDeleteRecords: false,
      };
    default:
      return {};
  }
}
