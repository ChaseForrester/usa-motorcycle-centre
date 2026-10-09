"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { useCms } from "@/lib/cms-store";
import { useTenant } from "@/lib/commerce/tenant-context";
import { collectLabel } from "@/lib/commerce/tenants";

function ShopInner() {
    const products = useCms((s) => s.products);
    const tenant = useTenant();
    const params = useSearchParams();
    const [q, setQ] = useState(params.get("q") || "");

    const filtered = useMemo(() => {
        return products.filter((p) => {
            if (p.category === "Gift Cards") return false;
            return (
                !q ||
                `${p.name} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())
            );
        });
    }, [products, q]);

    return (
        <div className="container-page py-12">
            <p className="label">Shop</p>
            <h1 className="display mt-2 text-5xl text-white">Workshop shirts.</h1>
            <p className="mt-4 max-w-2xl text-chrome">
                The flame hoodie and crews with the original shop print. Ship, or {collectLabel(tenant)}.
                Service, tyres and smash work stay on the lift — book those with Laurie or Mick.
            </p>

            <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                    <Link href="/book" className="btn-ghost w-fit">
                        Book the workshop
                    </Link>
                    <Link href="/gift-cards" className="btn-ghost w-fit">
                        Gift cards $100–$5,000
                    </Link>
                </div>
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search shirts"
                    className="input md:max-w-xs"
                />
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>

            {filtered.length === 0 && (
                <p className="mt-12 text-steel">Nothing matches that search.</p>
            )}
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense>
            <ShopInner />
        </Suspense>
    );
}
