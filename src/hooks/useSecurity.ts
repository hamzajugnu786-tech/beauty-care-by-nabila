"use client";

// ─── Client-Side Security Hooks ───
// Provides CSRF token management, rate limiting awareness,
// input sanitization, and secure fetch wrapper

import { useState, useCallback, useRef, useEffect } from "react";

// ─── Input Sanitization (Client-Side) ───

/**
 * Sanitize input by stripping HTML tags and script content
 */
function sanitizeValue(value: string): string {
  if (typeof value !== "string") return "";

  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

/**
 * Recursively sanitize all string values in an object
 */
function sanitizeObject<T>(obj: T): T {
  if (typeof obj === "string") {
    return sanitizeValue(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }

  if (obj && typeof obj === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized as T;
  }

  return obj;
}

// ─── useInputSanitization Hook ───

interface UseInputSanitizationReturn {
  sanitize: (value: string) => string;
  sanitizeObject: <T>(obj: T) => T;
  sanitizeFormData: (formData: FormData) => FormData;
}

/**
 * Hook for sanitizing user input on the client side
 */
export function useInputSanitization(): UseInputSanitizationReturn {
  const sanitize = useCallback((value: string): string => {
    return sanitizeValue(value);
  }, []);

  const sanitizeObj = useCallback(<T,>(obj: T): T => {
    return sanitizeObject(obj);
  }, []);

  const sanitizeFormData = useCallback((formData: FormData): FormData => {
    const sanitized = new FormData();
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        sanitized.append(key, sanitizeValue(value));
      } else {
        sanitized.append(key, value);
      }
    }
    return sanitized;
  }, []);

  return {
    sanitize,
    sanitizeObject: sanitizeObj,
    sanitizeFormData,
  };
}

// ─── CSRF Token Management ───

interface CSRFTokenState {
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for managing CSRF tokens
 */
export function useCSRFToken() {
  const [state, setState] = useState<CSRFTokenState>({
    token: null,
    isLoading: false,
    error: null,
  });

  const fetchToken = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/security/csrf-token");

      if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
      }

      const data = await response.json();
      setState({
        token: data.token,
        isLoading: false,
        error: null,
      });

      return data.token;
    } catch (err) {
      setState({
        token: null,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to fetch CSRF token",
      });
      return null;
    }
  }, []);

  return {
    csrfToken: state.token,
    isLoading: state.isLoading,
    error: state.error,
    fetchToken,
  };
}

// ─── Rate Limit Awareness ───

interface RateLimitState {
  isLimited: boolean;
  remaining: number | null;
  retryAfter: number | null;
  resetAt: number | null;
}

/**
 * Hook for tracking rate limit status
 */
export function useRateLimit() {
  const [state, setState] = useState<RateLimitState>({
    isLimited: false,
    remaining: null,
    retryAfter: null,
    resetAt: null,
  });

  const updateFromHeaders = useCallback((headers: Headers) => {
    const remaining = headers.get("X-RateLimit-Remaining");
    const retryAfter = headers.get("Retry-After");
    const resetAt = headers.get("X-RateLimit-Reset");

    setState({
      isLimited: retryAfter !== null,
      remaining: remaining ? parseInt(remaining, 10) : null,
      retryAfter: retryAfter ? parseInt(retryAfter, 10) : null,
      resetAt: resetAt ? parseInt(resetAt, 10) : null,
    });
  }, []);

  const checkStatus = useCallback(async (routeType?: string) => {
    try {
      const url = routeType
        ? `/api/security/rate-limit?type=${encodeURIComponent(routeType)}`
        : "/api/security/rate-limit";

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setState({
          isLimited: data.isBlocked || false,
          remaining: data.remaining ?? null,
          retryAfter: data.retryAfter ?? null,
          resetAt: data.resetAt ?? null,
        });
        return data;
      }
    } catch {
      // Silently fail - rate limit status is best-effort
    }
    return null;
  }, []);

  return {
    ...state,
    updateFromHeaders,
    checkStatus,
  };
}

// ─── Secure Fetch Wrapper ───

interface SecureFetchOptions extends RequestInit {
  csrfToken?: string;
  sanitizeBody?: boolean;
  expectedStatus?: number[];
}

interface SecureFetchResult<T> {
  data: T | null;
  error: string | null;
  status: number;
  headers: Headers;
  rateLimited: boolean;
  retryAfter: number | null;
}

/**
 * Creates a secure fetch wrapper with CSRF token injection,
 * input sanitization, and rate limit handling
 */
export function useSecureFetch() {
  const csrfTokenRef = useRef<string | null>(null);
  const { updateFromHeaders } = useRateLimit();

  const setCSRFToken = useCallback((token: string) => {
    csrfTokenRef.current = token;
  }, []);

  const secureFetch = useCallback(
    async <T = unknown>(
      url: string,
      options: SecureFetchOptions = {}
    ): Promise<SecureFetchResult<T>> => {
      const {
        csrfToken,
        sanitizeBody = true,
        expectedStatus,
        headers: customHeaders = {},
        body,
        ...restOptions
      } = options;

      // Build headers
      const headers = new Headers(customHeaders as HeadersInit);

      // Add CSRF token
      const token = csrfToken || csrfTokenRef.current;
      if (token && ["POST", "PATCH", "PUT", "DELETE"].includes(restOptions.method || "GET")) {
        headers.set("X-CSRF-Token", token);
      }

      // Set Content-Type for JSON bodies if not already set
      if (body && !headers.has("Content-Type") && typeof body === "string") {
        headers.set("Content-Type", "application/json");
      }

      // Sanitize body if requested
      let processedBody = body;
      if (sanitizeBody && body && typeof body === "string") {
        try {
          const parsed = JSON.parse(body);
          const sanitized = sanitizeObject(parsed);
          processedBody = JSON.stringify(sanitized);
        } catch {
          // If not valid JSON, sanitize as plain string
          processedBody = sanitizeValue(body);
        }
      }

      try {
        const response = await fetch(url, {
          ...restOptions,
          headers,
          body: processedBody,
        });

        // Update rate limit state from response headers
        updateFromHeaders(response.headers);

        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After");
          return {
            data: null,
            error: "Too many requests. Please try again later.",
            status: 429,
            headers: response.headers,
            rateLimited: true,
            retryAfter: retryAfter ? parseInt(retryAfter, 10) : null,
          };
        }

        // Parse response
        let data: T | null = null;
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          data = await response.json();
        }

        // Check for expected status codes
        if (expectedStatus && !expectedStatus.includes(response.status)) {
          return {
            data: null,
            error: (data as any)?.error || `Unexpected response status: ${response.status}`,
            status: response.status,
            headers: response.headers,
            rateLimited: false,
            retryAfter: null,
          };
        }

        // Handle error status codes
        if (!response.ok) {
          return {
            data: null,
            error: (data as any)?.error || `Request failed with status ${response.status}`,
            status: response.status,
            headers: response.headers,
            rateLimited: false,
            retryAfter: null,
          };
        }

        return {
          data,
          error: null,
          status: response.status,
          headers: response.headers,
          rateLimited: false,
          retryAfter: null,
        };
      } catch (err) {
        return {
          data: null,
          error: err instanceof Error ? err.message : "Network error occurred",
          status: 0,
          headers: new Headers(),
          rateLimited: false,
          retryAfter: null,
        };
      }
    },
    [updateFromHeaders]
  );

  return {
    secureFetch,
    setCSRFToken,
  };
}

// ─── Combined Security Hook ───

interface UseSecurityReturn {
  csrf: ReturnType<typeof useCSRFToken>;
  rateLimit: ReturnType<typeof useRateLimit>;
  sanitization: ReturnType<typeof useInputSanitization>;
  secureFetch: ReturnType<typeof useSecureFetch>;
}

/**
 * Combined security hook that provides all security utilities
 */
export function useSecurity(): UseSecurityReturn {
  const csrf = useCSRFToken();
  const rateLimit = useRateLimit();
  const sanitization = useInputSanitization();
  const secureFetchHook = useSecureFetch();

  // Auto-set CSRF token when it is fetched
  useEffect(() => {
    if (csrf.csrfToken) {
      secureFetchHook.setCSRFToken(csrf.csrfToken);
    }
  }, [csrf.csrfToken, secureFetchHook.setCSRFToken]);

  return {
    csrf,
    rateLimit,
    sanitization,
    secureFetch: secureFetchHook,
  };
}
