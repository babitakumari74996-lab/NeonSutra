import { SEO } from "@/components/SEO";
import { Container, Reveal, SectionHeading, Stars, ButtonLink } from "@/components/ui";
import { HOME_REVIEWS, PRODUCT_REVIEW_POOL } from "@/data/reviews";
import { IconArrowRight, IconStar, IconWhatsApp } from "@/components/Icons";
import { whatsappLink, shopConfig } from "@/config/shop.config";

const ALL_REVIEWS = [...HOME_REVIEWS, ...PRODUCT_REVIEW_POOL];

const STATS = [
  { n: "4.9", l: "Average rating" },
  { n: "2,400+", l: "Verified reviews" },
  { n: "180+", l: "Cities delivered to" },
  { n: "98%", l: "Customers recommend us" },
];

export default function ReviewsPage() {
  const initials = (name: string) => name.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <SEO
        title={`Customer Reviews | What India is saying about ${shopConfig.brand.name}`}
        description={`Over 2,400 verified customer reviews and a 4.9★ average rating. See what cafes, salons, gyms and homes across India are saying about their ${shopConfig.brand.name} signs.`}
      />

      {/* Hero */}
      <section className="relative border-b border-white/[0.06] bg-ink-900">
        <Container className="py-20 sm:py-28">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-2">Customer love</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.025em] sm:text-6xl">
              Loved across <span className="text-accent-2">180+ cities</span>.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-fg-2">
              From Bandra cafes to Hyderabad salons, Rajouri Garden gyms to Kolkata bedrooms —
              here's what real customers are saying about their {shopConfig.brand.name} signs.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.l} className="rounded-xl border border-white/[0.07] bg-ink-850 p-6">
                  <p className="font-display text-3xl font-semibold sm:text-4xl">{s.n}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {s.l === "Average rating" && <Stars rating={4.9} size={14} />}
                    <p className="text-sm text-fg-2">{s.l}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* All reviews grid */}
      <section className="py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              as="h2"
              eyebrow="Verified reviews"
              title="Real words, from real customers"
            />
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ALL_REVIEWS.map((r, idx) => (
              <Reveal key={r.id} delay={(idx % 3) * 70}>
                <figure className="flex h-full flex-col rounded-xl border border-white/[0.07] bg-ink-900 p-6">
                  <Stars rating={r.rating} />
                  <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-fg">
                    "{r.quote}"
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-4">
                    <span
                      className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.06] text-sm font-semibold text-fg-2"
                      aria-hidden="true"
                    >
                      {initials(r.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{r.name}</span>
                      <span className="block text-xs text-fg-3">
                        {r.city}{r.product ? ` · ${r.product}` : ""}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          {/* Leave a review card */}
          <Reveal delay={100}>
            <div className="mt-14 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-accent/10 via-ink-900 to-ink-900 p-8 sm:p-12">
              <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
                <div>
                  <div className="inline-flex items-center gap-1 text-amber-300">
                    {[1,2,3,4,5].map((i) => <IconStar key={i} size={20} filled />)}
                  </div>
                  <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                    Got a {shopConfig.brand.name} sign?
                  </h2>
                  <p className="mt-3 max-w-lg text-fg-2">
                    We love seeing our signs in the wild. Send us your photo on WhatsApp and we
                    might feature it here — plus, you'll get a ₹500 coupon for your next order.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={whatsappLink(shopConfig.whatsapp.reviewMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-base font-semibold text-white transition-shadow hover:shadow-[0_8px_30px_-8px_rgba(37,211,102,0.6)]"
                    >
                      <IconWhatsApp size={18} /> Send us your review
                    </a>
                    <ButtonLink to="/shop" variant="secondary" size="lg">
                      Browse designs <IconArrowRight size={18} />
                    </ButtonLink>
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-ink-850 p-6 text-sm text-fg-2">
                  <p className="font-semibold text-fg">Why you can trust these reviews</p>
                  <ul className="mt-4 space-y-2 list-disc pl-5">
                    <li>Every review is from a paying customer who ordered through our site.</li>
                    <li>We don't pay for or edit reviews — good or bad.</li>
                    <li>Delivery timelines and product feedback inform our studio improvements.</li>
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
