"use client";

// Force dynamic rendering
export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  Phone,
  Mail,
  User,
  MoreHorizontal,
  Eye,
  XCircle,
  CheckCircle2,
  RotateCcw,
  ChevronDown,
  Download,
  RefreshCcw,
  MapPin,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BOOKING_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from "@/lib/types/admin";
import type { BookingStatus, PaymentStatus } from "@/lib/types/booking";

// ─── Mock Bookings ───
const mockBookings = [
  { id: "b1", confirmationCode: "NBL-A7K3M9", clientName: "Ayesha Rahman", clientPhone: "+92-300-1234567", clientEmail: "ayesha@email.com", clientNotes: "Bridal trial preference for soft glam", branchName: "Gulberg Main", serviceTitle: "Signature Bridal Package", serviceCategory: "bridal", servicePrice: "PKR 150,000", artistName: "Nabila", date: "2026-05-12", timeSlot: "09:00", status: "confirmed" as BookingStatus, paymentStatus: "deposit" as PaymentStatus, addOns: ["Extended touch-up support", "Pre-bridal glow facial"], createdAt: "2026-05-08T14:30:00Z" },
  { id: "b2", confirmationCode: "NBL-B2L5N1", clientName: "Fatima Sheikh", clientPhone: "+92-301-2345678", clientEmail: "", clientNotes: "", branchName: "Gulberg Main", serviceTitle: "Party Glam", serviceCategory: "makeup", servicePrice: "PKR 8,000", artistName: "Sana Khan", date: "2026-05-11", timeSlot: "11:30", status: "pending" as BookingStatus, paymentStatus: "unpaid" as PaymentStatus, addOns: [], createdAt: "2026-05-10T09:15:00Z" },
  { id: "b3", confirmationCode: "NBL-C8P4Q2", clientName: "Zara Malik", clientPhone: "+92-302-3456789", clientEmail: "zara@email.com", clientNotes: "Prefers curtain bangs", branchName: "DHA Branch", serviceTitle: "Precision Haircut", serviceCategory: "hair", servicePrice: "PKR 5,500", artistName: "Zoya Malik", date: "2026-05-11", timeSlot: "14:00", status: "in-progress" as BookingStatus, paymentStatus: "unpaid" as PaymentStatus, addOns: ["Deep conditioning treatment"], createdAt: "2026-05-09T16:45:00Z" },
  { id: "b4", confirmationCode: "NBL-D3R6S8", clientName: "Mehreen Ali", clientPhone: "+92-303-4567890", clientEmail: "mehreen@email.com", clientNotes: "Sensitive skin", branchName: "Gulberg Main", serviceTitle: "Signature Facial", serviceCategory: "skincare", servicePrice: "PKR 6,500", artistName: "Amara Hussain", date: "2026-05-11", timeSlot: "15:30", status: "confirmed" as BookingStatus, paymentStatus: "paid" as PaymentStatus, addOns: ["Chemical peel boost"], createdAt: "2026-05-07T11:20:00Z" },
  { id: "b5", confirmationCode: "NBL-E1T9U5", clientName: "Sana Hussain", clientPhone: "+92-304-5678901", clientEmail: "", clientNotes: "", branchName: "Gulberg Main", serviceTitle: "Gel Extensions", serviceCategory: "nails", servicePrice: "PKR 5,500", artistName: null, date: "2026-05-11", timeSlot: "16:00", status: "pending" as BookingStatus, paymentStatus: "unpaid" as PaymentStatus, addOns: [], createdAt: "2026-05-10T13:00:00Z" },
  { id: "b6", confirmationCode: "NBL-F5V2W7", clientName: "Irum Khan", clientPhone: "+92-305-6789012", clientEmail: "irum@email.com", clientNotes: "Destination bridal - Lahore to Islamabad", branchName: "Gulberg Main", serviceTitle: "Elite Bridal Couture", serviceCategory: "bridal", servicePrice: "PKR 250,000", artistName: "Nabila", date: "2026-05-15", timeSlot: "08:00", status: "confirmed" as BookingStatus, paymentStatus: "deposit" as PaymentStatus, addOns: ["Destination wedding support", "Additional event styling"], createdAt: "2026-05-05T10:30:00Z" },
  { id: "b7", confirmationCode: "NBL-G9X1Y3", clientName: "Nadia Ashraf", clientPhone: "+92-306-7890123", clientEmail: "", clientNotes: "Cancelled due to travel", branchName: "DHA Branch", serviceTitle: "Aromatherapy Massage", serviceCategory: "spa", servicePrice: "PKR 7,000", artistName: null, date: "2026-05-10", timeSlot: "12:00", status: "cancelled" as BookingStatus, paymentStatus: "refunded" as PaymentStatus, addOns: [], createdAt: "2026-05-06T08:45:00Z" },
  { id: "b8", confirmationCode: "NBL-H4Z8A6", clientName: "Samina Farooq", clientPhone: "+92-307-8901234", clientEmail: "samina@email.com", clientNotes: "", branchName: "Gulberg Main", serviceTitle: "Colour Artistry", serviceCategory: "hair", servicePrice: "PKR 12,000", artistName: "Zoya Malik", date: "2026-05-12", timeSlot: "10:00", status: "confirmed" as BookingStatus, paymentStatus: "unpaid" as PaymentStatus, addOns: ["Olaplex treatment"], createdAt: "2026-05-09T15:20:00Z" },
  { id: "b9", confirmationCode: "NBL-J7B2C4", clientName: "Amina Siddiqui", clientPhone: "+92-308-9012345", clientEmail: "", clientNotes: "Did not show up", branchName: "DHA Branch", serviceTitle: "Luxury Manicure & Pedicure", serviceCategory: "nails", servicePrice: "PKR 3,500", artistName: null, date: "2026-05-09", timeSlot: "15:00", status: "no-show" as BookingStatus, paymentStatus: "unpaid" as PaymentStatus, addOns: [], createdAt: "2026-05-04T12:10:00Z" },
  { id: "b10", confirmationCode: "NBL-K6D1E9", clientName: "Rabia Noor", clientPhone: "+92-309-0123456", clientEmail: "rabia@email.com", clientNotes: "VIP member", branchName: "Gulberg Main", serviceTitle: "Royal Wellness Ritual", serviceCategory: "spa", servicePrice: "PKR 18,000", artistName: "Amara Hussain", date: "2026-05-13", timeSlot: "09:00", status: "completed" as BookingStatus, paymentStatus: "paid" as PaymentStatus, addOns: ["Private suite upgrade"], createdAt: "2026-05-03T09:30:00Z" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function BookingsPage() {
  const [bookings] = useState(mockBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.clientName.toLowerCase().includes(search.toLowerCase()) ||
        b.confirmationCode.toLowerCase().includes(search.toLowerCase()) ||
        b.serviceTitle.toLowerCase().includes(search.toLowerCase()) ||
        b.clientPhone.includes(search);
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: bookings.length };
    bookings.forEach((b) => { counts[b.status] = (counts[b.status] || 0) + 1; });
    return counts;
  }, [bookings]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-text-primary">Bookings</h1>
          <p className="text-text-muted text-sm mt-1">{bookings.length} total bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-dark-elevated border border-border-gold/10 rounded-xl text-sm text-text-muted hover:text-text-primary hover:border-champagne-gold/20 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="px-4 py-2 bg-dark-elevated border border-border-gold/10 rounded-xl text-sm text-text-muted hover:text-text-primary hover:border-champagne-gold/20 transition-all flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </motion.div>

      {/* Search + Filters */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, code, service, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-dark-card border border-border-gold/10 rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-champagne-gold/30 focus:ring-1 focus:ring-champagne-gold/10 transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2.5 border rounded-xl text-sm flex items-center gap-2 transition-all ${
            showFilters
              ? "bg-champagne-gold/10 border-champagne-gold/20 text-champagne-gold"
              : "bg-dark-card border-border-gold/10 text-text-muted hover:text-text-primary"
          }`}
        >
          <Filter className="w-4 h-4" /> Filters
          <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>
      </motion.div>

      {/* Status Filter Tabs */}
      <motion.div variants={item} className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {["all", "pending", "confirmed", "in-progress", "completed", "cancelled", "no-show"].map((status) => {
          const config = BOOKING_STATUS_CONFIG[status];
          const count = statusCounts[status] || 0;
          return (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === status
                  ? status === "all"
                    ? "bg-champagne-gold text-matte-black"
                    : `${config?.bg} ${config?.color} border border-current/20`
                  : "bg-dark-elevated text-text-muted hover:text-text-primary border border-transparent"
              }`}
            >
              {status === "all" ? "All" : config?.label}
              <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </motion.div>

      {/* Bookings Table */}
      <motion.div variants={item} className="bg-dark-card border border-border-gold/10 rounded-2xl overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-gold/10">
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider px-5 py-3 font-medium">Client</th>
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider px-5 py-3 font-medium">Service</th>
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider px-5 py-3 font-medium">Schedule</th>
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider px-5 py-3 font-medium">Status</th>
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider px-5 py-3 font-medium">Payment</th>
                <th className="text-left text-[10px] text-text-muted uppercase tracking-wider px-5 py-3 font-medium">Amount</th>
                <th className="text-right text-[10px] text-text-muted uppercase tracking-wider px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((booking) => {
                const sConfig = BOOKING_STATUS_CONFIG[booking.status];
                const pConfig = PAYMENT_STATUS_CONFIG[booking.paymentStatus];
                return (
                  <tr
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className="border-b border-border-gold/5 hover:bg-dark-elevated/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-champagne-gold/20 to-champagne-gold/5 flex items-center justify-center text-champagne-gold text-xs font-semibold flex-shrink-0">
                          {booking.clientName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{booking.clientName}</p>
                          <p className="text-[10px] text-text-muted">{booking.confirmationCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-text-primary">{booking.serviceTitle}</p>
                      <p className="text-[10px] text-text-muted">{booking.artistName || "Any artist"}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-text-primary">{booking.date}</p>
                      <p className="text-[10px] text-text-muted">{booking.timeSlot}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${sConfig?.bg} ${sConfig?.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sConfig?.dot}`} />
                        {sConfig?.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${pConfig?.bg} ${pConfig?.color}`}>
                        {pConfig?.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-text-primary">{booking.servicePrice}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); }}
                        className="p-1.5 text-text-muted hover:text-champagne-gold transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-border-gold/5">
          {paginated.map((booking) => {
            const sConfig = BOOKING_STATUS_CONFIG[booking.status];
            return (
              <button
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                className="w-full text-left p-4 hover:bg-dark-elevated/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-champagne-gold/10 flex items-center justify-center text-champagne-gold text-[10px] font-semibold">
                      {booking.clientName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-text-primary">{booking.clientName}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium ${sConfig?.bg} ${sConfig?.color}`}>
                    <span className={`w-1 h-1 rounded-full ${sConfig?.dot}`} />
                    {sConfig?.label}
                  </span>
                </div>
                <p className="text-xs text-text-muted">{booking.serviceTitle} &middot; {booking.date} {booking.timeSlot}</p>
                <p className="text-xs text-champagne-gold mt-1">{booking.servicePrice}</p>
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {paginated.length === 0 && (
          <div className="py-16 text-center">
            <Calendar className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
            <p className="text-text-muted">No bookings found</p>
            <p className="text-text-muted/60 text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border-gold/10">
            <p className="text-xs text-text-muted">
              Showing {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1.5 text-text-muted hover:text-champagne-gold disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                    currentPage === i + 1
                      ? "bg-champagne-gold text-matte-black"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 text-text-muted hover:text-champagne-gold disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* ─── Booking Detail Drawer ─── */}
      <AnimatePresence>
        {selectedBooking && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setSelectedBooking(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-dark-surface border-l border-border-gold/10 z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-serif text-text-primary">Booking Details</h2>
                    <p className="text-xs text-text-muted">{selectedBooking.confirmationCode}</p>
                  </div>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="p-2 text-text-muted hover:text-text-primary transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2 mb-6">
                  {(() => {
                    const sc = BOOKING_STATUS_CONFIG[selectedBooking.status];
                    const pc = PAYMENT_STATUS_CONFIG[selectedBooking.paymentStatus];
                    return (
                      <>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${sc?.bg} ${sc?.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc?.dot}`} />
                          {sc?.label}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${pc?.bg} ${pc?.color}`}>
                          {pc?.label}
                        </span>
                      </>
                    );
                  })()}
                </div>

                {/* Client Info */}
                <div className="bg-dark-card border border-border-gold/10 rounded-xl p-4 mb-4">
                  <p className="text-[10px] text-text-muted uppercase tracking-widest mb-3">Client</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-text-muted" />
                      <span className="text-sm text-text-primary">{selectedBooking.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-text-muted" />
                      <span className="text-sm text-text-primary">{selectedBooking.clientPhone}</span>
                    </div>
                    {selectedBooking.clientEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-text-muted" />
                        <span className="text-sm text-text-primary">{selectedBooking.clientEmail}</span>
                      </div>
                    )}
                    {selectedBooking.clientNotes && (
                      <div className="mt-2 p-2 bg-dark-elevated rounded-lg">
                        <p className="text-xs text-text-muted mb-0.5">Notes</p>
                        <p className="text-sm text-text-primary">{selectedBooking.clientNotes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Service Info */}
                <div className="bg-dark-card border border-border-gold/10 rounded-xl p-4 mb-4">
                  <p className="text-[10px] text-text-muted uppercase tracking-widest mb-3">Service</p>
                  <p className="text-sm font-medium text-text-primary">{selectedBooking.serviceTitle}</p>
                  <p className="text-xs text-text-muted capitalize">{selectedBooking.serviceCategory}</p>
                  <p className="text-sm text-champagne-gold mt-1">{selectedBooking.servicePrice}</p>
                  {selectedBooking.artistName && (
                    <p className="text-xs text-text-muted mt-1">Artist: {selectedBooking.artistName}</p>
                  )}
                  {selectedBooking.addOns.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Add-ons</p>
                      {selectedBooking.addOns.map((a, i) => (
                        <span key={i} className="inline-block text-[10px] bg-dark-elevated text-text-muted px-2 py-0.5 rounded mr-1 mb-1">{a}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Schedule */}
                <div className="bg-dark-card border border-border-gold/10 rounded-xl p-4 mb-4">
                  <p className="text-[10px] text-text-muted uppercase tracking-widest mb-3">Schedule</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-text-muted" />
                      <span className="text-sm text-text-primary">{selectedBooking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-text-muted" />
                      <span className="text-sm text-text-primary">{selectedBooking.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-text-muted" />
                      <span className="text-sm text-text-primary">{selectedBooking.branchName}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {selectedBooking.status === "pending" && (
                    <button className="w-full py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-all">
                      <CheckCircle2 className="w-4 h-4" /> Confirm Booking
                    </button>
                  )}
                  {["pending", "confirmed"].includes(selectedBooking.status) && (
                    <>
                      <button className="w-full py-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-amber-500/20 transition-all">
                        <RotateCcw className="w-4 h-4" /> Reschedule
                      </button>
                      <button className="w-full py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all">
                        <XCircle className="w-4 h-4" /> Cancel Booking
                      </button>
                    </>
                  )}
                  <a
                    href={`https://wa.me/923001234567?text=${encodeURIComponent(
                      `Hi ${selectedBooking.clientName},\n\nYour booking (${selectedBooking.confirmationCode}) for ${selectedBooking.serviceTitle} on ${selectedBooking.date} at ${selectedBooking.timeSlot} is confirmed.\n\n— ${BRAND.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-green-500/20 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" /> WhatsApp Client
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
