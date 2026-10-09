export async function sendWorkshopEmail(opts: {
    to: string;
    subject: string;
    text: string;
    html?: string;
    replyTo?: string;
}): Promise<{ sent: boolean; error?: string }> {
    const to = opts.to.trim();
    if (!to.includes("@")) return { sent: false, error: "No email on this record." };

    const from =
        process.env.MAIL_FROM ||
        "U.S.A. Motorcycle Centre <workshop@usamotorcyclecentre.com.au>";
    const key = process.env.RESEND_API_KEY;
    if (!key) {
        return {
            sent: false,
            error: "Queued in Super Admin. Add RESEND_API_KEY to send from the server.",
        };
    }

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from,
            to,
            reply_to: opts.replyTo || "usa_motorcycle_centre@yahoo.com.au",
            subject: opts.subject,
            text: opts.text,
            html: opts.html,
        }),
    });
    if (!res.ok) {
        const body = await res.text();
        return { sent: false, error: body.slice(0, 300) };
    }
    return { sent: true };
}
