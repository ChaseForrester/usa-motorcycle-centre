"use client";

import { useState } from "react";
import { categories } from "@/lib/seed";
import { useCms } from "@/lib/cms-store";
import type { Product } from "@/lib/types";
import { money, slugify, uid } from "@/lib/utils";

const empty = (): Product => ({
    id: uid("p"),
    slug: "",
    name: "",
    description: "",
    price: 0,
    images: ["/brand/logo.png"],
    category: "Apparel",
    tags: [],
    featured: false,
    inStock: true,
});

export default function AdminProducts() {
    const products = useCms((s) => s.products);
    const saveProduct = useCms((s) => s.saveProduct);
    const deleteProduct = useCms((s) => s.deleteProduct);
    const [edit, setEdit] = useState<Product | null>(null);

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Products</h1>
                <button
                    className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-zinc-950"
                    onClick={() => setEdit(empty())}
                >
                    Add product
                </button>
            </div>
            <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Featured</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} className="border-t border-zinc-100">
                                <td className="px-4 py-3 font-medium">{p.name}</td>
                                <td>{p.category}</td>
                                <td>{money(p.price)}</td>
                                <td>{p.featured ? "Yes" : ""}</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-orange-600" onClick={() => setEdit(p)}>
                                        Edit
                                    </button>
                                    <button className="ml-3 text-zinc-400" onClick={() => deleteProduct(p.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {edit && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
                    <form
                        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const slug = edit.slug || slugify(edit.name);
                            saveProduct({ ...edit, slug });
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
                            <input
                                className="admin-input"
                                placeholder="Slug"
                                value={edit.slug}
                                onChange={(e) => setEdit({ ...edit, slug: e.target.value })}
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
                            <input
                                className="admin-input"
                                placeholder="Image URL (comma-separated for more)"
                                value={edit.images.join(", ")}
                                onChange={(e) =>
                                    setEdit({
                                        ...edit,
                                        images: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                                    })
                                }
                            />
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
