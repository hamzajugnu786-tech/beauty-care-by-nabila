// ─── Admin Bookings API ───
// Full CRUD for admin booking management

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/bookings — List all bookings with pagination & filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const where: any = {};
    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = dateFrom;
      if (dateTo) where.date.lte = dateTo;
    }
    if (search) {
      where.OR = [
        { clientName: { contains: search } },
        { confirmationCode: { contains: search } },
        { serviceTitle: { contains: search } },
        { clientPhone: { contains: search } },
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error("Admin bookings fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

// PATCH /api/admin/bookings — Update booking status, payment, or details
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, action, data } = body;

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    switch (action) {
      case "update-status": {
        const { status } = data;
        const validStatuses = ["pending", "confirmed", "in-progress", "completed", "cancelled", "no-show"];
        if (!validStatuses.includes(status)) {
          return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }
        const updated = await prisma.booking.update({
          where: { id: bookingId },
          data: { status },
        });
        return NextResponse.json({ success: true, booking: updated });
      }

      case "update-payment": {
        const { paymentStatus } = data;
        const validPayments = ["unpaid", "deposit", "paid", "refunded"];
        if (!validPayments.includes(paymentStatus)) {
          return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
        }
        const updated = await prisma.booking.update({
          where: { id: bookingId },
          data: { paymentStatus },
        });
        return NextResponse.json({ success: true, booking: updated });
      }

      case "reschedule": {
        const { newDate, newTimeSlot } = data;
        if (!newDate || !newTimeSlot) {
          return NextResponse.json({ error: "New date and time required" }, { status: 400 });
        }
        // Remove old blocked slot
        await prisma.blockedSlot.deleteMany({ where: { bookingId: booking.id } });
        // Create new blocked slot
        await prisma.blockedSlot.create({
          data: {
            artistId: booking.artistId,
            date: newDate,
            timeSlot: newTimeSlot,
            bookingId: booking.id,
            reason: "reschedule",
          },
        });
        const updated = await prisma.booking.update({
          where: { id: bookingId },
          data: { date: newDate, timeSlot: newTimeSlot },
        });
        return NextResponse.json({ success: true, booking: updated });
      }

      case "add-notes": {
        const { notes } = data;
        const updated = await prisma.booking.update({
          where: { id: bookingId },
          data: { clientNotes: notes },
        });
        return NextResponse.json({ success: true, booking: updated });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Admin booking update error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

// DELETE /api/admin/bookings — Delete a booking (super-admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { bookingId } = await request.json();
    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    // Remove blocked slots first
    await prisma.blockedSlot.deleteMany({ where: { bookingId } });
    // Delete booking
    await prisma.booking.delete({ where: { id: bookingId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin booking delete error:", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
