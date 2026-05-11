// ─── Admin Staff API ───
// CRUD for staff/artist management

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/staff — List all staff
export async function GET() {
  try {
    const artists = await prisma.artist.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ artists });
  } catch (error) {
    console.error("Staff fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

// POST /api/admin/staff — Create new staff member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, specialties, experience, image, rating, isActive, bio, phone, email, branch } = body;

    if (!name || !title) {
      return NextResponse.json({ error: "Name and title are required" }, { status: 400 });
    }

    const artist = await prisma.artist.create({
      data: {
        name,
        title,
        specialties: JSON.stringify(specialties || []),
        experience: experience || "",
        image: image || "",
        rating: rating || 5.0,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, artist }, { status: 201 });
  } catch (error) {
    console.error("Staff creation error:", error);
    return NextResponse.json({ error: "Failed to create staff member" }, { status: 500 });
  }
}

// PATCH /api/admin/staff — Update staff member
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { artistId, data } = body;

    if (!artistId) {
      return NextResponse.json({ error: "Artist ID required" }, { status: 400 });
    }

    // Serialize specialties if provided
    const updateData = { ...data };
    if (updateData.specialties && Array.isArray(updateData.specialties)) {
      updateData.specialties = JSON.stringify(updateData.specialties);
    }

    const artist = await prisma.artist.update({
      where: { id: artistId },
      data: updateData,
    });

    return NextResponse.json({ success: true, artist });
  } catch (error) {
    console.error("Staff update error:", error);
    return NextResponse.json({ error: "Failed to update staff member" }, { status: 500 });
  }
}

// DELETE /api/admin/staff — Delete staff member
export async function DELETE(request: NextRequest) {
  try {
    const { artistId } = await request.json();
    if (!artistId) {
      return NextResponse.json({ error: "Artist ID required" }, { status: 400 });
    }

    await prisma.artist.delete({ where: { id: artistId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Staff delete error:", error);
    return NextResponse.json({ error: "Failed to delete staff member" }, { status: 500 });
  }
}
