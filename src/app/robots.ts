import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/*", "/api/*"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin/*", "/api/*"],
        crawlDelay: 1,
      },
      {
        userAgent: "Twitterbot",
        allow: "/",
        disallow: ["/admin/*", "/api/*"],
      },
      {
        userAgent: "facebookexternalhit",
        allow: "/",
        disallow: ["/admin/*", "/api/*"],
      },
      {
        userAgent: "SemrushBot",
        allow: "/",
        disallow: ["/admin/*", "/api/*"],
        crawlDelay: 2,
      },
      {
        userAgent: "AhrefsBot",
        allow: "/",
        disallow: ["/admin/*", "/api/*"],
        crawlDelay: 2,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/*", "/api/*"],
        crawlDelay: 1,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
