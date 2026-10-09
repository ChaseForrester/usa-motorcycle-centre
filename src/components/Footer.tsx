"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/SocialIcons";
import { useCms } from "@/lib/cms-store";
import { submitInbox } from "@/lib/inbox-client";
import { fullAddress, hoursList } from "@/lib/utils";

export function Footer() {
    const settings = useCms((s) => s.settings);
    const addSubscriber = useCms((s) => s.addSubscriber);
    const [email, setEmail] = useState("");
    const [done, setDone] = useState(false);
    const hours = hoursList(settings);

    return (
        <footer className="mt-24 border-t border-white/10 bg-coal">
            <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
                <div>
                    <Image
                        src={settings.brand.logo}
                        alt={settings.brand.name}
                        width={88}
                        height={88}
                        className="h-20 w-20 rounded-full bg-white object-contain"
                    />
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-steel">
                        {settings.brand.slogan}
                    </p>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-flame">
                        Est. {settings.brand.established} · Illawarra
                    </p>
                    <div className="mt-5 flex gap-3">
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

                <div>
                    <p className="label">Workshop</p>
                    <ul className="mt-4 space-y-2 text-sm text-chrome">
                        <li>
                            <Link href="/workshop" className="hover:text-flame">
                                Harley® servicing
                            </Link>
                        </li>
                        <li>
                            <Link href="/book" className="hover:text-flame">
                                Book a service
                            </Link>
                        </li>
                        <li>
                            <Link href="/shop" className="hover:text-flame">
                                Shirts
                            </Link>
                        </li>
                        <li>
                            <Link href="/events" className="hover:text-flame">
                                Rides & events
                            </Link>
                        </li>
                        <li>
                            <Link href="/gift-cards" className="hover:text-flame">
                                Gift cards
                            </Link>
                        </li>
                        <li>
                            <Link href="/faq" className="hover:text-flame">
                                FAQ
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <p className="label">Find us</p>
                    <a
                        href={settings.contact.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 flex items-start gap-2 text-sm text-chrome hover:text-white"
                    >
                        <MapPin className="mt-0.5 h-4 w-4 text-flame" />
                        {fullAddress(settings)}
                    </a>
                    <a
                        href={settings.contact.phoneHref}
                        className="mt-3 flex items-center gap-2 text-sm text-chrome hover:text-white"
                    >
                        <Phone className="h-4 w-4 text-flame" />
                        {settings.contact.phone}
                    </a>
                    <a
                        href={`mailto:${settings.contact.email}`}
                        className="mt-2 block text-sm text-chrome hover:text-white"
                    >
                        {settings.contact.email}
                    </a>
                    <ul className="mt-5 space-y-1 text-xs text-steel">
                        {hours.map((h) => (
                            <li key={h.key} className="flex justify-between gap-6">
                                <span>{h.label}</span>
                                <span className="text-chrome">{h.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <p className="label">The workshop list</p>
                    <p className="mt-4 text-sm text-steel">
                        Specials, Saturday hours and when the next catch-up is on. No spam — just the shop.
                    </p>
                    {done ? (
                        <p className="mt-4 text-sm text-flame">You are on the list.</p>
                    ) : (
                        <form
                            className="mt-4 flex flex-col gap-2"
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
                                className="input"
                            />
                            <button className="btn-flame" type="submit">
                                Join
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <div className="border-t border-white/10">
                <div className="container-page flex flex-col items-start justify-between gap-3 py-6 text-xs text-steel sm:flex-row sm:items-center">
                    <p>
                        © {new Date().getFullYear()} {settings.brand.legalName}. Harley-Davidson® is a
                        registered trademark of H-D U.S.A., LLC. Independent specialist — not an authorised
                        Harley-Davidson dealer.
                    </p>
                    <div className="flex gap-4">
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
