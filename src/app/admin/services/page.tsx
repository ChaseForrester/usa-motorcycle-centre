"use client";

import { useState } from "react";
import { useCms } from "@/lib/cms-store";
import type { Service } from "@/lib/types";
import { slugify, uid } from "@/lib/utils";

export default function AdminServices() {
    const services = useCms((s) => s.services);
    const saveService = useCms((s) => s.saveService);
    const deleteService = useCms((s) => s.deleteService);
    const [edit, setEdit] = useState<Service | null>(null);

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Workshop services</h1>
                <button
                    className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold"
                    onClick={() =>
                        setEdit({
                            id: uid("s"),
                            slug: "",
                            name: "",
                            summary: "",
                            description: "",
                            duration: "",
                            image: "/workshop/chopper-build.jpg",
                        })
                    }
                >
                    Add service
                </button>
            </div>
            <ul className="mt-6 space-y-3">
                {services.map((s) => (
                    <li key={s.id} className="flex items-center justify-between rounded-xl border bg-white p-4">
                        <div>
                            <p className="font-semibold">{s.name}</p>
                            <p className="text-sm text-zinc-500">{s.summary}</p>
                        </div>
                        <div>
                            <button className="text-orange-600" onClick={() => setEdit(s)}>
                                Edit
                            </button>
                            <button className="ml-3 text-zinc-400" onClick={() => deleteService(s.id)}>
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {edit && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
                    <form
                        className="w-full max-w-lg space-y-3 rounded-xl bg-white p-6"
                        onSubmit={(e) => {
                            e.preventDefault();
                            saveService({ ...edit, slug: edit.slug || slugify(edit.name) });
                            setEdit(null);
                        }}
                    >
                        <input
                            className="admin-input"
                            placeholder="Name"
                            value={edit.name}
                            onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                            required
                        />
                        <input
                            className="admin-input"
                            placeholder="Summary"
                            value={edit.summary}
                            onChange={(e) => setEdit({ ...edit, summary: e.target.value })}
                        />
                        <textarea
                            className="admin-input min-h-24"
                            placeholder="Description"
                            value={edit.description}
                            onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                        />
                        <input
                            className="admin-input"
                            placeholder="Duration"
                            value={edit.duration}
                            onChange={(e) => setEdit({ ...edit, duration: e.target.value })}
                        />
                        <input
                            className="admin-input"
                            type="number"
                            placeholder="From price"
                            value={edit.fromPrice ?? ""}
                            onChange={(e) => setEdit({ ...edit, fromPrice: Number(e.target.value) })}
                        />
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setEdit(null)}>
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
