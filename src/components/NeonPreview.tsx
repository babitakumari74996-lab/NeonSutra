import { memo, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { BackingOption, ColourId, FontId, SizeOption } from "@/types";
import { getColour } from "@/data/colours";
import { displayText, getFont } from "@/data/fonts";
import { getSize } from "@/data/sizes";
import { cn } from "@/utils/cn";

interface Props {
  text: string;
  font: FontId;
  colour: ColourId;
  size?: SizeOption;
  backing?: BackingOption;
  logoUrl?: string | null;
  /** full = large framed wall, card = catalogue thumbnail, hero = transparent over video */
  variant?: "full" | "card" | "hero";
  animate?: boolean;
  showDimensions?: boolean;
  className?: string;
  label?: string;
}

const FONT_SIZE = 120;

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

function NeonPreviewBase({
  text,
  font,
  colour,
  size = "Medium",
  backing = "Clear Acrylic",
  logoUrl = null,
  variant = "full",
  animate = true,
  showDimensions = false,
  className,
  label,
}: Props) {
  const rawId = useId();
  const uid = "n" + rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const f = getFont(font);
  const c = getColour(colour);
  const s = getSize(size);
  const isPlaceholder = text.trim().length === 0;
  const shown = displayText(isPlaceholder ? "Your Text" : text, font);

  const textRef = useRef<SVGTextElement>(null);
  const [box, setBox] = useState<Box>({ x: -shown.length * 36, y: -60, width: shown.length * 72, height: 120 });

  const measure = useCallback(() => {
    const el = textRef.current;
    if (!el) return;
    try {
      const b = el.getBBox();
      if (b.width > 0 && b.height > 0) {
        setBox((prev) =>
          Math.abs(prev.width - b.width) < 0.5 && Math.abs(prev.height - b.height) < 0.5 && Math.abs(prev.x - b.x) < 0.5
            ? prev
            : { x: b.x, y: b.y, width: b.width, height: b.height }
        );
      }
    } catch {
      /* getBBox can throw when not rendered */
    }
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [shown, font, measure]);

  // Re-measure once the decorative web font is actually available.
  useEffect(() => {
    let cancelled = false;
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (!fonts) return;
    fonts
      .load(`${f.weight} ${FONT_SIZE}px ${f.family}`, shown)
      .then(() => !cancelled && measure())
      .catch(() => undefined);
    fonts.ready.then(() => !cancelled && measure()).catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [f.family, f.weight, shown, measure]);

  // ---------- Layout maths (viewBox units) ----------
  const vbW = 1000;
  const vbH = variant === "card" ? 750 : variant === "hero" ? 640 : 625;
  const cx = vbW / 2;
  const cy = variant === "card" ? vbH * 0.47 : vbH * 0.46;

  const L = logoUrl ? FONT_SIZE * 1.15 : 0;
  const gap = logoUrl ? 26 : 0;
  const top = logoUrl ? box.y - gap - L : box.y;
  const bottom = box.y + box.height;
  const left = Math.min(box.x, -L / 2);
  const right = Math.max(box.x + box.width, L / 2);
  const contentW = right - left;
  const contentH = bottom - top;
  const pad = 46;

  const sizeScale = variant === "card" ? Math.min(0.9, s.scale + 0.12) : s.scale;
  const maxW = vbW * sizeScale - pad * 2 * 0.6;
  const maxH = vbH * (0.22 + sizeScale * 0.36);
  const scale = Math.min(maxW / contentW, maxH / contentH);

  const ccx = (left + right) / 2;
  const ccy = (top + bottom) / 2;
  const transform = `translate(${cx} ${cy}) scale(${scale}) translate(${-ccx} ${-ccy})`;

  const plateW = (contentW + pad * 2) * scale;
  const plateH = (contentH + pad * 2) * scale;
  const plateX = cx - plateW / 2;
  const plateY = cy - plateH / 2;
  const plateR = Math.min(22, plateH * 0.12);
  const plateBottom = plateY + plateH;

  const haloBlur = 15;
  const glowBlur = 4.5;
  const lit = isPlaceholder ? 0.35 : 1;

  const textProps = {
    x: 0,
    y: 0,
    textAnchor: "middle" as const,
    dominantBaseline: "central" as const,
    fontSize: FONT_SIZE,
    style: {
      fontFamily: f.family,
      fontWeight: f.weight,
      letterSpacing: `${f.letterSpacing}em`,
    },
  };

  const showWall = variant !== "hero";
  const wireX = cx + plateW * 0.28;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        showWall && "wall-texture",
        variant === "card" ? "aspect-[4/3]" : variant === "hero" ? "aspect-[25/16]" : "aspect-[16/10]",
        className
      )}
      role="img"
      aria-label={
        label ??
        `Live preview of a ${c.label.toLowerCase()} LED neon sign reading "${shown}" in ${f.label} font, ${size}, on ${backing.toLowerCase()}`
      }
    >
      <svg viewBox={`0 0 ${vbW} ${vbH}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}-spill`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c.hex} stopOpacity={variant === "hero" ? 0.3 : 0.38} />
            <stop offset="45%" stopColor={c.hex} stopOpacity={0.12} />
            <stop offset="100%" stopColor={c.hex} stopOpacity={0} />
          </radialGradient>
          <linearGradient id={`${uid}-wire`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2a30" />
            <stop offset="100%" stopColor="#1a1a1e" stopOpacity={0.4} />
          </linearGradient>
          <filter id={`${uid}-halo`} x="-40%" y="-80%" width="180%" height="260%">
            <feGaussianBlur stdDeviation={haloBlur} />
          </filter>
          <filter id={`${uid}-glow`} x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={glowBlur} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`${uid}-soft`} x="-10%" y="-20%" width="120%" height="140%">
            <feGaussianBlur stdDeviation={0.6} />
          </filter>
          <filter id={`${uid}-shadow`} x="-20%" y="-20%" width="140%" height="160%">
            <feGaussianBlur stdDeviation={10} />
          </filter>
          <filter id={`${uid}-logo`} x="-30%" y="-30%" width="160%" height="160%">
            <feFlood floodColor={c.hex} result="col" />
            <feComposite in="col" in2="SourceAlpha" operator="in" result="tinted" />
            <feFlood floodColor={c.core} result="coreCol" />
            <feComposite in="coreCol" in2="SourceAlpha" operator="in" result="core" />
            <feGaussianBlur in="tinted" stdDeviation={7} result="gl" />
            <feMerge>
              <feMergeNode in="gl" />
              <feMergeNode in="gl" />
              <feMergeNode in="tinted" />
              <feMergeNode in="core" />
            </feMerge>
          </filter>
        </defs>

        {/* Coloured light spilling onto the wall */}
        <g className={cn(animate && "neon-flicker")} style={{ opacity: lit }}>
          <ellipse
            cx={cx}
            cy={cy}
            rx={plateW * 0.78 + 90}
            ry={plateH * 1.25 + 90}
            fill={`url(#${uid}-spill)`}
            className={animate ? "neon-breathe" : undefined}
          />
        </g>

        {/* Mounting wire */}
        {showWall && (
          <path
            d={`M ${wireX} ${plateBottom - 4} C ${wireX} ${plateBottom + 50}, ${wireX + 40} ${plateBottom + 60}, ${wireX + 46} ${vbH + 10}`}
            stroke={`url(#${uid}-wire)`}
            strokeWidth={3.2}
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* Acrylic backing */}
        {backing === "Black Acrylic" ? (
          <g>
            <rect x={plateX + 6} y={plateY + 14} width={plateW} height={plateH} rx={plateR} fill="#000" opacity={0.55} filter={`url(#${uid}-shadow)`} />
            <rect x={plateX} y={plateY} width={plateW} height={plateH} rx={plateR} fill="#08080a" stroke="rgba(255,255,255,0.08)" strokeWidth={1.2} />
            <rect x={plateX + 2} y={plateY + 2} width={plateW - 4} height={plateH * 0.35} rx={plateR} fill="rgba(255,255,255,0.025)" />
          </g>
        ) : (
          <g>
            <rect x={plateX} y={plateY} width={plateW} height={plateH} rx={plateR} fill="rgba(255,255,255,0.022)" stroke="rgba(255,255,255,0.13)" strokeWidth={1.1} />
            <path
              d={`M ${plateX + plateR} ${plateY + 1.5} L ${plateX + plateW * 0.45} ${plateY + 1.5}`}
              stroke="rgba(255,255,255,0.28)"
              strokeWidth={1.4}
              strokeLinecap="round"
            />
          </g>
        )}
        {/* Stand-off screws */}
        {[
          [plateX + 16, plateY + 16],
          [plateX + plateW - 16, plateY + 16],
          [plateX + 16, plateBottom - 16],
          [plateX + plateW - 16, plateBottom - 16],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={5.5} fill="#3a3a42" />
            <circle cx={x - 1.2} cy={y - 1.2} r={2.2} fill="#8a8a94" opacity={0.7} />
          </g>
        ))}

        {/* The sign itself */}
        <g transform={transform} className={cn(animate && "neon-flicker")} style={{ opacity: lit }}>
          {/* Outer halo */}
          <g className={animate ? "neon-breathe" : "neon-halo-static"}>
            <text {...textProps} fill={c.hex} stroke={c.hex} strokeWidth={9} strokeLinejoin="round" filter={`url(#${uid}-halo)`}>
              {shown}
            </text>
          </g>
          {/* Tube glow */}
          <text {...textProps} fill={c.hex} stroke={c.hex} strokeWidth={3.5} strokeLinejoin="round" filter={`url(#${uid}-glow)`}>
            {shown}
          </text>
          {/* Near-white core */}
          <text
            ref={textRef}
            {...textProps}
            fill={c.core}
            stroke={c.hex}
            strokeOpacity={0.55}
            strokeWidth={1.2}
            paintOrder="stroke"
            filter={`url(#${uid}-soft)`}
          >
            {shown}
          </text>

          {logoUrl && (
            <image
              href={logoUrl}
              x={-L / 2}
              y={box.y - gap - L}
              width={L}
              height={L}
              preserveAspectRatio="xMidYMid meet"
              filter={`url(#${uid}-logo)`}
            />
          )}
        </g>

        {/* Dimension guide */}
        {showDimensions && (
          <g opacity={0.55}>
            <line x1={plateX} x2={plateX + plateW} y1={plateY - 26} y2={plateY - 26} stroke="#A1A1AA" strokeWidth={1} />
            <line x1={plateX} x2={plateX} y1={plateY - 32} y2={plateY - 20} stroke="#A1A1AA" strokeWidth={1} />
            <line x1={plateX + plateW} x2={plateX + plateW} y1={plateY - 32} y2={plateY - 20} stroke="#A1A1AA" strokeWidth={1} />
            <rect x={cx - 52} y={plateY - 40} width={104} height={28} rx={6} fill="#101012" />
            <text x={cx} y={plateY - 26} textAnchor="middle" dominantBaseline="central" fontSize={16} fill="#D4D4D8" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
              ≈ {s.dims.split(" × ")[0]} wide
            </text>
          </g>
        )}
      </svg>
      {showWall && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)" }}
        />
      )}
    </div>
  );
}

export const NeonPreview = memo(NeonPreviewBase);
export default NeonPreview;
