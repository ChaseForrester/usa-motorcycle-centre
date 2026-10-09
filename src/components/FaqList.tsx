"use client";

import { Linkified } from "@/components/Linkified";
import { FAQS } from "@/lib/seo";

export function FaqList({ limit, dense = false }: { limit?: number; dense?: boolean }) {
    const items = typeof limit === "number" ? FAQS.slice(0, limit) : FAQS;
    return (
        <dl className="divide-y divide-white/10 border-y border-white/10">
            {items.map((item) => (
                <div key={item.q} className={dense ? "py-3" : "py-6"}>
                    <dt className={dense ? "text-base font-semibold leading-snug text-white" : "display text-xl text-white sm:text-2xl"}>
                        {item.q}
                    </dt>
                    <dd className={dense ? "mt-1.5 text-sm leading-snug text-chrome" : "mt-3 max-w-3xl text-chrome"}>
                        <Linkified text={item.a} />
                    </dd>
                </div>
            ))}
        </dl>
    );
}
