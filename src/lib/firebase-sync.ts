"use client";

import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { getFirebase } from "./firebase";
import { useCms } from "./cms-store";
import type { EventItem, Product, Review, Service, SiteSettings } from "./types";

export async function hydrateFromFirebase() {
    const fb = getFirebase();
    if (!fb) return false;
    const db = fb.db;
    const settingsSnap = await getDoc(doc(db, "settings", "site"));
    if (settingsSnap.exists()) {
        useCms.setState({ settings: settingsSnap.data() as SiteSettings });
    } else {
        await setDoc(doc(db, "settings", "site"), useCms.getState().settings);
    }

    async function load<T>(name: string, apply: (rows: T[]) => void, seed: T[]) {
        const snap = await getDocs(collection(db, name));
        if (snap.empty) {
            await Promise.all(
                seed.map((row) => setDoc(doc(db, name, (row as { id: string }).id), row as object))
            );
            return;
        }
        apply(snap.docs.map((d) => d.data() as T));
    }

    const state = useCms.getState();
    await load<Product>("products", (products) => useCms.setState({ products }), state.products);
    await load<Service>("services", (services) => useCms.setState({ services }), state.services);
    await load<EventItem>("events", (events) => useCms.setState({ events }), state.events);
    await load<Review>("reviews", (reviews) => useCms.setState({ reviews }), state.reviews);
    return true;
}

export function watchCmsToFirebase() {
    const fb = getFirebase();
    if (!fb) return () => undefined;
    const db = fb.db;
    let t: ReturnType<typeof setTimeout>;
    return useCms.subscribe((s) => {
        clearTimeout(t);
        t = setTimeout(() => {
            setDoc(doc(db, "settings", "site"), s.settings).catch(() => undefined);
            s.products.forEach((p) => setDoc(doc(db, "products", p.id), p).catch(() => undefined));
            s.services.forEach((p) => setDoc(doc(db, "services", p.id), p).catch(() => undefined));
            s.events.forEach((p) => setDoc(doc(db, "events", p.id), p).catch(() => undefined));
            s.reviews.forEach((p) => setDoc(doc(db, "reviews", p.id), p).catch(() => undefined));
        }, 800);
    });
}
