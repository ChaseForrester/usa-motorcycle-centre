import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
    "Book a Harley Service Illawarra",
    "Book the lift with Laurie or Mick at U.S.A. Motorcycle Centre, Albion Park Rail. Harley service, tyres, diagnostics and smash repairs for riders from Wollongong to Nowra.",
    "/book"
);

export default function BookLayout({ children }: { children: React.ReactNode }) {
    return children;
}
