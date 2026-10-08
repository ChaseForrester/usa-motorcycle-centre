import { NextResponse } from "next/server";
import { validateAuAddress } from "@/lib/commerce/address";
import { internationalBlockedClasses, restrictionCopy } from "@/lib/commerce/restricted";
import { dutyEstimate } from "@/lib/commerce/duty";
import { tenantById, TENANTS } from "@/lib/commerce/tenants";
import type { CommerceOrder } from "@/lib/commerce/types";

export const runtime = "nodejs";

/**
 * Browser talks to this route only. Stripe and Australia Post secret
 * endpoints are reached from Cloud Functions using Firebase secret config.
 */
export async function POST(req: Request) {
    const tenantId = req.headers.get("x-tenant-id") || TENANTS[0].id;
    const tenant = tenantById(tenantId);
    if (!tenant) return NextResponse.json({ error: "Unknown shop." }, { status: 404 });

    const body = (await req.json()) as { order: CommerceOrder };
    const order = body.order;
    if (!order?.lines?.length) return NextResponse.json({ error: "Empty cart." }, { status: 400 });
    if (order.tenantId && order.tenantId !== tenant.id) {
        return NextResponse.json({ error: "Tenant mismatch." }, { status: 403 });
    }

    if (order.method === "ship" && order.shipTo?.country && order.shipTo.country !== "AU") {
        const blocked = internationalBlockedClasses(order.lines);
        if (blocked.length) {
            return NextResponse.json(
                {
                    error: blocked.map(restrictionCopy).join(" "),
                    collect: true,
                    freightQuote: true,
                },
                { status: 422 }
            );
        }
        if (!order.international) {
            return NextResponse.json({ error: "International fields are required." }, { status: 422 });
        }
        const estimate = dutyEstimate(order.international);
        return NextResponse.json({
            demo: true,
            duty: estimate,
            note: "createCheckout Cloud Function reads STRIPE_SECRET_KEY from Firebase secret config. Not charged.",
        });
    }

    if (order.method === "ship") {
        const issues = validateAuAddress({
            suburb: order.shipTo?.suburb || "",
            state: order.shipTo?.state || "",
            postcode: order.shipTo?.postcode || "",
        });
        if (issues.length) {
            return NextResponse.json({ error: issues[0].message, issues }, { status: 422 });
        }
    }

    return NextResponse.json({
        demo: true,
        note: "createCheckout Cloud Function is the live path. Browser never holds the Stripe secret.",
    });
}
