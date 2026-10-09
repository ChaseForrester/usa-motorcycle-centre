const CACHE = "usa-mcc-pwa-v1";
const PRECACHE = [
    "/",
    "/brand/icon.png",
    "/brand/og.jpg",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE)
            .then((cache) => cache.addAll(PRECACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const req = event.request;
    if (req.method !== "GET") return;
    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;
    if (
        url.pathname.startsWith("/admin") ||
        url.pathname.startsWith("/api") ||
        url.pathname.startsWith("/platform") ||
        url.pathname.startsWith("/account")
    ) {
        return;
    }

    if (req.mode === "navigate") {
        event.respondWith(fetch(req).catch(() => caches.match("/")));
        return;
    }

    const staticAsset =
        url.pathname.startsWith("/brand/") ||
        url.pathname.startsWith("/icons/") ||
        url.pathname.startsWith("/products/") ||
        url.pathname.startsWith("/workshop/") ||
        url.pathname.startsWith("/lifestyle/");

    if (!staticAsset) return;

    event.respondWith(
        caches.match(req).then((hit) => {
            if (hit) return hit;
            return fetch(req).then((res) => {
                const copy = res.clone();
                caches.open(CACHE).then((cache) => cache.put(req, copy));
                return res;
            });
        })
    );
});
