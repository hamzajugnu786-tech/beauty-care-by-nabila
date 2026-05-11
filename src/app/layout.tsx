import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Beauty Care by Nabila Lahore | Luxury Salon & Bridal Studio",
  description:
    "Experience world-class luxury beauty at Beauty Care by Nabila Lahore. Premium bridal studio, signature services, and exclusive VIP memberships in the heart of Lahore.",
  keywords: [
    "luxury salon Lahore",
    "bridal studio Lahore",
    "Nabila Lahore",
    "premium beauty salon",
    "VIP membership salon",
    "best bridal makeup Lahore",
  ],
  authors: [{ name: "Beauty Care by Nabila Lahore" }],
  openGraph: {
    title: "Beauty Care by Nabila Lahore | Luxury Salon & Bridal Studio",
    description:
      "Experience world-class luxury beauty. Premium bridal studio, signature services, and exclusive VIP memberships.",
    type: "website",
    locale: "en_PK",
    siteName: "Beauty Care by Nabila Lahore",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beauty Care by Nabila Lahore | Luxury Salon & Bridal Studio",
    description:
      "Experience world-class luxury beauty. Premium bridal studio, signature services, and exclusive VIP memberships.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${cormorant.variable} antialiased bg-matte-black text-text-primary`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
