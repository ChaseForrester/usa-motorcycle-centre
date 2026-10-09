import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
    "About the Workshop · Est. 1992",
    "U.S.A. Motorcycle Centre has looked after Harley-Davidson riders across the Illawarra since 1992. Independent specialist at 8 Miall Way, Albion Park Rail. Laurie and Mick.",
    "/about"
);

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
