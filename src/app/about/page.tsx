import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import { AboutPageContent } from "./AboutPageContent";

export const metadata: Metadata = generatePageMetadata({
  page: "about",
  title: "About | Beauty Care by Nabila Lahore - Our Story & Team",
  description:
    "Learn about the vision, heritage, and artisan team behind Beauty Care by Nabila Lahore. 18 years of excellence, 2,500+ brides transformed, and an unwavering commitment to beauty on M.M. Alam Road, Gulberg III.",
});

export default function AboutPage() {
  return <AboutPageContent />;
}
