"use client";

import { useEffect } from "react";

const SELECTOR = [
    "section",
    "article",
    ".card",
    ".shot",
    ".reveal-item",
    ".container-page > h1",
    ".container-page > p",
    ".container-page > div:not(:has(.card, .shot, .reveal-item, section))",
].join(",");

const HERO = "section:has(.hero-photo)";

function visible(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
}

/** Mark storefront blocks so they can enter from the top or the bottom. */
function arm(main: HTMLElement) {
    const phone = window.matchMedia("(max-width: 1023px)").matches;
    main.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (el.matches(HERO) || el.closest(HERO)) return;
        if (phone && el.closest(".m-panel") && !el.classList.contains("m-panel")) return;
        if (el.dataset.reveal === "1") return;
        el.dataset.reveal = "1";
        el.classList.add("reveal-watch");
        if (visible(el)) el.classList.add("in-view");
    });
}

export function ScrollReveal() {
    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (reduce.matches) return;
        const main = document.getElementById("main");
        if (!main) return;

        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const el = entry.target as HTMLElement;
                    if (entry.isIntersecting) {
                        el.classList.add("in-view");
                        continue;
                    }
                    el.dataset.from = entry.boundingClientRect.top < 0 ? "up" : "down";
                    el.classList.remove("in-view");
                }
            },
            { threshold: 0 },
        );

        const scan = () => {
            arm(main);
            main.querySelectorAll<HTMLElement>(".reveal-watch").forEach((el) => {
                if (visible(el)) el.classList.add("in-view");
                io.observe(el);
            });
        };

        scan();
        const frame = requestAnimationFrame(() => {
            document.documentElement.classList.add("reveal-ready");
        });

        const mo = new MutationObserver(() => scan());
        mo.observe(main, { childList: true, subtree: true });
        window.addEventListener("resize", scan);

        return () => {
            cancelAnimationFrame(frame);
            io.disconnect();
            mo.disconnect();
            window.removeEventListener("resize", scan);
            document.documentElement.classList.remove("reveal-ready");
        };
    }, []);

    return null;
}
