# U.S.A. Motorcycle Centre

E-commerce and workshop site for **U.S.A. Motorcycle Centre** — Harley® specialist repair shop at 8 Miall Way, Albion Park Rail NSW, est. 1992.

Phone: **(02) 4257 2333**  
Facebook: [USA.MOTORCYCLE.CENTRE](https://www.facebook.com/USA.MOTORCYCLE.CENTRE/)

One Next.js app on Vercel, one Firebase project, many tenants. The first tenant is U.S.A. Motorcycle Centre on usamotorcyclecentre.com.au. The host header selects the tenant. Do not fork a repo per shop.

The storefront, Super Admin dispatch board, service bookings, events, gift cards and Stripe checkout all run from this codebase. Stripe and Australia Post secrets live in Firebase secret config (`STRIPE_SECRET_KEY`, `AUSPOST_API_KEY`). They are never committed. The browser never calls those secret endpoints.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3005](http://localhost:3005) (or `next dev` default 3000). Localhost maps to the USA MCC tenant.

### Super Admin (shop)

- URL: `/admin`
- Shop Super Admin: `usa_motorcycle_centre@yahoo.com.au` (password is `WORKSHOP_ADMIN_PASSWORD` on the server, not the Yahoo mailbox password)
- Tech Aid login still works: `hello@techaidaustralia.com.au`
- Dispatch cards: Paid, To print, In transit, Delivered, Collect, Exception
- Print opens the stored 100×150 mm PDF. Lodged is the only status the shop presses. Paste an article id until the carrier key exists.

### Buyer account

- URL: `/account`
- Demo: `rider@example.com`
- Ship shows label booked, then the tracking link. Collect is ready at 8 Miall Way. No label.

### Platform admin (Tech Aid)

- URL: `/platform`
- Default login: `platform@techaid.local` / `PlatformAdmin1992!`
- Lists tenants and failed labels. No card numbers. No label printing.

## Stripe and Australia Post

Super Admin → **Stripe** stores the publishable key and Stripe account id on the tenant. Put `STRIPE_SECRET_KEY` and `AUSPOST_API_KEY` in Firebase secret config for the Cloud Functions in `functions/`. Checkout, labels and lodgement run there.

Until those secrets exist, checkout and labels run as stubs so the screens still work.

Currency is **AUD**. Prices include GST. Ship or collect at 8 Miall Way. International checkout collects country, description, quantity, value AUD, weight and HS code, and shows a GST duty estimate before pay. Oils, aerosols, loose lithium, tyres and whole bikes are collect or a human freight quote.

## Firebase

1. Create a project at [Firebase console](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password), **Firestore**, **Storage**
3. Deploy rules: `npx firebase deploy --only firestore:rules,storage`
4. Paste the web app config into `.env.local`
5. Optional: set a custom claim `admin: true` on the Super Admin user

The catalogue already works without Firebase (saved in the browser via Super Admin). Connect Firebase when you want the same data on every device and a server-side source of truth.

## What is on the site

- Shop: flame hoodie and crews from the real merch, helmets, tyres, AMSOIL/Penrite, batteries, bars, gift cards
- Workshop bookings: Harley service, smash repairs, tyres, electrical, customising, diagnostics
- Events: Bikers 4 Heroes Masquerade Ball, Saturday mornings, spring service month
- Gallery, about, contact, map, Facebook and Instagram
- Super Admin CMS for every public string, product and event

Independent workshop — not an authorised Harley-Davidson dealer.

## Deploy

Vercel is the fastest path: import the repo, add env vars, deploy. Point the Stripe webhook at the production URL.
