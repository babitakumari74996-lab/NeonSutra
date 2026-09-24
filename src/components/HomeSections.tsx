import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { CategoryId } from "@/types";
import { ButtonLink, Container, Reveal, SectionHeading, Stars } from "./ui";
import { ProductCard, ProductGrid } from "./ProductCard";
import { NeonPreview } from "./NeonPreview";
import {
  IconArrowRight, IconBolt, IconChat, IconChevronDown, IconChevronLeft, IconChevronRight, IconFlag, IconLeaf,
  IconPen, IconRuler, IconShield, IconStar, IconSun, IconThermo, IconTruck, IconLayers, IconPackage, IconGrid,
} from "./Icons";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS, FEATURED_PRODUCTS, productInCategory } from "@/data/products";
import { HOME_REVIEWS } from "@/data/reviews";
import { FAQS } from "@/data/faqs";
import { cn } from "@/utils/cn";
import type { FAQItem } from "@/types";

/* ---------------- Trust badges ---------------- */
export function TrustBadges() {
  const items = [
    { I: IconFlag, label: "Made in India", sub: "Handcrafted in Bengaluru" },
    { I: IconShield, label: "12-Month Warranty", sub: "LEDs, adapter & wiring" },
    { I: IconPen, label: "Free Design Mockup", sub: "Approve before we build" },
    { I: IconTruck, label: "Ships Pan-India", sub: "Delivered in 7–10 days" },
    { I: IconStar, label: "4.9★ Rated", sub: "From 2,400+ customers" },
  ];
  return (
    <section aria-label="Why customers trust us" className="border-y border-white/[0.06] bg-ink-900">
      <Container className="grid grid-cols-2 gap-x-4 gap-y-6 py-8 sm:grid-cols-3 lg:grid-cols-5">
        {items.map(({ I, label, sub }, idx) => (
          <div key={label} className={cn("flex items-center gap-3", idx === 4 && "col-span-2 sm:col-span-1")}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-fg">
              <I size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-fg">{label}</p>
              <p className="text-xs text-fg-3">{sub}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}

/* ---------------- Ready to customise designs ---------------- */
export function DesignsSection() {
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const list = useMemo(() => PRODUCTS.filter((p) => productInCategory(p, cat)).slice(0, 8), [cat]);
  const chips: { id: CategoryId | "all"; label: string }[] = [{ id: "all", label: "All" }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.shortName }))];
  return (
    <section className="py-20 sm:py-24" aria-labelledby="designs-title">
      <Container>
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="designs-title" eyebrow="Ready to customise" title="Start from a design you love" subtitle="Every template is fully editable — change the words, font, colour and size in the customiser." />
          <Link to="/shop" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-fg-2 hover:text-fg">
            View all designs <IconArrowRight size={16} />
          </Link>
        </Reveal>
        <div className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Filter by category">
          {chips.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={cat === c.id}
              onClick={() => setCat(c.id)}
              className={cn(
                "min-h-[40px] shrink-0 rounded-lg border px-4 text-sm font-medium transition-colors",
                cat === c.id ? "border-accent/60 bg-accent/10 text-fg" : "border-white/10 text-fg-2 hover:border-white/20 hover:text-fg"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <ProductGrid products={list} className="mt-8 min-[1440px]:grid-cols-4 lg:grid-cols-4" />
        <div className="mt-10 flex justify-center">
          <ButtonLink to={cat === "all" ? "/shop" : `/shop?category=${cat}`} variant="secondary">
            View all designs
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- How it works ---------------- */
export function HowItWorks() {
  const steps = [
    { n: "01", t: "Choose a Design", d: "Pick a ready template or start from a blank wall.", I: IconGrid },
    { n: "02", t: "Customize It", d: "Type your words, choose font, colour and size. See it glow live.", I: IconLayers },
    { n: "03", t: "Place Your Order", d: "Secure checkout. We send a free design mockup to approve.", I: IconPackage },
    { n: "04", t: "We Build & Deliver", d: "Handcrafted in 5–7 days, shipped insured across India.", I: IconTruck },
  ];
  return (
    <section id="how-it-works" className="scroll-mt-20 border-y border-white/[0.06] bg-ink-900 py-20 sm:py-24" aria-labelledby="how-title">
      <Container>
        <Reveal>
          <SectionHeading id="how-title" eyebrow="How it works" title="From idea to glowing wall in four steps" align="center" />
        </Reveal>
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ n, t, d, I }, idx) => (
            <Reveal key={n} delay={idx * 80}>
              <li className="relative h-full rounded-xl border border-white/[0.07] bg-ink-800 p-6">
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl font-semibold tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,108,188,0.7)]">{n}</span>
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/[0.04] text-fg-2"><I size={18} /></span>
                </div>
                <h3 className="mt-6 font-display text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-2">{d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <div className="mt-10 flex justify-center">
          <ButtonLink to="/customize">Start designing <IconArrowRight size={16} /></ButtonLink>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Shop by category ---------------- */
export function ShopByCategory() {
  return (
    <section className="py-20 sm:py-24" aria-labelledby="cat-title">
      <Container>
        <Reveal>
          <SectionHeading id="cat-title" eyebrow="Shop by category" title="Neon for every kind of space" subtitle="Real signs, real spaces. Tap a category to see designs made for it." />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {CATEGORIES.map((c, idx) => (
            <Reveal key={c.id} delay={(idx % 4) * 60}>
              <Link
                to={`/shop?category=${c.id}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-xl border border-white/[0.07] bg-ink-800"
              >
                <img
                  src={c.image}
                  alt={c.imageAlt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <h3 className="font-display text-base font-semibold text-white sm:text-lg">{c.name}</h3>
                  <p className="mt-1 hidden text-xs text-white/70 sm:block">{c.description}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-white/80 group-hover:text-white">
                    Explore <IconArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Why choose us ---------------- */
export function WhyChooseUs() {
  const pts = [
    { I: IconBolt, t: "Real LED neon", d: "Flexible silicone LED — not fragile glass. No gas, no breakage, no buzzing." },
    { I: IconLeaf, t: "Energy efficient", d: "Uses up to 80% less power than glass neon. Runs on a safe 12V adapter." },
    { I: IconThermo, t: "Low heat", d: "Stays cool to the touch, even after a 12-hour cafe shift." },
    { I: IconSun, t: "Indoor & outdoor safe", d: "Rated for indoor and covered outdoor use. IP65 upgrade available." },
    { I: IconRuler, t: "Custom sizes", d: "From 18-inch desk signs to 4-foot statement walls, and bespoke beyond." },
    { I: IconChat, t: "Dedicated design support", d: "A real designer reviews every order and sends a mockup before production." },
  ];
  return (
    <section className="border-y border-white/[0.06] bg-ink-900 py-20 sm:py-24" aria-labelledby="why-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionHeading id="why-title" eyebrow="Why NEONSUTRA" title="Built to glow for years, not weeks" subtitle="We obsess over the details you notice after the unboxing — even light, clean edges, quiet adapters and a warranty that means it." />
            <div className="mt-8 overflow-hidden rounded-xl border border-white/[0.07]">
              <NeonPreview text="Made with love" font="script" colour="warm-white" size="Large" backing="Black Acrylic" label="Warm white neon sign reading Made with love on black acrylic" />
            </div>
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.06] sm:grid-cols-2">
            {pts.map(({ I, t, d }) => (
              <div key={t} className="bg-ink-850 p-6">
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-accent/20 bg-accent/[0.07] text-accent-2"><I size={18} /></span>
                <h3 className="mt-4 font-display text-base font-semibold">{t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-2">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Featured carousel ---------------- */
export function FeaturedCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };
  return (
    <section className="py-20 sm:py-24" aria-labelledby="featured-title">
      <Container>
        <Reveal className="flex items-end justify-between gap-4">
          <SectionHeading id="featured-title" eyebrow="Featured" title="Bestselling neon signs" />
          <div className="hidden gap-2 sm:flex">
            <button type="button" onClick={() => scroll(-1)} className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 text-fg-2 hover:border-white/25 hover:text-fg" aria-label="Scroll featured designs left">
              <IconChevronLeft />
            </button>
            <button type="button" onClick={() => scroll(1)} className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 text-fg-2 hover:border-white/25 hover:text-fg" aria-label="Scroll featured designs right">
              <IconChevronRight />
            </button>
          </div>
        </Reveal>
        <div ref={ref} className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 pt-1 sm:mx-0 sm:scroll-px-0 sm:px-0">
          {FEATURED_PRODUCTS.slice(0, 6).map((p) => (
            <ProductCard key={p.id} product={p} className="w-[78%] shrink-0 snap-start min-[480px]:w-[46%] md:w-[31%] lg:w-[23.5%]" />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Reviews ---------------- */
export function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-20 border-y border-white/[0.06] bg-ink-900 py-20 sm:py-24" aria-labelledby="reviews-title">
      <Container>
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="reviews-title" eyebrow="Customer reviews" title="Loved in 180+ cities" subtitle="From Bandra cafes to Hyderabad salons — here's what our customers say." />
          <div className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-ink-800 px-5 py-4">
            <span className="font-display text-4xl font-semibold">4.9</span>
            <div>
              <Stars rating={4.9} size={16} />
              <p className="mt-1 text-xs text-fg-3">Based on 2,400+ verified reviews</p>
            </div>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {HOME_REVIEWS.map((r, idx) => (
            <Reveal key={r.id} delay={(idx % 3) * 70}>
              <figure className="flex h-full flex-col rounded-xl border border-white/[0.07] bg-ink-800 p-6">
                <Stars rating={r.rating} />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-fg">“{r.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.06] text-sm font-semibold text-fg-2" aria-hidden="true">
                    {r.name.split(" ").map((x) => x[0]).join("")}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{r.name}</span>
                    <span className="block text-xs text-fg-3">{r.city} · {r.product}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
export function FAQList({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-white/[0.07] rounded-xl border border-white/[0.07] bg-ink-800">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <h3>
              <button
                type="button"
                id={`faq-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-[60px] w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-medium text-fg hover:bg-white/[0.02]"
              >
                {f.q}
                <IconChevronDown size={18} className={cn("shrink-0 text-fg-3 transition-transform duration-200", isOpen && "rotate-180")} />
              </button>
            </h3>
            <div
              id={`faq-a-${i}`}
              role="region"
              aria-labelledby={`faq-q-${i}`}
              className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-fg-2">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="scroll-mt-20 py-20 sm:py-24" aria-labelledby="faq-title">
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions, answered" subtitle="Can't find what you're looking for? Our design team replies on WhatsApp within the hour, Mon–Sat." />
        </Reveal>
        <Reveal>
          <FAQList items={FAQS} />
        </Reveal>
      </Container>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */
export function FinalCTA() {
  return (
    <section className="pb-20 sm:pb-24" aria-labelledby="cta-title">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-850">
            <div className="grid items-center gap-6 lg:grid-cols-2">
              <div className="p-8 sm:p-12">
                <h2 id="cta-title" className="font-display text-3xl font-semibold leading-tight tracking-[-0.025em] sm:text-5xl">
                  Your words.
                  <br />
                  Lit up for years.
                </h2>
                <p className="mt-4 max-w-md text-fg-2">
                  Design it in two minutes, approve a free mockup, and we'll handcraft it in our studio. No design skills needed.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink to="/customize" size="lg">Create Your Neon <IconArrowRight size={18} /></ButtonLink>
                  <ButtonLink to="/shop" size="lg" variant="secondary">Browse templates</ButtonLink>
                </div>
              </div>
              <div className="lg:h-full">
                <NeonPreview text="Your Name Here" font="neon" colour="pink" size="Large" className="lg:h-full lg:min-h-[400px] lg:aspect-auto" label="Pink neon sign reading Your Name Here" />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
