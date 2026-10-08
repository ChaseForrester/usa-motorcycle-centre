"use client";

import Image from "next/image";
import Link from "next/link";
import { useCms } from "@/lib/cms-store";
import { money } from "@/lib/utils";

export default function WorkshopPage() {
    const services = useCms((s) => s.services);
    const settings = useCms((s) => s.settings);
    return (
        <div>
            <section className="relative h-[46vh] min-h-[320px]">
                <Image src="/workshop/chopper-build.jpg" alt="Workshop Harley build" fill className="object-cover object-[center_65%]" />
                <div className="absolute inset-0 bg-ink/60" />
                <div className="container-page relative flex h-full flex-col justify-end pb-10">
                    <p className="label">Workshop</p>
                    <h1 className="display mt-2 text-5xl text-white sm:text-6xl">See Laurie or Mick for it.</h1>
                </div>
            </section>
            <section className="container-page py-16">
                <p className="max-w-2xl text-lg text-chrome">
                    Harley® specialist repair shop in Albion Park Rail. Computerised diagnostics, smash
                    repairs and insurance work, tyres and electronic balancing, electrical, customising and
                    the oil change you have been putting off. Independent — not a dealer. That is the point.
                </p>
                <div className="mt-12 grid gap-6 md:grid-cols-2">
                    {services.map((s) => (
                        <article key={s.id} className="card overflow-hidden md:flex">
                            <div className="relative h-48 w-full md:h-auto md:w-48">
                                <Image src={s.image} alt="" fill className="object-cover" />
                            </div>
                            <div className="p-6">
                                <h2 className="display text-2xl text-white">{s.name}</h2>
                                <p className="mt-2 text-sm text-chrome">{s.description}</p>
                                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-steel">
                                    {s.duration}
                                    {s.fromPrice ? ` · from ${money(s.fromPrice)}` : ""}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
                <div className="mt-12 flex flex-wrap gap-3">
                    <Link href="/book" className="btn-flame">
                        Book a service
                    </Link>
                    <a href={settings.contact.phoneHref} className="btn-ghost">
                        Call {settings.contact.phone}
                    </a>
                </div>
            </section>
        </div>
    );
}
