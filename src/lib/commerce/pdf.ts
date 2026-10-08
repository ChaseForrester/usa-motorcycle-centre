/** Minimal 100x150mm PDF (282.8 x 425.2 points). No live carrier data. */
export function labelPdfBytes(opts: {
    tenantName: string;
    orderId: string;
    articleId: string;
    toLine: string;
}): Uint8Array {
    const article = opts.articleId || "ARTICLE PENDING";
    const text = [
        "%PDF-1.4",
        "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
        "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
        "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 283 425] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
        streamContent(
            [
                "BT /F1 11 Tf 24 390 Td (100 x 150 mm label) Tj ET",
                `BT /F1 10 Tf 24 360 Td (${pdfSafe(opts.tenantName)}) Tj ET`,
                `BT /F1 10 Tf 24 340 Td (Order ${pdfSafe(opts.orderId)}) Tj ET`,
                `BT /F1 10 Tf 24 320 Td (${pdfSafe(article)}) Tj ET`,
                `BT /F1 9 Tf 24 290 Td (${pdfSafe(opts.toLine)}) Tj ET`,
                "BT /F1 8 Tf 24 40 Td (Stub. Carrier key is not in this repo.) Tj ET",
            ].join("\n")
        ),
        "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
        "xref",
        "0 6",
        "0000000000 65535 f ",
        "trailer << /Size 6 /Root 1 0 R >>",
        "startxref",
        "0",
        "%%EOF",
        "",
    ].join("\n");
    return new TextEncoder().encode(text);
}

function streamContent(body: string): string {
    return `4 0 obj << /Length ${body.length} >> stream\n${body}\nendstream endobj`;
}

function pdfSafe(value: string): string {
    return value.replace(/[()\\]/g, " ").slice(0, 80);
}
