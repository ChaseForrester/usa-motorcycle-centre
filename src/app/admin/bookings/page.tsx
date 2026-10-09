"use client";

import { useEffect, useState } from "react";
import { fetchInbox, patchInbox } from "@/lib/inbox-client";
import type { InboxItem } from "@/lib/inbox";

const STATUSES = [
    { id: "new", label: "New" },
    { id: "confirmed", label: "Confirmed" },
    { id: "delayed", label: "Thrown off course" },
    { id: "complete", label: "Complete" },
    { id: "cancelled", label: "Cancelled" },
];

export default function AdminBookings() {
    const [items, setItems] = useState<InboxItem[]>([]);
    const [busy, setBusy] = useState<string>("");
    const [msg, setMsg] = useState("");

    async function load() {
        setItems(await fetchInbox("booking"));
    }

    useEffect(() => {
        void load();
    }, []);

    async function setStatus(item: InboxItem, status: string) {
        setBusy(item.id);
        setMsg("");
        const notify = status === "delayed" ? "delayed" : undefined;
        const res = await patchInbox(item.id, { status, notify });
        setBusy("");
        if (!res.ok) {
            setMsg(res.error || "Could not update.");
            return;
        }
        if (status === "delayed") {
            const last = res.item?.emails.at(-1);
            setMsg(
                last?.sent
                    ? `Emailed ${item.email} that we will be in touch.`
                    : `Saved. Email queued for ${item.email}${last?.error ? ` — ${last.error}` : "."}`
            );
        }
        await load();
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold">Workshop bookings</h1>
            <p className="mt-1 text-sm text-zinc-500">
                Every booking from the site lands here. If a job is thrown off course, press that status —
                the rider is emailed that we will be in touch.
            </p>
            {msg && <p className="mt-3 rounded-md bg-orange-50 px-3 py-2 text-sm text-orange-900">{msg}</p>}
            <div className="mt-6 space-y-3">
                {items.length === 0 && <p className="text-sm text-zinc-500">No bookings yet.</p>}
                {items.map((b) => (
                    <article key={b.id} className="rounded-xl border border-zinc-200 bg-white p-5">
                        <div className="flex flex-wrap justify-between gap-3">
                            <div>
                                <p className="font-semibold">{b.name}</p>
                                <p className="text-sm text-zinc-500">
                                    {b.phone} · {b.email}
                                </p>
                                <p className="mt-1 text-sm">
                                    {b.fields.serviceName || "Service"} · {b.fields.bike} · {b.fields.preferredDate}
                                </p>
                                {b.message && <p className="mt-2 text-sm text-zinc-600">{b.message}</p>}
                                <p className="mt-2 text-xs text-zinc-400">
                                    In {new Date(b.createdAt).toLocaleString("en-AU")}
                                </p>
                            </div>
                            <select
                                className="admin-input w-52"
                                value={b.status}
                                disabled={busy === b.id}
                                onChange={(e) => void setStatus(b, e.target.value)}
                            >
                                {STATUSES.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {b.emails.length > 0 && (
                            <ul className="mt-4 space-y-1 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
                                {b.emails.map((em) => (
                                    <li key={em.at}>
                                        {em.sent ? "Sent" : "Queued"} · {em.subject} ·{" "}
                                        {new Date(em.at).toLocaleString("en-AU")}
                                        {em.error ? ` · ${em.error}` : ""}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </article>
                ))}
            </div>
        </div>
    );
}
