import type { Customization, PriceBreakdown, PricingOptions, Template } from "@/types";
import { ADDON_PRICES } from "@/data/sizes";

export const FREE_SHIPPING_THRESHOLD = 4999;
export const SHIPPING_FEE = 199;

export function calculatePrice(o: PricingOptions): PriceBreakdown {
  const basePrice = o.basePriceBySize[o.size];
  const backing = o.backing === "Black Acrylic" ? ADDON_PRICES.blackAcrylic : 0;
  const mounting = o.mountingKit ? ADDON_PRICES.mountingKit : 0;
  const premium = o.premiumFont ? ADDON_PRICES.premiumFont : 0;
  const unitPrice = basePrice + backing + mounting + premium;
  const quantity = Math.max(1, Math.min(20, Math.floor(o.quantity || 1)));
  return { basePrice, backing, mounting, premium, unitPrice, quantity, lineTotal: unitPrice * quantity };
}

export function priceForCustomization(c: Customization, t: Template): PriceBreakdown {
  return calculatePrice({
    size: c.size,
    backing: c.backing,
    mountingKit: c.mountingKit,
    premiumFont: t.premiumFont,
    quantity: c.quantity,
    basePriceBySize: t.basePriceBySize,
  });
}

export function startingPrice(t: Template): number {
  return t.basePriceBySize.Small + (t.premiumFont ? ADDON_PRICES.premiumFont : 0);
}

export function calculateShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
