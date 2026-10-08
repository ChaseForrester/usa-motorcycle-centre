"use client";

import { useCms } from "@/lib/cms-store";
import { money } from "@/lib/utils";

export default function AdminOrders() {
    const orders = useCms((s) => s.orders);
    const updateOrder = useCms((s) => s.updateOrder);
    return (
        <div>
            <h1 className="text-2xl font-semibold">Orders</h1>
            <div className="mt-6 space-y-3">
                {orders.length === 0 && <p className="text-sm text-zinc-500">No orders yet.</p>}
                {orders.map((o) => (
                    <article key={o.id} className="rounded-xl border border-zinc-200 bg-white p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className="font-semibold">{o.name}</p>
                                <p className="text-sm text-zinc-500">
                                    {o.email} · {o.phone} · {o.fulfillment}
                                </p>
                                <p className="text-xs text-zinc-400">{new Date(o.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">{money(o.total)}</p>
                                <select
                                    className="admin-input mt-2 w-36"
                                    value={o.status}
                                    onChange={(e) =>
                                        updateOrder(o.id, { status: e.target.value as typeof o.status })
                                    }
                                >
                                    <option value="pending">pending</option>
                                    <option value="paid">paid</option>
                                    <option value="fulfilled">fulfilled</option>
                                    <option value="cancelled">cancelled</option>
                                </select>
                            </div>
                        </div>
                        <ul className="mt-3 text-sm text-zinc-600">
                            {o.items.map((i, idx) => (
                                <li key={idx}>
                                    {i.name}
                                    {i.variant ? ` (${i.variant})` : ""} × {i.qty} — {money(i.price * i.qty)}
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </div>
    );
}
