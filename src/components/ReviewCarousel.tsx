import type { Review } from "@/lib/types";

const SOURCE_MARK: Record<string, { src: string; alt: string; plate?: boolean }> = {
    "Yellow Pages": { src: "/brand/yellow-pages.svg", alt: "Yellow Pages", plate: true },
    Yelp: { src: "/brand/yelp.svg", alt: "Yelp" },
    Localsearch: { src: "/brand/localsearch.png", alt: "Localsearch" },
    Google: { src: "/brand/google.png", alt: "Google" },
    Facebook: { src: "/brand/facebook.svg", alt: "Facebook" },
};

export function SourceMark({
    source,
    large = false,
    onDark = false,
}: {
    source: string;
    large?: boolean;
    onDark?: boolean;
}) {
    const mark = SOURCE_MARK[source];
    if (!mark) return <span className="ml-auto shrink-0 text-xs text-steel">{source}</span>;
    const plate = mark.plate || onDark;
    const plateClass = mark.plate ? "bg-[#FFD100]" : "bg-white";
    if (plate) {
        return (
            <span
                className={`inline-flex shrink-0 items-center rounded-[3px] ${plateClass} ${large ? "h-11 px-2.5" : "ml-auto h-5 px-1.5"
                    }`}
            >
                <img
                    src={mark.src}
                    alt={mark.alt}
                    className={`source-mark w-auto object-contain ${large ? "h-7 max-w-[9.5rem]" : "h-4 max-w-[7.5rem]"}`}
                />
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

function spreadSources(reviews: Review[]) {
    if (reviews.length < 2) return reviews;
    const remaining = [...reviews];
    const ordered: Review[] = [];
    while (remaining.length) {
        const previous = ordered[ordered.length - 1]?.source;
        const first = ordered[0]?.source;
        const closing = remaining.length === 1;
        let index = remaining.findIndex(
            (review) => review.source !== previous && (!closing || review.source !== first)
        );
        if (index < 0) index = remaining.findIndex((review) => review.source !== previous);
        if (index < 0) index = 0;
        ordered.push(remaining.splice(index, 1)[0]);
    }
    return ordered;
}

export function ReviewCarousel({ reviews }: { reviews: Review[] }) {
    if (!reviews.length) return null;
    const spread = spreadSources(reviews);
    const loop = [...spread, ...spread];
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
