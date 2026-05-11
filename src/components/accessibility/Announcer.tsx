"use client";

import { createContext, useContext, useCallback, useRef, ReactNode } from "react";

// ─── Types ───

type AriaLivePoliteness = "polite" | "assertive";

interface AnnouncementContextValue {
  /** Announce a message politely (waits for current speech to finish) */
  announcePolite: (message: string) => void;
  /** Announce a message assertively (interrupts current speech) */
  announceAssertive: (message: string) => void;
  /** Clear all pending announcements */
  clearAnnouncements: () => void;
}

// ─── Context ───

const AnnouncementContext = createContext<AnnouncementContextValue | null>(null);

/**
 * Hook to access the announcer context.
 * Must be used within an AnnouncerProvider.
 */
export function useAnnouncer(): AnnouncementContextValue {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error("useAnnouncer must be used within an AnnouncerProvider");
  }
  return context;
}

// ─── Provider ───

interface AnnouncerProviderProps {
  children: ReactNode;
}

/**
 * Announcer Component
 *
 * Provides ARIA live regions for dynamic content announcements to screen readers.
 * Wraps the application and provides an announcement context for any component
 * to broadcast messages.
 *
 * Features:
 * - Polite announcements (waits for screen reader to finish current speech)
 * - Assertive announcements (interrupts current speech immediately)
 * - Screen reader announcements for booking steps
 * - Form validation announcements
 * - Navigation announcements
 * - Automatic clearing of stale announcements
 *
 * Usage:
 * ```tsx
 * <AnnouncerProvider>
 *   <App />
 * </AnnouncerProvider>
 * ```
 *
 * Then in any component:
 * ```tsx
 * const { announcePolite } = useAnnouncer();
 * announcePolite("Booking step 2 of 4: Select your service");
 * ```
 *
 * WCAG 2.1 SC 4.1.3: Status Messages (Level AA)
 */
export function AnnouncerProvider({ children }: AnnouncerProviderProps) {
  const politeRef = useRef<HTMLDivElement>(null);
  const assertiveRef = useRef<HTMLDivElement>(null);
  const politeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const assertiveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const announcePolite = useCallback((message: string) => {
    if (!politeRef.current) return;

    // Clear any existing timer
    if (politeTimerRef.current) {
      clearTimeout(politeTimerRef.current);
    }

    // Clear first to force re-announcement of same message
    politeRef.current.textContent = "";

    // Use requestAnimationFrame to ensure DOM update is processed
    requestAnimationFrame(() => {
      if (politeRef.current) {
        politeRef.current.textContent = message;
      }
    });

    // Auto-clear after 5 seconds to prevent stale announcements
    politeTimerRef.current = setTimeout(() => {
      if (politeRef.current) {
        politeRef.current.textContent = "";
      }
    }, 5000);
  }, []);

  const announceAssertive = useCallback((message: string) => {
    if (!assertiveRef.current) return;

    // Clear any existing timer
    if (assertiveTimerRef.current) {
      clearTimeout(assertiveTimerRef.current);
    }

    // Clear first to force re-announcement
    assertiveRef.current.textContent = "";

    requestAnimationFrame(() => {
      if (assertiveRef.current) {
        assertiveRef.current.textContent = message;
      }
    });

    // Auto-clear after 5 seconds
    assertiveTimerRef.current = setTimeout(() => {
      if (assertiveRef.current) {
        assertiveRef.current.textContent = "";
      }
    }, 5000);
  }, []);

  const clearAnnouncements = useCallback(() => {
    if (politeRef.current) politeRef.current.textContent = "";
    if (assertiveRef.current) assertiveRef.current.textContent = "";
    if (politeTimerRef.current) clearTimeout(politeTimerRef.current);
    if (assertiveTimerRef.current) clearTimeout(assertiveTimerRef.current);
  }, []);

  return (
    <AnnouncementContext.Provider
      value={{ announcePolite, announceAssertive, clearAnnouncements }}
    >
      {children}

      {/* Polite live region */}
      <div
        ref={politeRef}
        id="a11y-announce-polite"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-relevant="additions text"
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
      />

      {/* Assertive live region */}
      <div
        ref={assertiveRef}
        id="a11y-announce-assertive"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        aria-relevant="additions text"
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
      />
    </AnnouncementContext.Provider>
  );
}

// ─── Convenience Announcement Functions ───

/**
 * Create announcement helpers for specific contexts.
 * These are factory functions that return pre-configured announcers.
 */

/** Booking step announcements */
export function createBookingAnnouncer(announce: (msg: string) => void) {
  return {
    stepChange: (step: number, total: number, title: string) =>
      announce(`Booking step ${step} of ${total}: ${title}`),
    stepComplete: (step: number, title: string) =>
      announce(`Step ${step} completed: ${title}. Moving to next step.`),
    bookingComplete: (reference: string) =>
      announce(`Booking confirmed. Your reference number is ${reference}.`),
    bookingError: (message: string) =>
      announce(`Booking error: ${message}`),
    serviceSelected: (service: string) =>
      announce(`Selected service: ${service}`),
    artistSelected: (artist: string) =>
      announce(`Selected artist: ${artist}`),
    dateTimeSelected: (date: string, time: string) =>
      announce(`Selected: ${date} at ${time}`),
  };
}

/** Form validation announcements */
export function createFormAnnouncer(
  announcePolite: (msg: string) => void,
  announceAssertive: (msg: string) => void
) {
  return {
    fieldError: (field: string, message: string) =>
      announceAssertive(`Error in ${field}: ${message}`),
    fieldValid: (field: string) =>
      announcePolite(`${field} is valid`),
    formSubmitted: () =>
      announcePolite("Form submitted successfully"),
    formError: (count: number) =>
      announceAssertive(`Form has ${count} error${count !== 1 ? "s" : ""}. Please review and correct.`),
    requiredField: (field: string) =>
      announceAssertive(`${field} is required`),
  };
}

/** Navigation announcements */
export function createNavigationAnnouncer(announce: (msg: string) => void) {
  return {
    pageChange: (title: string) =>
      announce(`Navigated to ${title}`),
    sectionChange: (section: string) =>
      announce(`${section} section`),
    menuOpen: () =>
      announce("Menu opened. Use arrow keys to navigate, Enter to select, Escape to close."),
    menuClose: () =>
      announce("Menu closed"),
    modalOpen: (title: string) =>
      announce(`${title} dialog opened. Press Escape to close.`),
    modalClose: (title: string) =>
      announce(`${title} dialog closed`),
    tabChange: (tab: string) =>
      announce(`${tab} tab selected`),
  };
}
