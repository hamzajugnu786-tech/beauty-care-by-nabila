"use client";

import { motion } from "framer-motion";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function CTABanner() {
  return (
    <section className="relative py-24 sm:py-32 md:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-matte-black via-dark-surface to-matte-black" />
        {/* Large ambient gold glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Decorative lines */}
      <motion.div
        className="absolute top-0 left-[10%] w-px h-full"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.05), transparent)" }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
      />
      <motion.div
        className="absolute top-0 right-[10%] w-px h-full"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.05), transparent)" }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 0.3 }}
      />

      <div className="relative z-10 section-padding max-w-[1440px] mx-auto text-center">
        <RevealOnScroll>
          <p className="font-[family-name:var(--font-inter)] text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-champagne-gold/70 mb-6">
            Begin Your Transformation
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight max-w-3xl mx-auto">
            <span className="text-text-primary">Ready to Experience </span>
            <span className="text-gradient-gold">True Luxury</span>
            <span className="text-text-primary">?</span>
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <p className="mt-6 font-[family-name:var(--font-cormorant)] text-lg sm:text-xl text-text-muted leading-relaxed max-w-xl mx-auto">
            Your journey to elegance begins with a single step. Book your
            appointment today and discover the artistry that has transformed
            thousands.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.3}>
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <LuxuryButton size="lg">Book Appointment</LuxuryButton>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-[family-name:var(--font-inter)] text-xs uppercase tracking-[0.2em] text-champagne-gold/60 hover:text-champagne-gold transition-colors duration-500 group py-3.5 px-8"
            >
              <span className="w-2 h-2 rounded-full bg-green-500/80 group-hover:bg-green-500 transition-colors" />
              WhatsApp Us
            </a>
          </div>
        </RevealOnScroll>

        {/* Decorative bottom element */}
        <RevealOnScroll delay={0.5} className="mt-16">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-champagne-gold/20" />
            <div className="w-1 h-1 rotate-45 bg-champagne-gold/30" />
            <div className="h-px w-8 bg-champagne-gold/20" />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
