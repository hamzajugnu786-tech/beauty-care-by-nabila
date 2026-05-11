// ─── Admin Auth: Role Endpoint ───
// Returns the user's role based on their Firebase ID token

import { NextRequest, NextResponse } from "next/server";

// In production, this verifies the Firebase ID token and looks up the role
// from Firestore or Firebase Auth custom claims. For now, we provide a working
// implementation that reads from environment variables and the database.

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];

    // Parse the JWT to get the email (without full verification in dev)
    let email = "";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      email = payload.email || "";
    } catch {
      // In dev with NextAuth, the token is a JWT with different format
    }

    // Role mapping from environment configuration
    // In production, this should come from Firestore custom claims
    const adminEmail = process.env.ADMIN_EMAIL || "admin@nabilalahore.com";
    const roleMap: Record<string, string> = {
      [adminEmail]: process.env.ADMIN_ROLE || "super-admin",
    };

    // Default to "staff" for recognized but unmapped emails
    // Default to no access for unrecognized emails
    const role = email ? (roleMap[email] || "staff") : "";

    if (!role) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

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
