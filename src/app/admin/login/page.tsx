"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { defaultAdminHint, useAdminAuth } from "@/lib/auth";

export default function AdminLoginPage() {
    const login = useAdminAuth((s) => s.login);
    const router = useRouter();
    const [email, setEmail] = useState(defaultAdminHint.email);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    return (
        <div className="grid min-h-screen place-items-center bg-zinc-950 px-4 text-zinc-100">
            <form
                className="w-full max-w-sm space-y-4 rounded-lg border border-white/10 bg-zinc-900 p-8"
                onSubmit={(e) => {
                    e.preventDefault();
                    const res = login(email, password);
                    if (!res.ok) {
                        setError(res.error ?? "Login failed");
                        return;
                    }
                    router.push("/admin");
                }}
            >
                <p className="text-[10px] uppercase tracking-[0.28em] text-orange-400">Super Admin</p>
                <h1 className="text-2xl font-semibold">U.S.A. Motorcycle Centre</h1>
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
                <button className="w-full rounded-md bg-orange-500 py-2.5 text-sm font-semibold text-zinc-950">
                    Sign in
                </button>
                <p className="text-xs text-zinc-500">
                    Super Admin for this shop. Use hello@techaidaustralia.com.au.
                </p>
            </form>
        </div>
    );
}
