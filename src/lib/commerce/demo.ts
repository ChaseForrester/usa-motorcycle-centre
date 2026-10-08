import type { CommerceOrder, CommerceShipment } from "./types";

const TENANT = "usa-mcc";
export const DEMO_BUYER_ID = "buyer-demo-rider";
export const DEMO_BUYER_EMAIL = "rider@example.com";

function order(
    partial: Omit<CommerceOrder, "tenantId" | "buyerId" | "email"> & { email?: string }
): CommerceOrder {
    return {
        tenantId: TENANT,
        buyerId: DEMO_BUYER_ID,
        email: DEMO_BUYER_EMAIL,
        ...partial,
    };
}

/** Line prices are the catalogue prices already on the shop. */
export const demoOrders: CommerceOrder[] = [
    order({
        id: "ord-paid-hoodie",
        createdAt: "2026-10-06T09:12:00.000Z",
        name: "Sam Rider",
        phone: "0412 000 111",
        method: "ship",
        fulfilment: "paid",
        shipTo: {
            line1: "12 Ocean St",
            suburb: "Wollongong",
            state: "NSW",
            postcode: "2500",
            country: "AU",
        },
        lines: [
            {
                productId: "p-hoodie-black",
                name: "Flame Hoodie — Black",
                qty: 1,
                price: 119,
                variant: "L",
                category: "Apparel",
            },
        ],
        subtotal: 119,
        shipping: 14.95,
        total: 133.95,
    }),
    order({
        id: "ord-label-apes",
        createdAt: "2026-10-05T14:40:00.000Z",
        name: "Sam Rider",
        phone: "0412 000 111",
        method: "ship",
        fulfilment: "labelled",
        shipmentId: "shp-apes",
        shipTo: {
            line1: "12 Ocean St",
            suburb: "Wollongong",
            state: "NSW",
            postcode: "2500",
            country: "AU",
        },
        lines: [
            {
                productId: "p-apes",
                name: "Ape Hanger Handlebar Kit",
                qty: 1,
                price: 489,
                category: "Parts & Accessories",
                tags: ["handlebars", "custom"],
            },
        ],
        subtotal: 489,
        shipping: 0,
        total: 489,
    }),
    order({
        id: "ord-transit-chrome",
        createdAt: "2026-10-04T11:05:00.000Z",
        name: "Sam Rider",
        phone: "0412 000 111",
        method: "ship",
        fulfilment: "in_transit",
        shipmentId: "shp-chrome",
        trackingUrl: "https://auspost.com.au/mypost/track/#/search",
        shipTo: {
            line1: "12 Ocean St",
            suburb: "Wollongong",
            state: "NSW",
            postcode: "2500",
            country: "AU",
        },
        lines: [
            {
                productId: "p-kuryakyn",
                name: "Chrome Accent Kit",
                qty: 1,
                price: 179,
                category: "Parts & Accessories",
                tags: ["chrome", "kuryakyn"],
            },
        ],
        subtotal: 179,
        shipping: 14.95,
        total: 193.95,
    }),
    order({
        id: "ord-delivered-crew",
        createdAt: "2026-10-01T10:00:00.000Z",
        name: "Sam Rider",
        phone: "0412 000 111",
        method: "ship",
        fulfilment: "delivered",
        shipmentId: "shp-crew",
        trackingUrl: "https://auspost.com.au/mypost/track/#/search",
        shipTo: {
            line1: "12 Ocean St",
            suburb: "Wollongong",
            state: "NSW",
            postcode: "2500",
            country: "AU",
        },
        lines: [
            {
                productId: "p-crew-black",
                name: "Flame Crew — Black",
                qty: 1,
                price: 89,
                variant: "L",
                category: "Apparel",
            },
        ],
        subtotal: 89,
        shipping: 14.95,
        total: 103.95,
    }),
    order({
        id: "ord-collect-oil",
        createdAt: "2026-10-07T08:30:00.000Z",
        name: "Sam Rider",
        phone: "0412 000 111",
        method: "collect",
        fulfilment: "paid",
        readyAtCollect: true,
        lines: [
            {
                productId: "p-amsoil",
                name: "V-Twin Oil Change Kit",
                qty: 1,
                price: 129,
                category: "Oils & Fluids",
                tags: ["amsoil", "service"],
            },
        ],
        subtotal: 129,
        shipping: 0,
        total: 129,
    }),
    order({
        id: "ord-exception-helmet",
        createdAt: "2026-10-03T16:20:00.000Z",
        name: "Sam Rider",
        phone: "0412 000 111",
        method: "ship",
        fulfilment: "exception",
        shipmentId: "shp-helmet",
        notes: "Address incomplete on the card. Holding at the shop.",
        shipTo: {
            line1: "12 Ocean St",
            suburb: "Wollongong",
            state: "NSW",
            postcode: "2500",
            country: "AU",
        },
        lines: [
            {
                productId: "p-helmet",
                name: "Open Face Helmet",
                qty: 1,
                price: 189,
                variant: "L",
                category: "Helmets",
            },
        ],
        subtotal: 189,
        shipping: 14.95,
        total: 203.95,
    }),
];

export const demoShipments: CommerceShipment[] = [
    {
        id: "shp-apes",
        tenantId: TENANT,
        orderId: "ord-label-apes",
        carrier: "none",
        articleId: "",
        labelPdfUrl: "/api/labels/shp-apes",
    },
    {
        id: "shp-chrome",
        tenantId: TENANT,
        orderId: "ord-transit-chrome",
        carrier: "auspost",
        articleId: "33Z0000000",
        labelPdfUrl: "/api/labels/shp-chrome",
        lastScan: {
            at: "2026-10-07T21:10:00.000Z",
            code: "AWAITING_COLLECTION",
            location: "Albion Park Rail",
        },
    },
    {
        id: "shp-crew",
        tenantId: TENANT,
        orderId: "ord-delivered-crew",
        carrier: "auspost",
        articleId: "33Z0000001",
        labelPdfUrl: "/api/labels/shp-crew",
        lastScan: {
            at: "2026-10-05T13:00:00.000Z",
            code: "DELIVERED",
            location: "Wollongong",
        },
    },
    {
        id: "shp-helmet",
        tenantId: TENANT,
        orderId: "ord-exception-helmet",
        carrier: "none",
        articleId: "",
        labelPdfUrl: "",
        failed: true,
        failReason: "Carrier key is not in secret config. Label was not booked.",
    },
];
