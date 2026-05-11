// ─── Bookings API with Security ───
// All booking endpoints wrapped with rate limiting, input validation,
// sanitization, and secure error handling

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { format } from "date-fns";
import {
  checkRateLimit,
  getClientIP,
  sanitizeInput,
  sanitizeName,
  sanitizePhone,
  sanitizeEmail,
  detectSQLInjection,
  detectXSS,
  validateRequestSize,
} from "@/lib/security";
import {
  createBookingSchema,
  lookupBookingByCodeSchema,
  lookupBookingByPhoneSchema,
  updateBookingSchema,
  safeParse,
} from "@/lib/validators";

// Generate a unique confirmation code
function generateConfirmationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "NBL-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Check for malicious input patterns
 */
function checkMaliciousInput(input: string, fieldName: string): NextResponse | null {
  if (detectSQLInjection(input)) {
    return NextResponse.json(
      { error: `Invalid input in ${fieldName}` },
      { status: 400 }
    );
  }
  if (detectXSS(input)) {
    return NextResponse.json(
      { error: `Invalid input in ${fieldName}` },
      { status: 400 }
    );
  }
  return null;
}

// POST /api/bookings -- Create a new booking
export async function POST(request: NextRequest) {
  try {
    // --- Security: Rate limiting ---
    const ip = getClientIP(request);
    const rateLimitResult = checkRateLimit(ip, "booking-create");
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many booking attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.retryAfter || 300),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // --- Security: Request size validation ---
    const sizeCheck = validateRequestSize(request);
    if (!sizeCheck.valid) {
      return NextResponse.json(
        { error: "Request payload too large" },
        { status: 413 }
      );
    }

    // --- Security: Parse and validate input ---
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate with Zod schema
    const parseResult = safeParse(createBookingSchema, body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.errors },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // --- Security: Check for malicious patterns in key fields ---
    const nameCheck = checkMaliciousInput(data.clientName, "name");
    if (nameCheck) return nameCheck;

    const phoneCheck = checkMaliciousInput(data.clientPhone, "phone");
    if (phoneCheck) return phoneCheck;

    if (data.clientEmail) {
      const emailCheck = checkMaliciousInput(data.clientEmail, "email");
      if (emailCheck) return emailCheck;
    }

    if (data.clientNotes) {
      const notesCheck = checkMaliciousInput(data.clientNotes, "notes");
      if (notesCheck) return notesCheck;
    }

    // --- Security: Sanitize inputs ---
    const sanitizedData = {
      ...data,
      clientName: sanitizeName(data.clientName),
      clientPhone: sanitizePhone(data.clientPhone),
      clientEmail: data.clientEmail ? sanitizeEmail(data.clientEmail) : null,
      clientNotes: data.clientNotes ? sanitizeInput(data.clientNotes) : "",
      branchName: sanitizeInput(data.branchName),
      serviceTitle: sanitizeInput(data.serviceTitle),
      serviceCategory: sanitizeInput(data.serviceCategory),
      servicePrice: sanitizeInput(data.servicePrice),
      serviceDuration: sanitizeInput(data.serviceDuration),
      artistName: data.artistName ? sanitizeInput(data.artistName) : null,
    };

    // Check for conflicting bookings
    const existingBooking = await db.booking.findFirst({
      where: {
        date: sanitizedData.date,
        timeSlot: sanitizedData.timeSlot,
        status: { in: ["pending", "confirmed"] },
        ...(sanitizedData.artistId ? { artistId: sanitizedData.artistId } : {}),
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
    let codeExists = await db.booking.findUnique({
      where: { confirmationCode },
    });
    while (codeExists) {
      confirmationCode = generateConfirmationCode();
      codeExists = await db.booking.findUnique({
        where: { confirmationCode },
      });
    }

    // Create booking
    const booking = await db.booking.create({
      data: {
        confirmationCode,
        branchId: sanitizedData.branchId,
        branchName: sanitizedData.branchName,
        serviceId: sanitizedData.serviceId,
        serviceTitle: sanitizedData.serviceTitle,
        serviceCategory: sanitizedData.serviceCategory,
        servicePrice: sanitizedData.servicePrice,
        serviceDuration: sanitizedData.serviceDuration,
        addOns: JSON.stringify(sanitizedData.addOns || []),
        artistId: sanitizedData.artistId || null,
        artistName: sanitizedData.artistName || null,
        date: sanitizedData.date,
        timeSlot: sanitizedData.timeSlot,
        clientName: sanitizedData.clientName,
        clientPhone: sanitizedData.clientPhone,
        clientEmail: sanitizedData.clientEmail || null,
        clientNotes: sanitizedData.clientNotes,
        status: "confirmed",
        paymentStatus: "unpaid",
        whatsappSent: false,
      },
    });

    // Block the slot
    await db.blockedSlot.create({
      data: {
        artistId: sanitizedData.artistId || null,
        date: sanitizedData.date,
        timeSlot: sanitizedData.timeSlot,
        bookingId: booking.id,
        reason: "booking",
      },
    });

    return NextResponse.json(
      {
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
            `Confirmation: ${booking.confirmationCode}\n` +
            `Service: ${booking.serviceTitle}\n` +
            `Date: ${format(new Date(booking.date), "EEEE, MMMM d, yyyy")}\n` +
            `Time: ${booking.timeSlot}\n` +
            `Branch: ${booking.branchName}\n` +
            `${booking.artistName ? `Artist: ${booking.artistName}\n` : ""}` +
            `\nName: ${booking.clientName}\n` +
            `Phone: ${booking.clientPhone}`
        )}`,
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
        },
      }
    );
  } catch (error) {
    // --- Security: Generic error without leaking details ---
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Failed to create booking. Please try again." },
      { status: 500 }
    );
  }
}

// GET /api/bookings -- List bookings (with filters)
export async function GET(request: NextRequest) {
  try {
    // --- Security: Rate limiting ---
    const ip = getClientIP(request);
    const rateLimitResult = checkRateLimit(ip, "booking-lookup");
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.retryAfter || 120),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const phone = searchParams.get("phone");
    const confirmationCode = searchParams.get("code");
    const status = searchParams.get("status");

    if (confirmationCode) {
      // Validate confirmation code format
      const parseResult = safeParse(
        lookupBookingByCodeSchema,
        { code: confirmationCode }
      );
      if (!parseResult.success) {
        return NextResponse.json(
          { error: "Invalid confirmation code format" },
          { status: 400 }
        );
      }

      // Check for injection patterns
      const codeCheck = checkMaliciousInput(confirmationCode, "code");
      if (codeCheck) return codeCheck;

      const booking = await db.booking.findUnique({
        where: { confirmationCode },
      });
      if (!booking) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { booking },
        {
          headers: {
            "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          },
        }
      );
    }

    if (phone) {
      // Validate phone format
      const parseResult = safeParse(
        lookupBookingByPhoneSchema,
        { phone, status: status || undefined }
      );
      if (!parseResult.success) {
        return NextResponse.json(
          { error: "Invalid phone number format" },
          { status: 400 }
        );
      }

      // Check for injection patterns
      const phoneCheck = checkMaliciousInput(phone, "phone");
      if (phoneCheck) return phoneCheck;

      // Sanitize phone before query
      const sanitizedPhone = sanitizePhone(phone);

      const bookings = await db.booking.findMany({
        where: {
          clientPhone: sanitizedPhone,
          ...(status ? { status } : {}),
        },
        orderBy: { date: "desc" },
        take: 20,
      });
      return NextResponse.json(
        { bookings },
        {
          headers: {
            "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          },
        }
      );
    }

    return NextResponse.json(
      { error: "Provide phone number or confirmation code" },
      { status: 400 }
    );
  } catch (error) {
    // --- Security: Generic error without leaking details ---
    console.error("Booking lookup error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings -- Update booking status (cancel, reschedule, etc.)
export async function PATCH(request: NextRequest) {
  try {
    // --- Security: Rate limiting ---
    const ip = getClientIP(request);
    const rateLimitResult = checkRateLimit(ip, "booking-create");
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.retryAfter || 300),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // --- Security: Request size validation ---
    const sizeCheck = validateRequestSize(request);
    if (!sizeCheck.valid) {
      return NextResponse.json(
        { error: "Request payload too large" },
        { status: 413 }
      );
    }

    // --- Security: Parse and validate input ---
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const parseResult = safeParse(updateBookingSchema, body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.errors },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // --- Security: Check for injection in identifiers ---
    if (data.confirmationCode) {
      const codeCheck = checkMaliciousInput(data.confirmationCode, "confirmation code");
      if (codeCheck) return codeCheck;
    }
    if (data.bookingId) {
      const idCheck = checkMaliciousInput(data.bookingId, "booking ID");
      if (idCheck) return idCheck;
    }

    // Find booking
    const booking = data.confirmationCode
      ? await db.booking.findUnique({ where: { confirmationCode: data.confirmationCode } })
      : await db.booking.findUnique({ where: { id: data.bookingId } });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Cannot modify already completed/cancelled bookings
    if (booking.status === "completed" || booking.status === "cancelled") {
      return NextResponse.json(
        { error: `Booking is already ${booking.status}` },
        { status: 400 }
      );
    }

    switch (data.action) {
      case "cancel": {
        const updated = await db.booking.update({
          where: { id: booking.id },
          data: {
            status: "cancelled",
            paymentStatus: booking.paymentStatus === "paid" ? "refunded" : booking.paymentStatus,
          },
        });
        // Unblock the slot
        await db.blockedSlot.deleteMany({
          where: { bookingId: booking.id },
        });
        return NextResponse.json(
          { success: true, booking: updated },
          {
            headers: {
              "X-RateLimit-Remaining": String(rateLimitResult.remaining),
            },
          }
        );
      }
      case "confirm": {
        const updated = await db.booking.update({
          where: { id: booking.id },
          data: { status: "confirmed" },
        });
        return NextResponse.json(
          { success: true, booking: updated },
          {
            headers: {
              "X-RateLimit-Remaining": String(rateLimitResult.remaining),
            },
          }
        );
      }
      case "reschedule": {
        if (!data.newDate || !data.newTimeSlot) {
          return NextResponse.json(
            { error: "New date and time required" },
            { status: 400 }
          );
        }
        // Remove old blocked slot
        await db.blockedSlot.deleteMany({
          where: { bookingId: booking.id },
        });
        // Create new blocked slot
        await db.blockedSlot.create({
          data: {
            artistId: booking.artistId,
            date: data.newDate,
            timeSlot: data.newTimeSlot,
            bookingId: booking.id,
            reason: "reschedule",
          },
        });
        const updated = await db.booking.update({
          where: { id: booking.id },
          data: { date: data.newDate, timeSlot: data.newTimeSlot },
        });
        return NextResponse.json(
          { success: true, booking: updated },
          {
            headers: {
              "X-RateLimit-Remaining": String(rateLimitResult.remaining),
            },
          }
        );
      }
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    // --- Security: Generic error without leaking details ---
    console.error("Booking update error:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
