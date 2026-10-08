"use client";

import { useState } from "react";
import { useCms } from "@/lib/cms-store";
import type { Review } from "@/lib/types";
import { uid } from "@/lib/utils";

export default function AdminReviews() {
    const reviews = useCms((s) => s.reviews);
    const saveReview = useCms((s) => s.saveReview);
    const deleteReview = useCms((s) => s.deleteReview);
    const [draft, setDraft] = useState<Review>({
        id: uid("r"),
        name: "",
        quote: "",
        rating: 5,
        source: "Google",
    });
    return (
        <div className="max-w-3xl">
            <h1 className="text-2xl font-semibold">Reviews</h1>
            <form
                className="mt-6 space-y-3 rounded-xl border bg-white p-5"
                onSubmit={(e) => {
                    e.preventDefault();
                    saveReview(draft);
                    setDraft({ id: uid("r"), name: "", quote: "", rating: 5, source: "Google" });
                }}
            >
                <input
                    className="admin-input"
                    placeholder="Name"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    required
                />
                <textarea
                    className="admin-input min-h-20"
                    placeholder="Quote"
                    value={draft.quote}
                    onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
                    required
                />
                <div className="grid grid-cols-2 gap-3">
                    <input
                        className="admin-input"
                        type="number"
                        min={1}
                        max={5}
                        value={draft.rating}
                        onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
                    />
                    <input
                        className="admin-input"
                        placeholder="Source"
                        value={draft.source}
                        onChange={(e) => setDraft({ ...draft, source: e.target.value })}
                    />
                </div>
                <button className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold">Add</button>
            </form>
            <ul className="mt-6 space-y-3">
                {reviews.map((r) => (
                    <li key={r.id} className="rounded-xl border bg-white p-4">
                        <div className="flex justify-between">
                            <p className="font-semibold">
                                {r.name} · {"★".repeat(r.rating)}
                            </p>
                            <button className="text-zinc-400" onClick={() => deleteReview(r.id)}>
                                Delete
                            </button>
                        </div>
                        <p className="mt-2 text-sm text-zinc-600">{r.quote}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
