"use client";

import { useLayoutEffect } from "react";

const SELECTOR = [
    "h1",
    "h2",
    "h3",
    "h4",
    "p",
    "li",
    "dt",
    "dd",
    "blockquote",
    "figcaption",
    "img",
    "video",
    "a",
    "button",
    "label",
    "span",
    "article",
    ".card",
    ".shot",
    ".reveal-item",
    ".announce-bar",
].join(",");

const TEXT_BLOCK = "h1,h2,h3,h4,p,li,dt,dd,blockquote,figcaption,.announce-bar";
const SPLIT_HOST = "h1,h2,h3,h4,p,a,button,span,li,dt,dd,figcaption";

function visible(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return rect.height > 0 && rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
}

function shouldSkip(el: HTMLElement, phone: boolean) {
    if (el.closest("header") || el.closest(".flag-field")) return true;
    if (el.classList.contains("reveal-word") || el.matches("img.source-mark")) return true;
    if (el.closest(".sr-only") || el.classList.contains("sr-only")) return true;
    if (el.matches("input, textarea, select, option")) return true;
    if (phone && el.closest(".m-panel")) return true;
    if (el.getAttribute("aria-hidden") === "true" && !el.matches("img,video")) return true;
    if (el.matches("span")) {
        const text = el.textContent?.trim() ?? "";
        const plate = Boolean(el.querySelector(":scope > img"));
        if (!plate && text.length < 2) return true;
        if (el.closest("h1,h2,h3,h4,p,a,button,li,dt,dd")) return true;
    }
    if (el.matches("a,button,label") && el.parentElement?.closest(TEXT_BLOCK)) return true;
    const inner = el.querySelector("h1,h2,h3,h4,p,li,dt,dd,blockquote,img,video,article,.card,.shot,.reveal-item");
    if (inner && !(el.matches("span") && el.querySelector(":scope > img.source-mark"))) return true;
    return false;
}

function splitWords(el: HTMLElement) {
    if (!el.matches(SPLIT_HOST)) return false;
    if (el.querySelector(":scope > .reveal-word")) return true;
    const existing = Array.from(el.childNodes);
    for (let i = 0; i < existing.length; i += 1) {
        const node = existing[i];
        if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName !== "BR") return false;
    }
    const text = el.textContent?.trim() ?? "";
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length < 2 || words.length > 14 || text.length > 90) return false;

    const frag = document.createDocumentFragment();
    let index = 0;
    const pushWord = (word: string) => {
        const span = document.createElement("span");
        span.className = "reveal-word";
        span.dataset.from = index % 2 === 0 ? "left" : "right";
        span.style.setProperty("--reveal-i", String(index));
        span.textContent = word;
        frag.appendChild(span);
        index += 1;
    };
    for (let n = 0; n < existing.length; n += 1) {
        const node = existing[n];
        if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === "BR") {
            frag.appendChild(document.createElement("br"));
            continue;
        }
        if (node.nodeType !== Node.TEXT_NODE) continue;
        for (const part of (node.textContent || "").split(/(\s+)/)) {
            if (!part) continue;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(" "));
            else pushWord(part);
        }
    }
    if (index < 2) return false;
    el.replaceChildren(frag);
    return true;
}

function sideFor(el: HTMLElement, index: number) {
    const rect = el.getBoundingClientRect();
    const onRight = rect.width > 0 && rect.left + rect.width / 2 >= window.innerWidth / 2;
    const base = onRight ? "right" : "left";
    return index % 2 === 0 ? base : base === "left" ? "right" : "left";
}

function prepare(el: HTMLElement, index: number) {
    const split = splitWords(el);
    el.classList.toggle("reveal-words", split);
    el.classList.toggle("reveal-watch", !split);
    if (!split) {
        el.dataset.from = sideFor(el, index);
        el.dataset.kind = el.matches(
            "h1,h2,h3,h4,p,li,dt,dd,a,button,span,label,blockquote,figcaption,.announce-bar"
        )
            ? "text"
            : "media";
    }
    el.style.setProperty("--reveal-i", String(Math.min(index, 7)));
}

function collect(roots: HTMLElement[], phone: boolean) {
    const found: HTMLElement[] = [];
    for (const root of roots) {
        if (root.matches(SELECTOR) && !shouldSkip(root, phone)) found.push(root);
        root.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
            if (!shouldSkip(el, phone)) found.push(el);
        });
    }
    const groups = new Map<HTMLElement, HTMLElement[]>();
    for (const el of found) {
        const parent = el.parentElement;
        if (!parent) continue;
        const list = groups.get(parent) ?? [];
        list.push(el);
        groups.set(parent, list);
    }
    groups.forEach((list) => {
        list.forEach((el, index) => prepare(el, index));
    });
    return found;
}

/** Fade storefront text and media in from the left and the right. */
export function ScrollReveal() {
    useLayoutEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (reduce.matches) return;

        let play = false;
        const phoneQuery = window.matchMedia("(max-width: 1023px)");

        const roots = () =>
            [document.getElementById("main"), document.querySelector(".site-footer"), document.querySelector(".announce-bar")].filter(
                (node): node is HTMLElement => node instanceof HTMLElement
            );

        const showVisible = () => {
            document.querySelectorAll<HTMLElement>(".reveal-watch, .reveal-words").forEach((el) => {
                if (visible(el)) el.classList.add("in-view");
            });
        };

        const io = new IntersectionObserver(
            (entries) => {
                if (!play) return;
                for (const entry of entries) {
                    const el = entry.target as HTMLElement;
                    el.classList.toggle("in-view", entry.isIntersecting);
                }
            },
            { rootMargin: "80px 0px 40px 0px", threshold: 0 }
        );

        const scan = () => {
            const nodes = collect(roots(), phoneQuery.matches);
            nodes.forEach((el) => io.observe(el));
            if (play) requestAnimationFrame(showVisible);
        };

        scan();
        document.documentElement.classList.add("reveal-ready");

        let frame = 0;
        frame = requestAnimationFrame(() => {
            frame = requestAnimationFrame(() => {
                play = true;
                showVisible();
            });
        });

        let queued = 0;
        const mo = new MutationObserver(() => {
            cancelAnimationFrame(queued);
            queued = requestAnimationFrame(scan);
        });
        roots().forEach((root) => mo.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] }));
        const onResize = () => scan();
        window.addEventListener("resize", onResize);
        const fallback = window.setTimeout(showVisible, 900);

        return () => {
            play = false;
            cancelAnimationFrame(frame);
            cancelAnimationFrame(queued);
            window.clearTimeout(fallback);
            io.disconnect();
            mo.disconnect();
            window.removeEventListener("resize", onResize);
            document.documentElement.classList.remove("reveal-ready");
        };
    }, []);

    return null;
}
