"use client";

import { useState } from "react";
import Image from "next/image";
import { useCms } from "@/lib/cms-store";
import { AreaField, FormLockup, FormNote, TextField } from "@/components/FormLockup";
import { submitInbox } from "@/lib/inbox-client";
import { telHref } from "@/lib/utils";

export default function BookPage() {
    const services = useCms((s) => s.services);
    const settings = useCms((s) => s.settings);
    const addBooking = useCms((s) => s.addBooking);
    const [done, setDone] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        serviceId: services[0]?.id ?? "",
        bike: "",
        preferredDate: "",
        notes: "",
    });

    if (done) {
        return (
            <div className="container-page py-24" role="status">
                <FormLockup title="We will confirm the lift." hint="Booked in" />
                <h1 className="sr-only">We will confirm the lift.</h1>
                <p className="mt-4 max-w-lg text-chrome">
                    The workshop has your request and an email is on its way. Laurie or Mick will confirm
                    the lift. If a job gets thrown off course we will email you that we will be in touch.
                    Urgent? Ring{" "}
                    <a href={telHref(settings.contact.phone)} className="contact-link text-white">
                        {settings.contact.phone}
                    </a>
                    .
                </p>
            </div>
        );
    }

    return (
        <div className="container-page grid gap-12 py-12 lg:grid-cols-2">
            <div>
                <p className="label">Book a service</p>
                <h1 className="display mt-2 text-5xl text-white">Get it on the lift.</h1>
                <p className="mt-4 text-chrome">
                    Tell us the bike and what it is doing. We will come back with a time. Smash repairs and
                    insurance jobs — send photos in the notes or bring them in.
                </p>
                <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-sm">
                    <Image
                        src="/workshop/chopper-build.jpg"
                        alt="Custom Harley on the lift at U.S.A. Motorcycle Centre"
                        fill
                        className="object-cover object-[center_65%]"
                    />
                </div>
            </div>
            <form
                className="card space-y-4 p-6"
                onSubmit={async (e) => {
                    e.preventDefault();
                    setSending(true);
                    setError("");
                    const svc = services.find((s) => s.id === form.serviceId);
                    const serviceName = svc?.name ?? "Service";
                    addBooking({
                        ...form,
                        serviceName,
                    });
                    const result = await submitInbox({
                        kind: "booking",
                        name: form.name,
                        email: form.email,
                        phone: form.phone,
                        message: form.notes,
                        fields: {
                            serviceId: form.serviceId,
                            serviceName,
                            bike: form.bike,
                            preferredDate: form.preferredDate,
                        },
                    });
                    setSending(false);
                    if (!result.ok) {
                        setError(result.error || "Could not send. Call the workshop.");
                        return;
                    }
                    setDone(true);
                }}
            >
                <FormLockup title="Your details" hint="We email you and the workshop." />
                <TextField
                    id="book-name"
                    label="Name"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <TextField
                    id="book-email"
                    label="Email"
                    required
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    spellCheck={false}
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <TextField
                    id="book-phone"
                    label="Phone"
                    required
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="04xx xxx xxx"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <div>
                    <label htmlFor="book-service" className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-steel">
                        Service
                    </label>
                    <select
                        id="book-service"
                        className="input"
                        value={form.serviceId}
                        onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                    >
                        {services.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>
                <TextField
                    id="book-bike"
                    label="Bike"
                    required
                    autoComplete="off"
                    placeholder="Year, make, model"
                    value={form.bike}
                    onChange={(e) => setForm({ ...form, bike: e.target.value })}
                />
                <TextField
                    id="book-date"
                    label="Preferred day"
                    required
                    type="date"
                    value={form.preferredDate}
                    onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                />
                <AreaField
                    id="book-notes"
                    label="Notes"
                    placeholder="What is it doing? Insurance job? Photos welcome in person."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
                {error ? <FormNote live>{error}</FormNote> : null}
                <button className="btn-flame w-full" type="submit" disabled={sending} aria-busy={sending}>
                    {sending ? "Sending…" : "Send booking request"}
                </button>
            </form>
        </div>
    );
}
