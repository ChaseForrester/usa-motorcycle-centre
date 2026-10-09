"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar, Header } from "./Header";
import { Footer } from "./Footer";
import { MobileTabBar } from "./MobileTabBar";

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
            <div className="hidden lg:block">
                <AnnouncementBar />
            </div>
            <a href="#main" className="skip-link">
                Skip to content
            </a>
            <Header />
            <div className="pb-[calc(4.25rem+env(safe-area-inset-bottom))] lg:pb-0">
                <main id="main" className="min-h-screen">{children}</main>
                <Footer />
            </div>
            <MobileTabBar />
        </>
    );
}
