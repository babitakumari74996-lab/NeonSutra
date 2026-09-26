import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { ColourId, SizeOption } from "@/types";
import { SEO } from "@/components/SEO";
import { NeonPreview } from "@/components/NeonPreview";
import { ProductCard, LOGO_PLACEHOLDER } from "@/components/ProductCard";
import { WhatsAppInline } from "@/components/WhatsAppCTA";
import { Badge, Button, ButtonLink, Container, Stars } from "@/components/ui";
import { IconCheck, IconTruck, IconShield, IconBolt, IconRuler, IconArrowRight } from "@/components/Icons";
import { PRODUCTS, relatedProducts } from "@/data/products";
import { getCategory } from "@/data/categories";
import { COLOURS, getColour } from "@/data/colours";
import { getFont } from "@/data/fonts";
import { SIZES } from "@/data/sizes";
import { reviewsForProduct } from "@/data/reviews";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { defaultCustomization } from "@/hooks/useCustomizer";
import { deliveryEstimate, formatDate, formatINR, validatePincode } from "@/utils/helpers";
import { shopConfig } from "@/config/shop.config";
import { priceForCustomization } from "@/utils/calculatePrice";
import { cn } from "@/utils/cn";
import NotFound from "./NotFound";

type Tab = "description" | "included" | "reviews" | "delivery";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return <NotFound />;
  return <ProductView key={product.id} productId={product.id} />;
}

function ProductView({ productId }: { productId: string }) {
  const product = PRODUCTS.find((p) => p.id === productId)!;
  const cat = getCategory(product.category);
  const [colour, setColour] = useState<ColourId>(product.defaultColour);
  const [size, setSize] = useState<SizeOption>("Medium");
  const [tab, setTab] = useState<Tab>("description");
  const [pin, setPin] = useState("");
  const [pinResult, setPinResult] = useState<string | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);
  const { addItem, openDrawer } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const idx = PRODUCTS.findIndex((p) => p.id === product.id);
  const reviews = useMemo(() => reviewsForProduct(idx, 5), [idx]);
  const related = useMemo(() => relatedProducts(product, 4), [product]);

  const config = { ...defaultCustomization(product), colour, size };
  const price = priceForCustomization(config, product);

  const addDefault = () => {
    addItem(config);
    showToast({ message: `Added “${product.name}” to your cart` });
    openDrawer();
  };

  const checkPin = (e: FormEvent) => {
    e.preventDefault();
    if (!validatePincode(pin)) {
      setPinError("Enter a valid 6-digit Indian pincode.");
      setPinResult(null);
      return;
    }
    setPinError(null);
    const est = deliveryEstimate(pin);
    setPinResult(`Delivers to ${pin} (${est.zone}) by ${formatDate(est.from, { day: "numeric", month: "short" })} – ${formatDate(est.to, { day: "numeric", month: "short" })} · ${price.lineTotal > 4999 ? "Free shipping" : "₹199 shipping"}`);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "included", label: "What's Included" },
    { id: "reviews", label: `Reviews (${product.reviewCount})` },
    { id: "delivery", label: "Delivery & Returns" },
  ];

  const waMsg = shopConfig.whatsapp.productMessage(product.name, getColour(colour).label, size);

  return (
    <>
      <SEO
        title={`${product.name} Custom LED Neon Sign — from ${formatINR(product.startingPrice)} | ${shopConfig.brand.name}`}
        description={`${product.description} Handcrafted in India, ${shopConfig.features.warrantyMonths}-month warranty, ships pan-India.`}
      />
      <Container className="py-8 sm:py-10">
        <nav aria-label="Breadcrumb" className="text-xs text-fg-3">
          <ol className="flex flex-wrap gap-1.5">
            <li><Link to="/" className="hover:text-fg">Home</Link></li><li aria-hidden>/</li>
            <li><Link to="/shop" className="hover:text-fg">Shop</Link></li><li aria-hidden>/</li>
            <li><Link to={`/shop?category=${cat.id}`} className="hover:text-fg">{cat.shortName}</Link></li><li aria-hidden>/</li>
            <li className="text-fg-2">{product.name}</li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-xl border border-white/[0.07]">
              <NeonPreview
                text={product.defaultText}
                font={product.defaultFont}
                colour={colour}
                size={size}
                logoUrl={product.supportsLogoUpload ? LOGO_PLACEHOLDER : null}
                showDimensions
                label={`${product.name} neon sign in ${getColour(colour).label}, ${size}`}
              />
            </div>
            <p className="mt-3 text-center text-xs text-fg-3">Live SVG preview in {getColour(colour).label} · {getFont(product.defaultFont).label} font. Your final design mockup is shared before production.</p>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{cat.name}</Badge>
              {product.isNew && <Badge tone="accent">New</Badge>}
              {product.premiumFont && <Badge>Premium design</Badge>}
            </div>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-fg-2">
              <Stars rating={product.rating} />
              <span>{product.rating.toFixed(1)}</span>
              <button type="button" onClick={() => { setTab("reviews"); document.getElementById("pd-tabs")?.scrollIntoView({ behavior: "smooth" }); }} className="text-fg-3 underline-offset-4 hover:text-fg hover:underline">
                ({product.reviewCount} reviews)
              </button>
            </div>
            <p className="mt-5 text-sm text-fg-3">Starting from</p>
            <p className="font-display text-3xl font-semibold">{formatINR(product.startingPrice)}</p>
            <p className="mt-4 leading-relaxed text-fg-2">{product.description}</p>

            <ul className="mt-6 grid gap-2.5 text-sm text-fg-2 sm:grid-cols-2">
              {[
                { I: IconBolt, t: "Flexible silicone LED neon, 12V" },
                { I: IconShield, t: "12-month warranty" },
                { I: IconRuler, t: "18\" to 48\" wide, custom on request" },
                { I: IconTruck, t: "Dimmer remote + 1.5 m clear cable" },
              ].map(({ I, t }) => (
                <li key={t} className="flex items-center gap-2.5"><I size={16} className="shrink-0 text-fg" /> {t}</li>
              ))}
            </ul>

            <div className="mt-8">
              <p className="text-sm font-semibold">Colour: <span className="font-normal text-fg-2">{getColour(colour).label}</span></p>
              <div className="mt-3 flex flex-wrap gap-2.5" role="radiogroup" aria-label="Preview colour">
                {COLOURS.filter((x) => product.availableColours.includes(x.id)).map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    role="radio"
                    aria-checked={colour === col.id}
                    aria-label={col.label}
                    title={col.label}
                    onClick={() => setColour(col.id)}
                    className={cn("grid h-11 w-11 place-items-center rounded-full border transition-all", colour === col.id ? "border-white/70" : "border-white/10 hover:border-white/30")}
                  >
                    <span className="h-7 w-7 rounded-full" style={{ background: `radial-gradient(circle, ${col.core}, ${col.hex} 60%)`, boxShadow: `0 0 10px ${col.hex}99` }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold">Size</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Size">
                {SIZES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={size === s.id}
                    onClick={() => setSize(s.id)}
                    className={cn(
                      "min-h-[60px] rounded-lg border px-3 py-2 text-left transition-colors",
                      size === s.id ? "border-accent/70 bg-accent/[0.07]" : "border-white/10 hover:border-white/25"
                    )}
                  >
                    <span className="block text-sm font-semibold">{s.id}</span>
                    <span className="block text-xs text-fg-3">{s.dims}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-fg-2">
                {size} price: <span className="font-semibold text-fg">{formatINR(price.unitPrice)}</span>
                <span className="text-fg-3"> · clear acrylic, no mounting kit</span>
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 w-full">
  {/* मुख्य कस्टमाइज़ेशन बटन - फुल विड्थ */}
  <Button 
    size="lg" 
    className="w-full justify-center flex items-center" 
    onClick={() => navigate(`/customize/${product.id}`)}
  >
    Customize This Design <IconArrowRight size={18} className="ml-2" />
  </Button>

  {/* Buy Now और Add to Cart को एक ही जगह (Row) में एडजस्ट करने के लिए सब-कंटेनर */}
  <div className="flex flex-row gap-3 w-full">
    <Button 
      size="lg" 
      className="flex-1" 
      onClick={() => navigate("/checkout")}
    >
      Buy Now
    </Button>
    
    <Button 
      size="lg" 
      variant="secondary" 
      className="flex-1" 
      onClick={addDefault}
    >
      Add to Cart
    </Button>
  </div>
</div>

            <div className="mt-4"><WhatsAppInline message={waMsg} /></div>

            <div className="mt-8 rounded-xl border border-white/[0.08] bg-ink-800 p-4 sm:p-5">
              <p className="flex items-center gap-2 text-sm font-semibold"><IconTruck size={18} /> Check delivery <span className="rounded border border-amber-400/30 px-1 text-[10px] font-bold uppercase text-amber-300">Demo</span></p>
              <form onSubmit={checkPin} className="mt-3 flex gap-2">
                <label htmlFor="pd-pin" className="sr-only">Pincode</label>
                <input
                  id="pd-pin"
                  className="field"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter pincode, e.g. 560038"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  aria-invalid={!!pinError}
                />
                <Button type="submit" variant="secondary" className="shrink-0">Check</Button>
              </form>
              {pinError && <p className="mt-2 text-xs text-err" role="alert">{pinError}</p>}
              {pinResult && <p className="mt-2 flex items-start gap-1.5 text-xs text-emerald-300" role="status"><IconCheck size={14} className="mt-px shrink-0" /> {pinResult}</p>}
              <p className="mt-2 text-xs text-fg-3">Production 5–7 business days after mockup approval.</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <section id="pd-tabs" className="mt-16 scroll-mt-24" aria-label="Product information">
          <div role="tablist" aria-label="Product details" className="no-scrollbar flex gap-1 overflow-x-auto border-b border-white/[0.08]">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                onClick={() => setTab(t.id)}
                className={cn(
                  "-mb-px min-h-[48px] shrink-0 border-b-2 px-4 text-sm font-medium transition-colors",
                  tab === t.id ? "border-accent text-fg" : "border-transparent text-fg-3 hover:text-fg"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="max-w-3xl py-8 text-[15px] leading-relaxed text-fg-2">
            {tab === "description" && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <p>Each sign is hand-bent from flexible silicone LED neon and mounted on laser-cut 5 mm acrylic. The result is a crisp, evenly lit sign that's lighter, safer and far more efficient than traditional glass neon.</p>
                <p>Change the text, font, colour and size in the customiser — our designers review every order and send a mockup for approval before we build it.</p>
              </div>
            )}
            {tab === "included" && (
              <ul className="space-y-2.5">
                {["Your custom LED neon sign on acrylic backing", "12V certified power adapter (Indian 3-pin plug)", "Inline dimmer with remote control", "1.5 m transparent power cable", "Mounting kit — screws, stand-offs & drilling template (if selected)", "Care card & 12-month warranty"].map((x) => (
                  <li key={x} className="flex gap-2.5"><IconCheck size={18} className="mt-0.5 shrink-0 text-emerald-400" /> {x}</li>
                ))}
              </ul>
            )}
            {tab === "reviews" && (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <figure key={r.id} className="rounded-xl border border-white/[0.07] bg-ink-800 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <figcaption className="text-sm font-semibold text-fg">{r.name} <span className="font-normal text-fg-3">· {r.city}</span></figcaption>
                      <Stars rating={r.rating} />
                    </div>
                    <blockquote className="mt-2 text-sm">“{r.quote}”</blockquote>
                    <p className="mt-2 text-xs text-fg-3">Verified purchase · {formatDate(r.date)}</p>
                  </figure>
                ))}
              </div>
            )}
            {tab === "delivery" && (
              <div className="space-y-4">
                <p><strong className="text-fg">Production:</strong> 5–7 business days after you approve your free design mockup.</p>
                <p><strong className="text-fg">Shipping:</strong> Insured delivery to 19,000+ pincodes. Free above ₹4,999, otherwise ₹199. Most orders arrive within 7–10 business days.</p>
                <p><strong className="text-fg">Returns:</strong> Custom signs can't be returned for change of mind. If your sign arrives damaged or differs from your approved mockup, we'll remake it free — just share an unboxing video within 48 hours.</p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8" aria-labelledby="related-title">
          <h2 id="related-title" className="font-display text-2xl font-semibold">You may also like</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="mt-8 flex justify-center"><ButtonLink to="/shop" variant="secondary">Browse all designs</ButtonLink></div>
        </section>
      </Container>
    </>
  );
}
