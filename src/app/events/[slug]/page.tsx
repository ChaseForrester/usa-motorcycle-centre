"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useCms } from "@/lib/cms-store";

export default function EventDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const events = useCms((s) => s.events);
    const addMessage = useCms((s) => s.addMessage);
    const event = events.find((e) => e.slug === slug);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [done, setDone] = useState(false);

    if (!event) {
        return (
            <div className="container-page py-24">
                <p className="text-chrome">That event has rolled on.</p>
                <Link href="/events" className="btn-ghost mt-6 inline-flex">
                    All events
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="relative h-[42vh] min-h-[280px]">
                <Image src={event.image} alt={event.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-ink/55" />
                <div className="container-page relative flex h-full flex-col justify-end pb-10">
                    <p className="label">
                        {event.date} · {event.time}
                    </p>
                    <h1 className="display mt-2 text-5xl text-white">{event.title}</h1>
                </div>
            </div>
            <div className="container-page grid gap-12 py-12 lg:grid-cols-[1.2fr_.8fr]">
                <div>
                    <p className="text-lg leading-relaxed text-chrome">{event.description}</p>
                    <p className="mt-6 text-sm text-steel">{event.location}</p>
                </div>
                <aside className="card p-6">
                    <h2 className="display text-2xl text-white">I am in</h2>
                    {done ? (
                        <p className="mt-4 text-chrome">Noted. We will keep you posted.</p>
                    ) : (
                        <form
                            className="mt-4 space-y-3"
                            onSubmit={(e) => {
                                e.preventDefault();
                                addMessage({
                                    name,
                                    email,
                                    phone: "",
                                    message: `RSVP: ${event.title}`,
                                });
                                setDone(true);
                            }}
                        >
                            <input
                                className="input"
                                required
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                className="input"
                                required
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button className="btn-flame w-full">RSVP</button>
                        </form>
                    )}
                </aside>
            </div>
        </div>
    );
}
