import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  page: "booking",
  title: "Book Your Appointment | Beauty Care by Nabila Lahore",
  description:
    "Book your luxury beauty appointment at Beauty Care by Nabila Lahore. Choose from our signature services, select your preferred artist, and reserve your slot in just a few steps.",
});

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
