"use client";

import { useEffect } from "react";
import { useCms } from "@/lib/cms-store";
import { firebaseConfigured } from "@/lib/firebase";
import { hydrateFromFirebase, watchCmsToFirebase } from "@/lib/firebase-sync";
import { TenantProvider } from "@/lib/commerce/tenant-context";
import type { Tenant } from "@/lib/commerce/types";

export function Providers({ tenant, children }: { tenant: Tenant; children: React.ReactNode }) {
    const setHydrated = useCms((s) => s.setHydrated);
    useEffect(() => {
        if (useCms.persist.hasHydrated()) setHydrated(true);
        const unsub = useCms.persist.onFinishHydration(() => setHydrated(true));
        return unsub;
    }, [setHydrated]);

    useEffect(() => {
        if (!firebaseConfigured()) return;
        let stop: (() => void) | undefined;
        hydrateFromFirebase()
            .then(() => {
                stop = watchCmsToFirebase();
            })
            .catch(() => undefined);
        return () => stop?.();
    }, []);

    return <TenantProvider tenant={tenant}>{children}</TenantProvider>;
}
