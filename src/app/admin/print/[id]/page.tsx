"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdminAuth } from "@/lib/auth";
import { useCommerce } from "@/lib/commerce/store";
import { useTenant } from "@/lib/commerce/tenant-context";

export default function PrintLabelPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const email = useAdminAuth((s) => s.email);
    const tenant = useTenant();
    const shipments = useCommerce((s) => s.shipments);
    const orders = useCommerce((s) => s.orders);
    const shipment = shipments.find((s) => s.id === id && s.tenantId === tenant.id);
    const order = orders.find((o) => o.id === shipment?.orderId);

    useEffect(() => {
        if (!email) router.replace("/admin/login");
    }, [email, router]);

    if (!email) return <div className="min-h-screen bg-white" />;

    if (!shipment || shipment.failed || !shipment.labelPdfUrl) {
        return (
            <div className="grid min-h-screen place-items-center bg-white p-8 text-zinc-900">
                <p>No stored label for this shipment.</p>
            </div>
        );
    }

    if (order?.method === "collect") {
        return (
            <div className="grid min-h-screen place-items-center bg-white p-8 text-zinc-900">
                <p>Collect orders have no label.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-6 text-zinc-900 print:p-0">
            <style>{`
                @page { size: 100mm 150mm; margin: 0; }
                @media print {
                    .no-print { display: none !important; }
                    .label-frame { box-shadow: none; border: 0; }
                }
            `}</style>
            <div className="no-print mb-4 flex items-center gap-3">
                <p className="text-sm text-zinc-600">
                    {tenant.name} · 100 × 150 mm · {shipment.id}
                </p>
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="rounded-md bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white"
                >
                    Print
                </button>
            </div>
            <iframe
                title="Shipping label"
                src={shipment.labelPdfUrl}
                className="label-frame h-[150mm] w-[100mm] border border-zinc-300 bg-white shadow"
            />
        </div>
    );
}
