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
        src="/hero-workshop-v4.png?v=6"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,2,12,0.92) 0%, rgba(5,2,12,0.80) 25%, rgba(5,2,12,0.40) 52%, rgba(5,2,12,0.12) 78%, rgba(5,2,12,0.12) 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />
    </div>
  );
}

function MountedNeon({ i }: { i: number }) {
  const s = SHOWCASE[i];
  return (
    <div className="relative">
      <div
        style={{
          transform: "perspective(1400px) rotateY(-6deg) rotateX(1deg)",
          transformOrigin: "50% 50%",
          filter: "drop-shadow(0 12px 40px rgba(0,0,0,0.55))",
        }}
      >
        <NeonPreview
          key={i}
          variant="hero"
          text={s.text}
          font={s.font}
          colour={s.colour}
          size="Large"
          backing="Cut to Shape (No Backing)"
          label={`Example neon sign reading ${s.text}`}
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
      <Container className="relative flex items-center py-20 sm:py-24 lg:py-28">
        <div className="relative z-20 w-full max-w-[560px] xl:max-w-[600px]">
          <p className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-medium text-fg-2 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_#FF3EA5]" />
            Custom LED neon · Handcrafted in India
          </p>
          <h1
            id="hero-title"
            className="font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.035em] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)] sm:text-7xl lg:text-[84px]"
          >
            Design Your Neon.
            <br />
            <span className="text-white/75">We Build It.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
            Create a custom LED neon sign for your cafe, business, home, studio or special event.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/customize" size="lg">
              Create Your Neon <IconArrowRight size={18} />
            </ButtonLink>
            <ButtonLink
              to="/shop"
              size="lg"
              variant="secondary"
              className="border-white/30 bg-black/40 backdrop-blur-md hover:bg-black/60"
            >
              Explore Designs
            </ButtonLink>
          </div>
          <p className="mt-7 text-[13px] text-white/75">
            Handcrafted in India · 12-month warranty · Ships pan-India in 7–10 days
          </p>
          <div className="mt-4 flex items-center gap-2 text-[13px] text-white/85">
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

        {/* Desktop */}
        <div className="pointer-events-none absolute right-[1%] top-[40%] z-10 hidden w-[38%] max-w-[560px] -translate-y-1/2 xl:right-[2%] xl:block 2xl:max-w-[600px]">
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

        {/* Laptop */}
        <div className="pointer-events-none absolute right-0 top-[42%] z-10 hidden w-[36%] max-w-[440px] -translate-y-1/2 lg:block xl:right-0 xl:hidden">
          <MountedNeon i={i} />
        </div>

        {/* Mobile */}
        <div className="relative z-10 mx-auto mt-10 w-full max-w-[480px] lg:hidden">
          <NeonPreview
            key={`m-${i}`}
            variant="hero"
            text={s.text}
            font={s.font}
            colour={s.colour}
            size="Medium"
            backing="Clear Acrylic"
            label={`Example neon sign reading ${s.text}`}
          />
        </div>
      </Container>
    </section>
  );
}
