import type { CategoryId, Product } from "@/types";
import { TEMPLATES } from "./templates";
import { startingPrice } from "@/utils/calculatePrice";

export const PRODUCTS: Product[] = TEMPLATES.map((t) => ({ ...t, startingPrice: startingPrice(t) }));

export function productInCategory(p: Product, cat: CategoryId | "all"): boolean {
  if (cat === "all") return true;
  return p.category === cat || (p.secondaryCategories ?? []).includes(cat);
}

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.isFeatured);

export function relatedProducts(p: Product, n = 4): Product[] {
  const same = PRODUCTS.filter((x) => x.id !== p.id && productInCategory(x, p.category));
  const others = PRODUCTS.filter((x) => x.id !== p.id && !same.includes(x)).sort((a, b) => b.rating - a.rating);
  return [...same, ...others].slice(0, n);
}
