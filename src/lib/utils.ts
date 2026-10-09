import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { DayHours, DayKey, SiteSettings } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isRemoteProductSrc(src: string) {
    return src.startsWith("/api/") || src.startsWith("data:");
}

export function money(amount: number, currency = "AUD") {
    return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function fullAddress(s: SiteSettings) {
    return `${s.contact.addressLine}, ${s.contact.suburb} ${s.contact.state} ${s.contact.postcode}`;
}

/** Opens the phone app. Built from the number on screen, so a saved setting cannot strip the link. */
export function telHref(phone: string) {
    const trimmed = phone.trim();
    if (trimmed.toLowerCase().startsWith("tel:")) return trimmed;
    let digits = trimmed.replace(/[^\d+]/g, "");
    if (digits.startsWith("+")) return `tel:${digits}`;
    if (digits.startsWith("61")) return `tel:+${digits}`;
    if (digits.startsWith("0")) digits = `61${digits.slice(1)}`;
    // Local Illawarra number written without the 02, e.g. "4257 2333".
    else if (digits.length === 8) digits = `612${digits}`;
    return `tel:+${digits}`;
}

export function mailHref(email: string) {
    const trimmed = email.trim();
    return trimmed.toLowerCase().startsWith("mailto:") ? trimmed : `mailto:${trimmed}`;
}

const dayOrder: DayKey[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];

const labels: Record<DayKey, string> = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
};

export function formatTime(t: string) {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "pm" : "am";
    const hr = h % 12 || 12;
    return m ? `${hr}:${String(m).padStart(2, "0")}${ampm}` : `${hr}${ampm}`;
}

export function formatHours(hours: DayHours) {
    if (hours.closed) return "Closed";
    return `${formatTime(hours.open)} – ${formatTime(hours.close)}`;
}

export function hoursList(s: SiteSettings) {
    return dayOrder.map((d) => ({
        key: d,
        label: labels[d],
        value: formatHours(s.hours[d]),
    }));
}

export function todayHours(s: SiteSettings) {
    const idx = new Date().getDay();
    const map: DayKey[] = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];
    const key = map[idx];
    return { key, label: labels[key], value: formatHours(s.hours[key]) };
}

export function slugify(v: string) {
    return v
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export function uid(prefix = "id") {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}
