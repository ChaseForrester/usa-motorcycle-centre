import type { InboxItem } from "./inbox";
import { SITE } from "./seo";

const ORIGIN = "https://www.usamotorcyclecentre.com.au";
const LOGO = `${ORIGIN}/brand/icon.png`;

const LINKS = [
    { label: "Workshop", href: `${ORIGIN}/` },
    { label: "Book a service", href: `${ORIGIN}/book` },
    { label: "Contact", href: `${ORIGIN}/contact` },
    { label: "Shirts", href: `${ORIGIN}/shop` },
    { label: "Gift cards", href: `${ORIGIN}/gift-cards` },
];

function esc(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function shell(heading: string, paragraphs: string[], extra = "") {
    const body = paragraphs
        .map(
            (p) =>
                `<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#1a1a1c;">${p}</p>`
        )
        .join("");
    const links = LINKS.map(
        (l) =>
            `<a href="${l.href}" style="color:#ff6a00;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;">${l.label}</a>`
    ).join(
        `<span style="color:#8b8b92;font-family:Arial,Helvetica,sans-serif;font-size:13px;"> &nbsp;·&nbsp; </span>`
    );
    return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#f4f1ea;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e4e0d8;">
        <tr><td style="background:#0b0b0c;padding:22px 28px;">
          <img src="${LOGO}" width="56" height="56" alt="${esc(SITE.name)}" style="display:block;width:56px;height:56px;border-radius:28px;background:#ffffff;object-fit:contain;" />
          <p style="margin:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:0.16em;text-transform:uppercase;color:#ff6a00;">${esc(SITE.name)}</p>
        </td></tr>
        <tr><td style="padding:28px;">
          <h1 style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.25;color:#0b0b0c;">${esc(heading)}</h1>
          ${body}
          ${extra}
        </td></tr>
        <tr><td style="padding:0 28px 28px;">
          <p style="margin:0 0 12px;">${links}</p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#5c5c64;">
            <a href="${SITE.phoneHref}" style="color:#0b0b0c;">${esc(SITE.phone)}</a><br />
            <a href="mailto:${SITE.email}" style="color:#0b0b0c;">${esc(SITE.email)}</a><br />
            <a href="${SITE.mapsUrl}" style="color:#0b0b0c;">${esc(SITE.street)}, ${esc(SITE.suburb)} ${esc(SITE.state)} ${esc(SITE.postcode)}</a>
          </p>
          <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.45;color:#8b8b92;">
            Independent Harley specialist. Not an authorised Harley-Davidson dealer. Est. ${SITE.established}.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function textFooter() {
    return [
        SITE.name,
        SITE.phone,
        SITE.email,
        `${SITE.street}, ${SITE.suburb} ${SITE.state} ${SITE.postcode}`,
        ORIGIN,
        `${ORIGIN}/book`,
        `${ORIGIN}/contact`,
        `${ORIGIN}/shop`,
        SITE.mapsUrl,
    ].join("\n");
}

export function clientEmail(item: InboxItem): { subject: string; text: string; html: string } {
    const name = item.name || "there";
    if (item.kind === "booking") {
        const service = item.fields.serviceName || "the workshop";
        const date = item.fields.preferredDate ? ` on ${item.fields.preferredDate}` : "";
        const bike = item.fields.bike ? ` Bike: ${item.fields.bike}.` : "";
        const subject = `${SITE.name} — we have your booking request`;
        const text = `Hi ${name},\n\nThe workshop has your request for ${service}${date}.${bike}\n\nWe will confirm the lift. If a job gets thrown off course we will email you that we will be in touch.\n\nUrgent? Call ${SITE.phone} and ask for Laurie or Mick.\n\n${textFooter()}`;
        return {
            subject,
            text,
            html: shell("We have your booking request", [
                `Hi ${esc(name)},`,
                `The workshop has your request for <strong>${esc(service)}</strong>${date ? ` on ${esc(item.fields.preferredDate)}` : ""}.${bike ? ` ${esc(bike.trim())}` : ""}`,
                `We will confirm the lift. If a job gets thrown off course we will email you that we will be in touch.`,
                `Urgent? Call <a href="${SITE.phoneHref}" style="color:#ff6a00;">${esc(SITE.phone)}</a> and ask for Laurie or Mick.`,
            ]),
        };
    }
    if (item.kind === "newsletter") {
        const subject = `${SITE.name} — you are on the workshop list`;
        const text = `Hi,\n\nYou are on the list for specials, Saturday hours and the next catch-up. No spam — just the shop.\n\n${textFooter()}`;
        return {
            subject,
            text,
            html: shell("You are on the list", [
                "Specials, Saturday hours and when the next catch-up is on.",
                "No spam. Just the shop.",
            ]),
        };
    }
    const subject =
        item.kind === "freight"
            ? `${SITE.name} — we have your freight quote request`
            : item.kind === "event"
                ? `${SITE.name} — we have your RSVP`
                : `${SITE.name} — we have your message`;
    const lead =
        item.kind === "freight"
            ? "The workshop has your freight quote request. A person will price it and write back."
            : item.kind === "event"
                ? "You are noted for the ride. We will keep you posted from the shop."
                : "The workshop has your message. Laurie or Mick will write back.";
    const text = `Hi ${name},\n\n${lead}\n\nIf it is urgent, call ${SITE.phone}.\n\n${textFooter()}`;
    return {
        subject,
        text,
        html: shell(subject.replace(`${SITE.name} — `, ""), [
            `Hi ${esc(name)},`,
            esc(lead),
            `If it is urgent, call <a href="${SITE.phoneHref}" style="color:#ff6a00;">${esc(SITE.phone)}</a>.`,
        ]),
    };
}

export function adminEmail(item: InboxItem): { subject: string; text: string; html: string } {
    const kindLabel: Record<InboxItem["kind"], string> = {
        booking: "Booking",
        contact: "Contact",
        freight: "Freight quote",
        newsletter: "Workshop list",
        event: "RSVP",
    };
    const fieldLabel: Record<string, string> = {
        serviceName: "Service",
        serviceId: "Service code",
        bike: "Bike",
        preferredDate: "Preferred day",
        country: "Country",
        event: "Event",
    };
    const rows = [
        ["Form", kindLabel[item.kind]],
        ["Name", item.name],
        ["Email", item.email],
        ["Phone", item.phone || "—"],
        ["Message", item.message || "—"],
        ...Object.entries(item.fields).map(([k, v]) => [fieldLabel[k] || k, v || "—"] as [string, string]),
    ];
    const subject = `${kindLabel[item.kind]} from ${item.name} — ${SITE.name}`;
    const text = [
        `New ${kindLabel[item.kind].toLowerCase()} on ${ORIGIN}`,
        "",
        ...rows.map(([k, v]) => `${k}: ${v}`),
        "",
        `Open Super Admin: ${ORIGIN}/admin/inbox`,
        textFooter(),
    ].join("\n");
    const table = rows
        .map(
            ([k, v]) =>
                `<tr><td style="padding:8px 12px 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8b8b92;vertical-align:top;">${esc(k)}</td><td style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#0b0b0c;">${esc(v)}</td></tr>`
        )
        .join("");
    const extra = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">${table}</table>
<p style="margin:0;"><a href="${ORIGIN}/admin/inbox" style="display:inline-block;background:#ff6a00;color:#0b0b0c;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:12px 18px;">Open Super Admin</a></p>`;
    return {
        subject,
        text,
        html: shell(`New ${kindLabel[item.kind].toLowerCase()}`, [
            `${esc(item.name)} just sent this from the website.`,
        ], extra),
    };
}

export function bookingDelayEmail(item: InboxItem): { subject: string; text: string; html: string } {
    const service = item.fields.serviceName || "the workshop";
    const date = item.fields.preferredDate || "the day we discussed";
    const bike = item.fields.bike ? ` for the ${item.fields.bike}` : "";
    const subject = `${SITE.name} — we will be in touch`;
    const text = `Hi ${item.name},\n\nYour booking for ${service}${bike} (preferred ${date}) has been thrown off course in the workshop.\n\nWe still have you on the list. Laurie or Mick will be in touch to lock in a new time.\n\nIf you need us sooner, call ${SITE.phone}.\n\n${textFooter()}`;
    return {
        subject,
        text,
        html: shell("We will be in touch", [
            `Hi ${esc(item.name)},`,
            `Your booking for ${esc(service)}${bike ? esc(bike) : ""} (preferred ${esc(date)}) has been thrown off course in the workshop.`,
            "We still have you on the list. Laurie or Mick will be in touch to lock in a new time.",
            `If you need us sooner, call <a href="${SITE.phoneHref}" style="color:#ff6a00;">${esc(SITE.phone)}</a>.`,
        ]),
    };
}
