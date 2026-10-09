import type {
  Discount,
  EventItem,
  Product,
  Review,
  Service,
  SiteSettings,
} from "./types";

export const defaultSettings: SiteSettings = {
  brand: {
    name: "U.S.A. Motorcycle Centre",
    legalName: "U.S.A. Motorcycle Centre Pty Ltd",
    shortName: "U.S.A. MCC",
    tagline: "Harley® specialist repair, parts and rider gear — Illawarra since 1992.",
    slogan: "U.S.A. Motorcycle Centre is the name. Servicing Harleys is our game.",
    established: 1992,
    logo: "/brand/icon.png",
    logoInvert: false,
  },
  colors: {
    accent: "#FF6A00",
    accentSoft: "#FF8A3D",
    ink: "#0B0B0C",
  },
  contact: {
    phone: "(02) 4257 2333",
    phoneHref: "tel:+61242572333",
    email: "usa_motorcycle_centre@yahoo.com.au",
    addressLine: "8 Miall Way",
    suburb: "Albion Park Rail",
    state: "NSW",
    postcode: "2527",
    country: "Australia",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=8+Miall+Way+Albion+Park+Rail+NSW+2527",
    abn: "",
  },
  hours: {
    monday: { open: "08:00", close: "17:00", closed: false },
    tuesday: { open: "08:00", close: "17:00", closed: false },
    wednesday: { open: "08:00", close: "17:00", closed: false },
    thursday: { open: "08:00", close: "17:00", closed: false },
    friday: { open: "08:00", close: "17:00", closed: false },
    saturday: { open: "08:00", close: "12:00", closed: false },
    sunday: { open: "08:00", close: "12:00", closed: true },
  },
  social: {
    facebook: "https://www.facebook.com/USA.MOTORCYCLE.CENTRE/",
    instagram: "https://www.instagram.com/usa.motorcycle.centre/",
    youtube: "",
    tiktok: "",
  },
  seo: {
    title: "Harley Mechanic Wollongong to Nowra | U.S.A. Motorcycle Centre",
    description:
      "Independent Harley® specialist workshop at 8 Miall Way, Albion Park Rail NSW. Service, smash repairs, tyres and parts for riders from Wollongong, Shellharbour and Kiama through to Nowra. Est. 1992. Call (02) 4257 2333.",
    keywords:
      "Harley mechanic Wollongong, motorcycle mechanic Nowra, Harley service Illawarra, motorcycle repairs Shellharbour, USA Motorcycle Centre Albion Park Rail, motorcycle tyres Kiama",
  },
  homepage: {
    announcement:
      "Workshop open Mon–Fri 8am–5pm · Sat 8am–12pm · Wollongong to Nowra · See Laurie or Mick · PH 4257 2333",
    heroKicker: "Est. 1992 · Albion Park Rail · Wollongong to Nowra",
    heroTitle: "Servicing Harleys is our game.",
    heroSubtitle:
      "Independent Harley® specialist workshop for the Illawarra and Shoalhaven. Diagnostics, smash repairs, tyres, parts and genuine U.S.A. rider gear — from the same crew that’s been looking after bikes from Wollongong to Nowra since 1992.",
    heroImage: "/brand/shop-floor.jpg",
    heroCta: "Shop the shirts",
    heroSecondary: "Book a service",
  },
  shipping: {
    clickCollectEnabled: true,
    australiaPostEnabled: true,
    freeShippingThreshold: 150,
    flatRate: 14.95,
    clickCollectLabel: "Click & collect at 8 Miall Way",
  },
  tax: {
    gstRate: 0.1,
    pricesIncludeGst: true,
  },
  features: {
    shop: true,
    bookings: true,
    events: true,
    giftCards: true,
    newsletter: true,
    reviews: true,
  },
  stripe: {
    mode: "test",
    publishableKey: "",
    connected: false,
  },
};

const SHIRT_SIZES = [
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
  { id: "2xl", label: "2XL" },
  { id: "3xl", label: "3XL" },
];

function shirtSizes(skuPrefix: string) {
  return SHIRT_SIZES.map((s) => ({ ...s, sku: `${skuPrefix}-${s.id.toUpperCase()}` }));
}

export const GIFT_MIN = 100;
export const GIFT_MAX = 5000;
export const GIFT_AMOUNTS = [100, 250, 500, 1000, 2500, 5000];

function giftVariants() {
  return GIFT_AMOUNTS.map((n) => ({
    id: `amt-${n}`,
    label: `$${n.toLocaleString("en-AU")}`,
    sku: `GIFT-${n}`,
    price: n,
  }));
}

/** Shop stock for now: the three shirts with real photos and the prices on the rack. */
export const products: Product[] = [
  {
    id: "p-hoodie-black",
    slug: "usa-mcc-flame-hoodie-black",
    name: "Flame Hoodie — Black",
    subtitle: "Shop hoodie · EST 1992 shield",
    description:
      "Heavyweight black hoodie with the U.S.A. Motorcycle Centre shield on the chest, EST 1992, full back print of the workshop crest and the original shop copy, plus flame sleeves finishing on the cuff badges. The piece the workshop wears.",
    price: 119,
    images: [
      "/products/hoodie-black-front.jpg",
      "/products/hoodie-black-back.jpg",
      "/products/sleeves-detail.jpg",
    ],
    category: "Apparel",
    tags: ["merch", "hoodie", "shirt"],
    featured: true,
    inStock: true,
    brand: "U.S.A. MCC",
    variants: shirtSizes("HOOD-BLK"),
    details: [
      "Front shield with EST 1992",
      "Full back workshop print and phone number",
      "Flame graphics down both sleeves",
      "Click & collect from Albion Park Rail",
    ],
  },
  {
    id: "p-crew-black",
    slug: "usa-mcc-flame-crew-black",
    name: "Flame Crew — Black",
    subtitle: "Shop crew · back print",
    description:
      "Black crew with the full U.S.A. Motorcycle Centre back print — shield, the original slogan, workshop services and PH 4257 2333 — over grey flame artwork. Sleeve flames and cuff badges.",
    price: 89,
    images: ["/products/crew-black-back.jpg", "/products/sleeves-detail.jpg"],
    category: "Apparel",
    tags: ["merch", "crew"],
    featured: true,
    inStock: true,
    brand: "U.S.A. MCC",
    variants: shirtSizes("CREW-BLK"),
  },
  {
    id: "p-crew-grey",
    slug: "usa-mcc-flame-crew-grey",
    name: "Flame Crew — Grey Marle",
    subtitle: "Shop crew · EST 1992",
    description:
      "Grey marle crew with the black U.S.A. Motorcycle Centre shield, EST 1992, flame sleeves and the full workshop back print. A weekday staple that still looks like it came out of the shop.",
    price: 89,
    images: [
      "/products/crew-grey-front.jpg",
      "/products/crew-grey-back.jpg",
      "/products/sleeves-detail.jpg",
    ],
    category: "Apparel",
    tags: ["merch", "crew"],
    featured: true,
    inStock: true,
    brand: "U.S.A. MCC",
    variants: shirtSizes("CREW-GRY"),
  },
  {
    id: "p-gift-card",
    slug: "usa-mcc-gift-card",
    name: "Workshop Gift Card",
    subtitle: "$100 to $5,000",
    description:
      "Put it toward a service, smash work, tyres or a shirt from the rack. Choose any amount from $100 to $5,000. Printed in-store or emailed after checkout. Redeem at 8 Miall Way with Laurie or Mick.",
    price: 100,
    images: ["/products/gift-card.jpg", "/products/gift-card-portrait.jpg"],
    category: "Gift Cards",
    tags: ["gift-card", "voucher"],
    featured: false,
    inStock: true,
    brand: "U.S.A. MCC",
    variants: giftVariants(),
    details: [
      "Any amount from $100 to $5,000",
      "Redeem on workshop time or shirts",
      "Collect at 8 Miall Way or we email it",
      "GST included",
    ],
  },
];

export const services: Service[] = [
  {
    id: "s-harley",
    slug: "harley-service-tuning",
    name: "Harley® Service & Tuning",
    summary: "Logbook services, diagnostics and dyno-style tuning on V-Twins.",
    description:
      "If it is not firing the way it used to, we have computerised diagnostic and tuning equipment that will get to the root of it. Laurie and Mick have been looking after Harleys in the Illawarra since 1992 — scheduled services, cam jobs, carb and EFI work, and the unglamorous stuff that keeps you on the road.",
    duration: "Half to full day",
    fromPrice: 249,
    image: "/workshop/primary-case.jpg",
  },
  {
    id: "s-smash",
    slug: "smash-repairs-insurance",
    name: "Smash Repairs & Insurance",
    summary: "Insurance work and crash repairs, quoted properly.",
    description:
      "Fairings, guards, wheels, bars and the hidden damage that shows up after a drop. We work with insurers and we work with riders who would rather keep it cash. Bring photos or ride it in.",
    duration: "Quoted",
    image: "/workshop/chopper-build.jpg",
  },
  {
    id: "s-tyres",
    slug: "tyres-alignment-balancing",
    name: "Tyres, Alignment & Balancing",
    summary: "Avon, Dunlop and Pirelli — fitted, aligned and electronically balanced.",
    description:
      "Motorcycle tyre fitting, electronic wheel balancing and alignment. We keep the compounds that work on cruisers and tourers, and we will tell you if a cheaper tyre is a false economy.",
    duration: "1–2 hours",
    fromPrice: 40,
    image: "/workshop/pirelli-rack.jpg",
  },
  {
    id: "s-electrical",
    slug: "electrical-repairs-wiring",
    name: "Electrical Repairs & Wiring",
    summary: "Charging, lighting, aftermarket wiring and the gremlins in between.",
    description:
      "Batteries, regulators, looms, aftermarket lights and the wiring that never quite got finished. We diagnose first — then we fix it so it stays fixed.",
    duration: "Quoted",
    image: "/workshop/clutch-job.jpg",
  },
  {
    id: "s-custom",
    slug: "customising",
    name: "Customising",
    summary: "Bars, pipes, intake, seats, lighting — built to the bike you actually ride.",
    description:
      "Our mechanics can take on customising work: ape hangers, exhaust, air cleaners, seats and the small chrome that changes how a bike sits. We will tell you what is worth doing.",
    duration: "Quoted",
    image: "/workshop/chopper-build.jpg",
  },
  {
    id: "s-diag",
    slug: "diagnostics",
    name: "Computerised Diagnostics",
    summary: "Find the fault before you throw parts at it.",
    description:
      "Computerised diagnostic and tuning equipment for Harley-Davidson and a wide range of road bikes. Book a diagnosis if it is intermittent, in limp mode, or just not right.",
    duration: "1–3 hours",
    fromPrice: 99,
    image: "/workshop/primary-case.jpg",
  },
];

export const events: EventItem[] = [];

/** Public rider quotes. Sources are Localsearch, Yellow Pages, and Google. Kept short so the cards share one height. */
export const reviews: Review[] = [
  {
    id: "r1",
    name: "Tony Hair",
    quote:
      "Laurie and Mick went above and beyond to install my 16\" highballs on my 883 Sporty. Their work is outstanding.",
    rating: 5,
    source: "Localsearch",
  },
  {
    id: "r-ron",
    name: "Ron Louie",
    quote:
      "A big thank you to Laurie and the team. Really appreciated how friendly and professional they are.",
    rating: 5,
    source: "Google",
  },
  {
    id: "r3",
    name: "Brendan S.",
    quote:
      "Got new Black Burleigh apes and risers. Went above and beyond. Perfect advice for my Harley.",
    rating: 5,
    source: "Yellow Pages",
  },
  {
    id: "r2",
    name: "Dale Gibbons",
    quote:
      "I needed a Ventura rack in a big hurry. Laurie worked his magic and the rack was here in less than two days.",
    rating: 5,
    source: "Localsearch",
  },
  {
    id: "r-greg",
    name: "Greg Rangitaawa",
    quote:
      "Laurie and Mick go out of their way to make sure everything is perfect. Fantastic service and great pricing.",
    rating: 5,
    source: "Google",
  },
  {
    id: "r-harry",
    name: "Harry Llove",
    quote:
      "Great friendly guys. They know what they are doing on Harleys and have done wonders on my bike.",
    rating: 5,
    source: "Localsearch",
  },
  {
    id: "r-troy",
    name: "Troy Gibson",
    quote:
      "Great old-school Harley shop. Got all the bits that are hard to find, and fantastic knowledge and service.",
    rating: 5,
    source: "Google",
  },
  {
    id: "r-donny",
    name: "Donny Doodle Dummett",
    quote:
      "I've been going to USA for over 20 years now. The service, advice and price are unbeatable.",
    rating: 5,
    source: "Localsearch",
  },
  {
    id: "r-doug",
    name: "Doug Barr",
    quote: "Brilliant service from Laurie and Mick. My bike was in getting Burleigh highballs fitted.",
    rating: 5,
    source: "Google",
  },
  {
    id: "r-ian",
    name: "Ian Olmate",
    quote: "Bernie blew a braided oil line on the long weekend, but come Tuesday Lozza had us sorted.",
    rating: 5,
    source: "Google",
  },
  {
    id: "r-mitch",
    name: "Mitch",
    quote: "Awesome bike shop. They look after you like no other.",
    rating: 5,
    source: "Localsearch",
  },
  {
    id: "r-mick",
    name: "Mick Knight",
    quote: "Extremely helpful and easy to deal with. Nothing but thumbs up for Laurie and the team.",
    rating: 5,
    source: "Google",
  },
  {
    id: "r-steve",
    name: "Steve",
    quote: "Great service and advice. The bike rode like new.",
    rating: 5,
    source: "Localsearch",
  },
  {
    id: "r-robert",
    name: "Robert Summerill",
    quote: "They found a wiring problem and carried out the extra work without drama. Truly great people.",
    rating: 5,
    source: "Google",
  },
  {
    id: "r4",
    name: "Deon",
    quote: "Great service and advice always.",
    rating: 5,
    source: "Localsearch",
  },
  {
    id: "r-luke",
    name: "Luke Baker",
    quote: "Thanks Laurie and Mick for fitting me in so quick for tyres before my big trip. Highly recommended.",
    rating: 5,
    source: "Google",
  },
  {
    id: "r-gypsy",
    name: "Gypsy",
    quote: "Great people with a wealth of knowledge.",
    rating: 5,
    source: "Localsearch",
  },
  {
    id: "r-marc",
    name: "Marc M",
    quote: "Laurie and Mick are super helpful and offer great advice. So many accessories to choose from.",
    rating: 5,
    source: "Google",
  },
  {
    id: "r-tdjay",
    name: "Tdjay",
    quote: "Laurie is great. Excellent service.",
    rating: 5,
    source: "Localsearch",
  },
  {
    id: "r-neil",
    name: "Neil Mitchell",
    quote: "Good boys, gave great advice.",
    rating: 5,
    source: "Google",
  },
  {
    id: "r-keith",
    name: "Keith",
    quote: "Softail Heritage. The guys at the shop are great with all the extra bells and whistles.",
    rating: 4,
    source: "Localsearch",
  },
  {
    id: "r-nathan",
    name: "Nathan",
    quote: "The most reliable professional outfit I've ever been to. Highly recommended.",
    rating: 4,
    source: "Localsearch",
  },
];

export type BrandLogo = {
  name: string;
  /** Public file named after the brand so the URL carries the name. */
  src: string;
  width: number;
  height: number;
  /** Black artwork, shown white on the ink bar. */
  invert?: boolean;
  /** Shield marks need more height than a wordmark. */
  tall?: boolean;
};

export const brands: BrandLogo[] = [
  { name: "Harley-Davidson", src: "/brands/harley-davidson.png", width: 182, height: 142, tall: true },
  { name: "AMSOIL", src: "/brands/amsoil.png", width: 117, height: 40 },
  { name: "Penrite", src: "/brands/penrite.png", width: 900, height: 142 },
  { name: "Avon", src: "/brands/avon.svg", width: 176, height: 32 },
  { name: "Dunlop", src: "/brands/dunlop.svg", width: 173, height: 37 },
  { name: "Pirelli", src: "/brands/pirelli.svg", width: 800, height: 209 },
  { name: "Kuryakyn", src: "/brands/kuryakyn.png", width: 1036, height: 112 },
  { name: "Arlen Ness", src: "/brands/arlen-ness.png", width: 398, height: 69 },
  { name: "Accel", src: "/brands/accel.svg", width: 1288, height: 413, invert: true },
];

export const discounts: Discount[] = [];

export const categories = ["Apparel", "Gift Cards"];
