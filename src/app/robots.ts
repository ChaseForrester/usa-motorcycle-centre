import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
    const disallow = ["/admin", "/api", "/platform", "/account", "/checkout", "/cart"];
    return {
        rules: [
            { userAgent: "*", allow: "/", disallow },
            { userAgent: "GPTBot", allow: "/" },
            { userAgent: "ChatGPT-User", allow: "/" },
            { userAgent: "PerplexityBot", allow: "/" },
            { userAgent: "ClaudeBot", allow: "/" },
            { userAgent: "Google-Extended", allow: "/" },
            { userAgent: "Applebot-Extended", allow: "/" },
            { userAgent: "Bingbot", allow: "/" },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
