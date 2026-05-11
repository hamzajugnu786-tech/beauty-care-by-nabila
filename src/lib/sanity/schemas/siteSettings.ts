// ─── Sanity Schema: Site Settings ───

const siteSettings = {
  name: "siteSettings",
  title: "Site Settings",
  type: "document" as const,
  // Singleton document
  __singleton: true,
  fields: [
    { name: "brandName", title: "Brand Name", type: "string" },
    { name: "tagline", title: "Tagline", type: "string" },
    { name: "phone", title: "Phone", type: "string" },
    { name: "whatsapp", title: "WhatsApp Number", type: "string" },
    { name: "email", title: "Email", type: "string" },
    { name: "address", title: "Address", type: "text", rows: 2 },
    { name: "hours", title: "Business Hours", type: "string" },
    {
      name: "social",
      title: "Social Links",
      type: "object",
      fields: [
        { name: "instagram", type: "string", title: "Instagram" },
        { name: "facebook", type: "string", title: "Facebook" },
        { name: "tiktok", type: "string", title: "TikTok" },
        { name: "youtube", type: "string", title: "YouTube" },
      ],
    },
    { name: "seo", title: "Global SEO", type: "seoFields" },
  ],
};

export default siteSettings;
