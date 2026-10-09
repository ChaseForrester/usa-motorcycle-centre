import { NextResponse } from "next/server";
import { uid } from "@/lib/utils";
import { bookingReceivedCopy, type InboxItem, type InboxKind } from "@/lib/inbox";
import { listInbox, saveInboxItem } from "@/lib/server-inbox";
import { sendWorkshopEmail } from "@/lib/mail";

export const runtime = "nodejs";

const KINDS: InboxKind[] = ["booking", "contact", "freight", "newsletter", "event"];

export async function GET(req: Request) {
    const kind = new URL(req.url).searchParams.get("kind") || undefined;
    const items = await listInbox(kind || undefined);
    return NextResponse.json({ items });
}

export async function POST(req: Request) {
    const body = (await req.json()) as Partial<InboxItem> & { kind?: string };
    const kind = body.kind as InboxKind;
    if (!KINDS.includes(kind)) {
        return NextResponse.json({ error: "Unknown form." }, { status: 400 });
    }
    const email = (body.email || "").trim().toLowerCase();
    if (kind !== "newsletter" && !email.includes("@")) {
        return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    if (kind === "newsletter" && !email.includes("@")) {
        return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const item: InboxItem = {
        id: uid("inb"),
        createdAt: new Date().toISOString(),
        kind,
        name: (body.name || "").trim() || email,
        email,
        phone: (body.phone || "").trim(),
        message: (body.message || "").trim(),
        fields: body.fields || {},
        status: kind === "booking" ? "new" : "new",
        emails: [],
    };

    if (kind === "booking") {
        const copy = bookingReceivedCopy(item);
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
