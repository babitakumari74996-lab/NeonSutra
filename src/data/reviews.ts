import type { Review } from "@/types";

export const HOME_REVIEWS: Review[] = [
  {
    id: "r1", name: "Aarav Mehta", city: "Mumbai", rating: 5, product: "Custom cafe logo sign",
    quote: "Ordered a logo sign for our Bandra cafe. The mockup came on WhatsApp the next morning and the final piece looks exactly like the preview. Customers keep asking where we got it.",
    date: "2026-02-11",
  },
  {
    id: "r2", name: "Priya Nair", city: "Bengaluru", rating: 5, product: "GOOD VIBES ONLY",
    quote: "Packaging was solid, zero scratches on the acrylic. Took ten minutes to put up with the mounting kit. The warm white is so soft in the evenings.",
    date: "2026-01-28",
  },
  {
    id: "r3", name: "Rohan Kapoor", city: "Delhi", rating: 5, product: "BEAST MODE",
    quote: "Put the red BEAST MODE sign in our gym in Rajouri Garden. Bright enough to see from the road but doesn't heat up at all. Worth every rupee.",
    date: "2026-01-09",
  },
  {
    id: "r4", name: "Sneha Iyer", city: "Pune", rating: 4, product: "Better Together",
    quote: "Used it at our sangeet and now it's in our living room. Delivery took nine days, a little tight for our date, but the team kept me updated throughout.",
    date: "2025-12-19",
  },
  {
    id: "r5", name: "Karan Shah", city: "Ahmedabad", rating: 5, product: "OPEN",
    quote: "Replaced an old flickering tube sign with their LED OPEN sign. Electricity bill barely moved and it looks far more premium. Ordering one for our second outlet.",
    date: "2025-12-02",
  },
  {
    id: "r6", name: "Ananya Reddy", city: "Hyderabad", rating: 5, product: "BEAUTY STUDIO",
    quote: "The pink script sign made our salon reception look like a Pinterest board. The design team even adjusted the letter spacing for us before production.",
    date: "2025-11-15",
  },
];

export const PRODUCT_REVIEW_POOL: Review[] = [
  { id: "p1", name: "Ishita Banerjee", city: "Kolkata", rating: 5, quote: "Colour is exactly what the preview showed. Really impressed with the finishing on the edges.", date: "2026-02-20" },
  { id: "p2", name: "Vikram Singh", city: "Jaipur", rating: 5, quote: "Arrived well packed with a dimmer remote. Installation was straightforward with the kit.", date: "2026-02-04" },
  { id: "p3", name: "Meera Pillai", city: "Kochi", rating: 4, quote: "Lovely sign. Took an extra two days to ship but support was responsive on WhatsApp.", date: "2026-01-17" },
  { id: "p4", name: "Arjun Malhotra", city: "Chandigarh", rating: 5, quote: "Looks far more expensive than it was. My guests always ask about it.", date: "2026-01-03" },
  { id: "p5", name: "Divya Joshi", city: "Indore", rating: 5, quote: "The mockup step is brilliant — they suggested a slightly bigger size and they were right.", date: "2025-12-22" },
  { id: "p6", name: "Siddharth Rao", city: "Chennai", rating: 5, quote: "Runs cool even after hours. Using it every night as ambient light.", date: "2025-12-08" },
  { id: "p7", name: "Nikita Agarwal", city: "Lucknow", rating: 4, quote: "Great quality acrylic. I'd love a few more colour options but warm white is perfect.", date: "2025-11-26" },
  { id: "p8", name: "Farhan Qureshi", city: "Bhopal", rating: 5, quote: "Third order from NEONSUTRA. Consistent quality every single time.", date: "2025-11-10" },
];

export function reviewsForProduct(seed: number, n = 5): Review[] {
  const out: Review[] = [];
  for (let i = 0; i < n; i++) out.push(PRODUCT_REVIEW_POOL[(seed + i * 3) % PRODUCT_REVIEW_POOL.length]);
  return out;
}
