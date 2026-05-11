"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { motion, type Variants, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ENTRANCE_VARIANTS,
  REDUCED_MOTION,
  TRANSITION_PRESETS,
  SCROLL_ANIMATION_CONFIG,
  type EntranceVariantName,
} from "@/lib/animation";

// ─── Types ───

interface AnimatedSectionProps {
  /** Content to render */
  children: ReactNode;
  /** Custom className for wrapper */
  className?: string;
  /** Entrance animation variant name */
  variant?: EntranceVariantName;
  /** Custom Framer Motion variants (overrides variant prop) */
  variants?: Variants;
  /** Custom transition config */
  transition?: Transition;
  /** Animation delay in seconds */
  delay?: number;
  /** Animation duration in seconds (overrides transition duration) */
  duration?: number;
  /** IntersectionObserver threshold (0-1) */
  threshold?: number;
  /** IntersectionObserver root margin */
  rootMargin?: string;
  /** Only animate once */
  once?: boolean;
  /** Respect prefers-reduced-motion */
  respectReducedMotion?: boolean;
  /** HTML element to render as */
  as?: "div" | "section" | "article" | "aside" | "main" | "header" | "footer";
  /** ID attribute */
  id?: string;
  /** ARIA label */
  ariaLabel?: string;
  /** Minimum height placeholder to prevent CLS (pixels) */
  minHeight?: number;
  /** Whether to use content-visibility CSS hint */
  useContentVisibility?: boolean;
  /** Callback when section enters viewport */
  onEnter?: () => void;
  /** Callback when section exits viewport */
  onExit?: () => void;
  /** Inline styles for the wrapper */
  style?: React.CSSProperties;
  /** Data attributes for testing */
  "data-testid"?: string;
}

// ─── Component ───

export function AnimatedSection({
  children,
  className,
  variant = "fadeUp",
  variants: customVariants,
  transition: customTransition,
  delay = 0,
  duration,
  threshold = SCROLL_ANIMATION_CONFIG.defaultThreshold,
  rootMargin = SCROLL_ANIMATION_CONFIG.defaultRootMargin,
  once = true,
  respectReducedMotion = true,
  as = "section",
  id,
  ariaLabel,
  minHeight,
  useContentVisibility = true,
  onEnter,
  onExit,
  style,
  "data-testid": dataTestId,
}: AnimatedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [willChangeActive, setWillChangeActive] = useState(false);

  // Detect reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined" || !respectReducedMotion) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Listen for reduced motion changes
  useEffect(() => {
    if (!respectReducedMotion) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [respectReducedMotion]);

  // IntersectionObserver - triggers animation on scroll
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        if (entry.isIntersecting) {
          setIsInView(true);
          setHasAnimated(true);
          setWillChangeActive(true);
          onEnter?.();

          if (once) {
            observer.unobserve(element);
          }
        } else if (!once && hasAnimated) {
          setIsInView(false);
          onExit?.();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, hasAnimated, onEnter, onExit]);

  // Remove will-change after animation completes to free GPU memory
  useEffect(() => {
    if (!willChangeActive || prefersReducedMotion) return;

    const animDuration = (duration ?? 0.7) * 1000 + delay * 1000 + 100;
    const timer = setTimeout(() => {
      setWillChangeActive(false);
    }, animDuration);

    return () => clearTimeout(timer);
  }, [willChangeActive, duration, delay, prefersReducedMotion]);

  // Determine animation variants
  const resolvedVariants = customVariants || ENTRANCE_VARIANTS[variant];

  // Determine transition config
  const resolvedTransition = customTransition || {
    duration: duration ?? (prefersReducedMotion ? 0.01 : 0.7),
    delay,
    ease: [0.16, 1, 0.3, 1],
  };

  // For reduced motion, use fade-only animation
  const finalVariants = prefersReducedMotion
    ? REDUCED_MOTION.instantVariant
    : resolvedVariants;

  const finalTransition = prefersReducedMotion
    ? REDUCED_MOTION.instant
    : resolvedTransition;

  // Compute will-change style
  const willChangeStyle: React.CSSProperties = willChangeActive && !prefersReducedMotion
    ? { willChange: "transform, opacity" }
    : { willChange: "auto" };

  // Content visibility CSS for off-screen optimization
  const contentVisibilityStyle: React.CSSProperties = useContentVisibility && !isInView
    ? {
        contentVisibility: "auto",
        containIntrinsicSize: minHeight ? `${minHeight}px` : "500px",
      }
    : {};

  // CLS prevention: min-height when not yet visible
  const minHeightStyle: React.CSSProperties = minHeight && !isInView && !hasAnimated
    ? { minHeight }
    : {};

  // Combined styles
  const combinedStyle: React.CSSProperties = {
    ...willChangeStyle,
    ...contentVisibilityStyle,
    ...minHeightStyle,
    ...style,
  };

  // Select motion component
  const MotionComponent = motion[as] || motion.section;

  // Reduced motion: instant appearance, no animation
  if (prefersReducedMotion) {
    return (
      <div
        ref={containerRef}
        className={cn("gpu-accelerate", className)}
        id={id}
        aria-label={ariaLabel}
        style={combinedStyle}
        data-testid={dataTestId}
      >
        <MotionComponent
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={finalVariants}
          transition={finalTransition}
        >
          {children}
        </MotionComponent>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("gpu-accelerate contain-layout", className)}
      id={id}
      aria-label={ariaLabel}
      style={combinedStyle}
      data-testid={dataTestId}
    >
      <MotionComponent
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={finalVariants}
        transition={finalTransition}
      >
        {children}
      </MotionComponent>
    </div>
  );
}

// ─── Convenience Presets ───

type PresetProps = Omit<AnimatedSectionProps, "variant">;

export function AnimatedFadeIn(props: PresetProps) {
  return <AnimatedSection {...props} variant="fadeIn" />;
}

export function AnimatedFadeUp(props: PresetProps) {
  return <AnimatedSection {...props} variant="fadeUp" />;
}

export function AnimatedFadeDown(props: PresetProps) {
  return <AnimatedSection {...props} variant="fadeDown" />;
}

export function AnimatedFadeLeft(props: PresetProps) {
  return <AnimatedSection {...props} variant="fadeLeft" />;
}

export function AnimatedFadeRight(props: PresetProps) {
  return <AnimatedSection {...props} variant="fadeRight" />;
}

export function AnimatedScaleIn(props: PresetProps) {
  return <AnimatedSection {...props} variant="scaleIn" />;
}

// ─── Stagger Container & Items ───

interface StaggerContainerProps extends Omit<AnimatedSectionProps, "variant"> {
  /** Delay between each child animation in seconds */
  staggerDelay?: number;
  /** Content to render */
  children: ReactNode;
}

export function AnimatedStaggerContainer({
  children,
  staggerDelay = 0.08,
  ...props
}: StaggerContainerProps) {
  const staggerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <AnimatedSection
      {...props}
      variants={staggerVariants}
      variant="fadeIn"
    >
      {children}
    </AnimatedSection>
  );
}

interface StaggerItemProps extends Omit<AnimatedSectionProps, "variant" | "threshold" | "rootMargin"> {
  children: ReactNode;
}

export function AnimatedStaggerItem({
  children,
  className,
  ...props
}: StaggerItemProps) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className={cn("gpu-accelerate", className)}
      variants={itemVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}
