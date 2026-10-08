"use client";

import { useState } from "react";
import { useCms } from "@/lib/cms-store";
import { useTenant } from "@/lib/commerce/tenant-context";

export default function AdminPayments() {
    const tenant = useTenant();
    const settings = useCms((s) => s.settings);
    const updateSettings = useCms((s) => s.updateSettings);
    const [publishable, setPublishable] = useState(settings.stripe.publishableKey);
    const [accountId, setAccountId] = useState(tenant.stripeAccountId);
    const [msg, setMsg] = useState("");

    async function save(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/admin/stripe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                publishableKey: publishable,
                stripeAccountId: accountId,
            }),
        });
        const data = await res.json();
        updateSettings({
            ...settings,
            stripe: {
                ...settings.stripe,
                publishableKey: publishable,
                connected: Boolean(publishable) && data.ok,
            },
        });
        setMsg(
            data.ok
                ? "Account id stored. The Stripe secret stays in Firebase secret config."
                : data.error || "Could not save."
        );
    }

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold">Stripe</h1>
            <p className="mt-2 text-sm text-zinc-600">
                Connect the shop Stripe account. Paste the publishable key and the Stripe account id.
                The secret key is never typed here. It lives in Firebase secret config as
                STRIPE_SECRET_KEY.
            </p>

            <form onSubmit={save} className="mt-6 space-y-4 rounded-xl border bg-white p-6">
                <label className="block text-sm font-medium">Mode</label>
                <select
                    className="admin-input"
                    value={settings.stripe.mode}
                    onChange={(e) =>
                        updateSettings({
                            ...settings,
                            stripe: { ...settings.stripe, mode: e.target.value as "test" | "live" },
                        })
                    }
                >
                    <option value="test">Test</option>
                    <option value="live">Live</option>
                </select>
                <label className="block text-sm font-medium">Publishable key</label>
                <input
                    className="admin-input font-mono text-xs"
                    placeholder="pk_test_..."
                    value={publishable}
                    onChange={(e) => setPublishable(e.target.value)}
                />
                <label className="block text-sm font-medium">Stripe account id</label>
                <input
                    className="admin-input font-mono text-xs"
                    placeholder="acct_..."
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                />
                <button className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold">
                    Save account
                </button>
                {msg && <p className="text-sm text-orange-700">{msg}</p>}
            </form>

            <div className="mt-6 space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm">
                <p className="font-semibold">Secrets</p>
                <p className="text-zinc-600">
                    STRIPE_SECRET_KEY and AUSPOST_API_KEY are defined with defineSecret in Cloud
                    Functions. Checkout and labels run there. This screen never shows a card number.
                </p>
            </div>
        </div>
    );
}
