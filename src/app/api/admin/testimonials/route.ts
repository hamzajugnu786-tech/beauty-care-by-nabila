// ─── Admin Testimonials API ───
// CRUD for testimonials management

import { NextRequest, NextResponse } from "next/server";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image: string;
  featured: boolean;
  isActive: boolean;
  createdAt: string;
}

// Mock in-memory store (replace with Firestore/Sanity in production)
let testimonials: Testimonial[] = [];

// GET /api/admin/testimonials
export async function GET() {
  return NextResponse.json({ testimonials, total: testimonials.length });
}

// POST /api/admin/testimonials — Create testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, quote, rating, image, featured, isActive } = body;

    if (!name || !quote) {
      return NextResponse.json({ error: "Name and quote are required" }, { status: 400 });
    }

    const item: Testimonial = {
      id: `test-${Date.now()}`,
      name,
      role: role || "",
      quote,
      rating: rating || 5,
      image: image || "",
      featured: featured || false,
      isActive: isActive !== false,
      createdAt: new Date().toISOString(),
    };

    testimonials.unshift(item);
    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error("Testimonial creation error:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}

// PATCH /api/admin/testimonials — Update testimonial
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { testimonialId, data } = body;

    if (!testimonialId) {
      return NextResponse.json({ error: "Testimonial ID required" }, { status: 400 });
    }

    const index = testimonials.findIndex((t) => t.id === testimonialId);
    if (index === -1) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    testimonials[index] = { ...testimonials[index], ...data };
    return NextResponse.json({ success: true, item: testimonials[index] });
  } catch (error) {
    console.error("Testimonial update error:", error);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

// DELETE /api/admin/testimonials
export async function DELETE(request: NextRequest) {
  try {
    const { testimonialId } = await request.json();
    if (!testimonialId) {
      return NextResponse.json({ error: "Testimonial ID required" }, { status: 400 });
    }

    testimonials = testimonials.filter((t) => t.id !== testimonialId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Testimonial delete error:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
