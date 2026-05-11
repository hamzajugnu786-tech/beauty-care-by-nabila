"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { GoldDivider, SectionHeading } from "@/components/ui/LuxuryElements";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/ui/RevealOnScroll";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateOrganizationSchema, PAGE_BREADCRUMBS } from "@/lib/structured-data";
import { BRAND } from "@/lib/constants";

const milestones = [
  {
    year: "2008",
    title: "The Beginning",
    description:
      "Nabila opened the doors to her first studio on M.M. Alam Road, with a vision to bring world-class beauty artistry to Lahore. What started as a single-room atelier quickly became the city's most sought-after destination.",
  },
  {
    year: "2012",
    title: "International Recognition",
    description:
      "After training with master artists in London and Milan, Nabila introduced advanced techniques previously unavailable in Pakistan. The salon's reputation spread beyond borders, attracting clients from Dubai, London, and beyond.",
  },
  {
    year: "2016",
    title: "The Bridal Studio",
    description:
      "A dedicated bridal studio was unveiled — a private sanctuary where brides receive undivided attention. This marked the beginning of our signature bridal journey that has since transformed over 2,500 brides.",
  },
  {
    year: "2019",
    title: "The Artisan Collective",
    description:
      "Our team expanded to 45+ internationally trained artists, each bringing unique expertise and a shared commitment to excellence. The collective became the foundation of our multi-specialist approach.",
  },
  {
    year: "2022",
    title: "Luxury Redefined",
    description:
      "A complete studio redesign introduced private suites, a VIP lounge, and state-of-the-art technology. Every touchpoint was reimagined to deliver an experience that matches the calibre of our artistry.",
  },
  {
    year: "2026",
    title: "The Future",
    description:
      "Today, we continue to push boundaries while staying true to our founding principles. With new treatment technologies, expanded services, and an unwavering commitment to our clients, the best is yet to come.",
  },
];

const values = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: "Artistry First",
    description:
      "We believe beauty is an art form. Every service is approached with the precision and passion of an artist, because our clients deserve nothing less than a masterpiece.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: "Heart & Heritage",
    description:
      "Deeply rooted in Pakistani culture while embracing global techniques. We honour tradition while pushing the boundaries of contemporary beauty, creating looks that resonate across generations.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Uncompromising Quality",
    description:
      "From the products we use to the artists we hire, quality is non-negotiable. We partner with the world's finest brands and invest in continuous education to maintain the highest standards.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: "Client-Centric",
    description:
      "Every client is unique, and so is every service. We listen intently, understand deeply, and craft experiences that are as individual as the people who walk through our doors.",
  },
];

export function AboutPageContent() {
  return (
    <div className="min-h-screen flex flex-col bg-matte-black">
      <JsonLd data={[generateOrganizationSchema(), PAGE_BREADCRUMBS.about]} />
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <PageHero
          kicker="Our Story"
          title="Where Elegance Meets Artistry"
          description="For 18 years, we have been more than a salon. We are a sanctuary where artistry, heritage, and passion converge to create beauty that transcends the ordinary."
        />

        {/* Brand Story */}
        <section className="section-padding py-16 sm:py-24">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Image placeholder */}
              <RevealOnScroll direction="left">
                <div className="relative aspect-[4/5] bg-dark-card border border-champagne-gold/10 rounded-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-champagne-gold/[0.04] to-dark-card flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-champagne-gold/15 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 21V7.5l4.5 3 4.5-6 4.5 6 4.5-3V21" />
                      </svg>
                      <p className="mt-4 font-[family-name:var(--font-playfair)] text-lg text-champagne-gold/20">
                        Since 2008
                      </p>
                    </div>
                  </div>
                  {/* Decorative corner */}
                  <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
                    <div className="absolute top-0 left-0 w-px h-8 bg-gradient-to-b from-champagne-gold/25 to-transparent" />
                    <div className="absolute top-0 left-0 h-px w-8 bg-gradient-to-r from-champagne-gold/25 to-transparent" />
                  </div>
                </div>
              </RevealOnScroll>

              {/* Story text */}
              <RevealOnScroll direction="right">
                <div>
                  <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.3em] text-champagne-gold mb-4">
                    The Vision
                  </p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-medium text-text-primary leading-tight">
                    A Legacy of Beauty
                  </h2>
                  <div className="mt-6 space-y-5">
                    <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed">
                      In 2008, Nabila had a vision: to create a space where the artistry of international beauty converged with the soul of Pakistani tradition. What began as a small atelier on M.M. Alam Road has grown into Lahore&apos;s most celebrated luxury salon and bridal studio.
                    </p>
                    <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed">
                      Trained in London and Milan, Nabila brought world-class techniques home — but it was her deep understanding of Pakistani bridal culture, her insistence on premium products, and her belief that every client deserves an extraordinary experience that set Beauty Care by Nabila apart.
                    </p>
                    <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed">
                      Today, with over 2,500 brides transformed, 45+ expert artisans, and a 4.9-star reputation built over 18 years, our commitment remains unchanged: to craft beauty that honours tradition, embraces innovation, and exceeds every expectation.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 luxury-gradient opacity-40" />
          <div className="relative z-10 section-padding max-w-[1440px] mx-auto">
            <RevealOnScroll>
              <SectionHeading
                kicker="Our Principles"
                title="What We Stand For"
                description="These are not just words on a wall. They are the invisible hand that guides every decision, every brushstroke, and every interaction."
              />
            </RevealOnScroll>

            <GoldDivider className="my-12 sm:my-16 max-w-xs mx-auto" />

            <StaggerContainer
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8"
              staggerDelay={0.1}
            >
              {values.map((value) => (
                <StaggerItem key={value.title}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="group bg-dark-card border border-champagne-gold/10 hover:border-champagne-gold/25 rounded-sm p-8 sm:p-10 transition-all duration-700"
                  >
                    <div className="w-12 h-12 rounded-full border border-champagne-gold/20 flex items-center justify-center text-champagne-gold mb-5 group-hover:border-champagne-gold/40 transition-colors duration-500">
                      {value.icon}
                    </div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-medium text-text-primary group-hover:text-champagne-gold transition-colors duration-500">
                      {value.title}
                    </h3>
                    <p className="mt-3 font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Milestones Timeline */}
        <section className="section-padding py-20 sm:py-28">
          <div className="max-w-[1440px] mx-auto">
            <RevealOnScroll>
              <SectionHeading
                kicker="Our Journey"
                title="Milestones"
                description="From a single room on M.M. Alam Road to Lahore's most celebrated beauty destination, every milestone marks a commitment to pushing the boundaries of excellence."
              />
            </RevealOnScroll>

            <GoldDivider className="my-12 sm:my-16 max-w-xs mx-auto" />

            <div className="max-w-3xl mx-auto mt-12">
              {milestones.map((milestone, index) => (
                <RevealOnScroll key={milestone.year} delay={index * 0.08}>
                  <div className="relative flex gap-6 sm:gap-8 pb-12 last:pb-0">
                    {/* Timeline line */}
                    {index < milestones.length - 1 && (
                      <div className="absolute left-[39px] top-14 bottom-0 w-px bg-gradient-to-b from-champagne-gold/30 to-champagne-gold/5" />
                    )}

                    {/* Year badge */}
                    <div className="relative z-10 w-20 flex-shrink-0">
                      <div className="w-20 h-10 rounded-sm border border-champagne-gold/20 bg-dark-card flex items-center justify-center">
                        <span className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.2em] text-champagne-gold">
                          {milestone.year}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 -mt-1 pb-2">
                      <h3 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-medium text-text-primary mb-3">
                        {milestone.title}
                      </h3>
                      <p className="font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Team Stats */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 luxury-gradient opacity-30" />
          <div className="relative z-10 section-padding max-w-[1440px] mx-auto">
            <StaggerContainer
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12"
              staggerDelay={0.1}
            >
              {[
                { value: "18+", label: "Years of Excellence" },
                { value: "2,500+", label: "Brides Transformed" },
                { value: "45+", label: "Expert Artisans" },
                { value: "99%", label: "Client Satisfaction" },
              ].map((stat) => (
                <StaggerItem key={stat.label}>
                  <div className="text-center">
                    <p className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-medium text-champagne-gold">
                      {stat.value}
                    </p>
                    <p className="mt-2 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.25em] text-text-muted/60">
                      {stat.label}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-matte-black via-dark-card/30 to-matte-black" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-champagne-gold/[0.02] rounded-full blur-[100px]" />
          <div className="relative z-10 section-padding max-w-3xl mx-auto text-center">
            <RevealOnScroll>
              <p className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.3em] text-champagne-gold mb-5">
                Experience the Difference
              </p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-medium text-text-primary leading-tight">
                Come See Why Thousands Trust Us
              </h2>
              <p className="mt-5 font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed">
                Visit us at M.M. Alam Road, Gulberg III, Lahore, and discover the artistry that has made us the city&apos;s most beloved salon.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link href="/booking">
                  <LuxuryButton size="lg">Book an Appointment</LuxuryButton>
                </Link>
                <Link href="/contact">
                  <LuxuryButton variant="outline" size="lg">Get in Touch</LuxuryButton>
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
