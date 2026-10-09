import type { MetadataRoute } from "next";
import { DESCRIPTION, SITE } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: SITE.name,
        short_name: SITE.shortName,
        description: DESCRIPTION,
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#0B0B0C",
        theme_color: "#0B0B0C",
        lang: "en-AU",
        orientation: "any",
        categories: ["shopping", "lifestyle"],
        icons: [
            {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icons/icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icons/icon-maskable-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/icons/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
        ],
        screenshots: [
            {
                src: "/brand/og.jpg",
                sizes: "1200x630",
                type: "image/jpeg",
            },
        ],
    };
}
