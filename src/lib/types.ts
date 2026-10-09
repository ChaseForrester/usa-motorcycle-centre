export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type DayHours = {
  open: string;
  close: string;
  closed: boolean;
};

export type SiteSettings = {
  brand: {
    name: string;
    legalName: string;
    shortName: string;
    tagline: string;
    slogan: string;
    established: number;
    logo: string;
    logoInvert: boolean;
  };
  colors: {
    accent: string;
    accentSoft: string;
    ink: string;
  };
  contact: {
    phone: string;
    phoneHref: string;
    email: string;
    addressLine: string;
    suburb: string;
    state: string;
    postcode: string;
    country: string;
    mapsUrl: string;
    abn: string;
  };
  hours: Record<DayKey, DayHours>;
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
    tiktok: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  homepage: {
    announcement: string;
    heroKicker: string;
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    heroCta: string;
    heroSecondary: string;
  };
  shipping: {
    clickCollectEnabled: boolean;
    australiaPostEnabled: boolean;
    freeShippingThreshold: number;
    flatRate: number;
    clickCollectLabel: string;
  };
  tax: {
    gstRate: number;
    pricesIncludeGst: boolean;
  };
  features: {
    shop: boolean;
    bookings: boolean;
    events: boolean;
    giftCards: boolean;
    newsletter: boolean;
    reviews: boolean;
  };
  stripe: {
    mode: "test" | "live";
    publishableKey: string;
    connected: boolean;
  };
};

export type ProductVariant = {
  id: string;
  label: string;
  sku: string;
  stock?: number;
  price?: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  description: string;
  price: number;
  compareAt?: number;
  images: string[];
  category: string;
  tags: string[];
  featured: boolean;
  inStock: boolean;
  variants?: ProductVariant[];
  details?: string[];
  brand?: string;
};

export type FulfilmentMethod = "ship" | "collect";

export type FulfilmentStatus =
  | "paid"
  | "labelled"
  | "lodged"
  | "in_transit"
  | "delivered"
  | "exception";

export type Service = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  duration: string;
  fromPrice?: number;
  image: string;
};

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  capacity?: number;
  price?: number;
  ticketed: boolean;
  featured: boolean;
};

export type Review = {
  id: string;
  name: string;
  quote: string;
  rating: number;
  source: string;
};

export type Booking = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  bike: string;
  preferredDate: string;
  notes: string;
  status: "new" | "confirmed" | "delayed" | "complete" | "cancelled";
};

export type Order = {
  id: string;
  createdAt: string;
  email: string;
  name: string;
  phone?: string;
  items: { productId: string; name: string; qty: number; price: number; variant?: string }[];
  fulfillment: "click-collect" | "shipping" | FulfilmentMethod;
  address?: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "paid" | "fulfilled" | "cancelled";
  stripeSessionId?: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  variantId?: string;
  variantLabel?: string;
  category?: string;
  tags?: string[];
};

export type Discount = {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
  minSpend?: number;
};

export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  body: string;
};
