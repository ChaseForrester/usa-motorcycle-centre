"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useCms } from "@/lib/cms-store";
import { FormLockup, FormNote, TextField } from "@/components/FormLockup";
import { submitInbox } from "@/lib/inbox-client";

export default function EventView() {
    const { slug } = useParams<{ slug: string }>();
    const events = useCms((s) => s.events);
    const addMessage = useCms((s) => s.addMessage);
    const event = events.find((e) => e.slug === slug);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [done, setDone] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

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
                    {done ? (
                        <div role="status">
                            <FormLockup title="Noted." hint="We will keep you posted." />
                        </div>
                    ) : (
                        <form
                            className="space-y-3"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setSending(true);
                                setError("");
                                addMessage({
                                    name,
                                    email,
                                    phone: "",
                                    message: `RSVP: ${event.title}`,
                                });
                                const result = await submitInbox({
                                    kind: "event",
                                    name,
                                    email,
                                    message: `RSVP: ${event.title}`,
                                    fields: { event: event.title },
                                });
                                setSending(false);
                                if (!result.ok) {
                                    setError(result.error || "Could not send. Call the workshop.");
                                    return;
                                }
                                setDone(true);
                            }}
                        >
                            <FormLockup title="I am in" hint={event.title} />
                            <TextField id="rsvp-name" label="Name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
                            <TextField id="rsvp-email" label="Email" required type="email" autoComplete="email" inputMode="email" spellCheck={false} value={email} onChange={(e) => setEmail(e.target.value)} />
                            {error ? <FormNote live>{error}</FormNote> : null}
                            <button className="btn-flame w-full" type="submit" disabled={sending} aria-busy={sending}>
                                {sending ? "Sending…" : "RSVP"}
                            </button>
                        </form>
                    )}
                </aside>
            </div>
        </div>
    );
}
