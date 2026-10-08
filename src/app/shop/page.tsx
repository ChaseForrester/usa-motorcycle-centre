"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { useCms } from "@/lib/cms-store";
import { cn, money } from "@/lib/utils";
import { useTenant } from "@/lib/commerce/tenant-context";
import { collectLabel } from "@/lib/commerce/tenants";

const TABS = [
    { id: "parts", label: "Parts" },
    { id: "tyres", label: "Tyres" },
    { id: "service", label: "Service" },
] as const;

type Tab = (typeof TABS)[number]["id"];

function isParts(category: string) {
    return ["Parts & Accessories", "Electrical", "Helmets", "Apparel", "Gift Cards"].includes(category);
}

function ShopInner() {
    const products = useCms((s) => s.products);
    const services = useCms((s) => s.services);
    const tenant = useTenant();
    const params = useSearchParams();
    const initial = (params.get("cat") as Tab) || "parts";
    const [tab, setTab] = useState<Tab>(TABS.some((t) => t.id === initial) ? initial : "parts");
    const [q, setQ] = useState("");

    const filtered = useMemo(() => {
        return products.filter((p) => {
            const okTab =
                tab === "tyres"
                    ? p.category === "Tyres"
                    : tab === "parts"
                        ? isParts(p.category)
                        : false;
            const okQ =
                !q || `${p.name} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase());
            return okTab && okQ;
        });
    }, [products, tab, q]);

    const serviceHits = useMemo(() => {
        if (tab !== "service") return [];
        return services.filter(
            (s) =>
                !q ||
                `${s.name} ${s.summary} ${s.description}`.toLowerCase().includes(q.toLowerCase())
        );
    }, [services, tab, q]);

    return (
        <div className="container-page py-12">
            <p className="label">Shop</p>
            <h1 className="display mt-2 text-5xl text-white">Parts, tyres, service.</h1>
            <p className="mt-4 max-w-2xl text-chrome">
                Ship, or {collectLabel(tenant)}. Oils, aerosols, loose lithium, tyres and whole bikes stay
                on a collect or a freight quote if they are leaving Australia.
            </p>

            <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={cn(
                                "rounded-sm border px-3 py-1.5 text-[11px] uppercase tracking-[0.18em]",
                                tab === t.id
                                    ? "border-flame bg-flame text-ink"
                                    : "border-white/15 text-chrome hover:border-flame"
                            )}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search"
                    className="input md:max-w-xs"
                />
            </div>

            {tab !== "service" && (
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {filtered.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}

            {tab === "service" && (
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {serviceHits.map((s) => (
                        <article key={s.id} className="card p-6">
                            <h2 className="display text-2xl text-white">{s.name}</h2>
                            <p className="mt-2 text-sm text-chrome">{s.summary}</p>
                            {s.fromPrice != null && (
                                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-steel">
                                    from {money(s.fromPrice)}
                                </p>
                            )}
                            <Link href="/book" className="btn-ghost mt-6 inline-flex">
                                Book
                            </Link>
                        </article>
                    ))}
                </div>
            )}

            {tab !== "service" && filtered.length === 0 && (
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
