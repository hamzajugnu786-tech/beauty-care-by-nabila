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
import { generateServiceSchemas, PAGE_BREADCRUMBS } from "@/lib/structured-data";
import { DETAILED_SERVICES, SERVICE_CATEGORIES } from "@/lib/constants";

const serviceIcons: Record<string, React.ReactNode> = {
  crown: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 21V7.5l4.5 3 4.5-6 4.5 6 4.5-3V21" />
    </svg>
  ),
  scissors: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.696.14-1.025m-1.223 2.863l2.077-1.199m0-3.328l2.774 1.6a2.165 2.165 0 002.166 0l2.774-1.6M14.5 12l2.307 1.327M14.5 12l-2.307 1.327M14.5 12V8.25m7.5 3.75l-1.536-.887M21.75 12a3 3 0 11-5.196 3 3 3 0 015.196-3zm-1.536.887a2.165 2.165 0 00-1.083-1.838 4.49 4.49 0 00-.14-1.025m1.223 2.863l-2.077-1.199" />
    </svg>
  ),
  sparkles: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  palette: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
    </svg>
  ),
  gem: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  leaf: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
};

function ServiceCard({
  service,
  onExpand,
}: {
  service: (typeof DETAILED_SERVICES)[number];
  onExpand: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group relative bg-dark-card border border-champagne-gold/10 hover:border-champagne-gold/25 rounded-sm overflow-hidden transition-all duration-700"
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-champagne-gold/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Popular badge */}
      {service.popular && (
        <div className="absolute top-0 right-0 z-20">
          <div className="bg-champagne-gold text-matte-black font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.15em] px-4 py-1.5">
            Popular
          </div>
        </div>
      )}

      <div className="relative z-10 p-7 sm:p-9">
        {/* Header: Icon + Category */}
        <div className="flex items-start justify-between mb-5">
          <div className="w-11 h-11 rounded-full border border-champagne-gold/20 flex items-center justify-center text-champagne-gold group-hover:border-champagne-gold/40 transition-colors duration-500">
            {serviceIcons[service.icon] || serviceIcons.sparkles}
          </div>
          <span className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-text-muted/50">
            {service.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-[family-name:var(--font-playfair)] text-xl sm:text-[22px] font-medium text-text-primary group-hover:text-champagne-gold transition-colors duration-500 leading-tight">
          {service.title}
        </h3>

        {/* Description */}
        <p className="mt-3 font-[family-name:var(--font-cormorant)] text-[15px] text-text-muted leading-relaxed line-clamp-3">
          {service.description}
        </p>

        {/* Price & Duration */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.2em] text-champagne-gold/70">
              {service.price}
            </p>
            <p className="mt-1 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.15em] text-text-muted/40">
              {service.duration}
            </p>
          </div>
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onExpand(service.id)}
            className="w-9 h-9 rounded-full border border-champagne-gold/20 flex items-center justify-center text-champagne-gold/40 group-hover:text-champagne-gold group-hover:border-champagne-gold/40 transition-all duration-500"
            aria-label={`View details for ${service.title}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-12 h-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-px h-6 bg-gradient-to-b from-champagne-gold/20 to-transparent" />
        <div className="absolute top-0 left-0 h-px w-6 bg-gradient-to-r from-champagne-gold/20 to-transparent" />
      </div>
    </motion.div>
  );
}

function ServiceDetailModal({
  service,
  onClose,
}: {
  service: (typeof DETAILED_SERVICES)[number] | null;
  onClose: () => void;
}) {
  if (!service) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 bg-matte-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-dark-card border border-champagne-gold/15 rounded-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full border border-champagne-gold/20 flex items-center justify-center text-champagne-gold/60 hover:text-champagne-gold hover:border-champagne-gold/40 transition-all duration-500"
            aria-label="Close details"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header section */}
          <div className="relative p-8 sm:p-10 pb-0">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full border border-champagne-gold/25 flex items-center justify-center text-champagne-gold flex-shrink-0">
                {serviceIcons[service.icon] || serviceIcons.sparkles}
              </div>
              <div>
                <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-champagne-gold/60 mb-1">
                  {service.category}
                </p>
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-medium text-text-primary">
                  {service.title}
                </h3>
              </div>
            </div>
            <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="p-8 sm:p-10">
            {/* Price & Duration Row */}
            <div className="flex items-center gap-8 mb-8 pb-8 border-b border-champagne-gold/10">
              <div>
                <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-text-muted/50 mb-1">
                  Investment
                </p>
                <p className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-champagne-gold">
                  {service.price}
                </p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-text-muted/50 mb-1">
                  Duration
                </p>
                <p className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary">
                  {service.duration}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h4 className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.25em] text-champagne-gold/70 mb-5">
                What&apos;s Included
              </h4>
              <ul className="space-y-3">
                {service.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-champagne-gold/40 mt-2 flex-shrink-0" />
                    <span className="font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed">
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Recommended Add-ons */}
            {service.addOns.length > 0 && (
              <div className="mb-8">
                <h4 className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.25em] text-champagne-gold/70 mb-5">
                  Recommended Add-Ons
                </h4>
                <div className="flex flex-wrap gap-2">
                  {service.addOns.map((addOn, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
                      className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.15em] text-champagne-gold/60 border border-champagne-gold/15 px-4 py-2 rounded-sm hover:border-champagne-gold/30 hover:text-champagne-gold/80 transition-all duration-500 cursor-pointer"
                    >
                      {addOn}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link href={`/booking?service=${service.id}`}>
                <LuxuryButton size="md">Book This Service</LuxuryButton>
              </Link>
              <a
                href={`https://wa.me/923001234567?text=Hi, I'm interested in the ${service.title} service`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.2em] text-champagne-gold/60 hover:text-champagne-gold transition-colors duration-500 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                WhatsApp Inquiry
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const filteredServices =
    activeCategory === "all"
      ? DETAILED_SERVICES
      : DETAILED_SERVICES.filter((s) => s.category === activeCategory);

  const expandedServiceData =
    DETAILED_SERVICES.find((s) => s.id === expandedService) ?? null;

  return (
    <div className="min-h-screen flex flex-col bg-matte-black">
      <JsonLd data={[...generateServiceSchemas(), PAGE_BREADCRUMBS.services]} />
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <PageHero
          kicker="Our Expertise"
          title="Signature Services"
          description="Each service is a carefully curated experience, designed to transform not just your appearance but how you feel about yourself. Discover the artistry that sets us apart."
        />

        {/* Category Filters */}
        <section className="section-padding -mt-8 relative z-10">
          <div className="max-w-[1440px] mx-auto">
            <RevealOnScroll>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                {SERVICE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`font-[family-name:var(--font-inter)] text-[10px] sm:text-[11px] uppercase tracking-[0.2em] px-5 sm:px-6 py-2.5 rounded-sm border transition-all duration-500 ${
                      activeCategory === cat.id
                        ? "border-champagne-gold text-champagne-gold bg-champagne-gold/5"
                        : "border-champagne-gold/15 text-text-muted hover:text-champagne-gold/60 hover:border-champagne-gold/30"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Services Grid */}
        <section className="section-padding py-16 sm:py-20">
          <div className="max-w-[1440px] mx-auto">
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7"
              >
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onExpand={setExpandedService}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredServices.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-muted">
                  No services found in this category.
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 luxury-gradient opacity-50" />
          <div className="relative z-10 section-padding max-w-[1440px] mx-auto">
            <RevealOnScroll>
              <SectionHeading
                kicker="The Nabila Difference"
                title="Why Clients Choose Us"
                description="It is not just what we do — it is how we do it. Every touch point is designed with intention, care, and an unwavering commitment to your experience."
              />
            </RevealOnScroll>

            <GoldDivider className="my-12 sm:my-16 max-w-xs mx-auto" />

            <StaggerContainer
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
              staggerDelay={0.1}
            >
              {[
                {
                  number: "01",
                  title: "Internationally Trained",
                  description: "Our artists bring world-class training from London, Milan, and Dubai, fused with deep cultural artistry.",
                },
                {
                  number: "02",
                  title: "Premium Products",
                  description: "We use only the finest international products — from Dior and Charlotte Tilbury to Olaplex and SkinCeuticals.",
                },
                {
                  number: "03",
                  title: "Bespoke Approach",
                  description: "No two clients are alike. Every service is customized to your unique features, preferences, and lifestyle.",
                },
                {
                  number: "04",
                  title: "Luxury Experience",
                  description: "From the moment you step in to the final touch, every detail is orchestrated for your comfort and delight.",
                },
              ].map((item) => (
                <StaggerItem key={item.number}>
                  <div className="group text-center sm:text-left">
                    <span className="font-[family-name:var(--font-inter)] text-[10px] tracking-[0.3em] text-champagne-gold/40">
                      {item.number}
                    </span>
                    <h4 className="mt-3 font-[family-name:var(--font-playfair)] text-lg font-medium text-text-primary group-hover:text-champagne-gold transition-colors duration-500">
                      {item.title}
                    </h4>
                    <p className="mt-2 font-[family-name:var(--font-cormorant)] text-[15px] text-text-muted leading-relaxed">
                      {item.description}
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
                Ready to Begin?
              </p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-medium text-text-primary leading-tight">
                Your Transformation Awaits
              </h2>
              <p className="mt-5 font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed">
                Book your consultation today and let our artisans craft an experience that is uniquely, beautifully yours.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link href="/booking">
                  <LuxuryButton size="lg">Book Appointment</LuxuryButton>
                </Link>
                <a
                  href="https://wa.me/923001234567?text=Hi, I'd like to book an appointment"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LuxuryButton variant="outline" size="lg">
                    WhatsApp Us
                  </LuxuryButton>
                </a>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Service Detail Modal */}
        {expandedServiceData && (
          <ServiceDetailModal
            service={expandedServiceData}
            onClose={() => setExpandedService(null)}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
