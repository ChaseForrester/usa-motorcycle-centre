"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { useCms } from "@/lib/cms-store";

export default function GiftCardsPage() {
    const products = useCms((s) => s.products).filter((p) => p.category === "Gift Cards");
    return (
        <div className="container-page py-12">
            <p className="label">Gift cards</p>
            <h1 className="display mt-2 text-5xl text-white">Put it toward a service, a hoodie, or oil.</h1>
            <p className="mt-4 max-w-xl text-chrome">
                Printed in-store or emailed at checkout. Redeem on apparel, parts or workshop time.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
            <Link href="/shop" className="btn-ghost mt-10 inline-flex">
                Whole shop
            </Link>
        </div>
    );
}
