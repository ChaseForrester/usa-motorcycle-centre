import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
    "Blog",
    "Stories from the U.S.A. Motorcycle Centre rack. The flame hoodie, the crews, and how click and collect works.",
    "/blog"
);

export default function BlogPage() {
    return (
        <div className="bg-white">
            <section className="bg-ink">
                <div className="container-page py-16">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FF6262]">The blog</p>
                    <h1 className="display mt-3 text-5xl text-white sm:text-6xl">Shirts, jumpers, and the rack.</h1>
                    <p className="mt-4 max-w-xl text-white/80">
                        How the Harley gear is printed, what each piece is for, and how to collect it from Albion Park Rail.
                    </p>
                </div>
            </section>
            <section className="container-page grid gap-6 py-14 md:grid-cols-3">
                {blogPosts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group overflow-hidden bg-white shadow-[0_16px_40px_rgba(0,11,88,0.12)]">
                        <div className="relative aspect-[4/3] bg-[#ECECEC]">
                            <Image src={post.image} alt="" fill className="object-contain transition duration-500 group-hover:scale-[1.03]" sizes="(min-width: 768px) 30vw, 100vw" />
                        </div>
                        <div className="border-t-4 border-[#FF1414] p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C40000]">{post.category}</p>
                            <h2 className="mt-2 font-display text-2xl uppercase leading-none text-[#000B58]">{post.title}</h2>
                            <p className="mt-3 text-sm leading-relaxed text-[#000B58]/80">{post.description}</p>
                        </div>
                    </Link>
                ))}
            </section>
        </div>
    );
}
