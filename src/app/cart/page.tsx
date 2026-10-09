"use client";

import Image from "next/image";
import Link from "next/link";
import { cartCount, cartKey, cartSubtotal, useCart } from "@/lib/cart";
import { useCms } from "@/lib/cms-store";
import { money } from "@/lib/utils";
import { internationalBlockedClasses, restrictionCopy } from "@/lib/commerce/restricted";
import { useTenant } from "@/lib/commerce/tenant-context";
import { collectLabel } from "@/lib/commerce/tenants";

export default function CartPage() {
    const { items, setQty, remove, fulfillment, setFulfillment, discountCode, setDiscountCode } =
        useCart();
    const settings = useCms((s) => s.settings);
    const discounts = useCms((s) => s.discounts);
    const tenant = useTenant();
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
    const blockedIntl = internationalBlockedClasses(items);
    const total = Math.max(0, subtotal - discountAmt + shipping);

    if (items.length === 0) {
        return (
            <div className="container-page py-24 text-center">
                <h1 className="display text-5xl text-white">Cart is empty.</h1>
                <p className="mt-4 text-chrome">The hoodie is still on the rack.</p>
                <Link href="/shop" className="btn-flame mt-8 inline-flex">
                    Shop the range
                </Link>
            </div>
        );
    }

    return (
        <div className="container-page grid gap-12 py-12 lg:grid-cols-[1.2fr_.8fr]">
            <div>
                <h1 className="display text-4xl text-white">Cart ({cartCount(items)})</h1>
                <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
                    {items.map((it) => (
                        <li key={cartKey(it)} className="flex gap-4 py-5">
                            <div className="relative h-28 w-24 overflow-hidden rounded-sm bg-ash">
                                <Image src={it.image} alt={it.name} fill className="object-cover" />
                            </div>
                            <div className="flex flex-1 flex-col">
                                <div className="flex justify-between gap-4">
                                    <div>
                                        <Link href={`/shop/${it.slug}`} className="font-display text-xl uppercase text-white">
                                            {it.name}
                                        </Link>
                                        {it.variantLabel && (
                                            <p className="text-sm text-steel">
                                                {it.category === "Gift Cards" || it.variantLabel.startsWith("$")
                                                    ? it.variantLabel
                                                    : `Size ${it.variantLabel}`}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-flame">{money(it.price * it.qty)}</p>
                                </div>
                                <div className="mt-auto flex items-center gap-3">
                                    <input
                                        type="number"
                                        min={1}
                                        value={it.qty}
                                        onChange={(e) => setQty(cartKey(it), Number(e.target.value))}
                                        className="input w-20"
                                    />
                                    <button
                                        onClick={() => remove(cartKey(it))}
                                        className="text-xs uppercase tracking-[0.18em] text-steel hover:text-flame"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <aside className="card h-fit p-6">
                <h2 className="display text-2xl text-white">Checkout</h2>
                <div className="mt-6 space-y-3">
                    <label className="flex items-start gap-3 text-sm">
                        <input
                            type="radio"
                            checked={fulfillment === "collect"}
                            onChange={() => setFulfillment("collect")}
                        />
                        <span>
                            <span className="text-white">{collectLabel(tenant)}</span>
                            <span className="block text-steel">Ready when we message you. No label.</span>
                        </span>
                    </label>
                    {settings.shipping.australiaPostEnabled && (
                        <label className="flex items-start gap-3 text-sm">
                            <input
                                type="radio"
                                checked={fulfillment === "ship"}
                                onChange={() => setFulfillment("ship")}
                            />
                            <span>
                                <span className="text-white">Ship</span>
                                <span className="block text-steel">
                                    Australia. Rate comes from the shop shipping settings. International is a
                                    separate step at checkout.
                                </span>
                            </span>
                        </label>
                    )}
                    {fulfillment === "ship" && blockedIntl.length > 0 && (
                        <p className="text-xs text-flame">
                            {blockedIntl.map(restrictionCopy).join(" ")} International is off for this cart.
                            Collect, or <a className="underline" href="/freight-quote">ask for a freight quote</a>.
                        </p>
                    )}
                </div>
                <div className="mt-6">
                    <label className="text-xs uppercase tracking-[0.2em] text-steel">Discount code</label>
                    <input
                        className="input mt-2"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="ILLAWARRA10"
                    />
                    {discount && (
                        <p className="mt-2 text-xs text-flame">
                            {discount.code} applied
                            {discount.type === "percent" ? ` · ${discount.value}%` : ` · ${money(discount.value)}`}
                        </p>
                    )}
                </div>
                <dl className="mt-6 space-y-2 text-sm">
                    <div className="flex justify-between text-chrome">
                        <dt>Subtotal</dt>
                        <dd>{money(subtotal)}</dd>
                    </div>
                    {discountAmt > 0 && (
                        <div className="flex justify-between text-flame">
                            <dt>Discount</dt>
                            <dd>-{money(discountAmt)}</dd>
                        </div>
                    )}
                    <div className="flex justify-between text-chrome">
                        <dt>Shipping</dt>
                        <dd>{shipping === 0 ? "Free" : money(shipping)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-3 text-white">
                        <dt>Total</dt>
                        <dd className="font-display text-2xl">{money(total)}</dd>
                    </div>
                </dl>
                <Link href="/checkout" className="btn-flame mt-6 w-full">
                    Continue to payment
                </Link>
                <p className="mt-3 text-center text-xs text-steel">
                    Stripe checkout · AUD · GST included
                </p>
            </aside>
        </div>
    );
}
