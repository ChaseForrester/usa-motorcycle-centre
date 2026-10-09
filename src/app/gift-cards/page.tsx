"use client";

import Image from "next/image";
import Link from "next/link";
import { GiftAmountPicker } from "@/components/GiftAmountPicker";
import { useCms } from "@/lib/cms-store";

export default function GiftCardsPage() {
    const product = useCms((s) => s.products).find((p) => p.category === "Gift Cards");
    const settings = useCms((s) => s.settings);

    if (!product) {
        return (
            <div className="container-page py-12">
                <p className="label">Gift cards</p>
                <h1 className="display mt-2 text-5xl text-white">Ask the workshop.</h1>
                <p className="mt-4 max-w-xl text-chrome">
                    Call {settings.contact.phone} and Laurie or Mick will sort one.
                </p>
            </div>
        );
    }

    return (
        <div className="container-page py-12">
            <p className="label">Gift cards</p>
            <h1 className="display mt-2 text-5xl text-white">$100 to $5,000.</h1>
            <p className="mt-4 max-w-2xl text-chrome">
                Workshop time, smash work, tyres or a shirt from the rack. Pick a set amount or type
                any figure from $100 to $5,000.
            </p>

            <div className="mt-10 grid gap-10 lg:grid-cols-2">
                <div className="relative aspect-[16/9] overflow-hidden rounded-sm border border-white/10 bg-ash">
                    <Image
                        src={product.images[0]}
                        alt="U.S.A. Motorcycle Centre workshop gift card"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div>
                    <p className="label">{product.brand}</p>
                    <h2 className="display mt-2 text-4xl text-white">{product.name}</h2>
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
                        Shirts
                    </Link>
                </div>
            </div>
        </div>
    );
}
