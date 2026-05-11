"use client";

import { motion } from "framer-motion";
import { GoldDivider } from "@/components/ui/LuxuryElements";

interface PageHeroProps {
  kicker: string;
  title: string;
  description: string;
  align?: "center" | "left";
}

export function PageHero({ kicker, title, description, align = "center" }: PageHeroProps) {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-matte-black via-dark-card/40 to-matte-black" />
        {/* Decorative vertical gold lines */}
        <motion.div
          className="absolute top-0 left-[10%] w-px h-full bg-gradient-to-b from-transparent via-champagne-gold/8 to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "top" }}
        />
        <motion.div
          className="absolute top-0 right-[10%] w-px h-full bg-gradient-to-b from-transparent via-champagne-gold/8 to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{ transformOrigin: "top" }}
        />
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-champagne-gold/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 section-padding max-w-4xl ${
          align === "center" ? "mx-auto text-center" : "text-left"
        }`}
      >
        <motion.p
          className="font-[family-name:var(--font-inter)] text-[11px] sm:text-xs uppercase tracking-[0.35em] text-champagne-gold mb-5 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {kicker}
        </motion.p>

        <motion.h1
          className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-text-primary leading-[1.1]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <GoldDivider className={`my-8 sm:my-10 max-w-[160px] ${align === "center" ? "mx-auto" : "!justify-start"}`} />
        </motion.div>

        <motion.p
          className="font-[family-name:var(--font-cormorant)] text-lg sm:text-xl md:text-2xl text-text-muted leading-relaxed max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={align === "center" ? { marginInline: "auto" } : undefined}
        >
          {description}
        </motion.p>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-matte-black to-transparent" />
    </section>
  );
}
