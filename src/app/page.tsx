"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { SourceMark } from "@/components/ReviewCarousel";
import { blogPosts } from "@/lib/blog";
import { useCms } from "@/lib/cms-store";
import { money, telHref } from "@/lib/utils";

const featuredSources = ["Yellow Pages", "Localsearch", "Google"];

const lanes = [
  { href: "/shop?cat=Shirts", label: "Shirts" },
  { href: "/shop?cat=Jumpers", label: "Jumpers" },
  { href: "/about", label: "The workshop" },
  { href: "/blog", label: "Stories" },
  { href: "/contact", label: "The counter" },
];

export default function HomePage() {
  const flagRef = useRef<HTMLVideoElement>(null);
  const products = useCms((s) => s.products);
  const reviews = useCms((s) => s.reviews);
  const phone = useCms((s) => s.settings.contact.phone);
  const gear = products.filter((p) => p.category === "Shirts" || p.category === "Jumpers");
  const quotes = featuredSources
    .map((source) => reviews.find((review) => review.source === source))
    .filter((review) => review != null);

  useEffect(() => {
    const video = flagRef.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (motion.matches) video.pause();
      else video.play().catch(() => { });
    };
    apply();
    motion.addEventListener("change", apply);
    return () => motion.removeEventListener("change", apply);
  }, []);

  return (
    <div className="relative overflow-hidden bg-ink text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-0 h-[640px] w-[46%] opacity-50"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1.35px, transparent 1.6px)",
          backgroundSize: "16px 16px",
          maskImage: "radial-gradient(circle at 75% 18%, #000 10%, transparent 68%)",
          WebkitMaskImage: "radial-gradient(circle at 75% 18%, #000 10%, transparent 68%)",
        }}
      />

      <section className="relative overflow-hidden">
        <div className="flag-field pointer-events-none absolute inset-0" aria-hidden>
          <video
            ref={flagRef}
            className="flag-wave h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/brand/us-flag-still.jpg?v=american"
            src="/brand/us-flag.mp4?v=american"
          />
          <img src="/brand/us-flag-still.jpg?v=american" alt="" className="flag-still h-full w-full object-cover" />
          <div className="flag-scrim absolute inset-0" />
        </div>
        <div className="container-page relative py-12 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
              What we do here
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {lanes.map((lane) => (
                <Link
                  key={lane.href}
                  href={lane.href}
                  className="inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/5 px-3 text-xs font-medium text-white/90 hover:border-[#FF1414]"
                >
                  {lane.label}
                </Link>
              ))}
              <a
                href={telHref(phone)}
                className="inline-flex min-h-11 items-center rounded-full border border-[#FF1414]/50 bg-[#FF1414]/15 px-3 text-xs font-medium text-white hover:bg-[#C40000]"
              >
                Book in
              </a>
            </div>
            <span className="mt-8 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]">
              <span className="h-2 w-2 rounded-[2px] bg-[#FF1414]" />
              Harley · Est. 1992
            </span>
            <h1 className="display mt-4 text-5xl text-white sm:text-6xl lg:text-7xl">
              Harley, rubber
              <br />
              &amp; the rack.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              Independent Harley workshop in Albion Park Rail. The bike is booked by phone. The shirts and jumpers are on the rack.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex min-h-11 items-center rounded-lg bg-[#C40000] px-5 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(196,0,0,0.35)] hover:bg-[#8E0000]"
              >
                Shop the rack
              </Link>
              <a
                href={telHref(phone)}
                className="inline-flex min-h-11 items-center rounded-lg border border-white/20 px-5 text-sm font-semibold text-white hover:border-[#FF1414]"
              >
                Call {phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-16">
        <h2 className="display text-3xl sm:text-4xl">The rack.</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
          Three pieces. The flame hoodie and the two crews, printed with the shop crest.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {gear.map((product) => (
            <Link key={product.id} href={`/shop/${product.slug}`} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#ECECEC]">
                <Image
                  src={product.images[0] || "/brand/icon.png"}
                  alt={product.name}
                  fill
                  className="object-contain transition duration-500 group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 28vw, 100vw"
                />
              </div>
              <p className="mt-3 font-semibold">{product.name}</p>
              <p className="text-sm text-white/60">
                {product.category} · {money(product.price)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative mb-16 h-[58vh] min-h-[380px] overflow-hidden sm:h-[70vh]">
        <Image
          src="/brand/street-harley.jpg"
          alt="Black Harley in low workshop light"
          fill
          className="object-cover object-[center_42%]"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/25" aria-hidden />
        <div className="container-page relative flex h-full items-end pb-8 sm:pb-12">
          <p className="max-w-md text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
            The bike comes in. The work stays on the floor.
          </p>
        </div>
      </section>

      <section className="container-page pb-16">
        <h2 className="display text-3xl sm:text-4xl">
          Why riders come back
          <span className="mt-1 block text-[#FF6262]">to the shop.</span>
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {quotes.map((review) => (
            <article key={review.id} className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#001039] p-5">
              <div className="flex items-center justify-between gap-3">
                <SourceMark source={review.source} large onDark />
                <p className="text-sm tracking-[0.2em] text-[#FF6262]" aria-label={`${review.rating} stars`}>
                  {"★".repeat(review.rating)}
                </p>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-white/80">&ldquo;{review.quote}&rdquo;</p>
              <p className="mt-4 font-semibold">{review.name}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page grid gap-5 pb-16 lg:grid-cols-2">
        <div className="relative min-h-72 overflow-hidden rounded-3xl">
          <Image
            src="/workshop/primary-case.jpg"
            alt="Harley primary open on the bench"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
          <span className="absolute left-4 top-4 rounded-md bg-ink/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]">
            On the bench
          </span>
        </div>
        <div className="rounded-3xl bg-[#001039] p-7 sm:p-9">
          <h2 className="display text-3xl">About the shop.</h2>
          <p className="mt-4 leading-relaxed text-white/75">
            U.S.A. Motorcycle Centre has looked after Harley riders across the Illawarra since 1992. Smash, diagnostics, tyres, electrical and custom work stay in the workshop.
          </p>
          <p className="mt-4 leading-relaxed text-white/75">
            We are independent. Not a dealer. The online shop is the flame hoodie and the two crews. Tyres and parts stay on the floor.
          </p>
          <Link href="/about" className="mt-6 inline-flex text-sm font-semibold text-white/90 hover:text-[#FF6262]">
            Read more →
          </Link>
        </div>
      </section>

      <section className="container-page grid items-stretch gap-5 pb-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl bg-[#001039] p-7 sm:p-9">
          <h2 className="display text-3xl">Our values.</h2>
          <p className="mt-4 leading-relaxed text-white/75">
            The crest on the shirt is the shop’s own mark, with EST 1992 and the phone number on the back. It is not a licensed Harley-Davidson range.
          </p>
          <p className="mt-4 leading-relaxed text-white/75">
            Book the bike by calling {phone}. Collect a shirt from 8 Miall Way, Monday to Friday 8am–5pm and Saturday 8am–12pm.
          </p>
          <a href={telHref(phone)} className="mt-6 inline-flex text-sm font-semibold hover:text-[#FF6262]">
            Call to book in →
          </a>
        </div>
        <div className="relative min-h-64 overflow-hidden rounded-3xl">
          <Image
            src="/workshop/dunlop-rack.jpg"
            alt="Dunlop tyres on the rack at the shop"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 36vw, 100vw"
          />
          <span className="absolute right-4 top-4 rounded-md bg-ink/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]">
            Tyres
          </span>
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="display text-3xl sm:text-4xl">From the shop.</h2>
          <Link href="/blog" className="text-sm font-semibold text-white/80 hover:text-[#FF6262]">
            All stories
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-3xl bg-[#001039]">
              <div className="relative aspect-[16/10]">
                <Image src={post.image} alt="" fill className="object-contain bg-[#ECECEC] transition duration-500 group-hover:scale-[1.03]" sizes="(min-width: 768px) 30vw, 100vw" />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FF6262]">{post.category}</p>
                <h3 className="mt-2 font-display text-2xl uppercase leading-none">{post.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src="/brand/cement-harley.jpg"
            alt=""
            fill
            className="object-cover object-[18%_center] sm:scale-x-[-1] sm:object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/72 sm:bg-gradient-to-r sm:from-ink sm:via-ink/78 sm:to-ink/40" />
        </div>
        <div className="container-page relative py-20 sm:py-24">
          <h2 className="display text-4xl text-white sm:text-5xl">Get the bike in.</h2>
          <p className="mt-4 max-w-md leading-relaxed text-white/80">
            Call the shop and book it. Or order the hoodie and the crews and collect them from the counter.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={telHref(phone)}
              className="inline-flex min-h-11 items-center rounded-lg bg-[#C40000] px-5 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(196,0,0,0.35)] hover:bg-[#8E0000]"
            >
              Call to book in
            </a>
            <Link href="/shop" className="inline-flex min-h-11 items-center rounded-lg border border-white/25 px-5 text-sm font-semibold text-white hover:border-[#FF6262]">
              Shop the rack
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
