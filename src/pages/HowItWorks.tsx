import { SEO } from "@/components/SEO";
import { Container, Reveal, SectionHeading, ButtonLink } from "@/components/ui";
import { NeonPreview } from "@/components/NeonPreview";
import { TrustBadges } from "@/components/HomeSections";
import {
  IconArrowRight, IconGrid, IconLayers, IconPackage, IconTruck,
  IconBolt, IconChat, IconPen, IconRuler, IconShield, IconSun, IconThermo,
} from "@/components/Icons";
import { shopConfig } from "@/config/shop.config";

const STEPS = [
  {
    n: "01", t: "Choose a Design",
    d: "Pick one of our ready-made templates or start completely from scratch. Browse by vibe — cafe, gym, wedding, bedroom, salon, quotes and more.",
    I: IconGrid,
  },
  {
    n: "02", t: "Customize It Live",
    d: "Type your own words, pick a font, choose your neon colour and size. The live preview updates instantly so you see exactly what you'll get — no surprises.",
    I: IconLayers,
  },
  {
    n: "03", t: "Place Your Order",
    d: "Secure checkout with UPI, card, or COD on select orders. Within 24 hours, a real designer sends you a free mockup on WhatsApp for approval.",
    I: IconPackage,
  },
  {
    n: "04", t: "We Build & Deliver",
    d: "Once you approve the mockup, our Bengaluru studio handcrafts your sign in 5–7 days. It ships insured across India and arrives at your door in 7–10 days total.",
    I: IconTruck,
  },
];

const WHY = [
  { I: IconPen, t: "Free mockup before you pay upfront", d: "We won't start building until you love the design." },
  { I: IconBolt, t: "Real LED neon flex", d: "Flexible silicone — not fragile glass. No buzzing, no gas, no breakage." },
  { I: IconThermo, t: "Stays cool to the touch", d: "Runs on safe 12V, even after 12+ hours of being on." },
  { I: IconSun, t: "Indoor & covered outdoor safe", d: "IP65 weatherproofing available on request." },
  { I: IconRuler, t: "Any size up to 6 feet", d: "From desk accents to full statement walls." },
  { I: IconShield, t: "12-month warranty", d: "Covers LEDs, adapter and wiring. We repair or replace." },
  { I: IconChat, t: "Real designer support", d: "Talk to a human on WhatsApp — Mon to Sat, 10 am to 7 pm." },
];

export default function HowItWorksPage() {
  return (
    <>
      <SEO
        title={`How It Works | Design Your Neon Sign in 4 Steps — ${shopConfig.brand.name}`}
        description="From idea to glowing wall in four simple steps: pick a design, customise it live, approve a free mockup, and we handcraft and ship your LED neon sign across India."
      />

      {/* Hero */}
      <section className="relative border-b border-white/[0.06] bg-ink-900">
        <Container className="py-20 sm:py-28">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-2">How it works</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.025em] sm:text-6xl">
              From idea to glowing wall
              <br />
              <span className="text-accent-2">in four steps.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-fg-2">
              No design degree needed. Our live customiser, real human designers and insured shipping
              make getting a custom neon sign as easy as ordering a pizza — but way cooler.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/customize" size="lg">Start designing <IconArrowRight size={18} /></ButtonLink>
              <ButtonLink to="/shop" size="lg" variant="secondary">Browse templates</ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>

      <TrustBadges />

      {/* Steps */}
      <section className="py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              as="h2"
              eyebrow="The process"
              title="Four steps to your custom neon"
              subtitle="We've shipped signs to 2,400+ customers across 180+ cities. Here's exactly how it goes:"
            />
          </Reveal>

          <ol className="mt-14 grid gap-4 sm:grid-cols-2">
            {STEPS.map(({ n, t, d, I }, idx) => (
              <Reveal key={n} delay={idx * 80}>
                <li className="relative h-full rounded-xl border border-white/[0.07] bg-ink-900 p-7 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-5xl font-semibold tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,108,188,0.7)]">{n}</span>
                    <span className="grid h-12 w-12 place-items-center rounded-lg bg-white/[0.04] text-fg-2">
                      <I size={20} />
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold">{t}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-fg-2">{d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Why & preview */}
      <section className="border-y border-white/[0.06] bg-ink-900 py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              as="h2"
              eyebrow={`Why ${shopConfig.brand.name}`}
              title="Built to glow for years, not weeks"
              subtitle="We obsess over the details you notice after the unboxing — even light, clean edges, quiet adapters, and a warranty that actually means something."
            />
            <ul className="mt-8 space-y-4">
              {WHY.map(({ I, t, d }) => (
                <li key={t} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-accent/20 bg-accent/[0.07] text-accent-2">
                    <I size={18} />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold">{t}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-fg-2">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-ink-850">
              <NeonPreview
                text="Made with love"
                font="script"
                colour="warm-white"
                size="Large"
                backing="Black Acrylic"
                className="min-h-[420px]"
                label="Warm white neon sign reading Made with love on black acrylic"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Timing & FAQ CTA */}
      <section className="py-20 sm:py-24">
        <Container className="grid gap-6 md:grid-cols-3">
          {[
            { t: "24 hrs", d: "Design mockup delivered on WhatsApp after ordering." },
            { t: "5–7 days", d: "Hand production in our Bengaluru studio after mockup approval." },
            { t: "7–10 days", d: "Total door-to-door delivery time for most Indian cities." },
          ].map((x) => (
            <Reveal key={x.t}>
              <div className="rounded-xl border border-white/[0.07] bg-ink-900 p-7">
                <p className="font-display text-3xl font-semibold text-accent-2">{x.t}</p>
                <p className="mt-2 text-sm text-fg-2">{x.d}</p>
              </div>
            </Reveal>
          ))}
        </Container>
        <Container className="mt-16 text-center">
          <Reveal>
            <SectionHeading
              as="h2"
              align="center"
              title="Still have questions?"
              subtitle="Check out the FAQ or ping our design team on WhatsApp — we usually reply within an hour."
            />
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink to="/faq" variant="secondary" size="lg">Read the FAQ</ButtonLink>
              <ButtonLink to="/customize" size="lg">Design your neon <IconArrowRight size={18} /></ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
