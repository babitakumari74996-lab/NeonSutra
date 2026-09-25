import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { cn } from "@/utils/cn";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { IconStar } from "./Icons";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variantCls: Record<Variant, string> = {
  primary:
    "bg-fg text-ink-950 hover:bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_30px_-8px_rgba(255,62,165,0.55)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_10px_40px_-6px_rgba(255,62,165,0.75)]",
  secondary: "bg-white/[0.06] text-fg border border-white/10 hover:bg-white/[0.1] hover:border-white/20",
  outline: "border border-white/15 text-fg hover:border-accent-2/70 hover:text-white",
  ghost: "text-fg-2 hover:text-fg hover:bg-white/5",
};
const sizeCls: Record<Size, string> = {
  sm: "min-h-[40px] px-3.5 text-sm",
  md: "min-h-[46px] px-5 text-[15px]",
  lg: "min-h-[52px] px-7 text-base",
};

export function btnClass(variant: Variant = "primary", size: Size = "md", extra?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-[-0.01em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 select-none",
    variantCls[variant],
    sizeCls[size],
    extra
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }
>(({ variant = "primary", size = "md", className, type = "button", ...rest }, ref) => (
  <button ref={ref} type={type} className={btnClass(variant, size, className)} {...rest} />
));
Button.displayName = "Button";

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: LinkProps & { variant?: Variant; size?: Size }) {
  return <Link className={btnClass(variant, size, className)} {...rest} />;
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={cn("reveal", visible && "is-visible", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  as: As = "h2",
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  id?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent-2">{eyebrow}</p>
      )}
      <As id={id} className="font-display text-3xl font-semibold tracking-[-0.02em] text-fg sm:text-4xl">
        {title}
      </As>
      {subtitle && <p className="mt-3 text-base leading-relaxed text-fg-2 sm:text-lg">{subtitle}</p>}
    </div>
  );
}

export function Stars({ rating, size = 14, className }: { rating: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-amber-300", className)} aria-label={`${rating} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((i) => (
        <IconStar key={i} size={size} filled={rating >= i - 0.25} className={rating >= i - 0.25 ? "" : "text-white/25"} />
      ))}
    </span>
  );
}

export function Badge({ children, tone = "default", className }: { children: ReactNode; tone?: "default" | "accent" | "ok" | "warn" | "info"; className?: string }) {
  const tones = {
    default: "bg-white/[0.06] text-fg-2 border-white/10",
    accent: "bg-accent/10 text-accent-2 border-accent/25",
    ok: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25",
    warn: "bg-amber-400/10 text-amber-300 border-amber-400/25",
    info: "bg-sky-400/10 text-sky-300 border-sky-400/25",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide", tones[tone], className)}>
      {children}
    </span>
  );
}

export function DemoTag({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded border border-amber-400/30 bg-amber-400/10 px-1.5 py-px text-[10px] font-bold uppercase tracking-wider text-amber-300", className)}>
      Demo
    </span>
  );
}
