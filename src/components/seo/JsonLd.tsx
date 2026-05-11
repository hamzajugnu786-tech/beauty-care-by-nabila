interface JsonLdProps {
  /**
   * A single schema.org JSON-LD object, or an array of them.
   * Each object must include "@context" and "@type" fields.
   */
  data: object | object[];
}

/**
 * Reusable JSON-LD component for injecting structured data into pages.
 *
 * - Accepts a single schema object or an array of schemas.
 * - When multiple schemas are provided, they are wrapped in a @graph.
 * - Renders as a <script type="application/ld+json"> tag.
 * - Compatible with both server and client components.
 *
 * @example
 * ```tsx
 * import { JsonLd } from "@/components/seo/JsonLd";
 * import { generateLocalBusinessSchema, generateWebSiteSchema } from "@/lib/structured-data";
 *
 * export default function Page() {
 *   return (
 *     <>
 *       <JsonLd data={generateLocalBusinessSchema()} />
 *       <JsonLd data={[generateWebSiteSchema(), generateFAQSchema()]} />
 *     </>
 *   );
 * }
 * ```
 */
export function JsonLd({ data }: JsonLdProps): React.ReactElement {
  const schemas = Array.isArray(data) ? data : [data];

  // If only a single schema, output it directly.
  // If multiple schemas, wrap them in a @graph for clean output.
  const jsonLd =
    schemas.length === 1
      ? schemas[0]
      : {
          "@context": "https://schema.org",
          "@graph": schemas,
        };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd, null, 0),
      }}
    />
  );
}
