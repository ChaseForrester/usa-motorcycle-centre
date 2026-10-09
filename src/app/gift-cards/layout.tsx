import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
    "Gift Cards $100–$5,000 | U.S.A. Motorcycle Centre",
    "Workshop gift cards from $100 to $5,000. Redeem on Harley service, smash work, tyres or a U.S.A. MCC shirt at 8 Miall Way, Albion Park Rail.",
    "/gift-cards"
);

export default function GiftCardsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
