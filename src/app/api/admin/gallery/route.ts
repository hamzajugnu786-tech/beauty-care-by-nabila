// ─── Admin Gallery API ───
// CRUD for gallery image management with Prisma + Cloudinary integration

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/gallery — List gallery items
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (featured === "true") where.featured = true;

    const items = await prisma.gallery.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items, total: items.length });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json({ items: [], total: 0 }, { status: 200 });
  }
}

// POST /api/admin/gallery — Create new gallery item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { src, alt, category, height, featured, isActive, cloudinaryId } = body;

    if (!src) {
      return NextResponse.json({ error: "Image source URL required" }, { status: 400 });
    }

    const item = await prisma.gallery.create({
      data: {
        src,
        alt: alt || "Gallery image",
        category: category || "general",
        height: height || "medium",
        featured: featured || false,
        isActive: isActive !== undefined ? isActive : true,
        cloudinaryId: cloudinaryId || "",
      },
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error("Gallery create error:", error);
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 });
  }
}

// PATCH /api/admin/gallery — Update gallery item
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, data } = body;

    if (!itemId) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (data.alt !== undefined) updateData.alt = data.alt;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.height !== undefined) updateData.height = data.height;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.src !== undefined) updateData.src = data.src;
    if (data.cloudinaryId !== undefined) updateData.cloudinaryId = data.cloudinaryId;

    const item = await prisma.gallery.update({
      where: { id: itemId },
      data: updateData,
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Gallery update error:", error);
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 });
  }
}

// DELETE /api/admin/gallery — Delete gallery item
export async function DELETE(request: NextRequest) {
  try {
    const { itemId } = await request.json();
    if (!itemId) {
      return NextResponse.json({ error: "Item ID required" }, { status: 400 });
    }

    await prisma.gallery.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery delete error:", error);
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
}
