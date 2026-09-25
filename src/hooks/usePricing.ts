import { useMemo } from "react";
import type { Customization, Template } from "@/types";
import { priceForCustomization } from "@/utils/calculatePrice";

export function usePricing(c: Customization, t: Template) {
  return useMemo(() => priceForCustomization(c, t), [c, t]);
}
