import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import { GalleryPageContent } from "./GalleryPageContent";

export const metadata: Metadata = generatePageMetadata({
  page: "gallery",
  title: "Gallery | Beauty Care by Nabila Lahore - Portfolio & Transformations",
  description:
    "Browse our portfolio of stunning transformations at Beauty Care by Nabila Lahore. From bridal couture to editorial looks, see the artistry that has made us Lahore's most celebrated salon.",
});

export default function GalleryPage() {
  return <GalleryPageContent />;
}
