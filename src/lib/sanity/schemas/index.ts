// ─── Sanity Schema Index ───
// All schemas registered in the Sanity studio

import post from "./post";
import author from "./author";
import service from "./service";
import testimonial from "./testimonial";
import galleryImage from "./galleryImage";
import siteSettings from "./siteSettings";
import staffMember from "./staffMember";
import seoFields from "./seoFields";

export const schemaTypes = [
  // Object types (must come before document types)
  seoFields,

  // Document types
  post,
  author,
  service,
  testimonial,
  galleryImage,
  siteSettings,
  staffMember,
];

export { post, author, service, testimonial, galleryImage, siteSettings, staffMember, seoFields };
