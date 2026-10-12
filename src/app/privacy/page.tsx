"use client";

import { useCms } from "@/lib/cms-store";
import { mailHref, telHref } from "@/lib/utils";

export default function PrivacyPage() {
    const s = useCms((x) => x.settings);
    return (
        <article className="container-page prose max-w-3xl py-16 text-[#000B58]">
            <h1 className="display text-5xl text-[#000B58]">Privacy</h1>
            <p className="mt-6">
                {s.brand.legalName} collects the details you give us when you shop, book a service, RSVP to
                an event or join the workshop list — name, email, phone, bike details and order history. We
                use that to fulfil orders, run the workshop diary and tell you about specials you asked for.
            </p>
            <p className="mt-4">
                Card payments are handled by the payment provider. We do not store full card numbers.
                We do not sell your details. You can ask us to update or delete
                your information by emailing{" "}
                <a href={mailHref(s.contact.email)} className="contact-link">
                    {s.contact.email}
                </a>{" "}
                or calling{" "}
                <a href={telHref(s.contact.phone)} className="contact-link">
                    {s.contact.phone}
                </a>
                .
            </p>
            <p className="mt-4">
                Ask us if you want a copy of what we hold, or if something we have is wrong.
            </p>
        </article>
    );
}
