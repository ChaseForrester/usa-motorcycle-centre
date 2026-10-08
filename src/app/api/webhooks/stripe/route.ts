import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Live Stripe webhooks hit the Cloud Function `stripeWebhook`, which reads
 * STRIPE_SECRET_KEY from Firebase secret config. This route is a compile stub.
 */
export async function POST() {
    return NextResponse.json({
        received: true,
        stub: true,
        note: "Use the stripeWebhook Cloud Function. Browser never calls Stripe secret endpoints.",
    });
}
