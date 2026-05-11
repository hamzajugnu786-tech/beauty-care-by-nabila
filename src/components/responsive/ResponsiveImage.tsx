"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { BREAKPOINTS } from "@/hooks/useResponsive";

// ─── Types ───

interface ResponsiveImageSource {
  /** Image URL for mobile (below md breakpoint) */
  mobile?: string;
  /** Image URL for tablet (md to lg breakpoint) */
  tablet?: string;
  /** Image URL for desktop (lg and above) */
  desktop?: string;
  /** Default image URL (used if no breakpoint-specific image) */
  default: string;
}

interface ResponsiveImageProps {
  /** Image sources for different breakpoints */
  src: string | ResponsiveImageSource;
  /** Alt text for the image (required for accessibility) */
  alt: string;
  /** Width of the image */
  width?: number;
  /** Height of the image */
  height?: number;
  /** Aspect ratio for the image container (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;
  /** Additional CSS class names */
  className?: string;
  /** Image loading strategy */
  loading?: "lazy" | "eager";
  /** Whether to show a placeholder while loading */
  showPlaceholder?: boolean;
  /** Placeholder background color (Tailwind class) */
  placeholderColor?: string;
  /** Image fit mode */
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  /** Border radius */
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  /** Priority for above-the-fold images */
  priority?: boolean;
  /** Sizes attribute for srcset */
  sizes?: string;
  /** Called when image fails to load */
  onError?: () => void;
  /** Called when image loads successfully */
  onLoad?: () => void;
  /** ARIA label override (use only when alt is not sufficient) */
  "aria-label"?: string;
  /** Whether the image is decorative (will use alt="" and role="presentation") */
  decorative?: boolean;
}

// ─── Component ───

/**
 * ResponsiveImage Component
 *
 * An art-directed responsive image component that supports:
 * - Different images for mobile/tablet/desktop breakpoints
 * - WebP/AVIF format support via source elements
 * - Lazy loading with IntersectionObserver
 * - Proper alt text and ARIA attributes
 * - Aspect ratio preservation
 * - Loading state with placeholder
 * - Error handling with fallback
 *
 * @example
 * ```tsx
 * <ResponsiveImage
 *   src={{
 *     mobile: "/images/hero-mobile.jpg",
 *     tablet: "/images/hero-tablet.jpg",
 *     desktop: "/images/hero-desktop.jpg",
 *     default: "/images/hero.jpg",
 *   }}
 *   alt="Luxury bridal makeup by Nabila"
 *   aspectRatio="16/9"
 *   loading="lazy"
 * />
 * ```
 */
export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  aspectRatio,
  className,
  loading = "lazy",
  showPlaceholder = true,
  placeholderColor = "bg-dark-card",
  objectFit = "cover",
  rounded = "none",
  priority = false,
  sizes,
  onError,
  onLoad,
  "aria-label": ariaLabel,
  decorative = false,
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(() => priority || loading === "eager");
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse source configuration
  const sources = useMemo(() => {
    if (typeof src === "string") {
      return { mobile: src, tablet: src, desktop: src, default: src };
    }
    return {
      mobile: src.mobile || src.default,
      tablet: src.tablet || src.default,
      desktop: src.desktop || src.default,
      default: src.default,
    };
  }, [src]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (isInView) return;

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      {
        rootMargin: "200px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isInView]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  const roundedClass = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  }[rounded];

  const containerStyle: React.CSSProperties = {
    ...(aspectRatio ? { aspectRatio } : {}),
    ...(width ? { maxWidth: width } : {}),
  };

  const imgAlt = decorative ? "" : alt;
  const imgRole = decorative ? "presentation" : undefined;
  const imgAriaLabel = decorative ? undefined : ariaLabel;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        roundedClass,
        placeholderColor,
        className
      )}
      style={containerStyle}
    >
      {/* Placeholder skeleton */}
      {showPlaceholder && !isLoaded && !hasError && (
        <div
          className={cn(
            "absolute inset-0 animate-pulse",
            placeholderColor
          )}
          aria-hidden="true"
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "bg-dark-card text-text-muted"
          )}
          role="img"
          aria-label={imgAlt || "Image failed to load"}
        >
          <svg
            className="w-12 h-12 opacity-30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
            />
          </svg>
        </div>
      )}

      {/* Art-directed picture element */}
      {isInView && !hasError && (
        <picture>
          {/* Desktop source (lg and above) */}
          <source
            media={`(min-width: ${BREAKPOINTS.lg}px)`}
            srcSet={sources.desktop}
          />

          {/* Tablet source (md to lg) */}
          <source
            media={`(min-width: ${BREAKPOINTS.md}px)`}
            srcSet={sources.tablet}
          />

          {/* Mobile source (below md) - default */}
          <img
            src={sources.mobile}
            alt={imgAlt}
            role={imgRole}
            aria-label={imgAriaLabel}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            sizes={sizes}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "w-full h-full transition-opacity duration-500",
              objectFit === "cover" && "object-cover",
              objectFit === "contain" && "object-contain",
              objectFit === "fill" && "object-fill",
              objectFit === "none" && "object-none",
              objectFit === "scale-down" && "object-scale-down",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        </picture>
      )}
    </div>
  );
}

// ─── Responsive Background Image Helper ───

interface ResponsiveBgImageProps {
  /** Image sources per breakpoint */
  src: string | ResponsiveImageSource;
  /** Additional CSS class names */
  className?: string;
  /** Child elements */
  children?: React.ReactNode;
  /** Overlay color for readability */
  overlay?: "dark" | "light" | "none";
  /** Overlay opacity (0-100) */
  overlayOpacity?: number;
}

/**
 * Responsive background image component.
 *
 * Uses CSS background-image with media queries for art-directed
 * responsive backgrounds, common in hero sections.
 */
export function ResponsiveBgImage({
  src,
  className,
  children,
  overlay = "dark",
  overlayOpacity = 40,
}: ResponsiveBgImageProps) {
  const sources = useMemo(() => {
    if (typeof src === "string") {
      return { mobile: src, tablet: src, desktop: src };
    }
    return {
      mobile: src.mobile || src.default,
      tablet: src.tablet || src.default,
      desktop: src.desktop || src.default,
    };
  }, [src]);

  const [currentSrc, setCurrentSrc] = useState(sources.desktop);

  useEffect(() => {
    const updateSrc = () => {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS.lg) {
        setCurrentSrc(sources.desktop);
      } else if (width >= BREAKPOINTS.md) {
        setCurrentSrc(sources.tablet);
      } else {
        setCurrentSrc(sources.mobile);
      }
    };

    updateSrc();
    window.addEventListener("resize", updateSrc, { passive: true });
    return () => window.removeEventListener("resize", updateSrc);
  }, [sources]);

  const overlayStyle =
    overlay === "none"
      ? {}
      : overlay === "dark"
        ? {
            background: `linear-gradient(to bottom, rgba(12, 12, 16, ${overlayOpacity / 100}), rgba(12, 12, 16, ${(overlayOpacity + 20) / 100}))`,
          }
        : {
            background: `linear-gradient(to bottom, rgba(248, 245, 240, ${overlayOpacity / 100}), rgba(248, 245, 240, ${(overlayOpacity + 10) / 100}))`,
          };

  return (
    <div
      className={cn("relative", className)}
      style={{
        backgroundImage: `url(${currentSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      role="img"
      aria-hidden="true"
    >
      {overlay !== "none" && (
        <div className="absolute inset-0" style={overlayStyle} />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}


