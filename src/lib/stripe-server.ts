import type Stripe from "stripe";

/**
 * Publishable keys may live in env. The Stripe secret is read only from
 * Firebase secret config in Cloud Functions. This Next.js helper never loads
 * STRIPE_SECRET_KEY for a browser-triggered secret call.
 */
export function getPublishableKey() {
    return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
}

/** Stub: live Stripe SDK is constructed in Cloud Functions with defineSecret. */
export async function getStripe(): Promise<Stripe | null> {
    return null;
}
