"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, Phone, ShoppingBag } from "lucide-react";
import { Linkified } from "@/components/Linkified";
import { useCms } from "@/lib/cms-store";
import { cartCount, useCart } from "@/lib/cart";
import { cn, mailHref, telHref } from "@/lib/utils";

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
    const [scrolled, setScrolled] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const siteHost = "usamotorcyclecentre.com.au";

    return (
        <header
            className={cn(
                "sticky top-0 z-40 border-b transition",
                scrolled
                    ? "border-white/10 bg-ink/95 backdrop-blur-md"
                    : "border-transparent bg-ink lg:bg-ink/40 lg:backdrop-blur-sm"
            )}
        >
            <div className="flex items-center justify-between gap-3 px-4 py-3 lg:hidden">
                <Link href="/" aria-label={settings.brand.name} className="shrink-0">
                    <Image
                        src="/brand/logo.png"
                        alt=""
                        width={168}
                        height={135}
                        className="h-16 w-auto max-w-[42vw] invert"
                        priority
                    />
                </Link>
                <div className="min-w-0 text-right leading-tight">
                    <a href={telHref(settings.contact.phone)} className="contact-link block text-sm text-chrome">
                        {settings.contact.phone}
                    </a>
                    <p className="mt-1 truncate text-[10px] text-steel">{siteHost}</p>
                </div>
            </div>

            <div className="container-page hidden h-[78px] items-center justify-between gap-4 lg:flex">
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

                <nav className="flex items-center gap-7">
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
                        href={telHref(settings.contact.phone)}
                        className="contact-link hidden items-center gap-2 text-sm text-chrome md:flex"
                    >
                        <Phone className="h-4 w-4 text-flame" />
                        {settings.contact.phone}
                    </a>
                    <a
                        href={mailHref(settings.contact.email)}
                        className="hidden rounded-sm border border-white/15 p-2.5 hover:border-flame md:grid"
                        aria-label={`Email ${settings.contact.email}`}
                    >
                        <Mail className="h-4 w-4" />
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
                    <Link href="/book" className="btn-flame hidden !rounded-md !px-4 !py-2.5 text-[11px] lg:inline-flex">
                        Book a service
                    </Link>
                </div>
            </div>

        </header>
    );
}

export function AnnouncementBar() {
    const settings = useCms((s) => s.settings);
    if (!settings.homepage.announcement) return null;
    return (
        <div className="announce-bar bg-flame text-ink">
            <div className="container-page flex items-center justify-center gap-3 py-1.5 text-center text-[10px] font-semibold uppercase leading-snug tracking-normal lg:py-2 lg:text-[11px] lg:tracking-[0.18em]">
                <Linkified text={settings.homepage.announcement} linkClassName="contact-link-bar" />
            </div>
        </div>
    );
}
