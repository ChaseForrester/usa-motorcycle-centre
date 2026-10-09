"use client";

import { useEffect, useRef } from "react";

/** Silent loop of the workshop gift card. The still shows immediately, and the clip stays off when motion is reduced. */
export function GiftCardMotion({ className = "" }: { className?: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const apply = () => {
            if (motion.matches) {
                video.pause();
                video.currentTime = 0;
                return;
            }
            video.play().catch(() => undefined);
        };
        apply();
        motion.addEventListener("change", apply);
        return () => motion.removeEventListener("change", apply);
    }, []);

    return (
        <video
            ref={videoRef}
            className={`pointer-events-none absolute inset-0 h-full w-full object-contain ${className}`}
            src="/products/gift-card.mp4"
            poster="/products/gift-card.jpg"
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            aria-label="U.S.A. Motorcycle Centre workshop gift card"
        />
    );
}
