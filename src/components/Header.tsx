"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { Mail, MapPin, Phone, Search, ShoppingBag } from "lucide-react";
import { Linkified } from "@/components/Linkified";
import { useCms } from "@/lib/cms-store";
import { cartCount, useCart } from "@/lib/cart";
import { cn, mailHref, telHref } from "@/lib/utils";

const links = [
    { href: "/", label: "Home" },
    { href: "/shop?cat=Shirts", label: "Shirts" },
    { href: "/shop?cat=Jumpers", label: "Jumpers" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

const iconBtn =
    "grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white transition hover:border-[#C40000] hover:bg-[#C40000]";

function QuerySync({ onChange }: { onChange: (search: string) => void }) {
    const params = useSearchParams();
    const value = params.toString();
    useEffect(() => {
        onChange(value ? `?${value}` : "");
    }, [value, onChange]);
    return null;
}

function linkActive(pathname: string, search: string, href: string) {
    const qIndex = href.indexOf("?");
    const path = qIndex === -1 ? href : href.slice(0, qIndex);
    const query = qIndex === -1 ? "" : href.slice(qIndex + 1);
    if (query) {
        if (pathname !== path) return false;
        const want = new URLSearchParams(query);
        const have = new URLSearchParams(search);
        let matches = true;
        want.forEach((value, key) => {
            if (have.get(key) !== value) matches = false;
        });
        return matches;
    }
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
}

function FacebookGlyph() {
    return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden fill="currentColor">
            <path d="M14.2 8.5V6.9c0-.6.4-.8 1-.8h1.3V4h-2C12.4 4 11.2 5.2 11.2 7.1v1.4H9.4v2.4h1.8V20h2.6v-9.1h2.1l.3-2.4h-2.4z" />
        </svg>
    );
}

function InstagramGlyph() {
    return (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="4" width="16" height="16" rx="4" />
            <circle cx="12" cy="12" r="3.4" />
            <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
        </svg>
    );
}

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const settings = useCms((s) => s.settings);
    const items = useCart((s) => s.items);
    const count = cartCount(items);
    const [scrolled, setScrolled] = useState(false);
    const [ready, setReady] = useState(false);
    const [search, setSearch] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [term, setTerm] = useState("");

    useEffect(() => {
        setReady(true);
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setSearchOpen(false);
    }, [pathname]);

    const siteHost = "usamotorcyclecentre.com.au";
    const { contact, social } = settings;

    function onSearch(e: FormEvent) {
        e.preventDefault();
        const q = term.trim();
        router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
        setSearchOpen(false);
    }

    return (
        <header
            className={cn(
                "sticky top-0 z-40 bg-ink text-white",
                scrolled && "shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
            )}
        >
            <div className="flex items-center justify-between gap-3 border-b-[3px] border-[#FF1414] px-4 py-3 lg:hidden">
                <Link href="/" aria-label={settings.brand.name} className="shrink-0">
                    <Image
                        src="/brand/logo.svg"
                        unoptimized
                        alt=""
                        width={168}
                        height={135}
                        className="h-16 w-auto max-w-[42vw] rounded-sm bg-white object-contain"
                        priority
                    />
                </Link>
                <div className="flex min-w-0 items-center gap-2">
                    <Link href="/cart" className={cn(iconBtn, "relative shrink-0")} aria-label="Cart">
                        <ShoppingBag className="h-4 w-4" />
                        {ready && count > 0 && (
                            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#C40000] px-1 text-[10px] font-bold text-white">
                                {count}
                            </span>
                        )}
                    </Link>
                    <div className="min-w-0 text-right leading-tight">
                        <a href={telHref(settings.contact.phone)} className="contact-link block text-sm text-white">
                            {settings.contact.phone}
                        </a>
                        <p className="mt-1 truncate text-[10px] text-steel">{siteHost}</p>
                    </div>
                </div>
            </div>

            <Suspense fallback={null}>
                <QuerySync onChange={setSearch} />
            </Suspense>
            <div className="hidden border-b border-white/10 lg:block">
                <div className="container-page flex items-center gap-6 py-3.5">
                    <Link href="/" className="flex shrink-0 items-center gap-3">
                        <Image
                            src={settings.brand.logo}
                            alt=""
                            width={56}
                            height={56}
                            unoptimized={settings.brand.logo.endsWith(".svg")}
                            className={cn(
                                "h-14 w-14 rounded-full bg-white object-contain",
                                settings.brand.logoInvert && "invert"
                            )}
                            priority
                        />
                        <span className="leading-tight">
                            <span className="display block text-xl text-white">U.S.A.</span>
                            <span className="text-[10px] uppercase tracking-[0.18em] text-steel">
                                Motorcycle Centre
                            </span>
                        </span>
                    </Link>

                    <div className="ml-auto flex min-w-0 items-center gap-5 xl:gap-8">
                        <a
                            href={contact.mapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            title={`${contact.addressLine}, ${contact.suburb} ${contact.state} ${contact.postcode}`}
                            className="group flex min-w-0 items-center gap-2.5"
                        >
                            <MapPin className="h-[18px] w-[18px] shrink-0 text-[#ff6262]" strokeWidth={1.75} />
                            <span className="min-w-0">
                                <span className="block text-[13px] font-semibold leading-tight text-white group-hover:text-[#ff6262]">Location</span>
                                <span className="mt-0.5 block truncate text-[12px] leading-tight text-steel xl:hidden">
                                    {contact.suburb}
                                </span>
                                <span className="mt-0.5 hidden text-[12px] leading-tight text-steel xl:block">
                                    {contact.addressLine}, {contact.suburb}
                                </span>
                            </span>
                        </a>
                        <a
                            href={mailHref(contact.email)}
                            title={contact.email}
                            className="group flex min-w-0 items-center gap-2.5"
                        >
                            <Mail className="h-[18px] w-[18px] shrink-0 text-[#ff6262]" strokeWidth={1.75} />
                            <span className="min-w-0">
                                <span className="block text-[13px] font-semibold leading-tight text-white group-hover:text-[#ff6262]">Email us</span>
                                <span className="mt-0.5 block max-w-[9.5rem] truncate text-[12px] leading-tight text-steel xl:max-w-[16rem] 2xl:max-w-none">
                                    {contact.email}
                                </span>
                            </span>
                        </a>
                        <a href={telHref(contact.phone)} className="group flex shrink-0 items-center gap-2.5">
                            <Phone className="h-[18px] w-[18px] shrink-0 text-[#ff6262]" strokeWidth={1.75} />
                            <span>
                                <span className="block text-[13px] font-semibold leading-tight text-white group-hover:text-[#ff6262]">Call us</span>
                                <span className="mt-0.5 block text-[12px] leading-tight text-steel">{contact.phone}</span>
                            </span>
                        </a>
                    </div>

                    <Link
                        href="/shop"
                        className="inline-flex h-11 shrink-0 items-center bg-[#C40000] px-5 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#8E0000]"
                    >
                        Shop
                    </Link>
                </div>
            </div>

            <div className="hidden lg:block">
                <div className="container-page flex items-center justify-between gap-6">
                    <nav className="flex items-center gap-7" aria-label="Main">
                        {links.map((l) => {
                            const active = linkActive(pathname, search, l.href);
                            return (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    aria-current={active ? "page" : undefined}
                                    className="py-4 text-sm font-medium text-white transition hover:text-[#ff6262]"
                                >
                                    {l.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-2">
                        <form onSubmit={onSearch} className="flex items-center" role="search">
                            {searchOpen && (
                                <input
                                    autoFocus
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Escape") setSearchOpen(false);
                                    }}
                                    placeholder="Search the rack"
                                    aria-label="Search the rack"
                                    className="mr-2 h-9 w-40 border border-white/25 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-[#FF1414]"
                                />
                            )}
                            <button
                                type={searchOpen ? "submit" : "button"}
                                className={iconBtn}
                                aria-label={searchOpen ? "Search the rack" : "Open search"}
                                onClick={() => {
                                    if (!searchOpen) setSearchOpen(true);
                                }}
                            >
                                <Search className="h-4 w-4" />
                            </button>
                        </form>
                        {social.facebook && (
                            <a href={social.facebook} target="_blank" rel="noreferrer" className={iconBtn} aria-label="Facebook">
                                <FacebookGlyph />
                            </a>
                        )}
                        {social.instagram && (
                            <a href={social.instagram} target="_blank" rel="noreferrer" className={iconBtn} aria-label="Instagram">
                                <InstagramGlyph />
                            </a>
                        )}
                        <Link href="/cart" className={cn(iconBtn, "relative")} aria-label="Cart">
                            <ShoppingBag className="h-4 w-4" />
                            {ready && count > 0 && (
                                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#C40000] px-1 text-[10px] font-bold text-white">
                                    {count}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

export function AnnouncementBar() {
    const settings = useCms((s) => s.settings);
    if (!settings.homepage.announcement) return null;
    return (
        <div className="announce-bar bg-flame text-white">
            <div className="container-page flex items-center justify-center gap-3 py-1.5 text-center text-[10px] font-semibold uppercase leading-snug tracking-normal lg:py-2 lg:text-[11px] lg:tracking-[0.18em]">
                <Linkified text={settings.homepage.announcement} linkClassName="contact-link-bar" />
            </div>
        </div>
    );
}
