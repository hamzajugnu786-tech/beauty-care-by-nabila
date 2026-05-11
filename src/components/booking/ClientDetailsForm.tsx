"use client";

import { motion } from "framer-motion";
import type { BookingFormData } from "@/lib/types/booking";
import { cn } from "@/lib/utils";

interface ClientDetailsFormProps {
  details: BookingFormData;
  onUpdate: (details: Partial<BookingFormData>) => void;
  errors?: Record<string, string>;
}

export function ClientDetailsForm({ details, onUpdate, errors = {} }: ClientDetailsFormProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-medium text-text-primary">
          Your Details
        </h3>
        <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg text-text-muted">
          We&apos;ll use this to confirm your appointment
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-5">
        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
        >
          <label className="block font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.25em] text-champagne-gold/60 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={details.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Enter your full name"
            className={cn(
              "w-full bg-dark-card border rounded-sm px-4 py-3 font-[family-name:var(--font-cormorant)] text-base text-text-primary placeholder:text-text-muted/30 transition-all duration-500 outline-none focus:ring-1",
              errors.name
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-champagne-gold/10 focus:border-champagne-gold/30 focus:ring-champagne-gold/20"
            )}
          />
          {errors.name && (
            <p className="mt-1 font-[family-name:var(--font-inter)] text-[9px] text-red-400/70 uppercase tracking-[0.1em]">
              {errors.name}
            </p>
          )}
        </motion.div>

        {/* Phone */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <label className="block font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.25em] text-champagne-gold/60 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-[family-name:var(--font-inter)] text-[10px] text-text-muted/40">
              +92
            </span>
            <input
              type="tel"
              value={details.phone}
              onChange={(e) => onUpdate({ phone: e.target.value })}
              placeholder="300 1234567"
              className={cn(
                "w-full bg-dark-card border rounded-sm pl-12 pr-4 py-3 font-[family-name:var(--font-cormorant)] text-base text-text-primary placeholder:text-text-muted/30 transition-all duration-500 outline-none focus:ring-1",
                errors.phone
                  ? "border-red-500/50 focus:ring-red-500/30"
                  : "border-champagne-gold/10 focus:border-champagne-gold/30 focus:ring-champagne-gold/20"
              )}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 font-[family-name:var(--font-inter)] text-[9px] text-red-400/70 uppercase tracking-[0.1em]">
              {errors.phone}
            </p>
          )}
        </motion.div>

        {/* Email (optional) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <label className="block font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.25em] text-champagne-gold/60 mb-2">
            Email <span className="text-text-muted/30">(optional)</span>
          </label>
          <input
            type="email"
            value={details.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            placeholder="your@email.com"
            className={cn(
              "w-full bg-dark-card border rounded-sm px-4 py-3 font-[family-name:var(--font-cormorant)] text-base text-text-primary placeholder:text-text-muted/30 transition-all duration-500 outline-none focus:ring-1",
              errors.email
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-champagne-gold/10 focus:border-champagne-gold/30 focus:ring-champagne-gold/20"
            )}
          />
          {errors.email && (
            <p className="mt-1 font-[family-name:var(--font-inter)] text-[9px] text-red-400/70 uppercase tracking-[0.1em]">
              {errors.email}
            </p>
          )}
        </motion.div>

        {/* Notes (optional) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <label className="block font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.25em] text-champagne-gold/60 mb-2">
            Special Requests <span className="text-text-muted/30">(optional)</span>
          </label>
          <textarea
            value={details.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Any special requests, allergies, or preferences we should know about..."
            rows={3}
            className="w-full bg-dark-card border border-champagne-gold/10 rounded-sm px-4 py-3 font-[family-name:var(--font-cormorant)] text-base text-text-primary placeholder:text-text-muted/30 transition-all duration-500 outline-none focus:border-champagne-gold/30 focus:ring-1 focus:ring-champagne-gold/20 resize-none"
          />
        </motion.div>

        {/* Privacy note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-[family-name:var(--font-inter)] text-[8px] uppercase tracking-[0.1em] text-text-muted/25 text-center pt-2"
        >
          Your information is secure and will only be used for booking purposes
        </motion.p>
      </div>
    </div>
  );
}
