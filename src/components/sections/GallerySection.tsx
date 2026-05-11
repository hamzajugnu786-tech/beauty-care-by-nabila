"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GALLERY_IMAGES } from "@/lib/constants";
import { SectionHeading, GoldDivider } from "@/components/ui/LuxuryElements";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/ui/RevealOnScroll";

const CATEGORIES = ["all", "bridal", "hair", "makeup", "skincare", "nails", "spa"] as const;

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages =
    activeCategory === "all"
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === activeCategory);

  return (
    <section className="section-gap section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-dark-surface/30" />

      <div className="relative z-10 max-w-[1440px] mx-auto">
        <RevealOnScroll>
          <SectionHeading
            kicker="Our Portfolio"
            title="The Art of Beauty"
            description="Every look tells a story. Browse our gallery of transformations and discover the artistry that sets us apart."
          />
        </RevealOnScroll>

        <GoldDivider className="my-10 sm:my-14 max-w-xs mx-auto" />

        {/* Category Filters */}
        <RevealOnScroll>
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10 sm:mb-14">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-[family-name:var(--font-inter)] text-[10px] sm:text-[11px] uppercase tracking-[0.2em] px-4 sm:px-5 py-2 rounded-sm border transition-all duration-500 ${
                  activeCategory === cat
                    ? "border-champagne-gold text-champagne-gold bg-champagne-gold/5"
                    : "border-champagne-gold/15 text-text-muted hover:text-champagne-gold/60 hover:border-champagne-gold/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </RevealOnScroll>

        {/* Gallery Grid */}
        <StaggerContainer
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          staggerDelay={0.06}
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image) => (
              <StaggerItem key={image.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative aspect-square overflow-hidden rounded-sm cursor-pointer bg-dark-card border border-champagne-gold/5 hover:border-champagne-gold/20 transition-all duration-700"
                  onClick={() => setSelectedImage(image.id)}
                >
                  {/* Placeholder with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-dark-card via-dark-elevated/50 to-dark-card">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border border-champagne-gold/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                        <svg
                          className="w-4 h-4 text-champagne-gold/30 group-hover:text-champagne-gold/50 transition-colors duration-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v15a1.5 1.5 0 001.5 1.5z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-matte-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Category label */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-champagne-gold/70">
                      {image.category}
                    </p>
                    <p className="font-[family-name:var(--font-cormorant)] text-sm text-text-primary/80 mt-0.5">
                      {image.alt}
                    </p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </AnimatePresence>
        </StaggerContainer>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-matte-black/95 backdrop-blur-xl flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative max-w-4xl w-full aspect-[4/3] bg-dark-card rounded-sm border border-champagne-gold/20 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-[family-name:var(--font-cormorant)] text-xl text-champagne-gold/40 italic">
                    {GALLERY_IMAGES.find((img) => img.id === selectedImage)?.alt}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full border border-champagne-gold/20 flex items-center justify-center text-champagne-gold/60 hover:text-champagne-gold hover:border-champagne-gold/40 transition-all duration-500"
                  aria-label="Close lightbox"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instagram CTA */}
        <RevealOnScroll className="mt-12 text-center">
          <a
            href="https://instagram.com/nabilalahore"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.2em] text-champagne-gold/60 hover:text-champagne-gold transition-colors duration-500 group"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            Follow @nabilalahore
            <span className="w-4 h-px bg-champagne-gold/30 group-hover:w-8 transition-all duration-500" />
          </a>
        </RevealOnScroll>
      </div>
    </section>
  );
}
