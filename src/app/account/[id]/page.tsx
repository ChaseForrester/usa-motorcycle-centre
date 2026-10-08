"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCommerce } from "@/lib/commerce/store";
import { useSession } from "@/lib/commerce/session";
import { useTenant } from "@/lib/commerce/tenant-context";
import { buyerShipCopy } from "@/lib/commerce/dispatch";
import { money } from "@/lib/utils";

export default function AccountOrderPage() {
    const { id } = useParams<{ id: string }>();
    const tenant = useTenant();
    const claims = useSession((s) => s.claims);
    const orders = useCommerce((s) => s.orders);
    const shipments = useCommerce((s) => s.shipments);
    const order = orders.find((o) => o.id === id);

    if (!claims || claims.role !== "buyer") {
        return (
            <div className="container-page py-16">
                <Link href="/account" className="text-flame">
                    Sign in
                </Link>
            </div>
        );
    }

    if (!order || order.tenantId !== tenant.id || order.buyerId !== claims.buyerId) {
        return (
            <div className="container-page py-16">
                <p className="text-chrome">That order is not on this account.</p>
            </div>
        );
    }

    const shipment = shipments.find((s) => s.id === order.shipmentId);

    return (
        <div className="container-page max-w-2xl py-12">
            <Link href="/account" className="text-sm text-steel hover:text-white">
                All orders
            </Link>
            <h1 className="display mt-4 text-4xl text-white">{order.id}</h1>
            <p className="mt-4 text-chrome">{buyerShipCopy(order)}</p>
            {order.method === "ship" && order.fulfilment !== "paid" && (
                <p className="mt-3 text-sm text-white">Label booked.</p>
            )}
            {order.method === "ship" && order.trackingUrl && order.fulfilment !== "labelled" && order.fulfilment !== "paid" && (
                <a href={order.trackingUrl} className="mt-4 inline-block text-flame" target="_blank" rel="noreferrer">
                    Tracking link
                </a>
            )}
            {order.method === "collect" && (
                <p className="mt-4 text-white">Collect at 8 Miall Way, Albion Park Rail NSW 2527. No label.</p>
            )}
            {shipment?.lastScan && (
                <p className="mt-4 text-sm text-steel">
                    Last scan {shipment.lastScan.code}
                    {shipment.lastScan.location ? ` · ${shipment.lastScan.location}` : ""}
                </p>
            )}
            <ul className="mt-8 space-y-2 text-chrome">
                {order.lines.map((l) => (
                    <li key={l.productId} className="flex justify-between">
                        <span>
                            {l.name} × {l.qty}
                        </span>
                        <span>{money(l.price * l.qty)}</span>
                    </li>
                ))}
            </ul>
            <p className="mt-6 font-display text-3xl text-white">{money(order.total)}</p>
        </div>
    );
}
