"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, CircleDot, Cog, Shirt, Wrench, Zap } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/SocialIcons";
import { FlameMark } from "@/components/FlameMark";
import { ProductCard } from "@/components/ProductCard";
import { BrandMark } from "@/components/BrandMark";
import { brands } from "@/lib/seed";
import { useCms } from "@/lib/cms-store";
import { fullAddress, mailHref, money, telHref } from "@/lib/utils";
import { FaqList } from "@/components/FaqList";
import { GiftCardMotion } from "@/components/GiftCardMotion";
import { SERVICE_TOWNS } from "@/lib/seo";

function HeroTitle({ title }: { title: string }) {
  const at = title.toLowerCase().indexOf(" is ");
  if (at === -1) return <>{title}</>;
  return (
    <>
      {title.slice(0, at)}
      <br />
      {title.slice(at + 1)}
    </>
  );
}

export default function HomePage() {
  const settings = useCms((s) => s.settings);
  const products = useCms((s) => s.products);
  const services = useCms((s) => s.services);
  const events = useCms((s) => s.events);
  const reviews = useCms((s) => s.reviews);
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const gearOrder = [
    "usa-mcc-flame-crew-grey",
    "usa-mcc-flame-hoodie-black",
    "usa-mcc-flame-crew-black",
  ];
  const rack = gearOrder
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const gear = rack.length ? rack : featured;
  const nextEvents = [...events].slice(0, 3);
  const lanes = [
    { href: "/workshop#harley-service-tuning", label: "Service & tuning", icon: Cog },
    { href: "/workshop#tyres-alignment-balancing", label: "Tyres & alignment", icon: CircleDot },
    { href: "/workshop#electrical-repairs-wiring", label: "Electrical & wiring", icon: Zap },
    { href: "/shop", label: "Rider gear", icon: Shirt },
  ];
  const floor = [
    { src: "/workshop/chopper-build.jpg", alt: "Custom Harley on the lift" },
    { src: "/workshop/clutch-job.jpg", alt: "Clutch job" },
    { src: "/workshop/primary-case.jpg", alt: "Primary case" },
    { src: "/workshop/pirelli-rack.jpg", alt: "Pirelli Night Dragon rack" },
    { src: "/workshop/dunlop-rack.jpg", alt: "Dunlop tyre racks" },
  ];

  const harley = brands.find((brand) => brand.name === "Harley-Davidson");

  useEffect(() => {
    document.documentElement.classList.add("home-snap");
    return () => document.documentElement.classList.remove("home-snap");
  }, []);

  return (
    <div className="max-lg:overflow-x-clip" dir="ltr">
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.classList.add('home-snap')",
        }}
      />
      <section className="m-panel relative bg-ink text-left lg:hidden">
        <Image
          src="/workshop/chopper-build.jpg"
          alt=""
          fill
          priority
          className="hero-photo object-cover object-[78%_center]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/88 to-ink/25" />
        <div className="relative px-5">
          <div className="glass-panel max-w-[19rem] rounded-md px-4 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-flame">
              Built in the workshop. Serviced since {settings.brand.established}.
            </p>
            <h1 className="display mt-3 text-[2.6rem] text-white">
              Book the bike.
              <br />
              <span className="text-flame">Ride it right.</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-chrome">
              Independent Harley® specialist. Service, tuning, tyres, electrical and smash repairs. Albion Park Rail.
            </p>
            <Link href="/book" className="btn-flame mt-6 !rounded-md">
              Book a service <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="m-panel bg-ink px-5 text-left lg:hidden" aria-label="Workshop lanes">
        <p className="label">From the workshop</p>
        <h2 className="display mt-2 text-3xl text-white">What we do.</h2>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {lanes.map((lane) => {
            const Icon = lane.icon;
            return (
              <Link
                key={lane.href}
                href={lane.href}
                className="flex items-center gap-3 rounded-md border border-white/10 bg-coal px-3 py-4 text-left"
              >
                <Icon className="h-6 w-6 shrink-0 text-white" strokeWidth={1.6} />
                <span className="text-[12px] font-semibold uppercase leading-tight tracking-[0.06em] text-chrome">
                  {lane.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="m-panel bg-ink px-5 text-left lg:hidden" aria-label="Featured gear">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">Featured gear</h2>
          <Link href="/shop" className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-chrome">
            View all <ArrowRight className="inline h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {gear.map((p) => (
            <Link
              key={p.id}
              href={`/shop/${p.slug}`}
              className="min-w-0 overflow-hidden rounded-md border border-white/10 bg-coal text-left"
            >
              <div className="relative h-[28vh] bg-[#d5d3cf]">
                <Image
                  src={p.images[0] || "/brand/icon.png"}
                  alt={p.name}
                  fill
                  className="object-cover object-top"
                  sizes="33vw"
                />
              </div>
              <div className="px-2 py-2.5">
                <h3 className="text-[11px] font-medium leading-tight text-white">
                  U.S.A.
                  <br />
                  Motorcycle Centre
                </h3>
                <p className="mt-1.5 text-sm font-semibold text-flame">
                  {new Intl.NumberFormat("en-AU", {
                    style: "currency",
                    currency: "AUD",
                    maximumFractionDigits: 0,
                  }).format(p.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="m-panel relative bg-ink text-left lg:hidden">
        <Image
          src="/products/hoodie-black-front.jpg"
          alt=""
          fill
          className="object-cover object-right"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
        <div className="relative px-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-chrome">Gear up</p>
          <h2 className="display mt-2 text-4xl text-white">
            Flame crew
            <br />& hoodie
          </h2>
          <Link href="/shop" className="btn-flame mt-6 !rounded-md">
            Shop the shirts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="m-panel bg-ink px-5 text-left lg:hidden" aria-label="Workshop floor">
        <p className="label">On the floor</p>
        <h2 className="display mt-2 text-3xl text-white">The workshop floor.</h2>
        <div className="mt-5 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {floor.map((shot) => (
            <Link key={shot.src} href="/gallery" className="relative h-[42vh] w-[68vw] shrink-0 overflow-hidden rounded-md">
              <Image src={shot.src} alt={shot.alt} fill className="object-cover" sizes="70vw" />
            </Link>
          ))}
        </div>
      </section>

      <section className="relative hidden min-h-[calc(100svh-7.5rem)] overflow-hidden bg-ink lg:block">
        <Image
          src={settings.homepage.heroImage}
          alt="U.S.A. Motorcycle Centre shop floor at 8 Miall Way, Albion Park Rail"
          fill
          priority
          className="hero-photo object-cover object-[68%_center]"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/20 to-transparent" />
        <div className="container-page relative z-10 flex min-h-[calc(100svh-7.5rem)] items-center pb-24 pt-6">
          <div className="glass-panel rise w-max max-w-full rounded-lg px-7 py-7 xl:px-9 xl:py-8">
            <p className="rise rise-1 label">{settings.homepage.heroKicker}</p>
            <h1 className="rise rise-2 display mt-3 text-[clamp(3.15rem,6.1vw,6.35rem)] font-bold leading-[0.86] text-white">
              <HeroTitle title={settings.homepage.heroTitle} />
            </h1>
            <p className="rise rise-3 mt-5 max-w-xl text-[15px] leading-relaxed text-paper/90 xl:text-base">
              {settings.homepage.heroSubtitle}
            </p>
            <div className="rise rise-4 mt-7 flex flex-wrap gap-3">
              <Link href="/book" className="btn-flame !rounded-md">
                Book a service
              </Link>
              <Link href="/shop" className="btn-ghost !rounded-md !border-white/75">
                Shop the clothing
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-bar absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-ink/78 backdrop-blur-md">
          <div className="container-page grid grid-cols-4 divide-x divide-white/10">
            {[
              `Est. ${settings.brand.established}`,
              "Harley® specialist",
              "Independent workshop",
              "Rated 4.8 · Illawarra",
            ].map((item) => (
              <p
                key={item}
                className="px-3 py-5 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white xl:text-xs xl:tracking-[0.18em]"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="hidden lg:grid lg:grid-cols-5">
        {floor.map((shot, i) => (
          <Link
            key={shot.src}
            href="/gallery"
            className="group relative aspect-[4/3] overflow-hidden md:aspect-[3/4]"
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              className="photo-in object-cover transition duration-700 group-hover:scale-105"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          </Link>
        ))}
      </section>

      <section className="container-page hidden py-20 lg:block">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label">The shirts</p>
            <h2 className="display mt-2 text-4xl text-white sm:text-5xl">Workshop print, on the rack.</h2>
          </div>
          <Link href="/shop" className="btn-ghost">
            All shirts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(featured.length ? featured : products.filter((p) => p.category !== "Gift Cards"))
            .slice(0, 3)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>

      <section className="m-panel container-page text-left max-lg:justify-center max-lg:px-5 lg:block lg:pb-20">
        <div className="min-w-0 overflow-hidden rounded-sm border border-white/10 lg:grid lg:grid-cols-2 lg:items-center">
          <div className="relative h-40 bg-ash lg:h-auto lg:min-h-[260px]">
            <GiftCardMotion />
          </div>
          <div className="min-w-0 bg-coal px-5 py-5 text-left sm:px-12 lg:py-12">
            <p className="label">Gift cards</p>
            <h2 className="display mt-2 text-4xl leading-none text-white lg:text-5xl lg:leading-[0.92]">
              $100 to $5,000.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-chrome lg:mt-4 lg:text-base">
              Put it toward a service, smash work, tyres or a shirt. Any amount from a hundred to five
              thousand.
            </p>
            <Link href="/gift-cards" className="btn-flame mt-5 whitespace-nowrap lg:mt-8">
              Buy a gift card
            </Link>
          </div>
        </div>
      </section>

      <section className="m-panel relative lg:block lg:h-auto lg:max-h-none lg:min-h-0 lg:overflow-visible">
        <div className="grid h-full lg:h-auto lg:grid-cols-2">
          <div className="relative min-h-[420px] max-lg:absolute max-lg:inset-0 max-lg:min-h-0">
            <Image
              src="/workshop/clutch-job.jpg"
              alt="Clutch and primary job in the workshop"
              fill
              className="object-cover max-lg:object-[72%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/88 to-ink/25 lg:hidden" />
          </div>
          <div className="relative flex h-full flex-col justify-center px-5 py-4 text-left max-lg:max-w-[19rem] max-lg:bg-transparent sm:px-12 lg:bg-coal lg:py-16">
            <p className="label">See Laurie or Mick</p>
            <h2 className="display mt-2 text-[1.7rem] leading-none text-white lg:mt-3 lg:text-5xl lg:leading-[0.92]">
              The workshop that knows the bike.
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-snug text-chrome lg:mt-5 lg:text-base lg:leading-relaxed">
              Smash repairs, computerised diagnostics, electronic balancing, wiring, tyres and the
              custom jobs — ape hangers, pipes, the lot. Independent Harley® specialists for the
              Illawarra since {settings.brand.established}.
            </p>
            <ul className="mt-3 space-y-1.5 lg:mt-8 lg:space-y-3">
              {services.slice(0, 4).map((s) => (
                <li key={s.id} className="flex items-start gap-3 text-sm text-paper">
                  <Wrench className="mt-0.5 h-4 w-4 text-flame" />
                  <span>
                    <span className="font-semibold">{s.name}</span>
                    {s.fromPrice ? ` · from ${money(s.fromPrice)}` : ""}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2 lg:mt-8 lg:gap-3">
              <Link href="/book" className="btn-flame max-lg:!px-4 max-lg:!py-2.5 max-lg:text-[11px]">
                Book the lift
              </Link>
              <Link href="/workshop" className="btn-ghost max-lg:!px-4 max-lg:!py-2.5 max-lg:text-[11px]">
                All workshop work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {nextEvents.length > 0 && (
        <section className="container-page py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="label">On the calendar</p>
              <h2 className="display mt-2 text-4xl text-white sm:text-5xl">Rides, balls and Saturday mornings.</h2>
            </div>
            <Link href="/events" className="btn-ghost">
              All events
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {nextEvents.map((e) => (
              <Link key={e.id} href={`/events/${e.slug}`} className="card group">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={e.image}
                    alt={e.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-flame">
                    <Calendar className="h-3.5 w-3.5" />
                    {e.date} · {e.time}
                  </p>
                  <h3 className="display mt-2 text-2xl text-white">{e.title}</h3>
                  <p className="mt-2 text-sm text-steel">{e.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="m-panel bg-ink text-left lg:hidden" aria-label="Brands">
        <div className="px-5">
          <p className="label">On the rack</p>
          <h2 className="display mt-2 text-3xl text-white">Names we fit.</h2>
        </div>
        <div className="brand-carousel mt-8 overflow-hidden">
          <ul className="marquee flex w-max items-center">
            {[...brands, ...brands].map((brand, i) => (
              <li
                key={`${brand.name}-${i}`}
                className="flex h-16 items-center px-5"
                aria-hidden={i >= brands.length || undefined}
              >
                <BrandMark
                  brand={brand}
                  className={brand.tall ? "h-14" : "h-9"}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hidden overflow-hidden border-y border-white/10 py-8 lg:block" aria-label="Brands we fit">
        <div className="marquee flex w-max items-center">
          {[...brands, ...brands].map((brand, i) => (
            <span key={`${brand.name}-${i}`} className="flex h-16 items-center" aria-hidden={i >= brands.length || undefined}>
              <BrandMark
                brand={brand}
                className={brand.tall ? "h-14" : "h-8"}
              />
              <span className="mx-8 flex h-8 items-center font-display text-3xl leading-none text-flame" aria-hidden="true">/</span>
            </span>
          ))}
        </div>
      </section>

      <section className="m-panel border-y border-white/10 bg-coal text-left max-lg:justify-center lg:block lg:h-auto lg:max-h-none lg:py-10">
        <div className="container-page">
          <p className="label">Harley specialist for the corridor</p>
          <h2 className="display mt-2 text-3xl text-white sm:text-4xl">
            Wollongong to Nowra.
          </h2>
          <p className="mt-4 max-w-2xl text-chrome">
            Independent Harley® workshop at Albion Park Rail. Riders roll in from the Illawarra and
            the Shoalhaven — service, smash repairs, tyres and parts without a dealer markup on the
            conversation.
          </p>
          <p className="mt-6 flex flex-wrap gap-x-3 gap-y-2 text-left text-sm uppercase tracking-[0.12em] text-steel">
            {SERVICE_TOWNS.map((town) => (
              <span key={town}>{town}</span>
            ))}
          </p>
        </div>
      </section>

      <section className="m-panel container-page text-left max-lg:justify-center max-lg:px-5 lg:block lg:h-auto lg:max-h-none lg:py-20">
        <p className="label">From the riders</p>
        <h2 className="display mt-2 max-w-2xl text-3xl text-white lg:text-5xl">
          Laurie and Mick went above and beyond.
        </h2>
        <div className="mt-5 flex gap-3 overflow-x-auto lg:mt-10 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {reviews.slice(0, 3).map((r) => (
            <blockquote key={r.id} className="card w-[78vw] shrink-0 p-5 text-left lg:w-auto lg:p-6">
              <div className="text-flame">{"★".repeat(r.rating)}</div>
              <p className="mt-3 line-clamp-5 text-sm text-chrome lg:mt-4 lg:line-clamp-none lg:text-base">&ldquo;{r.quote}&rdquo;</p>
              <p className="mt-6 text-sm">
                <span className="text-white">{r.name}</span>
                <span className="text-steel"> · {r.source}</span>
              </p>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="m-panel container-page text-left max-lg:justify-center max-lg:px-5 lg:block lg:h-auto lg:max-h-none lg:overflow-visible lg:py-20">
        <p className="label">Asked on the phone</p>
        <h2 className="display mt-2 max-w-3xl text-3xl text-white lg:text-5xl">
          Straight answers for Wollongong to Nowra.
        </h2>
        <div className="mt-4 lg:mt-10">
          <div className="m-faq lg:hidden">
            <FaqList limit={3} dense />
          </div>
          <div className="hidden lg:block">
            <FaqList />
          </div>
        </div>
        <Link href="/faq" className="btn-ghost mt-4 inline-flex lg:mt-8">
          Full FAQ
        </Link>
      </section>

      <section className="m-panel container-page text-left max-lg:justify-center max-lg:px-5 lg:block lg:h-auto lg:max-h-none lg:pb-8">
        <div className="relative flex h-full min-h-0 min-w-0 flex-col justify-center overflow-hidden rounded-sm border border-white/10 lg:block lg:h-auto lg:min-h-[420px]">
          <Image
            src="/workshop/dunlop-rack.jpg"
            alt="Dunlop tyre wall at U.S.A. Motorcycle Centre"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/75" />
          <div className="relative min-w-0 max-w-full py-2 lg:p-14">
            <FlameMark className="h-8 w-5 text-flame lg:h-14 lg:w-8" />
            <h2 className="display mt-2 max-w-full text-[2rem] leading-[0.95] text-white lg:mt-4 lg:text-5xl">
              <span className="lg:hidden">
                Come and
                <br />
                see us.
              </span>
              <span className="hidden lg:inline">Come and see us.</span>
            </h2>
            <p className="mt-3 max-w-full text-sm leading-snug text-chrome [overflow-wrap:anywhere] lg:mt-4 lg:max-w-md lg:text-base lg:leading-relaxed">
              Free parking. Wheelchair accessible. The workshop is at {fullAddress(settings)}.
            </p>
            <p className="mt-3 flex max-w-full flex-col gap-1 text-sm leading-snug lg:flex-row lg:items-baseline lg:gap-0">
              <a href={telHref(settings.contact.phone)} className="contact-link text-white">
                {settings.contact.phone}
              </a>
              <span className="mx-1 hidden text-chrome lg:inline">·</span>
              <a
                href={mailHref(settings.contact.email)}
                className="contact-link block max-w-full whitespace-nowrap text-[clamp(11px,3.15vw,14px)] text-white lg:inline lg:whitespace-normal lg:text-sm"
              >
                {settings.contact.email}
              </a>
            </p>
            <div className="mt-4 flex flex-wrap gap-2 lg:mt-6 lg:gap-3">
              <a
                href={settings.contact.mapsUrl}
                className="btn-flame whitespace-nowrap px-4 py-2.5 text-[11px] tracking-[0.14em] lg:px-6 lg:py-3 lg:text-sm lg:tracking-[0.18em]"
                target="_blank"
                rel="noreferrer"
              >
                Get directions
              </a>
              <a
                href={settings.social.facebook}
                className="btn-ghost whitespace-nowrap px-4 py-2.5 text-[11px] tracking-[0.14em] lg:px-6 lg:py-3 lg:text-sm lg:tracking-[0.18em]"
                target="_blank"
                rel="noreferrer"
              >
                <FacebookIcon className="h-4 w-4" /> Facebook
              </a>
              <a
                href={settings.social.instagram}
                className="btn-ghost whitespace-nowrap px-4 py-2.5 text-[11px] tracking-[0.14em] lg:px-6 lg:py-3 lg:text-sm lg:tracking-[0.18em]"
                target="_blank"
                rel="noreferrer"
              >
                <InstagramIcon className="h-4 w-4" /> Instagram
              </a>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-steel lg:hidden">
              {harley && <BrandMark brand={harley} className="h-7" />}
              Independent <span className="text-white">Harley® specialist</span>
            </p>
          </div>
          <div className="absolute bottom-8 right-8 hidden items-center gap-3 rounded-sm border border-white/15 bg-ink/70 px-5 py-4 lg:flex">
            {harley && <BrandMark brand={harley} className="h-12" />}
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-steel">Independent</p>
              <p className="font-display text-xl uppercase text-white">Harley® specialist</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
