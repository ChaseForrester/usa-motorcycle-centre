import { bookingDelayEmail, clientEmail } from "./email-template";

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

export function bookingDelayCopy(item: InboxItem) {
    return bookingDelayEmail(item);
}

export function bookingReceivedCopy(item: InboxItem) {
    return clientEmail({ ...item, kind: "booking" });
}
