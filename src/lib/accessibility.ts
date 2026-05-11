/**
 * Accessibility Utilities
 *
 * Comprehensive accessibility helpers following WCAG 2.1 AA standards.
 * Provides ARIA label generators, keyboard event helpers, focus management,
 * screen reader text helpers, role definitions, tab index calculations,
 * live region management, color contrast ratio calculations, and semantic HTML helpers.
 */

// ─── Constants ───

/** Brand colors for contrast checking */
export const BRAND_COLORS = {
  matteBlack: "#0C0C10",
  champagneGold: "#D4AF37",
  ivory: "#F8F5F0",
  warmBeige: "#DCC7AA",
  darkSurface: "#141418",
  darkCard: "#1C1C22",
  darkElevated: "#24242C",
  goldMuted: "#A68B2A",
  goldLight: "#E8D48B",
  goldDark: "#8B7420",
  textPrimary: "#F8F5F0",
  textMuted: "#9A9498",
  borderGold: "#3D3520",
} as const;

/** WCAG contrast ratio thresholds */
export const CONTRAST_THRESHOLDS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3,
  AAA_NORMAL: 7,
  AAA_LARGE: 4.5,
} as const;

/** Large text threshold (in CSS pixels) */
export const LARGE_TEXT_THRESHOLD = 18; // 14pt bold or 18pt regular

/** Keyboard key constants */
export const KEYS = {
  TAB: "Tab",
  ENTER: "Enter",
  ESCAPE: "Escape",
  SPACE: " ",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  HOME: "Home",
  END: "End",
  PAGE_UP: "PageUp",
  PAGE_DOWN: "PageDown",
  DELETE: "Delete",
  BACKSPACE: "Backspace",
} as const;

/** ARIA role definitions for common interactive patterns */
export const ARIA_ROLES = {
  BUTTON: "button",
  LINK: "link",
  NAVIGATION: "navigation",
  MAIN: "main",
  BANNER: "banner",
  CONTENT_INFO: "contentinfo",
  COMPLEMENTARY: "complementary",
  DIALOG: "dialog",
  ALERTDIALOG: "alertdialog",
  ALERT: "alert",
  STATUS: "status",
  LOG: "log",
  TABLIST: "tablist",
  TAB: "tab",
  TABPANEL: "tabpanel",
  MENU: "menu",
  MENUBAR: "menubar",
  MENUITEM: "menuitem",
  LISTBOX: "listbox",
  OPTION: "option",
  COMBOBOX: "combobox",
  TREE: "tree",
  TREEITEM: "treeitem",
  GRID: "grid",
  GRIDCELL: "gridcell",
  ROW: "row",
  RADIOGROUP: "radiogroup",
  RADIO: "radio",
  CHECKBOX: "checkbox",
  SWITCH: "switch",
  SLIDER: "slider",
  SPINBUTTON: "spinbutton",
  PROGRESSBAR: "progressbar",
  TOOLTIP: "tooltip",
  REGION: "region",
  SEARCH: "search",
  FORM: "form",
  GROUP: "group",
  SEPARATOR: "separator",
  HEADING: "heading",
  LIST: "list",
  LISTITEM: "listitem",
  FIGURE: "figure",
  IMG: "img",
  ARTICLE: "article",
  FEED: "feed",
  METER: "meter",
  TIMER: "timer",
  MARQUEE: "marquee",
  NOTE: "note",
} as const;

// ─── Color Contrast Utilities ───

/**
 * Parse a hex color string into RGB components.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace(/^#/, "");
  const match = clean.match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!match) return null;
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
}

/**
 * Calculate the relative luminance of an RGB color per WCAG 2.1.
 * @see https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate the contrast ratio between two colors.
 * Returns a value between 1 and 21.
 * @see https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function contrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return 1;

  const l1 = relativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = relativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a color combination meets WCAG contrast requirements.
 */
export function meetsContrastStandard(
  foreground: string,
  background: string,
  level: "AA" | "AAA" = "AA",
  isLargeText = false
): { passes: boolean; ratio: number; required: number } {
  const ratio = contrastRatio(foreground, background);
  let required: number;

  if (level === "AAA") {
    required = isLargeText ? CONTRAST_THRESHOLDS.AAA_LARGE : CONTRAST_THRESHOLDS.AAA_NORMAL;
  } else {
    required = isLargeText ? CONTRAST_THRESHOLDS.AA_LARGE : CONTRAST_THRESHOLDS.AA_NORMAL;
  }

  return { passes: ratio >= required, ratio: Math.round(ratio * 100) / 100, required };
}

/**
 * Audit all brand color combinations for contrast compliance.
 */
export function auditBrandContrast(): Array<{
  foreground: string;
  background: string;
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
}> {
  const fgColors = [
    { name: "ivory", hex: BRAND_COLORS.ivory },
    { name: "champagneGold", hex: BRAND_COLORS.champagneGold },
    { name: "textMuted", hex: BRAND_COLORS.textMuted },
    { name: "goldMuted", hex: BRAND_COLORS.goldMuted },
    { name: "warmBeige", hex: BRAND_COLORS.warmBeige },
    { name: "goldLight", hex: BRAND_COLORS.goldLight },
  ];

  const bgColors = [
    { name: "matteBlack", hex: BRAND_COLORS.matteBlack },
    { name: "darkSurface", hex: BRAND_COLORS.darkSurface },
    { name: "darkCard", hex: BRAND_COLORS.darkCard },
    { name: "darkElevated", hex: BRAND_COLORS.darkElevated },
  ];

  return fgColors.flatMap((fg) =>
    bgColors.map((bg) => {
      const ratio = contrastRatio(fg.hex, bg.hex);
      return {
        foreground: `${fg.name} (${fg.hex})`,
        background: `${bg.name} (${bg.hex})`,
        ratio: Math.round(ratio * 100) / 100,
        aaNormal: ratio >= CONTRAST_THRESHOLDS.AA_NORMAL,
        aaLarge: ratio >= CONTRAST_THRESHOLDS.AA_LARGE,
        aaaNormal: ratio >= CONTRAST_THRESHOLDS.AAA_NORMAL,
        aaaLarge: ratio >= CONTRAST_THRESHOLDS.AAA_LARGE,
      };
    })
  );
}

// ─── ARIA Label Generators ───

/**
 * Generate an accessible label for a navigation section.
 */
export function navLabel(section: string): string {
  return `${section} navigation`;
}

/**
 * Generate an accessible label for a landmark region.
 */
export function regionLabel(name: string): string {
  return name;
}

/**
 * Generate an accessible label for a form field with optional error.
 */
export function fieldLabel(label: string, error?: string, required?: boolean): string {
  let result = label;
  if (required) result += ", required";
  if (error) result += `. Error: ${error}`;
  return result;
}

/**
 * Generate an accessible description for a progress indicator.
 */
export function progressLabel(current: number, total: number, label?: string): string {
  const prefix = label ? `${label}. ` : "";
  return `${prefix}Step ${current} of ${total}`;
}

/**
 * Generate an accessible label for a rating value.
 */
export function ratingLabel(value: number, max: number = 5): string {
  return `${value} out of ${max} stars`;
}

/**
 * Generate an accessible label for a price range or value.
 */
export function priceLabel(price: string, label?: string): string {
  return label ? `${label}: ${price}` : price;
}

/**
 * Generate an accessible label for an image with contextual information.
 */
export function imageLabel(alt: string, context?: string): string {
  return context ? `${alt}. ${context}` : alt;
}

/**
 * Generate an accessible label for a button that opens/closes a section.
 */
export function toggleLabel(action: string, target: string, isOpen?: boolean): string {
  const state = isOpen !== undefined ? (isOpen ? "close" : "open") : "toggle";
  return `${action} ${target}, ${state}`;
}

/**
 * Generate a description for a booking step.
 */
export function bookingStepLabel(step: number, title: string, total: number): string {
  return `Step ${step} of ${total}: ${title}`;
}

/**
 * Generate a validation announcement.
 */
export function validationAnnouncement(field: string, message: string, isValid: boolean): string {
  return isValid
    ? `${field} is valid`
    : `${field} error: ${message}`;
}

// ─── Keyboard Event Helpers ───

/**
 * Check if a keyboard event matches a specific key.
 */
export function isKey(event: KeyboardEvent, key: string): boolean {
  return event.key === key;
}

/**
 * Check if the event is a Tab key press.
 */
export function isTab(event: KeyboardEvent): boolean {
  return event.key === KEYS.TAB;
}

/**
 * Check if the event is an Enter key press.
 */
export function isEnter(event: KeyboardEvent): boolean {
  return event.key === KEYS.ENTER;
}

/**
 * Check if the event is an Escape key press.
 */
export function isEscape(event: KeyboardEvent): boolean {
  return event.key === KEYS.ESCAPE;
}

/**
 * Check if the event is a Space key press.
 */
export function isSpace(event: KeyboardEvent): boolean {
  return event.key === KEYS.SPACE;
}

/**
 * Check if the event is an arrow key press.
 */
export function isArrowKey(event: KeyboardEvent): boolean {
  return [
    KEYS.ARROW_UP,
    KEYS.ARROW_DOWN,
    KEYS.ARROW_LEFT,
    KEYS.ARROW_RIGHT,
  ].includes(event.key as typeof KEYS.ARROW_UP);
}

/**
 * Check if the event is a navigation key (arrows, home, end, etc.).
 */
export function isNavigationKey(event: KeyboardEvent): boolean {
  return [
    KEYS.ARROW_UP,
    KEYS.ARROW_DOWN,
    KEYS.ARROW_LEFT,
    KEYS.ARROW_RIGHT,
    KEYS.HOME,
    KEYS.END,
    KEYS.PAGE_UP,
    KEYS.PAGE_DOWN,
  ].includes(event.key as typeof KEYS.HOME);
}

/**
 * Check if the event is an activation key (Enter or Space).
 */
export function isActivationKey(event: KeyboardEvent): boolean {
  return event.key === KEYS.ENTER || event.key === KEYS.SPACE;
}

/**
 * Check if Shift+Tab was pressed (reverse tab).
 */
export function isShiftTab(event: KeyboardEvent): boolean {
  return event.key === KEYS.TAB && event.shiftKey;
}

/**
 * Get the direction of arrow key navigation.
 */
export function arrowDirection(event: KeyboardEvent): "up" | "down" | "left" | "right" | null {
  switch (event.key) {
    case KEYS.ARROW_UP: return "up";
    case KEYS.ARROW_DOWN: return "down";
    case KEYS.ARROW_LEFT: return "left";
    case KEYS.ARROW_RIGHT: return "right";
    default: return null;
  }
}

// ─── Focus Management Utilities ───

/** Selector for all focusable elements */
export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  'details > summary',
  'audio[controls]',
  'video[controls]',
].join(", ");

/**
 * Get all focusable elements within a container.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = container.querySelectorAll(FOCUSABLE_SELECTOR);
  return Array.from(elements).filter((el) => {
    if (!(el instanceof HTMLElement)) return false;
    return isFocusable(el);
  }) as HTMLElement[];
}

/**
 * Check if an element is currently focusable.
 */
export function isFocusable(element: HTMLElement): boolean {
  if (element.hasAttribute("disabled")) return false;
  if (element.getAttribute("tabIndex") === "-1") return false;
  if (element.getAttribute("aria-hidden") === "true") return false;

  const style = window.getComputedStyle(element);
  if (style.display === "none") return false;
  if (style.visibility === "hidden") return false;

  // Check if element is hidden by a parent
  let parent = element.parentElement;
  while (parent) {
    const parentStyle = window.getComputedStyle(parent);
    if (parentStyle.display === "none" || parentStyle.visibility === "hidden") return false;
    if (parent.getAttribute("aria-hidden") === "true") return false;
    parent = parent.parentElement;
  }

  return true;
}

/**
 * Focus the first focusable element within a container.
 */
export function focusFirst(container: HTMLElement): HTMLElement | null {
  const focusable = getFocusableElements(container);
  if (focusable.length > 0) {
    focusable[0].focus();
    return focusable[0];
  }
  return null;
}

/**
 * Focus the last focusable element within a container.
 */
export function focusLast(container: HTMLElement): HTMLElement | null {
  const focusable = getFocusableElements(container);
  if (focusable.length > 0) {
    focusable[focusable.length - 1].focus();
    return focusable[focusable.length - 1];
  }
  return null;
}

/**
 * Save the currently focused element for later restoration.
 */
export function saveFocus(): (() => void) | null {
  const activeElement = document.activeElement;
  if (activeElement instanceof HTMLElement) {
    return () => activeElement.focus();
  }
  return null;
}

/**
 * Restore focus to a previously saved element.
 */
export function restoreFocus(restoreFn: (() => void) | null): void {
  if (restoreFn) {
    restoreFn();
  }
}

// ─── Tab Index Calculations ───

/**
 * Calculate the roving tabindex for a list of items.
 * Only the active/selected item gets tabindex="0", others get tabindex="-1".
 */
export function rovingTabIndex(
  items: HTMLElement[],
  activeIndex: number
): void {
  items.forEach((item, index) => {
    item.setAttribute("tabindex", index === activeIndex ? "0" : "-1");
  });
}

/**
 * Get the next index for roving tabindex (wrapping).
 */
export function getNextIndex(
  current: number,
  total: number,
  direction: "next" | "previous",
  wrap = true
): number {
  if (direction === "next") {
    if (current < total - 1) return current + 1;
    return wrap ? 0 : current;
  } else {
    if (current > 0) return current - 1;
    return wrap ? total - 1 : current;
  }
}

/**
 * Get the next index for horizontal navigation (left/right arrows).
 * In LTR layouts, right = next, left = previous.
 */
export function getHorizontalNextIndex(
  current: number,
  total: number,
  arrowKey: "ArrowLeft" | "ArrowRight",
  wrap = true
): number {
  return getNextIndex(
    current,
    total,
    arrowKey === "ArrowRight" ? "next" : "previous",
    wrap
  );
}

/**
 * Get the next index for vertical navigation (up/down arrows).
 * Down = next, Up = previous.
 */
export function getVerticalNextIndex(
  current: number,
  total: number,
  arrowKey: "ArrowUp" | "ArrowDown",
  wrap = true
): number {
  return getNextIndex(
    current,
    total,
    arrowKey === "ArrowDown" ? "next" : "previous",
    wrap
  );
}

// ─── Live Region Management ───

/** Live region politeness settings */
export type AriaLivePoliteness = "polite" | "assertive" | "off";

/**
 * Create a live region element for screen reader announcements.
 */
export function createLiveRegion(
  politeness: AriaLivePoliteness = "polite",
  id?: string
): HTMLDivElement {
  const region = document.createElement("div");
  region.setAttribute("role", "status");
  region.setAttribute("aria-live", politeness);
  region.setAttribute("aria-atomic", "true");
  region.setAttribute("aria-relevant", "additions text");
  if (id) region.id = id;

  // Visually hidden styles
  Object.assign(region.style, {
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

  return region;
}

/**
 * Announce a message to screen readers via a live region.
 */
export function announce(
  message: string,
  politeness: AriaLivePoliteness = "polite"
): void {
  // Find existing live region or create one
  let region = document.getElementById(
    politeness === "assertive"
      ? "a11y-announce-assertive"
      : "a11y-announce-polite"
  );

  if (!region) {
    region = createLiveRegion(
      politeness,
      politeness === "assertive"
        ? "a11y-announce-assertive"
        : "a11y-announce-polite"
    );
    document.body.appendChild(region);
  }

  // Clear and set the message (clearing first forces re-announcement)
  region.textContent = "";
  // Use requestAnimationFrame to ensure the DOM update is processed
  requestAnimationFrame(() => {
    region!.textContent = message;
  });
}

/**
 * Clear all live region announcements.
 */
export function clearAnnouncements(): void {
  const polite = document.getElementById("a11y-announce-polite");
  const assertive = document.getElementById("a11y-announce-assertive");
  if (polite) polite.textContent = "";
  if (assertive) assertive.textContent = "";
}

// ─── Screen Reader Text Helpers ───

/**
 * Create visually hidden text for screen readers.
 * Use with the .sr-only CSS class.
 */
export function srText(text: string): string {
  return text;
}

/**
 * Create a comma-separated list for screen readers.
 * E.g., ["Hair", "Makeup", "Skincare"] -> "Hair, Makeup, and Skincare"
 */
export function listToSrText(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/**
 * Create a description of a time duration for screen readers.
 * E.g., "90 minutes" or "1 hour and 30 minutes"
 */
export function durationToSrText(minutes: number): string {
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} hour${hours !== 1 ? "s" : ""}`;
  return `${hours} hour${hours !== 1 ? "s" : ""} and ${remaining} minute${remaining !== 1 ? "s" : ""}`;
}

/**
 * Create a description of a price for screen readers.
 */
export function priceToSrText(price: string): string {
  // "PKR 85,000" -> "85,000 Pakistani Rupees"
  return price.replace(/^PKR\s*/, "Pakistani Rupees ");
}

/**
 * Create a phone number description for screen readers.
 */
export function phoneToSrText(phone: string): string {
  // Add pauses between segments for clarity
  return phone.replace(/(\d{2,4})/g, "$1. ").trim();
}

// ─── Semantic HTML Helpers ───

/**
 * Common landmark ARIA attributes.
 */
export const landmarkProps = {
  banner: { role: "banner" as const },
  navigation: (label: string) => ({
    role: "navigation" as const,
    "aria-label": label,
  }),
  main: { role: "main" as const },
  contentInfo: { role: "contentinfo" as const },
  complementary: (label: string) => ({
    role: "complementary" as const,
    "aria-label": label,
  }),
  region: (label: string) => ({
    role: "region" as const,
    "aria-label": label,
  }),
  search: { role: "search" as const },
  form: (label: string) => ({
    role: "form" as const,
    "aria-label": label,
  }),
};

/**
 * Generate ARIA attributes for a tab pattern.
 */
export function tabProps(id: string, panelId: string, selected: boolean) {
  return {
    role: "tab" as const,
    id,
    "aria-selected": selected,
    "aria-controls": panelId,
    tabIndex: selected ? 0 : -1,
  };
}

/**
 * Generate ARIA attributes for a tab panel pattern.
 */
export function tabPanelProps(id: string, tabId: string) {
  return {
    role: "tabpanel" as const,
    id,
    "aria-labelledby": tabId,
    tabIndex: 0,
  };
}

/**
 * Generate ARIA attributes for a menu item pattern.
 */
export function menuItemProps(id: string, menuId: string) {
  return {
    role: "menuitem" as const,
    id,
    "aria-ownedBy": menuId,
    tabIndex: -1,
  };
}

/**
 * Generate ARIA attributes for a dialog/modal.
 */
export function dialogProps(id: string, label: string, describedBy?: string) {
  return {
    role: "dialog" as const,
    id,
    "aria-modal": true,
    "aria-label": label,
    ...(describedBy ? { "aria-describedby": describedBy } : {}),
  };
}

/**
 * Generate ARIA attributes for an accordion section.
 */
export function accordionProps(id: string, buttonId: string, expanded: boolean) {
  return {
    role: "region" as const,
    id,
    "aria-labelledby": buttonId,
    "aria-expanded": expanded,
  };
}

/**
 * Generate ARIA attributes for a listbox option.
 */
export function optionProps(id: string, selected: boolean, activeId?: string) {
  return {
    role: "option" as const,
    id,
    "aria-selected": selected,
    ...(activeId ? { "aria-activedescendant": activeId } : {}),
  };
}

/**
 * Generate ARIA attributes for a combobox.
 */
export function comboboxProps(id: string, expanded: boolean, controlsId: string, activeId?: string) {
  return {
    role: "combobox" as const,
    id,
    "aria-expanded": expanded,
    "aria-controls": controlsId,
    "aria-haspopup": "listbox" as const,
    ...(activeId ? { "aria-activedescendant": activeId } : {}),
  };
}

/**
 * Generate ARIA attributes for a tree item.
 */
export function treeItemProps(id: string, expanded?: boolean, level: number = 1) {
  return {
    role: "treeitem" as const,
    id,
    "aria-level": level,
    ...(expanded !== undefined ? { "aria-expanded": expanded } : {}),
  };
}

/**
 * Generate ARIA attributes for a status message.
 */
export function statusProps(id: string) {
  return {
    role: "status" as const,
    id,
    "aria-live": "polite" as const,
    "aria-atomic": true,
  };
}

/**
 * Generate ARIA attributes for an alert.
 */
export function alertProps(id: string) {
  return {
    role: "alert" as const,
    id,
    "aria-live": "assertive" as const,
    "aria-atomic": true,
  };
}
