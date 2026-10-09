"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { GiftAmountPicker } from "@/components/GiftAmountPicker";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/cart";
import { useCms } from "@/lib/cms-store";
import { cn, isRemoteProductSrc, money } from "@/lib/utils";

export default function ProductView() {
    const { slug } = useParams<{ slug: string }>();
    const router = useRouter();
    const products = useCms((s) => s.products);
    const product = products.find((p) => p.slug === slug);
    const add = useCart((s) => s.add);
    const [img, setImg] = useState(0);
    const [variant, setVariant] = useState(product?.variants?.[0]?.id ?? "");
    const selected = product?.variants?.find((v) => v.id === variant);

    const isGift = product?.category === "Gift Cards";
    const related = useMemo(
        () =>
            products
                .filter(
                    (p) =>
                        p.id !== product?.id &&
                        (isGift ? p.category !== "Gift Cards" : p.category === product?.category)
                )
                .slice(0, 4),
        [products, product, isGift]
    );

    if (!product) {
        return (
            <div className="container-page py-24">
                <p className="text-chrome">That product is no longer on the rack.</p>
                <Link href="/shop" className="btn-ghost mt-6 inline-flex">
                    Back to shop
                </Link>
            </div>
        );
    }

    return (
        <div className="container-page py-12">
            <p className="text-xs uppercase tracking-[0.2em] text-steel">
                <Link href={isGift ? "/gift-cards" : "/shop"} className="hover:text-flame">
                    {isGift ? "Gift cards" : "Shop"}
                </Link>{" "}
                / {product.category}
            </p>
            <div className="mt-6 grid gap-10 lg:grid-cols-2">
                <div>
                    <div
                        className={cn(
                            "relative overflow-hidden rounded-sm bg-ash",
                            isGift ? "aspect-[16/9]" : "aspect-[4/5]"
                        )}
                    >
                        <Image
                            src={product.images[img] ?? product.images[0] ?? "/brand/icon.png"}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                            unoptimized={isRemoteProductSrc(
                                product.images[img] ?? product.images[0] ?? ""
                            )}
                        />
                    </div>
                    {product.images.length > 1 && (
                        <div className="mt-3 grid grid-cols-4 gap-2">
                            {product.images.map((src, i) => (
                                <button
                                    key={src}
                                    onClick={() => setImg(i)}
                                    className={cn(
                                        "relative aspect-square overflow-hidden rounded-sm border",
                                        img === i ? "border-flame" : "border-white/10"
                                    )}
                                >
                                    <Image
                                        src={src}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        unoptimized={isRemoteProductSrc(src)}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <p className="label">{product.brand || product.category}</p>
                    <h1 className="display mt-2 text-4xl text-white sm:text-5xl">{product.name}</h1>
                    {product.subtitle && <p className="mt-2 text-steel">{product.subtitle}</p>}
                    <p className="mt-6 leading-relaxed text-chrome">{product.description}</p>

                    {isGift ? (
                        <GiftAmountPicker product={product} />
                    ) : (
                        <>
                            <p className="mt-5 font-display text-3xl text-flame">{money(product.price)}</p>
                            <p className="mt-1 text-xs text-steel">AUD · GST included</p>
                            {product.variants && product.variants.length > 0 && (
                                <div className="mt-8">
                                    <p className="text-xs uppercase tracking-[0.2em] text-steel">Size</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {product.variants.map((v) => {
                                            const soldOut = typeof v.stock === "number" && v.stock <= 0;
                                            return (
                                                <button
                                                    key={v.id}
                                                    onClick={() => setVariant(v.id)}
                                                    disabled={soldOut}
                                                    className={cn(
                                                        "min-w-12 rounded-sm border px-3 py-2 text-sm",
                                                        variant === v.id
                                                            ? "border-flame bg-flame text-ink"
                                                            : "border-white/15 text-chrome",
                                                        soldOut && "cursor-not-allowed opacity-40"
                                                    )}
                                                >
                                                    {v.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <button
                                className="btn-flame mt-8 w-full sm:w-auto"
                                onClick={() => {
                                    add(
                                        product,
                                        1,
                                        selected ? { id: selected.id, label: selected.label } : undefined
                                    );
                                    router.push("/cart");
                                }}
                            >
                                Add to cart
                            </button>
                            <p className="mt-4 text-sm text-steel">
                                Click & collect at 8 Miall Way, Albion Park Rail — or Australia Post.
                            </p>
                        </>
                    )}
                    {product.details && (
                        <ul className="mt-8 space-y-2 text-sm text-chrome">
                            {product.details.map((d) => (
                                <li key={d}>— {d}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            {related.length > 0 && (
                <div className="mt-20">
                    <h2 className="display text-3xl text-white">You might also throw on</h2>
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {related.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
