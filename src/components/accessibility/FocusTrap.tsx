"use client";

import { useEffect, useRef, useCallback, ReactNode } from "react";
import { getFocusableElements, FOCUSABLE_SELECTOR } from "@/lib/accessibility";

interface FocusTrapProps {
  /** Whether the focus trap is active */
  active: boolean;
  /** Child elements to trap focus within */
  children: ReactNode;
  /** Called when Escape is pressed */
  onEscape?: () => void;
  /** Whether to auto-focus the first element on activation (default: true) */
  autoFocus?: boolean;
  /** Whether to restore focus to the previously focused element on deactivation (default: true) */
  restoreFocus?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * FocusTrap Component
 *
 * Traps keyboard focus within a container element, following the WAI-ARIA
 * dialog pattern. Essential for modal dialogs, drawers, and any overlay
 * that should capture keyboard interaction.
 *
 * Features:
 * - Traps Tab and Shift+Tab within the container
 * - Returns focus to the previously focused element on deactivation
 * - Handles Escape key to close the trap
 * - Supports auto-focus on activation
 * - Works with dynamically added focusable elements
 *
 * WCAG 2.1 SC 2.4.3: Focus Order (Level A)
 * WCAG 2.1 SC 2.4.7: Focus Visible (Level AA)
 */
export function FocusTrap({
  active,
  children,
  onEscape,
  autoFocus = true,
  restoreFocus = true,
  className,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Save the previously focused element when trap activates
  useEffect(() => {
    if (active) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
    }
  }, [active]);

  // Restore focus when trap deactivates
  useEffect(() => {
    if (!active && restoreFocus && previouslyFocusedRef.current) {
      const el = previouslyFocusedRef.current;
      // Small delay to ensure DOM is stable
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
        } else {
          // If no focusable elements, focus the container itself
          containerRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [active, autoFocus]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!active) return;

      // Handle Escape key
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onEscape?.();
        return;
      }

      // Handle Tab key (focus trapping)
      if (event.key === "Tab") {
        if (!containerRef.current) return;

        const focusable = getFocusableElements(containerRef.current);
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];
        const activeElement = document.activeElement;

        if (event.shiftKey) {
          // Shift+Tab: if on first element, wrap to last
          if (activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if on last element, wrap to first
          if (activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [active, onEscape]
  );

  return (
    <div
      ref={containerRef}
      className={className}
      onKeyDown={handleKeyDown}
      // Make container itself focusable as a fallback
      tabIndex={-1}
      style={{ outline: "none" }}
    >
      {children}
    </div>
  );
}

/**
 * Sentinel element for focus trapping.
 * Placed at the start/end of a focus trap to catch focus at boundaries.
 */
export function FocusSentinel({
  onFocus,
}: {
  onFocus: () => void;
}) {
  return (
    <div
      tabIndex={0}
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
      }}
      onFocus={onFocus}
      aria-hidden="true"
    />
  );
}
