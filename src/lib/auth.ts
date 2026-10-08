"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSession } from "@/lib/commerce/session";

const DEFAULT_EMAIL = "hello@techaidaustralia.com.au";
const DEFAULT_PASSWORD = "TechAidUsa#2527";

type AuthState = {
    email: string | null;
    login: (email: string, password: string) => { ok: boolean; error?: string };
    logout: () => void;
};

export const useAdminAuth = create<AuthState>()(
    persist(
        (set) => ({
            email: null,
            login: (email, password) => {
                const expectedEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || DEFAULT_EMAIL;
                const expectedPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || DEFAULT_PASSWORD;
                if (
                    email.trim().toLowerCase() === expectedEmail.toLowerCase() &&
                    password === expectedPass
                ) {
                    set({ email: expectedEmail });
                    useSession.getState().signInSuperAdmin("usa-mcc");
                    return { ok: true };
                }
                return { ok: false, error: "Those details do not match the Super Admin account." };
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
    email: DEFAULT_EMAIL,
};
