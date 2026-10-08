import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Shop Super Admin presses Lodged. Carrier call happens in Cloud Functions. */
export async function POST(req: Request) {
    const tenantId = req.headers.get("x-tenant-id");
    const body = (await req.json()) as { orderId?: string };
    if (!tenantId || !body.orderId) {
        return NextResponse.json({ error: "orderId and tenant are required." }, { status: 400 });
    }
    return NextResponse.json({
        stub: true,
        orderId: body.orderId,
        note: "lodgeShipment function uses AUSPOST_API_KEY from Firebase secret config.",
    });
}
