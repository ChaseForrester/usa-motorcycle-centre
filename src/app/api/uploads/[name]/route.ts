import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const TYPES: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
};

export async function GET(_req: Request, { params }: { params: { name: string } }) {
    const name = params.name.replace(/[^a-zA-Z0-9._-]/g, "");
    const ext = name.split(".").pop()?.toLowerCase() || "jpg";
    const type = TYPES[ext];
    if (!type) return NextResponse.json({ error: "Not found." }, { status: 404 });
    try {
        const buf = await readFile(path.join(process.cwd(), ".data", "uploads", name));
        return new NextResponse(new Uint8Array(buf), {
            headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000" },
        });
    } catch {
        return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
}
