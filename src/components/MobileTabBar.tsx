"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Newspaper, Phone, Shield, Shirt, Sparkles } from "lucide-react";
import { useCms } from "@/lib/cms-store";
import { cn, telHref } from "@/lib/utils";

const tabs = [
    { href: "/", label: "Home", icon: Shield },
    { href: "/shop?cat=Shirts", label: "Shirts", icon: Shirt },
    { href: "/shop?cat=Jumpers", label: "Jumpers", icon: Sparkles },
    { href: "/blog", label: "Blog", icon: Newspaper },
    { href: "tel", label: "Call", icon: Phone },
];

function SearchSync({ onChange }: { onChange: (search: string) => void }) {
    const params = useSearchParams();
    const value = params.toString();
    useEffect(() => {
        onChange(value ? `?${value}` : "");
    }, [value, onChange]);
    return null;
}

export function MobileTabBar() {
    const pathname = usePathname();
    const phone = useCms((s) => s.settings.contact.phone);
    const products = useCms((s) => s.products);
    const [search, setSearch] = useState("");
    const product = products.find((item) => pathname === `/shop/${item.slug}`);
    const cat = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search).get("cat");

    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-40 overflow-hidden border-t-[3px] border-[#FF1414] bg-ink/95 backdrop-blur-md lg:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            aria-label="Primary"
        >
            <Suspense fallback={null}>
                <SearchSync onChange={setSearch} />
            </Suspense>
            <ul className="grid grid-cols-5">
                {tabs.map((tab) => {
                    const active =
                        tab.href === "/"
                            ? pathname === "/"
                            : tab.href.startsWith("/blog")
                                ? pathname === "/blog" || pathname.startsWith("/blog/")
                                : tab.href.includes("Jumpers")
                                    ? product?.category === "Jumpers" || (pathname === "/shop" && cat === "Jumpers")
                                    : tab.href.includes("Shirts")
                                        ? product?.category === "Shirts" || (pathname === "/shop" && cat === "Shirts")
                                        : false;
                    const Icon = tab.icon;
                    const className = cn(
                        "flex min-h-11 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-semibold uppercase tracking-[0.08em]",
                        active ? "text-[#FF6262]" : "text-white/80"
                    );
                    const icon = <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />;
                    return (
                        <li key={tab.label}>
                            {tab.href === "tel" ? (
                                <a href={telHref(phone)} className={className}>
                                    {icon}
                                    {tab.label}
                                </a>
                            ) : (
                                <Link href={tab.href} className={className}>
                                    {icon}
                                    {tab.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
