export type InboxKind = "booking" | "contact" | "freight" | "newsletter" | "event";

export type BookingStatus = "new" | "confirmed" | "delayed" | "complete" | "cancelled";

export type InboxEmail = {
    at: string;
    subject: string;
    text: string;
    sent: boolean;
    error?: string;
};

export type InboxItem = {
    id: string;
    createdAt: string;
    kind: InboxKind;
    name: string;
    email: string;
    phone: string;
    message: string;
    fields: Record<string, string>;
    status: string;
    emails: InboxEmail[];
};

export function bookingDelayCopy(item: InboxItem): { subject: string; text: string } {
    const service = item.fields.serviceName || "the workshop";
    const date = item.fields.preferredDate || "the day we discussed";
    const bike = item.fields.bike ? ` for the ${item.fields.bike}` : "";
    return {
        subject: "U.S.A. Motorcycle Centre — we will be in touch",
        text: `Hi ${item.name},

Your booking for ${service}${bike} (preferred ${date}) has been thrown off course in the workshop.

We still have you on the list. Laurie or Mick will be in touch to lock in a new time.

If you need us sooner, call (02) 4257 2333.

U.S.A. Motorcycle Centre
8 Miall Way, Albion Park Rail NSW 2527`,
    };
}

export function bookingReceivedCopy(item: InboxItem): { subject: string; text: string } {
    const service = item.fields.serviceName || "the workshop";
    const date = item.fields.preferredDate || "";
    return {
        subject: "U.S.A. Motorcycle Centre — we have your booking request",
        text: `Hi ${item.name},

The workshop has your request for ${service}${date ? ` on ${date}` : ""}.

We will confirm the lift. Jobs get moved when a smash or a parts wait lands — if that happens we will email you that we will be in touch.

Urgent? Call (02) 4257 2333 and ask for Laurie or Mick.

U.S.A. Motorcycle Centre
8 Miall Way, Albion Park Rail NSW 2527`,
    };
}
