"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "@/lib/utils";
import { demoOrders, demoShipments } from "./demo";
import type { CommerceOrder, CommerceShipment, FulfilmentStatus } from "./types";

type CommerceState = {
    orders: CommerceOrder[];
    shipments: CommerceShipment[];
    saveOrder: (order: CommerceOrder) => void;
    setFulfilment: (orderId: string, fulfilment: FulfilmentStatus) => void;
    attachArticle: (shipmentId: string, articleId: string) => void;
    lodge: (orderId: string) => { ok: boolean; error?: string };
    shipmentFor: (order: CommerceOrder) => CommerceShipment | undefined;
};

export const useCommerce = create<CommerceState>()(
    persist(
        (set, get) => ({
            orders: demoOrders,
            shipments: demoShipments,
            saveOrder: (order) =>
                set((s) => ({
                    orders: [order, ...s.orders.filter((o) => o.id !== order.id)],
                })),
            setFulfilment: (orderId, fulfilment) =>
                set((s) => ({
                    orders: s.orders.map((o) => (o.id === orderId ? { ...o, fulfilment } : o)),
                })),
            attachArticle: (shipmentId, articleId) =>
                set((s) => ({
                    shipments: s.shipments.map((sh) =>
                        sh.id === shipmentId ? { ...sh, articleId: articleId.trim(), failed: false } : sh
                    ),
                })),
            lodge: (orderId) => {
                const order = get().orders.find((o) => o.id === orderId);
                if (!order) return { ok: false, error: "Order not found." };
                if (order.method !== "ship") return { ok: false, error: "Collect orders are not lodged." };
                if (order.fulfilment !== "labelled") {
                    return { ok: false, error: "Print the label first. Lodged is the next press." };
                }
                const shipment = get().shipments.find((sh) => sh.id === order.shipmentId);
                if (shipment && !shipment.articleId) {
                    return { ok: false, error: "Paste the article id before lodging." };
                }
                set((s) => ({
                    orders: s.orders.map((o) =>
                        o.id === orderId
                            ? {
                                ...o,
                                fulfilment: "lodged",
                                trackingUrl: o.trackingUrl || "https://auspost.com.au/mypost/track/#/search",
                            }
                            : o
                    ),
                }));
                return { ok: true };
            },
            shipmentFor: (order) => get().shipments.find((sh) => sh.id === order.shipmentId),
        }),
        { name: "usamcc-commerce-v1" }
    )
);

export function newShipmentStub(orderId: string, tenantId: string): CommerceShipment {
    const id = uid("shp");
    return {
        id,
        tenantId,
        orderId,
        carrier: "none",
        articleId: "",
        labelPdfUrl: `/api/labels/${id}`,
    };
}
