"use client";

import {
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { motion, type Variants, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Types ───

type RevealDirection = "up" | "down" | "left" | "right" | "none";

interface LazySectionProps {
  /** Content to lazy load */
  children: ReactNode;
  /** Custom className for the wrapper */
  className?: string;
  /** Intersection observer threshold (0-1) */
  threshold?: number;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Animation direction for reveal */
  direction?: RevealDirection;
  /** Animation distance in pixels */
  distance?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Animation delay in seconds */
  delay?: number;
  /** Framer Motion transition easing */
  easing?: [number, number, number, number];
  /** Show skeleton placeholder while not in view */
  showSkeleton?: boolean;
  /** Custom skeleton height */
  skeletonHeight?: string | number;
  /** Custom skeleton className */
  skeletonClassName?: string;
  /** Number of skeleton lines to show */
  skeletonLines?: number;
  /** Once revealed, should it stay visible on scroll out */
  once?: boolean;
  /** Reduced motion support - disables animations */
  respectReducedMotion?: boolean;
  /** Callback when section enters viewport */
  onEnter?: () => void;
  /** Callback when section exits viewport */
  onExit?: () => void;
  /** Custom Framer Motion variants */
  variants?: Variants;
  /** Custom Framer Motion transition */
  transition?: Transition;
  /** HTML tag to render as */
  as?: "div" | "section" | "article" | "aside" | "main";
  /** ID attribute */
  id?: string;
}

// ─── Animation Presets ───

function getDirectionOffset(direction: RevealDirection, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance, x: 0 };
    case "down":
      return { y: -distance, x: 0 };
    case "left":
      return { y: 0, x: distance };
    case "right":
      return { y: 0, x: -distance };
    case "none":
    default:
      return { y: 0, x: 0 };
  }
}

function createRevealVariants(
  direction: RevealDirection,
  distance: number
): Variants {
  const offset = getDirectionOffset(direction, distance);
  return {
    hidden: {
      opacity: 0,
      y: offset.y,
      x: offset.x,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  };
}

function createDefaultTransition(
  duration: number,
  delay: number,
  easing: [number, number, number, number]
): Transition {
  return {
    duration,
    delay,
    ease: easing,
  };
}

// ─── Skeleton Placeholder ───

function SectionSkeleton({
  height,
  className,
  lines = 3,
}: {
  height?: string | number;
  className?: string;
  lines?: number;
}) {
  const heightStyle =
    typeof height === "number" ? `${height}px` : height || "200px";

  return (
    <div className={cn("w-full", className)} style={{ minHeight: heightStyle }}>
      <div className="space-y-4 p-4">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-4 rounded-sm",
              i === lines - 1 && "w-3/4"
            )}
          />
        ))}
        <Skeleton className="h-32 w-full rounded-sm" />
      </div>
    </div>
  );
}

// ─── Component ───

export function LazySection({
  children,
  className,
  threshold = 0.1,
  rootMargin = "100px 0px",
  direction = "up",
  distance = 40,
  duration = 0.7,
  delay = 0,
  easing = [0.16, 1, 0.3, 1] as [number, number, number, number],
  showSkeleton = true,
  skeletonHeight,
  skeletonClassName,
  skeletonLines = 3,
  once = true,
  respectReducedMotion = true,
  onEnter,
  onExit,
  variants,
  transition,
  as = "section",
  id,
}: LazySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined" || !respectReducedMotion) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Detect reduced motion preference changes
  useEffect(() => {
    if (!respectReducedMotion) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [respectReducedMotion]);

  // Intersection Observer - direct useEffect without ref for the observer
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          setIsInView(true);
          setHasAnimated(true);
          onEnter?.();

          // If once is true, disconnect after first intersection
          if (once) {
            observer.unobserve(element);
          }
        } else {
          if (!once && hasAnimated) {
            setIsInView(false);
            onExit?.();
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once, hasAnimated, onEnter, onExit]);

  // Determine animation variants
  const finalVariants = variants || createRevealVariants(direction, distance);
  const finalTransition =
    transition ||
    createDefaultTransition(
      prefersReducedMotion ? 0.01 : duration,
      delay,
      easing
    );

  // If reduced motion is preferred, skip animation
  const shouldAnimate = !prefersReducedMotion;
  const motionProps = shouldAnimate
    ? {
        initial: "hidden",
        animate: isInView ? "visible" : "hidden",
        variants: finalVariants,
        transition: finalTransition,
      }
    : {
        initial: { opacity: isInView ? 1 : 0 },
        animate: { opacity: isInView ? 1 : 0 },
        transition: { duration: 0.01 },
      };

  // Render the appropriate wrapper element
  const MotionComponent = motion[as] || motion.section;

  return (
    <div ref={containerRef} className={className} id={id}>
      {!isInView && showSkeleton && !hasAnimated ? (
        <SectionSkeleton
          height={skeletonHeight}
          className={skeletonClassName}
          lines={skeletonLines}
        />
      ) : (
        <MotionComponent {...motionProps} style={{ willChange: shouldAnimate ? "transform, opacity" : "auto" }}>
          {children}
        </MotionComponent>
      )}
    </div>
  );
}

// ─── Convenience Presets ───

type LazyPresetProps = Omit<LazySectionProps, "direction" | "distance" | "duration">;

export function LazyFadeIn(props: LazyPresetProps) {
  return <LazySection {...props} direction="none" duration={0.6} />;
}

export function LazySlideUp(props: LazyPresetProps) {
  return <LazySection {...props} direction="up" distance={50} duration={0.7} />;
}

export function LazySlideDown(props: LazyPresetProps) {
  return <LazySection {...props} direction="down" distance={50} duration={0.7} />;
}

export function LazySlideLeft(props: LazyPresetProps) {
  return <LazySection {...props} direction="left" distance={50} duration={0.7} />;
}

export function LazySlideRight(props: LazyPresetProps) {
  return <LazySection {...props} direction="right" distance={50} duration={0.7} />;
}

export function LazyStaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  ...props
}: LazyPresetProps & { staggerDelay?: number }) {
  const staggerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <LazySection
      {...props}
      className={className}
      variants={staggerVariants}
      direction="none"
    >
      {children}
    </LazySection>
  );
}

export function LazyStaggerItem({
  children,
  className,
  ...props
}: LazyPresetProps) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
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
    <LazySection
      {...props}
      className={className}
      variants={itemVariants}
      direction="none"
      showSkeleton={false}
    >
      {children}
    </LazySection>
  );
}
