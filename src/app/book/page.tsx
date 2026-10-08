"use client";

import { useState } from "react";
import Image from "next/image";
import { useCms } from "@/lib/cms-store";

export default function BookPage() {
    const services = useCms((s) => s.services);
    const addBooking = useCms((s) => s.addBooking);
    const [done, setDone] = useState(false);
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
            <div className="container-page py-24">
                <p className="label">Booked in</p>
                <h1 className="display mt-2 text-5xl text-white">We will confirm the lift.</h1>
                <p className="mt-4 max-w-lg text-chrome">
                    The workshop has your request. Laurie or Mick will call to lock in the time. If it is
                    urgent, ring (02) 4257 2333.
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
                onSubmit={(e) => {
                    e.preventDefault();
                    const svc = services.find((s) => s.id === form.serviceId);
                    addBooking({
                        ...form,
                        serviceName: svc?.name ?? "Service",
                    });
                    setDone(true);
                }}
            >
                <input
                    className="input"
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    className="input"
                    required
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    className="input"
                    required
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <select
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
                <input
                    className="input"
                    required
                    placeholder="Bike — year, make, model"
                    value={form.bike}
                    onChange={(e) => setForm({ ...form, bike: e.target.value })}
                />
                <input
                    className="input"
                    type="date"
                    required
                    value={form.preferredDate}
                    onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                />
                <textarea
                    className="input min-h-28"
                    placeholder="What is it doing? Insurance job? Photos welcome in person."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
                <button className="btn-flame w-full">Send booking request</button>
            </form>
        </div>
    );
}
