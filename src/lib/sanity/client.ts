// ─── Sanity CMS Client ───
// Client-side and server-side Sanity configuration

import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
};

export const sanityClient = createClient({
  ...sanityConfig,
  perspective: "published",
});

export const sanityWriteClient = createClient({
  ...sanityConfig,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: "raw",
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ─── GROQ Queries ───
export const QUERIES = {
  ALL_POSTS: `*[_type == "post"] | order(publishedAt desc) {
    _id, title, slug, excerpt, coverImage, category, tags,
    author-> { name, image },
    publishedAt, isPublished, seo
  }`,

  POST_BY_SLUG: `*[_type == "post" && slug.current == $slug][0] {
    _id, title, slug, excerpt, content, coverImage, category, tags,
    author-> { name, image },
    publishedAt, isPublished, seo,
    "relatedPosts": *[_type == "post" && slug.current != $slug && category == ^.category] | order(publishedAt desc)[0..2] {
      _id, title, slug, excerpt, coverImage, publishedAt
    }
  }`,

  PUBLISHED_POSTS: `*[_type == "post" && isPublished == true] | order(publishedAt desc) {
    _id, title, slug, excerpt, coverImage, category, tags,
    author-> { name },
    publishedAt
  }`,

  ALL_SERVICES: `*[_type == "service"] | order(sortOrder asc) {
    _id, title, category, price, duration, icon, description,
    features, addOns, popular, isActive, sortOrder
  }`,

  ALL_TESTIMONIALS: `*[_type == "testimonial"] | order(createdAt desc) {
    _id, name, role, quote, rating, image, featured, isActive
  }`,

  GALLERY_IMAGES: `*[_type == "galleryImage"] | order(uploadedAt desc) {
    _id, image, alt, category, height, featured
  }`,

  SITE_SETTINGS: `*[_type == "siteSettings"][0] {
    brandName, tagline, phone, whatsapp, email, address, hours,
    social, seo
  }`,
} as const;
