import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
    "8 Miall Way, Albion Park Rail NSW 2527",
    "Find U.S.A. Motorcycle Centre at 8 Miall Way, Albion Park Rail. Phone (02) 4257 2333. Mon–Fri 8am–5pm, Sat 8am–12pm. Harley workshop for Wollongong to Nowra.",
    "/contact"
);

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
