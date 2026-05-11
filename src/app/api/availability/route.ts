import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { addDays, format, isWeekend, parseISO } from "date-fns";

const prisma = new PrismaClient();

// Business hours
const BUSINESS_HOURS = {
  start: 10, // 10:00 AM
  end: 20,   // 8:00 PM
  slotDuration: 60, // minutes
};

// Generate time slots for a given date
function generateTimeSlots(dateStr: string, artistId?: string): Array<{
  time: string;
  label: string;
  available: boolean;
}> {
  const date = parseISO(dateStr);
  const isSunday = date.getDay() === 0;

  if (isSunday) {
    return []; // Closed on Sundays (by appointment only)
  }

  const slots: Array<{ time: string; label: string; available: boolean }> = [];
  const { start, end } = BUSINESS_HOURS;

  for (let hour = start; hour < end; hour++) {
    const timeStr = `${hour.toString().padStart(2, "0")}:00`;
    const label = hour < 12 ? `${hour}:00 AM` : `${hour === 12 ? 12 : hour - 12}:00 PM`;
    const labelStr = hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;

    slots.push({
      time: timeStr,
      label: hour === 12 ? "12:00 PM" : labelStr,
      available: true,
    });
  }

  return slots;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");
    const artistId = searchParams.get("artistId");

    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    // Validate date format
    const parsedDate = parseISO(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Don't allow past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate < today) {
      return NextResponse.json(
        { error: "Cannot check availability for past dates" },
        { status: 400 }
      );
    }

    // Don't allow bookings more than 90 days ahead
    const maxDate = addDays(today, 90);
    if (parsedDate > maxDate) {
      return NextResponse.json(
        { error: "Cannot book more than 90 days ahead" },
        { status: 400 }
      );
    }

    // Generate base slots
    let slots = generateTimeSlots(date, artistId ?? undefined);

    // Check for existing bookings to mark slots as unavailable
    const existingBookings = await prisma.booking.findMany({
      where: {
        date,
        status: { in: ["pending", "confirmed", "in-progress"] },
        ...(artistId ? { artistId } : {}),
      },
      select: { timeSlot: true, artistId: true },
    });

    // Check for blocked slots
    const blockedSlots = await prisma.blockedSlot.findMany({
      where: {
        date,
        ...(artistId ? { artistId } : {}),
      },
      select: { timeSlot: true, artistId: true },
    });

    // Mark booked slots as unavailable
    const bookedTimes = new Set(existingBookings.map((b) => b.timeSlot));
    const blockedTimes = new Set(blockedSlots.map((b) => b.timeSlot));

    slots = slots.map((slot) => ({
      ...slot,
      available: !bookedTimes.has(slot.time) && !blockedTimes.has(slot.time),
    }));

    // If checking for specific artist, also check their availability schedule
    if (artistId) {
      const artistAvailability = await prisma.artistAvailability.findUnique({
        where: {
          artistId_date: { artistId, date },
        },
      });

      if (artistAvailability?.isOff) {
        // Artist is off this day - all slots unavailable
        slots = slots.map((slot) => ({ ...slot, available: false }));
      }
    }

    // Simulate peak hours (lunch time and evening tend to be busier)
    // This is just for demo - in production, use real booking data
    const currentHour = new Date().getHours();
    const isToday = format(parsedDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

    if (isToday) {
      slots = slots.map((slot) => {
        const slotHour = parseInt(slot.time.split(":")[0]);
        if (slotHour <= currentHour) {
          return { ...slot, available: false };
        }
        return slot;
      });
    }

    return NextResponse.json({
      date,
      dayOfWeek: format(parsedDate, "EEEE"),
      isWeekend: isWeekend(parsedDate),
      slots,
      totalAvailable: slots.filter((s) => s.available).length,
    });
  } catch (error) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
