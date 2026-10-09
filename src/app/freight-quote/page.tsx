"use client";

import { useState } from "react";
import { useTenant } from "@/lib/commerce/tenant-context";
import { AreaField, FormLockup, FormNote, TextField } from "@/components/FormLockup";
import { submitInbox } from "@/lib/inbox-client";

export default function FreightQuotePage() {
    const tenant = useTenant();
    const [done, setDone] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", notes: "" });

    if (done) {
        return (
            <div className="container-page max-w-lg py-16" role="status">
                <FormLockup title="Quote requested." />
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
                className="card mt-8 space-y-4 p-6"
                onSubmit={async (e) => {
                    e.preventDefault();
                    setSending(true);
                    setError("");
                    const result = await submitInbox({
                        kind: "freight",
                        name: form.name,
                        email: form.email,
                        phone: form.phone,
                        message: form.notes,
                        fields: { country: form.country },
                    });
                    setSending(false);
                    if (!result.ok) {
                        setError(result.error || "Could not send. Call the workshop.");
                        return;
                    }
                    setDone(true);
                }}
            >
                <FormLockup title="Your quote" hint="A person prices this. It is not a parcel checkout." />
                <TextField id="freight-name" label="Name" required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <TextField id="freight-email" label="Email" required type="email" autoComplete="email" inputMode="email" spellCheck={false} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <TextField id="freight-phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <TextField id="freight-country" label="Country" required autoComplete="country-name" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                <AreaField id="freight-notes" label="What is going" placeholder="Weight if you know it." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                {error ? <FormNote live>{error}</FormNote> : null}
                <button className="btn-flame w-full" type="submit" disabled={sending} aria-busy={sending}>
                    {sending ? "Sending…" : "Send"}
                </button>
            </form>
        </div>
    );
}
