// ─── Performance Utilities ───
// Core Web Vitals measurement, resource hints, and optimization helpers

// ─── Core Web Vitals ───

interface VitalMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  navigationType?: string;
  entries: PerformanceEntry[];
}

type VitalCallback = (metric: VitalMetric) => void;

// LCP thresholds: good <= 2500ms, poor > 4000ms
const LCP_THRESHOLDS = { good: 2500, poor: 4000 };
// FID thresholds: good <= 100ms, poor > 300ms
const FID_THRESHOLDS = { good: 100, poor: 300 };
// CLS thresholds: good <= 0.1, poor > 0.25
const CLS_THRESHOLDS = { good: 0.1, poor: 0.25 };
// INP thresholds: good <= 200ms, poor > 500ms
const INP_THRESHOLDS = { good: 200, poor: 500 };
// TTFB thresholds: good <= 800ms, poor > 1800ms
const TTFB_THRESHOLDS = { good: 800, poor: 1800 };

function getRating(value: number, thresholds: { good: number; poor: number }): "good" | "needs-improvement" | "poor" {
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.poor) return "needs-improvement";
  return "poor";
}

/**
 * Measure Largest Contentful Paint (LCP)
 */
export function measureLCP(callback: VitalCallback): () => void {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return () => {};
  }

  let observer: PerformanceObserver | null = null;

  try {
    observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (!lastEntry) return;

      const value = lastEntry.startTime;
      callback({
        name: "LCP",
        value,
        rating: getRating(value, LCP_THRESHOLDS),
        delta: value,
        entries: [lastEntry],
      });
    });

    observer.observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    // Observer not supported
  }

  return () => observer?.disconnect();
}

/**
 * Measure First Input Delay (FID)
 */
export function measureFID(callback: VitalCallback): () => void {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return () => {};
  }

  let observer: PerformanceObserver | null = null;

  try {
    observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0];
      if (!firstEntry) return;

      const value = (firstEntry as PerformanceEventTiming).processingStart - firstEntry.startTime;
      callback({
        name: "FID",
        value,
        rating: getRating(value, FID_THRESHOLDS),
        delta: value,
        entries: [firstEntry],
      });
    });

    observer.observe({ type: "first-input", buffered: true });
  } catch {
    // Observer not supported
  }

  return () => observer?.disconnect();
}

/**
 * Measure Cumulative Layout Shift (CLS)
 */
export function measureCLS(callback: VitalCallback): () => void {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return () => {};
  }

  let observer: PerformanceObserver | null = null;
  let clsValue = 0;
  let sessionEntries: PerformanceEntry[] = [];

  try {
    observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShift = entry as LayoutShift;
        if (layoutShift.hadRecentInput) continue;

        const value = layoutShift.value;
        clsValue += value;
        sessionEntries.push(entry);

        callback({
          name: "CLS",
          value: clsValue,
          rating: getRating(clsValue, CLS_THRESHOLDS),
          delta: value,
          entries: sessionEntries,
        });
      }
    });

    observer.observe({ type: "layout-shift", buffered: true });
  } catch {
    // Observer not supported
  }

  return () => observer?.disconnect();
}

/**
 * Measure Interaction to Next Paint (INP)
 */
export function measureINP(callback: VitalCallback): () => void {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return () => {};
  }

  let observer: PerformanceObserver | null = null;
  let worstINP = 0;

  try {
    observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const eventTiming = entry as PerformanceEventTiming;
        if (!eventTiming.interactionId) continue;

        const value = eventTiming.duration;
        if (value > worstINP) {
          worstINP = value;
          callback({
            name: "INP",
            value,
            rating: getRating(value, INP_THRESHOLDS),
            delta: value - worstINP,
            entries: [entry],
          });
        }
      }
    });

    observer.observe({ type: "event", buffered: true });
  } catch {
    // Observer not supported
  }

  return () => observer?.disconnect();
}

/**
 * Measure Time to First Byte (TTFB)
 */
export function measureTTFB(callback: VitalCallback): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (navEntry) {
    const value = navEntry.responseStart;
    callback({
      name: "TTFB",
      value,
      rating: getRating(value, TTFB_THRESHOLDS),
      delta: value,
      entries: [navEntry],
    });
  }

  return () => {};
}

/**
 * Measure all Core Web Vitals and report them
 */
export function measureAllVitals(callback: VitalCallback): () => void {
  const cleanups = [
    measureLCP(callback),
    measureFID(callback),
    measureCLS(callback),
    measureINP(callback),
    measureTTFB(callback),
  ];

  return () => cleanups.forEach((fn) => fn());
}

// ─── Resource Hints ───

interface ResourceHintOptions {
  /** URL to hint */
  href: string;
  /** Type of hint */
  rel: "preload" | "prefetch" | "preconnect" | "dns-prefetch" | "modulepreload";
  /** Resource type for preload */
  as?: "script" | "style" | "image" | "font" | "fetch" | "document";
  /** Cross-origin attribute */
  crossOrigin?: "anonymous" | "use-credentials";
  /** Type attribute for preload */
  type?: string;
  /** Fetch priority */
  fetchPriority?: "high" | "low" | "auto";
}

/**
 * Inject a resource hint into the document head
 */
export function injectResourceHint(options: ResourceHintOptions): HTMLLinkElement | null {
  if (typeof document === "undefined") return null;

  // Check if hint already exists
  const existing = document.querySelector(`link[rel="${options.rel}"][href="${options.href}"]`);
  if (existing) return existing as HTMLLinkElement;

  const link = document.createElement("link");
  link.rel = options.rel;
  link.href = options.href;

  if (options.as) link.setAttribute("as", options.as);
  if (options.crossOrigin) link.crossOrigin = options.crossOrigin;
  if (options.type) link.type = options.type;
  if (options.fetchPriority) link.setAttribute("fetchpriority", options.fetchPriority);

  document.head.appendChild(link);
  return link;
}

/**
 * Preconnect to external origins for faster subsequent requests
 */
export function preconnectOrigins(): void {
  const origins = [
    "https://cdn.sanity.io",
    "https://res.cloudinary.com",
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    "https://www.googletagmanager.com",
  ];

  origins.forEach((href) => {
    injectResourceHint({ href, rel: "preconnect", crossOrigin: "anonymous" });
  });
}

/**
 * Preload critical fonts for faster text rendering
 */
export function preloadCriticalFonts(): void {
  const criticalFonts = [
    {
      href: "/fonts/Inter-Variable.woff2",
      as: "font" as const,
      type: "font/woff2",
      crossOrigin: "anonymous" as const,
    },
  ];

  criticalFonts.forEach((font) => {
    injectResourceHint({
      href: font.href,
      rel: "preload",
      as: font.as,
      type: font.type,
      crossOrigin: font.crossOrigin,
      fetchPriority: "high",
    });
  });
}

/**
 * Preload critical images for above-the-fold content
 */
export function preloadCriticalImages(urls: string[]): void {
  urls.forEach((url) => {
    injectResourceHint({
      href: url,
      rel: "preload",
      as: "image",
      fetchPriority: "high",
    });
  });
}

// ─── Font Loading Optimization ───

interface FontConfig {
  family: string;
  subsets: string[];
  display: "auto" | "block" | "swap" | "fallback" | "optional";
  weight?: string[];
  style?: string[];
  variable?: string;
}

/**
 * Font loading configuration for the salon website
 */
export const FONT_CONFIG: FontConfig[] = [
  {
    family: "Inter",
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
  },
  {
    family: "Playfair Display",
    subsets: ["latin"],
    display: "swap",
    variable: "--font-playfair",
  },
  {
    family: "Cormorant Garamond",
    subsets: ["latin"],
    display: "swap",
    weight: ["300", "400", "500", "600", "700"],
    style: ["normal", "italic"],
    variable: "--font-cormorant",
  },
];

/**
 * Generate CSS font-display declarations for critical fonts
 */
export function generateFontDisplayCSS(): string {
  return FONT_CONFIG.map((font) => {
    return `@font-face { font-family: '${font.family}'; font-display: ${font.display}; }`;
  }).join("\n");
}

// ─── Animation Frame Throttling ───

/**
 * Throttle a function using requestAnimationFrame
 */
export function rafThrottle<T extends (...args: unknown[]) => void>(
  callback: T
): T & { cancel: () => void } {
  let requestId: number | null = null;
  let lastArgs: unknown[] | null = null;

  const throttled = ((...args: unknown[]) => {
    lastArgs = args;
    if (requestId !== null) return;

    requestId = requestAnimationFrame(() => {
      requestId = null;
      if (lastArgs !== null) {
        callback(...lastArgs);
        lastArgs = null;
      }
    });
  }) as T & { cancel: () => void };

  throttled.cancel = () => {
    if (requestId !== null) {
      cancelAnimationFrame(requestId);
      requestId = null;
    }
    lastArgs = null;
  };

  return throttled;
}

// ─── Debounce / Throttle Utilities ───

/**
 * Debounce a function call
 */
export function debounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): T & { cancel: () => void; flush: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: unknown[] | null = null;

  const debounced = ((...args: unknown[]) => {
    lastArgs = args;
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (lastArgs !== null) {
        callback(...lastArgs);
        lastArgs = null;
      }
    }, delay);
  }) as T & { cancel: () => void; flush: () => void };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
  };

  debounced.flush = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (lastArgs !== null) {
      callback(...lastArgs);
      lastArgs = null;
    }
  };

  return debounced;
}

/**
 * Throttle a function call
 */
export function throttle<T extends (...args: unknown[]) => void>(
  callback: T,
  limit: number
): T & { cancel: () => void } {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const throttled = ((...args: unknown[]) => {
    const now = Date.now();
    const remaining = limit - (now - lastCall);

    if (remaining <= 0) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      callback(...args);
    } else if (timeoutId === null) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        callback(...args);
      }, remaining);
    }
  }) as T & { cancel: () => void };

  throttled.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastCall = 0;
  };

  return throttled;
}

// ─── Performance Observer Helpers ───

interface ObserverConfig {
  type: string;
  buffered?: boolean;
  callback: (entries: PerformanceEntry[]) => void;
}

/**
 * Create and manage a PerformanceObserver with cleanup
 */
export function createPerformanceObserver(
  config: ObserverConfig
): () => void {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return () => {};
  }

  let observer: PerformanceObserver | null = null;

  try {
    observer = new PerformanceObserver((list) => {
      config.callback(list.getEntries());
    });

    observer.observe({
      type: config.type,
      buffered: config.buffered ?? true,
    });
  } catch {
    // Observer type not supported
  }

  return () => observer?.disconnect();
}

/**
 * Observe long tasks that may block the main thread
 */
export function observeLongTasks(
  callback: (entries: PerformanceEntry[]) => void
): () => void {
  return createPerformanceObserver({
    type: "longtask",
    callback,
  });
}

/**
 * Observe resource loading performance
 */
export function observeResources(
  callback: (entries: PerformanceEntry[]) => void
): () => void {
  return createPerformanceObserver({
    type: "resource",
    callback,
  });
}

/**
 * Observe paint timing (FP, FCP)
 */
export function observePaint(
  callback: (entries: PerformanceEntry[]) => void
): () => void {
  return createPerformanceObserver({
    type: "paint",
    callback,
  });
}

// ─── Bundle Analysis Helpers ───

/**
 * Get navigation timing data for performance analysis
 */
export function getNavigationTiming(): Record<string, number> | null {
  if (typeof window === "undefined") return null;

  const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (!navEntry) return null;

  return {
    dns: navEntry.domainLookupEnd - navEntry.domainLookupStart,
    tcp: navEntry.connectEnd - navEntry.connectStart,
    ssl: navEntry.secureConnectionStart > 0 ? navEntry.connectEnd - navEntry.secureConnectionStart : 0,
    ttfb: navEntry.responseStart - navEntry.requestStart,
    download: navEntry.responseEnd - navEntry.responseStart,
    domParsing: navEntry.domInteractive - navEntry.responseEnd,
    domComplete: navEntry.domComplete - navEntry.domInteractive,
    loadEvent: navEntry.loadEventEnd - navEntry.loadEventStart,
    total: navEntry.loadEventEnd - navEntry.startTime,
  };
}

/**
 * Get resource timing summary grouped by type
 */
export function getResourceTimingSummary(): Record<string, { count: number; totalSize: number; totalTime: number }> {
  if (typeof window === "undefined") return {};

  const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
  const summary: Record<string, { count: number; totalSize: number; totalTime: number }> = {};

  for (const resource of resources) {
    const type = resource.initiatorType || "unknown";
    if (!summary[type]) {
      summary[type] = { count: 0, totalSize: 0, totalTime: 0 };
    }

    summary[type].count++;
    summary[type].totalSize += resource.transferSize || 0;
    summary[type].totalTime += resource.responseEnd - resource.startTime;
  }

  return summary;
}

/**
 * Report performance metrics to analytics
 */
export function reportPerformanceMetrics(
  endpoint?: string
): () => void {
  return measureAllVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.info(`[Performance] ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
    }

    // Send to analytics endpoint if provided
    if (endpoint && typeof navigator !== "undefined" && navigator.sendBeacon) {
      const payload = JSON.stringify({
        name: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating,
        delta: Math.round(metric.delta),
        url: typeof window !== "undefined" ? window.location.href : "",
        timestamp: Date.now(),
      });

      navigator.sendBeacon(endpoint, payload);
    }
  });
}

// ─── Critical CSS Extraction Hints ───

/**
 * Generate hints for critical CSS extraction
 * These can be used by build tools to identify above-the-fold CSS
 */
export const CRITICAL_CSS_SELECTORS = [
  // Hero section
  ".hero-section",
  ".hero-title",
  ".hero-subtitle",
  ".hero-cta",
  // Navigation
  "nav",
  ".navbar",
  ".nav-link",
  ".logo",
  // Typography
  "h1", "h2", "h3",
  "p",
  ".font-cormorant",
  ".font-playfair",
  ".font-inter",
  // Layout
  ".container",
  ".section-gap",
  ".section-padding",
  // Colors & backgrounds
  ".bg-matte-black",
  ".bg-dark-surface",
  ".bg-dark-card",
  ".text-champagne-gold",
  ".text-text-primary",
  ".text-text-muted",
  // CTA
  ".btn-primary",
  ".btn-secondary",
  ".luxury-button",
] as const;

// ─── Layout Shift Prevention ───

/**
 * Calculate the aspect ratio padding for an image container
 * to prevent layout shift during loading
 */
export function calculateAspectRatioPadding(
  width: number,
  height: number
): string {
  return `${((height / width) * 100).toFixed(4)}%`;
}

/**
 * Common aspect ratio padding values for the salon site
 */
export const ASPECT_RATIO_PADDING = {
  square: "100%",
  landscape: "56.25%",     // 16/9
  portrait: "133.33%",     // 3/4
  galleryThumb: "100%",
  heroBanner: "42.8571%",  // 21/9
  bridalCard: "120%",      // 5/6
  testimonial: "100%",
} as const;

// ─── Type Augmentations ───

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  interactionId: number;
  duration: number;
}
