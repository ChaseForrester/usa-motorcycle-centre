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
  shareCard,
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
    { media: "(prefers-color-scheme: light)", color: "#000B58" },
    { media: "(prefers-color-scheme: dark)", color: "#000B58" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
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
  category: "Apparel",
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
        url: shareCard(TITLE, DESCRIPTION),
        width: 1200,
        height: 630,
        alt: "Harley shirts and jumpers from U.S.A. Motorcycle Centre",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [shareCard(TITLE, DESCRIPTION)],
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
