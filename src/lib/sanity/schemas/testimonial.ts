// ─── Sanity Schema: Testimonial ───

const testimonial = {
  name: "testimonial",
  title: "Testimonial",
  type: "document" as const,
  fields: [
    { name: "name", title: "Client Name", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "role", title: "Role / Occasion", type: "string", description: "e.g. 'Bride, December 2025'" },
    { name: "quote", title: "Quote", type: "text", rows: 4, validation: (Rule: any) => Rule.required() },
    { name: "rating", title: "Rating", type: "number", validation: (Rule: any) => Rule.min(1).max(5) },
    { name: "image", title: "Client Photo", type: "image", options: { hotspot: true } },
    { name: "featured", title: "Featured", type: "boolean", initialValue: false },
    { name: "isActive", title: "Active", type: "boolean", initialValue: true },
    { name: "createdAt", title: "Created At", type: "datetime" },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "image" },
  },
};

export default testimonial;
