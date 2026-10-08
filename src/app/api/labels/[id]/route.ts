import { NextResponse } from "next/server";
import { labelPdfBytes } from "@/lib/commerce/pdf";
import { TENANTS } from "@/lib/commerce/tenants";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const tenantId = req.headers.get("x-tenant-id") || TENANTS[0].id;
    const tenant = TENANTS.find((t) => t.id === tenantId) || TENANTS[0];
    const bytes = labelPdfBytes({
        tenantName: tenant.name,
        orderId: params.id,
        articleId: "",
        toLine: `${tenant.from.suburb} ${tenant.from.state} ${tenant.from.postcode}`,
    });
    return new NextResponse(Buffer.from(bytes), {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${params.id}-100x150.pdf"`,
        },
    });
}
