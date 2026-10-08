"use client";

import { useCms } from "@/lib/cms-store";

export default function AdminInbox() {
    const messages = useCms((s) => s.messages);
    const newsletter = useCms((s) => s.newsletter);
    return (
        <div className="grid gap-8 lg:grid-cols-2">
            <div>
                <h1 className="text-2xl font-semibold">Messages & RSVPs</h1>
                <ul className="mt-4 space-y-3">
                    {messages.length === 0 && <p className="text-sm text-zinc-500">Inbox is clear.</p>}
                    {messages.map((m) => (
                        <li key={m.id} className="rounded-xl border bg-white p-4">
                            <p className="font-semibold">{m.name}</p>
                            <p className="text-sm text-zinc-500">
                                {m.email} {m.phone && `· ${m.phone}`}
                            </p>
                            <p className="mt-2 text-sm">{m.message}</p>
                            <p className="mt-2 text-xs text-zinc-400">
                                {new Date(m.createdAt).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2 className="text-2xl font-semibold">Workshop list</h2>
                <ul className="mt-4 space-y-2">
                    {newsletter.length === 0 && <p className="text-sm text-zinc-500">No subscribers yet.</p>}
                    {newsletter.map((e) => (
                        <li key={e} className="rounded-xl border bg-white px-4 py-2 text-sm">
                            {e}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
