"use client";

import { type ReactNode, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PAGE_TRANSITION_CONFIG,
  REDUCED_MOTION,
} from "@/lib/animation";
import type { TargetAndTransition } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Types ───

type TransitionType = "standard" | "fade";

interface PageTransitionProps {
  /** Content to transition */
  children: ReactNode;
  /** Unique key for AnimatePresence (usually the route path) */
  transitionKey: string;
  /** Transition type */
  type?: TransitionType;
  /** Whether to respect prefers-reduced-motion */
  respectReducedMotion?: boolean;
  /** Custom className */
  className?: string;
  /** Custom initial variant */
  initial?: TargetAndTransition;
  /** Custom animate variant */
  animate?: TargetAndTransition;
  /** Custom exit variant */
  exit?: TargetAndTransition;
  /** Callback when transition starts */
  onTransitionStart?: () => void;
  /** Callback when transition completes */
  onTransitionComplete?: () => void;
}

// ─── Component ───

export function PageTransition({
  children,
  transitionKey,
  type = "standard",
  respectReducedMotion = true,
  className,
  initial,
  animate,
  exit,
  onTransitionStart,
  onTransitionComplete,
}: PageTransitionProps) {
  // Detect reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined" || !respectReducedMotion) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (!respectReducedMotion) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [respectReducedMotion]);

  // Select transition config based on type and reduced motion
  const config = prefersReducedMotion
    ? PAGE_TRANSITION_CONFIG.fade
    : PAGE_TRANSITION_CONFIG[type];

  // Build variants: custom overrides take priority
  const variants = {
    initial: initial ?? config.variants.initial,
    animate: animate ?? config.variants.animate,
    exit: exit ?? config.variants.exit,
  };

  // For reduced motion, always use fade with minimal duration
  const transition = prefersReducedMotion
    ? REDUCED_MOTION.instant
    : config.transition;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={transitionKey}
        className={cn("gpu-accelerate contain-layout", className)}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={transition}
        style={{
          // Prevent layout shifts during transition
          position: "relative",
          width: "100%",
          willChange: prefersReducedMotion ? "auto" : "transform, opacity",
        }}
        onAnimationStart={onTransitionStart}
        onAnimationComplete={() => {
          // Remove will-change after transition completes
          const el = document.querySelector(`[data-transition-key="${transitionKey}"]`);
          if (el instanceof HTMLElement) {
            el.style.willChange = "auto";
          }
          onTransitionComplete?.();
        }}
        data-transition-key={transitionKey}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Simple Fade Wrapper ───
// Lightweight wrapper for simple fade transitions without AnimatePresence overhead

interface SimpleFadeProps {
  children: ReactNode;
  /** Whether content is visible */
  visible: boolean;
  /** Custom className */
  className?: string;
  /** Animation duration in seconds */
  duration?: number;
  /** Whether to respect reduced motion */
  respectReducedMotion?: boolean;
}

export function SimpleFade({
  children,
  visible,
  className,
  duration = 0.3,
  respectReducedMotion = true,
}: SimpleFadeProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined" || !respectReducedMotion) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (!respectReducedMotion) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [respectReducedMotion]);

  const animDuration = prefersReducedMotion ? 0.01 : duration;

  return (
    <motion.div
      className={cn("gpu-accelerate", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: animDuration, ease: "easeOut" }}
      style={{
        pointerEvents: visible ? "auto" : "none",
        willChange: prefersReducedMotion ? "auto" : "opacity",
      }}
      aria-hidden={!visible}
    >
      {children}
    </motion.div>
  );
}

// ─── Presence Transition ───
// For elements that mount/unmount with animation

interface PresenceTransitionProps {
  children: ReactNode;
  /** Whether content is present */
  present: boolean;
  /** Custom className */
  className?: string;
  /** Animation direction */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Distance to travel in pixels */
  distance?: number;
  /** Whether to respect reduced motion */
  respectReducedMotion?: boolean;
}

export function PresenceTransition({
  children,
  present,
  className,
  direction = "up",
  distance = 20,
  respectReducedMotion = true,
}: PresenceTransitionProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined" || !respectReducedMotion) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (!respectReducedMotion) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [respectReducedMotion]);

  // Calculate direction offset (GPU-accelerated transforms only)
  const directionOffset = (() => {
    if (prefersReducedMotion || direction === "none") return {};
    switch (direction) {
      case "up": return { y: distance };
      case "down": return { y: -distance };
      case "left": return { x: distance };
      case "right": return { x: -distance };
      default: return {};
    }
  })();

  return (
    <AnimatePresence mode="wait">
      {present && (
        <motion.div
          key="presence-content"
          className={cn("gpu-accelerate", className)}
          initial={{ opacity: 0, ...directionOffset }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, ...directionOffset }}
          transition={{
            duration: prefersReducedMotion ? 0.01 : 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
