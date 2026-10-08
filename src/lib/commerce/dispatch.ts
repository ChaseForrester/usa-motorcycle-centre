import type { CommerceOrder, DispatchColumn } from "./types";

export const DISPATCH_COLUMNS: { id: DispatchColumn; label: string }[] = [
    { id: "paid", label: "Paid" },
    { id: "to_print", label: "To print" },
    { id: "in_transit", label: "In transit" },
    { id: "delivered", label: "Delivered" },
    { id: "collect", label: "Collect" },
    { id: "exception", label: "Exception" },
];

export function columnForOrder(order: CommerceOrder): DispatchColumn {
    if (order.method === "collect") return "collect";
    if (order.fulfilment === "exception") return "exception";
    if (order.fulfilment === "delivered") return "delivered";
    if (order.fulfilment === "labelled") return "to_print";
    if (order.fulfilment === "lodged" || order.fulfilment === "in_transit") return "in_transit";
    return "paid";
}

export function ordersInColumn(orders: CommerceOrder[], column: DispatchColumn): CommerceOrder[] {
    return orders.filter((o) => columnForOrder(o) === column);
}

export function buyerShipCopy(order: CommerceOrder): string {
    if (order.method === "collect") {
        return order.readyAtCollect
            ? "Ready at 8 Miall Way, Albion Park Rail NSW 2527. No label."
            : "We will message you when it is on the counter at 8 Miall Way. No label.";
    }
    if (order.fulfilment === "paid") return "Paid. Label not booked yet.";
    if (order.fulfilment === "labelled") return "Label booked.";
    if (order.fulfilment === "lodged" || order.fulfilment === "in_transit") return "On the way.";
    if (order.fulfilment === "delivered") return "Delivered.";
    if (order.fulfilment === "exception") return "Held. The shop will call.";
    return "";
}
