import type { Metadata } from "next";
import { BRAND, SERVICES, DETAILED_SERVICES } from "./constants";

// ─────────────────────────────────────────────────────────────
// SITE-WIDE CONSTANTS
// ─────────────────────────────────────────────────────────────

export const SITE_URL = "https://nabilalahore.com";
export const SITE_NAME = "Beauty Care by Nabila Lahore";
export const SITE_LOCALE = "en_PK";
export const SITE_LANGUAGE = "en";
export const SITE_COUNTRY = "PK";
export const SITE_CURRENCY = "PKR";

// ─────────────────────────────────────────────────────────────
// OG IMAGE CONFIGURATION
// ─────────────────────────────────────────────────────────────

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_URL = `${SITE_URL}/images/og-default.jpg`;
export const TWITTER_IMAGE_URL = `${SITE_URL}/images/twitter-card.jpg`;

// ─────────────────────────────────────────────────────────────
// CANONICAL URL HELPER
// ─────────────────────────────────────────────────────────────

export function getCanonicalUrl(path: string = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

// ─────────────────────────────────────────────────────────────
// PAGE KEYWORDS PER ROUTE
// ─────────────────────────────────────────────────────────────

export const PAGE_KEYWORDS = {
  home: [
    "luxury salon Lahore",
    "best beauty salon Lahore",
    "Nabila Lahore",
    "premium salon Gulberg",
    "VIP beauty salon Pakistan",
    "bridal studio Lahore",
    "luxury hair salon Lahore",
    "beauty care by Nabila",
    "M.M. Alam Road salon",
    "high-end salon Lahore",
  ],
  bridal: [
    "bridal makeup Lahore",
    "best bridal studio Lahore",
    "bridal packages Lahore",
    "Pakistani bridal makeup",
    "bridal couture Lahore",
    "luxury bridal experience",
    "bridal hairstyling Lahore",
    "mehndi makeup Lahore",
    "walima makeup Lahore",
    "bridal transformation Lahore",
  ],
  services: [
    "salon services Lahore",
    "hair services Lahore",
    "skincare treatments Lahore",
    "makeup services Lahore",
    "nail art Lahore",
    "spa services Lahore",
    "beauty treatments Gulberg",
    "premium salon services Pakistan",
    "hair colour Lahore",
    "facial treatments Lahore",
  ],
  gallery: [
    "salon gallery Lahore",
    "bridal makeup portfolio",
    "hair styling gallery",
    "before after transformations",
    "makeup portfolio Lahore",
    "Nabila salon work",
    "beauty transformations Lahore",
    "skincare results gallery",
  ],
  about: [
    "about Nabila Lahore",
    "salon history Lahore",
    "beauty experts Lahore",
    "salon team Pakistan",
    "Nabila founder story",
    "luxury salon heritage",
  ],
  contact: [
    "contact Nabila Lahore",
    "salon appointment Lahore",
    "beauty salon phone number",
    "salon location Gulberg",
    "M.M. Alam Road salon address",
    "book appointment Lahore",
  ],
  booking: [
    "book salon appointment Lahore",
    "online booking beauty salon",
    "schedule appointment Nabila",
    "reserve salon service Lahore",
    "bridal booking Lahore",
  ],
  vip: [
    "VIP membership salon Lahore",
    "luxury salon membership Pakistan",
    "exclusive beauty privileges",
    "priority booking salon",
    "Nabila VIP club",
  ],
} as const;

// ─────────────────────────────────────────────────────────────
// DESCRIPTION TEMPLATES
// ─────────────────────────────────────────────────────────────

export const PAGE_DESCRIPTIONS = {
  home: `Experience world-class luxury beauty at ${SITE_NAME}. Premium bridal studio, signature services, and exclusive VIP memberships in the heart of Lahore. Where elegance meets artistry.`,
  bridal: `Discover Lahore's most prestigious bridal studio at ${SITE_NAME}. Bespoke bridal packages from PKR 85,000, internationally trained artists, and a transformation experience trusted by over 2,500 brides.`,
  services: `Explore our curated collection of luxury beauty services at ${SITE_NAME}. From precision haircuts and colour artistry to advanced skincare and spa rituals, every service is a masterclass in excellence.`,
  gallery: `Browse our portfolio of stunning transformations at ${SITE_NAME}. From bridal couture to editorial looks, see the artistry that has made us Lahore's most celebrated salon.`,
  about: `Learn about the vision, heritage, and artisan team behind ${SITE_NAME}. 18 years of excellence, 2,500+ brides transformed, and an unwavering commitment to beauty on M.M. Alam Road, Gulberg III.`,
  contact: `Get in touch with ${SITE_NAME}. Visit us at M.M. Alam Road, Gulberg III, Lahore, or call ${BRAND.phone}. We look forward to crafting your perfect beauty experience.`,
  booking: `Book your luxury beauty appointment at ${SITE_NAME}. Choose from our signature services, select your preferred artist, and reserve your slot in just a few steps.`,
  vip: `Join the exclusive VIP membership at ${SITE_NAME}. Priority bookings, member-only rates, complimentary services, and personalized experiences reserved for our most valued clients.`,
} as const;

// ─────────────────────────────────────────────────────────────
// PAGE TITLE TEMPLATES
// ─────────────────────────────────────────────────────────────

export const PAGE_TITLES = {
  home: `${SITE_NAME} | Luxury Salon & Bridal Studio`,
  bridal: `Bridal Studio | ${SITE_NAME} - Bespoke Bridal Packages`,
  services: `Signature Services | ${SITE_NAME} - Luxury Beauty Treatments`,
  gallery: `Gallery | ${SITE_NAME} - Portfolio & Transformations`,
  about: `About | ${SITE_NAME} - Our Story & Team`,
  contact: `Contact | ${SITE_NAME} - Appointments & Location`,
  booking: `Book Appointment | ${SITE_NAME} - Reserve Your Slot`,
  vip: `VIP Membership | ${SITE_NAME} - Exclusive Privileges`,
} as const;

// ─────────────────────────────────────────────────────────────
// METADATA GENERATORS PER PAGE
// ─────────────────────────────────────────────────────────────

type PageRoute = "home" | "bridal" | "services" | "gallery" | "about" | "contact" | "booking" | "vip";

interface PageMetaOptions {
  page: PageRoute;
  path?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * Generate complete Metadata object for any page route.
 * Use in page.tsx files as: export const metadata = generatePageMetadata({ page: "home" });
 */
export function generatePageMetadata(options: PageMetaOptions): Metadata {
  const {
    page,
    path = `/${page === "home" ? "" : page}`,
    title,
    description,
    keywords,
    ogImage,
    noIndex = false,
  } = options;

  const pageTitle = title || PAGE_TITLES[page];
  const pageDescription = description || PAGE_DESCRIPTIONS[page];
  const pageKeywords = keywords || [...PAGE_KEYWORDS[page]];
  const canonicalUrl = getCanonicalUrl(path);
  const ogImageUrl = ogImage || OG_IMAGE_URL;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-PK": canonicalUrl,
        "en": canonicalUrl,
      },
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: page === "home" ? "website" : "article",
      images: [
        {
          url: ogImageUrl,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: pageTitle,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImageUrl],
      creator: "@nabilalahore",
      site: "@nabilalahore",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

// ─────────────────────────────────────────────────────────────
// DYNAMIC PAGE METADATA GENERATORS
// ─────────────────────────────────────────────────────────────

/**
 * Generate metadata for a specific service page.
 */
export function generateServiceMetadata(serviceId: string): Metadata {
  const service = DETAILED_SERVICES.find((s) => s.id === serviceId);
  if (!service) {
    return generatePageMetadata({ page: "services" });
  }

  const title = `${service.title} | ${SITE_NAME}`;
  const description = `${service.description} Available from ${service.price}. Book your ${service.title} appointment at ${BRAND.address}.`;
  const keywords = [
    service.title.toLowerCase(),
    `${service.category} services Lahore`,
    `${service.category} salon Lahore`,
    ...PAGE_KEYWORDS.services,
  ];

  return generatePageMetadata({
    page: "services",
    path: `/services#${serviceId}`,
    title,
    description,
    keywords,
  });
}

/**
 * Generate metadata for a specific bridal package page.
 */
export function generateBridalMetadata(packageId: string): Metadata {
  const bridalPackages = [
    {
      id: "essential",
      title: "Essential Bride Package",
      description: `Begin your bridal journey with our Essential Bride package at ${SITE_NAME}. Professional bridal makeup, hairstyling, and dupatta setting from PKR 85,000.`,
      keywords: ["essential bridal package", "affordable bridal Lahore", "bridal makeup package"],
    },
    {
      id: "signature",
      title: "Signature Bride Package",
      description: `Our most beloved bridal package trusted by over 2,500 brides at ${SITE_NAME}. Complete transformation experience from PKR 150,000 including trials, on-site assistance, and a custom lookbook.`,
      keywords: ["signature bridal package", "premium bridal Lahore", "most popular bridal"],
    },
    {
      id: "couture",
      title: "Couture Bride Package",
      description: `The ultimate bridal luxury at ${SITE_NAME}. A fully bespoke journey with private suite access and multi-event styling from PKR 250,000. For the bride who accepts nothing less than extraordinary.`,
      keywords: ["couture bridal package", "luxury bridal Lahore", "VIP bridal experience"],
    },
  ];

  const pkg = bridalPackages.find((p) => p.id === packageId);
  if (!pkg) {
    return generatePageMetadata({ page: "bridal" });
  }

  return generatePageMetadata({
    page: "bridal",
    path: `/bridal#${packageId}`,
    title: `${pkg.title} | ${SITE_NAME}`,
    description: pkg.description,
    keywords: [...pkg.keywords, ...PAGE_KEYWORDS.bridal],
  });
}

/**
 * Generate metadata for a blog post.
 */
export function generateBlogPostMetadata(blogPost: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  image?: string;
}): Metadata {
  const title = `${blogPost.title} | ${SITE_NAME} Blog`;
  const description = blogPost.excerpt;
  const canonicalUrl = getCanonicalUrl(`/blog/${blogPost.slug}`);

  return {
    title,
    description,
    keywords: [
      "beauty tips Lahore",
      "bridal advice Pakistan",
      "skincare tips",
      "salon blog",
      blogPost.title.toLowerCase(),
    ],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: "article",
      publishedTime: blogPost.publishedAt,
      images: [
        {
          url: blogPost.image || OG_IMAGE_URL,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: blogPost.title,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [blogPost.image || OG_IMAGE_URL],
      creator: "@nabilalahore",
      site: "@nabilalahore",
    },
  };
}

// ─────────────────────────────────────────────────────────────
// SERVICE-SPECIFIC SEO DATA (for structured data)
// ─────────────────────────────────────────────────────────────

export interface ServiceSeoData {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  category: string;
  url: string;
}

export function getServiceSeoData(): ServiceSeoData[] {
  return DETAILED_SERVICES.map((service) => ({
    id: service.id,
    name: service.title,
    description: service.description,
    price: service.price,
    duration: service.duration,
    category: service.category,
    url: getCanonicalUrl(`/services#${service.id}`),
  }));
}

// ─────────────────────────────────────────────────────────────
// VERIFICATION TAGS (placeholder for actual verification codes)
// ─────────────────────────────────────────────────────────────

export const VERIFICATION_TAGS = {
  google: "GOOGLE_SITE_VERIFICATION_CODE",
  yandex: "YANDEX_VERIFICATION_CODE",
  bing: "BING_VERIFICATION_CODE",
} as const;

// ─────────────────────────────────────────────────────────────
// VIEWPORT & THEME CONFIGURATION
// ─────────────────────────────────────────────────────────────

export const VIEWPORT_CONFIG = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0C0C10",
} as const;
