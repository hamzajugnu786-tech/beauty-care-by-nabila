import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/Providers";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  SITE_URL,
  SITE_NAME,
  OG_IMAGE_URL,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  VERIFICATION_TAGS,
} from "@/lib/seo";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/structured-data";

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

// ─── VIEWPORT CONFIGURATION ───
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0C0C10",
};

// ─── ENHANCED ROOT METADATA ───
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Luxury Salon & Bridal Studio`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Experience world-class luxury beauty at Beauty Care by Nabila Lahore. Premium bridal studio, signature services, and exclusive VIP memberships on M.M. Alam Road, Gulberg III, Lahore.",
  keywords: [
    "luxury salon Lahore",
    "bridal studio Lahore",
    "Nabila Lahore",
    "premium beauty salon",
    "VIP membership salon",
    "best bridal makeup Lahore",
    "hair salon Gulberg Lahore",
    "M.M. Alam Road salon",
    "skincare treatments Lahore",
    "spa services Lahore",
    "nail art Lahore",
    "beauty care by Nabila",
    "bridal packages Lahore",
    "luxury beauty Pakistan",
    "Pakistani bridal makeup",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-PK": SITE_URL,
      "en": SITE_URL,
    },
  },
  openGraph: {
    title: `${SITE_NAME} | Luxury Salon & Bridal Studio`,
    description:
      "Experience world-class luxury beauty. Premium bridal studio, signature services, and exclusive VIP memberships on M.M. Alam Road, Lahore.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_PK",
    type: "website",
    images: [
      {
        url: OG_IMAGE_URL,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: `${SITE_NAME} - Luxury Salon & Bridal Studio on M.M. Alam Road, Lahore`,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Luxury Salon & Bridal Studio`,
    description:
      "Experience world-class luxury beauty. Premium bridal studio, signature services, and exclusive VIP memberships.",
    images: [OG_IMAGE_URL],
    creator: "@nabilalahore",
    site: "@nabilalahore",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: VERIFICATION_TAGS.google,
    yandex: VERIFICATION_TAGS.yandex,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  category: "beauty",
  classification: "Beauty & Wellness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <JsonLd data={[generateOrganizationSchema(), generateWebSiteSchema()]} />
      </head>
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
