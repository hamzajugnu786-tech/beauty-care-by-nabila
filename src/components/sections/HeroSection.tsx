"use client";

import { motion } from "framer-motion";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { BRAND } from "@/lib/constants";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Cinematic gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-matte-black via-dark-surface to-matte-black" />

        {/* Luxury pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #D4AF37 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, #D4AF37 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Gold ambient light */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary light */}
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(12,12,16,0.4)_70%,rgba(12,12,16,0.8)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-padding w-full max-w-[1440px] mx-auto">
        <div className="text-center max-w-4xl mx-auto pt-20">
          {/* Kicker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-champagne-gold/60" />
              <p className="font-[family-name:var(--font-inter)] text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-champagne-gold/80">
                {BRAND.location}
              </p>
              <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-champagne-gold/60" />
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium leading-[1.1] tracking-tight"
          >
            <span className="text-text-primary">Where </span>
            <span className="text-gradient-gold">Elegance</span>
            <br />
            <span className="text-text-primary">Meets Artistry</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 sm:mt-8 font-[family-name:var(--font-cormorant)] text-lg sm:text-xl md:text-2xl text-text-muted leading-relaxed max-w-2xl mx-auto"
          >
            A sanctuary of beauty and transformation, where every detail is
            curated to make you feel extraordinary
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <LuxuryButton
              size="lg"
              onClick={() =>
                (window.location.href = "/booking")
              }
            >
              Book Your Experience
            </LuxuryButton>
            <LuxuryButton
              variant="outline"
              size="lg"
              onClick={() =>
                (window.location.href = "/bridal")
              }
            >
              Bridal Studio
            </LuxuryButton>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="mt-16 sm:mt-20 flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center gap-2"
            >
              <span className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.3em] text-text-muted/40">
                Scroll
              </span>
              <div className="w-px h-8 bg-gradient-to-b from-champagne-gold/40 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-matte-black to-transparent" />
    </section>
  );
}
