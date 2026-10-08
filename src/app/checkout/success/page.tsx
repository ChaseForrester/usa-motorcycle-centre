"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessInner() {
    const params = useSearchParams();
    const demo = params.get("demo");
    const order = params.get("order");
    return (
        <div className="container-page py-24 text-center">
            <p className="label">Sorted</p>
            <h1 className="display mt-2 text-5xl text-white">We have the order.</h1>
            <p className="mx-auto mt-4 max-w-lg text-chrome">
                {demo
                    ? "Demo checkout complete. Stripe charges when the shop secret is in Firebase secret config."
                    : "Payment received. Open your account to watch the order."}
            </p>
            {order && <p className="mt-3 text-xs uppercase tracking-[0.2em] text-steel">Ref {order}</p>}
            <p className="mx-auto mt-4 max-w-lg text-sm text-steel">
                Ship shows label booked, then the tracking link. Collect is ready at 8 Miall Way. No label.
            </p>
            <div className="mt-8 flex justify-center gap-3">
                <Link href="/account" className="btn-flame">
                    Your order
                </Link>
                <Link href="/shop" className="btn-ghost">
                    Keep shopping
                </Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense>
            <SuccessInner />
        </Suspense>
    );
}
