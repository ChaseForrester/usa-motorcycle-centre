import type { Metadata } from "next";
import { products } from "@/lib/seed";
import { JsonLd } from "@/components/JsonLd";
import { SITE, SITE_URL, absUrl, breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import ProductView from "./product-view";

type Props = { params: { slug: string } };

export function generateStaticParams() {
    return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) {
        return pageMeta("Parts", "That product is no longer on the rack.", "/shop");
    }
    const meta = pageMeta(product.name, product.description.slice(0, 160), `/shop/${product.slug}`);
    return {
        ...meta,
        openGraph: {
            ...meta.openGraph,
            images: [{ url: product.images[0], alt: product.name }],
        },
    };
}

export default function ProductPage({ params }: Props) {
    const product = products.find((p) => p.slug === params.slug);
    const json = product
        ? [
            breadcrumbJsonLd([
                { name: "Home", path: "/" },
                { name: "Shop", path: "/shop" },
                { name: product.name, path: `/shop/${product.slug}` },
            ]),
            {
                "@context": "https://schema.org",
                "@type": "Product",
                name: product.name,
                description: product.description,
                image: product.images.map((src) => absUrl(src)),
                brand: { "@type": "Brand", name: product.brand || SITE.name },
                sku: product.id,
                offers:
                    product.category === "Gift Cards"
                        ? {
                            "@type": "AggregateOffer",
                            priceCurrency: "AUD",
                            lowPrice: 100,
                            highPrice: 5000,
                            availability: "https://schema.org/InStock",
                            url: `${SITE_URL}/gift-cards`,
                            seller: { "@type": "Organization", name: SITE.name },
                        }
                        : {
                            "@type": "Offer",
                            priceCurrency: "AUD",
                            price: product.price,
                            availability: product.inStock
                                ? "https://schema.org/InStock"
                                : "https://schema.org/OutOfStock",
                            url: `${SITE_URL}/shop/${product.slug}`,
                            seller: { "@type": "Organization", name: SITE.name },
                        },
            },
        ]
        : [];

    return (
        <>
            {json.length > 0 && <JsonLd data={json} />}
            <ProductView />
        </>
    );
}
