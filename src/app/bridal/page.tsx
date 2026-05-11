import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import { BridalPageContent } from "./BridalPageContent";

export const metadata: Metadata = generatePageMetadata({
  page: "bridal",
  title: "Bridal Studio | Beauty Care by Nabila Lahore - Bespoke Bridal Packages",
  description:
    "Discover Lahore's most prestigious bridal studio at Beauty Care by Nabila Lahore. Bespoke bridal packages from PKR 85,000, internationally trained artists, and a transformation experience trusted by over 2,500 brides.",
});

export default function BridalPage() {
  return <BridalPageContent />;
}
