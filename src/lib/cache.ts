// ─── Caching Strategy ───
// React Query cache configuration, SWR patterns, server-side cache headers,
// ISR revalidation, static generation helpers, and edge caching configuration

// ─── Cache Durations ───

export const CACHE_DURATIONS = {
  /** 1 second - for real-time data */
  ONE_SECOND: 1,
  /** 30 seconds - for frequently updating data */
  THIRTY_SECONDS: 30,
  /** 1 minute - for semi-real-time data */
  ONE_MINUTE: 60,
  /** 5 minutes - for moderately changing data */
  FIVE_MINUTES: 300,
  /** 15 minutes - for slow-changing data */
  FIFTEEN_MINUTES: 900,
  /** 30 minutes - for mostly static data */
  THIRTY_MINUTES: 1800,
  /** 1 hour - for static content */
  ONE_HOUR: 3600,
  /** 6 hours - for rarely changing content */
  SIX_HOURS: 21600,
  /** 12 hours - for very stable content */
  TWELVE_HOURS: 43200,
  /** 1 day - for essentially static content */
  ONE_DAY: 86400,
  /** 1 week - for immutable assets */
  ONE_WEEK: 604800,
  /** 1 month - for versioned static assets */
  ONE_MONTH: 2592000,
  /** 1 year - for immutable CDN assets */
  ONE_YEAR: 31536000,
} as const;

// ─── React Query Cache Presets ───

interface QueryCacheConfig {
  staleTime: number;
  gcTime: number;
  refetchOnWindowFocus: boolean;
  refetchOnReconnect: boolean;
  refetchOnMount: boolean;
  retry: number;
  retryDelay: number;
}

/**
 * React Query cache configuration presets
 * Use these with useQuery's queryKey and queryClient defaults
 */
export const QUERY_CACHE_PRESETS: Record<string, QueryCacheConfig> = {
  /** Real-time data: bookings, availability */
  realTime: {
    staleTime: CACHE_DURATIONS.THIRTY_SECONDS,
    gcTime: CACHE_DURATIONS.FIVE_MINUTES,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    retry: 3,
    retryDelay: 1000,
  },

  /** Frequently changing data: service availability, staff schedules */
  frequent: {
    staleTime: CACHE_DURATIONS.ONE_MINUTE,
    gcTime: CACHE_DURATIONS.FIFTEEN_MINUTES,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    retry: 3,
    retryDelay: 1500,
  },

  /** Moderate data: blog posts, testimonials, gallery */
  moderate: {
    staleTime: CACHE_DURATIONS.FIVE_MINUTES,
    gcTime: CACHE_DURATIONS.ONE_HOUR,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
    retry: 2,
    retryDelay: 2000,
  },

  /** Slow-changing data: services, pricing, staff profiles */
  slow: {
    staleTime: CACHE_DURATIONS.FIFTEEN_MINUTES,
    gcTime: CACHE_DURATIONS.SIX_HOURS,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: 3000,
  },

  /** Static data: site settings, SEO config, brand info */
  static: {
    staleTime: CACHE_DURATIONS.ONE_HOUR,
    gcTime: CACHE_DURATIONS.ONE_DAY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
    retryDelay: 5000,
  },

  /** Immutable data: media assets, archived content */
  immutable: {
    staleTime: CACHE_DURATIONS.ONE_DAY,
    gcTime: CACHE_DURATIONS.ONE_WEEK,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
    retryDelay: 5000,
  },
};

// ─── Query Key Factory ───

/**
 * Structured query key factory for consistent cache management
 * Organized by entity type for targeted invalidation
 */
export const queryKeys = {
  // Bookings
  bookings: {
    all: ["bookings"] as const,
    lists: () => [...queryKeys.bookings.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.bookings.lists(), filters] as const,
    details: () => [...queryKeys.bookings.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.bookings.details(), id] as const,
    byDate: (date: string) =>
      [...queryKeys.bookings.all, "date", date] as const,
  },

  // Services
  services: {
    all: ["services"] as const,
    lists: () => [...queryKeys.services.all, "list"] as const,
    list: (category?: string) =>
      [...queryKeys.services.lists(), category] as const,
    details: () => [...queryKeys.services.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.services.details(), id] as const,
  },

  // Staff
  staff: {
    all: ["staff"] as const,
    lists: () => [...queryKeys.staff.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.staff.lists(), filters] as const,
    details: () => [...queryKeys.staff.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.staff.details(), id] as const,
    availability: (id: string, date: string) =>
      [...queryKeys.staff.detail(id), "availability", date] as const,
  },

  // Gallery
  gallery: {
    all: ["gallery"] as const,
    lists: () => [...queryKeys.gallery.all, "list"] as const,
    list: (category?: string) =>
      [...queryKeys.gallery.lists(), category] as const,
  },

  // Testimonials
  testimonials: {
    all: ["testimonials"] as const,
    lists: () => [...queryKeys.testimonials.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.testimonials.lists(), filters] as const,
  },

  // Blog
  blog: {
    all: ["blog"] as const,
    lists: () => [...queryKeys.blog.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.blog.lists(), filters] as const,
    details: () => [...queryKeys.blog.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.blog.details(), slug] as const,
  },

  // Site Settings
  settings: {
    all: ["settings"] as const,
    site: () => [...queryKeys.settings.all, "site"] as const,
    seo: () => [...queryKeys.settings.all, "seo"] as const,
  },

  // Analytics
  analytics: {
    all: ["analytics"] as const,
    dashboard: (range: string) =>
      [...queryKeys.analytics.all, "dashboard", range] as const,
    bookings: (range: string) =>
      [...queryKeys.analytics.all, "bookings", range] as const,
    revenue: (range: string) =>
      [...queryKeys.analytics.all, "revenue", range] as const,
  },
} as const;

// ─── SWR-like Stale-While-Revalidate Patterns ───

interface SWRConfig {
  /** Time in ms before data is considered stale */
  dedupingInterval: number;
  /** Time in ms to reuse cached data without revalidation */
  focusThrottleInterval: number;
  /** Whether to revalidate on window focus */
  revalidateOnFocus: boolean;
  /** Whether to revalidate on reconnect */
  revalidateOnReconnect: boolean;
  /** Whether to revalidate if data is stale on mount */
  revalidateIfStale: boolean;
}

/**
 * SWR configuration presets mapping to our React Query presets
 */
export const SWR_PRESETS: Record<string, SWRConfig> = {
  realTime: {
    dedupingInterval: 2000,
    focusThrottleInterval: 5000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
  },
  frequent: {
    dedupingInterval: 5000,
    focusThrottleInterval: 10000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
  },
  moderate: {
    dedupingInterval: 30000,
    focusThrottleInterval: 60000,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    revalidateIfStale: false,
  },
  slow: {
    dedupingInterval: 60000,
    focusThrottleInterval: 300000,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  },
  static: {
    dedupingInterval: 300000,
    focusThrottleInterval: 600000,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  },
};

// ─── Cache Invalidation Strategies ───

type InvalidationScope =
  | "all"
  | "bookings"
  | "services"
  | "staff"
  | "gallery"
  | "testimonials"
  | "blog"
  | "settings"
  | "analytics";

/**
 * Get related cache keys that should be invalidated together
 * when a specific entity changes
 */
export function getRelatedCacheKeys(
  scope: InvalidationScope
): readonly (readonly string[])[] {
  const relationships: Record<InvalidationScope, readonly (readonly string[])[]> = {
    all: [
      queryKeys.bookings.all,
      queryKeys.services.all,
      queryKeys.staff.all,
      queryKeys.gallery.all,
      queryKeys.testimonials.all,
      queryKeys.blog.all,
      queryKeys.settings.all,
      queryKeys.analytics.all,
    ],
    bookings: [
      queryKeys.bookings.all,
      queryKeys.analytics.all,
      queryKeys.staff.all,
    ],
    services: [
      queryKeys.services.all,
      queryKeys.bookings.all,
    ],
    staff: [
      queryKeys.staff.all,
      queryKeys.bookings.all,
      queryKeys.analytics.all,
    ],
    gallery: [queryKeys.gallery.all],
    testimonials: [queryKeys.testimonials.all],
    blog: [queryKeys.blog.all],
    settings: [queryKeys.settings.all],
    analytics: [
      queryKeys.analytics.all,
      queryKeys.bookings.all,
    ],
  };

  return relationships[scope];
}

// ─── Server-Side Cache Headers ───

interface CacheHeaderConfig {
  /** Max-age in seconds for the browser cache */
  maxAge: number;
  /** Max-age in seconds for the shared/CDN cache */
  sMaxAge?: number;
  /** Whether the response varies by Authorization header */
  private?: boolean;
  /** Whether to include stale-while-revalidate directive */
  staleWhileRevalidate?: number;
  /** Whether to include stale-if-error directive */
  staleIfError?: number;
  /** Whether the response must revalidate after expiry */
  mustRevalidate?: boolean;
  /** Whether to include immutable directive */
  immutable?: boolean;
}

/**
 * Generate Cache-Control header value from configuration
 */
export function generateCacheHeaders(config: CacheHeaderConfig): string {
  const directives: string[] = [];

  if (config.private) {
    directives.push("private");
  } else {
    directives.push("public");
  }

  directives.push(`max-age=${config.maxAge}`);

  if (config.sMaxAge !== undefined) {
    directives.push(`s-maxage=${config.sMaxAge}`);
  }

  if (config.staleWhileRevalidate !== undefined) {
    directives.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
  }

  if (config.staleIfError !== undefined) {
    directives.push(`stale-if-error=${config.staleIfError}`);
  }

  if (config.mustRevalidate) {
    directives.push("must-revalidate");
  }

  if (config.immutable) {
    directives.push("immutable");
  }

  return directives.join(", ");
}

/**
 * Pre-configured cache header presets for common route types
 */
export const CACHE_HEADER_PRESETS = {
  /** No caching - for authenticated/admin routes */
  noCache: generateCacheHeaders({
    maxAge: 0,
    mustRevalidate: true,
    private: true,
  }),

  /** Short cache for dynamic API routes */
  shortCache: generateCacheHeaders({
    maxAge: CACHE_DURATIONS.THIRTY_SECONDS,
    sMaxAge: CACHE_DURATIONS.ONE_MINUTE,
    staleWhileRevalidate: CACHE_DURATIONS.ONE_MINUTE,
    staleIfError: CACHE_DURATIONS.FIVE_MINUTES,
  }),

  /** Medium cache for semi-dynamic pages */
  mediumCache: generateCacheHeaders({
    maxAge: CACHE_DURATIONS.FIVE_MINUTES,
    sMaxAge: CACHE_DURATIONS.FIFTEEN_MINUTES,
    staleWhileRevalidate: CACHE_DURATIONS.FIVE_MINUTES,
    staleIfError: CACHE_DURATIONS.ONE_HOUR,
  }),

  /** Long cache for mostly static pages */
  longCache: generateCacheHeaders({
    maxAge: CACHE_DURATIONS.ONE_HOUR,
    sMaxAge: CACHE_DURATIONS.SIX_HOURS,
    staleWhileRevalidate: CACHE_DURATIONS.ONE_HOUR,
    staleIfError: CACHE_DURATIONS.ONE_DAY,
  }),

  /** Static asset cache for fonts, images, etc. */
  staticAssets: generateCacheHeaders({
    maxAge: CACHE_DURATIONS.ONE_YEAR,
    immutable: true,
  }),

  /** HTML pages with SWR pattern */
  htmlPages: generateCacheHeaders({
    maxAge: 0,
    sMaxAge: CACHE_DURATIONS.FIVE_MINUTES,
    staleWhileRevalidate: CACHE_DURATIONS.ONE_MINUTE,
    mustRevalidate: true,
  }),
} as const;

// ─── ISR Revalidation Configuration ───

/**
 * ISR revalidation times for different page types
 * Used with Next.js revalidate export in page/layout files
 */
export const ISR_REVALIDATION = {
  /** Home page - revalidate every 5 minutes */
  home: CACHE_DURATIONS.FIVE_MINUTES,
  /** Services page - revalidate every 15 minutes */
  services: CACHE_DURATIONS.FIFTEEN_MINUTES,
  /** Gallery page - revalidate every 30 minutes */
  gallery: CACHE_DURATIONS.THIRTY_MINUTES,
  /** Blog listing - revalidate every 10 minutes */
  blogListing: 600,
  /** Blog post - revalidate every 30 minutes */
  blogPost: CACHE_DURATIONS.THIRTY_MINUTES,
  /** Bridal page - revalidate every hour */
  bridal: CACHE_DURATIONS.ONE_HOUR,
  /** About page - revalidate every hour */
  about: CACHE_DURATIONS.ONE_HOUR,
  /** Contact page - revalidate every hour */
  contact: CACHE_DURATIONS.ONE_HOUR,
  /** Admin pages - no ISR, always fresh */
  admin: 0,
} as const;

// ─── Static Generation Helpers ───

/**
 * Generate static paths for gallery categories
 */
export function getGalleryStaticPaths() {
  const categories = [
    "all",
    "bridal",
    "hair",
    "makeup",
    "skincare",
    "nails",
    "spa",
  ];

  return categories.map((category) => ({
    category,
  }));
}

/**
 * Generate static paths for service categories
 */
export function getServiceStaticPaths() {
  const categories = [
    "all",
    "bridal",
    "hair",
    "makeup",
    "skincare",
    "nails",
    "spa",
  ];

  return categories.map((category) => ({
    category,
  }));
}

// ─── Next.js Fetch Cache Configuration ───

/**
 * Create Next.js fetch cache configuration for route handlers
 */
export function createFetchCacheConfig(
  revalidate: number,
  tags?: string[]
): { revalidate: number; tags: string[] } {
  return {
    revalidate,
    tags: tags || [],
  };
}

/**
 * Fetch cache tags for targeted revalidation
 */
export const CACHE_TAGS = {
  bookings: "bookings",
  services: "services",
  staff: "staff",
  gallery: "gallery",
  testimonials: "testimonials",
  blog: "blog",
  settings: "settings",
  analytics: "analytics",
} as const;

/**
 * Get revalidation tags for a given entity type
 */
export function getRevalidationTags(
  entityType: keyof typeof CACHE_TAGS
): string[] {
  const tagMap: Record<string, string[]> = {
    bookings: [CACHE_TAGS.bookings, CACHE_TAGS.analytics],
    services: [CACHE_TAGS.services, CACHE_TAGS.bookings],
    staff: [CACHE_TAGS.staff, CACHE_TAGS.bookings, CACHE_TAGS.analytics],
    gallery: [CACHE_TAGS.gallery],
    testimonials: [CACHE_TAGS.testimonials],
    blog: [CACHE_TAGS.blog],
    settings: [CACHE_TAGS.settings],
    analytics: [CACHE_TAGS.analytics, CACHE_TAGS.bookings],
  };

  return tagMap[entityType] || [CACHE_TAGS[entityType]];
}

// ─── Edge Caching Configuration ───

interface EdgeCacheRule {
  /** URL pattern to match */
  pattern: string;
  /** Cache-Control header value */
  cacheControl: string;
  /** Edge TTL in seconds */
  edgeTTL: number;
  /** Browser TTL in seconds */
  browserTTL: number;
  /** Whether to bypass cache for authenticated users */
  bypassOnAuth: boolean;
}

/**
 * Edge caching rules for the salon website
 * These can be used with Cloudflare Workers, Vercel Edge, etc.
 */
export const EDGE_CACHE_RULES: EdgeCacheRule[] = [
  {
    pattern: "/api/bookings*",
    cacheControl: CACHE_HEADER_PRESETS.noCache,
    edgeTTL: 0,
    browserTTL: 0,
    bypassOnAuth: false,
  },
  {
    pattern: "/api/services*",
    cacheControl: CACHE_HEADER_PRESETS.shortCache,
    edgeTTL: CACHE_DURATIONS.ONE_MINUTE,
    browserTTL: CACHE_DURATIONS.THIRTY_SECONDS,
    bypassOnAuth: false,
  },
  {
    pattern: "/api/gallery*",
    cacheControl: CACHE_HEADER_PRESETS.mediumCache,
    edgeTTL: CACHE_DURATIONS.FIFTEEN_MINUTES,
    browserTTL: CACHE_DURATIONS.FIVE_MINUTES,
    bypassOnAuth: false,
  },
  {
    pattern: "/api/testimonials*",
    cacheControl: CACHE_HEADER_PRESETS.mediumCache,
    edgeTTL: CACHE_DURATIONS.FIFTEEN_MINUTES,
    browserTTL: CACHE_DURATIONS.FIVE_MINUTES,
    bypassOnAuth: false,
  },
  {
    pattern: "/api/blog*",
    cacheControl: CACHE_HEADER_PRESETS.mediumCache,
    edgeTTL: CACHE_DURATIONS.THIRTY_MINUTES,
    browserTTL: CACHE_DURATIONS.FIVE_MINUTES,
    bypassOnAuth: false,
  },
  {
    pattern: "/api/admin*",
    cacheControl: CACHE_HEADER_PRESETS.noCache,
    edgeTTL: 0,
    browserTTL: 0,
    bypassOnAuth: true,
  },
  {
    pattern: "/api/analytics*",
    cacheControl: CACHE_HEADER_PRESETS.noCache,
    edgeTTL: 0,
    browserTTL: 0,
    bypassOnAuth: true,
  },
  {
    pattern: "/_next/static/*",
    cacheControl: CACHE_HEADER_PRESETS.staticAssets,
    edgeTTL: CACHE_DURATIONS.ONE_YEAR,
    browserTTL: CACHE_DURATIONS.ONE_YEAR,
    bypassOnAuth: false,
  },
];

/**
 * Get the matching edge cache rule for a URL path
 */
export function getEdgeCacheRule(pathname: string): EdgeCacheRule | undefined {
  return EDGE_CACHE_RULES.find((rule) => {
    const pattern = rule.pattern.replace(/\*/g, ".*");
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(pathname);
  });
}

// ─── Local Memory Cache ───

interface MemoryCacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Simple in-memory cache for server-side use
 * Not shared across serverless function invocations,
 * but useful within a single instance
 */
class MemoryCache {
  private cache = new Map<string, MemoryCacheEntry<unknown>>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl: number): void {
    // Evict oldest entries if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  deleteByPrefix(prefix: string): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  get size(): number {
    return this.cache.size;
  }
}

/**
 * Global memory cache instance for server-side caching
 */
export const memoryCache = new MemoryCache(200);

/**
 * Create a cached fetch wrapper for API calls
 */
export function createCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number
): () => Promise<T> {
  return async (): Promise<T> => {
    const cached = memoryCache.get<T>(key);
    if (cached !== null) return cached;

    const data = await fetcher();
    memoryCache.set(key, data, ttl);
    return data;
  };
}
