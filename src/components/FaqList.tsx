"use client";

import { Linkified } from "@/components/Linkified";
import { FAQS } from "@/lib/seo";

export function FaqList() {
    return (
        <dl className="divide-y divide-white/10 border-y border-white/10">
            {FAQS.map((item) => (
                <div key={item.q} className="py-6">
                    <dt className="display text-xl text-white sm:text-2xl">{item.q}</dt>
                    <dd className="mt-3 max-w-3xl text-chrome">
                        <Linkified text={item.a} />
                    </dd>
                </div>
            ))}
        </dl>
    );
}
