"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TechAidBadge } from "@/components/TechAidBrand";
import { useSession } from "@/lib/commerce/session";

export default function PlatformLoginPage() {
    const router = useRouter();
    const signInPlatform = useSession((s) => s.signInPlatform);
    const [email, setEmail] = useState("platform@techaid.local");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    return (
        <div className="grid min-h-screen place-items-center bg-zinc-950 px-4 text-zinc-100">
            <form
                className="w-full max-w-sm space-y-4 rounded-lg border border-white/10 bg-zinc-900 p-8"
                onSubmit={(e) => {
                    e.preventDefault();
                    const expectedEmail = process.env.NEXT_PUBLIC_PLATFORM_EMAIL || "platform@techaid.local";
                    const expectedPass = process.env.NEXT_PUBLIC_PLATFORM_PASSWORD || "PlatformAdmin1992!";
                    if (
                        email.trim().toLowerCase() === expectedEmail.toLowerCase() &&
                        password === expectedPass
                    ) {
                        signInPlatform();
                        router.push("/platform");
                        return;
                    }
                    setError("Those details do not match the platform admin account.");
                }}
            >
                <TechAidBadge />
                <h1 className="text-2xl font-semibold">Platform admin</h1>
                <p className="text-sm text-zinc-400">Tenants and failed labels. No shop brand here.</p>
                <input
                    className="admin-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="admin-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="text-sm text-orange-400">{error}</p>}
                <button className="w-full rounded-md bg-[#3ebb00] py-2.5 text-sm font-semibold text-zinc-950">
                    Sign in
                </button>
            </form>
        </div>
    );
}
