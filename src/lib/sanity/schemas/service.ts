// ─── Sanity Schema: Service ───

const service = {
  name: "service",
  title: "Service",
  type: "document" as const,
  fields: [
    { name: "title", title: "Title", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "category", title: "Category", type: "string", options: {
      list: ["bridal", "hair", "makeup", "skincare", "nails", "spa"],
    }, validation: (Rule: any) => Rule.required() },
    { name: "price", title: "Price", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "duration", title: "Duration", type: "string" },
    { name: "icon", title: "Icon Name", type: "string", description: "Lucide icon name (e.g. crown, scissors)" },
    { name: "description", title: "Description", type: "text", rows: 4 },
    { name: "features", title: "Features", type: "array", of: [{ type: "string" }] },
    { name: "addOns", title: "Add-ons", type: "array", of: [{ type: "string" }] },
    { name: "popular", title: "Popular", type: "boolean", initialValue: false },
    { name: "isActive", title: "Active", type: "boolean", initialValue: true },
    { name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0 },
    { name: "image", title: "Service Image", type: "image", options: { hotspot: true } },
  ],
  orderings: [
    { title: "Sort Order", name: "sortOrderAsc", by: [{ field: "sortOrder", direction: "asc" }] },
    { title: "Category", name: "categoryAsc", by: [{ field: "category", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "image" },
  },
};

export default service;
