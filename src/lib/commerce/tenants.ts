import type { Tenant } from "./types";

/** Public tenant records only. Stripe and AusPost secrets live in Firebase secret config. */
export const TENANTS: Tenant[] = [
    {
        id: "usa-mcc",
        name: "U.S.A. Motorcycle Centre",
        domain: "usamotorcyclecentre.com.au",
        from: {
            line1: "8 Miall Way",
            suburb: "Albion Park Rail",
            state: "NSW",
            postcode: "2527",
            country: "AU",
            phone: "02 4257 2333",
        },
        stripeAccountId: "",
        auspostAccountNumber: "",
    },
];

const HOST_ALIASES: Record<string, string> = {
    "usamotorcyclecentre.com.au": "usa-mcc",
    "www.usamotorcyclecentre.com.au": "usa-mcc",
    localhost: "usa-mcc",
    "127.0.0.1": "usa-mcc",
};

export const PLATFORM_HOSTS = new Set([
    "platform.techaidaustralia.com.au",
    "www.platform.techaidaustralia.com.au",
]);

export function tenantById(id: string): Tenant | undefined {
    return TENANTS.find((t) => t.id === id);
}

export function tenantByHost(hostHeader: string): Tenant | undefined {
    const host = hostHeader.split(":")[0].trim().toLowerCase();
    const id = HOST_ALIASES[host];
    if (id) return tenantById(id);
    return TENANTS.find((t) => t.domain === host || `www.${t.domain}` === host);
}

export function isPlatformHost(hostHeader: string): boolean {
    const host = hostHeader.split(":")[0].trim().toLowerCase();
    return PLATFORM_HOSTS.has(host);
}

export function collectLabel(tenant: Tenant): string {
    return `Collect at ${tenant.from.line1}, ${tenant.from.suburb} ${tenant.from.state} ${tenant.from.postcode}`;
}
