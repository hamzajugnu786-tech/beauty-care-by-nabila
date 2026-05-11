// ─── Animation Configuration System ───
// Central animation variants, transition presets, and performance budgets
// All animations use GPU-accelerated properties only: translateX, translateY, scale, opacity

import type { Variants, Transition, Variant } from "framer-motion";

// ─── Performance Budget ───

export const PERFORMANCE_BUDGET = {
  /** Maximum animation duration in seconds */
  maxDuration: 1.2,
  /** Maximum total animation time including delays */
  maxTotalTime: 2.0,
  /** Maximum number of simultaneous animations */
  maxConcurrent: 4,
  /** Recommended duration for interactive elements */
  interactiveDuration: 0.2,
  /** Recommended duration for page transitions */
  transitionDuration: 0.4,
  /** Recommended duration for entrance animations */
  entranceDuration: 0.7,
  /** Frame budget in ms (16ms = 60fps) */
  frameBudget: 16,
  /** Maximum stagger children count before batching */
  maxStaggerCount: 12,
} as const;

// ─── Reduced Motion Config ───

export const REDUCED_MOTION = {
  /** Instant transition for reduced motion */
  instant: { duration: 0.01 } as Transition,
  /** Fade-only transition for reduced motion */
  fadeOnly: {
    duration: 0.2,
    ease: "linear",
  } as Transition,
  /** Variant that only uses opacity */
  instantVariant: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  } as Variants,
} as const;

// ─── Spring Physics Presets ───

export const SPRING_PRESETS = {
  /** Gentle spring for luxury, smooth reveals */
  gentle: {
    type: "spring" as const,
    stiffness: 120,
    damping: 20,
    mass: 1,
  },
  /** Snappy spring for interactive feedback */
  snappy: {
    type: "spring" as const,
    stiffness: 300,
    damping: 25,
    mass: 0.8,
  },
  /** Bouncy spring for playful interactions */
  bouncy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 15,
    mass: 0.8,
  },
  /** Luxury spring - slow, elegant, controlled */
  luxury: {
    type: "spring" as const,
    stiffness: 80,
    damping: 24,
    mass: 1.2,
  },
} as const;

export type SpringPresetName = keyof typeof SPRING_PRESETS;

// ─── Easing Presets ───

export const EASING = {
  /** Standard ease-out for entrance animations */
  easeOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
  /** Ease-in-out for bidirectional transitions */
  easeInOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  /** Ease-in for exit animations */
  easeIn: [0.7, 0, 0.84, 0] as [number, number, number, number],
  /** Linear for constant speed animations */
  linear: [0, 0, 1, 1] as [number, number, number, number],
  /** Luxury ease - slow start, smooth finish */
  luxury: [0.22, 1, 0.36, 1] as [number, number, number, number],
} as const;

// ─── Base Transition Presets ───

export const TRANSITION_PRESETS = {
  /** Fast transition for interactive elements (hover, focus) */
  fast: {
    duration: 0.2,
    ease: EASING.easeOut,
  } as Transition,

  /** Normal transition for most UI animations */
  normal: {
    duration: 0.5,
    ease: EASING.easeOut,
  } as Transition,

  /** Slow, luxurious transition for hero elements */
  luxury: {
    duration: 0.8,
    ease: EASING.luxury,
  } as Transition,

  /** Page transition duration */
  page: {
    duration: 0.4,
    ease: EASING.easeInOut,
  } as Transition,

  /** Stagger base transition */
  stagger: {
    duration: 0.6,
    ease: EASING.easeOut,
  } as Transition,
} as const;

// ─── GPU-Accelerated Properties Only ───
// These are the ONLY properties we animate to ensure GPU compositing.
// Never animate: width, height, top, left, margin, padding, border, font-size

export const GPU_PROPERTIES = {
  transform: true,
  opacity: true,
  filter: true, // Only blur/brightness - use sparingly
} as const;

// ─── Entrance Animation Variants ───
// All use GPU-accelerated transforms (translateX, translateY, scale, opacity)

export const ENTRANCE_VARIANTS = {
  /** Fade in only */
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  } as Variants,

  /** Fade up - the most common entrance */
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  } as Variants,

  /** Fade down */
  fadeDown: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  } as Variants,

  /** Fade in from left */
  fadeLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  } as Variants,

  /** Fade in from right */
  fadeRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  } as Variants,

  /** Scale up from slightly smaller */
  scaleIn: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  } as Variants,

  /** Scale up with subtle upward motion */
  scaleUp: {
    hidden: { opacity: 0, scale: 0.85, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  } as Variants,
} as const;

export type EntranceVariantName = keyof typeof ENTRANCE_VARIANTS;

// ─── Stagger Animation Configuration ───

export interface StaggerConfig {
  /** Delay between each child animation in seconds */
  staggerDelay: number;
  /** Delay before stagger starts in seconds */
  initialDelay: number;
  /** Transition for each child */
  childTransition: Transition;
  /** Variant for the container */
  containerVariants: Variants;
  /** Variant for each child */
  childVariants: Variants;
}

export function createStaggerConfig(
  staggerDelay: number = 0.08,
  childVariant: Variants = ENTRANCE_VARIANTS.fadeUp,
  childTransition: Transition = TRANSITION_PRESETS.stagger
): StaggerConfig {
  return {
    staggerDelay,
    initialDelay: 0,
    childTransition,
    containerVariants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0,
        },
      },
    },
    childVariants: {
      hidden: childVariant.hidden,
      visible: {
        ...childVariant.visible,
        transition: childTransition,
      },
    },
  };
}

/** Pre-built stagger configs for common patterns */
export const STAGGER_CONFIGS = {
  /** Fast stagger for lists/cards */
  fast: createStaggerConfig(0.05, ENTRANCE_VARIANTS.fadeUp, {
    duration: 0.4,
    ease: EASING.easeOut,
  }),

  /** Normal stagger for sections */
  normal: createStaggerConfig(0.08, ENTRANCE_VARIANTS.fadeUp, {
    duration: 0.6,
    ease: EASING.easeOut,
  }),

  /** Luxury stagger for hero elements */
  luxury: createStaggerConfig(0.12, ENTRANCE_VARIANTS.fadeUp, {
    duration: 0.8,
    ease: EASING.luxury,
  }),

  /** Scale stagger for card grids */
  scale: createStaggerConfig(0.06, ENTRANCE_VARIANTS.scaleIn, {
    duration: 0.5,
    ease: EASING.easeOut,
  }),
} as const;

// ─── Page Transition Variants ───

export const PAGE_TRANSITIONS = {
  /** Standard page transition */
  standard: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  } as Record<string, Variant>,

  /** Fade-only page transition (minimal layout shift) */
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } as Record<string, Variant>,

  /** Slide up page transition */
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  } as Record<string, Variant>,
} as const;

export const PAGE_TRANSITION_CONFIG = {
  /** Standard page transition config for AnimatePresence */
  standard: {
    variants: PAGE_TRANSITIONS.standard,
    transition: TRANSITION_PRESETS.page,
    initial: "initial" as const,
    animate: "animate" as const,
    exit: "exit" as const,
  },
  /** Fade-only transition config */
  fade: {
    variants: PAGE_TRANSITIONS.fade,
    transition: { duration: 0.2 },
    initial: "initial" as const,
    animate: "animate" as const,
    exit: "exit" as const,
  },
} as const;

// ─── Hero Animation Variants ───
// Proper will-change hints for above-the-fold content

export const HERO_VARIANTS = {
  /** Main hero content container */
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  } as Variants,

  /** Hero title with subtle scale */
  title: {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.0,
        ease: EASING.luxury,
      },
    },
  } as Variants,

  /** Hero subtitle */
  subtitle: {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: EASING.luxury,
        delay: 0.1,
      },
    },
  } as Variants,

  /** Hero CTA button */
  cta: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: EASING.easeOut,
        delay: 0.2,
      },
    },
  } as Variants,

  /** Hero decorative element */
  decorative: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: EASING.luxury,
      },
    },
  } as Variants,

  /** Hero background parallax layer */
  bgLayer: {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.5,
        ease: EASING.luxury,
      },
    },
  } as Variants,
} as const;

// ─── Hero will-change hints ───
// Apply these as style={{ willChange: ... }} on mount, remove after animation

export const HERO_WILL_CHANGE = {
  title: "transform, opacity" as const,
  subtitle: "transform, opacity" as const,
  cta: "transform, opacity" as const,
  decorative: "transform, opacity" as const,
  bgLayer: "transform, opacity" as const,
} as const;

// ─── Scroll-Driven Animation Configs ───

export const SCROLL_ANIMATION_CONFIG = {
  /** Default IntersectionObserver threshold */
  defaultThreshold: 0.1,
  /** Default root margin for early trigger */
  defaultRootMargin: "0px 0px -80px 0px",
  /** Hero section root margin (trigger earlier) */
  heroRootMargin: "0px 0px -20% 0px",
  /** Off-screen root margin (trigger well before visible) */
  earlyTriggerRootMargin: "100px 0px",
  /** Late trigger root margin (only when well into view) */
  lateTriggerRootMargin: "0px 0px -200px 0px",
  /** Parallax scroll multiplier range */
  parallaxRange: { min: -0.3, max: 0.3 },
  /** Scroll progress smoothing factor */
  scrollSmoothing: 0.1,
} as const;

// ─── Layout Animation Configs ───
// These prevent layout shifts during animations

export const LAYOUT_ANIMATION_CONFIG = {
  /** Layout animation transition */
  layoutTransition: {
    type: "spring" as const,
    stiffness: 200,
    damping: 25,
    mass: 0.8,
  } as Transition,

  /** Shared layout animation transition */
  sharedLayoutTransition: {
    type: "spring" as const,
    stiffness: 150,
    damping: 20,
    mass: 1,
  } as Transition,

  /** Layout group ID prefix for Framer Motion layoutId */
  layoutGroupPrefix: "salon-layout",

  /** Whether to use layout animations (disable for reduced motion) */
  shouldUseLayoutAnimation: (prefersReducedMotion: boolean): boolean => {
    return !prefersReducedMotion;
  },
} as const;

// ─── Hover & Interaction Variants ───

export const HOVER_VARIANTS = {
  /** Subtle lift on hover */
  lift: {
    rest: { y: 0 },
    hover: { y: -4, transition: SPRING_PRESETS.snappy },
  },

  /** Scale on hover */
  scale: {
    rest: { scale: 1 },
    hover: { scale: 1.03, transition: SPRING_PRESETS.gentle },
  },

  /** Subtle opacity shift on hover */
  opacity: {
    rest: { opacity: 1 },
    hover: { opacity: 0.85, transition: TRANSITION_PRESETS.fast },
  },

  /** Gold glow effect on hover */
  goldGlow: {
    rest: { opacity: 0.7, scale: 1 },
    hover: { opacity: 1, scale: 1.02, transition: SPRING_PRESETS.gentle },
  },
} as const;

// ─── Utility: Create Reduced-Motion-Safe Variants ───

export function createReducedMotionVariants(
  variants: Variants
): Variants {
  // For reduced motion, replace all transform-based animations with fade-only
  const reducedVariants: Variants = {};

  for (const [key, value] of Object.entries(variants)) {
    if (typeof value === "object" && value !== null) {
      const variantValue = value as Record<string, unknown>;
      reducedVariants[key] = {
        opacity: variantValue.opacity as number | undefined,
        // Strip all transform properties for reduced motion
      } as Variants[string];
    } else {
      reducedVariants[key] = value;
    }
  }

  return reducedVariants;
}

// ─── Utility: Get Animation Config Based on Motion Preference ───

export function getAnimationConfig(prefersReducedMotion: boolean) {
  return {
    duration: prefersReducedMotion ? 0.01 : PERFORMANCE_BUDGET.entranceDuration,
    transition: prefersReducedMotion ? REDUCED_MOTION.instant : TRANSITION_PRESETS.normal,
    springPreset: prefersReducedMotion ? REDUCED_MOTION.instant : SPRING_PRESETS.luxury,
    staggerDelay: prefersReducedMotion ? 0 : 0.08,
    useLayoutAnimation: LAYOUT_ANIMATION_CONFIG.shouldUseLayoutAnimation(prefersReducedMotion),
  };
}

// ─── Utility: Create CLS-safe min-height style ───

export function createMinHeightStyle(
  aspectRatio?: { width: number; height: number },
  fallbackHeight?: number
): React.CSSProperties {
  if (aspectRatio) {
    const paddingPercent = (aspectRatio.height / aspectRatio.width) * 100;
    return {
      minHeight: fallbackHeight ?? 200,
      position: "relative",
    };
  }
  return {
    minHeight: fallbackHeight ?? 200,
  };
}
