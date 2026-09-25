import { Link, useParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Button, ButtonLink, Container } from "@/components/ui";
import { OrderTimeline } from "@/components/OrderTimeline";
import { CustomizationSpecs } from "@/components/CartItem";
import { NeonPreview } from "@/components/NeonPreview";
import { useOrders } from "@/context/OrdersContext";
import { useToast } from "@/context/ToastContext";
import { formatDate, formatINR, PAYMENT_LABELS, TIMELINE_LABELS } from "@/utils/helpers";
import { shopConfig } from "@/config/shop.config";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { getOrder } = useOrders();
  const { showToast } = useToast();
  const order = getOrder(orderId);

  if (!order) {
    return (
      <Container className="py-16 text-center">
        <SEO title={`Order not found — ${shopConfig.brand.name}`} description="We couldn't find that order." />
        <h1 className="font-display text-3xl font-semibold">Order not found</h1>
        <p className="mt-2 text-fg-2">We couldn't find order <span className="font-mono">{orderId}</span> on this device. Demo orders are stored locally in your browser.</p>
        <ButtonLink to="/shop" className="mt-6">Continue Shopping</ButtonLink>
      </Container>
    );
  }

  const c = order.customer;
  const isNew = order.status === "Paid";

  return (
    <Container className="py-10 sm:py-14">
      <SEO title={`Order ${order.orderId} confirmed — ${shopConfig.brand.name}`} description="Your demo order has been confirmed." />
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center" aria-hidden="true">
            <svg viewBox="0 0 80 80" className="h-20 w-20 overflow-visible">
              <defs>
                <filter id="ck-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <circle cx="40" cy="40" r="34" fill="none" stroke="#2BFF8A" strokeOpacity="0.25" strokeWidth="2" />
              <path d="M25 41 l10 10 l20 -22" fill="none" stroke="#E8FFF1" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#ck-glow)" className="neon-flicker" style={{ color: "#2BFF8A" }} />
              <path d="M25 41 l10 10 l20 -22" fill="none" stroke="#2BFF8A" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" style={{ filter: "blur(6px)" }} />
            </svg>
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">{isNew ? "Order Confirmed!" : `Order ${TIMELINE_LABELS[order.status]}`}</h1>
          <p className="mt-3 text-fg-2">
            Thank you, {c.fullName.split(" ")[0]}. Your order number is{" "}
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-fg">{order.orderId}</span>
          </p>
          <p className="mt-2 text-sm text-fg-3">Placed on {formatDate(order.createdAt, { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" })}</p>
          <p className="mx-auto mt-5 max-w-xl rounded-lg border border-amber-400/25 bg-amber-400/[0.06] px-4 py-2.5 text-sm text-amber-200">
            This is a demo order. No payment was processed and nothing will be manufactured.
          </p>
        </div>

        <section className="mt-10 rounded-xl border border-white/[0.08] bg-ink-900 p-5 sm:p-8" aria-labelledby="status-title">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="status-title" className="font-display text-lg font-semibold">Order status</h2>
            <p className="text-sm text-fg-2">Estimated production: <span className="text-fg">{order.estimatedProductionDays}</span></p>
          </div>
          <OrderTimeline status={order.status} />
          <p className="mt-6 text-sm text-fg-2">
            Next: our design team will email and WhatsApp you a mockup within 24 hours. Production begins once you approve it.
          </p>
        </section>

        <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <section className="rounded-xl border border-white/[0.08] bg-ink-900 p-5 sm:p-6" aria-labelledby="items-title">
            <h2 id="items-title" className="font-display text-lg font-semibold">Items</h2>
            <ul className="mt-2 divide-y divide-white/[0.06]">
              {order.items.map((i) => (
                <li key={i.lineId} className="flex gap-3 py-4">
                  <div className="w-24 shrink-0 overflow-hidden rounded-md border border-white/[0.07] sm:w-28">
                    <NeonPreview variant="card" animate={false} text={i.customization.text} font={i.customization.font} colour={i.customization.colour} size={i.customization.size} backing={i.customization.backing} logoUrl={i.customization.uploadedLogoDataUrl} logoColour={i.customization.logoColour} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-3">Custom Neon Sign</p>
                    <div className="flex justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{i.templateName}</p>
                      <p className="shrink-0 text-sm font-semibold">{formatINR(i.lineTotal)}</p>
                    </div>
                    <div className="mt-1.5"><CustomizationSpecs item={i} compact /></div>
                    <p className="mt-0.5 text-xs text-fg-3">Quantity: {i.customization.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-white/[0.08] pt-4 text-sm">
              <div className="flex justify-between text-fg-2"><span>Subtotal</span><span className="text-fg">{formatINR(order.subtotal)}</span></div>
              <div className="flex justify-between text-fg-2"><span>Shipping</span><span className="text-fg">{order.shipping === 0 ? "FREE" : formatINR(order.shipping)}</span></div>
              <div className="flex justify-between pt-1 font-semibold"><span>Total</span><span className="font-display text-lg">{formatINR(order.total)}</span></div>
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-xl border border-white/[0.08] bg-ink-900 p-5 sm:p-6" aria-labelledby="cust-title">
              <h2 id="cust-title" className="font-display text-lg font-semibold">Customer</h2>
              <div className="mt-3 space-y-1 text-sm">
                <p className="text-fg">{c.fullName}</p>
                <p className="break-words text-fg-2">{c.email}</p>
                <p className="text-fg-2">+91 {c.phone}</p>
              </div>
            </section>
            <section className="rounded-xl border border-white/[0.08] bg-ink-900 p-5 sm:p-6" aria-labelledby="ship-title">
              <h2 id="ship-title" className="font-display text-lg font-semibold">Shipping</h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-2">{order.shippingAddress}</p>
              <p className="mt-3 text-sm text-fg-2">Insured courier · tracking shared on dispatch</p>
            </section>
            <section className="rounded-xl border border-white/[0.08] bg-ink-900 p-5 sm:p-6" aria-labelledby="pay-title">
              <h2 id="pay-title" className="font-display text-lg font-semibold">Payment</h2>
              <p className="mt-3 text-sm text-fg-2">{PAYMENT_LABELS[order.paymentMethod]}</p>
              <p className="text-xs text-fg-3">{order.paymentMethod === "COD" ? "Pay on delivery (demo)" : "Marked as paid (demo — no money moved)"}</p>
            </section>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              document.getElementById("status-title")?.scrollIntoView({ behavior: "smooth", block: "center" });
              showToast({ message: `Demo tracking: ${order.orderId} is at “${TIMELINE_LABELS[order.status]}”.` });
            }}
          >
            Track Order
          </Button>
          <ButtonLink to="/shop" size="lg">Continue Shopping</ButtonLink>
        </div>
        <p className="mt-6 text-center text-xs text-fg-3">
          Business owner? See how this order appears in the <Link to={`/admin/orders/${order.orderId}`} className="text-accent-2 hover:underline">demo admin dashboard</Link>.
        </p>
      </div>
    </Container>
  );
}
