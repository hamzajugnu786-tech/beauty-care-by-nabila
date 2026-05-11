// ─── Sanity Schema: SEO Fields (Reusable Object) ───

const seoFields = {
  name: "seoFields",
  title: "SEO Fields",
  type: "object" as const,
  fields: [
    {
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Recommended: 50-60 characters",
      validation: (Rule: any) => Rule.max(70),
    },
    {
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 2,
      description: "Recommended: 150-160 characters",
      validation: (Rule: any) => Rule.max(170),
    },
    {
      name: "ogImage",
      title: "OG Image",
      type: "image",
      description: "Recommended: 1200x630px",
      options: { hotspot: true },
    },
    {
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
    },
    {
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    },
    {
      name: "noIndex",
      title: "No Index",
      type: "boolean",
      initialValue: false,
      description: "Prevent search engines from indexing this page",
    },
  ],
};

export default seoFields;
