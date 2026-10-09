import type { MetadataRoute } from "next";
import { events, products } from "@/lib/seed";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }[] =
        [
            { path: "", priority: 1, changeFrequency: "weekly" },
            { path: "/workshop", priority: 0.95, changeFrequency: "weekly" },
            { path: "/shop", priority: 0.9, changeFrequency: "weekly" },
            { path: "/book", priority: 0.9, changeFrequency: "monthly" },
            { path: "/faq", priority: 0.85, changeFrequency: "monthly" },
            { path: "/contact", priority: 0.85, changeFrequency: "monthly" },
            { path: "/about", priority: 0.8, changeFrequency: "monthly" },
            { path: "/events", priority: 0.7, changeFrequency: "weekly" },
            { path: "/gallery", priority: 0.6, changeFrequency: "monthly" },
            { path: "/gift-cards", priority: 0.8, changeFrequency: "weekly" },
            { path: "/specials", priority: 0.5, changeFrequency: "weekly" },
            { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
            { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
        ];

    return [
        ...pages.map((p) => ({
            url: `${SITE_URL}${p.path}`,
            lastModified: now,
            changeFrequency: p.changeFrequency,
            priority: p.priority,
        })),
        ...products.map((p) => ({
            url: `${SITE_URL}/shop/${p.slug}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.7,
        })),
        ...events.map((e) => ({
            url: `${SITE_URL}/events/${e.slug}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.5,
        })),
    ];
}
