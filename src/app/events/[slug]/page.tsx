import type { Metadata } from "next";
import { events } from "@/lib/seed";
import { JsonLd } from "@/components/JsonLd";
import { SITE, SITE_URL, absUrl, breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import EventView from "./event-view";

type Props = { params: { slug: string } };

export function generateStaticParams() {
    return events.map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
    const event = events.find((e) => e.slug === params.slug);
    if (!event) return pageMeta("Events", "Workshop events at U.S.A. Motorcycle Centre.", "/events");
    return pageMeta(event.title, event.summary, `/events/${event.slug}`);
}

export default function EventPage({ params }: Props) {
    const event = events.find((e) => e.slug === params.slug);
    const json = event
        ? [
            breadcrumbJsonLd([
                { name: "Home", path: "/" },
                { name: "Events", path: "/events" },
                { name: event.title, path: `/events/${event.slug}` },
            ]),
            {
                "@context": "https://schema.org",
                "@type": "Event",
                name: event.title,
                description: event.description,
                startDate: event.date,
                eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
                eventStatus: "https://schema.org/EventScheduled",
                image: absUrl(event.image),
                location: {
                    "@type": "Place",
                    name: event.location,
                },
                organizer: { "@type": "Organization", name: SITE.name, url: SITE_URL },
            },
        ]
        : [];

    return (
        <>
            {json.length > 0 && <JsonLd data={json} />}
            <EventView />
        </>
    );
}
