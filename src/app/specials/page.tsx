"use client";

import { ProductCard } from "@/components/ProductCard";
import { useCms } from "@/lib/cms-store";

export default function SpecialsPage() {
    const products = useCms((s) => s.products).filter((p) => p.featured);
    const discounts = useCms((s) => s.discounts).filter((d) => d.active);
    return (
        <div className="container-page py-12">
            <p className="label">Specials</p>
            <h1 className="display mt-2 text-5xl text-white">On the rack this month.</h1>
            {discounts.length > 0 && (
                <div className="mt-6 rounded-sm border border-flame/40 bg-flame/10 p-5">
                    {discounts.map((d) => (
                        <p key={d.id} className="text-chrome">
                            Use <span className="font-mono text-flame">{d.code}</span> at checkout
                            {d.type === "percent" ? ` for ${d.value}% off` : ` for $${d.value} off`}.
                        </p>
                    ))}
                </div>
            )}
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
    );
}
