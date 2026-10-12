"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
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
    const cat = params.get("cat") || "All";
    const [q, setQ] = useState(params.get("q") || "");

    useEffect(() => {
        setQ(params.get("q") || "");
    }, [params]);

    const filtered = useMemo(() => {
        return products.filter((p) => {
            if (p.category !== "Shirts" && p.category !== "Jumpers") return false;
            if (cat === "Shirts" || cat === "Jumpers") {
                if (p.category !== cat) return false;
            }
            return (
                !q ||
                `${p.name} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())
            );
        });
    }, [products, q, cat]);

    return (
        <div className="container-page py-12">
            <p className="label">The rack</p>
            <h1 className="display mt-2 text-5xl text-[#000B58]">Shirts and jumpers.</h1>
            <p className="mt-4 max-w-2xl text-[#000B58]/80">
                The flame hoodie and the two crews. Ship, or {collectLabel(tenant)}.
            </p>

            <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                    {[
                        ["All", "/shop"],
                        ["Shirts", "/shop?cat=Shirts"],
                        ["Jumpers", "/shop?cat=Jumpers"],
                    ].map(([label, href]) => (
                        <Link
                            key={label}
                            href={href}
                            className={`inline-flex min-h-11 items-center border px-4 text-xs font-semibold uppercase tracking-[0.16em] ${(label === "All" && cat === "All") || label === cat
                                ? "border-[#C40000] bg-[#C40000] !text-white"
                                : "border-[#000B58] text-[#000B58]"
                                }`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search the rack"
                    aria-label="Search the rack"
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
