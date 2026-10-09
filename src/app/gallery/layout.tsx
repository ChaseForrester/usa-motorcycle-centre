import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
    "Workshop Gallery",
    "The lift, the tyre racks and the parts wall at U.S.A. Motorcycle Centre, 8 Miall Way, Albion Park Rail.",
    "/gallery"
);

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
    return children;
}
