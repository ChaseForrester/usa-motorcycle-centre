import { NextResponse, type NextRequest } from "next/server";
import { isPlatformHost, tenantByHost } from "@/lib/commerce/tenants";

export function middleware(req: NextRequest) {
    const host = req.headers.get("host") || "";
    const url = req.nextUrl;
    const platform = isPlatformHost(host);
    const tenant = tenantByHost(host);

    if (platform && !url.pathname.startsWith("/platform") && !url.pathname.startsWith("/_next")) {
        const dest = url.clone();
        dest.pathname = "/platform";
        return NextResponse.redirect(dest);
    }

    if (!platform && !tenant && !url.pathname.startsWith("/no-tenant")) {
        const dest = url.clone();
        dest.pathname = "/no-tenant";
        return NextResponse.rewrite(dest);
    }

    const requestHeaders = new Headers(req.headers);
    if (tenant) {
        requestHeaders.set("x-tenant-id", tenant.id);
        requestHeaders.set("x-tenant-domain", tenant.domain);
    }
    if (platform) requestHeaders.set("x-platform", "1");

    const res = NextResponse.next({ request: { headers: requestHeaders } });
    if (tenant) res.cookies.set("tenantId", tenant.id, { path: "/", sameSite: "lax" });
    return res;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/|products/|workshop/|icons/).*)"],
};
