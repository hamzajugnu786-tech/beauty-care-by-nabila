// ─── Admin Gallery API ───
// CRUD for gallery image management (with Cloudinary integration placeholder)

import { NextRequest, NextResponse } from "next/server";

// In production, gallery items are stored in Firestore or Sanity
// This API provides the structure for managing gallery items

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  height: "tall" | "medium" | "short";
  featured: boolean;
  isActive: boolean;
  uploadedAt: string;
  cloudinaryId?: string;
}

// Mock in-memory store (replace with Firestore/Sanity in production)
let galleryItems: GalleryItem[] = [];

// GET /api/admin/gallery — List gallery items
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  let filtered = [...galleryItems];
  if (category) filtered = filtered.filter((i) => i.category === category);
  if (featured === "true") filtered = filtered.filter((i) => i.featured);

  return NextResponse.json({ items: filtered, total: filtered.length });
}

// POST /api/admin/gallery — Upload new gallery image
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { src, alt, category, height, cloudinaryId } = body;

    if (!src || !alt || !category) {
      return NextResponse.json({ error: "Source, alt text, and category required" }, { status: 400 });
    }

    const item: GalleryItem = {
      id: `gallery-${Date.now()}`,
      src,
      alt,
      category,
      height: height || "medium",
      featured: false,
      isActive: true,
      uploadedAt: new Date().toISOString(),
      cloudinaryId,
    };

    galleryItems.unshift(item);
    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error("Gallery upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
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

    const index = galleryItems.findIndex((i) => i.id === itemId);
    if (index === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    galleryItems[index] = { ...galleryItems[index], ...data };
    return NextResponse.json({ success: true, item: galleryItems[index] });
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

    const index = galleryItems.findIndex((i) => i.id === itemId);
    if (index === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const deleted = galleryItems.splice(index, 1)[0];

    // In production: also delete from Cloudinary
    // if (deleted.cloudinaryId) {
    //   await cloudinary.uploader.destroy(deleted.cloudinaryId);
    // }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery delete error:", error);
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
}
