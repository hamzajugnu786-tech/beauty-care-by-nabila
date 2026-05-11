// ─── Sanity Schema: Staff Member ───

const staffMember = {
  name: "staffMember",
  title: "Staff Member",
  type: "document" as const,
  fields: [
    { name: "name", title: "Name", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "title", title: "Title / Role", type: "string", description: "e.g. 'Senior Bridal Artist'" },
    { name: "bio", title: "Bio", type: "text", rows: 4 },
    { name: "specialties", title: "Specialties", type: "array", of: [{ type: "string" }] },
    { name: "experience", title: "Experience", type: "string", description: "e.g. '10+ years'" },
    { name: "image", title: "Profile Image", type: "image", options: { hotspot: true } },
    { name: "rating", title: "Rating", type: "number", validation: (Rule: any) => Rule.min(0).max(5), initialValue: 5.0 },
    { name: "isActive", title: "Active", type: "boolean", initialValue: true },
    { name: "branch", title: "Branch", type: "string" },
    { name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0 },
  ],
  preview: {
    select: { title: "name", subtitle: "title", media: "image" },
  },
};

export default staffMember;
