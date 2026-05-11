// ─── Admin Services API ───
// CRUD for service management

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/services — List all services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { category: "asc" },
    });
    return NextResponse.json({ services });
  } catch (error) {
    console.error("Services fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

// POST /api/admin/services — Create a new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, price, duration, icon, description, isActive } = body;

    if (!title || !category || !price) {
      return NextResponse.json({ error: "Title, category, and price are required" }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        title,
        category,
        price,
        duration: duration || "",
        icon: icon || "sparkles",
        description: description || "",
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error) {
    console.error("Service creation error:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

// PATCH /api/admin/services — Update a service
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, data } = body;

    if (!serviceId) {
      return NextResponse.json({ error: "Service ID required" }, { status: 400 });
    }

    const service = await prisma.service.update({
      where: { id: serviceId },
      data,
    });

    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error("Service update error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

// DELETE /api/admin/services — Delete a service
export async function DELETE(request: NextRequest) {
  try {
    const { serviceId } = await request.json();
    if (!serviceId) {
      return NextResponse.json({ error: "Service ID required" }, { status: 400 });
    }

    await prisma.service.delete({ where: { id: serviceId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Service delete error:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
