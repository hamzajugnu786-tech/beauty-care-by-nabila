"use client";

import { motion } from "framer-motion";
import type { BookingBranch } from "@/lib/types/booking";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

const BRANCHES: BookingBranch[] = [
  {
    id: "gulberg",
    name: "Gulberg III — Flagship",
    address: BRAND.address,
    phone: BRAND.phone,
    isMain: true,
  },
  {
    id: "dha",
    name: "DHA Phase 5",
    address: "Main Boulevard, DHA Phase 5, Lahore",
    phone: "+92-300-7654321",
    isMain: false,
  },
  {
    id: "mm-alam",
    name: "M.M. Alam Road",
    address: "M.M. Alam Road, Gulberg II, Lahore",
    phone: "+92-300-9876543",
    isMain: false,
  },
];

interface BranchSelectorProps {
  selectedBranch: BookingBranch | null;
  onSelect: (branch: BookingBranch) => void;
}

export function BranchSelector({ selectedBranch, onSelect }: BranchSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h3 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-medium text-text-primary">
          Choose Your Location
        </h3>
        <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg text-text-muted">
          Select the salon most convenient for you
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-3xl mx-auto">
        {BRANCHES.map((branch, i) => {
          const isSelected = selectedBranch?.id === branch.id;

          return (
            <motion.button
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(branch)}
              className={cn(
                "relative text-left p-6 rounded-sm border transition-all duration-500 overflow-hidden",
                isSelected
                  ? "border-champagne-gold/50 bg-champagne-gold/5"
                  : "border-champagne-gold/10 bg-dark-card hover:border-champagne-gold/25"
              )}
            >
              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-5 h-5 rounded-full bg-champagne-gold flex items-center justify-center"
                >
                  <svg className="w-3 h-3 text-matte-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </motion.div>
              )}

              {/* Flagship badge */}
              {branch.isMain && (
                <span className="inline-block font-[family-name:var(--font-inter)] text-[8px] uppercase tracking-[0.2em] text-champagne-gold/70 border border-champagne-gold/20 px-2 py-0.5 rounded-sm mb-3">
                  Flagship
                </span>
              )}

              <h4 className={cn(
                "font-[family-name:var(--font-playfair)] text-lg font-medium transition-colors duration-500",
                isSelected ? "text-champagne-gold" : "text-text-primary"
              )}>
                {branch.name}
              </h4>

              <p className="mt-2 font-[family-name:var(--font-cormorant)] text-sm text-text-muted leading-relaxed">
                {branch.address}
              </p>

              <p className="mt-2 font-[family-name:var(--font-inter)] text-[10px] tracking-[0.1em] text-text-muted/50">
                {branch.phone}
              </p>

              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-champagne-gold/[0.03] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
