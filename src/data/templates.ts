import type { Template } from "@/types";
import { ALL_COLOUR_IDS } from "./colours";
import { ALL_FONT_IDS } from "./fonts";
import { LOGO_PRICING, STANDARD_PRICING, WIDE_PRICING } from "./sizes";

const std = { ...STANDARD_PRICING };
const wide = { ...WIDE_PRICING };

export const TEMPLATES: Template[] = [
  {
    id: "t-coffee-time", name: "COFFEE TIME", slug: "coffee-time", category: "cafe",
    defaultText: "COFFEE TIME", defaultFont: "script", defaultColour: "warm-white",
    availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: std,
    supportsLogoUpload: false, premiumFont: false,
    description: "A warm, inviting script sign that turns any counter or brew bar into the most photographed corner of your cafe.",
    tags: ["coffee", "cafe", "counter", "warm"], rating: 4.9, reviewCount: 312,
    previewStyle: {}, isFeatured: true, isNew: false, addedOn: "2025-08-12",
  },
  {
    id: "t-but-first-coffee", name: "BUT FIRST COFFEE", slug: "but-first-coffee", category: "cafe",
    defaultText: "BUT FIRST COFFEE", defaultFont: "modern", defaultColour: "pink",
    availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: wide,
    supportsLogoUpload: false, premiumFont: false,
    description: "The classic cafe mantra in clean modern type. Perfect above an espresso machine or home coffee station.",
    tags: ["coffee", "cafe", "kitchen", "quote"], rating: 4.8, reviewCount: 204,
    previewStyle: {}, isFeatured: false, isNew: false, addedOn: "2025-07-02",
  },
  {
    id: "t-good-vibes-only", name: "GOOD VIBES ONLY", slug: "good-vibes-only", category: "quotes", secondaryCategories: ["cafe"],
    defaultText: "GOOD VIBES ONLY", defaultFont: "handwritten", defaultColour: "yellow",
    availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: wide,
    supportsLogoUpload: false, premiumFont: false,
    description: "Our bestselling quote. Works in cafes, bedrooms, offices and rooftop hangouts — anywhere you want the mood set instantly.",
    tags: ["quote", "positive", "cafe", "bedroom", "bestseller"], rating: 5.0, reviewCount: 486,
    previewStyle: {}, isFeatured: true, isNew: false, addedOn: "2025-05-20",
  },
  {
    id: "t-beauty-studio", name: "BEAUTY STUDIO", slug: "beauty-studio", category: "salon",
    defaultText: "BEAUTY STUDIO", defaultFont: "script", defaultColour: "pink",
    availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: wide,
    supportsLogoUpload: false, premiumFont: true,
    description: "An elegant script sign with a premium flourish finish, designed for reception walls and makeup stations.",
    tags: ["salon", "beauty", "makeup", "studio", "premium"], rating: 4.9, reviewCount: 158,
    previewStyle: {}, isFeatured: true, isNew: true, addedOn: "2026-01-10",
  },
  {
    id: "t-good-hair-day", name: "GOOD HAIR DAY", slug: "good-hair-day", category: "salon",
    defaultText: "GOOD HAIR DAY", defaultFont: "neon", defaultColour: "purple",
    availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: std,
    supportsLogoUpload: false, premiumFont: false,
    description: "A playful favourite for hair studios and barbershops. Your clients will tag you in every post.",
    tags: ["salon", "hair", "barber", "selfie"], rating: 4.7, reviewCount: 96,
    previewStyle: {}, isFeatured: false, isNew: false, addedOn: "2025-09-15",
  },
  {
    id: "t-glam", name: "GLAM", slug: "glam", category: "salon",
    defaultText: "GLAM", defaultFont: "script", defaultColour: "pink",
    availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: std,
    supportsLogoUpload: false, premiumFont: false,
    description: "Short, bold and beautiful. A compact sign that punches way above its size on vanity mirrors and nail bars.",
    tags: ["salon", "vanity", "nails", "minimal"], rating: 4.8, reviewCount: 131,
    previewStyle: {}, isFeatured: false, isNew: false, addedOn: "2025-06-30",
  },
  {
    id: "t-beast-mode", name: "BEAST MODE", slug: "beast-mode", category: "gym",
    defaultText: "BEAST MODE", defaultFont: "bold", defaultColour: "red",
    availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: std,
    supportsLogoUpload: false, premiumFont: false,
    description: "Heavy condensed lettering for serious training floors. Pairs perfectly with dark walls and rubber flooring.",
    tags: ["gym", "fitness", "motivation", "bold"], rating: 4.9, reviewCount: 221,
    previewStyle: {}, isFeatured: true, isNew: false, addedOn: "2025-04-18",
  },
  {
    id: "t-train-insane", name: "TRAIN INSANE", slug: "train-insane", category: "gym",
    defaultText: "TRAIN INSANE", defaultFont: "bold", defaultColour: "blue",
    availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: std,
    supportsLogoUpload: false, premiumFont: false,
    description: "A high-voltage statement for CrossFit boxes, home gyms and boxing studios.",
    tags: ["gym", "crossfit", "motivation"], rating: 4.7, reviewCount: 88,
    previewStyle: {}, isFeatured: false, isNew: true, addedOn: "2026-02-02",
  },
  {
    id: "t-no-excuses", name: "NO EXCUSES", slug: "no-excuses", category: "gym",
    defaultText: "NO EXCUSES", defaultFont: "modern", defaultColour: "green",
    availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: std,
    supportsLogoUpload: false, premiumFont: false,
    description: "Two words that keep members coming back. Clean, legible and bright from across the floor.",
    tags: ["gym", "fitness", "motivation"], rating: 4.6, reviewCount: 74,
    previewStyle: {}, isFeatured: false, isNew: false, addedOn: "2025-03-11",
  },
  {
    id: "t-dream-big", name: "DREAM BIG", slug: "dream-big", category: "bedroom", secondaryCategories: ["quotes"],
    defaultText: "DREAM BIG", defaultFont: "script", defaultColour: "purple",
    availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: std,
    supportsLogoUpload: false, premiumFont: false,
    description: "A soft, dreamy glow for bedrooms, kids' rooms and study corners. Doubles as a gentle night light.",
    tags: ["bedroom", "kids", "quote", "night light"], rating: 4.9, reviewCount: 267,
    previewStyle: {}, isFeatured: true, isNew: false, addedOn: "2025-10-05",
  },
  {
    id: "t-home-sweet-home", name: "HOME SWEET HOME", slug: "home-sweet-home", category: "bedroom",
    defaultText: "HOME SWEET HOME", defaultFont: "handwritten", defaultColour: "warm-white",
    availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: wide,
    supportsLogoUpload: false, premiumFont: false,
    description: "A housewarming gift that actually gets used. Warm white glow for living rooms and entryways.",
    tags: ["home", "gift", "housewarming", "living room"], rating: 4.8, reviewCount: 143,
    previewStyle: {}, isFeatured: false, isNew: false, addedOn: "2025-02-14",
  },
  {
    id: "t-game-on", name: "GAME ON", slug: "game-on", category: "gaming",
    defaultText: "GAME ON", defaultFont: "retro", defaultColour: "blue",
    availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: std,
    supportsLogoUpload: false, premiumFont: true,
    description: "Arcade-inspired double-line lettering with a premium retro finish. Built for streaming backdrops.",
    tags: ["gaming", "streamer", "arcade", "retro", "premium"], rating: 4.9, reviewCount: 189,
    previewStyle: {}, isFeatured: true, isNew: false, addedOn: "2025-11-01",
  },
  {
    id: "t-level-up", name: "LEVEL UP", slug: "level-up", category: "gaming",
    defaultText: "LEVEL UP", defaultFont: "neon", defaultColour: "green",
    availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: std,
    supportsLogoUpload: false, premiumFont: false,
    description: "For gamers, e-sports cafes and anyone on a grind. Bright green by default — try purple for a moodier setup.",
    tags: ["gaming", "esports", "streamer"], rating: 4.8, reviewCount: 112,
    previewStyle: {}, isFeatured: false, isNew: true, addedOn: "2026-01-22",
  },
  {
    id: "t-better-together", name: "BETTER TOGETHER", slug: "better-together", category: "wedding",
    defaultText: "Better Together", defaultFont: "script", defaultColour: "warm-white",
    availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: wide,
    supportsLogoUpload: false, premiumFont: true,
    description: "The wedding backdrop favourite. Premium flowing script for mehendi, sangeet and reception stages.",
    tags: ["wedding", "backdrop", "mehendi", "sangeet", "premium"], rating: 5.0, reviewCount: 354,
    previewStyle: {}, isFeatured: true, isNew: false, addedOn: "2025-01-08",
  },
  {
    id: "t-the-names", name: "THE [NAME]S", slug: "the-names", category: "wedding",
    defaultText: "THE SHARMAS", defaultFont: "script", defaultColour: "pink",
    availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: std,
    supportsLogoUpload: false, premiumFont: false,
    description: "Personalise with your family name. A keepsake that moves from the wedding stage to your new home.",
    tags: ["wedding", "family", "personalised", "gift"], rating: 4.9, reviewCount: 176,
    previewStyle: {}, isFeatured: false, isNew: false, addedOn: "2025-09-28",
    editableHint: "Replace SHARMAS with your family name, e.g. THE IYERS",
  },
  {
    id: "t-open", name: "OPEN", slug: "open", category: "business",
    defaultText: "OPEN", defaultFont: "neon", defaultColour: "red",
    availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: std,
    supportsLogoUpload: false, premiumFont: false,
    description: "The storefront essential. Bright, legible from the street, and runs on a fraction of a tube light's power.",
    tags: ["business", "shop", "storefront", "window"], rating: 4.7, reviewCount: 402,
    previewStyle: {}, isFeatured: false, isNew: false, addedOn: "2024-12-01",
  },
  {
    id: "t-welcome", name: "WELCOME", slug: "welcome", category: "business",
    defaultText: "WELCOME", defaultFont: "minimal", defaultColour: "cool-white",
    availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: std,
    supportsLogoUpload: false, premiumFont: false,
    description: "Minimal, wide-set lettering for reception desks, homestays and boutique hotels.",
    tags: ["business", "reception", "hotel", "homestay"], rating: 4.6, reviewCount: 67,
    previewStyle: {}, isFeatured: false, isNew: false, addedOn: "2025-05-05",
  },
  {
    id: "t-your-logo", name: "YOUR LOGO HERE", slug: "your-logo-here", category: "business",
    defaultText: "YOUR BRAND", defaultFont: "modern", defaultColour: "cool-white",
    availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: { ...LOGO_PRICING },
    supportsLogoUpload: true, premiumFont: false,
    description: "Upload your logo and brand name. Our designers trace it into a neon-ready outline and send you a mockup before production.",
    tags: ["logo", "business", "brand", "custom", "office"], rating: 4.9, reviewCount: 238,
    previewStyle: {}, isFeatured: true, isNew: false, addedOn: "2025-12-12",
  },
];

/** Used for /customize ("Design Your Own") — not listed in the catalogue. */
export const CUSTOM_TEMPLATE: Template = {
  id: "custom", name: "Design Your Own", slug: "design-your-own", category: "quotes",
  defaultText: "Your Text", defaultFont: "script", defaultColour: "pink",
  availableFonts: ALL_FONT_IDS, availableColours: ALL_COLOUR_IDS, basePriceBySize: std,
  supportsLogoUpload: true, premiumFont: false,
  description: "Start from a blank wall. Any words, any colour, your logo if you like.",
  tags: ["custom"], rating: 4.9, reviewCount: 2400,
  previewStyle: {}, isFeatured: false, isNew: false, addedOn: "2024-01-01",
};

export function getTemplateById(id: string | undefined): Template | undefined {
  if (!id) return undefined;
  if (id === CUSTOM_TEMPLATE.id) return CUSTOM_TEMPLATE;
  return TEMPLATES.find((t) => t.id === id);
}

export function getTemplateBySlug(slug: string | undefined): Template | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}
