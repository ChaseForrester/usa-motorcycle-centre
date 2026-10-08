import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Super Admin stores the Stripe Connect account id on the tenant.
 * STRIPE_SECRET_KEY lives in Firebase secret config. The browser never posts it.
 */
export async function POST(req: Request) {
    const tenantId = req.headers.get("x-tenant-id");
    const body = (await req.json()) as {
        stripeAccountId?: string;
        publishableKey?: string;
        secretKey?: string;
    };
    if (body.secretKey) {
        return NextResponse.json(
            {
                ok: false,
                error: "Do not paste the Stripe secret here. Put STRIPE_SECRET_KEY in Firebase secret config.",
            },
            { status: 400 }
        );
    }
    if (!tenantId) {
        return NextResponse.json({ ok: false, error: "Unknown shop." }, { status: 400 });
    }
    return NextResponse.json({
        ok: true,
        stub: true,
        tenantId,
        stripeAccountId: body.stripeAccountId || "",
        publishableKey: body.publishableKey || "",
        note: "createCheckout reads STRIPE_SECRET_KEY from Firebase secret config.",
    });
}
