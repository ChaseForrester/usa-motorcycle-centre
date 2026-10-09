import type { Metadata } from "next";

export const SITE_URL = "https://usamotorcyclecentre.com.au";

export const SITE = {
    name: "U.S.A. Motorcycle Centre",
    shortName: "USA MCC",
    legalName: "U.S.A. Motorcycle Centre Pty Ltd",
    slogan: "U.S.A. Motorcycle Centre is the name. Servicing Harleys is our game.",
    phone: "(02) 4257 2333",
    phoneHref: "tel:+61242572333",
    email: "usa_motorcycle_centre@yahoo.com.au",
    street: "8 Miall Way",
    suburb: "Albion Park Rail",
    state: "NSW",
    postcode: "2527",
    country: "Australia",
    established: 1992,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=8+Miall+Way+Albion+Park+Rail+NSW+2527",
    facebook: "https://www.facebook.com/USA.MOTORCYCLE.CENTRE/",
    instagram: "https://www.instagram.com/usa.motorcycle.centre/",
    logo: "/brand/icon.png",
    ogImage: "/brand/og.jpg",
    shopFloor: "/brand/shop-floor.jpg",
    lat: -34.5652,
    lng: 150.7929,
};

export const TITLE =
    "Harley Mechanic Wollongong to Nowra | U.S.A. Motorcycle Centre";

export const DESCRIPTION =
    "Independent Harley® specialist workshop at 8 Miall Way, Albion Park Rail NSW. Service, smash repairs, tyres and parts for riders from Wollongong, Shellharbour and Kiama through to Nowra. Est. 1992. Call (02) 4257 2333.";

export const KEYWORDS = [
    "Harley mechanic Wollongong",
    "Harley Davidson service Illawarra",
    "motorcycle mechanic Nowra",
    "motorcycle repairs Shellharbour",
    "Harley workshop Albion Park Rail",
    "motorcycle tyres Wollongong",
    "smash repairs motorcycle Kiama",
    "USA Motorcycle Centre",
    "Harley parts NSW",
    "motorcycle service Shoalhaven",
].join(", ");

export const SERVICE_TOWNS = [
    "Wollongong",
    "Figtree",
    "Unanderra",
    "Dapto",
    "Albion Park",
    "Albion Park Rail",
    "Oak Flats",
    "Shellharbour",
    "Warilla",
    "Kiama",
    "Gerringong",
    "Berry",
    "Bomaderry",
    "Nowra",
    "Shoalhaven",
    "Illawarra",
];

export type FaqItem = { q: string; a: string };

export const FAQS: FaqItem[] = [
    {
        q: "Who is the Harley mechanic from Wollongong to Nowra?",
        a: "U.S.A. Motorcycle Centre at 8 Miall Way, Albion Park Rail is the independent Harley® specialist workshop for the Illawarra and Shoalhaven. Laurie and Mick have serviced Harleys here since 1992. Riders come from Wollongong, Shellharbour, Kiama and Nowra.",
    },
    {
        q: "Where is U.S.A. Motorcycle Centre?",
        a: "8 Miall Way, Albion Park Rail NSW 2527, in the Shellharbour industrial area. Free parking. Phone (02) 4257 2333. Open Monday to Friday 8am–5pm and Saturday 8am–12pm.",
    },
    {
        q: "Do you service Harley-Davidson motorcycles?",
        a: "Yes. Harley® service and tuning is the core of the workshop — scheduled services, diagnostics, cams, carb and EFI, smash repairs, tyres, electrical and customising. Independent specialist. Not a dealer.",
    },
    {
        q: "Are you an authorised Harley-Davidson dealer?",
        a: "No. U.S.A. Motorcycle Centre is an independent Harley® specialist. That is the point. We work on the bike you ride, with the parts and oils that belong on it.",
    },
    {
        q: "Do you fit motorcycle tyres in the Illawarra?",
        a: "Yes. Avon, Dunlop and Pirelli — fitted, aligned and electronically balanced at 8 Miall Way. Tyre fitting from $40. Bring the bike in or call (02) 4257 2333.",
    },
    {
        q: "Do you take smash repairs and insurance work?",
        a: "Yes. Fairings, guards, wheels, bars and the damage that shows up after a drop. We work with insurers and with riders paying cash. Bring photos or ride it in.",
    },
    {
        q: "Can I click and collect shirts?",
        a: "Yes. Order the U.S.A. flame hoodie or crews online and collect at 8 Miall Way, Albion Park Rail. Australia Post shipping is on the checkout. Tyres, oils and workshop jobs are booked with Laurie or Mick.",
    },
    {
        q: "Do you sell gift cards?",
        a: "Yes. Workshop gift cards run from $100 to $5,000 — pick a set amount or type any figure in between. Redeem on Harley service, smash work, tyres or a shirt at 8 Miall Way.",
    },
    {
        q: "How do I book a Harley service?",
        a: "Book online at usamotorcyclecentre.com.au/book or call (02) 4257 2333 and ask for Laurie or Mick. Say what the bike is doing and when you need it back.",
    },
    {
        q: "Do Nowra and Shoalhaven riders come to you?",
        a: "Yes. The workshop sits on the Princes Highway corridor between Wollongong and Nowra. Riders from Berry, Bomaderry, Nowra and the Shoalhaven use Albion Park Rail as the Harley specialist stop.",
    },
];

export function absUrl(path = "/"): string {
    if (path.startsWith("http")) return path;
    return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMeta(title: string, description: string, path: string): Metadata {
    const url = absUrl(path);
    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title: `${title} | ${SITE.name}`,
            description,
            url,
            type: "website",
            locale: "en_AU",
            siteName: SITE.name,
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | ${SITE.name}`,
            description,
        },
    };
}

export function localBusinessJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": ["MotorcycleRepair", "AutoRepair", "Store"],
        "@id": `${SITE_URL}/#business`,
        name: SITE.name,
        legalName: SITE.legalName,
        alternateName: ["USA Motorcycle Centre", "USA MCC", "U.S.A. MCC"],
        description: DESCRIPTION,
        url: SITE_URL,
        image: [absUrl(SITE.ogImage), absUrl(SITE.shopFloor), absUrl(SITE.logo)],
        logo: absUrl(SITE.logo),
        telephone: "+61-2-4257-2333",
        email: SITE.email,
        foundingDate: String(SITE.established),
        slogan: SITE.slogan,
        priceRange: "$$",
        currenciesAccepted: "AUD",
        paymentAccepted: "Cash, Card, Stripe",
        address: {
            "@type": "PostalAddress",
            streetAddress: SITE.street,
            addressLocality: SITE.suburb,
            addressRegion: SITE.state,
            postalCode: SITE.postcode,
            addressCountry: "AU",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: SITE.lat,
            longitude: SITE.lng,
        },
        hasMap: SITE.mapsUrl,
        areaServed: SERVICE_TOWNS.map((name) => ({
            "@type": "City",
            name: `${name}, New South Wales, Australia`,
        })),
        openingHoursSpecification: [
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "08:00",
                closes: "17:00",
            },
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: "Saturday",
                opens: "08:00",
                closes: "12:00",
            },
        ],
        sameAs: [SITE.facebook, SITE.instagram],
        knowsAbout: [
            "Harley-Davidson service",
            "motorcycle smash repairs",
            "motorcycle tyres",
            "computerised diagnostics",
            "motorcycle electrical",
            "custom ape hangers",
            "AMSOIL",
            "Kuryakyn",
        ],
        employee: [
            { "@type": "Person", name: "Laurie", jobTitle: "Mechanic" },
            { "@type": "Person", name: "Mick", jobTitle: "Mechanic" },
        ],
    };
}

export function websiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE.name,
        description: DESCRIPTION,
        inLanguage: "en-AU",
        publisher: { "@id": `${SITE_URL}/#business` },
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/shop?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}

export function faqJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
    };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: absUrl(item.path),
        })),
    };
}
