"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { GoldDivider, SectionHeading } from "@/components/ui/LuxuryElements";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/ui/RevealOnScroll";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateLocalBusinessSchema, PAGE_BREADCRUMBS } from "@/lib/structured-data";
import { BRAND } from "@/lib/constants";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export function ContactPageContent() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus("idle");

      // Simulate form submission
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } catch {
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-matte-black">
      <JsonLd data={[generateLocalBusinessSchema(), PAGE_BREADCRUMBS.contact]} />
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <PageHero
          kicker="Get in Touch"
          title="Contact Us"
          description="We would love to hear from you. Whether you have a question about our services, want to book a consultation, or simply wish to say hello, our doors and lines are always open."
        />

        {/* Contact Info + Form Section */}
        <section className="section-padding py-16 sm:py-24">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Contact Info (Left Side) */}
              <div className="lg:col-span-2">
                <RevealOnScroll direction="left">
                  <div>
                    <p className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.3em] text-champagne-gold mb-4">
                      Reach Out
                    </p>
                    <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-medium text-text-primary leading-tight">
                      We Are Here for You
                    </h2>
                    <p className="mt-4 font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed">
                      Our team is available to assist you with bookings, inquiries, and any questions you may have. Reach us through any of the channels below.
                    </p>
                  </div>
                </RevealOnScroll>

                <div className="mt-10 space-y-8">
                  {/* Phone */}
                  <RevealOnScroll delay={0.1}>
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full border border-champagne-gold/20 flex items-center justify-center text-champagne-gold flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-champagne-gold/60 mb-1">
                          Phone
                        </p>
                        <a
                          href={`tel:${BRAND.phone}`}
                          className="font-[family-name:var(--font-cormorant)] text-lg text-text-primary hover:text-champagne-gold transition-colors duration-300"
                        >
                          {BRAND.phone}
                        </a>
                      </div>
                    </div>
                  </RevealOnScroll>

                  {/* WhatsApp */}
                  <RevealOnScroll delay={0.15}>
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full border border-champagne-gold/20 flex items-center justify-center flex-shrink-0">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-champagne-gold/60 mb-1">
                          WhatsApp
                        </p>
                        <a
                          href={`https://wa.me/${BRAND.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-[family-name:var(--font-cormorant)] text-lg text-text-primary hover:text-champagne-gold transition-colors duration-300"
                        >
                          Chat with us on WhatsApp
                        </a>
                      </div>
                    </div>
                  </RevealOnScroll>

                  {/* Email */}
                  <RevealOnScroll delay={0.2}>
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full border border-champagne-gold/20 flex items-center justify-center text-champagne-gold flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-champagne-gold/60 mb-1">
                          Email
                        </p>
                        <a
                          href={`mailto:${BRAND.email}`}
                          className="font-[family-name:var(--font-cormorant)] text-lg text-text-primary hover:text-champagne-gold transition-colors duration-300"
                        >
                          {BRAND.email}
                        </a>
                      </div>
                    </div>
                  </RevealOnScroll>

                  {/* Address */}
                  <RevealOnScroll delay={0.25}>
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full border border-champagne-gold/20 flex items-center justify-center text-champagne-gold flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-champagne-gold/60 mb-1">
                          Visit Us
                        </p>
                        <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-primary">
                          {BRAND.address}
                        </p>
                      </div>
                    </div>
                  </RevealOnScroll>

                  {/* Hours */}
                  <RevealOnScroll delay={0.3}>
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full border border-champagne-gold/20 flex items-center justify-center text-champagne-gold flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-champagne-gold/60 mb-1">
                          Hours
                        </p>
                        <p className="font-[family-name:var(--font-cormorant)] text-lg text-text-primary">
                          {BRAND.hours}
                        </p>
                      </div>
                    </div>
                  </RevealOnScroll>
                </div>

                {/* Social Links */}
                <RevealOnScroll delay={0.35}>
                  <div className="mt-10 pt-8 border-t border-champagne-gold/10">
                    <p className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-champagne-gold/50 mb-4">
                      Follow Us
                    </p>
                    <div className="flex items-center gap-3">
                      {Object.entries(BRAND.social).map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full border border-champagne-gold/15 flex items-center justify-center text-champagne-gold/50 hover:text-champagne-gold hover:border-champagne-gold/40 transition-all duration-500"
                          aria-label={platform}
                        >
                          <SocialIcon platform={platform} />
                        </a>
                      ))}
                    </div>
                  </div>
                </RevealOnScroll>
              </div>

              {/* Contact Form (Right Side) */}
              <div className="lg:col-span-3">
                <RevealOnScroll direction="right">
                  <div className="bg-dark-card border border-champagne-gold/10 rounded-sm p-8 sm:p-10">
                    <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-text-primary mb-2">
                      Send Us a Message
                    </h3>
                    <p className="font-[family-name:var(--font-cormorant)] text-base text-text-muted leading-relaxed mb-8">
                      Fill out the form below and we will get back to you within 24 hours.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label
                            htmlFor="contact-name"
                            className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-champagne-gold/60 mb-2 block"
                          >
                            Full Name *
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-matte-black border border-champagne-gold/10 rounded-sm px-4 py-3 font-[family-name:var(--font-cormorant)] text-base text-text-primary placeholder:text-text-muted/25 outline-none focus:border-champagne-gold/30 transition-colors duration-300"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="contact-email"
                            className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-champagne-gold/60 mb-2 block"
                          >
                            Email Address *
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-matte-black border border-champagne-gold/10 rounded-sm px-4 py-3 font-[family-name:var(--font-cormorant)] text-base text-text-primary placeholder:text-text-muted/25 outline-none focus:border-champagne-gold/30 transition-colors duration-300"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      {/* Phone & Subject */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label
                            htmlFor="contact-phone"
                            className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-champagne-gold/60 mb-2 block"
                          >
                            Phone Number
                          </label>
                          <input
                            id="contact-phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full bg-matte-black border border-champagne-gold/10 rounded-sm px-4 py-3 font-[family-name:var(--font-cormorant)] text-base text-text-primary placeholder:text-text-muted/25 outline-none focus:border-champagne-gold/30 transition-colors duration-300"
                            placeholder="+92-XXX-XXXXXXX"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="contact-subject"
                            className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-champagne-gold/60 mb-2 block"
                          >
                            Subject
                          </label>
                          <select
                            id="contact-subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            className="w-full bg-matte-black border border-champagne-gold/10 rounded-sm px-4 py-3 font-[family-name:var(--font-cormorant)] text-base text-text-primary outline-none focus:border-champagne-gold/30 transition-colors duration-300 appearance-none"
                          >
                            <option value="" className="bg-dark-card">Select a subject</option>
                            <option value="booking" className="bg-dark-card">Booking Inquiry</option>
                            <option value="bridal" className="bg-dark-card">Bridal Consultation</option>
                            <option value="services" className="bg-dark-card">Services Information</option>
                            <option value="vip" className="bg-dark-card">VIP Membership</option>
                            <option value="feedback" className="bg-dark-card">Feedback</option>
                            <option value="other" className="bg-dark-card">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label
                          htmlFor="contact-message"
                          className="font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-champagne-gold/60 mb-2 block"
                        >
                          Message *
                        </label>
                        <textarea
                          id="contact-message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={5}
                          className="w-full bg-matte-black border border-champagne-gold/10 rounded-sm px-4 py-3 font-[family-name:var(--font-cormorant)] text-base text-text-primary placeholder:text-text-muted/25 outline-none focus:border-champagne-gold/30 transition-colors duration-300 resize-none"
                          placeholder="How can we help you?"
                        />
                      </div>

                      {/* Submit */}
                      <div className="flex items-center gap-4">
                        <LuxuryButton
                          type="submit"
                          size="lg"
                          disabled={isSubmitting}
                          className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </LuxuryButton>

                        {submitStatus === "success" && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.15em] text-green-400/80"
                          >
                            Message sent successfully
                          </motion.p>
                        )}

                        {submitStatus === "error" && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.15em] text-red-400/80"
                          >
                            Failed to send. Please try again.
                          </motion.p>
                        )}
                      </div>
                    </form>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 luxury-gradient opacity-30" />
          <div className="relative z-10 section-padding max-w-[1440px] mx-auto">
            <RevealOnScroll>
              <SectionHeading
                kicker="Our Location"
                title="Find Us"
                description="Conveniently located on M.M. Alam Road in the heart of Gulberg III, Lahore. Ample parking available."
              />
            </RevealOnScroll>

            <GoldDivider className="my-12 max-w-xs mx-auto" />

            <RevealOnScroll>
              <div className="bg-dark-card border border-champagne-gold/10 rounded-sm overflow-hidden">
                <div className="aspect-[21/9] sm:aspect-[21/7] bg-gradient-to-br from-champagne-gold/[0.03] to-dark-card flex items-center justify-center relative">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-champagne-gold/15 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <p className="mt-3 font-[family-name:var(--font-playfair)] text-lg text-champagne-gold/20">
                      M.M. Alam Road, Gulberg III
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-cormorant)] text-sm text-text-muted/30">
                      Lahore, Pakistan
                    </p>
                  </div>

                  {/* Direction link */}
                  <a
                    href="https://maps.google.com/?q=31.5249,74.3522"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.2em] text-champagne-gold/50 hover:text-champagne-gold border border-champagne-gold/15 hover:border-champagne-gold/30 px-4 py-2 rounded-sm transition-all duration-500 flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                    </svg>
                    Get Directions
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Quick CTA */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-matte-black via-dark-card/30 to-matte-black" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-champagne-gold/[0.02] rounded-full blur-[100px]" />
          <div className="relative z-10 section-padding max-w-3xl mx-auto text-center">
            <RevealOnScroll>
              <p className="font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.3em] text-champagne-gold mb-5">
                Prefer to Talk?
              </p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-medium text-text-primary leading-tight">
                We Are Just a Call Away
              </h2>
              <p className="mt-5 font-[family-name:var(--font-cormorant)] text-lg text-text-muted leading-relaxed">
                For immediate assistance, call us directly or reach out on WhatsApp for a quick response. Our team is ready to help you book the perfect appointment.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
                <LuxuryButton href="/booking" size="lg">Book Appointment</LuxuryButton>
                <LuxuryButton
                  variant="outline"
                  size="lg"
                  onClick={() => window.open(`https://wa.me/${BRAND.whatsapp}?text=Hi, I'd like to inquire about your services`, "_blank")}
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

function SocialIcon({ platform }: { platform: string }) {
  const icons: Record<string, React.ReactNode> = {
    instagram: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    facebook: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    tiktok: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    youtube: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  };
  return icons[platform] || null;
}
