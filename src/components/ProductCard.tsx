"use client";

import Image from "next/image";
import Link from "next/link";
import { GiftCardMotion } from "@/components/GiftCardMotion";
import type { Product } from "@/lib/types";
import { isRemoteProductSrc, money } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
    const isGift = product.category === "Gift Cards";
    const src = product.images[0] || "/brand/icon.png";
    const from = Math.min(
        product.price,
        ...(product.variants?.map((v) => v.price ?? product.price) ?? [])
    );
    return (
        <Link href={isGift ? "/gift-cards" : `/shop/${product.slug}`} className="group card block">
            <div
                className={
                    isGift
                        ? "relative aspect-[16/10] overflow-hidden bg-ash"
                        : "relative aspect-[4/5] overflow-hidden bg-[#ECECEC]"
                }
            >
                {isGift ? (
                    <GiftCardMotion />
                ) : (
                    <Image
                        src={src}
                        alt={product.name}
                        fill
                        className="object-contain transition duration-500 group-hover:scale-[1.03]"
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        unoptimized={isRemoteProductSrc(src)}
                    />
                )}
            </div>
            <div className="p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-steel">{product.category}</p>
                <h3 className="mt-1 font-display text-xl uppercase tracking-wide text-white">
                    {product.name}
                </h3>
                <p className="mt-2 text-sm text-[#FF6262]">
                    {isGift ? `from ${money(from)}` : money(product.price)}
                </p>
            </div>
        </Link>
    );
}
