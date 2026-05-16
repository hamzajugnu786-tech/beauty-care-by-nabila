"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { SERVICES } from "@/lib/constants";
import { SectionHeading, GoldDivider } from "@/components/ui/LuxuryElements";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/ui/RevealOnScroll";
import { LuxuryButton } from "@/components/ui/LuxuryButton";

const serviceIcons: Record<string, React.ReactElement> = {
  crown: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 21V7.5l4.5 3 4.5-6 4.5 6 4.5-3V21" />
    </svg>
  ),
  scissors: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.696.14-1.025m-1.223 2.863l2.077-1.199m0-3.328l2.774 1.6a2.165 2.165 0 002.166 0l2.774-1.6M14.5 12l2.307 1.327M14.5 12l-2.307 1.327M14.5 12V8.25m7.5 3.75l-1.536-.887M21.75 12a3 3 0 11-5.196 3 3 3 0 015.196-3zm-1.536.887a2.165 2.165 0 00-1.083-1.838 4.49 4.49 0 00-.14-1.025m1.223 2.863l-2.077-1.199" />
    </svg>
  ),
  sparkles: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  palette: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
    </svg>
  ),
  gem: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  leaf: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
};

export function ServicesSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="section-gap section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 luxury-gradient opacity-50" />

      <div className="relative z-10 max-w-[1440px] mx-auto">
        {/* Header */}
        <RevealOnScroll>
          <SectionHeading
            kicker="Our Expertise"
            title="Signature Services"
            description="Each service is a carefully curated experience, designed to transform not just your appearance but how you feel about yourself."
          />
        </RevealOnScroll>

        <GoldDivider className="my-12 sm:my-16 max-w-xs mx-auto" />

        {/* Services Grid */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          staggerDelay={0.1}
        >
          {SERVICES.map((service) => {
            const isExpanded = expandedId === service.id;
            return (
              <StaggerItem key={service.id}>
                <motion.div
                  layout
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative bg-dark-card border border-champagne-gold/10 hover:border-champagne-gold/25 rounded-sm overflow-hidden cursor-pointer transition-all duration-700"
                  onClick={() => setExpandedId(isExpanded ? null : service.id)}
                >
                  {/* Service Background Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/60 to-transparent" />
                    {/* Icon badge */}
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-full border border-champagne-gold/30 bg-matte-black/60 backdrop-blur-sm flex items-center justify-center text-champagne-gold">
                      {serviceIcons[service.icon] || serviceIcons.sparkles}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-6 sm:p-8">
                    {/* Title */}
                    <h3 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-medium text-text-primary group-hover:text-champagne-gold transition-colors duration-500">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed">
                      {service.description}
                    </p>

                    {/* Price & Arrow */}
                    <div className="mt-6 flex items-center justify-between">
                      <span className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.2em] text-champagne-gold/60">
                        {service.price}
                      </span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-8 h-8 flex items-center justify-center text-champagne-gold/40 group-hover:text-champagne-gold transition-colors duration-500"
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
                      </motion.div>
                    </div>

                    {/* Expanded: Book Now link */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-5 mt-5 border-t border-champagne-gold/10">
                            <Link
                              href={`/services?category=${service.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-2 font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.2em] text-champagne-gold hover:text-champagne-gold/80 transition-colors duration-300"
                            >
                              View Full Details
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                              </svg>
                            </Link>
                            <Link
                              href="/booking"
                              onClick={(e) => e.stopPropagation()}
                              className="ml-6 inline-flex items-center gap-2 font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.2em] text-champagne-gold hover:text-champagne-gold/80 transition-colors duration-300"
                            >
                              Book Now
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                              </svg>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-champagne-gold/30 to-transparent" />
                    <div className="absolute top-0 right-0 h-px w-8 bg-gradient-to-l from-champagne-gold/30 to-transparent" />
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* CTA */}
        <RevealOnScroll className="mt-14 text-center">
          <LuxuryButton href="/services" variant="outline" size="md">
            View All Services
          </LuxuryButton>
        </RevealOnScroll>
      </div>
    </section>
  );
}
