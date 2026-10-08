import type { Metadata } from "next";
import { Barlow, Oswald } from "next/font/google";
import { Providers } from "@/components/Providers";
import { StoreChrome } from "@/components/StoreChrome";
import { defaultSettings } from "@/lib/seed";
import { tenantFromRequest } from "@/lib/commerce/server-tenant";
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

export const metadata: Metadata = {
  title: defaultSettings.seo.title,
  description: defaultSettings.seo.description,
  keywords: defaultSettings.seo.keywords,
  openGraph: {
    title: defaultSettings.seo.title,
    description: defaultSettings.seo.description,
    type: "website",
    locale: "en_AU",
    images: [{ url: "/workshop/chopper-build.jpg" }],
  },
  icons: { icon: "/brand/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tenant = tenantFromRequest();
  return (
    <html lang="en-AU">
      <body className={`${display.variable} ${body.variable} font-body`}>
        <Providers tenant={tenant}>
          <StoreChrome>{children}</StoreChrome>
        </Providers>
      </body>
    </html>
  );
}
