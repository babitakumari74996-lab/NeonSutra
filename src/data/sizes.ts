import type { BackingOption, SizeOption } from "@/types";

export const SIZES: { id: SizeOption; dims: string; note: string; scale: number }[] = [
  { id: "Small", dims: '18" × 8"', note: "Desks, shelves, small walls", scale: 0.56 },
  { id: "Medium", dims: '24" × 10"', note: "Most popular for homes & cafes", scale: 0.68 },
  { id: "Large", dims: '36" × 14"', note: "Feature walls, storefronts", scale: 0.8 },
  { id: "Extra Large", dims: '48" × 18"', note: "Statement pieces & events", scale: 0.92 },
];

export const BACKINGS: { id: BackingOption; price: number; note: string }[] = [
  { id: "Clear Acrylic", price: 0, note: "Included · barely-there look" },
  { id: "Black Acrylic", price: 300, note: "Bold contrast on light walls" },
];

export const STANDARD_PRICING = { Small: 2499, Medium: 3499, Large: 4499, "Extra Large": 5999 } as const;
export const WIDE_PRICING = { Small: 2999, Medium: 3999, Large: 4999, "Extra Large": 6499 } as const;
export const LOGO_PRICING = { Small: 3499, Medium: 4499, Large: 5499, "Extra Large": 6999 } as const;

export const ADDON_PRICES = {
  blackAcrylic: 300,
  mountingKit: 400,
  premiumFont: 200,
};

export function getSize(id: SizeOption) {
  return SIZES.find((s) => s.id === id) ?? SIZES[1];
}
