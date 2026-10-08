"use client";

import { useCms } from "@/lib/cms-store";
import type { DayKey, SiteSettings } from "@/lib/types";

const days: DayKey[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];

export default function AdminSettings() {
    const settings = useCms((s) => s.settings);
    const updateSettings = useCms((s) => s.updateSettings);
    const resetToSeed = useCms((s) => s.resetToSeed);

    function patch<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
        updateSettings({ ...settings, [key]: value });
    }

    return (
        <div className="max-w-3xl space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Site settings</h1>
                <button
                    className="text-sm text-zinc-500 underline"
                    onClick={() => {
                        if (confirm("Reset all content to the original starter data?")) resetToSeed();
                    }}
                >
                    Reset to starter data
                </button>
            </div>

            <section className="space-y-3 rounded-xl border bg-white p-5">
                <h2 className="font-semibold">Brand</h2>
                <input
                    className="admin-input"
                    value={settings.brand.name}
                    onChange={(e) => patch("brand", { ...settings.brand, name: e.target.value })}
                />
                <input
                    className="admin-input"
                    value={settings.brand.legalName}
                    onChange={(e) => patch("brand", { ...settings.brand, legalName: e.target.value })}
                />
                <input
                    className="admin-input"
                    value={settings.brand.slogan}
                    onChange={(e) => patch("brand", { ...settings.brand, slogan: e.target.value })}
                />
                <input
                    className="admin-input"
                    value={settings.brand.tagline}
                    onChange={(e) => patch("brand", { ...settings.brand, tagline: e.target.value })}
                />
                <input
                    className="admin-input"
                    type="number"
                    value={settings.brand.established}
                    onChange={(e) =>
                        patch("brand", { ...settings.brand, established: Number(e.target.value) })
                    }
                />
                <input
                    className="admin-input"
                    value={settings.brand.logo}
                    onChange={(e) => patch("brand", { ...settings.brand, logo: e.target.value })}
                />
                <label className="text-xs text-zinc-500">Accent colour</label>
                <input
                    type="color"
                    value={settings.colors.accent}
                    onChange={(e) => patch("colors", { ...settings.colors, accent: e.target.value })}
                />
            </section>

            <section className="space-y-3 rounded-xl border bg-white p-5">
                <h2 className="font-semibold">Homepage</h2>
                <input
                    className="admin-input"
                    value={settings.homepage.announcement}
                    onChange={(e) =>
                        patch("homepage", { ...settings.homepage, announcement: e.target.value })
                    }
                />
                <input
                    className="admin-input"
                    value={settings.homepage.heroKicker}
                    onChange={(e) =>
                        patch("homepage", { ...settings.homepage, heroKicker: e.target.value })
                    }
                />
                <input
                    className="admin-input"
                    value={settings.homepage.heroTitle}
                    onChange={(e) =>
                        patch("homepage", { ...settings.homepage, heroTitle: e.target.value })
                    }
                />
                <textarea
                    className="admin-input min-h-24"
                    value={settings.homepage.heroSubtitle}
                    onChange={(e) =>
                        patch("homepage", { ...settings.homepage, heroSubtitle: e.target.value })
                    }
                />
                <input
                    className="admin-input"
                    value={settings.homepage.heroImage}
                    onChange={(e) =>
                        patch("homepage", { ...settings.homepage, heroImage: e.target.value })
                    }
                />
            </section>

            <section className="space-y-3 rounded-xl border bg-white p-5">
                <h2 className="font-semibold">Contact</h2>
                <input
                    className="admin-input"
                    value={settings.contact.phone}
                    onChange={(e) => patch("contact", { ...settings.contact, phone: e.target.value })}
                />
                <input
                    className="admin-input"
                    value={settings.contact.email}
                    onChange={(e) => patch("contact", { ...settings.contact, email: e.target.value })}
                />
                <input
                    className="admin-input"
                    value={settings.contact.addressLine}
                    onChange={(e) =>
                        patch("contact", { ...settings.contact, addressLine: e.target.value })
                    }
                />
                <div className="grid grid-cols-3 gap-2">
                    <input
                        className="admin-input"
                        value={settings.contact.suburb}
                        onChange={(e) => patch("contact", { ...settings.contact, suburb: e.target.value })}
                    />
                    <input
                        className="admin-input"
                        value={settings.contact.state}
                        onChange={(e) => patch("contact", { ...settings.contact, state: e.target.value })}
                    />
                    <input
                        className="admin-input"
                        value={settings.contact.postcode}
                        onChange={(e) => patch("contact", { ...settings.contact, postcode: e.target.value })}
                    />
                </div>
                <input
                    className="admin-input"
                    placeholder="ABN"
                    value={settings.contact.abn}
                    onChange={(e) => patch("contact", { ...settings.contact, abn: e.target.value })}
                />
            </section>

            <section className="space-y-3 rounded-xl border bg-white p-5">
                <h2 className="font-semibold">Hours</h2>
                {days.map((d) => (
                    <div key={d} className="grid grid-cols-[120px_1fr_1fr_80px] items-center gap-2 text-sm">
                        <span className="capitalize">{d}</span>
                        <input
                            className="admin-input"
                            type="time"
                            value={settings.hours[d].open}
                            onChange={(e) =>
                                patch("hours", {
                                    ...settings.hours,
                                    [d]: { ...settings.hours[d], open: e.target.value },
                                })
                            }
                        />
                        <input
                            className="admin-input"
                            type="time"
                            value={settings.hours[d].close}
                            onChange={(e) =>
                                patch("hours", {
                                    ...settings.hours,
                                    [d]: { ...settings.hours[d], close: e.target.value },
                                })
                            }
                        />
                        <label className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                checked={settings.hours[d].closed}
                                onChange={(e) =>
                                    patch("hours", {
                                        ...settings.hours,
                                        [d]: { ...settings.hours[d], closed: e.target.checked },
                                    })
                                }
                            />
                            Closed
                        </label>
                    </div>
                ))}
            </section>

            <section className="space-y-3 rounded-xl border bg-white p-5">
                <h2 className="font-semibold">Social</h2>
                <label className="text-xs text-zinc-500">Facebook</label>
                <input
                    className="admin-input"
                    value={settings.social.facebook}
                    onChange={(e) => patch("social", { ...settings.social, facebook: e.target.value })}
                />
                <label className="text-xs text-zinc-500">Instagram</label>
                <input
                    className="admin-input"
                    value={settings.social.instagram}
                    onChange={(e) => patch("social", { ...settings.social, instagram: e.target.value })}
                />
                <input
                    className="admin-input"
                    placeholder="YouTube"
                    value={settings.social.youtube}
                    onChange={(e) => patch("social", { ...settings.social, youtube: e.target.value })}
                />
                <input
                    className="admin-input"
                    placeholder="TikTok"
                    value={settings.social.tiktok}
                    onChange={(e) => patch("social", { ...settings.social, tiktok: e.target.value })}
                />
            </section>

            <section className="space-y-3 rounded-xl border bg-white p-5">
                <h2 className="font-semibold">Shipping & SEO</h2>
                <input
                    className="admin-input"
                    type="number"
                    value={settings.shipping.flatRate}
                    onChange={(e) =>
                        patch("shipping", { ...settings.shipping, flatRate: Number(e.target.value) })
                    }
                />
                <input
                    className="admin-input"
                    type="number"
                    value={settings.shipping.freeShippingThreshold}
                    onChange={(e) =>
                        patch("shipping", {
                            ...settings.shipping,
                            freeShippingThreshold: Number(e.target.value),
                        })
                    }
                />
                <input
                    className="admin-input"
                    value={settings.seo.title}
                    onChange={(e) => patch("seo", { ...settings.seo, title: e.target.value })}
                />
                <textarea
                    className="admin-input min-h-20"
                    value={settings.seo.description}
                    onChange={(e) => patch("seo", { ...settings.seo, description: e.target.value })}
                />
            </section>
        </div>
    );
}
