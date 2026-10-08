"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar, Header } from "./Header";
import { Footer } from "./Footer";

export function StoreChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const bare =
        pathname.startsWith("/admin") ||
        pathname.startsWith("/platform") ||
        pathname.startsWith("/no-tenant");
    if (bare) return <>{children}</>;
    return (
        <>
            <div className="grain-overlay" />
            <AnnouncementBar />
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
