// ─── CSRF Token API ───
// Generates and returns CSRF tokens for client-side use

import { NextRequest, NextResponse } from "next/server";
import { generateCSRFToken } from "@/lib/security";

export async function GET(request: NextRequest) {
  try {
    // Generate a new CSRF token
    const token = generateCSRFToken();

    return NextResponse.json({
      token,
      // Token expires in 1 hour
      expiresIn: 3600,
    });
  } catch (error) {
    console.error("CSRF token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate CSRF token" },
      { status: 500 }
    );
  }
}
