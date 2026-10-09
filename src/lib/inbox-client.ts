import type { InboxItem, InboxKind } from "./inbox";

export async function submitInbox(input: {
    kind: InboxKind;
    name: string;
    email: string;
    phone?: string;
    message?: string;
    fields?: Record<string, string>;
}): Promise<{ ok: boolean; item?: InboxItem; error?: string }> {
    const res = await fetch("/api/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    const data = (await res.json()) as { item?: InboxItem; error?: string };
    if (!res.ok) return { ok: false, error: data.error || "Could not send." };
    return { ok: true, item: data.item };
}

export async function fetchInbox(kind?: string): Promise<InboxItem[]> {
    const url = kind ? `/api/inbox?kind=${encodeURIComponent(kind)}` : "/api/inbox";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: InboxItem[] };
    return data.items ?? [];
}

export async function patchInbox(
    id: string,
    patch: { status?: string; notify?: "delayed" | "received" }
): Promise<{ ok: boolean; item?: InboxItem; error?: string }> {
    const res = await fetch(`/api/inbox/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
    });
    const data = (await res.json()) as { item?: InboxItem; error?: string };
    if (!res.ok) return { ok: false, error: data.error || "Could not update." };
    return { ok: true, item: data.item };
}

export async function uploadProductImage(file: File): Promise<{ ok: boolean; url?: string; error?: string }> {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/uploads", { method: "POST", body });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok) return { ok: false, error: data.error || "Upload failed." };
    return { ok: true, url: data.url };
}
