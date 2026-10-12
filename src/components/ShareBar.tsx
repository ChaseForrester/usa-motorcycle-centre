"use client";

import { useEffect, useState } from "react";
import { shareTargets } from "@/lib/share";

export function ShareBar({
    url,
    title,
    description,
}: {
    url: string;
    title: string;
    description: string;
}) {
    const [copied, setCopied] = useState(false);
    const [canShare, setCanShare] = useState(false);
    const targets = shareTargets(url, title, description);

    useEffect(() => {
        setCanShare(typeof navigator.share === "function");
    }, []);

    async function copy() {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
        } catch {
            setCopied(false);
        }
    }

    async function nativeShare() {
        if (!navigator.share) {
            await copy();
            return;
        }
        try {
            await navigator.share({ title, text: description, url });
        } catch {
            /* The sheet was dismissed. */
        }
    }

    return (
        <div className="mt-8 border-t border-[#000B58]/15 pt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C40000]">
                Share this
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
                {canShare && (
                    <button type="button" onClick={nativeShare} className="btn-flame !px-4 !py-2 text-[11px]">
                        Share
                    </button>
                )}
                {targets.map((target) => (
                    <a
                        key={target.id}
                        href={target.href}
                        target={target.id === "email" || target.id === "sms" ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center rounded-sm border border-[#000B58]/25 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#000B58] hover:border-[#C40000] hover:text-[#C40000]"
                    >
                        {target.label}
                    </a>
                ))}
                <button
                    type="button"
                    onClick={copy}
                    className="inline-flex min-h-11 items-center rounded-sm border border-[#000B58]/25 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#000B58] hover:border-[#C40000] hover:text-[#C40000]"
                >
                    {copied ? "Link copied" : "Copy link"}
                </button>
            </div>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-[#000B58]/70">
                Instagram, TikTok and Snapchat open from the Share button on your phone. The link carries this page’s picture and description.
            </p>
        </div>
    );
}
