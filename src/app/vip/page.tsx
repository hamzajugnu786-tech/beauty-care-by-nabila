import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import { VipPageContent } from "./VipPageContent";

export const metadata: Metadata = generatePageMetadata({
  page: "vip",
  title: "VIP Membership | Beauty Care by Nabila Lahore - Exclusive Privileges",
  description:
    "Join the exclusive VIP membership at Beauty Care by Nabila Lahore. Enjoy priority bookings, member-only rates, complimentary services, and personalized experiences reserved for our most valued clients.",
});

export default function VipPage() {
  return <VipPageContent />;
}
