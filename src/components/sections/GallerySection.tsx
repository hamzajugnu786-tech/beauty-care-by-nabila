"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { GALLERY_IMAGES } from "@/lib/constants";
import { SectionHeading, GoldDivider } from "@/components/ui/LuxuryElements";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { LuxuryButton } from "@/components/ui/LuxuryButton";

const CATEGORIES = ["all", "bridal", "hair", "makeup", "skincare", "nails", "spa"] as const;

interface GalleryImage {
  id: string | number;
  src: string;
  alt: string;
  category: string;
}

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [cloudinaryImages, setCloudinaryImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (data.images && data.images.length > 0) {
          setCloudinaryImages(data.images);
        }
      })
      .catch(() => {});
  }, []);

  // Normalize all images to same format
  const allImages: GalleryImage[] = useMemo(() => {
    if (cloudinaryImages.length > 0) return cloudinaryImages;
    return GALLERY_IMAGES.map((img) => ({
      id: img.id,
      src: img.src,
      alt: img.alt,
      category: img.category,
    }));
  }, [cloudinaryImages]);

  const filteredImages = useMemo(
    () =>
      activeCategory === "all"
        ? allImages
        : allImages.filter((img) => img.category === activeCategory),
    [activeCategory, allImages]
  );

  const closeLightbox = useCallback(() => setSelectedImageIndex(null), []);
  const goNext = useCallback(() => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex + 1) % filteredImages.length);
  }, [selectedImageIndex, filteredImages.length]);
  const goPrev = useCallback(() => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex - 1 + filteredImages.length) % filteredImages.length);
  }, [selectedImageIndex, filteredImages.length]);

  // ESC key to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    if (selectedImageIndex !== null) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [selectedImageIndex, closeLightbox, goNext, goPrev]);

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
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="group relative aspect-square overflow-hidden rounded-sm cursor-pointer bg-dark-card border border-champagne-gold/5 hover:border-champagne-gold/20 transition-all duration-700"
              onClick={() => setSelectedImageIndex(index)}
            >
              {image.src ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-dark-card via-dark-elevated/50 to-dark-card">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-champagne-gold/20 group-hover:text-champagne-gold/40 transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v15a1.5 1.5 0 001.5 1.5z" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-matte-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Category label on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-champagne-gold/70">
                  {image.category}
                </p>
                <p className="font-[family-name:var(--font-cormorant)] text-sm text-text-primary/80 mt-0.5">
                  {image.alt}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state */}
        {filteredImages.length === 0 && (
          <div className="text-center py-16">
            <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-muted">
              No images found in this category yet.
            </p>
          </div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImageIndex !== null && filteredImages[selectedImageIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-matte-black/95 backdrop-blur-xl flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative max-w-5xl w-full aspect-[4/3] bg-dark-card rounded-sm border border-champagne-gold/20 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image in lightbox */}
                {filteredImages[selectedImageIndex]?.src ? (
                  <Image
                    src={filteredImages[selectedImageIndex].src}
                    alt={filteredImages[selectedImageIndex].alt}
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="font-[family-name:var(--font-cormorant)] text-xl text-champagne-gold/40 italic">
                      {filteredImages[selectedImageIndex]?.alt}
                    </p>
                  </div>
                )}

                {/* Close button - always visible and clickable */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full border border-champagne-gold/30 bg-matte-black/90 backdrop-blur-sm flex items-center justify-center text-champagne-gold/80 hover:text-champagne-gold hover:border-champagne-gold/60 hover:bg-matte-black transition-all duration-300 z-50"
                  aria-label="Close lightbox"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Previous button */}
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-champagne-gold/20 bg-matte-black/70 backdrop-blur-sm flex items-center justify-center text-champagne-gold/60 hover:text-champagne-gold hover:border-champagne-gold/40 transition-all duration-300 z-50"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                {/* Next button */}
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-champagne-gold/20 bg-matte-black/70 backdrop-blur-sm flex items-center justify-center text-champagne-gold/60 hover:text-champagne-gold hover:border-champagne-gold/40 transition-all duration-300 z-50"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Book Appointment CTA */}
        <RevealOnScroll className="mt-14 text-center">
          <LuxuryButton href="/booking" size="lg">Book Appointment</LuxuryButton>
        </RevealOnScroll>

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
