import { BRAND, SERVICES, DETAILED_SERVICES, TESTIMONIALS } from "./constants";
import { SITE_URL, SITE_NAME } from "./seo";

// ─────────────────────────────────────────────────────────────
// SCHEMA.ORG TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────

type SchemaOrgType =
  | "LocalBusiness"
  | "SalonOrSpa"
  | "Service"
  | "BreadcrumbList"
  | "FAQPage"
  | "AggregateRating"
  | "Review"
  | "Event"
  | "Organization"
  | "WebSite"
  | "ImageGallery"
  | "Person";

// Schema.org JSON-LD output type — allows any schema.org properties
type SchemaOutput = {
  "@context": "https://schema.org";
  "@type": SchemaOrgType | SchemaOrgType[];
  [key: string]: unknown;
};

// ─────────────────────────────────────────────────────────────
// LOCAL BUSINESS SCHEMA
// ─────────────────────────────────────────────────────────────

export function generateLocalBusinessSchema(): SchemaOutput {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SalonOrSpa"],
    name: SITE_NAME,
    alternateName: ["Nabila Lahore", "Beauty Care Nabila", "Nabila Salon Lahore"],
    description:
      "Luxury beauty salon and bridal studio in the heart of Lahore. Premium services including bridal couture, hair artistry, skincare, makeup, nails, and spa treatments.",
    url: SITE_URL,
    logo: SITE_URL + "/logo.svg",
    image: [
      SITE_URL + "/images/og-default.jpg",
      SITE_URL + "/images/service-bridal.jpg",
      SITE_URL + "/images/gallery-1.jpg",
    ],
    telephone: BRAND.phone,
    email: BRAND.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "M.M. Alam Road, Gulberg III",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      postalCode: "54000",
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.5249,
      longitude: 74.3522,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:00",
        closes: "20:00",
        description: "By Appointment Only",
      },
    ],
    priceRange: "$$$",
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash, Credit Card, JazzCash, EasyPaisa",
    sameAs: [
      BRAND.social.instagram,
      BRAND.social.facebook,
      BRAND.social.tiktok,
      BRAND.social.youtube,
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "587",
      bestRating: "5",
      worstRating: "1",
    },
    areaServed: {
      "@type": "City",
      name: "Lahore",
      sameAs: "https://en.wikipedia.org/wiki/Lahore",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Beauty Services",
      itemListElement: SERVICES.map((service, index) => ({
        "@type": "OfferCatalog",
        name: service.title,
        description: service.description,
        position: index + 1,
      })),
    },
  };
}

// ─────────────────────────────────────────────────────────────
// SERVICE SCHEMAS (for each service category)
// ─────────────────────────────────────────────────────────────

export function generateServiceSchemas(): (SchemaOutput)[] {
  const categoryMap: Record<string, string> = {
    bridal: "Bridal Services",
    hair: "Hair Services",
    makeup: "Makeup Services",
    skincare: "Skincare Services",
    nails: "Nail Services",
    spa: "Spa & Wellness Services",
  };

  return Object.entries(categoryMap).map(([category, categoryName]) => {
    const categoryServices = DETAILED_SERVICES.filter(
      (s) => s.category === category
    );

    return {
      "@context": "https://schema.org",
      "@type": "Service" as SchemaOrgType,
      name: categoryName + " - " + SITE_NAME,
      description:
        "Professional " +
        categoryName.toLowerCase() +
        " at " +
        SITE_NAME +
        " in Lahore. Expert " +
        category +
        " services with premium products and internationally trained artists.",
      provider: {
        "@type": "SalonOrSpa",
        name: SITE_NAME,
        url: SITE_URL,
      },
      areaServed: {
        "@type": "City",
        name: "Lahore",
      },
      serviceType: categoryName,
      url: SITE_URL + "/services#" + category,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: categoryName,
        itemListElement: categoryServices.map((service, index) => ({
          "@type": "Offer",
          name: service.title,
          description: service.description,
          price: service.price.replace("PKR ", "").replace(/,/g, ""),
          priceCurrency: "PKR",
          url: SITE_URL + "/services#" + service.id,
          position: index + 1,
          availability: "https://schema.org/InStock",
          offeredBy: {
            "@type": "SalonOrSpa",
            name: SITE_NAME,
          },
        })),
      },
    };
  });
}

/**
 * Generate a single service schema for an individual service.
 */
export function generateIndividualServiceSchema(
  serviceId: string
): (SchemaOutput) | null {
  const service = DETAILED_SERVICES.find((s) => s.id === serviceId);
  if (!service) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: SITE_URL + "/services#" + service.id,
    provider: {
      "@type": "SalonOrSpa",
      name: SITE_NAME,
      url: SITE_URL,
      telephone: BRAND.phone,
    },
    areaServed: {
      "@type": "City",
      name: "Lahore",
    },
    serviceType: service.category,
    offers: {
      "@type": "Offer",
      price: service.price.replace("PKR ", "").replace(/,/g, ""),
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
      url: SITE_URL + "/booking",
      offeredBy: {
        "@type": "SalonOrSpa",
        name: SITE_NAME,
      },
    },
    duration: service.duration,
  };
}

// ─────────────────────────────────────────────────────────────
// BREADCRUMB LIST SCHEMA
// ─────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(
  items: BreadcrumbItem[]
): SchemaOutput {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Pre-built breadcrumb schemas for common page routes.
 */
export const PAGE_BREADCRUMBS = {
  home: generateBreadcrumbSchema([{ name: "Home", url: SITE_URL }]),
  bridal: generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Bridal Studio", url: SITE_URL + "/bridal" },
  ]),
  services: generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Services", url: SITE_URL + "/services" },
  ]),
  gallery: generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Gallery", url: SITE_URL + "/gallery" },
  ]),
  about: generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "About", url: SITE_URL + "/about" },
  ]),
  contact: generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Contact", url: SITE_URL + "/contact" },
  ]),
  booking: generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Book Appointment", url: SITE_URL + "/booking" },
  ]),
} as const;

// ─────────────────────────────────────────────────────────────
// FAQ PAGE SCHEMA
// ─────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string;
  answer: string;
}

export const DEFAULT_FAQS: FAQItem[] = [
  {
    question: "What bridal packages does Beauty Care by Nabila offer?",
    answer:
      "We offer three signature bridal packages: Essential Bride (PKR 85,000), Signature Bride (PKR 150,000), and Couture Bride (PKR 250,000). Each package includes professional bridal makeup, hairstyling, dupatta setting, and varying levels of artist support and exclusive amenities. All packages include at least one trial session.",
  },
  {
    question:
      "How far in advance should I book my bridal appointment?",
    answer:
      "We recommend booking your bridal appointment at least 3 months before your wedding date. This allows adequate time for consultations, trial sessions, and any pre-bridal skincare treatments. For our Couture Bride package, we suggest booking 4-6 months in advance due to higher demand.",
  },
  {
    question: "Do you offer international products at your salon?",
    answer:
      "Yes, we exclusively use premium international products from brands including Dior, Charlotte Tilbury, Olaplex, SkinCeuticals, and other globally recognized luxury beauty brands. Our commitment to quality ensures the best results for every service.",
  },
  {
    question: "What are the salon operating hours?",
    answer:
      "We are open Monday through Saturday from 10:00 AM to 8:00 PM. Sunday appointments are available by prior booking only. For bridal services, early morning and late evening slots can be arranged upon request.",
  },
  {
    question:
      "How can I book an appointment at Beauty Care by Nabila?",
    answer:
      "You can book an appointment through our online booking system on the website, by calling us at +92-300-1234567, or via WhatsApp at the same number. We recommend booking at least 48 hours in advance for regular services and 2-3 weeks for bridal services.",
  },
  {
    question: "Do you provide on-site bridal services?",
    answer:
      "Yes, our Signature and Couture Bride packages include on-site artist assistance on the wedding day. Our team will travel to your venue to ensure you look flawless throughout your celebration. On-site services can also be added to the Essential Bride package.",
  },
  {
    question:
      "What skincare treatments are available for the Pakistani climate?",
    answer:
      "We offer a range of treatments specifically designed for the Pakistani climate, including our Signature Facial with LED therapy, HydraGlow hydra-dermabrasion, and customized chemical peels. These treatments address common concerns like hyperpigmentation, sun damage, and dehydration caused by our local weather conditions.",
  },
  {
    question: "Is there a cancellation policy?",
    answer:
      "We request at least 24 hours notice for cancellations of regular appointments and 72 hours notice for bridal appointments. Late cancellations may be subject to a cancellation fee. We understand that plans change and will always try to accommodate rescheduling requests.",
  },
];

export function generateFAQSchema(faqs?: FAQItem[]): SchemaOutput {
  const items = faqs || DEFAULT_FAQS;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ─────────────────────────────────────────────────────────────
// REVIEW / AGGREGATE RATING SCHEMA
// ─────────────────────────────────────────────────────────────

export function generateReviewSchemas(): (SchemaOutput)[] {
  return TESTIMONIALS.map((testimonial) => ({
    "@context": "https://schema.org",
    "@type": "Review" as SchemaOrgType,
    author: {
      "@type": "Person",
      name: testimonial.name,
    },
    reviewBody: testimonial.quote,
    reviewRating: {
      "@type": "Rating",
      ratingValue: testimonial.rating.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    itemReviewed: {
      "@type": "SalonOrSpa",
      name: SITE_NAME,
      address: {
        "@type": "PostalAddress",
        streetAddress: "M.M. Alam Road, Gulberg III",
        addressLocality: "Lahore",
        addressCountry: "PK",
      },
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  }));
}

export function generateAggregateRatingSchema(): SchemaOutput {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: {
      "@type": "SalonOrSpa",
      name: SITE_NAME,
      address: {
        "@type": "PostalAddress",
        streetAddress: "M.M. Alam Road, Gulberg III",
        addressLocality: "Lahore",
        addressCountry: "PK",
      },
    },
    ratingValue: "4.9",
    bestRating: "5",
    worstRating: "1",
    ratingCount: "587",
    reviewCount: "324",
  };
}

// ─────────────────────────────────────────────────────────────
// EVENT SCHEMA (for bridal events / open days)
// ─────────────────────────────────────────────────────────────

export interface EventData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  url: string;
  offers?: {
    price: string;
    priceCurrency: string;
    availability: string;
  };
}

export function generateEventSchema(event: EventData): SchemaOutput {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventAttendanceMode:
      "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.location || SITE_NAME,
      address: {
        "@type": "PostalAddress",
        streetAddress: "M.M. Alam Road, Gulberg III",
        addressLocality: "Lahore",
        addressRegion: "Punjab",
        addressCountry: "PK",
      },
    },
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    url: event.url,
    ...(event.offers
      ? {
          offers: {
            "@type": "Offer",
            price: event.offers.price,
            priceCurrency: event.offers.priceCurrency,
            availability: event.offers.availability,
            url: event.url,
          },
        }
      : {}),
  };
}

/**
 * Pre-built bridal event schemas for recurring events.
 */
export const BRIDAL_EVENT_SCHEMAS = [
  generateEventSchema({
    name: "Bridal Open House - Spring 2026",
    description:
      "Join us for an exclusive bridal open house at Beauty Care by Nabila Lahore. Meet our senior artists, explore our bridal packages, and enjoy complimentary consultations and mini treatments.",
    startDate: "2026-03-15T10:00:00+05:00",
    endDate: "2026-03-15T17:00:00+05:00",
    location: SITE_NAME,
    url: SITE_URL + "/bridal",
    offers: {
      price: "0",
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
    },
  }),
  generateEventSchema({
    name: "Bridal Couture Showcase 2026",
    description:
      "An exclusive showcase of our latest bridal transformations and techniques. Live demonstrations by Nabila and the senior artist team. Limited seats available.",
    startDate: "2026-05-10T11:00:00+05:00",
    endDate: "2026-05-10T15:00:00+05:00",
    location: SITE_NAME,
    url: SITE_URL + "/bridal",
    offers: {
      price: "2500",
      priceCurrency: "PKR",
      availability: "https://schema.org/LimitedAvailability",
    },
  }),
];

// ─────────────────────────────────────────────────────────────
// ORGANIZATION SCHEMA
// ─────────────────────────────────────────────────────────────

export function generateOrganizationSchema(): SchemaOutput {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "Nabila Lahore",
    url: SITE_URL,
    logo: SITE_URL + "/logo.svg",
    description:
      "Luxury beauty salon and bridal studio on M.M. Alam Road, Gulberg III, Lahore. 18 years of excellence with 2,500+ brides transformed.",
    email: BRAND.email,
    telephone: BRAND.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "M.M. Alam Road, Gulberg III",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      postalCode: "54000",
      addressCountry: "PK",
    },
    foundingDate: "2008",
    sameAs: [
      BRAND.social.instagram,
      BRAND.social.facebook,
      BRAND.social.tiktok,
      BRAND.social.youtube,
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: BRAND.phone,
        contactType: "customer service",
        availableLanguage: ["English", "Urdu"],
        areaServed: "PK",
      },
      {
        "@type": "ContactPoint",
        telephone: BRAND.phone,
        contactType: "reservations",
        availableLanguage: ["English", "Urdu"],
        areaServed: "PK",
      },
    ],
  };
}

// ─────────────────────────────────────────────────────────────
// WEB SITE SCHEMA WITH SEARCH ACTION
// ─────────────────────────────────────────────────────────────

export function generateWebSiteSchema(): SchemaOutput {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "Nabila Lahore",
    url: SITE_URL,
    description:
      "Official website of " +
      SITE_NAME +
      " - Luxury beauty salon and bridal studio in Lahore, Pakistan.",
    inLanguage: "en-PK",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: SITE_URL + "/services?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// IMAGE GALLERY SCHEMA
// ─────────────────────────────────────────────────────────────

export interface GalleryImageItem {
  url: string;
  caption: string;
}

export function generateImageGallerySchema(
  images: GalleryImageItem[]
): SchemaOutput {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: SITE_NAME + " - Portfolio Gallery",
    description:
      "Browse our portfolio of bridal, hair, makeup, skincare, nail, and spa transformations at " +
      SITE_NAME +
      ".",
    url: SITE_URL + "/gallery",
    image: images.map((img) => ({
      "@type": "ImageObject",
      contentUrl: img.url,
      caption: img.caption,
    })),
  };
}

/**
 * Generate a gallery schema using the project's gallery constants.
 */
export function generateDefaultGallerySchema(): SchemaOutput {
  const baseUrl = SITE_URL + "/images/gallery-";
  const images: GalleryImageItem[] = [
    { url: baseUrl + "1.jpg", caption: "Regal Bridal Transformation" },
    { url: baseUrl + "2.jpg", caption: "Precision Hair Sculpting" },
    { url: baseUrl + "3.jpg", caption: "Luminous Skin Glow" },
    { url: baseUrl + "4.jpg", caption: "Evening Glam Artistry" },
    { url: baseUrl + "5.jpg", caption: "Mehndi Celebration Look" },
    { url: baseUrl + "6.jpg", caption: "Intricate Nail Art" },
    { url: baseUrl + "7.jpg", caption: "Spa Sanctuary Escape" },
    { url: baseUrl + "8.jpg", caption: "Party Night Glam" },
    { url: baseUrl + "9.jpg", caption: "Bridal Couture Detail" },
    { url: baseUrl + "10.jpg", caption: "Balayage Perfection" },
    { url: baseUrl + "11.jpg", caption: "Bridal Before and After" },
    { url: baseUrl + "12.jpg", caption: "Facial Treatment Bliss" },
    { url: baseUrl + "13.jpg", caption: "Red Carpet Ready" },
    { url: baseUrl + "14.jpg", caption: "Gel Extension Art" },
    { url: baseUrl + "15.jpg", caption: "Aromatherapy Session" },
    { url: baseUrl + "16.jpg", caption: "Skin Transformation Journey" },
    { url: baseUrl + "17.jpg", caption: "Barat Day Beauty" },
    { url: baseUrl + "18.jpg", caption: "Updo Masterclass" },
  ];
  return generateImageGallerySchema(images);
}

// ─────────────────────────────────────────────────────────────
// COMBINED SCHEMA BUILDER
// ─────────────────────────────────────────────────────────────

interface SchemaBuilderOptions {
  includeLocalBusiness?: boolean;
  includeOrganization?: boolean;
  includeWebSite?: boolean;
  includeServices?: boolean;
  includeFAQ?: boolean;
  includeReviews?: boolean;
  includeAggregateRating?: boolean;
  includeEvents?: boolean;
  includeGallery?: boolean;
  customSchemas?: object[];
}

/**
 * Build a combined array of schema.org JSON-LD objects for a page.
 * Useful for generating all relevant structured data in one call.
 */
export function buildPageSchemas(
  options: SchemaBuilderOptions = {}
): object[] {
  const {
    includeLocalBusiness = false,
    includeOrganization = true,
    includeWebSite = true,
    includeServices = false,
    includeFAQ = false,
    includeReviews = false,
    includeAggregateRating = false,
    includeEvents = false,
    includeGallery = false,
    customSchemas = [],
  } = options;

  const schemas: object[] = [];

  if (includeLocalBusiness) schemas.push(generateLocalBusinessSchema());
  if (includeOrganization) schemas.push(generateOrganizationSchema());
  if (includeWebSite) schemas.push(generateWebSiteSchema());
  if (includeServices) schemas.push(...generateServiceSchemas());
  if (includeFAQ) schemas.push(generateFAQSchema());
  if (includeReviews) schemas.push(...generateReviewSchemas());
  if (includeAggregateRating) schemas.push(generateAggregateRatingSchema());
  if (includeEvents) schemas.push(...BRIDAL_EVENT_SCHEMAS);
  if (includeGallery) schemas.push(generateDefaultGallerySchema());
  schemas.push(...customSchemas);

  return schemas;
}
