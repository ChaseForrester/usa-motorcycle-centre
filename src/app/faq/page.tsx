import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, faqJsonLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
    "Harley Mechanic FAQ — Wollongong, Shellharbour, Nowra",
    "Straight answers from U.S.A. Motorcycle Centre at 8 Miall Way, Albion Park Rail. Harley service, tyres, smash repairs and click & collect for riders from Wollongong to Nowra.",
    "/faq"
);

export default function FaqPage() {
    return (
        <div className="container-page py-16">
            <JsonLd
                data={[
                    faqJsonLd(),
                    breadcrumbJsonLd([
                        { name: "Home", path: "/" },
                        { name: "FAQ", path: "/faq" },
                    ]),
                ]}
            />
            <p className="label">FAQ</p>
            <h1 className="display mt-2 max-w-4xl text-4xl text-white sm:text-6xl">
                Harley mechanic from Wollongong to Nowra.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-chrome">
                Independent workshop at 8 Miall Way, Albion Park Rail. Laurie and Mick. Est. 1992. Call{" "}
                <a href="tel:+61242572333" className="text-flame">
                    (02) 4257 2333
                </a>
                .
            </p>
            <div className="mt-12">
                <FaqList />
            </div>
            <div className="mt-12 flex flex-wrap gap-3">
                <Link href="/book" className="btn-flame">
                    Book a service
                </Link>
                <Link href="/contact" className="btn-ghost">
                    Get here
                </Link>
            </div>
        </div>
    );
}
