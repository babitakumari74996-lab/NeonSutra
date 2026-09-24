import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { ColourId, FontId } from "@/types";
import { NeonPreview } from "./NeonPreview";
import { ButtonLink, Container } from "./ui";
import { IconArrowRight, IconStar } from "./Icons";
import { getColour } from "@/data/colours";
import { getFont } from "@/data/fonts";

const SHOWCASE: { text: string; font: FontId; colour: ColourId; templateId: string }[] = [
  { text: "Good Vibes Only", font: "handwritten", colour: "pink", templateId: "t-good-vibes-only" },
  { text: "Coffee Time", font: "script", colour: "warm-white", templateId: "t-coffee-time" },
  { text: "GAME ON", font: "retro", colour: "blue", templateId: "t-game-on" },
  { text: "Better Together", font: "script", colour: "purple", templateId: "t-better-together" },
];

/**
 * Background video fallback chain:
 * 1. /hero-bg.webm (VP9)  2. /hero-bg.mp4 (H.264)  3. /hero-poster.jpg  4. solid #0A0A0B + radial gradient
 * NOTE: keep hero-bg.* under ~4 MB. The bundled demo mp4 is ~3.6 MB; compress further before production if replaced.
 */
function HeroBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOk, setVideoOk] = useState(true);
  const [posterOk, setPosterOk] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true; // required for mobile autoplay
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => undefined); // autoplay blocked → poster stays visible
    const t = window.setTimeout(() => {
      if (v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) setVideoOk(false);
    }, 4000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      {/* 4. Last resort: solid background with subtle radial gradient */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 60% at 60% 40%, rgba(255,62,165,0.10), transparent 70%), #0A0A0B" }}
      />
      {/* 3. Poster image (also shown for reduced-motion users) */}
      {posterOk && (
        <img
          src="/hero-poster.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setPosterOk(false)}
          fetchPriority="high"
        />
      )}
      {/* 1 & 2. Video (hidden via CSS under prefers-reduced-motion) */}
      {videoOk && (
        <video
          ref={videoRef}
          className="hero-video absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterOk ? "/hero-poster.jpg" : undefined}
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          onError={() => setVideoOk(false)}
        >
          <source src="/hero-bg.webm" type="video/webm" />
          <source src="/hero-bg.mp4" type="video/mp4" onError={() => setVideoOk(false)} />
        </video>
      )}
      {/* Readability scrim */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.9) 100%)" }}
      />
      {/* Edge vignette */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink-950" />
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
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden lg:min-h-[82vh]" aria-labelledby="hero-title">
      <HeroBackground />
      <Container className="grid items-center gap-8 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:py-16">
        <div className="max-w-xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-medium text-fg-2 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_#FF3EA5]" />
            Custom LED neon · Handcrafted in India
          </p>
          <h1 id="hero-title" className="font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.035em] text-fg sm:text-6xl lg:text-[68px]">
            Design Your Neon.
            <br />
            <span className="text-fg-2">We Build It.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-fg-2 sm:text-lg">
            Create a custom LED neon sign for your cafe, business, home, studio or special event.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/customize" size="lg">
              Create Your Neon <IconArrowRight size={18} />
            </ButtonLink>
            <ButtonLink to="/shop" size="lg" variant="secondary" className="backdrop-blur">
              Explore Designs
            </ButtonLink>
          </div>
          <p className="mt-6 text-[13px] text-fg-3">
            Handcrafted in India · 12-month warranty · Ships pan-India in 7–10 days
          </p>
          <div className="mt-4 flex items-center gap-2 text-[13px] text-fg-2">
            <span className="inline-flex text-amber-300">
              {[0, 1, 2, 3, 4].map((k) => <IconStar key={k} size={14} />)}
            </span>
            <span><strong className="font-semibold text-fg">4.9</strong> from 2,400+ customers</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[640px]">
          <NeonPreview
            key={i}
            variant="hero"
            text={s.text}
            font={s.font}
            colour={s.colour}
            size="Large"
            backing="Clear Acrylic"
            label={`Example neon sign reading ${s.text}`}
          />
          <div className="mx-auto -mt-2 flex w-fit flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-fg-2 backdrop-blur">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: getColour(s.colour).hex, boxShadow: `0 0 8px ${getColour(s.colour).hex}` }} />
              {getColour(s.colour).label} · {getFont(s.font).label}
            </span>
            <Link to={`/customize/${s.templateId}`} className="font-medium text-fg hover:text-accent-2">
              Customise this →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
