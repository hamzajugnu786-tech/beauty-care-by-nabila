// ─── Sanity Schema: Author ───

const author = {
  name: "author",
  title: "Author",
  type: "document" as const,
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
    },
    {
      name: "image",
      title: "Profile Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alt Text" },
      ],
    },
    {
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 3,
    },
    {
      name: "role",
      title: "Role",
      type: "string",
      description: "e.g. 'Senior Beauty Editor', 'Bridal Stylist'",
    },
    {
      name: "social",
      title: "Social Links",
      type: "object",
      fields: [
        { name: "instagram", type: "string", title: "Instagram" },
        { name: "twitter", type: "string", title: "Twitter" },
      ],
    },
  ],
  preview: {
    select: { title: "name", media: "image" },
  },
};

export default author;
