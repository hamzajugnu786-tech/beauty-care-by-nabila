// ─── Sanity Schema: Gallery Image ───

const galleryImage = {
  name: "galleryImage",
  title: "Gallery Image",
  type: "document" as const,
  fields: [
    { name: "image", title: "Image", type: "image", validation: (Rule: any) => Rule.required(), options: { hotspot: true } },
    { name: "alt", title: "Alt Text", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "category", title: "Category", type: "string", options: {
      list: ["bridal", "hair", "makeup", "skincare", "nails", "spa", "transformation"],
    }, validation: (Rule: any) => Rule.required() },
    { name: "height", title: "Display Height", type: "string", options: {
      list: [
        { title: "Tall", value: "tall" },
        { title: "Medium", value: "medium" },
        { title: "Short", value: "short" },
      ],
    }, initialValue: "medium" },
    { name: "featured", title: "Featured", type: "boolean", initialValue: false },
    { name: "uploadedAt", title: "Uploaded At", type: "datetime" },
    { name: "cloudinaryId", title: "Cloudinary ID", type: "string" },
  ],
  preview: {
    select: { title: "alt", subtitle: "category", media: "image" },
  },
};

export default galleryImage;
