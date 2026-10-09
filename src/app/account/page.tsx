"use client";

import Link from "next/link";
import { useState } from "react";
import { useCommerce } from "@/lib/commerce/store";
import { useSession } from "@/lib/commerce/session";
import { useTenant } from "@/lib/commerce/tenant-context";
import { buyerShipCopy } from "@/lib/commerce/dispatch";
import { money } from "@/lib/utils";
import { FormLockup, FormNote, TextField } from "@/components/FormLockup";
export default function AccountPage() {
    const tenant = useTenant();
    const claims = useSession((s) => s.claims);
    const signInBuyer = useSession((s) => s.signInBuyer);
    const signOut = useSession((s) => s.signOut);
    const orders = useCommerce((s) => s.orders);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const mine =
        claims?.role === "buyer"
            ? orders.filter((o) => o.tenantId === tenant.id && o.buyerId === claims.buyerId)
            : [];

    if (!claims || claims.role !== "buyer") {
        return (
            <div className="container-page max-w-lg py-16">
                <p className="label">Account</p>
                <h1 className="display mt-2 text-4xl text-white">Your order</h1>
                <p className="mt-4 text-chrome">Use the email on the order. You only see that order.</p>
                <form
                    className="card mt-8 space-y-4 p-6"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const r = signInBuyer(email);
                        if (!r.ok) setError(r.error || "Could not sign in.");
                    }}
                >
                    <FormLockup title="Open your order" hint="Use the email on the order." />
                    <TextField
                        id="account-email"
                        label="Email"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        spellCheck={false}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {error ? <FormNote>{error}</FormNote> : null}
                    <button className="btn-flame w-full">Open account</button>
                </form>
            </div>
        );
    }

    return (
        <div className="container-page py-12">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="label">Account</p>
                    <h1 className="display mt-2 text-4xl text-white">Your orders</h1>
                </div>
                <button className="btn-ghost" onClick={signOut}>
                    Sign out
                </button>
            </div>
            <ul className="mt-10 space-y-4">
                {mine.map((o) => (
                    <li key={o.id} className="card p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-steel">{o.id}</p>
                                <h2 className="display mt-1 text-2xl text-white">
                                    {o.method === "collect" ? "Collect" : "Ship"} · {o.fulfilment.replace("_", " ")}
                                </h2>
                                <p className="mt-2 max-w-xl text-sm text-chrome">{buyerShipCopy(o)}</p>
                                {o.method === "ship" && o.trackingUrl && (o.fulfilment === "lodged" || o.fulfilment === "in_transit" || o.fulfilment === "delivered") && (
                                    <a
                                        href={o.trackingUrl}
                                        className="mt-3 inline-block text-sm text-flame"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Tracking
                                    </a>
                                )}
                            </div>
                            <p className="font-display text-2xl text-white">{money(o.total)}</p>
                        </div>
                        <ul className="mt-4 text-sm text-steel">
                            {o.lines.map((l) => (
                                <li key={l.productId}>
                                    {l.name} × {l.qty}
                                </li>
                            ))}
                        </ul>
                        <Link href={`/account/${o.id}`} className="btn-ghost mt-5 inline-flex">
                            View
                        </Link>
                    </li>
                ))}
            </ul>
            {mine.length === 0 && <p className="mt-10 text-steel">No orders on this email for this shop.</p>}
        </div>
    );
}
