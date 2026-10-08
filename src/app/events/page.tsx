"use client";

import Image from "next/image";
import Link from "next/link";
import { useCms } from "@/lib/cms-store";

export default function EventsPage() {
    const events = useCms((s) => s.events);
    return (
        <div className="container-page py-12">
            <p className="label">Events</p>
            <h1 className="display mt-2 text-5xl text-white">The riding community, not just the rack.</h1>
            <p className="mt-4 max-w-2xl text-chrome">
                Saturday mornings, Illawarra catch-ups and the charity nights we get behind — including
                Bikers 4 Heroes and the i98FM Illawarra Convoy.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
                {events.map((e) => (
                    <Link key={e.id} href={`/events/${e.slug}`} className="card group overflow-hidden">
                        <div className="relative aspect-[16/9]">
                            <Image
                                src={e.image}
                                alt={e.title}
                                fill
                                className="object-cover transition duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="p-6">
                            <p className="text-xs uppercase tracking-[0.2em] text-flame">
                                {e.date} · {e.time}
                            </p>
                            <h2 className="display mt-2 text-3xl text-white">{e.title}</h2>
                            <p className="mt-2 text-sm text-steel">{e.summary}</p>
                            <p className="mt-3 text-xs text-chrome">{e.location}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
