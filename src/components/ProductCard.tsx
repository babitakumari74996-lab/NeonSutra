import { Link } from "react-router-dom";
import type { Product } from "@/types";
import { NeonPreview } from "./NeonPreview";
import { Badge, btnClass, Stars } from "./ui";
import { getCategory } from "@/data/categories";
import { formatINR } from "@/utils/helpers";
import { cn } from "@/utils/cn";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const cat = getCategory(product.category);
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-ink-800 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      <Link to={`/product/${product.slug}`} className="relative block" aria-label={`View ${product.name}`} tabIndex={-1}>
        <NeonPreview
          variant="card"
          animate={false}
          text={product.defaultText}
          font={product.defaultFont}
          colour={product.defaultColour}
          size="Medium"
          backing="Clear Acrylic"
          logoUrl={product.supportsLogoUpload ? LOGO_PLACEHOLDER : null}
          label={`${product.name} neon sign preview`}
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {product.isNew && <Badge tone="accent">New</Badge>}
          {product.premiumFont && <Badge>Premium</Badge>}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-fg-3">{cat.name}</p>
        <h3 className="mt-1 font-display text-base font-semibold tracking-[-0.01em] text-fg">
          <Link to={`/product/${product.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-fg-3">
          <Stars rating={product.rating} size={12} />
          <span>{product.rating.toFixed(1)} ({product.reviewCount})</span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <p className="text-sm text-fg-2">
            <span className="block text-[11px] text-fg-3">Starting from</span>
            <span className="font-semibold text-fg">{formatINR(product.startingPrice)}</span>
          </p>
          <Link to={`/customize/${product.id}`} className={btnClass("outline", "sm", "relative z-10")}>
            Customize
          </Link>
        </div>
      </div>
    </article>
  );
}

export const LOGO_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 10 L88 32 L88 68 L50 90 L12 68 L12 32 Z' fill='none' stroke='white' stroke-width='7' stroke-linejoin='round'/><path d='M36 64 V38 L64 64 V38' fill='none' stroke='white' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'/></svg>"
  );

export function ProductGrid({ products, className }: { products: Product[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:gap-5 lg:grid-cols-3 min-[1440px]:grid-cols-4", className)}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
