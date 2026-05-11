import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { AccessibilityStatementContent } from "./AccessibilityStatementContent";

export const metadata: Metadata = {
  title: "Accessibility Statement | Beauty Care by Nabila Lahore",
  description:
    "Our commitment to making Beauty Care by Nabila Lahore accessible to everyone. Learn about our WCAG 2.1 AA compliance, accessibility features, and how to report issues.",
  alternates: {
    canonical: `${SITE_URL}/accessibility-statement`,
  },
  openGraph: {
    title: "Accessibility Statement | Beauty Care by Nabila Lahore",
    description:
      "Our commitment to making Beauty Care by Nabila Lahore accessible to everyone. WCAG 2.1 AA compliance and accessibility features.",
    url: `${SITE_URL}/accessibility-statement`,
  },
};

export default function AccessibilityStatementPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Accessibility Statement", url: `${SITE_URL}/accessibility-statement` },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-matte-black">
      <JsonLd data={breadcrumbSchema} />
      <Navbar />
      <main className="flex-1 pt-20" id="main-content">
        <AccessibilityStatementContent />
      </main>
      <Footer />
    </div>
  );
}
