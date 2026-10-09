"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, MapPin, Phone, Shield, ShoppingBag } from "lucide-react";
import { useCms } from "@/lib/cms-store";
import { cn, telHref } from "@/lib/utils";

const tabs = [
    { href: "/", label: "Home", icon: Shield },
    { href: "/workshop", label: "Workshop", icon: ShoppingBag },
    { href: "/shop", label: "Gear", icon: MapPin },
    { href: "/book", label: "Book", icon: Heart },
    { href: "tel", label: "Call", icon: Phone },
];

export function MobileTabBar() {
    const pathname = usePathname();
    const phone = useCms((s) => s.settings.contact.phone);

    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 backdrop-blur-md lg:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            aria-label="Primary"
        >
            <ul className="grid grid-cols-5">
                {tabs.map((tab) => {
                    const active =
                        tab.href === "/"
                            ? pathname === "/"
                            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
                    const Icon = tab.icon;
                    const className = cn(
                        "flex flex-col items-center gap-1 px-1 py-2.5 text-[9px] font-semibold uppercase tracking-[0.14em]",
                        active ? "text-flame" : "text-steel"
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
