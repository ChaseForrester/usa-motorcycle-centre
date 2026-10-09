"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/SocialIcons";
import { TechAidBadge, TechAidCredit } from "@/components/TechAidBrand";
import { useCms } from "@/lib/cms-store";
import { submitInbox } from "@/lib/inbox-client";
import { cn, hoursList, mailHref, telHref } from "@/lib/utils";
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

function groupedHours(hours: { key: string; label: string; value: string }[]) {
    const short = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const groups: { start: string; end: string; full: string; value: string }[] = [];
    hours.forEach((day, i) => {
        const name = short[i] || day.label;
        const last = groups[groups.length - 1];
        if (last && last.value === day.value) last.end = name;
        else groups.push({ start: name, end: name, full: day.label, value: day.value });
    });
    return groups.map((group) => ({
        label: group.start === group.end ? group.full : `${group.start}–${group.end}`,
        value: group.value,
    }));
}

export function Footer() {
    const settings = useCms((s) => s.settings);
    const addSubscriber = useCms((s) => s.addSubscriber);
    const [email, setEmail] = useState("");
    const [done, setDone] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const hours = groupedHours(hoursList(settings));

    async function joinList(e: FormEvent) {
        e.preventDefault();
        if (!email) return;
        setSending(true);
        setError("");
        addSubscriber(email);
        const result = await submitInbox({
            kind: "newsletter",
            name: email,
            email,
            message: "Workshop list",
        });
        setSending(false);
        if (!result.ok) {
            setError(result.error || "Could not join. Call the workshop.");
            return;
        }
        setDone(true);
    }

    return (
        <footer className="site-footer flex flex-col border-t border-white/10 bg-coal lg:mt-24">
            <div className="container-page flex min-h-0 flex-1 flex-col justify-center gap-4 py-4 lg:block lg:py-14">
                <div className="footer-col flex flex-col gap-3 border-b border-white/10 pb-4 lg:flex-row lg:items-center lg:justify-between lg:pb-8">
                    <div className="flex min-w-0 items-center gap-3 lg:gap-4">
                        <Image
                            src={settings.brand.logo}
                            alt={settings.brand.name}
                            width={72}
                            height={72}
                            className={cn(
                                "h-12 w-12 shrink-0 rounded-full bg-white object-contain lg:h-16 lg:w-16",
                                settings.brand.logoInvert && "invert"
                            )}
                        />
                        <div className="min-w-0">
                            <p className="display text-xl leading-none text-white lg:text-3xl">
                                U.S.A. Motorcycle Centre
                            </p>
                            <p className="mt-2 hidden max-w-md text-sm leading-relaxed text-steel lg:block">
                                {settings.brand.slogan}
                            </p>
                            <p className="footer-est mt-1.5 text-[11px] uppercase tracking-[0.22em] text-flame lg:mt-2">
                                Est. {settings.brand.established} · Illawarra
                            </p>
                        </div>
                    </div>
                    <div className="footer-social flex gap-2">
                        {settings.social.facebook && (
                            <a
                                href={settings.social.facebook}
                                target="_blank"
                                rel="noreferrer"
                                className="grid h-11 w-11 place-items-center rounded-sm border border-white/15 hover:border-[#1877F2] hover:bg-white/5"
                                aria-label="Facebook"
                            >
                                <FacebookIcon className="h-4 w-4" />
                            </a>
                        )}
                        {settings.social.instagram && (
                            <a
                                href={settings.social.instagram}
                                target="_blank"
                                rel="noreferrer"
                                className="grid h-11 w-11 place-items-center rounded-sm border border-white/15 hover:border-[#d6249f] hover:bg-white/5"
                                aria-label="Instagram"
                            >
                                <InstagramIcon className="h-4 w-4" />
                            </a>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 lg:mt-10 lg:grid-cols-12 lg:gap-8">
                    <div className="footer-col lg:col-span-3">
                        <p className="label">Workshop</p>
                        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-chrome lg:mt-4 lg:block lg:space-y-2.5">
                            {workshopLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="transition-colors hover:text-flame">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-col lg:col-span-4">
                        <p className="label">Find us</p>
                        <div className="mt-3 space-y-2.5 text-sm lg:mt-4">
                            <a
                                href={settings.contact.mapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-start gap-2.5 text-chrome hover:text-white"
                            >
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-flame" />
                                <span>
                                    <span className="block">{settings.contact.addressLine}</span>
                                    <span className="block text-steel">
                                        {settings.contact.suburb} {settings.contact.state} {settings.contact.postcode}
                                    </span>
                                </span>
                            </a>
                            <a
                                href={telHref(settings.contact.phone)}
                                className="contact-link flex items-center gap-2.5 text-chrome"
                            >
                                <Phone className="h-4 w-4 shrink-0 text-flame" />
                                {settings.contact.phone}
                            </a>
                            <a
                                href={mailHref(settings.contact.email)}
                                className="contact-link flex items-start gap-2.5 break-all text-chrome"
                            >
                                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-flame" />
                                {settings.contact.email}
                            </a>
                            <p className="pl-[26px] text-xs leading-relaxed text-steel lg:hidden">{compactHours(settings)}</p>
                        </div>
                    </div>

                    <div className="footer-col hidden lg:col-span-2 lg:block">
                        <p className="label">Hours</p>
                        <ul className="mt-4 space-y-2.5 text-sm">
                            {hours.map((row) => (
                                <li key={row.label} className="flex items-baseline justify-between gap-4">
                                    <span className="text-steel">{row.label}</span>
                                    <span className="tabular-nums text-white">{row.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-col lg:col-span-3">
                        <p className="label">The workshop list</p>
                        <p className="mt-3 hidden text-sm leading-relaxed text-steel lg:mt-4 lg:block">
                            Saturday hours, specials and the next catch-up. No spam.
                        </p>
                        {done ? (
                            <p className="mt-3 text-sm text-flame" role="status">You are on the list.</p>
                        ) : (
                            <form className="mt-3 lg:mt-4" onSubmit={joinList}>
                                <label htmlFor="workshop-list-email" className="sr-only">
                                    Email for the workshop list
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        id="workshop-list-email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        inputMode="email"
                                        spellCheck={false}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email address"
                                        aria-invalid={error ? true : undefined}
                                        className="input min-h-11 min-w-0 flex-1"
                                    />
                                    <button
                                        className="btn-flame !shadow-none shrink-0 px-4"
                                        type="submit"
                                        disabled={sending}
                                        aria-busy={sending}
                                    >
                                        {sending ? "…" : "Join"}
                                    </button>
                                </div>
                                {error ? (
                                    <p className="mt-2 text-sm text-flame" role="alert">{error}</p>
                                ) : null}
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <div className="container-page flex justify-center px-4 pb-2 pt-1">
                <TechAidBadge />
            </div>
            <div className="border-t border-white/10">
                <div className="container-page flex flex-col items-start justify-between gap-3 py-3 text-[11px] leading-snug text-steel sm:flex-row sm:items-center lg:py-5 lg:text-xs">
                    <p className="max-w-3xl">
                        © {new Date().getFullYear()} {settings.brand.legalName}. Harley-Davidson® is a
                        registered trademark of H-D U.S.A., LLC. Independent specialist — not an authorised
                        Harley-Davidson dealer.
                    </p>
                    <TechAidCredit />
                    <div className="flex shrink-0 gap-4">
                        <Link href="/privacy" className="hover:text-white">Privacy</Link>
                        <Link href="/terms" className="hover:text-white">Terms</Link>
                        <Link href="/account" className="hover:text-white">Account</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
