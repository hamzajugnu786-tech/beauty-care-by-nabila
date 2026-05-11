"use client";

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type RefObject,
} from "react";

// ─── useIntersectionObserver ───

interface UseIntersectionObserverOptions {
  /** Intersection threshold (0-1) or array of thresholds */
  threshold?: number | number[];
  /** Root margin for the observer */
  rootMargin?: string;
  /** Root element for the observer */
  root?: Element | null;
  /** Whether to stop observing after first intersection */
  once?: boolean;
  /** Whether the observer is enabled */
  enabled?: boolean;
}

interface UseIntersectionObserverReturn {
  ref: RefObject<Element | null>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

/**
 * Hook for observing when an element enters or exits the viewport.
 * Performance-optimized with once option and cleanup.
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const { threshold = 0.1, rootMargin = "0px", root = null, once = false, enabled = true } = options;

  const ref = useRef<Element | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const element = ref.current;

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        setIsIntersecting(observerEntry.isIntersecting);
        setEntry(observerEntry);

        if (observerEntry.isIntersecting && once) {
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin, root }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, root, once, enabled]);

  return { ref, isIntersecting, entry };
}

// ─── useReducedMotion ───

/**
 * Hook to detect if the user prefers reduced motion.
 * Returns true if the user has enabled reduced motion in their OS settings.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

// ─── usePageVisibility ───

/**
 * Hook to track page visibility state.
 * Useful for pausing animations, polling, or heavy computations when tab is hidden.
 */
export function usePageVisibility(): {
  isVisible: boolean;
  visibilityState: DocumentVisibilityState;
} {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof document === "undefined") return true;
    return !document.hidden;
  });
  const [visibilityState, setVisibilityState] = useState<DocumentVisibilityState>(() => {
    if (typeof document === "undefined") return "visible" as DocumentVisibilityState;
    return document.visibilityState;
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
      setVisibilityState(document.visibilityState);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return { isVisible, visibilityState };
}

// ─── useNetworkStatus ───

interface NetworkStatus {
  /** Whether the browser is online */
  isOnline: boolean;
  /** Estimated effective connection type */
  effectiveType: "slow-2g" | "2g" | "3g" | "4g" | "unknown";
  /** Estimated downlink speed in Mbps */
  downlink: number;
  /** Estimated round-trip time in ms */
  rtt: number;
  /** Whether the user has enabled data saver mode */
  saveData: boolean;
}

/**
 * Hook to track network connection status.
 * Useful for adjusting quality of images, disabling auto-play, etc.
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    effectiveType: "unknown",
    downlink: 0,
    rtt: 0,
    saveData: false,
  });

  useEffect(() => {
    const handleOnline = () => {
      setStatus((prev) => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setStatus((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Use Network Information API if available
    const connection = (navigator as unknown as { connection?: NetworkInformation })?.connection;
    if (connection) {
      const updateNetworkInfo = () => {
        setStatus({
          isOnline: navigator.onLine,
          effectiveType: connection.effectiveType || "unknown",
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          saveData: connection.saveData || false,
        });
      };

      updateNetworkInfo();
      connection.addEventListener("change", updateNetworkInfo);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        connection.removeEventListener("change", updateNetworkInfo);
      };
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return status;
}

// ─── Network Information API Type ───

interface NetworkInformation extends EventTarget {
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  addEventListener(type: "change", listener: () => void): void;
  removeEventListener(type: "change", listener: () => void): void;
}

// ─── useDebounce ───

/**
 * Hook to debounce a value. Returns the debounced value
 * that only updates after the specified delay.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook that returns a debounced callback function.
 */
export function useDebouncedCallback(
  callback: (...args: unknown[]) => void,
  delay: number
): (...args: unknown[]) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  const debouncedCallback = useCallback(
    (...args: unknown[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

// ─── useThrottle ───

/**
 * Hook that returns a throttled callback function.
 * Ensures the callback is called at most once per specified interval.
 */
export function useThrottle(
  callback: (...args: unknown[]) => void,
  limit: number
): (...args: unknown[]) => void {
  const lastCallRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  const throttledCallback = useCallback(
    (...args: unknown[]) => {
      const now = Date.now();
      const remaining = limit - (now - lastCallRef.current);

      if (remaining <= 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        lastCallRef.current = now;
        callbackRef.current(...args);
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          timeoutRef.current = null;
          callbackRef.current(...args);
        }, remaining);
      }
    },
    [limit]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
}

/**
 * Hook to throttle a value. Returns the throttled value
 * that updates at most once per specified interval.
 */
export function useThrottledValue<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const remaining = limit - (now - lastUpdateRef.current);

    if (remaining <= 0) {
      lastUpdateRef.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdateRef.current = Date.now();
        setThrottledValue(value);
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [value, limit]);

  return throttledValue;
}

// ─── useMeasure ───

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface UseMeasureReturn {
  ref: RefObject<Element | null>;
  rect: Rect | null;
  isMeasuring: boolean;
}

/**
 * Hook to measure the dimensions and position of a DOM element.
 * Uses ResizeObserver for efficient layout measurements.
 */
export function useMeasure(): UseMeasureReturn {
  const ref = useRef<Element | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      if (!ref.current) return;
      const bounds = ref.current.getBoundingClientRect();
      setRect({
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        top: bounds.top,
        right: bounds.right,
        bottom: bounds.bottom,
        left: bounds.left,
      });
      setIsMeasuring(false);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, rect, isMeasuring };
}

// ─── useBreakpoint ───

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const BREAKPOINT_VALUES: Record<Breakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

/**
 * Hook to get the current responsive breakpoint.
 * Uses matchMedia for efficient detection without resize listeners.
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === "undefined") return "md";
    const queries = Object.entries(BREAKPOINT_VALUES) as [Breakpoint, number][];
    const sorted = queries.sort(([, a], [, b]) => b - a);
    for (const [name, value] of sorted) {
      if (window.matchMedia(`(min-width: ${value}px)`).matches) {
        return name;
      }
    }
    return "xs";
  });

  useEffect(() => {
    const queries = Object.entries(BREAKPOINT_VALUES) as [Breakpoint, number][];

    const mediaQueries = queries
      .sort(([, a], [, b]) => b - a)
      .map(([name, value]) => ({
        name,
        mql: window.matchMedia(`(min-width: ${value}px)`),
      }));

    const updateBreakpoint = () => {
      const matched = mediaQueries.find(({ mql }) => mql.matches);
      setBreakpoint(matched?.name || "xs");
    };

    mediaQueries.forEach(({ mql }) => {
      mql.addEventListener("change", updateBreakpoint);
    });

    return () => {
      mediaQueries.forEach(({ mql }) => {
        mql.removeEventListener("change", updateBreakpoint);
      });
    };
  }, []);

  return breakpoint;
}

// ─── useIsClient ───

/**
 * Hook to determine if code is running on the client.
 * Useful for hydration-safe rendering of client-only content.
 */
export function useIsClient(): boolean {
  const [isClient] = useState(() => typeof window !== "undefined");

  return isClient;
}

// ─── useWindowSize ───

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Hook to track window dimensions with throttled updates.
 */
export function useWindowSize(throttleMs: number = 100): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    const handleResize = () => {
      const now = Date.now();
      if (now - lastUpdateRef.current < throttleMs) return;

      lastUpdateRef.current = now;
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [throttleMs]);

  return size;
}

// ─── useScrollPosition ───

interface ScrollPosition {
  x: number;
  y: number;
  direction: "up" | "down" | "none";
  progress: number;
}

/**
 * Hook to track scroll position with throttled updates.
 * Returns scroll position, direction, and progress (0-1).
 */
export function useScrollPosition(throttleMs: number = 16): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    direction: "none",
    progress: 0,
  });

  const lastYRef = useRef(0);
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastUpdateRef.current < throttleMs) return;

      lastUpdateRef.current = now;

      const x = window.scrollX;
      const y = window.scrollY;
      const direction = y > lastYRef.current ? "down" : y < lastYRef.current ? "up" : "none";
      lastYRef.current = y;

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(y / docHeight, 1) : 0;

      setPosition({ x, y, direction, progress });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [throttleMs]);

  return position;
}

// ─── useMediaQuery ───

/**
 * Hook to track a CSS media query match state.
 * More efficient than useBreakpoint for single query checks.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

// ─── Computed hooks ───

/**
 * Hook that provides common media query states
 */
export function useResponsive() {
  const isMobile = useMediaQuery("(max-width: 639px)");
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isLargeDesktop = useMediaQuery("(min-width: 1280px)");

  return useMemo(
    () => ({
      isMobile,
      isTablet,
      isDesktop,
      isLargeDesktop,
      breakpoint: isMobile ? "mobile" : isTablet ? "tablet" : isLargeDesktop ? "largeDesktop" : "desktop",
    }),
    [isMobile, isTablet, isDesktop, isLargeDesktop]
  );
}
