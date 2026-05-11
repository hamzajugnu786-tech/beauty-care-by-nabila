import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import { ContactPageContent } from "./ContactPageContent";

export const metadata: Metadata = generatePageMetadata({
  page: "contact",
  title: "Contact | Beauty Care by Nabila Lahore - Appointments & Location",
  description:
    "Get in touch with Beauty Care by Nabila Lahore. Visit us at M.M. Alam Road, Gulberg III, Lahore, or call +92-300-1234567. We look forward to crafting your perfect beauty experience.",
});

export default function ContactPage() {
  return <ContactPageContent />;
}
