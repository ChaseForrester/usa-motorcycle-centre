"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/SocialIcons";
import { useCms } from "@/lib/cms-store";
import { AreaField, FormLockup, FormNote, TextField } from "@/components/FormLockup";
import { submitInbox } from "@/lib/inbox-client";
import { fullAddress, hoursList, mailHref, telHref } from "@/lib/utils";

export default function ContactPage() {
    const settings = useCms((s) => s.settings);
    const addMessage = useCms((s) => s.addMessage);
    const [done, setDone] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const hours = hoursList(settings);

    return (
        <div className="container-page grid gap-12 py-12 lg:grid-cols-2">
            <div>
                <p className="label">Contact</p>
                <h1 className="display mt-2 text-5xl text-white">Roll in, ring, or write.</h1>
                <div className="mt-6 grid grid-cols-2 gap-2">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                        <Image
                            src="/workshop/pirelli-rack.jpg"
                            alt="Pirelli Night Dragon tyres in the shop"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                        <Image
                            src="/workshop/dunlop-rack.jpg"
                            alt="Dunlop tyre racks at U.S.A. Motorcycle Centre"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
                <div className="mt-8 space-y-4 text-chrome">
                    <a href={settings.contact.mapsUrl} className="flex gap-3 hover:text-white" target="_blank" rel="noreferrer">
                        <MapPin className="h-5 w-5 text-flame" />
                        {fullAddress(settings)}
                    </a>
                    <a href={telHref(settings.contact.phone)} className="contact-link flex gap-3">
                        <Phone className="h-5 w-5 text-flame" />
                        {settings.contact.phone}
                    </a>
                    <a href={mailHref(settings.contact.email)} className="contact-link block">
                        {settings.contact.email}
                    </a>
                </div>
                <div className="mt-6 flex gap-3">
                    <a
                        href={settings.social.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-ghost !px-4"
                    >
                        <FacebookIcon className="h-5 w-5" /> Facebook
                    </a>
                    <a
                        href={settings.social.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-ghost !px-4"
                    >
                        <InstagramIcon className="h-5 w-5" /> Instagram
                    </a>
                </div>
                <ul className="mt-8 max-w-sm space-y-1 text-sm">
                    {hours.map((h) => (
                        <li key={h.key} className="flex justify-between text-steel">
                            <span>{h.label}</span>
                            <span className="text-chrome">{h.value}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-8 overflow-hidden rounded-sm border border-white/10">
                    <iframe
                        title="Map"
                        className="h-64 w-full grayscale"
                        loading="lazy"
                        src="https://maps.google.com/maps?q=8%20Miall%20Way%20Albion%20Park%20Rail%20NSW%202527&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    />
                </div>
            </div>
            {done ? (
                <div className="card p-8" role="status">
                    <FormLockup title="Got it." hint="We will get back to you from the workshop." />
                    <a href={telHref(settings.contact.phone)} className="btn-ghost mt-2 inline-flex">
                        Call {settings.contact.phone}
                    </a>
                </div>
            ) : (
                <form
                    className="card space-y-4 p-6"
                    noValidate={false}
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setSending(true);
                        setError("");
                        addMessage(form);
                        const result = await submitInbox({
                            kind: "contact",
                            name: form.name,
                            email: form.email,
                            phone: form.phone,
                            message: form.message,
                        });
                        setSending(false);
                        if (!result.ok) {
                            setError(result.error || "Could not send. Call the workshop.");
                            return;
                        }
                        setDone(true);
                    }}
                >
                    <FormLockup title="Write to the shop" hint="Laurie or Mick read these." />
                    <TextField
                        id="contact-name"
                        label="Name"
                        required
                        autoComplete="name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <TextField
                        id="contact-email"
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
                        id="contact-phone"
                        label="Phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="04xx xxx xxx"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                    <AreaField
                        id="contact-message"
                        label="Message"
                        required
                        placeholder="What do you need?"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                    {error ? <FormNote live>{error}</FormNote> : null}
                    <button className="btn-flame w-full" type="submit" disabled={sending} aria-busy={sending}>
                        {sending ? "Sending…" : "Send"}
                    </button>
                </form>
            )}
        </div>
    );
}
