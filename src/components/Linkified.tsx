import type { ReactNode } from "react";
import { mailHref, telHref } from "@/lib/utils";

const TOKEN =
    /((?:\+?\d|\(\d)[\d\s().-]{7,}\d)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;

/** Turns phone numbers and email addresses in a sentence into tel: and mailto: links. */
export function Linkified({
    text,
    linkClassName = "contact-link",
}: {
    text: string;
    linkClassName?: string;
}) {
    const nodes: ReactNode[] = [];
    let last = 0;
    let i = 0;
    for (const match of text.matchAll(TOKEN)) {
        const raw = match[0];
        const index = match.index ?? 0;
        if (index > last) nodes.push(text.slice(last, index));
        const email = raw.includes("@");
        nodes.push(
            <a key={i++} href={email ? mailHref(raw) : telHref(raw)} className={linkClassName}>
                {raw}
            </a>
        );
        last = index + raw.length;
    }
    if (last < text.length) nodes.push(text.slice(last));
    return <>{nodes}</>;
}
