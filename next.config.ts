import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Core Configuration ───

  // output: "standalone", // Disabled for dev/preview - standalone requires special server setup
  reactStrictMode: true,

  // Remove X-Powered-By header for security
  poweredByHeader: false,

  // Development-only: Allow cross-origin requests from preview iframe
  // These are only needed during development and do not affect production
  allowedDevOrigins: [
    ".space-z.ai",
    ".space.chatglm.site",
    ".chatglm.site",
    "https://.space-z.ai",
    "https://.space.chatglm.site",
    "https://.chatglm.site",
  ],

  // Enable TypeScript strict checking in builds
  typescript: {
    ignoreBuildErrors: false,
  },

  // ─── Image Optimization ───

  images: {
    // Modern image formats for smaller file sizes
    formats: ["image/avif", "image/webp"],

    // Responsive image sizes for srcSet generation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for responsive layout
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Minimum cache TTL for optimized images (in seconds)
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year

    // Allow animated images (AVIF, WebP, GIF)
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none';",

    // Remote image patterns for Sanity CMS
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
      },
      // Cloudinary
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      // Google Fonts (for font display images)
      {
        protocol: "https",
        hostname: "fonts.googleapis.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fonts.gstatic.com",
        port: "",
        pathname: "/**",
      },
      // Instagram embed images
      {
        protocol: "https",
        hostname: "instagram.f**",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
        port: "",
        pathname: "/**",
      },
      // General HTTPS fallback for external images
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // ─── HTTP Headers ───

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // X-Frame-Options removed - using CSP frame-ancestors instead (modern standard)
          // This allows the preview iframe to embed our site
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Performance headers
          {
            key: "X-Request-ID",
            value: "%{REQUEST_ID}e",
          },
        ],
      },
      // Static assets - aggressive caching
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=31536000, immutable",
          },
        ],
      },
      // Font files - long cache
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=31536000, immutable",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      // Image assets - cache with stale-while-revalidate
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=86400, stale-while-revalidate=31536000",
          },
        ],
      },
      // API routes - short cache with SWR
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      // Service worker - no cache
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },

  // ─── Redirects ───

  async redirects() {
    return [
      // Common URL pattern redirects
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/bridal-studio",
        destination: "/bridal",
        permanent: true,
      },
      {
        source: "/book",
        destination: "/booking",
        permanent: true,
      },
      {
        source: "/book-appointment",
        destination: "/booking",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/about",
        permanent: true,
      },
      // Trailing slash normalization
      {
        source: "/:path+/",
        destination: "/:path+",
        permanent: true,
      },
    ];
  },

  // ─── Compression ───

  compress: true,

  // ─── Turbopack / Webpack Configuration ───
  // Next.js 16 defaults to Turbopack for development.
  // Bundle splitting for production is handled via optimizePackageImports
  // and Next.js built-in code-splitting. Custom webpack config is
  // available for production builds via: next build --webpack

  turbopack: {},

  // ─── Experimental Features ───

  experimental: {
    // Optimize package imports for smaller bundles
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "recharts",
      "@radix-ui/react-icons",
      "date-fns",
      "react-hook-form",
      "zod",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
    ],
  },

  // ─── Logging ───

  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
