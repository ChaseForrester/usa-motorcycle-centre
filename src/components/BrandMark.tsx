import type { BrandLogo } from "@/lib/seed";

export function BrandMark({
    brand,
    className = "",
}: {
    brand: BrandLogo;
    className?: string;
}) {
    return (
        <img
            src={brand.src}
            alt={brand.name}
            width={brand.width}
            height={brand.height}
            className={`block h-auto w-auto max-w-full object-contain object-center ${brand.invert ? "brightness-0 invert" : ""} ${brand.tall ? "is-tall" : ""} ${className}`}
        />
    );
}
