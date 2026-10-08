"use client";

import Image from "next/image";

const shots = [
    { src: "/workshop/chopper-build.jpg", alt: "Custom Harley chopper build in the Albion Park Rail workshop" },
    { src: "/workshop/primary-case.jpg", alt: "Harley primary case open on the bench" },
    { src: "/workshop/clutch-job.jpg", alt: "Clutch and primary drive job" },
    { src: "/workshop/pirelli-rack.jpg", alt: "Pirelli Night Dragon tyres in the shop" },
    { src: "/workshop/dunlop-rack.jpg", alt: "Dunlop tyre racks at U.S.A. Motorcycle Centre" },
    { src: "/products/hoodie-black-front.jpg", alt: "Black flame hoodie" },
    { src: "/products/hoodie-black-back.jpg", alt: "Hoodie back print" },
    { src: "/products/crew-grey-front.jpg", alt: "Grey crew EST 1992" },
    { src: "/products/crew-black-back.jpg", alt: "Black crew back print" },
    { src: "/products/sleeves-detail.jpg", alt: "Flame sleeves" },
];

export default function GalleryPage() {
    return (
        <div className="container-page py-12">
            <p className="label">Gallery</p>
            <h1 className="display mt-2 text-5xl text-white">The shop, the gear, the road.</h1>
            <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
                {shots.map((s) => (
                    <div key={s.src} className="mb-4 break-inside-avoid overflow-hidden rounded-sm">
                        <Image
                            src={s.src}
                            alt={s.alt}
                            width={800}
                            height={1000}
                            className="h-auto w-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
