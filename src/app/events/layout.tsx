import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
    "Rides & Events Illawarra",
    "Saturday workshop mornings, Illawarra Harley catch-ups and community events from U.S.A. Motorcycle Centre, Albion Park Rail.",
    "/events"
);

export default function EventsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
