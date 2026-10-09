import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export function FormLockup({ title, hint }: { title: string; hint?: string }) {
    return (
        <div className="mb-6 flex items-center gap-3">
            <img
                src="/brand/icon.png"
                alt="U.S.A. Motorcycle Centre"
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-full bg-white object-contain"
            />
            <div className="min-w-0">
                <p className="label">U.S.A. Motorcycle Centre</p>
                <h2 className="display mt-1 text-2xl text-white">{title}</h2>
                {hint ? <p className="mt-1 text-sm text-steel">{hint}</p> : null}
            </div>
        </div>
    );
}

const fieldLabel = "mb-1.5 flex items-baseline justify-between text-[11px] uppercase tracking-[0.16em] text-steel";

export function TextField({
    id,
    label,
    hint,
    error,
    ...props
}: {
    id: string;
    label: string;
    hint?: string;
    error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div>
            <label htmlFor={id} className={fieldLabel}>
                <span>{label}</span>
                {props.required ? <span className="text-flame">Required</span> : null}
            </label>
            <input
                id={id}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
                className="input"
                {...props}
            />
            {hint ? (
                <p id={`${id}-hint`} className="mt-1 text-xs text-steel">
                    {hint}
                </p>
            ) : null}
            {error ? (
                <p id={`${id}-error`} className="mt-1 text-sm text-flame" role="alert">
                    {error}
                </p>
            ) : null}
        </div>
    );
}

export function AreaField({
    id,
    label,
    ...props
}: { id: string; label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <div>
            <label htmlFor={id} className={fieldLabel}>
                <span>{label}</span>
                {props.required ? <span className="text-flame">Required</span> : null}
            </label>
            <textarea id={id} className="input min-h-32" {...props} />
        </div>
    );
}

export function FormNote({ children, live = false }: { children: ReactNode; live?: boolean }) {
    return (
        <p className="text-sm text-flame" role={live ? "status" : undefined} aria-live={live ? "polite" : undefined}>
            {children}
        </p>
    );
}
