"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TESTIMONIALS } from "@/lib/constants";
import { SectionHeading, GoldDivider } from "@/components/ui/LuxuryElements";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function TestimonialsSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="section-gap section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 luxury-gradient opacity-50" />

      <div className="relative z-10 max-w-[1440px] mx-auto">
        <RevealOnScroll>
          <SectionHeading
            kicker="Client Voices"
            title="Stories of Transformation"
            description="Every visit to our studio is a journey. These are the stories of those who entrusted us with their most cherished moments."
          />
        </RevealOnScroll>

        <GoldDivider className="my-12 sm:my-16 max-w-xs mx-auto" />

        {/* Testimonial Carousel */}
        <RevealOnScroll>
          <div className="max-w-4xl mx-auto">
            {/* Quote Display */}
            <div className="relative min-h-[260px] sm:min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center"
                >
                  {/* Quote mark */}
                  <div className="flex justify-center mb-6">
                    <span className="font-[family-name:var(--font-playfair)] text-6xl text-champagne-gold/20 leading-none">
                      &ldquo;
                    </span>
                  </div>

                  {/* Quote text */}
                  <p className="font-[family-name:var(--font-cormorant)] text-xl sm:text-2xl md:text-3xl text-text-primary leading-relaxed italic max-w-3xl mx-auto">
                    {TESTIMONIALS[active].quote}
                  </p>

                  {/* Author */}
                  <div className="mt-8">
                    <div className="w-12 h-px bg-champagne-gold/30 mx-auto mb-4" />
                    <p className="font-[family-name:var(--font-playfair)] text-lg text-champagne-gold">
                      {TESTIMONIALS[active].name}
                    </p>
                    <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.2em] text-text-muted mt-1">
                      {TESTIMONIALS[active].role}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation dots */}
            <div className="flex items-center justify-center gap-3 mt-10">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="group relative"
                  aria-label={`Go to testimonial ${i + 1}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      i === active
                        ? "bg-champagne-gold scale-125"
                        : "bg-champagne-gold/20 group-hover:bg-champagne-gold/40"
                    }`}
                  />
                  {i === active && (
                    <motion.div
                      layoutId="testimonial-indicator"
                      className="absolute inset-0 w-2 h-2 rounded-full border border-champagne-gold/50"
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Arrow navigation */}
            <div className="flex items-center justify-center gap-6 mt-6">
              <button
                onClick={() =>
                  setActive(
                    (prev) =>
                      (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
                  )
                }
                className="w-10 h-10 rounded-full border border-champagne-gold/20 flex items-center justify-center text-champagne-gold/40 hover:text-champagne-gold hover:border-champagne-gold/40 transition-all duration-500"
                aria-label="Previous testimonial"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  setActive(
                    (prev) => (prev + 1) % TESTIMONIALS.length
                  )
                }
                className="w-10 h-10 rounded-full border border-champagne-gold/20 flex items-center justify-center text-champagne-gold/40 hover:text-champagne-gold hover:border-champagne-gold/40 transition-all duration-500"
                aria-label="Next testimonial"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                  />
                </svg>
              </button>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
