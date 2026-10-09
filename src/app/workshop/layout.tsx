import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
    "Harley Service & Smash Repairs Illawarra",
    "Harley® service, smash repairs, tyre fitting and diagnostics at 8 Miall Way, Albion Park Rail. Independent workshop for Wollongong, Shellharbour, Kiama and Nowra. Call (02) 4257 2333.",
    "/workshop"
);

export default function WorkshopLayout({ children }: { children: React.ReactNode }) {
    return children;
}
