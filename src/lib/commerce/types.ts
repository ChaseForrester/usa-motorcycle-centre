export type TenantId = string;

export type Address = {
    line1: string;
    line2?: string;
    suburb: string;
    state: string;
    postcode: string;
    country: string;
    phone?: string;
};

export type Tenant = {
    id: TenantId;
    name: string;
    domain: string;
    from: Address;
    stripeAccountId: string;
    auspostAccountNumber: string;
};

export type FulfilmentMethod = "ship" | "collect";

export type FulfilmentStatus =
    | "paid"
    | "labelled"
    | "lodged"
    | "in_transit"
    | "delivered"
    | "exception";

export type OrderLine = {
    productId: string;
    name: string;
    qty: number;
    price: number;
    variant?: string;
    category?: string;
    tags?: string[];
};

export type InternationalFields = {
    country: string;
    description: string;
    quantity: number;
    valueAud: number;
    weightKg: number;
    hsCode: string;
};

export type CommerceOrder = {
    id: string;
    tenantId: TenantId;
    buyerId: string;
    createdAt: string;
    email: string;
    name: string;
    phone: string;
    shipTo?: Address;
    lines: OrderLine[];
    method: FulfilmentMethod;
    fulfilment: FulfilmentStatus;
    international?: InternationalFields;
    subtotal: number;
    shipping: number;
    total: number;
    stripeSessionId?: string;
    shipmentId?: string;
    trackingUrl?: string;
    readyAtCollect?: boolean;
    notes?: string;
};

export type ScanEvent = {
    at: string;
    code: string;
    location?: string;
};

export type CommerceShipment = {
    id: string;
    tenantId: TenantId;
    orderId: string;
    carrier: "auspost" | "none";
    articleId: string;
    labelPdfUrl: string;
    lastScan?: ScanEvent;
    failed?: boolean;
    failReason?: string;
};

export type SuperAdminClaims = {
    role: "superadmin";
    tenantId: TenantId;
};

export type BuyerClaims = {
    role: "buyer";
    tenantId: TenantId;
    buyerId: string;
};

export type PlatformClaims = {
    role: "platform";
};

export type AppClaims = SuperAdminClaims | BuyerClaims | PlatformClaims;

export type DispatchColumn =
    | "paid"
    | "to_print"
    | "in_transit"
    | "delivered"
    | "collect"
    | "exception";
