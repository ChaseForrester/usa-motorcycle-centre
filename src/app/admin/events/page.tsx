"use client";

import { useState } from "react";
import { useCms } from "@/lib/cms-store";
import type { EventItem } from "@/lib/types";
import { slugify, uid } from "@/lib/utils";

const empty = (): EventItem => ({
    id: uid("e"),
    slug: "",
    title: "",
    summary: "",
    description: "",
    date: "",
    time: "",
    location: "8 Miall Way, Albion Park Rail",
    image: "/workshop/chopper-build.jpg",
    ticketed: false,
    featured: true,
});

export default function AdminEvents() {
    const events = useCms((s) => s.events);
    const saveEvent = useCms((s) => s.saveEvent);
    const deleteEvent = useCms((s) => s.deleteEvent);
    const [edit, setEdit] = useState<EventItem | null>(null);

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Events</h1>
                <button
                    className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold"
                    onClick={() => setEdit(empty())}
                >
                    Add event
                </button>
            </div>
            <div className="mt-6 space-y-3">
                {events.map((e) => (
                    <article key={e.id} className="flex items-center justify-between rounded-xl border bg-white p-4">
                        <div>
                            <p className="font-semibold">{e.title}</p>
                            <p className="text-sm text-zinc-500">
                                {e.date} · {e.time} · {e.location}
                            </p>
                        </div>
                        <div>
                            <button className="text-orange-600" onClick={() => setEdit(e)}>
                                Edit
                            </button>
                            <button className="ml-3 text-zinc-400" onClick={() => deleteEvent(e.id)}>
                                Delete
                            </button>
                        </div>
                    </article>
                ))}
            </div>
            {edit && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
                    <form
                        className="w-full max-w-lg space-y-3 rounded-xl bg-white p-6"
                        onSubmit={(ev) => {
                            ev.preventDefault();
                            saveEvent({ ...edit, slug: edit.slug || slugify(edit.title) });
                            setEdit(null);
                        }}
                    >
                        <input
                            className="admin-input"
                            placeholder="Title"
                            value={edit.title}
                            onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                            required
                        />
                        <input
                            className="admin-input"
                            type="date"
                            value={edit.date}
                            onChange={(e) => setEdit({ ...edit, date: e.target.value })}
                        />
                        <input
                            className="admin-input"
                            placeholder="Time"
                            value={edit.time}
                            onChange={(e) => setEdit({ ...edit, time: e.target.value })}
                        />
                        <input
                            className="admin-input"
                            placeholder="Location"
                            value={edit.location}
                            onChange={(e) => setEdit({ ...edit, location: e.target.value })}
                        />
                        <textarea
                            className="admin-input min-h-24"
                            placeholder="Description"
                            value={edit.description}
                            onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                        />
                        <input
                            className="admin-input"
                            placeholder="Image path"
                            value={edit.image}
                            onChange={(e) => setEdit({ ...edit, image: e.target.value })}
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
