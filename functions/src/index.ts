import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { defineSecret } from "firebase-functions/params";
import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https";

initializeApp();

/** Secrets live in Firebase secret config. They are never committed. */
const STRIPE_SECRET_KEY = defineSecret("STRIPE_SECRET_KEY");
const AUSPOST_API_KEY = defineSecret("AUSPOST_API_KEY");

type Auth = { uid: string; token: Record<string, unknown> };

function requireAuth(auth: Auth | undefined): Auth {
    if (!auth) throw new HttpsError("unauthenticated", "Sign in.");
    return auth;
}

function requireSuperAdmin(auth: Auth, tenantId: string) {
    if (auth.token.role !== "superadmin" || auth.token.tenantId !== tenantId) {
        throw new HttpsError("permission-denied", "Shop Super Admin only.");
    }
}

function requirePlatform(auth: Auth) {
    if (auth.token.role !== "platform") {
        throw new HttpsError("permission-denied", "Platform admin only.");
    }
}

function requireBuyer(auth: Auth, tenantId: string) {
    if (auth.token.role !== "buyer" || auth.token.tenantId !== tenantId) {
        throw new HttpsError("permission-denied", "Buyer only.");
    }
}

/**
 * Browser posts here through the callable. Stripe secret endpoints are never
 * called from the client.
 */
export const createCheckout = onCall(
    { secrets: [STRIPE_SECRET_KEY], cors: true },
    async (request) => {
        const auth = requireAuth(request.auth);
        const tenantId = String(request.data?.tenantId ?? "");
        const orderId = String(request.data?.orderId ?? "");
        if (!tenantId || !orderId) {
            throw new HttpsError("invalid-argument", "tenantId and orderId are required.");
        }
        requireBuyer(auth, tenantId);
        const db = getFirestore();
        const tenantSnap = await db.doc(`tenants/${tenantId}`).get();
        if (!tenantSnap.exists) throw new HttpsError("not-found", "Unknown shop.");
        const stripeAccountId = String(tenantSnap.data()?.stripeAccountId ?? "");
        const keyLoaded = Boolean(STRIPE_SECRET_KEY.value());
        return {
            stub: true,
            tenantId,
            orderId,
            stripeAccountId,
            keyLoaded,
            note: "Would create a Stripe Checkout Session on the tenant account. Secret is not in the repo.",
        };
    }
);

/**
 * Books a 100x150mm label and stores the PDF. Browser never calls Australia Post.
 */
export const createLabel = onCall(
    { secrets: [AUSPOST_API_KEY], cors: true },
    async (request) => {
        const auth = requireAuth(request.auth);
        const tenantId = String(request.data?.tenantId ?? "");
        const orderId = String(request.data?.orderId ?? "");
        if (!tenantId || !orderId) {
            throw new HttpsError("invalid-argument", "tenantId and orderId are required.");
        }
        requireSuperAdmin(auth, tenantId);
        const db = getFirestore();
        const orderSnap = await db.doc(`orders/${orderId}`).get();
        if (!orderSnap.exists) throw new HttpsError("not-found", "Order not found.");
        const order = orderSnap.data() as { method?: string; tenantId?: string };
        if (order.tenantId !== tenantId) throw new HttpsError("permission-denied", "Wrong shop.");
        if (order.method === "collect") {
            throw new HttpsError("failed-precondition", "Collect orders have no label.");
        }
        const keyLoaded = Boolean(AUSPOST_API_KEY.value());
        void getStorage();
        return {
            stub: true,
            tenantId,
            orderId,
            keyLoaded,
            labelSize: "100x150mm",
            storagePath: `tenants/${tenantId}/labels/${orderId}.pdf`,
            note: "Would call Australia Post, store the PDF, set fulfilment labelled. Paste article id until the key exists.",
        };
    }
);

/** Lodged is the only shop status press. */
export const lodgeShipment = onCall(
    { secrets: [AUSPOST_API_KEY], cors: true },
    async (request) => {
        const auth = requireAuth(request.auth);
        const tenantId = String(request.data?.tenantId ?? "");
        const orderId = String(request.data?.orderId ?? "");
        if (!tenantId || !orderId) {
            throw new HttpsError("invalid-argument", "tenantId and orderId are required.");
        }
        requireSuperAdmin(auth, tenantId);
        const db = getFirestore();
        const orderSnap = await db.doc(`orders/${orderId}`).get();
        if (!orderSnap.exists) throw new HttpsError("not-found", "Order not found.");
        const order = orderSnap.data() as {
            method?: string;
            fulfilment?: string;
            tenantId?: string;
            shipmentId?: string;
        };
        if (order.tenantId !== tenantId) throw new HttpsError("permission-denied", "Wrong shop.");
        if (order.method !== "ship") {
            throw new HttpsError("failed-precondition", "Collect orders are not lodged.");
        }
        if (order.fulfilment !== "labelled") {
            throw new HttpsError("failed-precondition", "Print the label first.");
        }
        const keyLoaded = Boolean(AUSPOST_API_KEY.value());
        return {
            stub: true,
            tenantId,
            orderId,
            shipmentId: order.shipmentId ?? "",
            keyLoaded,
            note: "Would mark the article lodged with the carrier and set fulfilment lodged.",
        };
    }
);

/** Paste box until the carrier key exists in secret config. */
export const attachArticleId = onCall({ cors: true }, async (request) => {
    const auth = requireAuth(request.auth);
    const tenantId = String(request.data?.tenantId ?? "");
    const shipmentId = String(request.data?.shipmentId ?? "");
    const articleId = String(request.data?.articleId ?? "").trim();
    if (!tenantId || !shipmentId || !articleId) {
        throw new HttpsError("invalid-argument", "shipmentId and articleId are required.");
    }
    requireSuperAdmin(auth, tenantId);
    const db = getFirestore();
    const snap = await db.doc(`shipments/${shipmentId}`).get();
    if (!snap.exists) throw new HttpsError("not-found", "Shipment not found.");
    const shipment = snap.data() as { tenantId?: string };
    if (shipment.tenantId !== tenantId) throw new HttpsError("permission-denied", "Wrong shop.");
    return {
        stub: true,
        tenantId,
        shipmentId,
        articleId,
        note: "Would write articleId on the shipment document.",
    };
});

export const listFailedLabels = onCall({ cors: true }, async (request) => {
    const auth = requireAuth(request.auth);
    requirePlatform(auth);
    const db = getFirestore();
    const snap = await db.collection("shipments").where("failed", "==", true).get();
    return {
        stub: true,
        count: snap.size,
        note: "Platform lists failed labels. It does not print them.",
    };
});

/** Stripe webhook. Uses the secret from Firebase secret config. */
export const stripeWebhook = onRequest({ secrets: [STRIPE_SECRET_KEY] }, async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).send("POST only");
        return;
    }
    const keyLoaded = Boolean(STRIPE_SECRET_KEY.value());
    res.status(200).json({
        stub: true,
        keyLoaded,
        note: "Would verify the Stripe signature and set the order paid.",
    });
});

/** Carrier scan webhook. Updates lastScan and fulfilment. */
export const auspostScanWebhook = onRequest({ secrets: [AUSPOST_API_KEY] }, async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).send("POST only");
        return;
    }
    const keyLoaded = Boolean(AUSPOST_API_KEY.value());
    res.status(200).json({
        stub: true,
        keyLoaded,
        note: "Would store lastScan and move fulfilment to in_transit, delivered or exception.",
    });
});
