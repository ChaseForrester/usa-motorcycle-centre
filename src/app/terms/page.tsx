"use client";

import { useCms } from "@/lib/cms-store";

export default function TermsPage() {
    const s = useCms((x) => x.settings);
    return (
        <article className="container-page max-w-3xl py-16 text-chrome">
            <h1 className="display text-5xl text-[#000B58]">Terms</h1>
            <p className="mt-6">
                Online prices are in Australian dollars and include GST. Click & collect is from{" "}
                {s.contact.addressLine}, {s.contact.suburb}. Apparel sizing is as marked. Swap unused shirts
                and jumpers in-store within 14 days with the tags still on. Workshop bookings are confirmed
                by phone. Insurance smash repairs are quoted before work starts.
            </p>
            <p className="mt-4">
                {s.brand.name} is an independent motorcycle workshop. Harley-Davidson® is a registered
                trademark of H-D U.S.A., LLC. We are not an authorised Harley-Davidson dealer.
            </p>
        </article>
    );
}
