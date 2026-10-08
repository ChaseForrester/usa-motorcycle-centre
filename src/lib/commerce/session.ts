"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppClaims } from "./types";
import { DEMO_BUYER_EMAIL, DEMO_BUYER_ID } from "./demo";

type SessionState = {
    claims: AppClaims | null;
    signInBuyer: (email: string) => { ok: boolean; error?: string };
    signInSuperAdmin: (tenantId: string) => void;
    signInPlatform: () => void;
    signOut: () => void;
};

export const useSession = create<SessionState>()(
    persist(
        (set) => ({
            claims: null,
            signInBuyer: (email) => {
                const trimmed = email.trim().toLowerCase();
                if (!trimmed.includes("@")) return { ok: false, error: "Enter the email on the order." };
                const buyerId = trimmed === DEMO_BUYER_EMAIL ? DEMO_BUYER_ID : `buyer-${trimmed}`;
                set({
                    claims: {
                        role: "buyer",
                        tenantId: "usa-mcc",
                        buyerId,
                    },
                });
                return { ok: true };
            },
            signInSuperAdmin: (tenantId) => set({ claims: { role: "superadmin", tenantId } }),
            signInPlatform: () => set({ claims: { role: "platform" } }),
            signOut: () => set({ claims: null }),
        }),
        { name: "usamcc-claims-v1" }
    )
);
