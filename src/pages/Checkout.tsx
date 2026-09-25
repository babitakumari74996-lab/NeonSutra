import { useState, type FormEvent, type ReactNode, type InputHTMLAttributes } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Customer, PaymentMethod } from "@/types";
import { SEO } from "@/components/SEO";
import { Button, ButtonLink, Container, DemoTag } from "@/components/ui";
import { CustomizationSpecs } from "@/components/CartItem";
import { CartSummary } from "@/components/CartSummary";
import { NeonPreview } from "@/components/NeonPreview";
import { IconShield, IconCheck } from "@/components/Icons";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { INDIAN_STATES } from "@/data/states";
import { formatINR, validateEmail, validatePhone, validatePincode } from "@/utils/helpers";
import { shopConfig } from "@/config/shop.config";
import { cn } from "@/utils/cn";

type Field = keyof Customer;
type Errors = Partial<Record<Field, string>>;

const PAYMENTS: { id: PaymentMethod; label: string; sub: string }[] = [
  { id: "UPI", label: "UPI", sub: "GPay, PhonePe, Paytm, BHIM" },
  { id: "Card", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
  { id: "Net Banking", label: "Net Banking", sub: "All major Indian banks" },
  { id: "COD", label: "Cash on Delivery", sub: "Pay when your sign arrives" },
];

function validate(c: Customer): Errors {
  const e: Errors = {};
  if (c.fullName.trim().length < 2) e.fullName = "Please enter your full name.";
  if (!validateEmail(c.email)) e.email = "Enter a valid email, e.g. priya@gmail.com.";
  if (!validatePhone(c.phone)) e.phone = "Enter a 10-digit Indian mobile number starting with 6–9.";
  if (c.address.trim().length < 6) e.address = "Please enter your house/flat number and street.";
  if (c.city.trim().length < 2) e.city = "Please enter your city.";
  if (!c.state) e.state = "Please select your state or UT.";
  if (!validatePincode(c.pincode)) e.pincode = "Enter a valid 6-digit pincode.";
  return e;
}

export default function Checkout() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const [form, setForm] = useState<Customer>({ fullName: "", email: "", phone: "", address: "", landmark: "", city: "", state: "", pincode: "" });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>("UPI");
  const [processing, setProcessing] = useState(false);

  const errors = validate(form);
  const showErr = (f: Field) => (touched[f] || submitted) && errors[f];
  const setF = (f: Field, v: string) => setForm((p) => ({ ...p, [f]: v }));
  const blur = (f: Field) => setTouched((t) => ({ ...t, [f]: true }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(form);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      const el = document.getElementById(`co-${first}`);
      el?.focus();
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (processing) return;
    setProcessing(true);
    window.setTimeout(() => {
      const order = placeOrder({ customer: { ...form, phone: form.phone.replace(/\s/g, "") }, items, paymentMethod: payment });
      clearCart();
      navigate(`/order/${order.orderId}`, { replace: true });
    }, 2000);
  };

  if (items.length === 0 && !processing) {
    return (
      <Container className="py-16 text-center">
<SEO title={`Checkout — ${shopConfig.brand.name}`} description="Secure demo checkout for your custom neon sign." />
        <h1 className="font-display text-3xl font-semibold">Nothing to check out yet</h1>
        <p className="mt-2 text-fg-2">Your cart is empty. Design a sign first — it only takes a couple of minutes.</p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <ButtonLink to="/customize">Create Your Neon</ButtonLink>
          <ButtonLink to="/shop" variant="secondary">Explore Designs</ButtonLink>
        </div>
      </Container>
    );
  }

  const input = (f: Field, label: string, props: InputHTMLAttributes<HTMLInputElement> = {}, optional = false, prefix?: ReactNode) => (
    <div>
      <label htmlFor={`co-${f}`} className="mb-1.5 block text-sm font-medium text-fg">
        {label} {optional && <span className="font-normal text-fg-3">(optional)</span>}
      </label>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-fg-2">{prefix}</span>}
        <input
          id={`co-${f}`}
          className={cn("field", prefix ? "pl-12" : "")}
          value={form[f] ?? ""}
          onChange={(e) => setF(f, e.target.value)}
          onBlur={() => blur(f)}
          aria-invalid={!!showErr(f)}
          aria-describedby={showErr(f) ? `co-${f}-err` : undefined}
          {...props}
        />
      </div>
      {showErr(f) && <p id={`co-${f}-err`} className="mt-1.5 text-xs text-err">{errors[f]}</p>}
    </div>
  );

  const card = "rounded-xl border border-white/[0.08] bg-ink-900 p-5 sm:p-6";
  const h2 = "flex items-center gap-2.5 font-display text-lg font-semibold";
  const num = "grid h-7 w-7 place-items-center rounded-md bg-white/[0.06] text-xs font-bold text-fg-2";

  return (
    <Container className="py-8 sm:py-12">
      <SEO title={`Checkout — ${shopConfig.brand.name}`} description="Secure demo checkout for your custom neon sign." />
      <nav aria-label="Breadcrumb" className="text-xs text-fg-3">
        <ol className="flex gap-1.5"><li><Link to="/cart" className="hover:text-fg">Cart</Link></li><li aria-hidden>/</li><li className="text-fg-2">Checkout</li></ol>
      </nav>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">Checkout</h1>
      <p className="mt-1 flex items-center gap-2 text-sm text-fg-2"><IconShield size={16} /> Demo checkout — no real payment is processed.</p>

      <form onSubmit={submit} noValidate className="mt-8 grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-10">
        <div className="min-w-0 space-y-6">
          <section className={card} aria-labelledby="co-contact">
            <h2 id="co-contact" className={h2}><span className={num}>1</span> Contact information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">{input("fullName", "Full name", { autoComplete: "name", placeholder: "Aarav Mehta" })}</div>
              {input("email", "Email", { type: "email", autoComplete: "email", placeholder: "you@example.com" })}
              {input("phone", "Mobile number", { type: "tel", inputMode: "numeric", autoComplete: "tel-national", placeholder: "98765 43210", maxLength: 10, onChange: (e) => setF("phone", e.target.value.replace(/\D/g, "").slice(0, 10)) }, false, "+91")}
            </div>
          </section>

          <section className={card} aria-labelledby="co-ship">
            <h2 id="co-ship" className={h2}><span className={num}>2</span> Shipping address</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">{input("address", "Address", { autoComplete: "street-address", placeholder: "Flat / house no., building, street, area" })}</div>
              <div className="sm:col-span-2">{input("landmark", "Landmark", { placeholder: "Near Phoenix Mall" }, true)}</div>
              {input("city", "City", { autoComplete: "address-level2", placeholder: "Bengaluru" })}
              <div>
                <label htmlFor="co-state" className="mb-1.5 block text-sm font-medium">State / UT</label>
                <select
                  id="co-state"
                  className="field"
                  value={form.state}
                  onChange={(e) => setF("state", e.target.value)}
                  onBlur={() => blur("state")}
                  aria-invalid={!!showErr("state")}
                  aria-describedby={showErr("state") ? "co-state-err" : undefined}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {showErr("state") && <p id="co-state-err" className="mt-1.5 text-xs text-err">{errors.state}</p>}
              </div>
              {input("pincode", "Pincode", { inputMode: "numeric", autoComplete: "postal-code", placeholder: "560038", maxLength: 6, onChange: (e) => setF("pincode", e.target.value.replace(/\D/g, "").slice(0, 6)) })}
            </div>
          </section>

          <section className={card} aria-labelledby="co-pay">
            <h2 id="co-pay" className={h2}><span className={num}>3</span> Payment method</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-labelledby="co-pay">
              {PAYMENTS.map((p) => {
                const active = payment === p.id;
                return (
                  <label
                    key={p.id}
                    className={cn(
                      "relative flex min-h-[84px] cursor-pointer gap-3 rounded-lg border p-4 transition-colors",
                      active ? "border-accent/70 bg-accent/[0.06]" : "border-white/10 hover:border-white/25"
                    )}
                  >
                    <input type="radio" name="payment" value={p.id} checked={active} onChange={() => setPayment(p.id)} className="sr-only" />
                    <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border", active ? "border-accent bg-accent" : "border-white/25")} aria-hidden="true">
                      {active && <IconCheck size={12} className="text-white" />}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-semibold">{p.label} <DemoTag /></span>
                      <span className="block text-xs text-fg-2">{p.sub}</span>
                      <span className="mt-1 block text-[11px] text-fg-3">Demo — no real payment is processed</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {submitted && Object.keys(errors).length > 0 && (
            <p className="rounded-lg border border-err/30 bg-err/[0.06] px-4 py-3 text-sm text-red-200" role="alert">
              Please fix the {Object.keys(errors).length} highlighted field{Object.keys(errors).length > 1 ? "s" : ""} above to place your order.
            </p>
          )}
        </div>

        <aside aria-labelledby="co-summary" className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-white/[0.08] bg-ink-800 p-5 sm:p-6">
            <h2 id="co-summary" className="font-display text-lg font-semibold">Order summary</h2>
            <ul className="mt-4 max-h-[420px] divide-y divide-white/[0.06] overflow-y-auto pr-1">
              {items.map((i) => (
                <li key={i.lineId} className="flex gap-3 py-3">
                  <div className="w-20 shrink-0 overflow-hidden rounded-md border border-white/[0.07]">
                    <NeonPreview variant="card" animate={false} text={i.customization.text} font={i.customization.font} colour={i.customization.colour} size={i.customization.size} backing={i.customization.backing} logoUrl={i.customization.uploadedLogoDataUrl} logoColour={i.customization.logoColour} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{i.templateName}</p>
                      <p className="shrink-0 text-sm font-semibold">{formatINR(i.lineTotal)}</p>
                    </div>
                    <div className="mt-1"><CustomizationSpecs item={i} compact /></div>
                    <p className="mt-0.5 text-xs text-fg-3">Quantity: {i.customization.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-white/[0.08] pt-4">
              <CartSummary subtotal={subtotal} shipping={shipping} total={total} />
            </div>
            <Button type="submit" size="lg" className="mt-5 w-full" disabled={processing} aria-busy={processing}>
              {processing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950" aria-hidden="true" />
                  Processing demo payment…
                </>
              ) : (
                <>Place Order · {formatINR(total)}</>
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-fg-3">Demo — no real payment is processed and nothing will be manufactured.</p>
          </div>
        </aside>
      </form>
    </Container>
  );
}
