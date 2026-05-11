"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { BridalShowcase } from "@/components/sections/BridalShowcase";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { StatsSection } from "@/components/sections/StatsSection";
import { CTABanner } from "@/components/sections/CTABanner";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-matte-black">
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1" role="main" aria-label="Main content">
        <HeroSection />
        <ServicesSection />
        <BridalShowcase />
        <StatsSection />
        <TestimonialsSection />
        <GallerySection />
        <div id="booking-section">
          <CTABanner />
        </div>
      </main>
      <Footer />
    </div>
  );
}
