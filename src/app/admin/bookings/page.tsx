"use client";

import { useCms } from "@/lib/cms-store";

export default function AdminBookings() {
    const bookings = useCms((s) => s.bookings);
    const updateBooking = useCms((s) => s.updateBooking);
    return (
        <div>
            <h1 className="text-2xl font-semibold">Workshop bookings</h1>
            <div className="mt-6 space-y-3">
                {bookings.length === 0 && <p className="text-sm text-zinc-500">No bookings yet.</p>}
                {bookings.map((b) => (
                    <article key={b.id} className="rounded-xl border border-zinc-200 bg-white p-5">
                        <div className="flex flex-wrap justify-between gap-3">
                            <div>
                                <p className="font-semibold">{b.name}</p>
                                <p className="text-sm text-zinc-500">
                                    {b.phone} · {b.email}
                                </p>
                                <p className="mt-1 text-sm">
                                    {b.serviceName} · {b.bike} · {b.preferredDate}
                                </p>
                                {b.notes && <p className="mt-2 text-sm text-zinc-600">{b.notes}</p>}
                            </div>
                            <select
                                className="admin-input w-40"
                                value={b.status}
                                onChange={(e) =>
                                    updateBooking(b.id, { status: e.target.value as typeof b.status })
                                }
                            >
                                <option value="new">new</option>
                                <option value="confirmed">confirmed</option>
                                <option value="complete">complete</option>
                                <option value="cancelled">cancelled</option>
                            </select>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
