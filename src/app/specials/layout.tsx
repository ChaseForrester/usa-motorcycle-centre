import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
    "Workshop Specials",
    "Current specials at U.S.A. Motorcycle Centre, Albion Park Rail. Harley service, tyres and shop gear for the Illawarra.",
    "/specials"
);

export default function SpecialsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
