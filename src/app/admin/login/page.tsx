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
                onSubmit={async (e) => {
                    e.preventDefault();
                    setError("");
                    const res = await login(email, password);
                    if (!res.ok) {
                        setError(res.error ?? "Login failed");
                        return;
                    }
                    router.push("/admin");
                }}
            >
                <div className="flex items-center gap-3">
                    <img
                        src="/brand/icon.png"
                        alt="U.S.A. Motorcycle Centre"
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full bg-white object-contain"
                    />
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.28em] text-orange-400">Super Admin</p>
                        <h1 className="text-xl font-semibold">U.S.A. Motorcycle Centre</h1>
                    </div>
                </div>
                <label className="block text-xs text-zinc-400" htmlFor="admin-email">
                    Email
                    <input
                        id="admin-email"
                        className="admin-input mt-1"
                        type="email"
                        autoComplete="username"
                        inputMode="email"
                        spellCheck={false}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label className="block text-xs text-zinc-400" htmlFor="admin-password">
                    Password
                    <input
                        id="admin-password"
                        className="admin-input mt-1"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                {error && <p className="text-sm text-orange-400" role="alert">{error}</p>}
                <button className="min-h-11 w-full rounded-md bg-orange-500 py-2.5 text-sm font-semibold text-zinc-950">
                    Sign in
                </button>
                <p className="text-xs text-zinc-500">
                    Super Admin for this shop. Use usa_motorcycle_centre@yahoo.com.au.
                </p>
            </form>
        </div>
    );
}
