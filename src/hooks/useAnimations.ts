"use client";

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  type RefObject,
} from "react";
import {
  SCROLL_ANIMATION_CONFIG,
} from "@/lib/animation";
import { rafThrottle } from "@/lib/performance";

// ─── useReducedMotion ───
// Core hook that all other animation hooks depend on

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

// ─── useScrollAnimation ───
// IntersectionObserver + requestAnimationFrame based scroll animation trigger
// No layout shift on mount - element starts at final position via CSS

interface UseScrollAnimationOptions {
  /** IntersectionObserver threshold (0-1) */
  threshold?: number;
  /** IntersectionObserver root margin */
  rootMargin?: string;
  /** Only trigger once */
  once?: boolean;
  /** Whether the observer is enabled */
  enabled?: boolean;
  /** Whether to respect reduced motion */
  respectReducedMotion?: boolean;
}

interface UseScrollAnimationReturn {
  /** Ref to attach to the target element */
  ref: RefObject<HTMLElement | null>;
  /** Whether the element is currently in view */
  isInView: boolean;
  /** Whether the element has been in view at least once */
  hasBeenInView: boolean;
  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean;
  /** IntersectionObserver entry (if available) */
  entry: IntersectionObserverEntry | null;
}

export function useScrollAnimation({
  threshold = SCROLL_ANIMATION_CONFIG.defaultThreshold,
  rootMargin = SCROLL_ANIMATION_CONFIG.defaultRootMargin,
  once = true,
  enabled = true,
  respectReducedMotion = true,
}: UseScrollAnimationOptions = {}): UseScrollAnimationReturn {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // If reduced motion is preferred, elements are always "in view" (no animation needed)
  const skipAnimation = respectReducedMotion && prefersReducedMotion;

  const [isInView, setIsInView] = useState(skipAnimation);
  const [hasBeenInView, setHasBeenInView] = useState(skipAnimation);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    if (skipAnimation) return;

    const element = ref.current;

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        if (!observerEntry) return;

        setEntry(observerEntry);

        // Use rAF to ensure state updates happen in frame boundaries
        requestAnimationFrame(() => {
          if (observerEntry.isIntersecting) {
            setIsInView(true);
            setHasBeenInView(true);

            if (once) {
              observer.unobserve(element);
            }
          } else if (!once) {
            setIsInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once, enabled, skipAnimation]);

  return { ref, isInView, hasBeenInView, prefersReducedMotion, entry };
}

// ─── useParallax ───
// Throttled scroll-based parallax effect using requestAnimationFrame
// GPU-accelerated transforms only (translateY)

interface UseParallaxOptions {
  /** Parallax speed multiplier (-1 to 1). Positive = moves with scroll, negative = against */
  speed?: number;
  /** Whether the parallax is enabled */
  enabled?: boolean;
  /** Whether to respect reduced motion */
  respectReducedMotion?: boolean;
  /** Throttle interval in ms (default: rAF-based) */
  throttleMs?: number;
}

interface UseParallaxReturn {
  /** Ref to attach to the parallax element */
  ref: RefObject<HTMLElement | null>;
  /** Current Y offset to apply as transform */
  offsetY: number;
  /** Style object with GPU-accelerated transform */
  style: React.CSSProperties;
}

export function useParallax({
  speed = 0.3,
  enabled = true,
  respectReducedMotion = true,
  throttleMs,
}: UseParallaxOptions = {}): UseParallaxReturn {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const rafIdRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);
  const offsetYRef = useRef(0);
  const [offsetY, setOffsetY] = useState(0);

  const isParallaxActive = enabled && !(respectReducedMotion && prefersReducedMotion);

  useEffect(() => {
    if (!isParallaxActive) {
      // Use rAF to defer the state reset off the synchronous effect path
      const rafId = requestAnimationFrame(() => {
        offsetYRef.current = 0;
        setOffsetY(0);
      });
      return () => cancelAnimationFrame(rafId);
    }

    const element = ref.current;
    if (!element) return;

    // Clamp speed to safe range
    const clampedSpeed = Math.max(-1, Math.min(1, speed));

    const updateParallax = () => {
      const scrollY = window.scrollY;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only compute parallax when element is near viewport
      if (rect.bottom >= 0 && rect.top <= windowHeight) {
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const offset = (elementCenter - viewportCenter) * clampedSpeed * -0.5;

        offsetYRef.current = offset;
        // Use rAF to update in frame boundaries
        requestAnimationFrame(() => {
          setOffsetY(offset);
        });
      }

      lastScrollYRef.current = scrollY;
    };

    // Create throttled handler
    const handleScroll = throttleMs
      ? (() => {
          let lastCall = 0;
          return () => {
            const now = Date.now();
            if (now - lastCall >= throttleMs) {
              lastCall = now;
              updateParallax();
            }
          };
        })()
      : () => {
          if (rafIdRef.current !== null) return;
          rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = null;
            updateParallax();
          });
        };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateParallax(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [speed, isParallaxActive, throttleMs]);

  const style = useMemo(
    () => ({
      transform: `translateY(${offsetY}px)`,
      willChange: isParallaxActive
        ? "transform" as const
        : "auto" as const,
    }),
    [offsetY, isParallaxActive]
  );

  return { ref, offsetY, style };
}

// ─── useMagneticEffect ───
// Luxury hover effect that subtly pulls element toward cursor
// GPU-accelerated transforms only (translateX, translateY)

interface UseMagneticEffectOptions {
  /** Magnetic pull strength (0-1) */
  strength?: number;
  /** Maximum distance in pixels the element can move */
  maxDistance?: number;
  /** Whether the effect is enabled */
  enabled?: boolean;
  /** Whether to respect reduced motion */
  respectReducedMotion?: boolean;
  /** Spring stiffness for return animation */
  returnStiffness?: number;
}

interface UseMagneticEffectReturn {
  /** Ref to attach to the magnetic element */
  ref: RefObject<HTMLElement | null>;
  /** Current X offset */
  x: number;
  /** Current Y offset */
  y: number;
  /** Style object with GPU-accelerated transform */
  style: React.CSSProperties;
  /** Event handlers to attach to the element */
  handlers: {
    onMouseEnter: () => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseLeave: () => void;
  };
}

export function useMagneticEffect({
  strength = 0.3,
  maxDistance = 20,
  enabled = true,
  respectReducedMotion = true,
}: UseMagneticEffectOptions = {}): UseMagneticEffectReturn {
  const ref = useRef<HTMLElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const rafIdRef = useRef<number | null>(null);

  // Whether magnetic effect should be active
  const isActive = enabled && !(respectReducedMotion && prefersReducedMotion);

  const handleMouseEnter = useCallback(() => {
    if (!isActive) return;
    setIsHovered(true);
  }, [isActive]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isActive || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate offset from element center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Apply strength and clamp to maxDistance
      const clampedStrength = Math.max(0, Math.min(1, strength));
      const targetX = Math.max(-maxDistance, Math.min(maxDistance, deltaX * clampedStrength));
      const targetY = Math.max(-maxDistance, Math.min(maxDistance, deltaY * clampedStrength));

      // Use rAF for smooth updates
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        setPosition({ x: targetX, y: targetY });
      });
    },
    [isActive, strength, maxDistance]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);

    // Smoothly return to center using rAF
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      setPosition({ x: 0, y: 0 });
    });
  }, []);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Reset position when disabled - use rAF to defer off synchronous effect path
  const prevIsActiveRef = useRef(isActive);
  useEffect(() => {
    if (!isActive && prevIsActiveRef.current) {
      requestAnimationFrame(() => {
        setPosition({ x: 0, y: 0 });
      });
    }
    prevIsActiveRef.current = isActive;
  }, [isActive]);

  const style = useMemo(
    () => ({
      transform: `translate(${position.x}px, ${position.y}px)`,
      transition: isHovered ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      willChange: isActive ? ("transform" as const) : ("auto" as const),
    }),
    [position.x, position.y, isHovered, isActive]
  );

  const handlers = useMemo(
    () => ({
      onMouseEnter: handleMouseEnter,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    }),
    [handleMouseEnter, handleMouseMove, handleMouseLeave]
  );

  return { ref, x: position.x, y: position.y, style, handlers };
}

// ─── useTextReveal ───
// Staggered text reveal animation
// GPU-accelerated transforms only (translateY, opacity)

interface UseTextRevealOptions {
  /** Text content to reveal */
  text: string;
  /** Split mode */
  splitBy?: "word" | "character" | "line";
  /** Stagger delay between each unit in seconds */
  staggerDelay?: number;
  /** Whether the animation should play */
  triggered?: boolean;
  /** Whether to respect reduced motion */
  respectReducedMotion?: boolean;
  /** Animation duration per unit in seconds */
  duration?: number;
}

interface TextRevealUnit {
  /** The text content of this unit */
  content: string;
  /** Animation delay for this unit in seconds */
  delay: number;
  /** Animation variant key */
  state: "hidden" | "visible";
}

interface UseTextRevealReturn {
  /** Array of text units with animation config */
  units: TextRevealUnit[];
  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean;
}

export function useTextReveal({
  text,
  splitBy = "word",
  staggerDelay = 0.04,
  triggered = false,
  respectReducedMotion = true,
  duration = 0.5,
}: UseTextRevealOptions): UseTextRevealReturn {
  const prefersReducedMotion = useReducedMotion();

  const units = useMemo(() => {
    if (!text) return [];

    let parts: string[];
    switch (splitBy) {
      case "character":
        parts = text.split("");
        break;
      case "line":
        parts = text.split("\n");
        break;
      case "word":
      default:
        parts = text.split(" ");
        break;
    }

    // For reduced motion, all units visible immediately
    const effectiveStagger = respectReducedMotion && prefersReducedMotion
      ? 0
      : staggerDelay;
    const effectiveDuration = respectReducedMotion && prefersReducedMotion
      ? 0.01
      : duration;

    return parts.map((content, index) => ({
      content,
      delay: index * effectiveStagger,
      state: triggered ? "visible" as const : "hidden" as const,
      _duration: effectiveDuration,
    }));
  }, [text, splitBy, staggerDelay, triggered, prefersReducedMotion, respectReducedMotion, duration]);

  return { units, prefersReducedMotion };
}

// ─── useCountUp ───
// Animated counter with requestAnimationFrame
// No layout shift - uses fixed-width tabular-nums

interface UseCountUpOptions {
  /** Target value */
  end: number;
  /** Starting value */
  start?: number;
  /** Animation duration in ms */
  duration?: number;
  /** Whether to start the animation */
  triggered?: boolean;
  /** Easing function */
  easing?: (t: number) => number;
  /** Decimal places */
  decimals?: number;
  /** Whether to respect reduced motion */
  respectReducedMotion?: boolean;
  /** Callback when count completes */
  onComplete?: () => void;
}

interface UseCountUpReturn {
  /** Current count value */
  count: number;
  /** Formatted count string */
  formatted: string;
  /** Whether the count is in progress */
  isCounting: boolean;
  /** Manually trigger the count */
  startCounting: () => void;
}

export function useCountUp({
  end,
  start = 0,
  duration = 2000,
  triggered = false,
  easing,
  decimals = 0,
  respectReducedMotion = true,
  onComplete,
}: UseCountUpOptions): UseCountUpReturn {
  const [count, setCount] = useState(start);
  const [isCounting, setIsCounting] = useState(false);
  const rafIdRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Default easing: cubic ease-out
  const defaultEasing = (t: number) => 1 - Math.pow(1 - t, 3);
  const easingFn = easing || defaultEasing;

  // Store callbacks in refs to avoid stale closures
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const startCounting = useCallback(() => {
    if (isCounting) return;

    // For reduced motion, jump to end immediately
    if (respectReducedMotion && prefersReducedMotion) {
      setCount(end);
      onCompleteRef.current?.();
      return;
    }

    setIsCounting(true);
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFn(progress);

      const currentValue = start + (end - start) * easedProgress;
      setCount(decimals > 0
        ? parseFloat(currentValue.toFixed(decimals))
        : Math.round(currentValue)
      );

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(step);
      } else {
        setIsCounting(false);
        onCompleteRef.current?.();
      }
    };

    rafIdRef.current = requestAnimationFrame(step);
  }, [isCounting, start, end, duration, easingFn, decimals, prefersReducedMotion, respectReducedMotion]);

  // Auto-trigger when triggered prop becomes true
  const triggeredRef = useRef(triggered);
  useEffect(() => {
    triggeredRef.current = triggered;
  }, [triggered]);

  useEffect(() => {
    if (triggered && !isCounting) {
      // Defer to next frame to avoid synchronous setState in effect
      rafIdRef.current = requestAnimationFrame(() => {
        startCounting();
      });
    }
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [triggered, isCounting, startCounting]);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const formatted = useMemo(() => {
    if (decimals > 0) {
      return count.toFixed(decimals);
    }
    return count.toLocaleString();
  }, [count, decimals]);

  return { count, formatted, isCounting, startCounting };
}

// ─── useScrollProgress ───
// Enhanced scroll progress with rAF throttling

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = rafThrottle(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, []);

  return progress;
}

// ─── useScrollDirection ───
// Enhanced scroll direction with rAF throttling

export function useScrollDirection(): "up" | "down" {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const lastYRef = useRef(0);

  useEffect(() => {
    const handleScroll = rafThrottle(() => {
      const currentY = window.scrollY;
      setDirection(currentY > lastYRef.current ? "down" : "up");
      lastYRef.current = currentY;
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, []);

  return direction;
}

// ─── useInView ───
// Legacy-compatible hook (backward compatible with original)

export function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return { ref: setRef, inView };
}

// ─── useMediaQuery ───
// Legacy-compatible hook (backward compatible with original)

export function useMediaQuery(query: string) {
  const getMatches = (q: string) => {
    if (typeof window !== "undefined") return window.matchMedia(q).matches;
    return false;
  };
  const [matches, setMatches] = useState(() => getMatches(query));

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

// ─── useCounter ───
// Legacy-compatible hook (backward compatible with original)

export function useCounter(end: number, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const [started, setStarted] = useState(false);

  const startCounting = useCallback(() => {
    if (started) return;
    setStarted(true);
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start, started]);

  return { count, startCounting };
}
