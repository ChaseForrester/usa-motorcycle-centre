"use client";

import { useState } from "react";
import { useTenant } from "@/lib/commerce/tenant-context";

export default function FreightQuotePage() {
    const tenant = useTenant();
    const [done, setDone] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", notes: "" });

    if (done) {
        return (
            <div className="container-page py-16">
                <h1 className="display text-4xl text-white">Quote requested.</h1>
                <p className="mt-4 max-w-lg text-chrome">
                    A person at {tenant.name} will price the freight. Oils, aerosols, loose lithium, tyres
                    and whole bikes are not sold as a self-serve international parcel.
                </p>
            </div>
        );
    }

    return (
        <div className="container-page max-w-lg py-16">
            <p className="label">Freight</p>
            <h1 className="display mt-2 text-4xl text-white">Human freight quote</h1>
            <form
                className="mt-8 space-y-4"
                onSubmit={async (e) => {
                    e.preventDefault();
                    await fetch("/api/freight-quote", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(form),
                    });
                    setDone(true);
                }}
            >
                <input className="input" required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="input" required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input className="input" required placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                <textarea className="input min-h-28" placeholder="What is going, and the weight if you know it." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                <button className="btn-flame w-full">Send</button>
            </form>
        </div>
    );
}
