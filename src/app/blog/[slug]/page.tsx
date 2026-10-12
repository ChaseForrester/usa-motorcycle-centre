import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareBar } from "@/components/ShareBar";
import { blogPosts, getPost } from "@/lib/blog";
import { SITE_URL, absUrl, pageMeta } from "@/lib/seo";

type Props = { params: { slug: string } };

export function generateStaticParams() {
    return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
    const post = getPost(params.slug);
    if (!post) return pageMeta("Blog", "That story has moved.", "/blog");
    const image = absUrl(post.image);
    const meta = pageMeta(post.title, post.description, `/blog/${post.slug}`, image);
    return {
        ...meta,
        openGraph: { ...meta.openGraph, type: "article" },
    };
}

export default function BlogPostPage({ params }: Props) {
    const post = getPost(params.slug);
    if (!post) notFound();
    const url = `${SITE_URL}/blog/${post.slug}`;
    return (
        <article className="bg-white">
            <div className="bg-[#ECECEC] px-6 py-8">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
                    <Image src={post.image} alt={post.title} fill className="object-contain" priority sizes="(min-width: 768px) 28rem, 100vw" />
                </div>
            </div>
            <div className="container-page max-w-3xl py-12">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C40000]">{post.category}</p>
                <h1 className="display mt-2 max-w-3xl text-4xl text-[#000B58] sm:text-6xl">{post.title}</h1>
                <p className="mt-4 text-sm text-[#000B58]/60">
                    {new Date(post.date).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <p className="mt-4 text-lg leading-relaxed text-[#000B58]">{post.description}</p>
                {post.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)} className="mt-5 leading-relaxed text-[#000B58]/90">
                        {paragraph}
                    </p>
                ))}
                <ShareBar url={url} title={post.title} description={post.description} />
                <p className="mt-8 text-sm">
                    <Link href="/blog" className="font-semibold uppercase tracking-[0.14em] text-[#C40000]">
                        All stories
                    </Link>
                    <span className="mx-3 text-[#000B58]/30">·</span>
                    <Link href="/shop" className="font-semibold uppercase tracking-[0.14em] text-[#000B58]">
                        Shop the rack
                    </Link>
                </p>
            </div>
        </article>
    );
}
