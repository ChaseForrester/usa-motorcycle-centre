import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Paste box until the carrier key exists in secret config. */
export async function POST(req: Request) {
    const tenantId = req.headers.get("x-tenant-id");
    const body = (await req.json()) as { shipmentId?: string; articleId?: string };
    if (!tenantId || !body.shipmentId || !body.articleId?.trim()) {
        return NextResponse.json({ error: "shipmentId and articleId are required." }, { status: 400 });
    }
    return NextResponse.json({
        stub: true,
        shipmentId: body.shipmentId,
        articleId: body.articleId.trim(),
        note: "Stored on the shipment. Carrier booking waits for the AusPost secret.",
    });
}
