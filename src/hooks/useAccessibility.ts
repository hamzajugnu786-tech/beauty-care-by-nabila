"use client";

import {
  useEffect,
  useRef,
  useCallback,
  useState,
  type RefObject,
} from "react";
import {
  getFocusableElements,
  isEscape,
  isArrowKey,
  arrowDirection,
  getNextIndex,
  KEYS,
  type AriaLivePoliteness,
  meetsContrastStandard,
  announce as announceToDom,
} from "@/lib/accessibility";

// ─── useFocusTrap ───

interface UseFocusTrapOptions {
  /** Whether the focus trap is active */
  active: boolean;
  /** Called when Escape is pressed */
  onEscape?: () => void;
  /** Whether to auto-focus the first element on activation */
  autoFocus?: boolean;
  /** Whether to restore focus on deactivation */
  restoreFocus?: boolean;
}

/**
 * Hook for trapping focus within a container element.
 *
 * Implements the WAI-ARIA dialog focus management pattern:
 * - Tab and Shift+Tab cycle through focusable elements within the container
 * - Escape key triggers the onEscape callback
 * - First focusable element is auto-focused on activation
 * - Focus is restored to the previously active element on deactivation
 *
 * @example
 * ```tsx
 * const trapRef = useFocusTrap({ active: isOpen, onEscape: () => setOpen(false) });
 * return <div ref={trapRef}>...</div>;
 * ```
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>({
  active,
  onEscape,
  autoFocus = true,
  restoreFocus = true,
}: UseFocusTrapOptions): RefObject<T | null> {
  const containerRef = useRef<T | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Save previously focused element when trap activates
  useEffect(() => {
    if (active) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [active]);

  // Restore focus when trap deactivates
  useEffect(() => {
    if (!active && restoreFocus && previousFocusRef.current) {
      const el = previousFocusRef.current;
      const timer = setTimeout(() => {
        if (el && typeof el.focus === "function") {
          el.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [active, restoreFocus]);

  // Auto-focus first element on activation
  useEffect(() => {
    if (active && autoFocus && containerRef.current) {
      const timer = setTimeout(() => {
        if (!containerRef.current) return;
        const focusable = getFocusableElements(containerRef.current);
        if (focusable.length > 0) {
          focusable[0].focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [active, autoFocus]);

  // Handle keyboard events
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEscape(event)) {
        event.preventDefault();
        event.stopPropagation();
        onEscape?.();
        return;
      }

      if (event.key === KEYS.TAB && containerRef.current) {
        const focusable = getFocusableElements(containerRef.current);
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const activeEl = document.activeElement;

        if (event.shiftKey) {
          if (activeEl === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (activeEl === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [active, onEscape]);

  return containerRef as RefObject<T | null>;
}

// ─── useFocusManager (Roving Tabindex) ───

interface UseFocusManagerOptions {
  /** Whether to wrap around at the end of the list */
  wrap?: boolean;
  /** Direction of navigation: vertical (up/down) or horizontal (left/right) */
  orientation?: "vertical" | "horizontal" | "both";
  /** Called when the active index changes */
  onIndexChange?: (index: number) => void;
  /** Initial active index */
  initialIndex?: number;
}

/**
 * Hook for managing roving tabindex pattern.
 *
 * Implements the WAI-ARIA roving tabindex pattern where only one element
 * in a group has tabindex="0" (the active one) and all others have tabindex="-1".
 * Arrow keys move focus between items.
 *
 * @example
 * ```tsx
 * const { activeIndex, containerProps, getItemProps } = useFocusManager({
 *   itemCount: items.length,
 *   orientation: "horizontal",
 * });
 * ```
 */
export function useFocusManager({
  itemCount,
  wrap = true,
  orientation = "horizontal",
  onIndexChange,
  initialIndex = 0,
}: UseFocusManagerOptions & { itemCount: number }) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLElement | null>(null);

  const setActive = useCallback(
    (index: number) => {
      setActiveIndex(index);
      onIndexChange?.(index);

      // Focus the new active item
      if (containerRef.current) {
        const items = containerRef.current.querySelectorAll(
          '[role="tab"], [role="option"], [role="menuitem"], [role="listitem"], [role="treeitem"], [data-focus-item]'
        );
        const item = items[index] as HTMLElement | undefined;
        if (item) {
          item.focus();
        }
      }
    },
    [onIndexChange]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isArrowKey(event.nativeEvent) && event.key !== KEYS.HOME && event.key !== KEYS.END) {
        return;
      }

      event.preventDefault();

      if (event.key === KEYS.HOME) {
        setActive(0);
        return;
      }

      if (event.key === KEYS.END) {
        setActive(itemCount - 1);
        return;
      }

      const direction = arrowDirection(event.nativeEvent);
      if (!direction) return;

      const isVertical =
        orientation === "vertical" ||
        (orientation === "both" && (direction === "up" || direction === "down"));
      const isHorizontal =
        orientation === "horizontal" ||
        (orientation === "both" && (direction === "left" || direction === "right"));

      if (
        (isVertical && (direction === "up" || direction === "down")) ||
        (isHorizontal && (direction === "left" || direction === "right"))
      ) {
        const nextDirection =
          direction === "down" || direction === "right" ? "next" : "previous";
        const nextIndex = getNextIndex(activeIndex, itemCount, nextDirection, wrap);
        setActive(nextIndex);
      }
    },
    [activeIndex, itemCount, orientation, wrap, setActive]
  );

  const containerProps = {
    ref: containerRef,
    onKeyDown: handleKeyDown,
    role: "group" as const,
  };

  const getItemProps = (index: number) => ({
    tabIndex: index === activeIndex ? 0 : -1,
    "data-focus-item": true,
    onClick: () => setActive(index),
    onFocus: () => setActiveIndex(index),
  });

  return {
    activeIndex,
    setActiveIndex: setActive,
    containerProps,
    getItemProps,
  };
}

// ─── useAriaAnnouncer ───

/**
 * Hook for making screen reader announcements via ARIA live regions.
 *
 * Provides methods to announce messages politely (waits for current speech)
 * or assertively (interrupts current speech).
 *
 * @example
 * ```tsx
 * const { announce } = useAriaAnnouncer();
 * announce("Form submitted successfully");
 * ```
 */
export function useAriaAnnouncer() {
  const politeRef = useRef<HTMLDivElement | null>(null);
  const assertiveRef = useRef<HTMLDivElement | null>(null);
  const politeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const assertiveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Create live regions on mount if they don't exist
  useEffect(() => {
    const createRegion = (
      id: string,
      politeness: AriaLivePoliteness
    ): HTMLDivElement => {
      let el = document.getElementById(id) as HTMLDivElement | null;
      if (!el) {
        el = document.createElement("div");
        el.id = id;
        el.setAttribute("role", politeness === "assertive" ? "alert" : "status");
        el.setAttribute("aria-live", politeness);
        el.setAttribute("aria-atomic", "true");
        el.setAttribute("aria-relevant", "additions text");
        Object.assign(el.style, {
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: "0",
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: "0",
        });
        document.body.appendChild(el);
      }
      return el;
    };

    politeRef.current = createRegion("a11y-hook-polite", "polite");
    assertiveRef.current = createRegion("a11y-hook-assertive", "assertive");

    return () => {
      // Clean up timers
      if (politeTimerRef.current) clearTimeout(politeTimerRef.current);
      if (assertiveTimerRef.current) clearTimeout(assertiveTimerRef.current);
    };
  }, []);

  const announce = useCallback(
    (message: string, politeness: AriaLivePoliteness = "polite") => {
      const ref = politeness === "assertive" ? assertiveRef : politeRef;
      const timerRef = politeness === "assertive" ? assertiveTimerRef : politeTimerRef;

      if (!ref.current) return;

      // Clear existing timer
      if (timerRef.current) clearTimeout(timerRef.current);

      // Clear and set (forces re-announcement)
      ref.current.textContent = "";
      requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.textContent = message;
        }
      });

      // Auto-clear after 5 seconds
      timerRef.current = setTimeout(() => {
        if (ref.current) {
          ref.current.textContent = "";
        }
      }, 5000);
    },
    []
  );

  return {
    /** Announce a message (default: polite) */
    announce,
    /** Announce politely (waits for current speech) */
    announcePolite: useCallback(
      (message: string) => announce(message, "polite"),
      [announce]
    ),
    /** Announce assertively (interrupts current speech) */
    announceAssertive: useCallback(
      (message: string) => announce(message, "assertive"),
      [announce]
    ),
  };
}

// ─── useKeyboardNavigation ───

interface UseKeyboardNavigationOptions {
  /** Called when Enter or Space is pressed */
  onActivate?: () => void;
  /** Called when Escape is pressed */
  onEscape?: () => void;
  /** Called when an arrow key is pressed */
  onArrow?: (direction: "up" | "down" | "left" | "right") => void;
  /** Called when Home is pressed */
  onHome?: () => void;
  /** Called when End is pressed */
  onEnd?: () => void;
  /** Whether to prevent default behavior on handled keys */
  preventDefault?: boolean;
}

/**
 * Hook for handling keyboard navigation in custom interactive components.
 *
 * Maps keyboard events to semantic actions, making custom components
 * keyboard-accessible per WAI-ARIA patterns.
 *
 * @example
 * ```tsx
 * const keyboardProps = useKeyboardNavigation({
 *   onActivate: () => handleClick(),
 *   onArrow: (dir) => handleDirection(dir),
 * });
 * return <div {...keyboardProps} role="button" tabIndex={0}>...</div>;
 * ```
 */
export function useKeyboardNavigation({
  onActivate,
  onEscape,
  onArrow,
  onHome,
  onEnd,
  preventDefault = true,
}: UseKeyboardNavigationOptions) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case KEYS.ENTER:
        case KEYS.SPACE:
          if (preventDefault) event.preventDefault();
          onActivate?.();
          break;

        case KEYS.ESCAPE:
          if (preventDefault) event.preventDefault();
          onEscape?.();
          break;

        case KEYS.ARROW_UP:
        case KEYS.ARROW_DOWN:
        case KEYS.ARROW_LEFT:
        case KEYS.ARROW_RIGHT: {
          if (preventDefault) event.preventDefault();
          const dir = arrowDirection(event.nativeEvent);
          if (dir) onArrow?.(dir);
          break;
        }

        case KEYS.HOME:
          if (preventDefault) event.preventDefault();
          onHome?.();
          break;

        case KEYS.END:
          if (preventDefault) event.preventDefault();
          onEnd?.();
          break;
      }
    },
    [onActivate, onEscape, onArrow, onHome, onEnd, preventDefault]
  );

  return {
    onKeyDown: handleKeyDown,
    tabIndex: 0,
    role: "button" as const,
  };
}

// ─── useReducedMotion ───

/**
 * Hook for detecting the user's prefers-reduced-motion setting.
 *
 * Returns true if the user has enabled "reduce motion" in their
 * operating system accessibility settings. Use this to disable or
 * simplify animations for users who may be sensitive to motion.
 *
 * WCAG 2.1 SC 2.3.3: Animation from Interactions (Level AAA)
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 * const animation = prefersReducedMotion ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 } };
 * ```
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

// ─── useColorContrast ───

interface ContrastResult {
  /** The calculated contrast ratio */
  ratio: number;
  /** Whether the combination meets WCAG AA for normal text (4.5:1) */
  aaNormal: boolean;
  /** Whether the combination meets WCAG AA for large text (3:1) */
  aaLarge: boolean;
  /** Whether the combination meets WCAG AAA for normal text (7:1) */
  aaaNormal: boolean;
  /** Whether the combination meets WCAG AAA for large text (4.5:1) */
  aaaLarge: boolean;
}

/**
 * Hook for checking color contrast ratios against WCAG standards.
 *
 * @example
 * ```tsx
 * const contrast = useColorContrast("#F8F5F0", "#0C0C10");
 * // contrast.ratio = 17.28
 * // contrast.aaNormal = true
 * ```
 */
export function useColorContrast(
  foreground: string,
  background: string
): ContrastResult {
  const [result, setResult] = useState<ContrastResult>(() =>
    calculateContrast(foreground, background)
  );

  useEffect(() => {
    setResult(calculateContrast(foreground, background));
  }, [foreground, background]);

  return result;
}

function calculateContrast(foreground: string, background: string): ContrastResult {
  const aa = meetsContrastStandard(foreground, background, "AA", false);
  const aaLarge = meetsContrastStandard(foreground, background, "AA", true);
  const aaa = meetsContrastStandard(foreground, background, "AAA", false);
  const aaaLarge = meetsContrastStandard(foreground, background, "AAA", true);

  return {
    ratio: aa.ratio,
    aaNormal: aa.passes,
    aaLarge: aaLarge.passes,
    aaaNormal: aaa.passes,
    aaaLarge: aaaLarge.passes,
  };
}

// ─── useFocusVisible ───

/**
 * Hook for detecting keyboard-based focus (focus-visible).
 *
 * Returns true when focus was triggered by keyboard (Tab key),
 * not by mouse click. Use this to show focus rings only for
 * keyboard users, reducing visual noise for mouse users.
 *
 * @example
 * ```tsx
 * const isFocusVisible = useFocusVisible();
 * return <button className={isFocusVisible ? "ring-2" : ""}>Click me</button>;
 * ```
 */
export function useFocusVisible(): boolean {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KEYS.TAB) {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("touchstart", handleMouseDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("touchstart", handleMouseDown);
    };
  }, []);

  return isKeyboardUser;
}
