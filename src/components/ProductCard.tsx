"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { money } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
    return (
        <Link href={`/shop/${product.slug}`} className="group card block">
            <div className="relative aspect-[4/5] overflow-hidden bg-ash">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                />
                {product.featured && (
                    <span className="absolute left-3 top-3 bg-flame px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
                        Shop favourite
                    </span>
                )}
            </div>
            <div className="p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-steel">{product.category}</p>
                <h3 className="mt-1 font-display text-xl uppercase tracking-wide text-white">
                    {product.name}
                </h3>
                <p className="mt-2 text-sm text-flame">{money(product.price)}</p>
            </div>
        </Link>
    );
}
