"use client";

import { useEffect, useState, useRef, useCallback, type RefObject } from "react";

// ─── Breakpoint Definitions ───

/** Tailwind CSS default breakpoints */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// ─── useBreakpoint ───

interface BreakpointState {
  /** Current active breakpoint */
  current: Breakpoint | "xs";
  /** Whether viewport is at least the given breakpoint */
  isAbove: (bp: Breakpoint) => boolean;
  /** Whether viewport is below the given breakpoint */
  isBelow: (bp: Breakpoint) => boolean;
  /** Whether viewport matches the given breakpoint exactly */
  is: (bp: Breakpoint | "xs") => boolean;
  /** Raw viewport width */
  width: number;
}

/**
 * Hook for responsive breakpoint detection.
 *
 * Tracks the current viewport width and provides utility methods
 * for conditional logic based on Tailwind CSS breakpoints.
 *
 * @example
 * ```tsx
 * const { current, isAbove, isBelow } = useBreakpoint();
 * if (isAbove("lg")) { ... }
 * ```
 */
export function useBreakpoint(): BreakpointState {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Use ResizeObserver on document body for better performance
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCurrentBreakpoint = (): Breakpoint | "xs" => {
    if (width >= BREAKPOINTS["2xl"]) return "2xl";
    if (width >= BREAKPOINTS.xl) return "xl";
    if (width >= BREAKPOINTS.lg) return "lg";
    if (width >= BREAKPOINTS.md) return "md";
    if (width >= BREAKPOINTS.sm) return "sm";
    return "xs";
  };

  const isAbove = useCallback(
    (bp: Breakpoint): boolean => width >= BREAKPOINTS[bp],
    [width]
  );

  const isBelow = useCallback(
    (bp: Breakpoint): boolean => width < BREAKPOINTS[bp],
    [width]
  );

  const is = useCallback(
    (bp: Breakpoint | "xs"): boolean => {
      if (bp === "xs") return width < BREAKPOINTS.sm;
      return width >= BREAKPOINTS[bp] && (bp === "2xl" || width < BREAKPOINTS[getNextBreakpoint(bp)]);
    },
    [width]
  );

  return {
    current: getCurrentBreakpoint(),
    isAbove,
    isBelow,
    is,
    width,
  };
}

function getNextBreakpoint(bp: Breakpoint): number {
  const keys = Object.keys(BREAKPOINTS) as Breakpoint[];
  const idx = keys.indexOf(bp);
  if (idx < keys.length - 1) {
    return BREAKPOINTS[keys[idx + 1]];
  }
  return Infinity;
}

// ─── useContainerQuery ───

interface ContainerQueryResult {
  /** Ref to attach to the container element */
  ref: RefObject<HTMLElement | null>;
  /** Current width of the container */
  width: number;
  /** Current height of the container */
  height: number;
  /** Whether the container matches a given min-width */
  isAbove: (width: number) => boolean;
  /** Whether the container matches a given max-width */
  isBelow: (width: number) => boolean;
}

/**
 * Hook for container query-like responsive behavior.
 *
 * Uses ResizeObserver to track a container element's dimensions,
 * enabling component-level responsive design independent of viewport.
 *
 * @example
 * ```tsx
 * const { ref, width, isAbove } = useContainerQuery();
 * return <div ref={ref}>{isAbove(768) ? <DesktopLayout /> : <MobileLayout />}</div>;
 * ```
 */
export function useContainerQuery(): ContainerQueryResult {
  const ref = useRef<HTMLElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width: Math.round(width), height: Math.round(height) });
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const isAbove = useCallback(
    (w: number) => dimensions.width >= w,
    [dimensions.width]
  );

  const isBelow = useCallback(
    (w: number) => dimensions.width < w,
    [dimensions.width]
  );

  return {
    ref,
    width: dimensions.width,
    height: dimensions.height,
    isAbove,
    isBelow,
  };
}

// ─── useOrientation ───

type Orientation = "portrait" | "landscape";

interface OrientationResult {
  /** Current orientation */
  orientation: Orientation;
  /** Whether the device is in portrait mode */
  isPortrait: boolean;
  /** Whether the device is in landscape mode */
  isLandscape: boolean;
}

/**
 * Hook for detecting device orientation.
 *
 * @example
 * ```tsx
 * const { isLandscape } = useOrientation();
 * ```
 */
export function useOrientation(): OrientationResult {
  const [orientation, setOrientation] = useState<Orientation>(() => {
    if (typeof window === "undefined") return "portrait";
    return window.innerHeight > window.innerWidth ? "portrait" : "landscape";
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: portrait)");
    const handler = (e: MediaQueryListEvent) => {
      setOrientation(e.matches ? "portrait" : "landscape");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return {
    orientation,
    isPortrait: orientation === "portrait",
    isLandscape: orientation === "landscape",
  };
}

// ─── useDeviceDetect ───

interface DeviceInfo {
  /** Whether the device is likely a mobile device */
  isMobile: boolean;
  /** Whether the device is likely a tablet */
  isTablet: boolean;
  /** Whether the device is likely a desktop */
  isDesktop: boolean;
  /** Whether the device supports touch */
  hasTouch: boolean;
  /** Whether the device is likely an iOS device */
  isIOS: boolean;
  /** Whether the device is likely an Android device */
  isAndroid: boolean;
  /** Whether the device is likely a Mac */
  isMac: boolean;
  /** Whether the device is likely Windows */
  isWindows: boolean;
  /** User agent string */
  userAgent: string;
}

/**
 * Hook for detecting device type and capabilities.
 *
 * Provides information about the user's device including
 * mobile/tablet/desktop detection, touch support, and OS detection.
 *
 * @example
 * ```tsx
 * const { isMobile, hasTouch } = useDeviceDetect();
 * ```
 */
export function useDeviceDetect(): DeviceInfo {
  const [deviceInfo] = useState<DeviceInfo>(() => getDeviceInfo());

  return deviceInfo;
}

function getDeviceInfo(): DeviceInfo {
  if (typeof window === "undefined") {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      hasTouch: false,
      isIOS: false,
      isAndroid: false,
      isMac: false,
      isWindows: false,
      userAgent: "",
    };
  }

  const ua = navigator.userAgent;

  const isIOS = /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const isAndroid = /Android/.test(ua);

  const isMac = /Mac OS X/.test(ua) && !isIOS;
  const isWindows = /Windows/.test(ua);

  const hasTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    (window.matchMedia?.("(pointer: coarse)")?.matches ?? false);

  const isMobile = /Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
    (window.innerWidth < 768 && hasTouch);

  const isTablet =
    /iPad|Android(?!.*Mobile)/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
    (window.innerWidth >= 768 && window.innerWidth < 1024 && hasTouch);

  const isDesktop = !isMobile && !isTablet;

  return {
    isMobile,
    isTablet,
    isDesktop,
    hasTouch,
    isIOS,
    isAndroid,
    isMac,
    isWindows,
    userAgent: ua,
  };
}

// ─── useTouchDetection ───

interface TouchDetectionResult {
  /** Whether the device supports touch */
  hasTouch: boolean;
  /** Whether the primary input is touch (coarse pointer) */
  isTouchPrimary: boolean;
  /** Whether the primary input is a mouse/trackpad (fine pointer) */
  isMousePrimary: boolean;
  /** Whether the device supports hover */
  canHover: boolean;
}

/**
 * Hook for detailed touch and pointer capability detection.
 *
 * Uses CSS media queries (pointer and hover) to detect
 * the primary input method and hover capability.
 *
 * @example
 * ```tsx
 * const { isTouchPrimary, canHover } = useTouchDetection();
 * ```
 */
export function useTouchDetection(): TouchDetectionResult {
  const [touchInfo, setTouchInfo] = useState<TouchDetectionResult>(() =>
    detectTouch()
  );

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const fine = window.matchMedia("(pointer: fine)");
    const hover = window.matchMedia("(hover: hover)");

    const handler = () => {
      setTouchInfo(detectTouch());
    };

    coarse.addEventListener("change", handler);
    fine.addEventListener("change", handler);
    hover.addEventListener("change", handler);

    return () => {
      coarse.removeEventListener("change", handler);
      fine.removeEventListener("change", handler);
      hover.removeEventListener("change", handler);
    };
  }, []);

  return touchInfo;
}

function detectTouch(): TouchDetectionResult {
  if (typeof window === "undefined") {
    return {
      hasTouch: false,
      isTouchPrimary: false,
      isMousePrimary: true,
      canHover: true,
    };
  }

  const coarse = window.matchMedia("(pointer: coarse)");
  const hover = window.matchMedia("(hover: hover)");
  const anyHover = window.matchMedia("(any-hover: hover)");

  return {
    hasTouch:
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      coarse.matches,
    isTouchPrimary: coarse.matches,
    isMousePrimary: window.matchMedia("(pointer: fine)").matches,
    canHover: hover.matches || anyHover.matches,
  };
}

// ─── useViewportSize ───

interface ViewportSize {
  width: number;
  height: number;
}

/**
 * Hook for tracking viewport dimensions.
 *
 * @example
 * ```tsx
 * const { width, height } = useViewportSize();
 * ```
 */
export function useViewportSize(): ViewportSize {
  const [size, setSize] = useState<ViewportSize>(() =>
    typeof window !== "undefined"
      ? { width: window.innerWidth, height: window.innerHeight }
      : { width: 0, height: 0 }
  );

  useEffect(() => {
    let rafId: number;

    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      });
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return size;
}
