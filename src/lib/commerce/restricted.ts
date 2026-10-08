import type { CartItem, Product } from "@/lib/types";
import type { OrderLine } from "./types";

export type ShipClass = "general" | "oils" | "aerosols" | "lithium" | "tyres" | "bike";

const INTERNATIONAL_BLOCKED: ShipClass[] = ["oils", "aerosols", "lithium", "tyres", "bike"];

export function shipClassForProduct(product: Pick<Product, "id" | "category" | "tags">): ShipClass {
    const tags = product.tags ?? [];
    if (product.category === "Oils & Fluids" || tags.includes("amsoil") || tags.includes("penrite")) {
        return "oils";
    }
    if (product.category === "Tyres" || tags.includes("dunlop") || tags.includes("pirelli")) {
        return "tyres";
    }
    if (product.id === "p-battery" || tags.includes("lithium")) return "lithium";
    if (tags.includes("aerosol") || tags.includes("aerosols")) return "aerosols";
    if (tags.includes("bike") || tags.includes("whole-bike")) return "bike";
    return "general";
}

export function shipClassForLine(line: OrderLine | CartItem): ShipClass {
    return shipClassForProduct({
        id: line.productId,
        category: line.category ?? "",
        tags: line.tags ?? [],
    });
}

export function internationalBlockedClasses(lines: Array<OrderLine | CartItem>): ShipClass[] {
    const blocked = new Set<ShipClass>();
    for (const line of lines) {
        const cls = shipClassForLine(line);
        if (INTERNATIONAL_BLOCKED.includes(cls)) blocked.add(cls);
    }
    return Array.from(blocked);
}

export function canShipInternational(lines: Array<OrderLine | CartItem>): boolean {
    return internationalBlockedClasses(lines).length === 0;
}

export function restrictionCopy(cls: ShipClass): string {
    switch (cls) {
        case "oils":
            return "Oils cannot go international. Collect, or ask the workshop for a freight quote.";
        case "aerosols":
            return "Aerosols cannot go international. Collect, or ask the workshop for a freight quote.";
        case "lithium":
            return "Loose lithium cannot go international. Collect, or ask the workshop for a freight quote.";
        case "tyres":
            return "Tyres cannot go international. Collect, or ask the workshop for a freight quote.";
        case "bike":
            return "Whole bikes cannot go international. Collect, or ask the workshop for a freight quote.";
        default:
            return "";
    }
}
