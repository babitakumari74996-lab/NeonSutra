import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ColourId, FontId } from "@/types";
import { NeonPreview } from "./NeonPreview";
import { ButtonLink, Container } from "./ui";
import { IconArrowRight, IconStar } from "./Icons";
import { getColour } from "@/data/colours";
import { getFont } from "@/data/fonts";

const SHOWCASE: { text: string; font: FontId; colour: ColourId; templateId: string }[] = [
  { text: "Better Together", font: "script", colour: "purple", templateId: "t-better-together" },
  { text: "Good Vibes Only", font: "handwritten", colour: "pink", templateId: "t-good-vibes-only" },
  { text: "Coffee Time", font: "script", colour: "warm-white", templateId: "t-coffee-time" },
  { text: "GAME ON", font: "retro", colour: "blue", templateId: "t-game-on" },
];

function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      <div className="absolute inset-0 bg-[#0a0612]" />
      <img
        src="/hero-workshop-v4.png?v=7"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[68%_center] sm:object-center"
        fetchPriority="high"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,2,12,0.92) 0%, rgba(5,2,12,0.80) 25%, rgba(5,2,12,0.40) 52%, rgba(5,2,12,0.12) 78%, rgba(5,2,12,0.12) 100%)",
        }}
      />
      {/* Mobile/tablet readability wash — hidden on desktop so lg+ pixels stay identical */}
      <div
        className="absolute inset-0 lg:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,2,12,0.72) 0%, rgba(5,2,12,0.55) 34%, rgba(5,2,12,0.32) 62%, rgba(5,2,12,0.55) 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />
    </div>
  );
}

function MountedNeon({ i }: { i: number }) {
  const hex = getColour(SHOWCASE[i].colour).hex;
  return (
    <div className="relative">
      <div
        style={{
          // Same wall plane as the brick behind: slight Y-turn + tiny X-tilt,
          // tight contact shadow + soft ambient, and a colour wash spilling
          // on the bricks behind the tubes (same div, no extra element).
          transform: "perspective(1400px) rotateY(-8deg) rotateX(1deg)",
          transformOrigin: "50% 46%",
          filter:
            "drop-shadow(0 3px 8px rgba(0,0,0,0.85)) drop-shadow(0 16px 34px rgba(0,0,0,0.5))",
          background: `radial-gradient(ellipse 62% 58% at 50% 46%, ${hex}2E 0%, ${hex}14 38%, transparent 70%)`,
        }}
      >
        <NeonPreview
          key={i}
          variant="hero"
          text={SHOWCASE[i].text}
          font={SHOWCASE[i].font}
          colour={SHOWCASE[i].colour}
          size="Large"
          backing="Cut to Shape (No Backing)"
          label={`Example neon sign reading ${SHOWCASE[i].text}`}
          animate
        />
      </div>
    </div>
  );
}

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((x) => (x + 1) % SHOWCASE.length), 4200);
    return () => window.clearInterval(t);
  }, []);
  const s = SHOWCASE[i];

  return (
    <section
      className="relative isolate flex min-h-[92vh] items-center overflow-hidden lg:min-h-[95vh]"
      aria-labelledby="hero-title"
    >
      <HeroBackground />
      <Container className="relative flex flex-col justify-center pb-16 pt-24 sm:pb-24 sm:pt-22 lg:flex-row lg:items-center lg:py-28">
        {/* LEFT — text content, narrower so the neon fits right */}
        <div className="relative z-20 -mt-[72px] w-full max-w-[480px] text-center md:mx-auto md:-mt-20 md:max-w-[640px] lg:mt-0 lg:-ml-12 lg:max-w-[420px] lg:text-left xl:-ml-29 xl:max-w-[480px]">
          <p className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-medium text-fg-2 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_#FF3EA5]" />
            Custom LED neon · Handcrafted in India
          </p>
          <h1
            id="hero-title"
            className="font-display text-[36px] font-semibold leading-[1.04] tracking-[-0.03em] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)] min-[420px]:text-[44px] min-[420px]:leading-[1.02] sm:text-7xl md:text-6xl lg:text-[84px]"
          >
            Design Your Neon.
            <br />
            <span className="text-white/75">We Build It.</span>
          </h1>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/85 min-[420px]:text-base sm:mt-6 sm:text-lg">
            Create a custom LED neon sign for your cafe, business, home, studio or special event.
          </p>
          <div className="mt-7 hidden flex-col items-stretch gap-3 sm:mt-9 sm:flex-row sm:justify-center lg:flex lg:justify-start">
            <ButtonLink to="/customize" size="lg" className="w-full sm:w-auto">
              Create Your Neon <IconArrowRight size={18} />
            </ButtonLink>
            <ButtonLink
              to="/shop"
              size="lg"
              variant="secondary"
              className="w-full border-white/30 bg-black/40 backdrop-blur-md hover:bg-black/60 sm:w-auto"
            >
              Explore Designs
            </ButtonLink>
          </div>
          <p className="mt-7 text-[13px] text-white/75">
            Handcrafted in India · 12-month warranty · Ships pan-India in 7–10 days
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-[13px] text-white/85 lg:justify-start">
            <span className="inline-flex text-amber-300">
              {[0, 1, 2, 3, 4].map((k) => (
                <IconStar key={k} size={14} />
              ))}
            </span>
            <span>
              <strong className="font-semibold text-white">4.9</strong> from 2,400+ customers
            </span>
          </div>
        </div>

        {/* Neon — desktop only, right side (mobile/tablet get the big in-flow billboard below) */}
        <div className="pointer-events-none absolute right-0 top-[34%] z-10 hidden w-[52%] max-w-[720px] -translate-y-1/2 lg:block lg:-right-[12%] lg:max-w-[760px] xl:-right-[10%] xl:max-w-[820px]">
          <MountedNeon i={i} />
          <div className="pointer-events-auto mx-auto mt-1 flex w-fit items-center gap-x-3 rounded-lg border border-white/10 bg-black/55 px-3 py-2 text-xs text-fg-2 backdrop-blur-md">
            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: getColour(s.colour).hex, boxShadow: `0 0 8px ${getColour(s.colour).hex}` }}
              />
              {getColour(s.colour).label} · {getFont(s.font).label}
            </span>
            <Link to={`/customize/${s.templateId}`} className="font-medium text-white hover:text-accent-2">
              Customise this →
            </Link>
          </div>
        </div>

        {/* Mobile + tablet — big billboard under the text (same wall-mounted treatment as desktop) */}
        <div className="relative z-10 mx-auto -mt-1 w-full max-w-[600px] lg:hidden">
          <MountedNeon i={i} />
          <div className="pointer-events-auto mx-auto mt-3 flex w-fit max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-lg border border-white/10 bg-black/55 px-3 py-2 text-xs text-fg-2 backdrop-blur-md">
            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: getColour(s.colour).hex, boxShadow: `0 0 8px ${getColour(s.colour).hex}` }}
              />
              {getColour(s.colour).label} · {getFont(s.font).label}
            </span>
            <Link to={`/customize/${s.templateId}`} className="font-medium text-white hover:text-accent-2">
              Customise this →
            </Link>
          </div>
          {/* Mobile/tablet CTAs under the billboard (desktop keeps the copy in the text column) */}
          <div className="mx-auto mt-7 flex w-full max-w-[400px] flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <ButtonLink to="/customize" size="lg" className="w-full sm:w-auto">
              Create Your Neon <IconArrowRight size={18} />
            </ButtonLink>
            <ButtonLink
              to="/shop"
              size="lg"
              variant="secondary"
              className="w-full border-white/30 bg-black/40 backdrop-blur-md hover:bg-black/60 sm:w-auto"
            >
              Explore Designs
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
