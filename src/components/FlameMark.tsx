export function FlameMark({ className = "h-8 w-8" }: { className?: string }) {
    return (
        <svg viewBox="0 0 64 120" className={className} fill="none" aria-hidden>
            <path
                d="M32 4c6 18-10 24-6 42 3 14 16 16 16 32 0 18-12 38-22 38S8 96 8 78c0-16 10-22 12-36C22 26 24 20 32 4z"
                fill="currentColor"
            />
            <path
                d="M32 28c3 10-4 14-2 24 1 8 8 10 8 20 0 12-6 24-12 24s-8-12-8-24c0-10 5-14 6-22 2-10 4-14 8-22z"
                fill="#0B0B0C"
                opacity="0.35"
            />
        </svg>
    );
}
