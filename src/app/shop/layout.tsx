import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
    "U.S.A. MCC Shirts | Flame Hoodie & Crews",
    "Shop the U.S.A. Motorcycle Centre flame hoodie and crews. Collect at 8 Miall Way, Albion Park Rail or ship. Workshop bookings stay on /book.",
    "/shop"
);

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return children;
}
