import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { InboxItem } from "./inbox";

const file = path.join(process.cwd(), ".data", "inbox.json");

async function readAll(): Promise<InboxItem[]> {
    try {
        const raw = await readFile(file, "utf8");
        const parsed = JSON.parse(raw) as InboxItem[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

async function writeAll(items: InboxItem[]) {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify(items, null, 2));
}

export async function listInbox(kind?: string): Promise<InboxItem[]> {
    const items = await readAll();
    const filtered = kind ? items.filter((i) => i.kind === kind) : items;
    return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getInboxItem(id: string): Promise<InboxItem | undefined> {
    const items = await readAll();
    return items.find((i) => i.id === id);
}

export async function saveInboxItem(item: InboxItem): Promise<InboxItem> {
    const items = await readAll();
    const i = items.findIndex((x) => x.id === item.id);
    if (i >= 0) items[i] = item;
    else items.unshift(item);
    await writeAll(items);
    return item;
}
