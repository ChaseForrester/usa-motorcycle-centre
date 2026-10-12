const TECH_AID_URL = "https://www.techaidaustralia.com.au";
const DEVELOPER_URL = "https://www.linkedin.com/in/chaseforrester/";

export function TechAidBadge({ className = "" }: { className?: string }) {
    return (
        <a
            href={TECH_AID_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Powered by Tech Aid Australia"
            className={`inline-flex items-center gap-3 rounded-full border-2 border-[#BF0A30] bg-white py-[0.7rem] pl-[0.7rem] pr-[1.15rem] shadow-[0_4px_14px_rgba(0,40,104,0.18)] transition hover:-translate-y-px hover:border-[#002868] hover:bg-red-50 hover:shadow-[0_10px_28px_rgba(191,10,48,0.22)] ${className}`}
        >
            <img
                src="/brand/tech-aid-logo.png"
                alt="Tech Aid Australia logo"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-contain"
            />
            <span className="flex flex-col gap-[0.05rem] text-left leading-[1.15]">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#BF0A30] opacity-90">
                    Powered by
                </span>
                <span className="font-display text-[0.95rem] font-extrabold tracking-[0.01em] text-[#002868]">
                    Tech Aid Australia
                </span>
            </span>
        </a>
    );
}

export function TechAidCredit() {
    return (
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span>
                Developed by{" "}
                <a
                    href={DEVELOPER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#000B58] hover:text-[#00139E]"
                >
                    Chase Forrester
                </a>
            </span>
            <span className="opacity-40" aria-hidden>
                ·
            </span>
            <a
                href={TECH_AID_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-[#00139E] hover:text-[#000B58]"
            >
                <img
                    src="/brand/tech-aid-logo.png"
                    alt=""
                    width={22}
                    height={22}
                    className="h-[22px] w-[22px] rounded-full object-contain"
                />
                <span>
                    Powered by <strong className="font-extrabold">Tech Aid Australia</strong>
                </span>
            </a>
        </div>
    );
}
