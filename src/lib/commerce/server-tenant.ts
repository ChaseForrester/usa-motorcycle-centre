import { headers } from "next/headers";
import { TENANTS, tenantById } from "./tenants";
import type { Tenant } from "./types";

export function tenantFromRequest(): Tenant {
    const id = headers().get("x-tenant-id");
    return (id && tenantById(id)) || TENANTS[0];
}
