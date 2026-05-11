"use client";

import { motion } from "framer-motion";
import { SectionHeading, GoldDivider } from "@/components/ui/LuxuryElements";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { LuxuryButton } from "@/components/ui/LuxuryButton";

const BRIDAL_FEATURES = [
  {
    step: "01",
    title: "Consultation",
    description:
      "A private session to understand your vision, attire, and the aesthetic you desire for your celebration.",
  },
  {
    step: "02",
    title: "Trial Session",
    description:
      "A full rehearsal of your bridal look, refined with precision until every detail exceeds your expectations.",
  },
  {
    step: "03",
    title: "The Transformation",
    description:
      "On your day, our artisans create magic — a look that will be remembered in photographs for generations.",
  },
  {
    step: "04",
    title: "Touch-Up & Support",
    description:
      "On-site assistance ensuring your look remains flawless from ceremony through the final celebration.",
  },
];

export function BridalShowcase() {
  return (
    <section className="relative py-24 sm:py-32 md:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-matte-black via-dark-card/30 to-matte-black" />
        {/* Decorative gold lines */}
        <motion.div
          className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-champagne-gold/10 via-champagne-gold/5 to-transparent"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "top" }}
        />
        <motion.div
          className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-champagne-gold/10 via-champagne-gold/5 to-transparent"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ transformOrigin: "top" }}
        />
      </div>

      <div className="relative z-10 section-padding max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Visual */}
          <RevealOnScroll direction="left">
            <div className="relative">
              {/* Main image placeholder */}
              <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-dark-card border border-champagne-gold/10">
                <div className="absolute inset-0 bg-gradient-to-br from-champagne-gold/10 via-dark-surface to-dark-card" />
                {/* Placeholder content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-full border border-champagne-gold/20 flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-champagne-gold/40"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 21h19.5M3.75 21V7.5l4.5 3 4.5-6 4.5 6 4.5-3V21"
                        />
                      </svg>
                    </div>
                    <p className="font-[family-name:var(--font-cormorant)] text-lg text-champagne-gold/40 italic">
                      Bridal Portfolio
                    </p>
                  </div>
                </div>
                {/* Gold corner accents */}
                <div className="absolute top-3 left-3 w-8 h-8 border-t border-l border-champagne-gold/30" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b border-r border-champagne-gold/30" />
              </div>

              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-4 -right-4 sm:bottom-6 sm:-right-6 bg-dark-card border border-champagne-gold/20 rounded-sm p-5 shadow-2xl"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <p className="font-[family-name:var(--font-playfair)] text-3xl font-medium text-champagne-gold">
                  2,500+
                </p>
                <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-text-muted mt-1">
                  Brides Transformed
                </p>
              </motion.div>
            </div>
          </RevealOnScroll>

          {/* Right: Content */}
          <div>
            <RevealOnScroll direction="right">
              <SectionHeading
                kicker="Bridal Studio"
                title="Your Most Beautiful Day, Perfected"
                description="Every bride deserves to feel like the most stunning version of herself. Our bridal studio is dedicated to making that happen with bespoke artistry and unwavering attention to detail."
                align="left"
              />
            </RevealOnScroll>

            <GoldDivider className="my-10 max-w-[120px] !justify-start" />

            {/* Process Steps */}
            <div className="space-y-8">
              {BRIDAL_FEATURES.map((feature, i) => (
                <RevealOnScroll key={feature.step} delay={i * 0.1}>
                  <div className="flex gap-5 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border border-champagne-gold/20 flex items-center justify-center group-hover:border-champagne-gold/50 transition-colors duration-500">
                      <span className="font-[family-name:var(--font-inter)] text-[10px] text-champagne-gold/60 group-hover:text-champagne-gold transition-colors duration-500">
                        {feature.step}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-[family-name:var(--font-playfair)] text-lg font-medium text-text-primary group-hover:text-champagne-gold transition-colors duration-500">
                        {feature.title}
                      </h4>
                      <p className="mt-1 font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>

            <RevealOnScroll className="mt-10">
              <LuxuryButton size="lg">Explore Bridal Packages</LuxuryButton>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
