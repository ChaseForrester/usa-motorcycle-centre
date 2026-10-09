"use client";

import Image from "next/image";
import { BrandMark } from "@/components/BrandMark";
import { brands } from "@/lib/seed";
import { useCms } from "@/lib/cms-store";

export default function AboutPage() {
    const settings = useCms((s) => s.settings);
    return (
        <div>
            <section className="relative h-[42vh] min-h-[280px]">
                <Image src="/workshop/chopper-build.jpg" alt="Custom Harley in the workshop" fill className="object-cover object-[center_65%]" />
                <div className="absolute inset-0 bg-ink/60" />
                <div className="container-page relative flex h-full flex-col justify-end pb-10">
                    <p className="label">Est. {settings.brand.established}</p>
                    <h1 className="display mt-2 text-5xl text-white sm:text-6xl">
                        {settings.brand.slogan}
                    </h1>
                </div>
            </section>
            <section className="container-page grid gap-12 py-16 lg:grid-cols-2">
                <div className="space-y-5 text-lg leading-relaxed text-chrome">
                    <p>
                        U.S.A. Motorcycle Centre has looked after Harley-Davidson riders across the Illawarra
                        since {settings.brand.established}. We are a motorcycle accessory and Harley® specialist
                        repair shop — smash repairs, diagnostics, tyres, electrical, customising, and the parts
                        wall you actually want to browse.
                    </p>
                    <p>
                        Laurie and Mick are the names on the back of the hoodie for a reason. Ventura racks in
                        two days. Sixteen-inch highballs on an 883. Burleigh apes that sit right. Computerised
                        diagnostics when it is not firing the way it used to.
                    </p>
                    <p>
                        From the Albion Park Rail workshop we fit Avon, Dunlop and Pirelli tyres, run Penrite
                        and AMSOIL, and sell the U.S.A. flame hoodie and crews with the original shop print.
                        The online shop is those shirts. Tyres, oils and parts stay on the floor — call or
                        come in.
                    </p>
                    <p>
                        Independent. Not a dealer. If you want it done properly, bring it in.
                    </p>
                </div>
                <div className="relative min-h-[360px] overflow-hidden rounded-sm">
                    <Image src="/workshop/primary-case.jpg" alt="Harley primary work on the bench" fill className="object-cover" />
                </div>
            </section>
            <section className="grid grid-cols-3">
                {[
                    { src: "/workshop/clutch-job.jpg", alt: "Clutch and primary job" },
                    { src: "/workshop/pirelli-rack.jpg", alt: "Pirelli Night Dragon rack" },
                    { src: "/workshop/dunlop-rack.jpg", alt: "Dunlop tyre racks" },
                ].map((shot) => (
                    <div key={shot.src} className="relative aspect-[4/3] overflow-hidden">
                        <Image src={shot.src} alt={shot.alt} fill className="object-cover" />
                    </div>
                ))}
            </section>
            <section className="container-page py-16">
                <p className="label">On the wall</p>
                <ul className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-6">
                    {brands.map((brand) => (
                        <li key={brand.name} className="flex h-16 items-center">
                            <BrandMark brand={brand} className={brand.tall ? "h-14" : "h-8"} />
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
