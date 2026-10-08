"use client";

import { TENANTS } from "@/lib/commerce/tenants";
import { useCommerce } from "@/lib/commerce/store";

export default function PlatformHome() {
    const shipments = useCommerce((s) => s.shipments);
    const orders = useCommerce((s) => s.orders);
    const failed = shipments.filter((s) => s.failed);

    return (
        <div className="space-y-12">
            <section>
                <h1 className="text-3xl font-semibold">Tenants</h1>
                <p className="mt-2 text-sm text-zinc-400">
                    One codebase, one Firebase project. Host maps to tenantId. No card numbers on this
                    screen.
                </p>
                <ul className="mt-6 space-y-3">
                    {TENANTS.map((t) => (
                        <li key={t.id} className="rounded-xl border border-white/10 bg-zinc-900 p-5">
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{t.id}</p>
                            <h2 className="mt-1 text-xl font-semibold">{t.name}</h2>
                            <p className="mt-2 text-sm text-zinc-400">{t.domain}</p>
                            <p className="mt-1 text-sm text-zinc-400">
                                {t.from.line1}, {t.from.suburb} {t.from.state} {t.from.postcode} ·{" "}
                                {t.from.phone}
                            </p>
                            <dl className="mt-4 grid gap-2 text-sm text-zinc-400 sm:grid-cols-2">
                                <div>
                                    <dt className="text-xs uppercase tracking-wider text-zinc-500">
                                        Stripe account
                                    </dt>
                                    <dd>{t.stripeAccountId || "Not connected"}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs uppercase tracking-wider text-zinc-500">
                                        AusPost account
                                    </dt>
                                    <dd>{t.auspostAccountNumber || "Not connected"}</dd>
                                </div>
                            </dl>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2 className="text-3xl font-semibold">Failed labels</h2>
                <p className="mt-2 text-sm text-zinc-400">
                    Platform sees the failure. The shop prints labels. This screen does not open a PDF.
                </p>
                <ul className="mt-6 space-y-3">
                    {failed.map((s) => {
                        const order = orders.find((o) => o.id === s.orderId);
                        const tenant = TENANTS.find((t) => t.id === s.tenantId);
                        return (
                            <li key={s.id} className="rounded-xl border border-red-500/30 bg-zinc-900 p-5">
                                <p className="text-xs uppercase tracking-[0.2em] text-red-400">{s.id}</p>
                                <p className="mt-1 font-medium">
                                    {tenant?.name || s.tenantId} · {s.orderId}
                                </p>
                                <p className="mt-2 text-sm text-zinc-400">
                                    {s.failReason || "Label was not booked."}
                                </p>
                                {order && (
                                    <p className="mt-2 text-sm text-zinc-500">
                                        {order.name} · {order.lines.map((l) => l.name).join(", ")}
                                    </p>
                                )}
                            </li>
                        );
                    })}
                    {failed.length === 0 && (
                        <li className="text-sm text-zinc-500">No failed labels.</li>
                    )}
                </ul>
            </section>
        </div>
    );
}
