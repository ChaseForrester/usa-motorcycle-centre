"use client";

import { createContext, useContext } from "react";
import type { Tenant } from "./types";
import { TENANTS } from "./tenants";

const TenantContext = createContext<Tenant>(TENANTS[0]);

export function TenantProvider({
    tenant,
    children,
}: {
    tenant: Tenant;
    children: React.ReactNode;
}) {
    return <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>;
}

export function useTenant(): Tenant {
    return useContext(TenantContext);
}
