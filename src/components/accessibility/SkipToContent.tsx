"use client";

import { useCallback } from "react";

/**
 * SkipToContent Component
 *
 * Provides skip navigation links that are visually hidden until focused
 * via keyboard Tab. Allows keyboard and screen reader users to bypass
 * repetitive navigation and jump directly to key page sections.
 *
 * Styled with brand colors (Champagne Gold on Matte Black).
 *
 * WCAG 2.1 SC 2.4.1: Bypass Blocks (Level A)
 */
export function SkipToContent() {
  const handleSkip = useCallback((targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      // Make the target focusable if it isn't already
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }
      target.focus();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[100] flex flex-col"
      role="navigation"
      aria-label="Skip navigation"
    >
      {/* Skip to Main Content */}
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          handleSkip("main-content");
        }}
        className={`
          sr-only focus:not-sr-only
          focus:fixed focus:top-4 focus:left-4 focus:z-[100]
          focus:inline-flex focus:items-center focus:justify-center
          focus:px-6 focus:py-3
          focus:bg-champagne-gold focus:text-matte-black
          focus:font-[family-name:var(--font-inter)]
          focus:text-sm focus:font-semibold focus:uppercase
          focus:tracking-widest
          focus:rounded-md
          focus:shadow-lg focus:shadow-champagne-gold/20
          focus:outline-none focus:ring-2 focus:ring-champagne-gold focus:ring-offset-2 focus:ring-offset-matte-black
          focus:transition-all focus:duration-200
        `}
      >
        Skip to main content
      </a>

      {/* Skip to Booking */}
      <a
        href="#booking-section"
        onClick={(e) => {
          e.preventDefault();
          handleSkip("booking-section");
        }}
        className={`
          sr-only focus:not-sr-only
          focus:fixed focus:top-16 focus:left-4 focus:z-[100]
          focus:inline-flex focus:items-center focus:justify-center
          focus:px-6 focus:py-3
          focus:bg-champagne-gold focus:text-matte-black
          focus:font-[family-name:var(--font-inter)]
          focus:text-sm focus:font-semibold focus:uppercase
          focus:tracking-widest
          focus:rounded-md
          focus:shadow-lg focus:shadow-champagne-gold/20
          focus:outline-none focus:ring-2 focus:ring-champagne-gold focus:ring-offset-2 focus:ring-offset-matte-black
          focus:transition-all focus:duration-200
        `}
      >
        Skip to booking
      </a>

      {/* Skip to Navigation */}
      <a
        href="#main-navigation"
        onClick={(e) => {
          e.preventDefault();
          handleSkip("main-navigation");
        }}
        className={`
          sr-only focus:not-sr-only
          focus:fixed focus:top-28 focus:left-4 focus:z-[100]
          focus:inline-flex focus:items-center focus:justify-center
          focus:px-6 focus:py-3
          focus:bg-champagne-gold focus:text-matte-black
          focus:font-[family-name:var(--font-inter)]
          focus:text-sm focus:font-semibold focus:uppercase
          focus:tracking-widest
          focus:rounded-md
          focus:shadow-lg focus:shadow-champagne-gold/20
          focus:outline-none focus:ring-2 focus:ring-champagne-gold focus:ring-offset-2 focus:ring-offset-matte-black
          focus:transition-all focus:duration-200
        `}
      >
        Skip to navigation
      </a>
    </div>
  );
}
