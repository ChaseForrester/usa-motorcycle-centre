"use client";

import { useState } from "react";
import { categories } from "@/lib/seed";
import { useCms } from "@/lib/cms-store";
import { uploadProductImage } from "@/lib/inbox-client";
import type { Product } from "@/lib/types";
import { money, slugify, uid } from "@/lib/utils";

const LIBRARY = [
    "/products/hoodie-black-front.jpg",
    "/products/hoodie-black-back.jpg",
    "/products/crew-black-back.jpg",
    "/products/crew-grey-front.jpg",
    "/products/crew-grey-back.jpg",
    "/products/sleeves-detail.jpg",
    "/products/gift-card.jpg",
    "/products/gift-card-portrait.jpg",
];

const empty = (): Product => ({
    id: uid("p"),
    slug: "",
    name: "",
    description: "",
    price: 0,
    images: [],
    category: "Apparel",
    tags: ["shirt"],
    featured: false,
    inStock: true,
});

export default function AdminProducts() {
    const products = useCms((s) => s.products);
    const saveProduct = useCms((s) => s.saveProduct);
    const deleteProduct = useCms((s) => s.deleteProduct);
    const [edit, setEdit] = useState<Product | null>(null);
    const [uploading, setUploading] = useState(false);

    async function onFile(file: File) {
        if (!edit) return;
        setUploading(true);
        const res = await uploadProductImage(file);
        setUploading(false);
        if (!res.ok || !res.url) return;
        setEdit({ ...edit, images: [...edit.images, res.url] });
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Products</h1>
                    <p className="mt-1 text-sm text-zinc-500">Shirts on the rack. Photos show here and in the shop.</p>
                </div>
                <button
                    className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-zinc-950"
                    onClick={() => setEdit(empty())}
                >
                    Add product
                </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => (
                    <article key={p.id} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                        <div className="grid grid-cols-3 gap-px bg-zinc-100">
                            {(p.images.length ? p.images : ["/brand/icon.png"]).slice(0, 3).map((src) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    key={src}
                                    src={src}
                                    alt={p.name}
                                    className="aspect-square w-full object-cover"
                                />
                            ))}
                        </div>
                        <div className="p-4">
                            <p className="font-semibold">{p.name}</p>
                            <p className="text-sm text-zinc-500">
                                {p.category} · {money(p.price)}
                            </p>
                            <p className="mt-1 text-xs text-zinc-400">{p.images.length} photo{p.images.length === 1 ? "" : "s"}</p>
                            <div className="mt-3 flex gap-3 text-sm">
                                <button className="text-orange-600" onClick={() => setEdit(p)}>
                                    Edit
                                </button>
                                <button className="text-zinc-400" onClick={() => deleteProduct(p.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
                {products.length === 0 && <p className="text-sm text-zinc-500">No shirts on the rack yet.</p>}
            </div>

            {edit && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
                    <form
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const slug = edit.slug || slugify(edit.name);
                            saveProduct({ ...edit, slug, images: edit.images.filter(Boolean) });
                            setEdit(null);
                        }}
                    >
                        <h2 className="text-lg font-semibold">{edit.name || "New product"}</h2>
                        <div className="mt-4 space-y-3">
                            <input
                                className="admin-input"
                                placeholder="Name"
                                value={edit.name}
                                onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                                required
                            />
                            <textarea
                                className="admin-input min-h-24"
                                placeholder="Description"
                                value={edit.description}
                                onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    className="admin-input"
                                    type="number"
                                    step="0.01"
                                    placeholder="Price"
                                    value={edit.price}
                                    onChange={(e) => setEdit({ ...edit, price: Number(e.target.value) })}
                                />
                                <select
                                    className="admin-input"
                                    value={edit.category}
                                    onChange={(e) => setEdit({ ...edit, category: e.target.value })}
                                >
                                    {categories.map((c) => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <p className="text-sm font-medium">Photos</p>
                                <div className="mt-2 grid grid-cols-4 gap-2">
                                    {edit.images.map((src) => (
                                        <div key={src} className="relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={src} alt="" className="aspect-square w-full rounded-md object-cover" />
                                            <button
                                                type="button"
                                                className="absolute right-1 top-1 rounded bg-white/90 px-1 text-xs"
                                                onClick={() =>
                                                    setEdit({ ...edit, images: edit.images.filter((s) => s !== src) })
                                                }
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <label className="mt-3 block text-sm">
                                    Upload from the computer
                                    <input
                                        className="mt-1 block w-full text-sm"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) void onFile(file);
                                            e.target.value = "";
                                        }}
                                    />
                                </label>
                                {uploading && <p className="mt-1 text-xs text-zinc-500">Uploading…</p>}
                                <p className="mt-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
                                    Shirt photos already in the shop
                                </p>
                                <div className="mt-2 grid grid-cols-6 gap-2">
                                    {LIBRARY.map((src) => (
                                        <button
                                            type="button"
                                            key={src}
                                            onClick={() => {
                                                if (edit.images.includes(src)) return;
                                                setEdit({ ...edit, images: [...edit.images, src] });
                                            }}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={src} alt="" className="aspect-square w-full rounded object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={edit.featured}
                                    onChange={(e) => setEdit({ ...edit, featured: e.target.checked })}
                                />
                                Featured
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={edit.inStock}
                                    onChange={(e) => setEdit({ ...edit, inStock: e.target.checked })}
                                />
                                In stock
                            </label>
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <button type="button" className="px-4 py-2 text-sm" onClick={() => setEdit(null)}>
                                Cancel
                            </button>
                            <button className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
