"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/SocialIcons";
import { useCms } from "@/lib/cms-store";
import { submitInbox } from "@/lib/inbox-client";
import { cn, fullAddress, hoursList, mailHref, telHref } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

const workshopLinks = [
    { href: "/workshop", label: "Harley® servicing" },
    { href: "/book", label: "Book a service" },
    { href: "/shop", label: "Shirts" },
    { href: "/events", label: "Rides & events" },
    { href: "/gift-cards", label: "Gift cards" },
    { href: "/faq", label: "FAQ" },
];

const dayShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function compactHours(settings: SiteSettings) {
    const groups: { start: string; end: string; value: string }[] = [];
    hoursList(settings).forEach((day, i) => {
        const name = dayShort[i];
        const last = groups[groups.length - 1];
        if (last && last.value === day.value) last.end = name;
        else groups.push({ start: name, end: name, value: day.value });
    });
    return groups
        .map((group) => `${group.start === group.end ? group.start : `${group.start}–${group.end}`} ${group.value}`)
        .join(" · ");
}

export function Footer() {
    const settings = useCms((s) => s.settings);
    const addSubscriber = useCms((s) => s.addSubscriber);
    const [email, setEmail] = useState("");
    const [done, setDone] = useState(false);
    const hours = hoursList(settings);

    return (
        <footer className="site-footer flex flex-col border-t border-white/10 bg-coal lg:mt-24 lg:block">
            <div className="container-page grid min-h-0 flex-1 content-center gap-4 py-5 lg:grid-cols-4 lg:content-start lg:gap-12 lg:py-16">
                <div className="min-w-0">
                    <div className="flex items-center gap-3">
                        <Image
                            src={settings.brand.logo}
                            alt={settings.brand.name}
                            width={88}
                            height={88}
                            className={cn(
                                "h-12 w-12 rounded-full bg-white object-contain lg:h-20 lg:w-20",
                                settings.brand.logoInvert && "invert"
                            )}
                        />
                        <div className="leading-tight lg:hidden">
                            <p className="display text-lg text-white">U.S.A.</p>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-steel">Motorcycle Centre</p>
                        </div>
                    </div>
                    <p className="mt-4 hidden max-w-xs text-sm leading-relaxed text-steel lg:block">
                        {settings.brand.slogan}
                    </p>
                    <p className="footer-est mt-3 text-[11px] uppercase tracking-[0.22em] text-flame">
                        Est. {settings.brand.established} · Illawarra
                    </p>
                    <div className="footer-social mt-4 flex gap-3 lg:mt-5">
                        {settings.social.facebook && (
                            <a
                                href={settings.social.facebook}
                                target="_blank"
                                rel="noreferrer"
                                className="grid h-10 w-10 place-items-center rounded-sm border border-white/15 transition hover:border-[#1877F2] hover:bg-white/5"
                                aria-label="Facebook"
                            >
                                <FacebookIcon className="h-5 w-5" />
                            </a>
                        )}
                        {settings.social.instagram && (
                            <a
                                href={settings.social.instagram}
                                target="_blank"
                                rel="noreferrer"
                                className="grid h-10 w-10 place-items-center rounded-sm border border-white/15 transition hover:border-[#d6249f] hover:bg-white/5"
                                aria-label="Instagram"
                            >
                                <InstagramIcon className="h-5 w-5" />
                            </a>
                        )}
                    </div>
                </div>

                <div className="min-w-0">
                    <p className="label">Workshop</p>
                    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-chrome lg:mt-4 lg:block lg:space-y-2">
                        {workshopLinks.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className="hover:text-flame">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="min-w-0">
                    <p className="label">Find us</p>
                    <a
                        href={settings.contact.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 flex items-start gap-2 text-sm text-chrome hover:text-white lg:mt-4"
                    >
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-flame" />
                        <span className="min-w-0">{fullAddress(settings)}</span>
                    </a>
                    <a
                        href={telHref(settings.contact.phone)}
                        className="contact-link mt-2 flex items-center gap-2 text-sm text-chrome lg:mt-3"
                    >
                        <Phone className="h-4 w-4 shrink-0 text-flame" />
                        {settings.contact.phone}
                    </a>
                    <a
                        href={mailHref(settings.contact.email)}
                        className="contact-link mt-2 block break-all text-sm text-chrome"
                    >
                        {settings.contact.email}
                    </a>
                    <p className="mt-2 text-xs leading-relaxed text-steel lg:hidden">{compactHours(settings)}</p>
                    <ul className="mt-5 hidden space-y-1 text-xs text-steel lg:block">
                        {hours.map((h) => (
                            <li key={h.key} className="flex justify-between gap-4">
                                <span>{h.label}</span>
                                <span className="text-chrome">{h.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="min-w-0">
                    <p className="label">The workshop list</p>
                    <p className="mt-4 hidden text-sm text-steel lg:block">
                        Specials, Saturday hours and when the next catch-up is on. No spam — just the shop.
                    </p>
                    {done ? (
                        <p className="mt-3 text-sm text-flame lg:mt-4">You are on the list.</p>
                    ) : (
                        <form
                            className="mt-2 flex gap-2 lg:mt-4 lg:flex-col"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (!email) return;
                                addSubscriber(email);
                                await submitInbox({
                                    kind: "newsletter",
                                    name: email,
                                    email,
                                    message: "Workshop list",
                                });
                                setDone(true);
                            }}
                        >
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="input min-w-0 flex-1 py-2.5 lg:py-3"
                            />
                            <button className="btn-flame shrink-0 px-4 py-2.5 lg:px-6 lg:py-3" type="submit">
                                Join
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <div className="border-t border-white/10">
                <div className="container-page flex flex-col items-start justify-between gap-2 py-3 text-[11px] leading-snug text-steel sm:flex-row sm:items-center lg:gap-3 lg:py-6 lg:text-xs">
                    <p className="max-w-3xl">
                        © {new Date().getFullYear()} {settings.brand.legalName}. Harley-Davidson® is a
                        registered trademark of H-D U.S.A., LLC. Independent specialist — not an authorised
                        Harley-Davidson dealer.
                    </p>
                    <div className="flex shrink-0 gap-4">
                        <Link href="/privacy" className="hover:text-chrome">
                            Privacy
                        </Link>
                        <Link href="/terms" className="hover:text-chrome">
                            Terms
                        </Link>
                        <Link href="/account" className="hover:text-chrome">
                            Account
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
