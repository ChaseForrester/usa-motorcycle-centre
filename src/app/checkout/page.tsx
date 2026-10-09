"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cartSubtotal, useCart } from "@/lib/cart";
import { useCms } from "@/lib/cms-store";
import { money, uid } from "@/lib/utils";
import { validateAuAddress } from "@/lib/commerce/address";
import { canShipInternational, internationalBlockedClasses, restrictionCopy } from "@/lib/commerce/restricted";
import { dutyEstimate } from "@/lib/commerce/duty";
import { useCommerce } from "@/lib/commerce/store";
import { useTenant } from "@/lib/commerce/tenant-context";
import { collectLabel } from "@/lib/commerce/tenants";
import type { CommerceOrder, InternationalFields } from "@/lib/commerce/types";

export default function CheckoutPage() {
    const router = useRouter();
    const tenant = useTenant();
    const { items, fulfillment, discountCode, clear } = useCart();
    const settings = useCms((s) => s.settings);
    const discounts = useCms((s) => s.discounts);
    const saveOrder = useCommerce((s) => s.saveOrder);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [issues, setIssues] = useState<string[]>([]);
    const [intl, setIntl] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        line1: "",
        suburb: "",
        postcode: "",
        state: "NSW",
        country: "AU",
        description: "",
        quantity: "1",
        valueAud: "",
        weightKg: "",
        hsCode: "",
    });

    const subtotal = cartSubtotal(items);
    const discount = discounts.find(
        (d) => d.active && d.code.toLowerCase() === discountCode.trim().toLowerCase()
    );
    const discountAmt = discount
        ? discount.type === "percent"
            ? (subtotal * discount.value) / 100
            : discount.value
        : 0;
    const shipping =
        fulfillment === "collect"
            ? 0
            : subtotal - discountAmt >= settings.shipping.freeShippingThreshold
                ? 0
                : settings.shipping.flatRate;
    const total = Math.max(0, subtotal - discountAmt + shipping);
    const blocked = internationalBlockedClasses(items);
    const intlAllowed = canShipInternational(items);

    const intlFields: InternationalFields | undefined = useMemo(() => {
        if (!intl) return undefined;
        return {
            country: form.country.trim().toUpperCase(),
            description: form.description.trim(),
            quantity: Number(form.quantity) || 1,
            valueAud: Number(form.valueAud) || 0,
            weightKg: Number(form.weightKg) || 0,
            hsCode: form.hsCode.trim(),
        };
    }, [intl, form]);

    const estimate = intlFields ? dutyEstimate(intlFields) : null;

    if (items.length === 0) {
        return (
            <div className="container-page py-24">
                <p className="text-chrome">Nothing to check out.</p>
                <Link href="/shop" className="btn-ghost mt-6 inline-flex">
                    Shop
                </Link>
            </div>
        );
    }

    async function pay(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);
        setError("");
        setIssues([]);

        if (fulfillment === "ship" && !intl) {
            const au = validateAuAddress({
                suburb: form.suburb,
                state: form.state,
                postcode: form.postcode,
            });
            if (au.length) {
                setIssues(au.map((i) => i.message));
                setBusy(false);
                return;
            }
        }

        if (fulfillment === "ship" && intl) {
            if (!intlAllowed) {
                setError(blocked.map(restrictionCopy).join(" "));
                setBusy(false);
                return;
            }
            if (!intlFields?.country || intlFields.country === "AU") {
                setError("Enter the destination country.");
                setBusy(false);
                return;
            }
            if (!intlFields.description || !intlFields.hsCode || !intlFields.valueAud || !intlFields.weightKg) {
                setError("International checkout needs description, quantity, value AUD, weight and HS code.");
                setBusy(false);
                return;
            }
        }

        const order: CommerceOrder = {
            id: uid("ord"),
            tenantId: tenant.id,
            buyerId: `buyer-${form.email.trim().toLowerCase()}`,
            createdAt: new Date().toISOString(),
            email: form.email,
            name: form.name,
            phone: form.phone,
            method: fulfillment,
            fulfilment: "paid",
            readyAtCollect: fulfillment === "collect",
            shipTo:
                fulfillment === "ship"
                    ? {
                        line1: form.line1,
                        suburb: form.suburb,
                        state: form.state.toUpperCase(),
                        postcode: form.postcode,
                        country: intl ? form.country.toUpperCase() : "AU",
                        phone: form.phone,
                    }
                    : undefined,
            international: fulfillment === "ship" && intl ? intlFields : undefined,
            lines: items.map((i) => ({
                productId: i.productId,
                name: i.name,
                qty: i.qty,
                price: i.price,
                variant: i.variantLabel,
                category: i.category,
                tags: i.tags,
            })),
            subtotal,
            shipping,
            total,
        };

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Checkout was rejected.");
                return;
            }
            if (data.demo) {
                saveOrder(order);
                clear();
                router.push(`/checkout/success?order=${order.id}&demo=1`);
                return;
            }
            if (data.url) {
                saveOrder(order);
                window.location.href = data.url;
                return;
            }
            setError("Checkout is waiting on the shop Stripe account.");
        } catch {
            setError("Could not start checkout.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="container-page grid gap-12 py-12 lg:grid-cols-2">
            <form onSubmit={pay} className="space-y-4">
                <p className="label">Checkout</p>
                <h1 className="display text-4xl text-white">Your details</h1>
                <input
                    className="input"
                    required
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    className="input"
                    required
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    className="input"
                    required
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />

                {fulfillment === "collect" && (
                    <p className="text-sm text-steel">{collectLabel(tenant)}. No label.</p>
                )}

                {fulfillment === "ship" && (
                    <>
                        <label className="flex items-center gap-2 text-sm text-chrome">
                            <input
                                type="checkbox"
                                checked={intl}
                                disabled={!intlAllowed}
                                onChange={(e) => setIntl(e.target.checked)}
                            />
                            Ship outside Australia
                        </label>
                        {!intlAllowed && (
                            <p className="text-sm text-flame">
                                {blocked.map(restrictionCopy).join(" ")}{" "}
                                <Link href="/freight-quote" className="underline">
                                    Freight quote
                                </Link>
                            </p>
                        )}
                        {!intl && (
                            <>
                                <input
                                    className="input"
                                    required
                                    placeholder="Street address"
                                    value={form.line1}
                                    onChange={(e) => setForm({ ...form, line1: e.target.value })}
                                />
                                <div className="grid grid-cols-3 gap-3">
                                    <input
                                        className="input col-span-1"
                                        required
                                        placeholder="Suburb"
                                        value={form.suburb}
                                        onChange={(e) => setForm({ ...form, suburb: e.target.value })}
                                    />
                                    <input
                                        className="input"
                                        required
                                        placeholder="State"
                                        value={form.state}
                                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                                    />
                                    <input
                                        className="input"
                                        required
                                        placeholder="Postcode"
                                        value={form.postcode}
                                        onChange={(e) => setForm({ ...form, postcode: e.target.value })}
                                    />
                                </div>
                            </>
                        )}
                        {intl && intlAllowed && (
                            <>
                                <input
                                    className="input"
                                    required
                                    placeholder="Country (ISO, e.g. NZ)"
                                    value={form.country}
                                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                                />
                                <input
                                    className="input"
                                    required
                                    placeholder="Description of goods"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        className="input"
                                        required
                                        placeholder="Quantity"
                                        value={form.quantity}
                                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                    />
                                    <input
                                        className="input"
                                        required
                                        placeholder="Value AUD"
                                        value={form.valueAud}
                                        onChange={(e) => setForm({ ...form, valueAud: e.target.value })}
                                    />
                                    <input
                                        className="input"
                                        required
                                        placeholder="Weight kg"
                                        value={form.weightKg}
                                        onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                                    />
                                    <input
                                        className="input"
                                        required
                                        placeholder="HS code"
                                        value={form.hsCode}
                                        onChange={(e) => setForm({ ...form, hsCode: e.target.value })}
                                    />
                                </div>
                                {estimate && (
                                    <div className="rounded-sm border border-white/15 p-4 text-sm text-chrome">
                                        <p className="text-white">Before you pay</p>
                                        <p className="mt-2">GST estimate (10% of declared value): {money(estimate.gstAud)}</p>
                                        <p className="mt-1">{estimate.dutyNote}</p>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

                {issues.map((msg) => (
                    <p key={msg} className="text-sm text-flame">
                        {msg}
                    </p>
                ))}
                {error && <p className="text-sm text-flame">{error}</p>}
                <button className="btn-flame w-full" disabled={busy}>
                    {busy ? "Working…" : `Pay ${money(total)}`}
                </button>
                <p className="text-xs text-steel">
                    Card numbers never touch this shop. Pay goes through Stripe on the server.
                </p>
            </form>
            <aside className="card h-fit p-6">
                <h2 className="display text-2xl text-white">Order</h2>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-steel">
                    {fulfillment === "collect" ? "Collect" : "Ship"}
                </p>
                <ul className="mt-4 space-y-3 text-sm text-chrome">
                    {items.map((i) => (
                        <li key={i.productId + i.variantId} className="flex justify-between gap-4">
                            <span>
                                {i.name}
                                {i.variantLabel ? ` · ${i.variantLabel}` : ""} × {i.qty}
                            </span>
                            <span>{money(i.price * i.qty)}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-6 flex justify-between border-t border-white/10 pt-4 text-white">
                    <span>Total</span>
                    <span className="font-display text-2xl">{money(total)}</span>
                </div>
            </aside>
        </div>
    );
}
