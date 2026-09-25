import type { Category, CategoryId } from "@/types";

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=700`;

export const CATEGORIES: Category[] = [
  {
    id: "cafe",
    name: "Cafe & Restaurant",
    shortName: "Cafe",
    description: "Warm glow for counters, menus and photo walls.",
    image: px(15484160),
    imageAlt: "Cosy coffee shop at night with a glowing neon sign and hanging bulbs",
  },
  {
    id: "salon",
    name: "Salon & Beauty",
    shortName: "Salon",
    description: "Selfie-worthy signs for studios and vanities.",
    image: px(12831451),
    imageAlt: "Woman standing in front of a pink neon sign inside a beauty salon",
  },
  {
    id: "gym",
    name: "Gym & Fitness",
    shortName: "Gym",
    description: "High-energy statements for training floors.",
    image: px(29639963),
    imageAlt: "Modern gym interior lit with red neon lighting",
  },
  {
    id: "bedroom",
    name: "Bedroom & Home",
    shortName: "Bedroom",
    description: "Soft ambient neon for personal spaces.",
    image: px(5605422),
    imageAlt: "Purple neon sign glowing on a bed in a dim bedroom",
  },
  {
    id: "gaming",
    name: "Gaming",
    shortName: "Gaming",
    description: "Level up your setup and stream backdrop.",
    image: px(34697345),
    imageAlt: "Gaming desk setup lit with vivid neon lighting",
  },
  {
    id: "wedding",
    name: "Wedding",
    shortName: "Wedding",
    description: "Backdrops for mehendi, sangeet and receptions.",
    image: px(15291907),
    imageAlt: "Better Together neon sign with floral wedding decor",
  },
  {
    id: "business",
    name: "Business & Shop",
    shortName: "Business",
    description: "Logos, OPEN signs and storefront branding.",
    image: px(29373760),
    imageAlt: "Red neon OPEN sign glowing at night",
  },
  {
    id: "quotes",
    name: "Quotes & Lifestyle",
    shortName: "Quotes",
    description: "Words to live by, lit up beautifully.",
    image: px(4316738),
    imageAlt: "Purple neon sign reading do what you love on a dark wall",
  },
];

export function getCategory(id: CategoryId): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}
