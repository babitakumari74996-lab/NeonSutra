import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Container, Reveal, ButtonLink } from "@/components/ui";
import { FAQS } from "@/data/faqs";
import { IconArrowRight, IconChevronDown, IconMail, IconPhone, IconWhatsApp } from "@/components/Icons";
import { WHATSAPP_DISPLAY, whatsappLink } from "@/utils/helpers";
import { cn } from "@/utils/cn";
import type { FAQItem } from "@/types";

const CATEGORIES = [
  { id: "all", label: "All questions" },
  { id: "ordering", label: "Ordering & pricing" },
  { id: "production", label: "Production & shipping" },
  { id: "product", label: "Product & care" },
  { id: "policies", label: "Returns & warranty" },
];

const FAQ_CATEGORY_MAP: Record<number, string> = {
  0: "production", 1: "production", 2: "ordering", 3: "product",
  4: "product", 5: "policies", 6: "policies", 7: "ordering",
};

function Accordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-white/10 bg-ink-900 p-8 text-center text-fg-2">
        No questions in this category yet. Pick another topic or message us below.
      </p>
    );
  }
  return (
    <div className="divide-y divide-white/[0.07] rounded-xl border border-white/[0.07] bg-ink-900">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-[64px] w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-medium text-fg hover:bg-white/[0.02] sm:px-6"
              >
                {f.q}
                <IconChevronDown size={18} className={cn("shrink-0 text-fg-3 transition-transform duration-200", isOpen && "rotate-180")} />
              </button>
            </h3>
            <div
              role="region"
              className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-[15px] leading-relaxed text-fg-2 sm:px-6">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function FAQPage() {
  const [cat, setCat] = useState("all");
  const filtered = cat === "all" ? FAQS : FAQS.filter((_, i) => FAQ_CATEGORY_MAP[i] === cat);

  return (
    <>
      <SEO
        title="FAQ | Answers about Custom Neon Signs, Shipping & Warranty — NEONSUTRA"
        description="Everything you need to know about ordering, customising, production time, shipping across India, returns and our 12-month warranty on custom LED neon signs."
      />

      {/* Hero */}
      <section className="relative border-b border-white/[0.06] bg-ink-900">
        <Container className="py-20 sm:py-28">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-2">FAQ</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.025em] sm:text-6xl">
              Questions, <span className="text-accent-2">answered.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-fg-2">
              Can't find what you're looking for? Our design team replies on WhatsApp within
              the hour, Monday to Saturday, 10 am – 7 pm IST.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Questions */}
      <section className="py-20 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_2fr] lg:gap-14">
          {/* Category sidebar */}
          <Reveal>
            <div className="lg:sticky lg:top-24">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-fg-3">Browse by topic</p>
              <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0" role="tablist">
                {CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={cat === c.id}
                      onClick={() => setCat(c.id)}
                      className={cn(
                        "whitespace-nowrap rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors lg:w-full",
                        cat === c.id
                          ? "bg-accent/10 text-fg"
                          : "text-fg-2 hover:bg-white/[0.04] hover:text-fg"
                      )}
                    >
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <Accordion items={filtered} />

            {/* Contact strip */}
            <div className="mt-10 rounded-xl border border-white/[0.08] bg-ink-900 p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold">Still stuck?</h2>
              <p className="mt-2 text-sm text-fg-2">
                Our design team is one message away. We're real humans in Bengaluru, not bots.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <a
                  href={whatsappLink("Hi NEONSUTRA! I have a question.")}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-semibold text-white hover:shadow-[0_8px_25px_-8px_rgba(37,211,102,0.5)]"
                >
                  <IconWhatsApp size={16} /> WhatsApp us
                </a>
                <a
                  href="mailto:hello@neonsutra.in"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-fg hover:bg-white/[0.08]"
                >
                  <IconMail size={16} /> Email
                </a>
                <a
                  href={`tel:${WHATSAPP_DISPLAY.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-fg hover:bg-white/[0.08]"
                >
                  <IconPhone size={16} /> Call {WHATSAPP_DISPLAY}
                </a>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/customize" size="lg">Design your neon <IconArrowRight size={18} /></ButtonLink>
              <ButtonLink to="/how-it-works" variant="secondary" size="lg">See how it works</ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
