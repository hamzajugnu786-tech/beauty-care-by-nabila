// ─── Admin Analytics API ───
// GET /api/admin/analytics — Returns dashboard statistics

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get total bookings
    const totalBookings = await prisma.booking.count();

    // Today's bookings
    const today = new Date().toISOString().split("T")[0];
    const todayBookings = await prisma.booking.count({
      where: { date: today },
    });

    // Pending bookings
    const pendingBookings = await prisma.booking.count({
      where: { status: "pending" },
    });

    // Completed bookings
    const completedBookings = await prisma.booking.count({
      where: { status: "completed" },
    });

    // Cancelled bookings
    const cancelledBookings = await prisma.booking.count({
      where: { status: "cancelled" },
    });

    // Revenue calculation (parse PKR prices)
    const completedBookingRecords = await prisma.booking.findMany({
      where: { status: { in: ["completed", "confirmed"] } },
      select: { servicePrice: true, createdAt: true },
    });

    const totalRevenue = completedBookingRecords.reduce((sum, b) => {
      const price = parseInt(b.servicePrice.replace(/[^0-9]/g, "")) || 0;
      return sum + price;
    }, 0);

    // Monthly revenue
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlyBookings = completedBookingRecords.filter(
      (b) => new Date(b.createdAt) >= thirtyDaysAgo
    );
    const monthlyRevenue = monthlyBookings.reduce((sum, b) => {
      const price = parseInt(b.servicePrice.replace(/[^0-9]/g, "")) || 0;
      return sum + price;
    }, 0);

    // Average booking value
    const avgBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

    // Unique clients
    const uniqueClients = await prisma.booking.findMany({
      select: { clientPhone: true },
      distinct: ["clientPhone"],
    });
    const totalClients = uniqueClients.length;

    // New clients this month
    const newClientsThisMonth = await prisma.booking.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { clientPhone: true },
      distinct: ["clientPhone"],
    });

    // Top service
    const topServiceResult = await prisma.booking.groupBy({
      by: ["serviceTitle"],
      _count: { serviceTitle: true },
      orderBy: { _count: { serviceTitle: "desc" } },
      take: 1,
    });

    // Top artist
    const topArtistResult = await prisma.booking.groupBy({
      by: ["artistName"],
      _count: { artistName: true },
      orderBy: { _count: { artistName: "desc" } },
      take: 1,
      where: { artistName: { not: null } },
    });

    // Revenue by month (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const monthlyData = await prisma.booking.findMany({
      where: {
        status: { in: ["completed", "confirmed"] },
        createdAt: { gte: twelveMonthsAgo },
      },
      select: { servicePrice: true, createdAt: true },
    });

    const revenueByMonth: Record<string, { revenue: number; bookings: number }> = {};
    monthlyData.forEach((b) => {
      const month = new Date(b.createdAt).toLocaleString("en-US", { month: "short", year: "2-digit" });
      if (!revenueByMonth[month]) revenueByMonth[month] = { revenue: 0, bookings: 0 };
      const price = parseInt(b.servicePrice.replace(/[^0-9]/g, "")) || 0;
      revenueByMonth[month].revenue += price;
      revenueByMonth[month].bookings += 1;
    });

    // Service breakdown by category
    const serviceBreakdown = await prisma.booking.groupBy({
      by: ["serviceCategory"],
      _count: { serviceCategory: true },
    });

    return NextResponse.json({
      stats: {
        totalBookings,
        todayBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue,
        monthlyRevenue,
        avgBookingValue,
        totalClients,
        newClientsThisMonth: newClientsThisMonth.length,
        topService: topServiceResult[0]
          ? { name: topServiceResult[0].serviceTitle, count: topServiceResult[0]._count.serviceTitle }
          : null,
        topArtist: topArtistResult[0]
          ? { name: topArtistResult[0].artistName, count: topArtistResult[0]._count.artistName }
          : null,
      },
      revenueByMonth: Object.entries(revenueByMonth).map(([month, data]) => ({
        month,
        ...data,
      })),
      serviceBreakdown: serviceBreakdown.map((s) => ({
        category: s.serviceCategory,
        count: s._count.serviceCategory,
      })),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
