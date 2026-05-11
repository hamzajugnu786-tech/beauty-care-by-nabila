"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { GoldDivider, SectionHeading } from "@/components/ui/LuxuryElements";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/ui/RevealOnScroll";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateServiceSchemas, PAGE_BREADCRUMBS, BRIDAL_EVENT_SCHEMAS } from "@/lib/structured-data";
import { BRIDAL_PACKAGES, BRIDAL_ARTISTS, BRIDAL_TIMELINE, BRAND } from "@/lib/constants";

const timelineIcons: Record<string, React.ReactNode> = {
  sparkles: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  eye: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  heart: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  moon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  ),
  crown: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 21V7.5l4.5 3 4.5-6 4.5 6 4.5-3V21" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
};

const packageColors = {
  gold: {
    border: "border-champagne-gold/20",
    borderHover: "hover:border-champagne-gold/40",
    badge: "bg-champagne-gold/10 text-champagne-gold",
    glow: "from-champagne-gold/[0.04]",
    accent: "text-champagne-gold",
  },
  champagne: {
    border: "border-champagne-gold/30",
    borderHover: "hover:border-champagne-gold/50",
    badge: "bg-champagne-gold/20 text-champagne-gold",
    glow: "from-champagne-gold/[0.06]",
    accent: "text-champagne-gold",
  },
  ivory: {
    border: "border-champagne-gold/20",
    borderHover: "hover:border-champagne-gold/40",
    badge: "bg-champagne-gold/10 text-champagne-gold",
    glow: "from-champagne-gold/[0.04]",
    accent: "text-champagne-gold",
  },
};

export function BridalPageContent() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const bridalServiceSchemas = generateServiceSchemas().filter(
    (s) => (s as Record<string, unknown>)["@type"] === "Service" && JSON.stringify(s).includes("Bridal")
  );

  return (
    <div className="min-h-screen flex flex-col bg-matte-black">
      <JsonLd data={[...bridalServiceSchemas, ...BRIDAL_EVENT_SCHEMAS, PAGE_BREADCRUMBS.bridal]} />
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <PageHero
          kicker="Bridal Studio"
          title="Your Bridal Transformation"
          description="Where dreams become reality. Our bespoke bridal studio has transformed over 2,500 brides, crafting unforgettable looks that honour tradition while embracing contemporary elegance. Your most beautiful day begins here."
        />

        {/* Packages Section */}
        <section className="section-padding py-16 sm:py-24">
          <div className="max-w-[1440px] mx-auto">
            <RevealOnScroll>
              <SectionHeading
                kicker="Bridal Packages"
                title="Choose Your Experience"
                description="Each package is thoughtfully curated to provide a different level of artistry, care, and luxury. Select the experience that speaks to your heart."
              />
            </RevealOnScroll>

            <GoldDivider className="my-12 sm:my-16 max-w-xs mx-auto" />

            <StaggerContainer
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mt-12"
              staggerDelay={0.15}
            >
              {BRIDAL_PACKAGES.map((pkg) => {
                const colors = packageColors[pkg.color as keyof typeof packageColors];
                return (
                  <StaggerItem key={pkg.id}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      className={`relative group bg-dark-card border ${colors.border} ${colors.borderHover} rounded-sm overflow-hidden transition-all duration-700 ${
                        pkg.highlight ? "ring-1 ring-champagne-gold/30" : ""
                      }`}
                    >
                      {/* Highlight badge */}
                      {pkg.highlight && (
                        <div className="absolute top-0 right-0 z-20">
                          <div className="bg-champagne-gold text-matte-black font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.15em] px-4 py-1.5">
                            Most Popular
                          </div>
                        </div>
                      )}

                      {/* Hover glow */}
                      <div className={`absolute inset-0 bg-gradient-to-b ${colors.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                      <div className="relative z-10 p-8 sm:p-10">
                        {/* Package header */}
                        <p className={`font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.25em] ${colors.accent} mb-2`}>
                          {pkg.tagline}
                        </p>
                        <h3 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-medium text-text-primary group-hover:text-champagne-gold transition-colors duration-500">
                          {pkg.name}
                        </h3>
                        <p className="mt-4 font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed">
                          {pkg.description}
                        </p>

                        {/* Price */}
                        <div className="mt-6 pb-6 border-b border-champagne-gold/10">
                          <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.2em] text-text-muted/50 mb-1">
                            Starting from
                          </p>
                          <p className="font-[family-name:var(--font-playfair)] text-3xl font-medium text-champagne-gold">
                            {pkg.price}
                          </p>
                        </div>

                        {/* Includes */}
                        <ul className="mt-6 space-y-3">
                          {pkg.includes.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-champagne-gold/40 mt-2 flex-shrink-0" />
                              <span className="font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA */}
                        <div className="mt-8">
                          <Link href={`/booking?package=${pkg.id}`}>
                            <LuxuryButton
                              size="md"
                              variant={pkg.highlight ? "primary" : "outline"}
                              className="w-full"
                            >
                              Select Package
                            </LuxuryButton>
                          </Link>
                        </div>
                      </div>

                      {/* Corner accent */}
                      <div className="absolute top-0 left-0 w-12 h-12 overflow-hidden">
                        <div className="absolute top-0 left-0 w-px h-6 bg-gradient-to-b from-champagne-gold/20 to-transparent" />
                        <div className="absolute top-0 left-0 h-px w-6 bg-gradient-to-r from-champagne-gold/20 to-transparent" />
                      </div>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>

        {/* Artists Section */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 luxury-gradient opacity-40" />
          <div className="relative z-10 section-padding max-w-[1440px] mx-auto">
            <RevealOnScroll>
              <SectionHeading
                kicker="Our Artisans"
                title="Meet Your Bridal Team"
                description="Internationally trained artists who bring world-class expertise fused with deep cultural understanding to every transformation."
              />
            </RevealOnScroll>

            <GoldDivider className="my-12 sm:my-16 max-w-xs mx-auto" />

            <StaggerContainer
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
              staggerDelay={0.1}
            >
              {BRIDAL_ARTISTS.map((artist) => (
                <StaggerItem key={artist.id}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="group bg-dark-card border border-champagne-gold/10 hover:border-champagne-gold/25 rounded-sm overflow-hidden transition-all duration-700"
                  >
                    {/* Artist image placeholder */}
                    <div className="relative h-64 bg-gradient-to-b from-champagne-gold/[0.06] to-dark-card overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full border border-champagne-gold/20 flex items-center justify-center">
                          <svg className="w-8 h-8 text-champagne-gold/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-champagne-gold/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>

                    <div className="p-6">
                      <h3 className="font-[family-name:var(--font-playfair)] text-lg font-medium text-text-primary group-hover:text-champagne-gold transition-colors duration-500">
                        {artist.name}
                      </h3>
                      <p className="mt-1 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-champagne-gold/70">
                        {artist.title}
                      </p>
                      <p className="mt-3 font-[family-name:var(--font-cormorant)] text-sm text-text-muted leading-relaxed line-clamp-3">
                        {artist.bio}
                      </p>

                      {/* Specialties */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {artist.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="font-[family-name:var(--font-inter)] text-[8px] uppercase tracking-[0.15em] text-champagne-gold/50 border border-champagne-gold/10 px-2.5 py-1 rounded-sm"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      {/* Experience */}
                      <p className="mt-4 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.15em] text-text-muted/40">
                        {artist.experience}
                      </p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="section-padding py-20 sm:py-28">
          <div className="max-w-[1440px] mx-auto">
            <RevealOnScroll>
              <SectionHeading
                kicker="The Journey"
                title="Your Bridal Timeline"
                description="From the first consultation to the final touch-up, every step of your bridal journey is meticulously planned and beautifully executed."
              />
            </RevealOnScroll>

            <GoldDivider className="my-12 sm:my-16 max-w-xs mx-auto" />

            <div className="max-w-3xl mx-auto mt-12">
              {BRIDAL_TIMELINE.map((phase, index) => (
                <RevealOnScroll key={phase.phase} delay={index * 0.1}>
                  <div className="relative flex gap-6 sm:gap-8 pb-12 last:pb-0">
                    {/* Timeline line */}
                    {index < BRIDAL_TIMELINE.length - 1 && (
                      <div className="absolute left-[21px] top-12 bottom-0 w-px bg-gradient-to-b from-champagne-gold/30 to-champagne-gold/5" />
                    )}

                    {/* Icon */}
                    <div className="relative z-10 w-11 h-11 rounded-full border border-champagne-gold/25 bg-dark-card flex items-center justify-center text-champagne-gold flex-shrink-0">
                      {timelineIcons[phase.icon] || timelineIcons.sparkles}
                    </div>

                    {/* Content */}
                    <div className="flex-1 -mt-1">
                      <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.25em] text-champagne-gold/60 mb-1">
                        {phase.phase}
                      </p>
                      <h3 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-medium text-text-primary mb-3">
                        {phase.title}
                      </h3>
                      <p className="font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-matte-black via-dark-card/30 to-matte-black" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-champagne-gold/[0.02] rounded-full blur-[100px]" />
          <div className="relative z-10 section-padding max-w-3xl mx-auto text-center">
            <RevealOnScroll>
              <p className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.3em] text-champagne-gold mb-5">
                Begin Your Journey
              </p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-medium text-text-primary leading-tight">
                Your Most Beautiful Day Deserves the Most Beautiful You
              </h2>
              <p className="mt-5 font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed">
                Book your bridal consultation today and let our artisans craft a transformation that will be cherished in photographs for generations to come.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link href="/booking?type=bridal">
                  <LuxuryButton size="lg">Book Consultation</LuxuryButton>
                </Link>
                <a
                  href={`https://wa.me/${BRAND.whatsapp}?text=Hi, I'm interested in your bridal packages`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LuxuryButton variant="outline" size="lg">
                    WhatsApp Inquiry
                  </LuxuryButton>
                </a>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
