"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { TechAidBadge } from "@/components/TechAidBrand";
import { useSession } from "@/lib/commerce/session";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const claims = useSession((s) => s.claims);
    const signOut = useSession((s) => s.signOut);

    useEffect(() => {
        if (pathname === "/platform/login") return;
        if (claims?.role !== "platform") router.replace("/platform/login");
    }, [claims, pathname, router]);

    if (pathname === "/platform/login") return <>{children}</>;
    if (claims?.role !== "platform") return <div className="min-h-screen bg-zinc-950" />;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div className="flex items-center gap-4">
                    <TechAidBadge />
                    <p className="text-sm text-zinc-400">Platform admin · tenants and failed labels</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <Link href="/platform" className="text-zinc-300 hover:text-white">
                        Overview
                    </Link>
                    <button
                        type="button"
                        onClick={() => {
                            signOut();
                            router.push("/platform/login");
                        }}
                        className="text-zinc-400 hover:text-white"
                    >
                        Sign out
                    </button>
                </div>
            </header>
            <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
        </div>
    );
}
