export type ShareTarget = {
    id: string;
    label: string;
    href: string;
};

export function shareTargets(url: string, title: string, description: string): ShareTarget[] {
    const text = `${title}. ${description}`;
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(title);
    const d = encodeURIComponent(text);
    const both = encodeURIComponent(`${text} ${url}`);
    return [
        { id: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
        { id: "instagram", label: "Instagram", href: "https://www.instagram.com/usa.motorcycle.centre/" },
        { id: "x", label: "X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
        { id: "threads", label: "Threads", href: `https://www.threads.net/intent/post?text=${both}` },
        { id: "linkedin", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
        { id: "pinterest", label: "Pinterest", href: `https://pinterest.com/pin/create/button/?url=${u}&description=${d}` },
        { id: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${both}` },
        { id: "telegram", label: "Telegram", href: `https://t.me/share/url?url=${u}&text=${t}` },
        { id: "reddit", label: "Reddit", href: `https://www.reddit.com/submit?url=${u}&title=${t}` },
        { id: "bluesky", label: "Bluesky", href: `https://bsky.app/intent/compose?text=${both}` },
        { id: "tumblr", label: "Tumblr", href: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${u}&title=${t}&caption=${d}` },
        { id: "email", label: "Email", href: `mailto:?subject=${t}&body=${d}%0A%0A${u}` },
        { id: "sms", label: "Messages", href: `sms:?&body=${both}` },
    ];
}
