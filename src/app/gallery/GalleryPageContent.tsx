"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { GoldDivider, SectionHeading } from "@/components/ui/LuxuryElements";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/ui/RevealOnScroll";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateDefaultGallerySchema, PAGE_BREADCRUMBS } from "@/lib/structured-data";
import { GALLERY_MASONRY_ITEMS, GALLERY_CATEGORIES, BRAND } from "@/lib/constants";

const heightMap = {
  tall: "row-span-2",
  medium: "row-span-1",
  short: "row-span-1",
};

const aspectMap = {
  tall: "aspect-[3/4]",
  medium: "aspect-[4/3]",
  short: "aspect-square",
};

export function GalleryPageContent() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredItems = useMemo(
    () =>
      activeCategory === "all"
        ? GALLERY_MASONRY_ITEMS
        : GALLERY_MASONRY_ITEMS.filter((item) => item.category === activeCategory),
    [activeCategory]
  );

  return (
    <div className="min-h-screen flex flex-col bg-matte-black">
      <JsonLd data={[generateDefaultGallerySchema(), PAGE_BREADCRUMBS.gallery]} />
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <PageHero
          kicker="Our Portfolio"
          title="Gallery of Artistry"
          description="Every image tells a story of transformation, artistry, and the pursuit of beauty. Browse our portfolio and discover the looks that have made us Lahore's most celebrated salon."
        />

        {/* Category Filter */}
        <section className="section-padding -mt-8 relative z-10">
          <div className="max-w-[1440px] mx-auto">
            <RevealOnScroll>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                {GALLERY_CATEGORIES.map((cat) => (
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

        {/* Masonry Grid */}
        <section className="section-padding py-16 sm:py-20">
          <div className="max-w-[1440px] mx-auto">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-5"
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-4 sm:mb-5 break-inside-avoid group"
                >
                  <div className="relative overflow-hidden rounded-sm bg-dark-card border border-champagne-gold/8 hover:border-champagne-gold/20 transition-all duration-700">
                    {/* Image with aspect ratio */}
                    <div className={`${aspectMap[item.height]} relative overflow-hidden`}>
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/80 via-matte-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <p className="font-[family-name:var(--font-cormorant)] text-sm text-text-primary">
                          {item.alt}
                        </p>
                        <p className="mt-1 font-[family-name:var(--font-inter)] text-[8px] uppercase tracking-[0.2em] text-champagne-gold/60">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-muted">
                  No images found in this category.
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 luxury-gradient opacity-40" />
          <div className="relative z-10 section-padding max-w-[1440px] mx-auto">
            <RevealOnScroll>
              <SectionHeading
                kicker="Our Numbers"
                title="The Art of Transformation"
                description="Numbers that speak to the trust, artistry, and dedication behind every transformation."
              />
            </RevealOnScroll>

            <GoldDivider className="my-12 sm:my-16 max-w-xs mx-auto" />

            <StaggerContainer
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12"
              staggerDelay={0.1}
            >
              {[
                { value: "2,500+", label: "Brides Transformed" },
                { value: "10,000+", label: "Happy Clients" },
                { value: "4.9", label: "Average Rating" },
                { value: "18+", label: "Years of Excellence" },
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
                Ready for Your Transformation?
              </p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-medium text-text-primary leading-tight">
                Your Look Awaits
              </h2>
              <p className="mt-5 font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed">
                From the portfolio to your mirror. Book your appointment and let our artisans create your next stunning look.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
                <LuxuryButton href="/booking" size="lg">Book Appointment</LuxuryButton>
                <LuxuryButton
                  variant="outline"
                  size="lg"
                  onClick={() => window.open(`https://wa.me/${BRAND.whatsapp}?text=Hi, I'd love to book a service after seeing your gallery`, "_blank")}
                >
                  WhatsApp Us
                </LuxuryButton>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
