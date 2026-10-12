import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
    "Shirts and jumpers",
    "Shop the U.S.A. Motorcycle Centre flame hoodie and crews. Click and collect at 8 Miall Way, Albion Park Rail, or ship.",
    "/shop"
);

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return children;
}
