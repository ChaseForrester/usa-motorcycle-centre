"use client";

import Link from "next/link";
import { GiftAmountPicker } from "@/components/GiftAmountPicker";
import { GiftCardMotion } from "@/components/GiftCardMotion";
import { useCms } from "@/lib/cms-store";
import { telHref } from "@/lib/utils";

export default function GiftCardsPage() {
    const product = useCms((s) => s.products).find((p) => p.category === "Gift Cards");
    const settings = useCms((s) => s.settings);

    if (!product) {
        return (
            <div className="container-page py-12">
                <p className="label">Gift cards</p>
                <h1 className="display mt-2 text-5xl text-[#000B58]">Ask the workshop.</h1>
                <p className="mt-4 max-w-xl text-chrome">
                    Call{" "}
                    <a href={telHref(settings.contact.phone)} className="contact-link">
                        {settings.contact.phone}
                    </a>{" "}
                    and Laurie or Mick will sort one.
                </p>
            </div>
        );
    }

    return (
        <div className="container-page py-12">
            <p className="label">Gift cards</p>
            <h1 className="display mt-2 text-5xl text-[#000B58]">$100 to $5,000.</h1>
            <p className="mt-4 max-w-2xl text-chrome">
                Workshop time, smash work, tyres or a shirt from the rack. Pick a set amount or type
                any figure from $100 to $5,000.
            </p>

            <div className="mt-10 grid gap-10 lg:grid-cols-2">
                <div className="relative aspect-[16/9] overflow-hidden rounded-sm border border-[#000B58]/15 bg-[#ECECEC]">
                    <GiftCardMotion />
                </div>
                <div>
                    <p className="label">{product.brand}</p>
                    <h2 className="display mt-2 text-4xl text-[#000B58]">{product.name}</h2>
                    <p className="mt-4 leading-relaxed text-chrome">{product.description}</p>
                    <GiftAmountPicker product={product} />
                    {product.details && (
                        <ul className="mt-8 space-y-2 text-sm text-chrome">
                            {product.details.map((d) => (
                                <li key={d}>— {d}</li>
                            ))}
                        </ul>
                    )}
                    <Link href="/shop" className="btn-ghost mt-8 inline-flex">
                        Shop the rack
                    </Link>
                </div>
            </div>
        </div>
    );
}
