import type { PriceBreakdown, SizeOption } from "@/types";
import { formatINR } from "@/utils/helpers";

export function PriceBreakdownTable({ p, size }: { p: PriceBreakdown; size: SizeOption }) {
  const row = "flex items-baseline justify-between gap-4";
  return (
    <div className="text-sm">
      <div className="space-y-1.5">
        <div className={row}><span className="text-fg-2">Base Price ({size})</span><span className="tabular-nums text-fg">{formatINR(p.basePrice)}</span></div>
        {p.backing > 0 && <div className={row}><span className="text-fg-2">Black Acrylic</span><span className="tabular-nums text-fg">+{formatINR(p.backing)}</span></div>}
        {p.mounting > 0 && <div className={row}><span className="text-fg-2">Mounting Kit</span><span className="tabular-nums text-fg">+{formatINR(p.mounting)}</span></div>}
        {p.premium > 0 && <div className={row}><span className="text-fg-2">Premium design</span><span className="tabular-nums text-fg">+{formatINR(p.premium)}</span></div>}
      </div>
      <div className="my-2.5 border-t border-dashed border-white/10" />
      <div className="space-y-1.5">
        <div className={row}><span className="text-fg-2">Unit Price</span><span className="tabular-nums text-fg">{formatINR(p.unitPrice)}</span></div>
        <div className={row}><span className="text-fg-2">Quantity</span><span className="tabular-nums text-fg">× {p.quantity}</span></div>
      </div>
      <div className="my-2.5 border-t border-white/10" />
      <div className={row}>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-fg">Estimated Total</span>
        <span className="font-display text-xl font-semibold tabular-nums text-fg">{formatINR(p.lineTotal)}</span>
      </div>
    </div>
  );
}

export function PriceNote() {
  return (
    <p className="text-xs leading-relaxed text-fg-3">
      Final price may vary based on final artwork. Our design team confirms before production.
    </p>
  );
}
