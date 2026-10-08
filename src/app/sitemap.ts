import type { MetadataRoute } from "next";
import { events, products } from "@/lib/seed";

export default function sitemap(): MetadataRoute.Sitemap {
    const base = "https://usamotorcyclecentre.com.au";
    const staticPaths = [
        "",
        "/shop",
        "/workshop",
        "/book",
        "/events",
        "/about",
        "/gallery",
        "/contact",
        "/gift-cards",
        "/specials",
    ];
    return [
        ...staticPaths.map((p) => ({ url: `${base}${p}`, lastModified: new Date() })),
        ...products.map((p) => ({ url: `${base}/shop/${p.slug}`, lastModified: new Date() })),
        ...events.map((e) => ({ url: `${base}/events/${e.slug}`, lastModified: new Date() })),
    ];
}
