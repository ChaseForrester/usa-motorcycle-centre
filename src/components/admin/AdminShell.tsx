"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
    Calendar,
    CreditCard,
    Inbox,
    LogOut,
    Package,
    Printer,
    Settings,
    ShoppingBag,
    Star,
    Ticket,
    Wrench,
} from "lucide-react";
import { useAdminAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const nav = [
    { href: "/admin", label: "Dispatch", icon: Printer },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/bookings", label: "Bookings", icon: Wrench },
    { href: "/admin/services", label: "Services", icon: Wrench },
    { href: "/admin/events", label: "Events", icon: Calendar },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
    { href: "/admin/discounts", label: "Discounts", icon: Ticket },
    { href: "/admin/inbox", label: "Forms", icon: Inbox },
    { href: "/admin/payments", label: "Stripe", icon: CreditCard },
    { href: "/admin/settings", label: "Site settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const email = useAdminAuth((s) => s.email);
    const logout = useAdminAuth((s) => s.logout);

    useEffect(() => {
        if (!email && pathname !== "/admin/login") router.replace("/admin/login");
    }, [email, pathname, router]);

    if (pathname === "/admin/login") return <>{children}</>;
    if (pathname.startsWith("/admin/print")) {
        if (!email) return <div className="min-h-screen bg-white" />;
        return <>{children}</>;
    }
    if (!email) return <div className="min-h-screen bg-zinc-100" />;

    return (
        <div className="flex min-h-screen bg-zinc-100 text-zinc-900">
            <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-zinc-950 text-zinc-100 md:flex md:flex-col">
                <div className="border-b border-white/10 px-5 py-5">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-orange-400">Super Admin</p>
                    <p className="mt-1 font-semibold">U.S.A. Motorcycle Centre</p>
                </div>
                <nav className="flex-1 space-y-0.5 p-3">
                    {nav.map((item) => {
                        const Icon = item.icon;
                        const active =
                            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                                    active ? "bg-orange-500 text-zinc-950" : "text-zinc-300 hover:bg-white/5"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="border-t border-white/10 p-4">
                    <p className="truncate text-xs text-zinc-400">{email}</p>
                    <button
                        onClick={() => {
                            logout();
                            router.push("/admin/login");
                        }}
                        className="mt-2 flex items-center gap-2 text-sm text-zinc-300 hover:text-white"
                    >
                        <LogOut className="h-4 w-4" /> Sign out
                    </button>
                    <Link href="/" className="mt-3 block text-xs text-orange-400">
                        View storefront →
                    </Link>
                </div>
            </aside>
            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex gap-2 overflow-x-auto border-b border-zinc-200 bg-white px-3 py-2 md:hidden">
                    {nav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="whitespace-nowrap rounded-full bg-zinc-100 px-3 py-1 text-xs"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
                <div className="flex-1 p-4 md:p-8">{children}</div>
            </div>
        </div>
    );
}
