import { SEO } from "@/components/SEO";
import { useCart } from "@/context/CartContext";
import { CartItemRow } from "@/components/CartItem";
import { CartSummary } from "@/components/CartSummary";
import { ButtonLink, Container } from "@/components/ui";
import { IconBag, IconShield, IconPen, IconTruck } from "@/components/Icons";

export default function CartPage() {
  const { items, subtotal, shipping, total, count } = useCart();
  return (
    <Container className="py-10 sm:py-14">
      <SEO title="Your Cart — NEONSUTRA" description="Review your custom LED neon signs before checkout." />
      <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">Your cart</h1>
      <p className="mt-1 text-sm text-fg-2">{count} item{count === 1 ? "" : "s"} · Saved on this device</p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-white/10 px-6 py-16 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-white/10 text-fg-3"><IconBag size={24} /></div>
          <h2 className="mt-4 font-display text-xl font-semibold">Your cart is empty</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-fg-2">Start with a template or design your own sign — you'll see it glow as you type.</p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <ButtonLink to="/customize">Create Your Neon</ButtonLink>
            <ButtonLink to="/shop" variant="secondary">Explore Designs</ButtonLink>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10">
          <section aria-label="Cart items" className="min-w-0 divide-y divide-white/[0.06] rounded-xl border border-white/[0.07] bg-ink-900 px-4 sm:px-6">
            {items.map((i) => <CartItemRow key={i.lineId} item={i} />)}
          </section>
          <aside aria-label="Order summary" className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-white/[0.08] bg-ink-800 p-5 sm:p-6">
              <h2 className="mb-4 font-display text-lg font-semibold">Summary</h2>
              <CartSummary subtotal={subtotal} shipping={shipping} total={total} />
              <ButtonLink to="/checkout" size="lg" className="mt-5 w-full">Proceed to Checkout</ButtonLink>
              <ButtonLink to="/shop" variant="ghost" className="mt-2 w-full">Continue shopping</ButtonLink>
            </div>
            <ul className="mt-4 space-y-2.5 px-1 text-xs text-fg-2">
              <li className="flex items-center gap-2"><IconPen size={15} /> Free design mockup before production</li>
              <li className="flex items-center gap-2"><IconShield size={15} /> 12-month warranty on every sign</li>
              <li className="flex items-center gap-2"><IconTruck size={15} /> Insured shipping across India</li>
            </ul>
          </aside>
        </div>
      )}
    </Container>
  );
}
