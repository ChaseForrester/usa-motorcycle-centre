"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, ShoppingBag, X } from "lucide-react";
import { useCms } from "@/lib/cms-store";
import { cartCount, useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const links = [
    { href: "/shop", label: "Shirts" },
    { href: "/gift-cards", label: "Gift cards" },
    { href: "/workshop", label: "Workshop" },
    { href: "/book", label: "Book" },
    { href: "/account", label: "Account" },
    { href: "/contact", label: "Contact" },
];

export function Header() {
    const pathname = usePathname();
    const settings = useCms((s) => s.settings);
    const items = useCart((s) => s.items);
    const count = cartCount(items);
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => setOpen(false), [pathname]);

    return (
        <header
            className={cn(
                "sticky top-0 z-40 border-b transition",
                scrolled
                    ? "border-white/10 bg-ink/90 backdrop-blur-md"
                    : "border-transparent bg-ink/40 backdrop-blur-sm"
            )}
        >
            <div className="container-page flex h-[78px] items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src={settings.brand.logo}
                        alt={settings.brand.name}
                        width={52}
                        height={52}
                        className={cn(
                            "h-12 w-12 rounded-full bg-white object-contain",
                            settings.brand.logoInvert && "invert"
                        )}
                        priority
                    />
                    <span className="hidden leading-tight sm:block">
                        <span className="display block text-lg text-white">U.S.A.</span>
                        <span className="text-[10px] uppercase tracking-[0.28em] text-steel">
                            Motorcycle Centre
                        </span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-7 lg:flex">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={cn(
                                "text-[12px] uppercase tracking-[0.22em] transition hover:text-flame",
                                pathname === l.href || pathname.startsWith(l.href + "/")
                                    ? "text-flame"
                                    : "text-chrome"
                            )}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    <a
                        href={settings.contact.phoneHref}
                        className="hidden items-center gap-2 text-sm text-chrome hover:text-white md:flex"
                    >
                        <Phone className="h-4 w-4 text-flame" />
                        {settings.contact.phone}
                    </a>
                    <Link
                        href="/cart"
                        className="relative rounded-sm border border-white/15 p-2.5 hover:border-flame"
                        aria-label="Cart"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        {ready && count > 0 && (
                            <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-flame px-1 text-[10px] font-bold text-ink">
                                {count}
                            </span>
                        )}
                    </Link>
                    <Link href="/book" className="btn-flame hidden !px-4 !py-2.5 text-[11px] xl:inline-flex">
                        Book a service
                    </Link>
                    <button
                        className="rounded-sm border border-white/15 p-2.5 lg:hidden"
                        onClick={() => setOpen((v) => !v)}
                        aria-label="Menu"
                    >
                        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {open && (
                <div className="border-t border-white/10 bg-ink lg:hidden">
                    <nav className="container-page flex flex-col py-4">
                        {links.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="border-b border-white/5 py-3 text-sm uppercase tracking-[0.2em]"
                            >
                                {l.label}
                            </Link>
                        ))}
                        <Link href="/book" className="btn-flame mt-4">
                            Book a service
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}

export function AnnouncementBar() {
    const settings = useCms((s) => s.settings);
    if (!settings.homepage.announcement) return null;
    return (
        <div className="bg-flame text-ink">
            <div className="container-page flex items-center justify-center gap-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em]">
                {settings.homepage.announcement}
            </div>
        </div>
    );
}
