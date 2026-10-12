"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    brands,
    categories,
    discounts,
    events as seedEvents,
    products as seedProducts,
    reviews as seedReviews,
    services as seedServices,
    defaultSettings,
} from "./seed";
import type {
    Booking,
    Discount,
    EventItem,
    Order,
    Product,
    Review,
    Service,
    SiteSettings,
} from "./types";
import { uid } from "./utils";

export type CmsState = {
    settings: SiteSettings;
    products: Product[];
    services: Service[];
    events: EventItem[];
    reviews: Review[];
    discounts: Discount[];
    bookings: Booking[];
    orders: Order[];
    newsletter: string[];
    messages: { id: string; createdAt: string; name: string; email: string; phone: string; message: string }[];
    hydrated: boolean;
    setHydrated: (v: boolean) => void;
    updateSettings: (patch: Partial<SiteSettings> | ((s: SiteSettings) => SiteSettings)) => void;
    saveProduct: (p: Product) => void;
    deleteProduct: (id: string) => void;
    saveEvent: (e: EventItem) => void;
    deleteEvent: (id: string) => void;
    saveService: (s: Service) => void;
    deleteService: (id: string) => void;
    saveReview: (r: Review) => void;
    deleteReview: (id: string) => void;
    saveDiscount: (d: Discount) => void;
    deleteDiscount: (id: string) => void;
    addBooking: (b: Omit<Booking, "id" | "createdAt" | "status"> & { status?: Booking["status"] }) => Booking;
    updateBooking: (id: string, patch: Partial<Booking>) => void;
    addOrder: (o: Order) => void;
    updateOrder: (id: string, patch: Partial<Order>) => void;
    addSubscriber: (email: string) => void;
    addMessage: (m: { name: string; email: string; phone: string; message: string }) => void;
    resetToSeed: () => void;
};

const seed = {
    settings: defaultSettings,
    products: seedProducts,
    services: seedServices,
    events: seedEvents,
    reviews: seedReviews,
    discounts,
    bookings: [] as Booking[],
    orders: [] as Order[],
    newsletter: [] as string[],
    messages: [] as CmsState["messages"],
};

export const useCms = create<CmsState>()(
    persist(
        (set, get) => ({
            ...seed,
            hydrated: false,
            setHydrated: (v) => set({ hydrated: v }),
            updateSettings: (patch) =>
                set((s) => ({
                    settings:
                        typeof patch === "function" ? patch(s.settings) : { ...s.settings, ...patch },
                })),
            saveProduct: (p) =>
                set((s) => {
                    const i = s.products.findIndex((x) => x.id === p.id);
                    const products = [...s.products];
                    if (i >= 0) products[i] = p;
                    else products.unshift(p);
                    return { products };
                }),
            deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
            saveEvent: (e) =>
                set((s) => {
                    const i = s.events.findIndex((x) => x.id === e.id);
                    const events = [...s.events];
                    if (i >= 0) events[i] = e;
                    else events.unshift(e);
                    return { events };
                }),
            deleteEvent: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),
            saveService: (svc) =>
                set((s) => {
                    const i = s.services.findIndex((x) => x.id === svc.id);
                    const services = [...s.services];
                    if (i >= 0) services[i] = svc;
                    else services.unshift(svc);
                    return { services };
                }),
            deleteService: (id) => set((s) => ({ services: s.services.filter((e) => e.id !== id) })),
            saveReview: (r) =>
                set((s) => {
                    const i = s.reviews.findIndex((x) => x.id === r.id);
                    const reviews = [...s.reviews];
                    if (i >= 0) reviews[i] = r;
                    else reviews.unshift(r);
                    return { reviews };
                }),
            deleteReview: (id) => set((s) => ({ reviews: s.reviews.filter((e) => e.id !== id) })),
            saveDiscount: (d) =>
                set((s) => {
                    const i = s.discounts.findIndex((x) => x.id === d.id);
                    const next = [...s.discounts];
                    if (i >= 0) next[i] = d;
                    else next.unshift(d);
                    return { discounts: next };
                }),
            deleteDiscount: (id) => set((s) => ({ discounts: s.discounts.filter((e) => e.id !== id) })),
            addBooking: (b) => {
                const booking: Booking = {
                    ...b,
                    id: uid("bk"),
                    createdAt: new Date().toISOString(),
                    status: b.status ?? "new",
                };
                set((s) => ({ bookings: [booking, ...s.bookings] }));
                return booking;
            },
            updateBooking: (id, patch) =>
                set((s) => ({
                    bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)),
                })),
            addOrder: (o) => set((s) => ({ orders: [o, ...s.orders] })),
            updateOrder: (id, patch) =>
                set((s) => ({
                    orders: s.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)),
                })),
            addSubscriber: (email) =>
                set((s) => ({
                    newsletter: s.newsletter.includes(email) ? s.newsletter : [email, ...s.newsletter],
                })),
            addMessage: (m) =>
                set((s) => ({
                    messages: [
                        { ...m, id: uid("msg"), createdAt: new Date().toISOString() },
                        ...s.messages,
                    ],
                })),
            resetToSeed: () => set({ ...seed }),
        }),
        {
            name: "usamcc-cms-v6",
            onRehydrateStorage: () => (state) => {
                const previous = "workshop@usamotorcyclecentre.com.au";
                const current = "usa_motorcycle_centre@yahoo.com.au";
                if (state && state.settings.contact.email === previous) {
                    state.settings.contact.email = current;
                    queueMicrotask(() => {
                        const live = useCms.getState();
                        if (live.settings.contact.email === previous) {
                            useCms.setState({
                                settings: {
                                    ...live.settings,
                                    contact: { ...live.settings.contact, email: current },
                                },
                            });
                        }
                    });
                }
                const legacyReviewIds = new Set(["r1", "r2", "r3", "r4", "r5"]);
                const storedReviews = state?.reviews ?? [];
                const onlyLegacyReviews =
                    storedReviews.length > 0 && storedReviews.every((review) => legacyReviewIds.has(review.id));
                if (state && onlyLegacyReviews) {
                    state.reviews = seedReviews;
                    queueMicrotask(() => {
                        const live = useCms.getState();
                        if (live.reviews.every((review) => legacyReviewIds.has(review.id))) {
                            useCms.setState({ reviews: seedReviews });
                        }
                    });
                }
                if (state && !onlyLegacyReviews) {
                    const seedIds = new Set(seedReviews.map((review) => review.id));
                    const sameSet =
                        state.reviews.length === seedReviews.length &&
                        state.reviews.every((review) => seedIds.has(review.id));
                    if (sameSet) {
                        const storedById = new Map(state.reviews.map((review) => [review.id, review]));
                        const next = seedReviews.map((seedReview) => {
                            const stored = storedById.get(seedReview.id);
                            return stored ? { ...stored, source: seedReview.source } : seedReview;
                        });
                        const changed = next.some(
                            (review, index) =>
                                review.source !== state.reviews[index]?.source || review.id !== state.reviews[index]?.id
                        );
                        if (changed) {
                            state.reviews = next;
                            queueMicrotask(() => {
                                const live = useCms.getState();
                                const liveSame =
                                    live.reviews.length === seedReviews.length &&
                                    live.reviews.every((review) => seedIds.has(review.id));
                                if (liveSame) useCms.setState({ reviews: next });
                            });
                        }
                    }
                }
                if (state) {
                    const rackIds = new Set(seedProducts.map((product) => product.id));
                    const extras = state.products.filter(
                        (product) =>
                            !rackIds.has(product.id) &&
                            product.category !== "Shirts" &&
                            product.category !== "Jumpers" &&
                            product.category !== "Gift Cards"
                    );
                    const nextProducts = [...seedProducts, ...extras];
                    const gearChanged =
                        nextProducts.length !== state.products.length ||
                        nextProducts.some((product, index) => {
                            const stored = state.products[index];
                            return (
                                !stored ||
                                stored.id !== product.id ||
                                stored.category !== product.category ||
                                stored.name !== product.name ||
                                JSON.stringify(stored.images) !== JSON.stringify(product.images)
                            );
                        });
                    if (gearChanged) {
                        state.products = nextProducts;
                        queueMicrotask(() => {
                            useCms.setState({ products: nextProducts });
                        });
                    }
                    if (state.settings.homepage.announcement.startsWith("Workshop open")) {
                        state.settings.homepage.announcement =
                            "Shirts and jumpers on the rack · Click & collect at Albion Park Rail · PH 4257 2333";
                        state.settings.homepage.heroTitle = "Harley shirts and jumpers.";
                    }
                    const oldSlogan = "U.S.A. Motorcycle Centre is the name. The shirts and jumpers wear the crest.";
                    if (state.settings.brand.slogan === oldSlogan) {
                        const slogan = "U.S.A. Motorcycle Centre is the name. Servicing Harleys is our game.";
                        state.settings.brand.slogan = slogan;
                        queueMicrotask(() => {
                            const live = useCms.getState();
                            if (live.settings.brand.slogan === oldSlogan) {
                                useCms.setState({
                                    settings: {
                                        ...live.settings,
                                        brand: { ...live.settings.brand, slogan },
                                    },
                                });
                            }
                        });
                    }
                }
                if (state && state.settings.brand.logo === "/brand/icon.png") {
                    state.settings.brand.logo = "/brand/icon.svg";
                    queueMicrotask(() => {
                        const live = useCms.getState();
                        if (live.settings.brand.logo === "/brand/icon.png") {
                            useCms.setState({
                                settings: {
                                    ...live.settings,
                                    brand: { ...live.settings.brand, logo: "/brand/icon.svg" },
                                },
                            });
                        }
                    });
                }
                const staleAccent = state?.settings.colors.accent.toLowerCase();
                if (state && (staleAccent === "#ff6a00" || staleAccent === "#60a5fa" || staleAccent === "#bf0a30")) {
                    state.settings.colors.accent = "#FF1414";
                    state.settings.colors.accentSoft = "#000B58";
                    state.settings.colors.ink = "#000B58";
                    queueMicrotask(() => {
                        const live = useCms.getState();
                        const liveAccent = live.settings.colors.accent.toLowerCase();
                        if (liveAccent === "#ff6a00" || liveAccent === "#60a5fa" || liveAccent === "#bf0a30") {
                            useCms.setState({
                                settings: {
                                    ...live.settings,
                                    colors: { accent: "#FF1414", accentSoft: "#000B58", ink: "#000B58" },
                                },
                            });
                        }
                    });
                }
                state?.setHydrated(true);
            },
        }
    )
);

export function getProduct(slug: string) {
    return useCms.getState().products.find((p) => p.slug === slug);
}

export { brands, categories };
