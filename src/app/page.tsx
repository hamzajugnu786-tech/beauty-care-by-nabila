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
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <BridalShowcase />
        <StatsSection />
        <TestimonialsSection />
        <GallerySection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
