import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { DETAILED_SERVICES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // ─── STATIC PUBLIC PAGES ───
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: oneWeekAgo,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/bridal`,
      lastModified: oneWeekAgo,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: oneWeekAgo,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/gallery`,
      lastModified: oneMonthAgo,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: oneMonthAgo,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: oneMonthAgo,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/booking`,
      lastModified: oneWeekAgo,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // ─── SERVICE DETAIL PAGES (hash-based anchors) ───
  const servicePages: MetadataRoute.Sitemap = DETAILED_SERVICES.map(
    (service) => ({
      url: `${SITE_URL}/services#${service.id}`,
      lastModified: oneMonthAgo,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  // ─── BRIDAL PACKAGE PAGES ───
  const bridalPackagePages: MetadataRoute.Sitemap = [
    { id: "essential", name: "Essential Bride" },
    { id: "signature", name: "Signature Bride" },
    { id: "couture", name: "Couture Bride" },
  ].map((pkg) => ({
    url: `${SITE_URL}/bridal#${pkg.id}`,
    lastModified: oneMonthAgo,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // ─── BLOG POSTS ───
  // These would normally come from a CMS like Sanity.
  // For now, include placeholder blog slugs that would be dynamically fetched.
  const blogSlugs = [
    "bridal-skincare-guide-2026",
    "top-hair-trends-lahore",
    "pre-bridal-treatment-timeline",
    "monsoon-skincare-tips-pakistan",
    "choosing-perfect-bridal-look",
  ];

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: oneMonthAgo,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  // ─── COMBINE ALL ───
  return [
    ...staticPages,
    ...servicePages,
    ...bridalPackagePages,
    ...blogPages,
  ];
}
