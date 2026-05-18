// ─── Admin Setup / Migration API ───
// Ensures the database schema is up-to-date (e.g., Gallery table exists)
// Called automatically by the gallery page on first load

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check if Gallery table exists by trying to query it
    await prisma.gallery.findFirst();
    return NextResponse.json({ status: "ok", gallery: true });
  } catch (error: any) {
    // If Gallery table doesn't exist, create it using raw SQL
    if (error?.code === "P2010" || error?.message?.includes("does not exist") || error?.message?.includes("Gallery")) {
      try {
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "Gallery" (
            "id" TEXT NOT NULL,
            "src" TEXT NOT NULL,
            "alt" TEXT NOT NULL,
            "category" TEXT NOT NULL DEFAULT 'general',
            "height" TEXT NOT NULL DEFAULT 'medium',
            "featured" BOOLEAN NOT NULL DEFAULT false,
            "isActive" BOOLEAN NOT NULL DEFAULT true,
            "cloudinaryId" TEXT NOT NULL DEFAULT '',
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
          );
        `);
        return NextResponse.json({ status: "migrated", gallery: true });
      } catch (migrationError) {
        console.error("Gallery table migration failed:", migrationError);
        return NextResponse.json({ status: "migration_failed", error: "Failed to create Gallery table" }, { status: 500 });
      }
    }
    console.error("Setup check failed:", error);
    return NextResponse.json({ status: "error", error: "Unknown error" }, { status: 500 });
  }
}
