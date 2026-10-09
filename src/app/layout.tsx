import type { Metadata, Viewport } from "next";
import { Barlow, Oswald } from "next/font/google";
import { Providers } from "@/components/Providers";
import { StoreChrome } from "@/components/StoreChrome";
import { JsonLd } from "@/components/JsonLd";
import { PwaRegister } from "@/components/PwaRegister";
import { tenantFromRequest } from "@/lib/commerce/server-tenant";
import {
  DESCRIPTION,
  KEYWORDS,
  SITE,
  SITE_URL,
  TITLE,
  faqJsonLd,
  localBusinessJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const display = Oswald({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const body = Barlow({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0B0B0C" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0C" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE.name}`,
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Motorcycle repair",
  alternates: { canonical: SITE_URL },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    siteName: SITE.name,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: "U.S.A. Motorcycle Centre shop floor at 8 Miall Way, Albion Park Rail",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [SITE.ogImage],
  },
  appleWebApp: {
    capable: true,
    title: SITE.shortName,
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: true, address: true, email: true },
  other: {
    "geo.region": "AU-NSW",
    "geo.placename": "Albion Park Rail",
    "geo.position": `${SITE.lat};${SITE.lng}`,
    ICBM: `${SITE.lat}, ${SITE.lng}`,
  },
  icons: {
    icon: [
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/icons/icon-32.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tenant = tenantFromRequest();
  return (
    <html lang="en-AU">
      <body className={`${display.variable} ${body.variable} font-body`}>
        <JsonLd data={[localBusinessJsonLd(), websiteJsonLd(), faqJsonLd()]} />
        <Providers tenant={tenant}>
          <PwaRegister />
          <StoreChrome>{children}</StoreChrome>
        </Providers>
      </body>
    </html>
  );
}
