import { formatINR } from "@/utils/helpers";
import { FREE_SHIPPING_THRESHOLD } from "@/utils/calculatePrice";

export function CartSummary({ subtotal, shipping, total }: { subtotal: number; shipping: number; total: number }) {
  const remaining = FREE_SHIPPING_THRESHOLD + 1 - subtotal;
  return (
    <div className="space-y-2.5 text-sm">
      <div className="flex justify-between text-fg-2">
        <span>Subtotal</span>
        <span className="text-fg">{formatINR(subtotal)}</span>
      </div>
      <div className="flex justify-between text-fg-2">
        <span>Shipping</span>
        <span className={shipping === 0 ? "font-medium text-emerald-300" : "text-fg"}>{shipping === 0 ? "FREE" : formatINR(shipping)}</span>
      </div>
      {shipping > 0 && subtotal > 0 && (
        <p className="rounded-md bg-white/[0.03] px-3 py-2 text-xs text-fg-3">
          Add {formatINR(remaining)} more for free pan-India shipping.
        </p>
      )}
      <div className="flex items-baseline justify-between border-t border-white/[0.08] pt-3">
        <span className="font-semibold text-fg">Total</span>
        <span className="font-display text-xl font-semibold text-fg">{formatINR(total)}</span>
      </div>
      <p className="text-xs text-fg-3">Inclusive of GST. Estimated — final price confirmed with your design mockup.</p>
    </div>
  );
}
