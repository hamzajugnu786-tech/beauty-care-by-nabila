import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";

const prisma = new PrismaClient();

// Generate a unique confirmation code
function generateConfirmationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "NBL-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST /api/bookings — Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      branchId,
      branchName,
      serviceId,
      serviceTitle,
      serviceCategory,
      servicePrice,
      serviceDuration,
      addOns,
      artistId,
      artistName,
      date,
      timeSlot,
      clientName,
      clientPhone,
      clientEmail,
      clientNotes,
    } = body;

    // Validation
    if (!branchId || !branchName) {
      return NextResponse.json({ error: "Branch is required" }, { status: 400 });
    }
    if (!serviceId || !serviceTitle) {
      return NextResponse.json({ error: "Service is required" }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }
    if (!timeSlot) {
      return NextResponse.json({ error: "Time slot is required" }, { status: 400 });
    }
    if (!clientName || clientName.trim().length < 2) {
      return NextResponse.json({ error: "Valid name is required" }, { status: 400 });
    }
    if (!clientPhone || clientPhone.trim().length < 10) {
      return NextResponse.json({ error: "Valid phone number is required" }, { status: 400 });
    }

    // Check for conflicting bookings
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date,
        timeSlot,
        status: { in: ["pending", "confirmed"] },
        ...(artistId ? { artistId } : {}),
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "This time slot is no longer available. Please select another." },
        { status: 409 }
      );
    }

    // Generate unique confirmation code
    let confirmationCode = generateConfirmationCode();
    let codeExists = await prisma.booking.findUnique({
      where: { confirmationCode },
    });
    while (codeExists) {
      confirmationCode = generateConfirmationCode();
      codeExists = await prisma.booking.findUnique({
        where: { confirmationCode },
      });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        confirmationCode,
        branchId,
        branchName,
        serviceId,
        serviceTitle,
        serviceCategory,
        servicePrice,
        serviceDuration,
        addOns: JSON.stringify(addOns || []),
        artistId: artistId || null,
        artistName: artistName || null,
        date,
        timeSlot,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail?.trim() || null,
        clientNotes: clientNotes?.trim() || "",
        status: "confirmed",
        paymentStatus: "unpaid",
        whatsappSent: false,
      },
    });

    // Block the slot
    await prisma.blockedSlot.create({
      data: {
        artistId: artistId || null,
        date,
        timeSlot,
        bookingId: booking.id,
        reason: "booking",
      },
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        confirmationCode: booking.confirmationCode,
        status: booking.status,
        serviceTitle: booking.serviceTitle,
        date: booking.date,
        timeSlot: booking.timeSlot,
        clientName: booking.clientName,
        branchName: booking.branchName,
        artistName: booking.artistName,
      },
      // WhatsApp message template
      whatsappLink: `https://wa.me/923001234567?text=${encodeURIComponent(
        `Hi! I've just booked an appointment.\n\n` +
        `📋 Confirmation: ${booking.confirmationCode}\n` +
        `💆 Service: ${booking.serviceTitle}\n` +
        `📅 Date: ${format(new Date(booking.date), "EEEE, MMMM d, yyyy")}\n` +
        `🕐 Time: ${booking.timeSlot}\n` +
        `📍 Branch: ${booking.branchName}\n` +
        `${booking.artistName ? `👤 Artist: ${booking.artistName}\n` : ""}` +
        `\nName: ${booking.clientName}\n` +
        `Phone: ${booking.clientPhone}`
      )}`,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Failed to create booking. Please try again." },
      { status: 500 }
    );
  }
}

// GET /api/bookings — List bookings (with filters)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const phone = searchParams.get("phone");
    const confirmationCode = searchParams.get("code");
    const status = searchParams.get("status");

    if (confirmationCode) {
      const booking = await prisma.booking.findUnique({
        where: { confirmationCode },
      });
      if (!booking) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ booking });
    }

    if (phone) {
      const bookings = await prisma.booking.findMany({
        where: {
          clientPhone: phone,
          ...(status ? { status } : {}),
        },
        orderBy: { date: "desc" },
        take: 20,
      });
      return NextResponse.json({ bookings });
    }

    return NextResponse.json(
      { error: "Provide phone number or confirmation code" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Booking lookup error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings — Update booking status (cancel, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, confirmationCode, action } = body;

    // Find booking
    const booking = confirmationCode
      ? await prisma.booking.findUnique({ where: { confirmationCode } })
      : await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Cannot cancel already completed/cancelled bookings
    if (booking.status === "completed" || booking.status === "cancelled") {
      return NextResponse.json(
        { error: `Booking is already ${booking.status}` },
        { status: 400 }
      );
    }

    switch (action) {
      case "cancel": {
        const updated = await prisma.booking.update({
          where: { id: booking.id },
          data: {
            status: "cancelled",
            paymentStatus: booking.paymentStatus === "paid" ? "refunded" : booking.paymentStatus,
          },
        });
        // Unblock the slot
        await prisma.blockedSlot.deleteMany({
          where: { bookingId: booking.id },
        });
        return NextResponse.json({ success: true, booking: updated });
      }
      case "confirm": {
        const updated = await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "confirmed" },
        });
        return NextResponse.json({ success: true, booking: updated });
      }
      case "reschedule": {
        const { newDate, newTimeSlot } = body;
        if (!newDate || !newTimeSlot) {
          return NextResponse.json(
            { error: "New date and time required" },
            { status: 400 }
          );
        }
        // Remove old blocked slot
        await prisma.blockedSlot.deleteMany({
          where: { bookingId: booking.id },
        });
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
          where: { id: booking.id },
          data: { date: newDate, timeSlot: newTimeSlot },
        });
        return NextResponse.json({ success: true, booking: updated });
      }
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Booking update error:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
