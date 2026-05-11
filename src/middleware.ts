// ─── Middleware: Route Protection ───
// Protects admin routes with authentication and role-based access

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that don't require authentication
const publicRoutes = ["/admin/login", "/api/auth"];

// Role-based route access
const roleRoutes: Record<string, string[]> = {
  "super-admin": ["/admin"],
  manager: ["/admin", "/admin/bookings", "/admin/services", "/admin/staff", "/admin/gallery", "/admin/testimonials"],
  staff: ["/admin", "/admin/bookings"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Only protect admin routes
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // Check for JWT token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // No token → redirect to login
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access for specific routes
  const userRole = (token as any).role as string;
  const allowedRoutes = roleRoutes[userRole] || [];

  // Super-admin has access to everything
  if (userRole === "super-admin") {
    return NextResponse.next();
  }

  // Check if the current path is allowed for the user's role
  const isAllowed = allowedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));

  if (!isAllowed) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
