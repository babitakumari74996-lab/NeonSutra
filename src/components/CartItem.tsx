import { useNavigate } from "react-router-dom";
import type { CartItem as CartItemType } from "@/types";
import { NeonPreview } from "./NeonPreview";
import { IconEdit, IconMinus, IconPlus, IconTrash } from "./Icons";
import { getColour } from "@/data/colours";
import { getFont } from "@/data/fonts";
import { formatINR } from "@/utils/helpers";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/utils/cn";

export function CustomizationSpecs({ item, compact = false }: { item: CartItemType; compact?: boolean }) {
  const c = item.customization;
  const rows: [string, string][] = [
    ["Text", c.text || "—"],
    ["Font", getFont(c.font).label],
    ["Colour", getColour(c.colour).label],
    ["Size", c.size],
    ["Backing", c.backing],
    ["Mounting Kit", c.mountingKit ? "Yes" : "No"],
  ];
  if (c.uploadedLogoName) rows.push(["Logo", "uploaded ✓"]);
  return (
    <dl className={cn("grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5", compact ? "text-xs" : "text-[13px]")}>
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-fg-3">{k}:</dt>
          <dd className={cn("min-w-0 break-words text-fg-2", k === "Logo" && "text-emerald-300")}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CartItemRow({ item, compact = false, onNavigate }: { item: CartItemType; compact?: boolean; onNavigate?: () => void }) {
  const { setQuantity, removeItem, restoreItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const c = item.customization;

  const remove = () => {
    const removed = removeItem(item.lineId);
    if (removed) {
      showToast({
        message: `Removed “${c.text}” from your cart`,
        actionLabel: "Undo",
        onAction: () => restoreItem(removed.item, removed.index),
      });
    }
  };

  const edit = () => {
    onNavigate?.();
    navigate(`/customize/${c.templateId}?edit=${item.lineId}`);
  };

  return (
    <article className="flex gap-3 py-4 sm:gap-4" aria-label={`Custom neon sign: ${c.text}`}>
      <div className={cn("shrink-0 overflow-hidden rounded-lg border border-white/[0.07]",
        c.size === "Small" ? "w-20" : c.size === "Medium" ? "w-24" : c.size === "Large" ? "w-28" : "w-32",
        "sm:" + (c.size === "Small" ? "w-24" : c.size === "Medium" ? "w-28" : c.size === "Large" ? "w-36" : "w-44"))}>
        <NeonPreview
          variant="card"
          animate={false}
          text={c.text}
          font={c.font}
          colour={c.colour}
          size={c.size}
          backing={c.backing}
          logoUrl={c.uploadedLogoDataUrl}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-3">Custom Neon Sign</p>
            <h3 className="truncate text-sm font-semibold text-fg sm:text-base">{item.templateName}</h3>
          </div>
          <p className="shrink-0 text-sm font-semibold text-fg sm:text-base">{formatINR(item.lineTotal)}</p>
        </div>
        <div className="mt-2">
          <CustomizationSpecs item={item} compact={compact} />
          <p className={cn("mt-0.5 text-fg-3", compact ? "text-xs" : "text-[13px]")}>
            Quantity: {c.quantity} · {formatINR(item.unitPrice)} each
          </p>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-lg border border-white/10" role="group" aria-label="Quantity">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center text-fg-2 hover:text-fg disabled:opacity-30"
              onClick={() => setQuantity(item.lineId, c.quantity - 1)}
              disabled={c.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <IconMinus size={16} />
            </button>
            <span className="w-7 text-center text-sm font-semibold tabular-nums" aria-live="polite">{c.quantity}</span>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center text-fg-2 hover:text-fg disabled:opacity-30"
              onClick={() => setQuantity(item.lineId, c.quantity + 1)}
              disabled={c.quantity >= 20}
              aria-label="Increase quantity"
            >
              <IconPlus size={16} />
            </button>
          </div>
          <button type="button" onClick={edit} className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-2.5 text-sm text-fg-2 hover:bg-white/5 hover:text-fg">
            <IconEdit size={16} /> Edit<span className="hidden sm:inline"> customisation</span>
          </button>
          <button type="button" onClick={remove} className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-2.5 text-sm text-fg-3 hover:bg-white/5 hover:text-err">
            <IconTrash size={16} /> Remove
          </button>
        </div>
      </div>
    </article>
  );
}
