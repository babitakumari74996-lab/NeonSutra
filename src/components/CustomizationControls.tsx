import { useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Customization, Template } from "@/types";
import { FONTS } from "@/data/fonts";
import { COLOURS, getColour } from "@/data/colours";
import { SIZES, BACKINGS, ADDON_PRICES } from "@/data/sizes";
import { IconCheck, IconMinus, IconPlus, IconUpload, IconTrash } from "./Icons";
import { Badge } from "./ui";
import { formatINR } from "@/utils/helpers";
import { processLogo } from "@/utils/processLogo";
import { cn } from "@/utils/cn";

interface Props {
  template: Template;
  c: Customization;
  set: <K extends keyof Customization>(key: K, value: Customization[K]) => void;
  textError?: string | null;
}

export const MAX_CHARS = 20;

function Section({ n, title, aside, children, id }: { n: number; title: string; aside?: ReactNode; children: ReactNode; id?: string }) {
  return (
    <section className="border-b border-white/[0.06] py-6" aria-labelledby={id}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id={id} className="flex items-center gap-2.5 text-sm font-semibold text-fg">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-white/[0.06] text-[11px] font-bold text-fg-2">{n}</span>
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

const optionCls = (active: boolean) =>
  cn(
    "relative rounded-lg border text-left transition-all duration-200",
    active
      ? "border-accent/70 bg-accent/[0.07] shadow-[0_0_0_1px_rgba(255,62,165,0.35),0_0_24px_-8px_rgba(255,62,165,0.5)]"
      : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
  );

export function CustomizationControls({ template, c, set, textError }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fonts = FONTS.filter((f) => template.availableFonts.includes(f.id));
  const colours = COLOURS.filter((x) => template.availableColours.includes(x.id));

  const onFile = async (file: File | undefined) => {
    setUploadError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file (PNG, JPG, SVG or WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("That file is over 5 MB. Please upload a smaller image.");
      return;
    }
    setUploading(true);
    try {
      const url = await processLogo(file);
      set("uploadedLogoDataUrl", url);
      set("uploadedLogoName", file.name);
    } catch {
      setUploadError("We couldn't read that image. Try a PNG or JPG.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  let n = 0;
  return (
    <div>
      {/* 1. Template */}
      <Section n={++n} title="Template" id="ctl-template" aside={<Link to="/shop" className="text-xs font-medium text-accent-2 hover:underline">Change template</Link>}>
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-fg">{template.name}</p>
            <p className="text-xs text-fg-3">{template.id === "custom" ? "Blank canvas — anything goes" : "Fully editable template"}</p>
          </div>
          {template.premiumFont && <Badge>Premium +{formatINR(ADDON_PRICES.premiumFont)}</Badge>}
        </div>
      </Section>

      {/* 2. Text */}
      <Section
        n={++n}
        title="Your text"
        id="ctl-text"
        aside={
          <span className={cn("text-xs tabular-nums", c.text.length >= MAX_CHARS ? "text-amber-300" : "text-fg-3")} aria-live="polite">
            {c.text.length} / {MAX_CHARS}
          </span>
        }
      >
        <label htmlFor="neon-text" className="sr-only">Sign text</label>
        <input
          id="neon-text"
          className="field text-base"
          value={c.text}
          maxLength={MAX_CHARS}
          onChange={(e) => set("text", e.target.value.slice(0, MAX_CHARS))}
          placeholder="Type your words…"
          autoComplete="off"
          aria-invalid={!!textError}
          aria-describedby="neon-text-hint"
        />
        <p id="neon-text-hint" className={cn("mt-2 text-xs", textError ? "text-err" : "text-fg-3")}>
          {textError ?? template.editableHint ?? "Single line, up to 20 characters. Emojis aren't supported in neon."}
        </p>
      </Section>

      {/* 3. Font */}
      <Section n={++n} title="Font" id="ctl-font">
        <div role="radiogroup" aria-labelledby="ctl-font" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 xl:grid-cols-4">
          {fonts.map((f) => {
            const active = c.font === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => set("font", f.id)}
                className={cn(optionCls(active), "flex min-h-[76px] w-[108px] shrink-0 flex-col items-center justify-center gap-1 px-2 py-2.5 sm:w-auto")}
              >
                <span className="text-[22px] leading-none text-fg" style={{ fontFamily: f.family, fontWeight: f.weight }}>
                  {f.id === "retro" ? "AB" : "Neon"}
                </span>
                <span className="text-[11px] text-fg-2">{f.label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* 4. Colour */}
      <Section n={++n} title="Neon colour" id="ctl-colour" aside={<span className="text-xs text-fg-2">{getColour(c.colour).label}</span>}>
        <div role="radiogroup" aria-labelledby="ctl-colour" className="flex flex-wrap gap-2.5">
          {colours.map((col) => {
            const active = c.colour === col.id;
            return (
              <button
                key={col.id}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={col.label}
                title={col.label}
                onClick={() => set("colour", col.id)}
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-full border transition-all duration-200",
                  active ? "scale-105 border-white/70" : "border-white/10 hover:border-white/30"
                )}
              >
                <span
                  className="h-7 w-7 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 50% 45%, ${col.core} 0%, ${col.hex} 55%)`,
                    boxShadow: active ? `0 0 10px ${col.hex}, 0 0 22px ${col.hex}` : `0 0 8px ${col.hex}88`,
                  }}
                />
              </button>
            );
          })}
        </div>
      </Section>

      {/* 5. Size */}
      <Section n={++n} title="Size" id="ctl-size">
        <div role="radiogroup" aria-labelledby="ctl-size" className="grid grid-cols-2 gap-2">
          {SIZES.map((s) => {
            const active = c.size === s.id;
            return (
              <button key={s.id} type="button" role="radio" aria-checked={active} onClick={() => set("size", s.id)} className={cn(optionCls(active), "min-h-[76px] px-3.5 py-3")}>
                <span className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-fg">{s.id}</span>
                  {active && <IconCheck size={16} className="text-accent-2" />}
                </span>
                <span className="mt-0.5 block text-xs text-fg-2">{s.dims} approx.</span>
                <span className="mt-1 block text-xs font-medium text-fg">{formatINR(template.basePriceBySize[s.id])}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* 6. Backing */}
      <Section n={++n} title="Backing" id="ctl-backing">
        <div role="radiogroup" aria-labelledby="ctl-backing" className="grid grid-cols-2 gap-2">
          {BACKINGS.map((b) => {
            const active = c.backing === b.id;
            return (
              <button key={b.id} type="button" role="radio" aria-checked={active} onClick={() => set("backing", b.id)} className={cn(optionCls(active), "flex min-h-[68px] items-start gap-3 px-3.5 py-3")}>
                <span
                  className={cn("mt-0.5 h-7 w-9 shrink-0 rounded-[5px] border", b.id === "Black Acrylic" ? "border-white/10 bg-black" : "border-white/30 bg-white/[0.06]")}
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-fg">{b.id}</span>
                  <span className="block text-xs text-fg-2">{b.price ? `+${formatINR(b.price)}` : "Included"}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* 7. Mounting kit */}
      <Section n={++n} title="Mounting kit" id="ctl-mount">
        <div role="radiogroup" aria-labelledby="ctl-mount" className="grid grid-cols-2 gap-2">
          {[
            { v: true, t: "Yes", s: `+${formatINR(ADDON_PRICES.mountingKit)} · screws, stand-offs & template` },
            { v: false, t: "No", s: "I'll hang it myself" },
          ].map((o) => {
            const active = c.mountingKit === o.v;
            return (
              <button key={o.t} type="button" role="radio" aria-checked={active} onClick={() => set("mountingKit", o.v)} className={cn(optionCls(active), "min-h-[68px] px-3.5 py-3")}>
                <span className="block text-sm font-semibold text-fg">{o.t}</span>
                <span className="block text-xs text-fg-2">{o.s}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* 8. Logo upload */}
      <Section n={++n} title="Upload your logo" id="ctl-logo" aside={template.supportsLogoUpload ? <Badge tone="accent">Recommended</Badge> : <span className="text-xs text-fg-3">Optional</span>}>
        <input ref={fileRef} id="logo-file" type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
        {c.uploadedLogoDataUrl ? (
          <div className="flex items-center gap-3 rounded-lg border border-emerald-400/25 bg-emerald-400/[0.05] p-3">
            <img src={c.uploadedLogoDataUrl} alt={`Uploaded logo: ${c.uploadedLogoName ?? "logo"}`} className="h-12 w-12 shrink-0 rounded-md bg-black object-contain p-1" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-emerald-300">Logo uploaded ✓</p>
              <p className="truncate text-xs text-fg-2">{c.uploadedLogoName}</p>
            </div>
            <button type="button" onClick={() => fileRef.current?.click()} className="min-h-[40px] rounded-md px-2 text-xs font-medium text-fg-2 hover:text-fg">Replace</button>
            <button
              type="button"
              onClick={() => { set("uploadedLogoDataUrl", null); set("uploadedLogoName", null); }}
              className="grid h-10 w-10 place-items-center rounded-md text-fg-3 hover:bg-white/5 hover:text-err"
              aria-label="Remove logo"
            >
              <IconTrash size={16} />
            </button>
          </div>
        ) : (
          <label
            htmlFor="logo-file"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }}
            className="flex min-h-[84px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/15 bg-white/[0.02] px-4 py-4 text-center transition-colors hover:border-white/30 hover:bg-white/[0.04]"
          >
            <IconUpload size={20} className="text-fg-2" />
            <span className="text-sm font-medium text-fg">{uploading ? "Processing…" : "Click or drop an image"}</span>
            <span className="text-xs text-fg-3">PNG, JPG, SVG or WebP · up to 5 MB</span>
          </label>
        )}
        {uploadError && <p className="mt-2 text-xs text-err" role="alert">{uploadError}</p>}
        <p className="mt-2 text-xs text-fg-3">Final artwork will be reviewed before production.</p>
        {c.uploadedLogoDataUrl && (
          <div className="mt-4">
            <label htmlFor="logo-colour" className="block text-xs font-medium text-fg-2 mb-2">Logo colour</label>
            <div role="radiogroup" aria-labelledby="ctl-logo-colour" className="flex flex-wrap gap-2">
              {COLOURS.map((col) => {
                const active = c.logoColour === col.id;
                return (
                  <button
                    key={col.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={col.label}
                    title={col.label}
                    onClick={() => set("logoColour", active ? null : col.id)}
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-full border transition-all duration-200",
                      active ? "scale-105 border-white/70 ring-2 ring-accent/50" : "border-white/10 hover:border-white/30"
                    )}
                  >
                    <span
                      className="h-6 w-6 rounded-full"
                      style={{
                        background: `radial-gradient(circle at 50% 45%, ${col.core} 0%, ${col.hex} 55%)`,
                        boxShadow: active ? `0 0 10px ${col.hex}, 0 0 22px ${col.hex}` : `0 0 8px ${col.hex}88`,
                      }}
                    />
                    {!active && <IconCheck size={14} className="text-accent-2" />}
                  </button>
                );
              })}
              <button
                type="button"
                role="radio"
                aria-checked={c.logoColour === null}
                onClick={() => set("logoColour", null)}
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full border transition-all duration-200",
                  c.logoColour === null ? "scale-105 border-white/70 ring-2 ring-accent/50" : "border-white/10 hover:border-white/30"
                )}
                title="Match neon text colour"
              >
                <span className="flex items-center justify-center gap-1 text-xs text-fg-2">
                  <IconCheck size={12} className={c.logoColour === null ? "text-accent-2" : "invisible"} />
                  <span>AUTO</span>
                </span>
              </button>
            </div>
            <p className="mt-1.5 text-xs text-fg-3">AUTO = matches neon text colour. Pick a colour to override.</p>
          </div>
        )}
      </Section>

      {/* 9. Quantity */}
      <Section n={++n} title="Quantity" id="ctl-qty">
        <div className="inline-flex items-center rounded-lg border border-white/10" role="group" aria-labelledby="ctl-qty">
          <button type="button" className="grid h-11 w-11 place-items-center text-fg-2 hover:text-fg disabled:opacity-30" onClick={() => set("quantity", Math.max(1, c.quantity - 1))} disabled={c.quantity <= 1} aria-label="Decrease quantity">
            <IconMinus size={18} />
          </button>
          <span className="w-12 text-center text-base font-semibold tabular-nums" aria-live="polite">{c.quantity}</span>
          <button type="button" className="grid h-11 w-11 place-items-center text-fg-2 hover:text-fg disabled:opacity-30" onClick={() => set("quantity", Math.min(20, c.quantity + 1))} disabled={c.quantity >= 20} aria-label="Increase quantity">
            <IconPlus size={18} />
          </button>
        </div>
        <p className="mt-2 text-xs text-fg-3">Ordering 5+ for a chain or event? Our team can share bulk pricing.</p>
      </Section>
    </div>
  );
}
