import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  page: "services",
  title: "Signature Services | Beauty Care by Nabila Lahore",
  description:
    "Explore our curated collection of luxury beauty services at Beauty Care by Nabila Lahore. From precision haircuts and colour artistry to advanced skincare and spa rituals, every service is a masterclass in excellence.",
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
