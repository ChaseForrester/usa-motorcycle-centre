"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Shield, Wrench } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/SocialIcons";
import { FlameMark } from "@/components/FlameMark";
import { ProductCard } from "@/components/ProductCard";
import { brands } from "@/lib/seed";
import { useCms } from "@/lib/cms-store";
import { fullAddress, money } from "@/lib/utils";

export default function HomePage() {
  const settings = useCms((s) => s.settings);
  const products = useCms((s) => s.products);
  const services = useCms((s) => s.services);
  const events = useCms((s) => s.events);
  const reviews = useCms((s) => s.reviews);
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const nextEvents = [...events].slice(0, 3);

  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image
          src={settings.homepage.heroImage}
          alt="Custom Harley chopper build at U.S.A. Motorcycle Centre, Albion Park Rail"
          fill
          priority
          className="object-cover object-[center_62%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/50 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/25" />
        <div className="container-page relative flex min-h-[88vh] flex-col justify-end pb-16 pt-28 md:justify-center md:pb-0">
          <p className="label">{settings.homepage.heroKicker}</p>
          <h1 className="display mt-4 max-w-3xl text-5xl text-white sm:text-7xl lg:text-8xl">
            {settings.homepage.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-chrome sm:text-lg">
            {settings.homepage.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn-flame">
              {settings.homepage.heroCta}
            </Link>
            <Link href="/book" className="btn-ghost">
              {settings.homepage.heroSecondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-coal">
        <div className="container-page grid grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
          {[
            { k: "Est.", v: String(settings.brand.established) },
            { k: "Harley® specialist", v: "Independent" },
            { k: "Authorised", v: "AMSOIL reseller" },
            { k: "Rated", v: "4.8 · Illawarra" },
          ].map((item) => (
            <div key={item.k} className="bg-coal px-6 py-8">
              <p className="label">{item.k}</p>
              <p className="display mt-2 text-2xl text-white">{item.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-5">
        {[
          { src: "/workshop/chopper-build.jpg", alt: "Custom Harley on the lift" },
          { src: "/workshop/clutch-job.jpg", alt: "Clutch job" },
          { src: "/workshop/primary-case.jpg", alt: "Primary case" },
          { src: "/workshop/pirelli-rack.jpg", alt: "Pirelli Night Dragon rack" },
          { src: "/workshop/dunlop-rack.jpg", alt: "Dunlop tyre racks" },
        ].map((shot) => (
          <Link
            key={shot.src}
            href="/gallery"
            className="relative aspect-[4/3] overflow-hidden md:aspect-[3/4]"
          >
            <Image src={shot.src} alt={shot.alt} fill className="object-cover transition duration-500 hover:scale-105" />
          </Link>
        ))}
      </section>

      <section className="container-page py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label">The shop wall</p>
            <h2 className="display mt-2 text-4xl text-white sm:text-5xl">Rider gear from the workshop.</h2>
          </div>
          <Link href="/shop" className="btn-ghost">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[420px]">
            <Image
              src="/workshop/clutch-job.jpg"
              alt="Clutch and primary job in the workshop"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center bg-coal px-6 py-16 sm:px-12">
            <p className="label">See Laurie or Mick</p>
            <h2 className="display mt-3 text-4xl text-white sm:text-5xl">
              The workshop that knows the bike.
            </h2>
            <p className="mt-5 max-w-lg text-chrome">
              Smash repairs, computerised diagnostics, electronic balancing, wiring, tyres and the
              custom jobs — ape hangers, pipes, the lot. Independent Harley® specialists for the
              Illawarra since {settings.brand.established}.
            </p>
            <ul className="mt-8 space-y-3">
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
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className="btn-flame">
                Book the lift
              </Link>
              <Link href="/workshop" className="btn-ghost">
                All workshop work
              </Link>
            </div>
          </div>
        </div>
      </section>

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

      <section className="overflow-hidden border-y border-white/10 py-8">
        <div className="marquee flex w-max gap-12 whitespace-nowrap text-steel">
          {[...brands, ...brands].map((b, i) => (
            <span key={i} className="display text-3xl">
              {b}
              <span className="mx-8 text-flame">/</span>
            </span>
          ))}
        </div>
      </section>

      <section className="container-page py-20">
        <p className="label">From the riders</p>
        <h2 className="display mt-2 max-w-2xl text-4xl text-white sm:text-5xl">
          Laurie and Mick went above and beyond.
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.slice(0, 3).map((r) => (
            <blockquote key={r.id} className="card p-6">
              <div className="text-flame">{"★".repeat(r.rating)}</div>
              <p className="mt-4 text-chrome">&ldquo;{r.quote}&rdquo;</p>
              <footer className="mt-6 text-sm">
                <span className="text-white">{r.name}</span>
                <span className="text-steel"> · {r.source}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="container-page pb-8">
        <div className="relative overflow-hidden rounded-sm border border-white/10">
          <Image
            src="/workshop/dunlop-rack.jpg"
            alt="Dunlop tyre wall at U.S.A. Motorcycle Centre"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/70" />
          <div className="relative grid gap-8 p-8 md:grid-cols-2 md:p-14">
            <div>
              <FlameMark className="h-14 w-8 text-flame" />
              <h2 className="display mt-4 text-4xl text-white sm:text-5xl">Come and see us.</h2>
              <p className="mt-4 max-w-md text-chrome">
                Free parking. Wheelchair accessible. The workshop is at {fullAddress(settings)}.
                Call {settings.contact.phone} or book the lift online.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={settings.contact.mapsUrl} className="btn-flame" target="_blank" rel="noreferrer">
                  Get directions
                </a>
                <a href={settings.social.facebook} className="btn-ghost" target="_blank" rel="noreferrer">
                  <FacebookIcon className="h-5 w-5" /> Facebook
                </a>
                <a href={settings.social.instagram} className="btn-ghost" target="_blank" rel="noreferrer">
                  <InstagramIcon className="h-5 w-5" /> Instagram
                </a>
              </div>
            </div>
            <div className="flex items-end justify-end">
              <div className="flex items-center gap-3 rounded-sm border border-white/15 bg-ink/70 px-5 py-4">
                <Shield className="h-8 w-8 text-flame" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-steel">Independent</p>
                  <p className="font-display text-xl uppercase text-white">Harley® specialist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
