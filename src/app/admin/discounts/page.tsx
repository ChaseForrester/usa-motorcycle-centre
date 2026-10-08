"use client";

import { useState } from "react";
import { useCms } from "@/lib/cms-store";
import { uid } from "@/lib/utils";

export default function AdminDiscounts() {
    const discounts = useCms((s) => s.discounts);
    const saveDiscount = useCms((s) => s.saveDiscount);
    const deleteDiscount = useCms((s) => s.deleteDiscount);
    const [code, setCode] = useState("");
    const [value, setValue] = useState(10);
    const [type, setType] = useState<"percent" | "fixed">("percent");
    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold">Discount codes</h1>
            <form
                className="mt-6 flex flex-wrap gap-2 rounded-xl border bg-white p-5"
                onSubmit={(e) => {
                    e.preventDefault();
                    saveDiscount({
                        id: uid("d"),
                        code: code.toUpperCase(),
                        type,
                        value,
                        active: true,
                    });
                    setCode("");
                }}
            >
                <input
                    className="admin-input flex-1"
                    placeholder="CODE"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <select
                    className="admin-input w-32"
                    value={type}
                    onChange={(e) => setType(e.target.value as "percent" | "fixed")}
                >
                    <option value="percent">Percent</option>
                    <option value="fixed">Fixed $</option>
                </select>
                <input
                    className="admin-input w-24"
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                />
                <button className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold">Add</button>
            </form>
            <ul className="mt-4 space-y-2">
                {discounts.map((d) => (
                    <li key={d.id} className="flex items-center justify-between rounded-xl border bg-white p-4">
                        <span>
                            <span className="font-mono font-semibold">{d.code}</span>{" "}
                            <span className="text-sm text-zinc-500">
                                {d.type === "percent" ? `${d.value}%` : `$${d.value}`}
                            </span>
                        </span>
                        <button className="text-zinc-400" onClick={() => deleteDiscount(d.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
