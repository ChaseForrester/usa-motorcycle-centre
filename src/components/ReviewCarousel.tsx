import type { Review } from "@/lib/types";

const SOURCE_MARK: Record<string, { src: string; alt: string; plate?: boolean }> = {
    Localsearch: { src: "/brand/localsearch.png", alt: "Localsearch" },
    "Yellow Pages": { src: "/brand/yellow-pages.svg", alt: "Yellow Pages", plate: true },
    Google: { src: "/brand/google.png", alt: "Google" },
};

function SourceMark({ source }: { source: string }) {
    const mark = SOURCE_MARK[source];
    if (!mark) return <span className="ml-auto shrink-0 text-xs text-steel">{source}</span>;
    if (mark.plate) {
        return (
            <span className="ml-auto inline-flex h-5 shrink-0 items-center rounded-[2px] bg-[#FFD100] px-1.5">
                <img src={mark.src} alt={mark.alt} className="source-mark h-4 w-auto" />
            </span>
        );
    }
    return (
        <img
            src={mark.src}
            alt={mark.alt}
            className="source-mark ml-auto h-5 w-auto max-w-[7.5rem] shrink-0 object-contain object-right"
        />
    );
}

export function ReviewCarousel({ reviews }: { reviews: Review[] }) {
    if (!reviews.length) return null;
    const loop = [...reviews, ...reviews];
    return (
        <div className="review-carousel mt-5 overflow-hidden py-3 lg:mt-10">
            <ul className="review-marquee flex w-max items-stretch gap-3 lg:gap-4">
                {loop.map((review, index) => {
                    const copy = index >= reviews.length;
                    return (
                        <li
                            key={`${review.id}-${index}`}
                            className="w-[17.5rem] shrink-0 lg:w-[22rem]"
                            aria-hidden={copy || undefined}
                        >
                            <blockquote className="card flex h-full min-h-[11.25rem] flex-col p-5 text-left">
                                <div className="text-sm tracking-[0.14em] text-flame" aria-label={`${review.rating} out of 5 stars`}>
                                    {Array.from({ length: 5 }, (_, star) => (
                                        <span key={star} className={star < review.rating ? "text-flame" : "text-white/20"}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-chrome">
                                    &ldquo;{review.quote}&rdquo;
                                </p>
                                <p className="mt-auto flex items-center gap-3 pt-4 text-sm">
                                    <span className="min-w-0 truncate text-white">{review.name}</span>
                                    <SourceMark source={review.source} />
                                </p>
                            </blockquote>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
