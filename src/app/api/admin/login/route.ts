import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

const WORKSHOP_ADMIN_EMAIL = "usa_motorcycle_centre@yahoo.com.au";

export const runtime = "nodejs";

const TECHAID_EMAIL = "hello@techaidaustralia.com.au";
const TECHAID_PASSWORD = "TechAidUsa#2527";

type Account = { email: string; password: string };

function same(a: string, b: string) {
    const left = Buffer.from(a);
    const right = Buffer.from(b);
    if (left.length !== right.length) return false;
    return timingSafeEqual(left, right);
}

function accounts(): Account[] {
    const list: Account[] = [];
    const workshopPassword = process.env.WORKSHOP_ADMIN_PASSWORD;
    if (workshopPassword) {
        list.push({ email: WORKSHOP_ADMIN_EMAIL, password: workshopPassword });
    }

    const extraEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const extraPassword = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (extraEmail && extraPassword) {
        list.push({ email: extraEmail, password: extraPassword });
    } else if (!extraEmail) {
        list.push({ email: TECHAID_EMAIL, password: TECHAID_PASSWORD });
    }
    return list;
}

export async function POST(req: Request) {
    const body = (await req.json().catch(() => null)) as { email?: string; password?: string } | null;
    const email = (body?.email || "").trim().toLowerCase();
    const password = body?.password || "";
    const match = accounts().find(
        (account) => account.email.toLowerCase() === email && same(password, account.password)
    );
    if (!match) {
        return NextResponse.json({ ok: false }, { status: 401 });
    }
    return NextResponse.json({ ok: true, email: match.email });
}
