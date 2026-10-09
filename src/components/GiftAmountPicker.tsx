"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { GIFT_AMOUNTS, GIFT_MAX, GIFT_MIN } from "@/lib/seed";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/types";
import { cn, money } from "@/lib/utils";

function clampAmount(n: number) {
    if (!Number.isFinite(n)) return GIFT_MIN;
    return Math.min(GIFT_MAX, Math.max(GIFT_MIN, Math.round(n)));
}

export function GiftAmountPicker({ product }: { product: Product }) {
    const add = useCart((s) => s.add);
    const router = useRouter();
    const [amount, setAmount] = useState(GIFT_MIN);
    const [custom, setCustom] = useState(String(GIFT_MIN));

    const label = useMemo(
        () => `$${amount.toLocaleString("en-AU")}`,
        [amount]
    );

    function pick(n: number) {
        const next = clampAmount(n);
        setAmount(next);
        setCustom(String(next));
    }

    return (
        <div>
            <p className="mt-5 font-display text-3xl text-flame">{money(amount)}</p>
            <p className="mt-1 text-xs text-steel">AUD · GST included · {money(GIFT_MIN)} to {money(GIFT_MAX)}</p>

            <p className="mt-8 text-xs uppercase tracking-[0.2em] text-steel">Amount</p>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {GIFT_AMOUNTS.map((n) => (
                    <button
                        key={n}
                        type="button"
                        onClick={() => pick(n)}
                        className={cn(
                            "rounded-sm border px-3 py-2 text-sm",
                            amount === n
                                ? "border-flame bg-flame text-ink"
                                : "border-white/15 text-chrome hover:border-flame"
                        )}
                    >
                        ${n.toLocaleString("en-AU")}
                    </button>
                ))}
            </div>

            <label className="mt-5 block">
                <span className="text-xs uppercase tracking-[0.2em] text-steel">Or any amount</span>
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-chrome">$</span>
                    <input
                        className="input"
                        type="number"
                        min={GIFT_MIN}
                        max={GIFT_MAX}
                        step={1}
                        value={custom}
                        onChange={(e) => {
                            setCustom(e.target.value);
                            const n = Number(e.target.value);
                            if (Number.isFinite(n)) setAmount(clampAmount(n));
                        }}
                        onBlur={() => pick(Number(custom))}
                    />
                </div>
            </label>

            <button
                className="btn-flame mt-8 w-full sm:w-auto"
                onClick={() => {
                    const n = clampAmount(amount);
                    add(product, 1, {
                        id: `amt-${n}`,
                        label,
                        price: n,
                    });
                    router.push("/cart");
                }}
            >
                Add {label} card
            </button>
            <p className="mt-4 text-sm text-steel">
                Collect at 8 Miall Way, or we email it after checkout.
            </p>
        </div>
    );
}
