import { Link, useParams } from "react-router-dom";
import type { OrderStatus } from "@/types";
import { useOrders } from "@/context/OrdersContext";
import { useToast } from "@/context/ToastContext";
import { NeonPreview } from "@/components/NeonPreview";
import { OrderTimeline } from "@/components/OrderTimeline";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Badge } from "@/components/ui";
import { getColour } from "@/data/colours";
import { getFont } from "@/data/fonts";
import { formatDate, formatINR, ORDER_STATUSES, PAYMENT_LABELS, TIMELINE_LABELS } from "@/utils/helpers";

export default function AdminOrderDetail() {
  const { orderId } = useParams();
  const { getOrder, updateStatus } = useOrders();
  const { showToast } = useToast();
  const o = getOrder(orderId);

  if (!o) {
    return (
      <div className="py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">Order not found</h1>
        <Link to="/admin/orders" className="mt-4 inline-block text-sm text-accent-2 hover:underline">← Back to orders</Link>
      </div>
    );
  }

  const c = o.customer;
  const card = "rounded-xl border border-white/[0.07] bg-ink-900 p-5";

  return (
    <>
      <Link to="/admin/orders" className="text-sm text-fg-2 hover:text-fg">← All orders</Link>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-mono text-2xl font-semibold sm:text-3xl">{o.orderId}</h1>
          <p className="mt-1 text-sm text-fg-2">
            Placed {formatDate(o.createdAt, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}
            {!o.isSample && <Badge tone="accent" className="ml-2">From storefront</Badge>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={o.status} />
          <label htmlFor="status-select" className="sr-only">Change order status</label>
          <select
            id="status-select"
            className="field !min-h-[42px] !w-auto text-sm"
            value={o.status}
            onChange={(e) => {
              const s = e.target.value as OrderStatus;
              updateStatus(o.orderId, s);
              showToast({ message: `${o.orderId} moved to “${TIMELINE_LABELS[s]}”` });
            }}
          >
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <section className={`${card} mt-6`} aria-label="Order timeline">
        <OrderTimeline status={o.status} />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="space-y-4" aria-labelledby="items-h">
          <h2 id="items-h" className="font-semibold">Items ({o.items.length})</h2>
          {o.items.map((i) => {
            const cz = i.customization;
            const rows: [string, string][] = [
              ["Text", cz.text],
              ["Font", getFont(cz.font).label],
              ["Colour", getColour(cz.colour).label],
              ["Size", cz.size],
              ["Backing", cz.backing],
              ["Mounting Kit", cz.mountingKit ? "Yes" : "No"],
              ["Quantity", String(cz.quantity)],
              ["Unit price", formatINR(i.unitPrice)],
              ["Line total", formatINR(i.lineTotal)],
            ];
            return (
              <article key={i.lineId} className={card}>
                <div className="grid gap-5 md:grid-cols-[240px_1fr]">
                  <div className="overflow-hidden rounded-lg border border-white/[0.07]">
                    <NeonPreview variant="card" animate={false} text={cz.text} font={cz.font} colour={cz.colour} size={cz.size} backing={cz.backing} logoUrl={cz.uploadedLogoDataUrl} logoColour={cz.logoColour} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-3">Custom Neon Sign · {i.templateName}</p>
                    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
                      {rows.map(([k, v]) => (
                        <div key={k} className="min-w-0">
                          <dt className="text-xs text-fg-3">{k}</dt>
                          <dd className="break-words font-medium">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-4 flex items-center gap-3 rounded-lg border border-white/[0.07] p-3">
                      {cz.uploadedLogoDataUrl ? (
                        <>
                          <img src={cz.uploadedLogoDataUrl} alt={`Uploaded logo ${cz.uploadedLogoName ?? ""}`} className="h-12 w-12 rounded-md bg-black object-contain p-1" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{cz.uploadedLogoName}</p>
                            <Badge tone="warn" className="mt-1">Needs artwork review</Badge>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-fg-3">No logo uploaded</p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <div className="space-y-4">
          <section className={card} aria-labelledby="cust-h">
            <h2 id="cust-h" className="font-semibold">Customer</h2>
            <div className="mt-3 space-y-1 text-sm">
              <p className="font-medium">{c.fullName}</p>
              <p className="break-words text-fg-2"><a href={`mailto:${c.email}`} className="hover:text-fg">{c.email}</a></p>
              <p className="text-fg-2"><a href={`tel:+91${c.phone}`} className="hover:text-fg">+91 {c.phone}</a></p>
            </div>
            <h3 className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-fg-3">Shipping address</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-fg-2">{o.shippingAddress}</p>
          </section>
          <section className={card} aria-labelledby="pay-h">
            <h2 id="pay-h" className="font-semibold">Payment</h2>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-fg-2">{PAYMENT_LABELS[o.paymentMethod]}</span>
              <Badge tone={o.paymentMethod === "COD" ? "warn" : "ok"}>{o.paymentMethod === "COD" ? "Pending (COD)" : "Paid (demo)"}</Badge>
            </div>
            <div className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-4 text-sm">
              <div className="flex justify-between text-fg-2"><span>Subtotal</span><span className="text-fg">{formatINR(o.subtotal)}</span></div>
              <div className="flex justify-between text-fg-2"><span>Shipping</span><span className="text-fg">{o.shipping ? formatINR(o.shipping) : "FREE"}</span></div>
              <div className="flex justify-between pt-1 font-semibold"><span>Total</span><span>{formatINR(o.total)}</span></div>
            </div>
          </section>
          <section className={card}>
            <h2 className="font-semibold">Production</h2>
            <p className="mt-2 text-sm text-fg-2">Estimated: {o.estimatedProductionDays}</p>
            <Link to={`/order/${o.orderId}`} className="mt-3 inline-block text-sm text-accent-2 hover:underline">View customer confirmation page →</Link>
          </section>
        </div>
      </div>
    </>
  );
}
