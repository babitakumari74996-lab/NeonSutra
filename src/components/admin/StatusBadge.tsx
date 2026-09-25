import type { OrderStatus } from "@/types";
import { cn } from "@/utils/cn";

const TONES: Record<OrderStatus, string> = {
  Paid: "bg-sky-400/10 text-sky-300 border-sky-400/25",
  "Design Review": "bg-amber-400/10 text-amber-300 border-amber-400/25",
  Production: "bg-violet-400/10 text-violet-300 border-violet-400/25",
  "Quality Check": "bg-pink-400/10 text-pink-300 border-pink-400/25",
  Shipped: "bg-cyan-400/10 text-cyan-300 border-cyan-400/25",
  Delivered: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25",
};

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium", TONES[status], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}
