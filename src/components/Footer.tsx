"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { TechAidCredit } from "@/components/TechAidBrand";
import { useCms } from "@/lib/cms-store";
import { submitInbox } from "@/lib/inbox-client";
import { hoursList, mailHref, telHref } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

const rackLinks = [
    { href: "/shop?cat=Shirts", label: "Shirts" },
    { href: "/shop?cat=Jumpers", label: "Jumpers" },
    { href: "/shop", label: "The rack" },
    { href: "/blog", label: "Blog" },
];

const shopLinks = [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

function groupedHours(settings: SiteSettings) {
    const short = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const groups: { start: string; end: string; value: string }[] = [];
    hoursList(settings).forEach((day, i) => {
        const name = short[i] || day.label;
        const last = groups[groups.length - 1];
        if (last && last.value === day.value) last.end = name;
        else groups.push({ start: name, end: name, value: day.value });
    });
    return groups.map((group) => ({
        label: group.start === group.end ? group.start : `${group.start}–${group.end}`,
        value: group.value,
    }));
}

function LinkColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
    return (
        <div>
            <p className="font-semibold text-[#000B58]">{title}</p>
            <ul className="mt-3 space-y-2 text-sm">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link href={link.href} className="inline-flex items-center gap-2 hover:text-[#00139E]">
                            <span className="text-[#BF0A30]" aria-hidden>
                                ›
                            </span>
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SocialDot({ href, label, children }: { href: string; label: string; children: ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="footer-dot grid h-11 w-11 place-items-center rounded-full"
        >
            {children}
        </a>
    );
}

export function Footer() {
    const settings = useCms((s) => s.settings);
    const addSubscriber = useCms((s) => s.addSubscriber);
    const [email, setEmail] = useState("");
    const [done, setDone] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const hours = groupedHours(settings);
    const { contact } = settings;
    const mapQuery = `${contact.addressLine}, ${contact.suburb} ${contact.state} ${contact.postcode}`;
    const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`;

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
        <footer className="site-footer border-t border-[#000B58]/15 bg-white text-[#000B58] lg:mt-24">
            <div className="container-page flex flex-col gap-4 border-b border-[#000B58]/10 py-5 lg:flex-row lg:items-center lg:gap-10 lg:py-6">
                <p className="shrink-0 text-lg font-bold">Subscribe</p>
                <p className="max-w-xs text-xs leading-relaxed text-[#000B58]/60">
                    Saturday hours, specials and the next catch-up. No spam.
                </p>
                {done ? (
                    <p className="text-sm font-semibold text-[#00139E] lg:ml-auto" role="status">
                        You are on the list.
                    </p>
                ) : (
                    <form onSubmit={joinList} className="flex min-w-0 flex-1 gap-2 lg:ml-auto lg:max-w-md">
                        <label htmlFor="workshop-list-email" className="sr-only">
                            Email for the workshop list
                        </label>
                        <input
                            id="workshop-list-email"
                            type="email"
                            required
                            autoComplete="email"
                            inputMode="email"
                            spellCheck={false}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            aria-invalid={error ? true : undefined}
                            className="min-h-11 min-w-0 flex-1 rounded-lg bg-[#F2F4F7] px-4 text-sm text-[#000B58] outline-none placeholder:text-[#000B58]/40 focus:ring-2 focus:ring-[#FF1414]"
                        />
                        <button
                            type="submit"
                            disabled={sending}
                            aria-busy={sending}
                            aria-label={sending ? "Joining" : "Join the list"}
                            className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-[#FF1414] hover:bg-[#C40000]"
                        >
                            <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" aria-hidden>
                                <path d="M2.2 1.2v9.6L10.4 6 2.2 1.2z" fill="currentColor" />
                            </svg>
                        </button>
                    </form>
                )}
            </div>
            {error ? (
                <p className="container-page pt-3 text-sm text-[#BF0A30]" role="alert">
                    {error}
                </p>
            ) : null}

            <div className="container-page py-8 lg:py-12">
                <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-12 lg:gap-6">
                    <div className="col-span-2 lg:col-span-3">
                        <p className="display text-3xl text-[#000B58] sm:text-4xl">
                            U.S.A.
                            <span className="mt-1 block">Motorcycle Centre</span>
                        </p>
                        <p className="mt-3 font-semibold text-[#BF0A30]">Harley shirts and jumpers.</p>
                        <div className="mt-4 h-px w-40 bg-[#000B58]" />
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#000B58]/70">
                            {settings.brand.slogan}
                        </p>
                        <div className="mt-5 flex gap-2">
                            {settings.social.facebook ? (
                                <SocialDot href={settings.social.facebook} label="Facebook">
                                    f
                                </SocialDot>
                            ) : null}
                            {settings.social.instagram ? (
                                <SocialDot href={settings.social.instagram} label="Instagram">
                                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="4" y="4" width="16" height="16" rx="5" />
                                        <circle cx="12" cy="12" r="3.5" />
                                        <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
                                    </svg>
                                </SocialDot>
                            ) : null}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <LinkColumn title="The rack" links={rackLinks} />
                    </div>
                    <div className="lg:col-span-2">
                        <LinkColumn title="The shop" links={shopLinks} />
                    </div>
                    <div className="col-span-2 lg:col-span-2">
                        <p className="font-semibold text-[#000B58]">Contact</p>
                        <div className="mt-3 space-y-3 text-sm">
                            <p>
                                <span className="block font-semibold">Call</span>
                                <a href={telHref(contact.phone)} className="contact-link">
                                    {contact.phone}
                                </a>
                            </p>
                            <p>
                                <span className="block font-semibold">Email</span>
                                <a href={mailHref(contact.email)} className="contact-link break-all">
                                    {contact.email}
                                </a>
                            </p>
                            <p>
                                <a href={contact.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-[#00139E]">
                                    <span className="block">{contact.addressLine}</span>
                                    <span className="block text-[#000B58]/70">
                                        {contact.suburb} {contact.state} {contact.postcode}
                                    </span>
                                </a>
                            </p>
                            <p className="text-[#000B58]/70">
                                {hours.map((row) => (
                                    <span key={row.label} className="block">
                                        {row.label} {row.value}
                                    </span>
                                ))}
                            </p>
                        </div>
                    </div>
                    <div className="col-span-2 lg:col-span-3">
                        <div className="overflow-hidden rounded-2xl bg-[#F2F4F7]">
                            <iframe
                                title={`Map of ${mapQuery}`}
                                src={mapSrc}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="h-44 w-full border-0 lg:h-52"
                            />
                        </div>
                    </div>
                </div>

                <p className="mx-auto mt-8 w-fit max-w-full rounded-full border border-[#000B58] px-5 py-2 text-center text-sm font-medium">
                    Independent specialist. Est. {settings.brand.established}.
                </p>
            </div>

            <div className="footer-legal">
                <div className="container-page flex flex-col gap-3 py-4 text-[11px] leading-snug sm:text-xs lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <Link href="/privacy">Privacy</Link>
                        <span aria-hidden className="opacity-40">|</span>
                        <Link href="/terms">Terms</Link>
                        <span aria-hidden className="opacity-40">|</span>
                        <Link href="/account">Account</Link>
                    </div>
                    <TechAidCredit />
                    <p>© {new Date().getFullYear()} {settings.brand.legalName}</p>
                </div>
                <p className="footer-note container-page pb-4 text-[11px] leading-relaxed">
                    Harley-Davidson® is a registered trademark of H-D U.S.A., LLC. Independent specialist — not an authorised Harley-Davidson dealer.
                </p>
            </div>
        </footer>
    );
}
