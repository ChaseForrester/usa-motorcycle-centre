import { NextResponse } from "next/server";
import { bookingDelayCopy, bookingReceivedCopy } from "@/lib/inbox";
import { getInboxItem, saveInboxItem } from "@/lib/server-inbox";
import { sendWorkshopEmail } from "@/lib/mail";

export const runtime = "nodejs";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const item = await getInboxItem(params.id);
    if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const body = (await req.json()) as { status?: string; notify?: "delayed" | "received" };
    if (body.status) item.status = body.status;

    const notify = body.notify || (body.status === "delayed" ? "delayed" : undefined);
    if (notify === "delayed" || notify === "received") {
        const copy = notify === "delayed" ? bookingDelayCopy(item) : bookingReceivedCopy(item);
        const result = await sendWorkshopEmail({ to: item.email, ...copy });
        item.emails.push({
            at: new Date().toISOString(),
            subject: copy.subject,
            text: copy.text,
            sent: result.sent,
            error: result.error,
        });
    }

    await saveInboxItem(item);
    return NextResponse.json({ item });
}
