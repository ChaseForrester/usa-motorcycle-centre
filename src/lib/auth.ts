"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSession } from "@/lib/commerce/session";

export const WORKSHOP_ADMIN_EMAIL = "usa_motorcycle_centre@yahoo.com.au";

type AuthState = {
    email: string | null;
    login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
    logout: () => void;
};

export const useAdminAuth = create<AuthState>()(
    persist(
        (set) => ({
            email: null,
            login: async (email, password) => {
                try {
                    const res = await fetch("/api/admin/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                    });
                    const data = (await res.json().catch(() => null)) as { ok?: boolean; email?: string } | null;
                    if (!res.ok || !data?.ok || !data.email) {
                        return { ok: false, error: "Those details do not match the Super Admin account." };
                    }
                    set({ email: data.email });
                    useSession.getState().signInSuperAdmin("usa-mcc");
                    return { ok: true };
                } catch {
                    return { ok: false, error: "Could not reach the shop login. Try again." };
                }
            },
            logout: () => {
                useSession.getState().signOut();
                set({ email: null });
            },
        }),
        { name: "usamcc-admin" }
    )
);

export const defaultAdminHint = {
    email: WORKSHOP_ADMIN_EMAIL,
};
