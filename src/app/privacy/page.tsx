"use client";

import { useCms } from "@/lib/cms-store";

export default function PrivacyPage() {
    const s = useCms((x) => x.settings);
    return (
        <article className="container-page prose prose-invert max-w-3xl py-16 text-chrome">
            <h1 className="display text-5xl text-white">Privacy</h1>
            <p className="mt-6">
                {s.brand.legalName} collects the details you give us when you shop, book a service, RSVP to
                an event or join the workshop list — name, email, phone, bike details and order history. We
                use that to fulfil orders, run the workshop diary and tell you about specials you asked for.
            </p>
            <p className="mt-4">
                Payments run through Stripe. We do not store full card numbers. Hosting and the product
                catalogue may use Firebase. We do not sell your details. You can ask us to update or delete
                your information by emailing {s.contact.email} or calling {s.contact.phone}.
            </p>
            <p className="mt-4">
                This policy can be edited in Super Admin so it always matches how the shop actually runs.
            </p>
        </article>
    );
}
