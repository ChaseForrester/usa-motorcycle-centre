"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, FulfilmentMethod, Product } from "./types";

type CartState = {
    items: CartItem[];
    fulfillment: FulfilmentMethod;
    discountCode: string;
    setFulfillment: (f: CartState["fulfillment"]) => void;
    setDiscountCode: (c: string) => void;
    add: (product: Product, qty?: number, variant?: { id: string; label: string }) => void;
    setQty: (key: string, qty: number) => void;
    remove: (key: string) => void;
    clear: () => void;
};

export function cartKey(item: Pick<CartItem, "productId" | "variantId">) {
    return `${item.productId}::${item.variantId ?? "default"}`;
}

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            fulfillment: "collect",
            discountCode: "",
            setFulfillment: (f) => set({ fulfillment: f }),
            setDiscountCode: (c) => set({ discountCode: c }),
            add: (product, qty = 1, variant) => {
                const key = cartKey({ productId: product.id, variantId: variant?.id });
                const items = [...get().items];
                const i = items.findIndex((it) => cartKey(it) === key);
                if (i >= 0) {
                    items[i] = { ...items[i], qty: items[i].qty + qty };
                } else {
                    items.push({
                        productId: product.id,
                        slug: product.slug,
                        name: product.name,
                        image: product.images[0],
                        price: variant?.id
                            ? product.variants?.find((v) => v.id === variant.id)?.price ?? product.price
                            : product.price,
                        qty,
                        variantId: variant?.id,
                        variantLabel: variant?.label,
                        category: product.category,
                        tags: product.tags,
                    });
                }
                set({ items });
            },
            setQty: (key, qty) =>
                set({
                    items: get()
                        .items.map((it) => (cartKey(it) === key ? { ...it, qty } : it))
                        .filter((it) => it.qty > 0),
                }),
            remove: (key) => set({ items: get().items.filter((it) => cartKey(it) !== key) }),
            clear: () => set({ items: [], discountCode: "" }),
        }),
        { name: "usamcc-cart" }
    )
);

export function cartCount(items: CartItem[]) {
    return items.reduce((n, i) => n + i.qty, 0);
}

export function cartSubtotal(items: CartItem[]) {
    return items.reduce((n, i) => n + i.price * i.qty, 0);
}
