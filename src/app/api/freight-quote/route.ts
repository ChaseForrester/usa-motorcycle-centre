import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const body = (await req.json()) as {
        name?: string;
        email?: string;
        phone?: string;
        country?: string;
        notes?: string;
    };
    if (!body.email || !body.country) {
        return NextResponse.json({ error: "Email and country are required." }, { status: 400 });
    }
    return NextResponse.json({
        received: true,
        note: "A person at the shop quotes freight. No live rate is invented here.",
    });
}
