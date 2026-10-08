"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DISPATCH_COLUMNS, ordersInColumn } from "@/lib/commerce/dispatch";
import { useCommerce } from "@/lib/commerce/store";
import { useTenant } from "@/lib/commerce/tenant-context";
import { money } from "@/lib/utils";
import type { CommerceOrder, CommerceShipment, DispatchColumn } from "@/lib/commerce/types";

export default function DispatchBoard() {
    const tenant = useTenant();
    const orders = useCommerce((s) => s.orders);
    const shipments = useCommerce((s) => s.shipments);
    const mine = useMemo(
        () => orders.filter((o) => o.tenantId === tenant.id),
        [orders, tenant.id]
    );

    return (
        <div>
            <h1 className="text-2xl font-semibold">Dispatch</h1>
            <p className="mt-1 text-sm text-zinc-500">
                {tenant.name} · {tenant.from.line1}, {tenant.from.suburb} {tenant.from.state}{" "}
                {tenant.from.postcode}
            </p>
            <p className="mt-2 text-sm text-zinc-500">
                Lodged is the only status you press. Print opens the stored 100×150 mm PDF. Paste an
                article id until the carrier key is in secret config.
            </p>
            <div className="mt-8 grid gap-4 xl:grid-cols-6 md:grid-cols-2 lg:grid-cols-3">
                {DISPATCH_COLUMNS.map((col) => {
                    const rows = ordersInColumn(mine, col.id);
                    return (
                        <section key={col.id} className="flex min-h-[12rem] flex-col rounded-xl border border-zinc-200 bg-white">
                            <header className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
                                <h2 className="text-sm font-semibold">{col.label}</h2>
                                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                                    {rows.length}
                                </span>
                            </header>
                            <ul className="flex-1 space-y-3 p-3">
                                {rows.map((order) => (
                                    <li key={order.id}>
                                        <OrderCard
                                            order={order}
                                            column={col.id}
                                            shipment={shipments.find((s) => s.id === order.shipmentId)}
                                        />
                                    </li>
                                ))}
                                {rows.length === 0 && (
                                    <li className="px-1 py-6 text-center text-xs text-zinc-400">Empty</li>
                                )}
                            </ul>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}

function OrderCard({
    order,
    column,
    shipment,
}: {
    order: CommerceOrder;
    column: DispatchColumn;
    shipment?: CommerceShipment;
}) {
    const lodge = useCommerce((s) => s.lodge);
    const attachArticle = useCommerce((s) => s.attachArticle);
    const [article, setArticle] = useState(shipment?.articleId ?? "");
    const [msg, setMsg] = useState("");

    async function saveArticle() {
        if (!shipment) {
            setMsg("No shipment on this order.");
            return;
        }
        const id = article.trim();
        if (!id) {
            setMsg("Paste the article id.");
            return;
        }
        attachArticle(shipment.id, id);
        await fetch("/api/dispatch/article", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shipmentId: shipment.id, articleId: id }),
        });
        setMsg("Article id stored.");
    }

    async function pressLodged() {
        const result = lodge(order.id);
        if (!result.ok) {
            setMsg(result.error || "Could not lodge.");
            return;
        }
        await fetch("/api/dispatch/lodge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: order.id }),
        });
        setMsg("Lodged.");
    }

    return (
        <article className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">{order.id}</p>
            <p className="mt-1 font-medium text-zinc-900">{order.name}</p>
            <ul className="mt-1 text-xs text-zinc-600">
                {order.lines.map((l) => (
                    <li key={l.productId}>
                        {l.name} × {l.qty}
                    </li>
                ))}
            </ul>
            <p className="mt-2 text-xs text-zinc-500">{money(order.total)}</p>

            {column === "paid" && (
                <p className="mt-2 text-xs text-zinc-500">
                    Paid. Label books when the carrier key is in secret config.
                </p>
            )}

            {column === "collect" && (
                <p className="mt-2 text-xs text-zinc-700">
                    {order.readyAtCollect
                        ? "Ready at 8 Miall Way, Albion Park Rail NSW 2527. No label."
                        : "Collect at 8 Miall Way. No label."}
                </p>
            )}

            {column === "exception" && (
                <p className="mt-2 text-xs text-red-700">
                    {order.notes || shipment?.failReason || "Exception. Call the buyer."}
                </p>
            )}

            {column === "to_print" && shipment && (
                <div className="mt-3 space-y-2">
                    <Link
                        href={`/admin/print/${shipment.id}`}
                        target="_blank"
                        className="block rounded-md bg-zinc-950 px-3 py-1.5 text-center text-xs font-semibold text-white"
                    >
                        Print
                    </Link>
                    {!shipment.articleId && (
                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                                Article id
                            </label>
                            <input
                                className="admin-input mt-1 text-xs"
                                value={article}
                                onChange={(e) => setArticle(e.target.value)}
                                placeholder="Paste until the carrier key exists"
                            />
                            <button
                                type="button"
                                onClick={saveArticle}
                                className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs"
                            >
                                Save article id
                            </button>
                        </div>
                    )}
                    {shipment.articleId && (
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                            Article {shipment.articleId}
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={pressLodged}
                        className="w-full rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-zinc-950"
                    >
                        Lodged
                    </button>
                </div>
            )}

            {column === "in_transit" && order.trackingUrl && (
                <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs text-orange-600"
                >
                    Tracking
                </a>
            )}

            {msg && <p className="mt-2 text-xs text-zinc-600">{msg}</p>}
        </article>
    );
}
