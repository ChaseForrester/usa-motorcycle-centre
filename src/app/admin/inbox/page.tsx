"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchInbox } from "@/lib/inbox-client";
import type { InboxItem, InboxKind } from "@/lib/inbox";

const TABS: { id: InboxKind | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "booking", label: "Bookings" },
    { id: "contact", label: "Contact" },
    { id: "freight", label: "Freight" },
    { id: "newsletter", label: "List" },
    { id: "event", label: "Events" },
];

export default function AdminInbox() {
    const [items, setItems] = useState<InboxItem[]>([]);
    const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");

    useEffect(() => {
        void fetchInbox().then(setItems);
    }, []);

    const shown = useMemo(
        () => (tab === "all" ? items : items.filter((i) => i.kind === tab)),
        [items, tab]
    );

    return (
        <div>
            <h1 className="text-2xl font-semibold">Forms</h1>
            <p className="mt-1 text-sm text-zinc-500">
                Bookings, contact, freight quotes, newsletter and event replies. Nothing sits only in a
                visitor’s browser.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`rounded-full px-3 py-1 text-xs ${tab === t.id ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-600"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            <ul className="mt-6 space-y-3">
                {shown.length === 0 && <li className="text-sm text-zinc-500">Nothing in this tray.</li>}
                {shown.map((m) => (
                    <li key={m.id} className="rounded-xl border bg-white p-4">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-400">{m.kind}</p>
                        <p className="font-semibold">{m.name}</p>
                        <p className="text-sm text-zinc-500">
                            {m.email} {m.phone && `· ${m.phone}`}
                        </p>
                        {m.fields.serviceName && (
                            <p className="mt-1 text-sm">
                                {m.fields.serviceName} · {m.fields.bike} · {m.fields.preferredDate}
                            </p>
                        )}
                        {m.fields.country && <p className="mt-1 text-sm">Country {m.fields.country}</p>}
                        {m.message && <p className="mt-2 text-sm">{m.message}</p>}
                        <p className="mt-2 text-xs text-zinc-400">
                            {new Date(m.createdAt).toLocaleString("en-AU")} · {m.status}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
