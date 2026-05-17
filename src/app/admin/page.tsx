"use client";

// Force dynamic rendering
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Star,
  ChevronRight,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BRAND } from "@/lib/constants";
import type {
  DashboardStats,
  RevenueDataPoint,
  ServiceBreakdown,
} from "@/lib/types/admin";
import { BOOKING_STATUS_CONFIG } from "@/lib/types/admin";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// ─── Mock Data (replace with API calls in production) ───
const mockStats: DashboardStats = {
  totalBookings: 1247,
  todayBookings: 8,
  pendingBookings: 23,
  completedBookings: 1089,
  cancelledBookings: 89,
  totalRevenue: 4856000,
  monthlyRevenue: 720000,
  avgBookingValue: 3894,
  totalClients: 632,
  newClientsThisMonth: 47,
  topService: { name: "Signature Bridal Package", count: 89 },
  topArtist: { name: "Nabila", count: 156 },
};

const revenueData: RevenueDataPoint[] = [
  { month: "Jul", revenue: 420000, bookings: 98 },
  { month: "Aug", revenue: 510000, bookings: 112 },
  { month: "Sep", revenue: 480000, bookings: 105 },
  { month: "Oct", revenue: 630000, bookings: 138 },
  { month: "Nov", revenue: 590000, bookings: 129 },
  { month: "Dec", revenue: 720000, bookings: 148 },
  { month: "Jan", revenue: 680000, bookings: 141 },
  { month: "Feb", revenue: 750000, bookings: 155 },
  { month: "Mar", revenue: 810000, bookings: 167 },
  { month: "Apr", revenue: 690000, bookings: 143 },
  { month: "May", revenue: 720000, bookings: 150 },
];

const serviceBreakdown: ServiceBreakdown[] = [
  { category: "Bridal", count: 312, revenue: 2800000, percentage: 38 },
  { category: "Hair", count: 287, revenue: 680000, percentage: 22 },
  { category: "Makeup", count: 198, revenue: 520000, percentage: 16 },
  { category: "Skincare", count: 167, revenue: 410000, percentage: 12 },
  { category: "Nails", count: 134, revenue: 280000, percentage: 8 },
  { category: "Spa", count: 89, revenue: 165000, percentage: 4 },
];

const recentBookings = [
  { id: "1", client: "Ayesha Rahman", service: "Signature Bridal", date: "2026-05-11", time: "10:00", status: "confirmed", amount: "PKR 150,000" },
  { id: "2", client: "Fatima Sheikh", service: "Party Glam", date: "2026-05-11", time: "11:30", status: "pending", amount: "PKR 8,000" },
  { id: "3", client: "Zara Malik", service: "Precision Haircut", date: "2026-05-11", time: "14:00", status: "in-progress", amount: "PKR 5,500" },
  { id: "4", client: "Mehreen Ali", service: "Signature Facial", date: "2026-05-11", time: "15:30", status: "confirmed", amount: "PKR 6,500" },
  { id: "5", client: "Sana Hussain", service: "Gel Extensions", date: "2026-05-11", time: "16:00", status: "pending", amount: "PKR 5,500" },
];

const CHART_COLORS = ["#D4AF37", "#E8D48B", "#A68B2A", "#DCC7AA", "#9A9498", "#3D3520"];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [stats, setStats] = useState<DashboardStats>(mockStats);

  const formatCurrency = (val: number) =>
    `PKR ${(val / 1000).toFixed(0)}K`;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* ─── Header ─── */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-text-primary">
            Dashboard
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Welcome back. Here&apos;s your salon overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeRange === range
                  ? "bg-champagne-gold text-matte-black"
                  : "bg-dark-elevated text-text-muted hover:text-text-primary border border-border-gold/10"
              }`}
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ─── KPI Cards ─── */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Bookings"
          value={stats.totalBookings.toLocaleString()}
          change="+12.5%"
          positive
          icon={CalendarCheck}
          accent="champagne-gold"
        />
        <KPICard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          change="+8.2%"
          positive
          icon={DollarSign}
          accent="emerald"
        />
        <KPICard
          title="Active Clients"
          value={stats.totalClients.toLocaleString()}
          change={`+${stats.newClientsThisMonth} new`}
          positive
          icon={Users}
          accent="blue"
        />
        <KPICard
          title="Avg. Booking Value"
          value={`PKR ${stats.avgBookingValue.toLocaleString()}`}
          change="-2.1%"
          positive={false}
          icon={TrendingUp}
          accent="amber"
        />
      </motion.div>

      {/* ─── Quick Stats Row ─── */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <QuickStat label="Today's Bookings" value={stats.todayBookings} icon={Clock} />
        <QuickStat label="Pending" value={stats.pendingBookings} icon={CalendarCheck} />
        <QuickStat label="Completed" value={stats.completedBookings} icon={Star} />
        <QuickStat label="Cancelled" value={stats.cancelledBookings} icon={Eye} />
      </motion.div>

      {/* ─── Charts Row ─── */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-dark-card border border-border-gold/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-medium text-text-primary">Revenue Overview</h3>
              <p className="text-xs text-text-muted mt-0.5">Monthly revenue & bookings</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-champagne-gold" /> Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gold-light" /> Bookings
              </span>
            </div>
          </div>
          <ErrorBoundary fallback={<div className="h-72 flex items-center justify-center text-text-muted text-sm">Chart unavailable</div>}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3D3520" strokeOpacity={0.3} />
                <XAxis dataKey="month" tick={{ fill: "#9A9498", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9A9498", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1C1C22",
                    border: "1px solid #3D3520",
                    borderRadius: 12,
                    fontSize: 12,
                    color: "#F8F5F0",
                  }}
                  formatter={(value: number, name: string) => [
                    name === "revenue" ? `PKR ${(value / 1000).toFixed(0)}K` : value,
                    name === "revenue" ? "Revenue" : "Bookings",
                  ]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} fill="url(#goldGradient)" />
                <Area type="monotone" dataKey="bookings" stroke="#E8D48B" strokeWidth={1.5} fill="none" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          </ErrorBoundary>
        </div>

        {/* Service Breakdown */}
        <div className="bg-dark-card border border-border-gold/10 rounded-2xl p-5">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-text-primary">Service Breakdown</h3>
            <p className="text-xs text-text-muted mt-0.5">Revenue by category</p>
          </div>
          <ErrorBoundary fallback={<div className="h-48 flex items-center justify-center text-text-muted text-sm">Chart unavailable</div>}>
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="percentage"
                >
                  {serviceBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1C1C22",
                    border: "1px solid #3D3520",
                    borderRadius: 12,
                    fontSize: 12,
                    color: "#F8F5F0",
                  }}
                  formatter={(value: number, _: string, props: any) => [
                    `${value}% — PKR ${(props.payload.revenue / 1000).toFixed(0)}K`,
                    props.payload.category,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          </ErrorBoundary>
          <div className="space-y-2">
            {serviceBreakdown.map((svc, i) => (
              <div key={svc.category} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                  <span className="text-text-muted">{svc.category}</span>
                </span>
                <span className="text-text-primary font-medium">{svc.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── Bottom Row ─── */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-dark-card border border-border-gold/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-text-primary">Recent Bookings</h3>
            <button className="text-xs text-champagne-gold hover:text-champagne-gold/80 transition-colors flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentBookings.map((booking) => {
              const statusConfig = BOOKING_STATUS_CONFIG[booking.status];
              return (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-dark-elevated/50 hover:bg-dark-elevated transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{booking.client}</p>
                    <p className="text-xs text-text-muted truncate">{booking.service}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusConfig?.bg} ${statusConfig?.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig?.dot}`} />
                      {statusConfig?.label}
                    </span>
                    <span className="text-xs text-text-muted whitespace-nowrap">{booking.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-dark-card border border-border-gold/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-text-primary">Top Performers</h3>
            <button className="p-1 text-text-muted hover:text-champagne-gold transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Top Service */}
          <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-champagne-gold/10 to-champagne-gold/5 border border-champagne-gold/10">
            <p className="text-[10px] text-champagne-gold uppercase tracking-widest mb-2">Top Service</p>
            <p className="text-lg font-serif text-text-primary">{stats.topService?.name}</p>
            <p className="text-sm text-text-muted">{stats.topService?.count} bookings this month</p>
          </div>

          {/* Top Artist */}
          <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/10">
            <p className="text-[10px] text-emerald-400 uppercase tracking-widest mb-2">Top Artist</p>
            <p className="text-lg font-serif text-text-primary">{stats.topArtist?.name}</p>
            <p className="text-sm text-text-muted">{stats.topArtist?.count} appointments this month</p>
          </div>

          {/* Bookings by Day Chart */}
          <ErrorBoundary fallback={<div className="h-36 flex items-center justify-center text-text-muted text-sm">Chart unavailable</div>}>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { day: "Mon", bookings: 12 },
                  { day: "Tue", bookings: 18 },
                  { day: "Wed", bookings: 15 },
                  { day: "Thu", bookings: 22 },
                  { day: "Fri", bookings: 28 },
                  { day: "Sat", bookings: 32 },
                  { day: "Sun", bookings: 8 },
                ]}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#3D3520" strokeOpacity={0.2} />
                <XAxis dataKey="day" tick={{ fill: "#9A9498", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9A9498", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1C1C22",
                    border: "1px solid #3D3520",
                    borderRadius: 12,
                    fontSize: 11,
                    color: "#F8F5F0",
                  }}
                />
                <Bar dataKey="bookings" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </ErrorBoundary>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── KPI Card Component ───
function KPICard({
  title,
  value,
  change,
  positive,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: any;
  accent: string;
}) {
  const accentStyles: Record<string, { icon: string; bg: string }> = {
    "champagne-gold": { icon: "text-champagne-gold", bg: "bg-champagne-gold/10" },
    emerald: { icon: "text-emerald-400", bg: "bg-emerald-400/10" },
    blue: { icon: "text-blue-400", bg: "bg-blue-400/10" },
    amber: { icon: "text-amber-400", bg: "bg-amber-400/10" },
  };
  const style = accentStyles[accent] || accentStyles["champagne-gold"];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-dark-card border border-border-gold/10 rounded-2xl p-5 hover:border-champagne-gold/20 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${style.icon}`} />
        </div>
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-medium ${
            positive ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </span>
      </div>
      <p className="text-2xl font-serif text-text-primary">{value}</p>
      <p className="text-xs text-text-muted mt-1">{title}</p>
    </motion.div>
  );
}

// ─── Quick Stat Component ───
function QuickStat({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
  return (
    <div className="bg-dark-card border border-border-gold/10 rounded-xl p-4 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-dark-elevated flex items-center justify-center">
        <Icon className="w-4 h-4 text-text-muted" />
      </div>
      <div>
        <p className="text-lg font-medium text-text-primary">{value}</p>
        <p className="text-[10px] text-text-muted uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}
