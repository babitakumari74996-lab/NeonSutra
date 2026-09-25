import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Customization, Template } from "@/types";
import { SEO } from "@/components/SEO";
import { NeonPreview } from "@/components/NeonPreview";
import { CustomizationControls } from "@/components/CustomizationControls";
import { PriceBreakdownTable, PriceNote } from "@/components/PriceCalculator";
import { WhatsAppInline } from "@/components/WhatsAppCTA";
import { Button, btnClass } from "@/components/ui";
import { IconChevronDown, IconWhatsApp, IconArrowRight } from "@/components/Icons";
import { CUSTOM_TEMPLATE, getTemplateById } from "@/data/templates";
import { getColour } from "@/data/colours";
import { getFont } from "@/data/fonts";
import { getSize } from "@/data/sizes";
import { useCustomizer } from "@/hooks/useCustomizer";
import { usePricing } from "@/hooks/usePricing";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { setWhatsAppMessage } from "@/hooks/useSectionNav";
import { customizationSummary, formatINR } from "@/utils/helpers";
import { whatsappLink, shopConfig } from "@/config/shop.config";
import { cn } from "@/utils/cn";

export default function CustomizerPage() {
  const { templateId } = useParams();
  const [params] = useSearchParams();
  const editId = params.get("edit");
  const { getItem } = useCart();

  const found = getTemplateById(templateId);
  const template = found ?? CUSTOM_TEMPLATE;
  const editItem = editId ? getItem(editId) : undefined;
  const validEdit = editItem && editItem.customization.templateId === template.id ? editItem : undefined;

  return (
    <Customizer
      key={`${template.id}:${validEdit?.lineId ?? "new"}`}
      template={template}
      initial={validEdit?.customization}
      editLineId={validEdit?.lineId}
      unknownTemplate={!!templateId && !found}
    />
  );
}

function Customizer({
  template,
  initial,
  editLineId,
  unknownTemplate,
}: {
  template: Template;
  initial?: Customization;
  editLineId?: string;
  unknownTemplate: boolean;
}) {
  const { c, set, reset, clearDraft } = useCustomizer(template, initial, !editLineId);
  const price = usePricing(c, template);
  const { addItem, updateItem, openDrawer } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [textError, setTextError] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const summary = useMemo(() => customizationSummary(c, template.name), [c, template.name]);
  const waMsg = shopConfig.whatsapp.customizerMessage(summary, formatINR(price.lineTotal));

  useEffect(() => {
    setWhatsAppMessage(waMsg);
    return () => setWhatsAppMessage("");
  }, [waMsg]);

  useEffect(() => {
    if (textError && (c.text.trim() || c.uploadedLogoDataUrl)) setTextError(null);
  }, [c.text, c.uploadedLogoDataUrl, textError]);

  const submit = () => {
    if (!c.text.trim() && !c.uploadedLogoDataUrl) {
      setTextError("Add some text (or upload a logo) before adding to cart.");
      document.getElementById("neon-text")?.focus();
      return;
    }
    const clean = { ...c, text: c.text.trim() || "Logo only" };
    if (editLineId) {
      updateItem(editLineId, clean);
      showToast({ message: "Cart item updated" });
      navigate("/cart");
    } else {
      addItem(clean);
      clearDraft();
      showToast({ message: `Added “${clean.text}” to your cart` });
      openDrawer();
    }
  };

  const buyNow = () => {
    if (!c.text.trim() && !c.uploadedLogoDataUrl) {
      setTextError("Add some text (or upload a logo) before buying.");
      document.getElementById("neon-text")?.focus();
      return;
    }
    const clean = { ...c, text: c.text.trim() || "Logo only" };
    if (editLineId) {
      updateItem(editLineId, clean);
      showToast({ message: "Cart item updated" });
    } else {
      addItem(clean);
      clearDraft();
      showToast({ message: `Added “${clean.text}” — proceeding to checkout` });
    }
    navigate("/checkout");
  };

  const col = getColour(c.colour);
  const title = editLineId ? "Edit your neon sign" : template.id === "custom" ? "Design your own neon sign" : `Customise ${template.name}`;
  const ctaLabel = editLineId ? "Update Cart Item" : "Add to Cart";

  return (
    <>
      <SEO
        title={`${title} | Live Neon Customiser — ${shopConfig.brand.name}`}
        description="Design your custom LED neon sign with a live preview. Choose text, font, colour, size, backing and mounting — see the estimated price instantly."
      />
      <div className="mx-auto grid w-full max-w-[1600px] lg:grid-cols-[minmax(380px,2fr)_3fr]">
        {/* PREVIEW — first on mobile/tablet, right on desktop */}
        <div className="sticky top-16 z-20 order-1 border-b border-white/[0.06] bg-ink-950 md:static lg:sticky lg:top-16 lg:order-2 lg:h-[calc(100vh-4rem)] lg:border-b-0 lg:border-l">
          <div className="relative h-full">
            <NeonPreview
              text={c.text}
              font={c.font}
              colour={c.colour}
              size={c.size}
              backing={c.backing}
              logoUrl={c.uploadedLogoDataUrl}
              logoColour={c.logoColour}
              showDimensions
              className="aspect-[16/9] md:aspect-[16/10] lg:aspect-auto lg:h-full"
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3 sm:p-5">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-black/50 px-2 py-1 text-[11px] font-medium text-fg-2 backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live preview
              </span>
              <span className="hidden rounded-md border border-white/10 bg-black/50 px-2 py-1 text-[11px] text-fg-2 backdrop-blur sm:inline">
                {c.size} · {getSize(c.size).dims}
              </span>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden items-end justify-between p-5 md:flex">
              <p className="rounded-md border border-white/10 bg-black/50 px-2.5 py-1.5 text-xs text-fg-2 backdrop-blur">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ background: col.hex, boxShadow: `0 0 8px ${col.hex}` }} />
                {col.label} · {getFont(c.font).label} · {c.backing}
              </p>
              <p className="rounded-md border border-white/10 bg-black/50 px-2.5 py-1.5 text-[11px] text-fg-3 backdrop-blur">Preview is indicative. Final mockup shared before production.</p>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="order-2 flex min-w-0 flex-col lg:order-1 lg:h-[calc(100vh-4rem)]">
          <div className="flex-1 px-4 pb-8 pt-6 sm:px-6 lg:overflow-y-auto lg:px-8">
            <nav aria-label="Breadcrumb" className="text-xs text-fg-3">
              <ol className="flex flex-wrap gap-1.5">
                <li><Link to="/" className="hover:text-fg">Home</Link></li>
                <li aria-hidden>/</li>
                <li><Link to="/shop" className="hover:text-fg">Shop</Link></li>
                <li aria-hidden>/</li>
                <li className="text-fg-2">Customiser</li>
              </ol>
            </nav>
            <h1 className="mt-3 font-display text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{title}</h1>
            <p className="mt-1.5 text-sm text-fg-2">Every change updates the preview and price instantly.</p>
            {unknownTemplate && (
              <p className="mt-4 rounded-lg border border-amber-400/25 bg-amber-400/[0.06] px-3 py-2 text-xs text-amber-200" role="status">
                We couldn't find that template, so we've opened a blank canvas for you.
              </p>
            )}
            {editLineId && (
              <p className="mt-4 rounded-lg border border-sky-400/25 bg-sky-400/[0.06] px-3 py-2 text-xs text-sky-200" role="status">
                You're editing an item already in your cart. Saving will update that item — no duplicate is created.
              </p>
            )}

            <CustomizationControls template={template} c={c} set={set} textError={textError} />

            {/* Inline price breakdown */}
            <section className="py-6" aria-labelledby="price-title">
              <h2 id="price-title" className="mb-4 text-sm font-semibold">Estimated Price</h2>
              <div className="rounded-xl border border-white/[0.08] bg-ink-800 p-4 sm:p-5">
                <PriceBreakdownTable p={price} size={c.size} />
                <div className="mt-3"><PriceNote /></div>
              </div>
              <button type="button" onClick={reset} className="mt-3 min-h-[40px] text-xs font-medium text-fg-3 underline-offset-4 hover:text-fg hover:underline">
                {editLineId ? "Revert to saved cart item" : "Reset to template defaults"}
              </button>
            </section>

            {/* WhatsApp help */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5">
              <p className="text-sm font-semibold">Need help designing?</p>
              <p className="mt-1 text-sm text-fg-2">Our design team can suggest fonts, sizes and colours for your space.</p>
              <a
                href={whatsappLink(waMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className={btnClass("secondary", "sm", "mt-3 border-emerald-400/25 hover:border-emerald-400/50")}
              >
                <IconWhatsApp size={16} className="text-emerald-400" /> Chat with our Design Team
              </a>
              <div className="mt-3">
                <WhatsAppInline message={waMsg} />
              </div>
            </div>
          </div>

          {/* Desktop pinned price bar */}
          <div className="sticky bottom-0 hidden border-t border-white/[0.08] bg-ink-900/95 px-8 py-4 backdrop-blur lg:block">
            <AnimatePresence initial={false}>
              {showBreakdown && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pb-4"><PriceBreakdownTable p={price} size={c.size} /></div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center justify-between gap-4">
              <button type="button" onClick={() => setShowBreakdown((v) => !v)} className="min-w-0 text-left" aria-expanded={showBreakdown}>
                <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-3">
                  Estimated Price <IconChevronDown size={14} className={cn("transition-transform", showBreakdown && "rotate-180")} />
                </span>
                <span className="font-display text-2xl font-semibold tabular-nums">{formatINR(price.lineTotal)}</span>
                <span className="ml-2 text-xs text-fg-3">{price.quantity > 1 ? `${formatINR(price.unitPrice)} × ${price.quantity}` : "incl. GST"}</span>
              </button>
              <div className="flex items-center gap-3 shrink-0">
                <Button size="lg" variant="secondary" onClick={submit} className="shrink-0">
                  {ctaLabel} <IconArrowRight size={18} />
                </Button>
                <Button size="lg" onClick={buyNow} className="shrink-0">
                  Buy Now <IconArrowRight size={18} />
                </Button>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-fg-3">Final price may vary based on final artwork. Our design team confirms before production.</p>
          </div>
        </div>
      </div>

      {/* Mobile / tablet fixed price bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.08] bg-ink-900/95 px-4 py-3 backdrop-blur lg:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-3">Estimated Price</p>
            <p className="font-display text-xl font-semibold tabular-nums">{formatINR(price.lineTotal)}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" onClick={submit} className="shrink-0">{ctaLabel}</Button>
            <Button onClick={buyNow} className="shrink-0">Buy Now</Button>
          </div>
        </div>
      </div>
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </>
  );
}
