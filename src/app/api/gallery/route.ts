// ─── Public Gallery API ───
// Fetches gallery images: merges Cloudinary resources with database metadata

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dm2niml6l";
const API_KEY = process.env.CLOUDINARY_API_KEY || "255354961216669";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "";

export async function GET() {
  try {
    // First, try to get gallery items from the database
    const dbItems = await prisma.gallery.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    // If we have database items, use them
    if (dbItems.length > 0) {
      const images = dbItems.map((item) => ({
        id: item.id,
        src: item.src,
        alt: item.alt,
        category: item.category,
        height: item.height,
        featured: item.featured,
      }));
      return NextResponse.json({ images });
    }

    // Fallback: fetch from Cloudinary if no database items
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?max_results=100&prefix=nabila-gallery/`,
      {
        headers: {
          Authorization: "Basic " + Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64"),
        },
      }
    );

    if (!response.ok) {
      console.error("Cloudinary API error:", response.status);
      return NextResponse.json({ images: [] }, { status: 200 });
    }

    const data = await response.json();

    const images = (data.resources || []).map((img: Record<string, unknown>) => {
      const publicId = (img.public_id as string) || "";
      const context = (img.context as Record<string, Record<string, string>>) || {};
      const customMeta = context.custom || {};

      const folderParts = publicId.split("/");
      const alt = customMeta.alt || customMeta.caption || folderParts[folderParts.length - 1] || "Gallery image";

      const cleanAlt = /^(IMG|DSC|Screenshot|image|photo|file|VID)_?\d/i.test(alt) || /\.(jpg|jpeg|png|gif|webp|heic)$/i.test(alt)
        ? ""
        : alt;

      return {
        id: publicId,
        src: img.secure_url || img.url,
        alt: cleanAlt || "Gallery image",
        category: customMeta.category || "general",
        height: customMeta.height || "medium",
        featured: customMeta.featured === "true",
      };
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json({ images: [] }, { status: 200 });
  }
}
