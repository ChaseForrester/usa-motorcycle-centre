export type BlogPost = {
    slug: string;
    title: string;
    description: string;
    date: string;
    category: "Shirts" | "Jumpers" | "The rack";
    image: string;
    body: string[];
};

export const blogPosts: BlogPost[] = [
    {
        slug: "flame-hoodie-the-workshop-jumper",
        title: "The flame hoodie is the workshop jumper",
        description:
            "Heavy black fleece, the EST 1992 shield on the chest, and the full workshop crest across the back. The jumper the shop actually wears.",
        date: "2026-09-12",
        category: "Jumpers",
        image: "/products/hoodie-black-front.jpg",
        body: [
            "The black flame hoodie is the piece that started the rack. Heavy fleece, the U.S.A. Motorcycle Centre shield on the chest with EST 1992 under it, and the full workshop crest across the back, phone number and all.",
            "Both sleeves carry the flame down to a cuff badge. It is cut as a jumper you can wear on the bike in the morning and in the shop after the ride, not a fashion hoodie that falls apart at the wash.",
            "Sizes run S to 3XL. Click and collect it from 8 Miall Way, Albion Park Rail, or have Australia Post bring it. $119, GST included.",
        ],
    },
    {
        slug: "black-crew-and-grey-marle",
        title: "Two crews, one back print",
        description:
            "The black crew and the grey marle crew share the original shop back print. Here is how they differ on the rack.",
        date: "2026-09-20",
        category: "Shirts",
        image: "/products/crew-black-back.jpg",
        body: [
            "Both crews wear the same back: the shield, the original slogan, the workshop lines and PH 4257 2333, sitting over the flame artwork. Sleeve flames and cuff badges match the jumper.",
            "The black crew is the louder of the two. The grey marle keeps the shield in black on a lighter body, which is the one most of the weekday regulars grab.",
            "Each crew is $89. Same size run as the jumper, S to 3XL. If you are between sizes, take the larger one. The print sits better when the shirt is not stretched across the shoulders.",
        ],
    },
    {
        slug: "click-and-collect-the-rack",
        title: "Click and collect the rack",
        description:
            "Order a shirt or jumper online and pick it up at the Albion Park Rail shop. What to expect when you come in.",
        date: "2026-10-02",
        category: "The rack",
        image: "/products/crew-grey-front.jpg",
        body: [
            "The website sells the shirts and jumpers. Order, pay, and collect from 8 Miall Way, Albion Park Rail, or ship it with Australia Post. The counter is open Monday to Friday 8am to 5pm and Saturday 8am to 12pm.",
            "Bring the order name. If a size is out when you arrive, we will tell you straight and sort the swap before you leave the counter.",
            "Share a piece from the product page if you are sending it to someone. Every shirt and every story on the blog carries its own picture and description for Facebook, Instagram, X and the rest.",
        ],
    },
];

export function getPost(slug: string) {
    return blogPosts.find((post) => post.slug === slug);
}
