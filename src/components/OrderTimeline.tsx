import type { OrderStatus } from "@/types";
import { ORDER_STATUSES, TIMELINE_LABELS } from "@/utils/helpers";
import { IconCheck } from "./Icons";
import { cn } from "@/utils/cn";

/** Vertical on mobile, horizontal on desktop. */
export function OrderTimeline({ status, forceVertical = false }: { status: OrderStatus; forceVertical?: boolean }) {
  const current = ORDER_STATUSES.indexOf(status);
  return (
    <ol className={cn("flex flex-col gap-0", !forceVertical && "md:flex-row")} aria-label="Order status">
      {ORDER_STATUSES.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const last = i === ORDER_STATUSES.length - 1;
        return (
          <li key={s} className={cn("relative flex gap-3 pb-6", !forceVertical && "md:flex-1 md:flex-col md:items-center md:pb-0 md:text-center", last && "pb-0")} aria-current={active ? "step" : undefined}>
            {!last && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-[13px] top-7 h-[calc(100%-28px)] w-px",
                  !forceVertical && "md:left-[calc(50%+18px)] md:top-[13px] md:h-px md:w-[calc(100%-36px)]",
                  done ? "bg-accent/70" : "bg-white/10"
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px] font-bold",
                done && "border-accent/70 bg-accent/20 text-accent-2",
                active && "border-accent bg-accent text-white shadow-[0_0_0_4px_rgba(255,62,165,0.18),0_0_18px_rgba(255,62,165,0.6)]",
                !done && !active && "border-white/15 bg-ink-850 text-fg-3"
              )}
            >
              {done || active ? <IconCheck size={14} /> : i + 1}
            </span>
            <span className={cn(!forceVertical && "md:mt-3")}>
              <span className={cn("block text-sm font-medium", active ? "text-fg" : done ? "text-fg-2" : "text-fg-3")}>{TIMELINE_LABELS[s]}</span>
              <span className="block text-xs text-fg-3">{active ? "Current" : done ? "Completed" : "Upcoming"}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
