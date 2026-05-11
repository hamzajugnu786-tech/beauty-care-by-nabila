"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { GoldDivider, SectionHeading } from "@/components/ui/LuxuryElements";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/ui/RevealOnScroll";
import { LuxuryButton } from "@/components/ui/LuxuryButton";

const VIP_TIERS = [
  {
    id: "silver",
    name: "Silver",
    tagline: "The Beginning of Luxury",
    price: "PKR 25,000",
    period: "/year",
    color: "border-champagne-gold/20 hover:border-champagne-gold/40",
    benefits: [
      "Priority booking (48h advance)",
      "10% off all services",
      "Complimentary birthday facial",
      "Member-only event invitations",
      "Dedicated concierge line",
    ],
    highlight: false,
  },
  {
    id: "gold",
    name: "Gold",
    tagline: "The Signature Experience",
    price: "PKR 75,000",
    period: "/year",
    color: "border-champagne-gold/30 hover:border-champagne-gold/50 ring-1 ring-champagne-gold/30",
    benefits: [
      "Everything in Silver, plus",
      "20% off all services",
      "Quarterly signature treatment",
      "Complimentary annual hair treatment",
      "VIP lounge access",
      "Personal style consultant",
      "Exclusive product previews",
    ],
    highlight: true,
  },
  {
    id: "platinum",
    name: "Platinum",
    tagline: "Uncompromising Exclusivity",
    price: "PKR 150,000",
    period: "/year",
    color: "border-champagne-gold/20 hover:border-champagne-gold/40",
    benefits: [
      "Everything in Gold, plus",
      "30% off all services",
      "Monthly luxury treatment",
      "Private suite for all visits",
      "Nabila's personal attention",
      "Destination event access",
      "Bespoke fragrance consultation",
      "Annual luxury gift curation",
    ],
    highlight: false,
  },
];

export function VipPageContent() {
  return (
    <div className="min-h-screen flex flex-col bg-matte-black">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <PageHero
          kicker="VIP Membership"
          title="Where Loyalty Meets Luxury"
          description="Our VIP membership is an invitation to an exclusive world of beauty privileges, personalized experiences, and unparalleled artistry reserved for those who accept nothing less than extraordinary."
        />

        {/* Tiers Section */}
        <section className="section-padding py-16 sm:py-24">
          <div className="max-w-[1440px] mx-auto">
            <RevealOnScroll>
              <SectionHeading
                kicker="Membership Tiers"
                title="Choose Your Privilege"
                description="Each tier unlocks a new level of exclusivity. From priority access to personal consultations with Nabila herself, your membership is the key to a world reserved for the discerning few."
              />
            </RevealOnScroll>

            <GoldDivider className="my-12 sm:my-16 max-w-xs mx-auto" />

            <StaggerContainer
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mt-12"
              staggerDelay={0.15}
            >
              {VIP_TIERS.map((tier) => (
                <StaggerItem key={tier.id}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className={`relative group bg-dark-card border ${tier.color} rounded-sm overflow-hidden transition-all duration-700`}
                  >
                    {/* Most Popular badge */}
                    {tier.highlight && (
                      <div className="absolute top-0 right-0 z-20">
                        <div className="bg-champagne-gold text-matte-black font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.15em] px-4 py-1.5">
                          Most Popular
                        </div>
                      </div>
                    )}

                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-champagne-gold/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10 p-8 sm:p-10">
                      <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.25em] text-champagne-gold mb-2">
                        {tier.tagline}
                      </p>
                      <h3 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-medium text-text-primary group-hover:text-champagne-gold transition-colors duration-500">
                        {tier.name}
                      </h3>

                      {/* Price */}
                      <div className="mt-6 pb-6 border-b border-champagne-gold/10">
                        <p className="font-[family-name:var(--font-playfair)] text-3xl font-medium text-champagne-gold">
                          {tier.price}
                        </p>
                        <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.2em] text-text-muted/50 mt-1">
                          {tier.period}
                        </p>
                      </div>

                      {/* Benefits */}
                      <ul className="mt-6 space-y-3">
                        {tier.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-champagne-gold/40 mt-2 flex-shrink-0" />
                            <span className="font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed">
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <div className="mt-8">
                        <Link href={`/booking?type=vip&tier=${tier.id}`}>
                          <LuxuryButton
                            size="md"
                            variant={tier.highlight ? "primary" : "outline"}
                            className="w-full"
                          >
                            Join {tier.name}
                          </LuxuryButton>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Exclusive Perks */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 luxury-gradient opacity-40" />
          <div className="relative z-10 section-padding max-w-[1440px] mx-auto">
            <RevealOnScroll>
              <SectionHeading
                kicker="Exclusive Perks"
                title="Beyond the Ordinary"
                description="Your VIP membership opens doors to experiences that transcend the conventional salon visit. Every detail is curated to make you feel extraordinary."
              />
            </RevealOnScroll>

            <GoldDivider className="my-12 sm:my-16 max-w-xs mx-auto" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-12">
              {[
                { title: "Private Suite Access", desc: "Gold and Platinum members enjoy exclusive access to our private suite — a serene space designed for those who value privacy and personalized attention.", icon: "crown" },
                { title: "Priority Booking", desc: "Never wait for an appointment again. VIP members book 48 hours ahead of everyone else, ensuring your preferred time slot is always available.", icon: "sparkles" },
                { title: "Personal Consultant", desc: "Gold and above members receive a dedicated style consultant who understands your preferences and curates services tailored to your lifestyle.", icon: "heart" },
                { title: "Member Events", desc: "Exclusive invitations to product launches, seasonal showcases, and intimate beauty workshops hosted by Nabila and her senior artists.", icon: "gem" },
              ].map((perk, i) => (
                <RevealOnScroll key={perk.title} delay={i * 0.1}>
                  <div className="group text-center p-6">
                    <div className="w-14 h-14 mx-auto rounded-full border border-champagne-gold/20 flex items-center justify-center text-champagne-gold mb-5 group-hover:border-champagne-gold/40 transition-colors duration-500">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-lg font-medium text-text-primary group-hover:text-champagne-gold transition-colors duration-500">
                      {perk.title}
                    </h3>
                    <p className="mt-3 font-[family-name:var(--font-cormorant)] text-sm text-text-muted leading-relaxed">
                      {perk.desc}
                    </p>
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
                Join the Circle
              </p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-medium text-text-primary leading-tight">
                Your Invitation Awaits
              </h2>
              <p className="mt-5 font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed">
                Membership is by invitation or application. Submit your interest and our concierge team will guide you through the enrolment process within 24 hours.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link href="/booking?type=vip">
                  <LuxuryButton size="lg">Apply for Membership</LuxuryButton>
                </Link>
                <a
                  href="https://wa.me/923001234567?text=Hi, I'm interested in VIP membership"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LuxuryButton variant="outline" size="lg">
                    WhatsApp Concierge
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
