"use client";

import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import type { BookingService, BookingArtist, BookingBranch, TimeSlot, BookingFormData } from "@/lib/types/booking";
import { BRAND } from "@/lib/constants";

interface BookingConfirmationProps {
  branch: BookingBranch;
  service: BookingService;
  addOns: string[];
  artist: BookingArtist | null;
  date: string;
  timeSlot: TimeSlot;
  client: BookingFormData;
  confirmationCode: string | null;
  isSubmitting: boolean;
  whatsappLink?: string;
}

export function BookingConfirmation({
  branch,
  service,
  addOns,
  artist,
  date,
  timeSlot,
  client,
  confirmationCode,
  isSubmitting,
  whatsappLink,
}: BookingConfirmationProps) {
  const formattedDate = date ? (() => {
    try {
      return format(parseISO(date), "EEEE, MMMM d, yyyy");
    } catch {
      return date;
    }
  })() : date;

  // Loading state
  if (isSubmitting && !confirmationCode) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <motion.div
          className="w-16 h-16 rounded-full border border-champagne-gold/30 flex items-center justify-center mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-8 h-8 border-t-2 border-champagne-gold rounded-full animate-spin" />
        </motion.div>
        <p className="font-[family-name:var(--font-playfair)] text-xl text-text-primary mb-2">
          Confirming Your Booking
        </p>
        <p className="font-[family-name:var(--font-cormorant)] text-base text-text-muted">
          Securing your appointment...
        </p>
      </div>
    );
  }

  // Success state
  if (confirmationCode) {
    return (
      <div className="text-center">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-20 h-20 mx-auto rounded-full bg-champagne-gold/10 border border-champagne-gold/30 flex items-center justify-center mb-6"
        >
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-8 h-8 text-champagne-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-medium text-text-primary">
            Booking Confirmed
          </h3>
          <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg text-text-muted">
            We look forward to welcoming you
          </p>
        </motion.div>

        {/* Confirmation code */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 inline-block bg-dark-card border border-champagne-gold/20 rounded-sm px-8 py-4"
        >
          <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.25em] text-text-muted/50 mb-1">
            Confirmation Code
          </p>
          <p className="font-[family-name:var(--font-inter)] text-2xl tracking-[0.3em] text-champagne-gold font-medium">
            {confirmationCode}
          </p>
        </motion.div>

        {/* Booking summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 max-w-md mx-auto text-left bg-dark-card border border-champagne-gold/10 rounded-sm p-6"
        >
          <div className="space-y-4">
            <SummaryRow label="Service" value={service.title} />
            <SummaryRow label="Date" value={formattedDate} />
            <SummaryRow label="Time" value={timeSlot.label} />
            <SummaryRow label="Branch" value={branch.name} />
            {artist && <SummaryRow label="Artist" value={artist.name} />}
            <SummaryRow label="Name" value={client.name} />
            <SummaryRow label="Phone" value={client.phone} />
            {addOns.length > 0 && (
              <div className="pt-3 border-t border-champagne-gold/10">
                <p className="font-[family-name:var(--font-inter)] text-[8px] uppercase tracking-[0.2em] text-text-muted/40 mb-2">
                  Add-Ons
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {addOns.map((addOn) => (
                    <span
                      key={addOn}
                      className="font-[family-name:var(--font-inter)] text-[9px] text-champagne-gold/50 border border-champagne-gold/10 px-2 py-0.5 rounded-sm"
                    >
                      {addOn}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600/10 border border-green-500/30 text-green-400 font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.15em] px-6 py-3 rounded-sm hover:bg-green-600/20 transition-all duration-500"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Confirm via WhatsApp
            </a>
          )}
          <a
            href={`tel:${BRAND.phone}`}
            className="inline-flex items-center gap-2 font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.15em] text-champagne-gold/60 hover:text-champagne-gold border border-champagne-gold/15 px-6 py-3 rounded-sm hover:border-champagne-gold/30 transition-all duration-500"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            Call Us
          </a>
        </motion.div>
      </div>
    );
  }

  // Pre-confirmation review
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-medium text-text-primary">
          Review & Confirm
        </h3>
        <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg text-text-muted">
          Please verify your appointment details
        </p>
      </div>

      <div className="max-w-lg mx-auto bg-dark-card border border-champagne-gold/10 rounded-sm overflow-hidden">
        {/* Service header */}
        <div className="p-6 border-b border-champagne-gold/10 bg-gradient-to-r from-champagne-gold/5 to-transparent">
          <h4 className="font-[family-name:var(--font-playfair)] text-xl font-medium text-champagne-gold">
            {service.title}
          </h4>
          <div className="flex items-center gap-4 mt-2">
            <span className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.15em] text-champagne-gold/60">
              {service.price}
            </span>
            <span className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.1em] text-text-muted/40">
              {service.duration}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <SummaryRow label="Date" value={formattedDate} />
          <SummaryRow label="Time" value={timeSlot.label} />
          <SummaryRow label="Location" value={branch.name} />
          {artist && <SummaryRow label="Stylist" value={artist.name} />}
          <SummaryRow label="Name" value={client.name} />
          <SummaryRow label="Phone" value={`+92 ${client.phone}`} />
          {client.email && <SummaryRow label="Email" value={client.email} />}
          {addOns.length > 0 && (
            <div className="pt-3 border-t border-champagne-gold/8">
              <p className="font-[family-name:var(--font-inter)] text-[8px] uppercase tracking-[0.2em] text-text-muted/40 mb-2">
                Add-Ons
              </p>
              <div className="flex flex-wrap gap-1.5">
                {addOns.map((addOn) => (
                  <span
                    key={addOn}
                    className="font-[family-name:var(--font-inter)] text-[9px] text-champagne-gold/50 border border-champagne-gold/10 px-2 py-0.5 rounded-sm"
                  >
                    {addOn}
                  </span>
                ))}
              </div>
            </div>
          )}
          {client.notes && (
            <div className="pt-3 border-t border-champagne-gold/8">
              <p className="font-[family-name:var(--font-inter)] text-[8px] uppercase tracking-[0.2em] text-text-muted/40 mb-2">
                Notes
              </p>
              <p className="font-[family-name:var(--font-cormorant)] text-sm text-text-muted">
                {client.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-text-muted/40 flex-shrink-0">
        {label}
      </span>
      <span className="font-[family-name:var(--font-cormorant)] text-base text-text-primary text-right">
        {value}
      </span>
    </div>
  );
}
