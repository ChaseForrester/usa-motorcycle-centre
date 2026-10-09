import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { uid } from "@/lib/utils";

export const runtime = "nodejs";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(req: Request) {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
        return NextResponse.json({ error: "Choose an image." }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
        return NextResponse.json({ error: "Use a JPG, PNG or WebP." }, { status: 400 });
    }
    const buf = Buffer.from(await file.arrayBuffer());
    if (buf.length > 8 * 1024 * 1024) {
        return NextResponse.json({ error: "Image is over 8 MB." }, { status: 400 });
    }
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const id = uid("img");
    const dir = path.join(process.cwd(), ".data", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${id}.${ext}`), buf);
    return NextResponse.json({ url: `/api/uploads/${id}.${ext}` });
}
