"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { NAV_LINKS, BRAND } from "@/lib/constants";
import { LuxuryButton } from "@/components/ui/LuxuryButton";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);
      if (currentY > 300 && currentY > lastScrollY) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-matte-black/80 backdrop-blur-xl border-b border-champagne-gold/10"
            : "bg-transparent"
        }`}
      >
        <nav className="section-padding">
          <div className="flex items-center justify-between h-18 sm:h-20 max-w-[1440px] mx-auto">
            {/* Logo */}
            <Link href="/" className="relative z-50 group">
              <span className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-medium text-text-primary group-hover:text-champagne-gold transition-colors duration-500">
                Nabila
              </span>
              <span className="hidden sm:inline font-[family-name:var(--font-inter)] text-[9px] uppercase tracking-[0.3em] text-champagne-gold/60 ml-3 align-middle">
                Lahore
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative font-[family-name:var(--font-inter)] text-[11px] uppercase tracking-[0.2em] text-text-muted hover:text-champagne-gold transition-colors duration-500 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-champagne-gold group-hover:w-full transition-all duration-500" />
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-5">
              <Link
                href="/vip"
                className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.2em] text-champagne-gold/70 hover:text-champagne-gold transition-colors duration-300"
              >
                VIP
              </Link>
              <LuxuryButton size="sm" onClick={() => {}}>
                Book Now
              </LuxuryButton>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="relative z-50 lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: 45, y: 6, backgroundColor: "#D4AF37" }
                    : { rotate: 0, y: 0, backgroundColor: "#F8F5F0" }
                }
                className="w-6 h-px block transition-colors duration-300"
              />
              <motion.span
                animate={
                  mobileOpen
                    ? { opacity: 0, scaleX: 0 }
                    : { opacity: 1, scaleX: 1 }
                }
                className="w-6 h-px bg-text-primary block"
              />
              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: -45, y: -6, backgroundColor: "#D4AF37" }
                    : { rotate: 0, y: 0, backgroundColor: "#F8F5F0" }
                }
                className="w-6 h-px block transition-colors duration-300"
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-matte-black/98 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl text-text-primary hover:text-champagne-gold transition-colors duration-500 block py-3"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8 flex flex-col items-center gap-4"
              >
                <LuxuryButton size="lg" onClick={() => setMobileOpen(false)}>
                  Book Appointment
                </LuxuryButton>
                <Link
                  href="/vip"
                  onClick={() => setMobileOpen(false)}
                  className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.3em] text-champagne-gold/60 hover:text-champagne-gold transition-colors mt-4"
                >
                  VIP Membership
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
