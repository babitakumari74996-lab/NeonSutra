import { SEO } from "@/components/SEO";
import { Hero } from "@/components/Hero";
import { Link } from "react-router-dom";
import {
  TrustBadges, DesignsSection, ShopByCategory, WhyChooseUs, FeaturedCarousel, FinalCTA,
} from "@/components/HomeSections";
import { Container, Reveal, SectionHeading, Stars } from "@/components/ui";
import { IconArrowRight } from "@/components/Icons";
import { HOME_REVIEWS } from "@/data/reviews";
import { shopConfig } from "@/config/shop.config";

export default function Home() {
  return (
    <>
      <SEO
        title={shopConfig.seo.defaultTitle}
        description={shopConfig.seo.defaultDescription}
      />
      <Hero />
      <TrustBadges />
      <DesignsSection />
      <ShopByCategory />
      <WhyChooseUs />
      <FeaturedCarousel />

      <section className="border-y border-white/[0.06] bg-ink-900 py-20 sm:py-24" aria-labelledby="home-reviews-title">
        <Container>
          <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              id="home-reviews-title"
              eyebrow="Customer reviews"
              title="Loved in 180+ cities"
              subtitle="A peek at what our customers are saying. Read all 2,400+ reviews on our reviews page."
            />
            <Link to="/reviews" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-fg-2 hover:text-fg">
              All reviews <IconArrowRight size={16} />
            </Link>
          </Reveal>

          <Reveal className="mt-10 flex items-center gap-4 rounded-xl border border-white/[0.07] bg-ink-800 px-5 py-4 sm:w-fit">
            <span className="font-display text-4xl font-semibold">4.9</span>
            <div>
              <Stars rating={4.9} size={16} />
              <p className="mt-1 text-xs text-fg-3">Based on 2,400+ verified reviews</p>
            </div>
          </Reveal>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {HOME_REVIEWS.slice(0, 3).map((r, idx) => (
              <Reveal key={r.id} delay={idx * 70}>
                <figure className="flex h-full flex-col rounded-xl border border-white/[0.07] bg-ink-800 p-6">
                  <Stars rating={r.rating} />
                  <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-fg">"{r.quote}"</blockquote>
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

      <section className="py-20 sm:py-24">
        <Container className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <Link to="/how-it-works" className="group block h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-accent/10 to-ink-900 p-8 transition-colors hover:border-accent/30 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-2">How it works</p>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                From idea to glowing wall in four steps
              </h2>
              <p className="mt-3 text-fg-2">
                Pick a design, customise it live, approve a free mockup, and we handcraft and ship
                your sign across India in 7–10 days.
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-fg group-hover:text-accent-2">
                See the full process <IconArrowRight size={16} />
              </span>
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <Link to="/faq" className="group block h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900 p-8 transition-colors hover:border-white/20 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-2">FAQ</p>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Questions, answered
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-fg-2">
                <li>• How long does production take?</li>
                <li>• Do you ship across India?</li>
                <li>• Can I use my own logo?</li>
                <li>• What's the warranty?</li>
                <li>• Can I return a custom sign?</li>
              </ul>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-fg group-hover:text-accent-2">
                Read all questions <IconArrowRight size={16} />
              </span>
            </Link>
          </Reveal>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
