import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { CategoryId } from "@/types";
import { SEO } from "@/components/SEO";
import { Button, ButtonLink, Container } from "@/components/ui";
import { ProductGrid } from "@/components/ProductCard";
import { IconClose, IconFilter, IconSearch } from "@/components/Icons";
import { CATEGORIES, getCategory } from "@/data/categories";
import { PRODUCTS, productInCategory } from "@/data/products";
import { formatINR } from "@/utils/helpers";
import { cn } from "@/utils/cn";

type Sort = "featured" | "price-asc" | "price-desc" | "newest" | "rating";
const SORTS: { id: Sort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "newest", label: "Newest" },
  { id: "rating", label: "Top Rated" },
];
const PMIN = 2000;
const PMAX = 8000;

function isCat(v: string | null): v is CategoryId {
  return !!v && CATEGORIES.some((c) => c.id === v);
}

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category: CategoryId | "all" = isCat(params.get("category")) ? (params.get("category") as CategoryId) : "all";
  const q = params.get("q") ?? "";
  const sort = (SORTS.find((s) => s.id === params.get("sort"))?.id ?? "featured") as Sort;
  const minP = Math.max(PMIN, Number(params.get("min")) || PMIN);
  const maxP = Math.min(PMAX, Number(params.get("max")) || PMAX);
  const [query, setQuery] = useState(q);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => setQuery(q), [q]);

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v === null || v === "" ? next.delete(k) : next.set(k, v)));
    setParams(next, { replace: true });
  };

  // Debounced search → URL
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (query !== q) update({ q: query.trim() || null });
    }, 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => productInCategory(p, category))
      .filter((p) => p.startingPrice >= minP && p.startingPrice <= maxP)
      .filter((p) => {
        if (!term) return true;
        const cat = getCategory(p.category);
        const hay = [p.name, p.defaultText, cat.name, cat.shortName, ...p.tags].join(" ").toLowerCase();
        return term.split(/\s+/).every((w) => hay.includes(w));
      });
    list = [...list];
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.startingPrice - b.startingPrice); break;
      case "price-desc": list.sort((a, b) => b.startingPrice - a.startingPrice); break;
      case "newest": list.sort((a, b) => +new Date(b.addedOn) - +new Date(a.addedOn)); break;
      case "rating": list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount); break;
      default: list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.reviewCount - a.reviewCount);
    }
    return list;
  }, [category, q, sort, minP, maxP]);

  const chips: { label: string; clear: () => void }[] = [];
  if (category !== "all") chips.push({ label: getCategory(category).name, clear: () => update({ category: null }) });
  if (q) chips.push({ label: `“${q}”`, clear: () => { setQuery(""); update({ q: null }); } });
  if (minP !== PMIN || maxP !== PMAX) chips.push({ label: `${formatINR(minP)} – ${formatINR(maxP)}`, clear: () => update({ min: null, max: null }) });
  const clearAll = () => {
    setQuery("");
    setParams(new URLSearchParams(sort !== "featured" ? { sort } : {}), { replace: true });
  };

  const pct = (v: number) => ((v - PMIN) / (PMAX - PMIN)) * 100;

  const filterPanel = (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-3">Category</legend>
        <div className="mt-3 flex flex-col gap-1">
          {[{ id: "all" as const, name: "All designs" }, ...CATEGORIES].map((c) => {
            const n = PRODUCTS.filter((p) => productInCategory(p, c.id)).length;
            const active = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => update({ category: c.id === "all" ? null : c.id })}
                className={cn(
                  "flex min-h-[42px] items-center justify-between rounded-lg px-3 text-left text-sm transition-colors",
                  active ? "bg-accent/10 font-medium text-fg ring-1 ring-accent/40" : "text-fg-2 hover:bg-white/[0.04] hover:text-fg"
                )}
              >
                {c.name}
                <span className="text-xs text-fg-3">{n}</span>
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-3">Starting price</legend>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="rounded-md border border-white/10 px-2 py-1 tabular-nums">{formatINR(minP)}</span>
          <span className="text-fg-3">to</span>
          <span className="rounded-md border border-white/10 px-2 py-1 tabular-nums">{formatINR(maxP)}</span>
        </div>
        <div className="relative mt-5 h-5">
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/10" />
          <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent" style={{ left: `${pct(minP)}%`, right: `${100 - pct(maxP)}%` }} />
          <input
            type="range"
            className="range-dual"
            min={PMIN}
            max={PMAX}
            step={100}
            value={minP}
            aria-label="Minimum price"
            onChange={(e) => update({ min: String(Math.min(Number(e.target.value), maxP - 500)) })}
          />
          <input
            type="range"
            className="range-dual"
            min={PMIN}
            max={PMAX}
            step={100}
            value={maxP}
            aria-label="Maximum price"
            onChange={(e) => update({ max: String(Math.max(Number(e.target.value), minP + 500)) })}
          />
        </div>
        <p className="mt-3 text-xs text-fg-3">Prices shown are for the Small size. Larger sizes cost more.</p>
      </fieldset>
    </div>
  );

  const title = category !== "all" ? `${getCategory(category).name} Neon Signs` : "All Neon Sign Designs";

  return (
    <>
      <SEO
        title={`${title} | Custom LED Neon — NEONSUTRA`}
        description="Browse ready-to-customise LED neon sign designs for cafes, salons, gyms, bedrooms, gaming setups, weddings and businesses. Prices from ₹2,499."
      />
      <div className="border-b border-white/[0.06] bg-ink-900">
        <Container className="py-10 sm:py-12">
          <nav aria-label="Breadcrumb" className="text-xs text-fg-3">
            <ol className="flex gap-1.5"><li><a href="#/" className="hover:text-fg">Home</a></li><li aria-hidden>/</li><li className="text-fg-2">Shop</li></ol>
          </nav>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-xl text-fg-2">Pick a starting point — every design is fully customisable in the live preview.</p>
          <div className="relative mt-6 max-w-xl">
            <label htmlFor="shop-search" className="sr-only">Search designs</label>
            <IconSearch size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-3" />
            <input
              id="shop-search"
              type="search"
              className="field pl-10"
              placeholder="Search by name, category or tag…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </Container>
      </div>

      <Container className="py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr] xl:gap-10">
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-24">{filterPanel}</div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-fg-2" aria-live="polite">
                <span className="font-semibold text-fg">{results.length}</span> design{results.length === 1 ? "" : "s"}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setDrawer(true)}>
                  <IconFilter size={16} /> Filters{chips.length ? ` (${chips.length})` : ""}
                </Button>
                <label htmlFor="sort" className="sr-only">Sort by</label>
                <select id="sort" className="field !min-h-[40px] !w-auto !py-2 text-sm" value={sort} onChange={(e) => update({ sort: e.target.value === "featured" ? null : e.target.value })}>
                  {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {chips.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {chips.map((c) => (
                  <button key={c.label} type="button" onClick={c.clear} className="inline-flex min-h-[34px] items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 text-xs text-fg hover:border-white/25" aria-label={`Remove filter ${c.label}`}>
                    {c.label} <IconClose size={12} />
                  </button>
                ))}
                <button type="button" onClick={clearAll} className="min-h-[34px] px-2 text-xs font-medium text-accent-2 hover:underline">Clear all</button>
              </div>
            )}

            {results.length > 0 ? (
              <ProductGrid products={results} className="mt-6 lg:grid-cols-3 min-[1440px]:grid-cols-4" />
            ) : (
              <div className="mt-10 rounded-xl border border-dashed border-white/10 px-6 py-16 text-center">
                <p className="font-display text-xl font-semibold">No designs match those filters</p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-fg-2">Try a different search or clear filters. Or skip templates entirely and design your own sign from scratch.</p>
                <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                  <Button variant="secondary" onClick={clearAll}>Clear filters</Button>
                  <ButtonLink to="/customize">Design your own</ButtonLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="fixed inset-0 z-[60] bg-black/60 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              className="fixed inset-y-0 left-0 z-[61] flex h-[100dvh] w-full max-w-sm flex-col bg-ink-900 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="flex h-16 items-center justify-between border-b border-white/[0.07] px-4">
                <h2 className="font-display text-lg font-semibold">Filters</h2>
                <button type="button" onClick={() => setDrawer(false)} className="grid h-11 w-11 place-items-center rounded-lg hover:bg-white/5" aria-label="Close filters"><IconClose /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">{filterPanel}</div>
              <div className="grid grid-cols-2 gap-2 border-t border-white/[0.07] p-4">
                <Button variant="secondary" onClick={clearAll}>Clear all</Button>
                <Button onClick={() => setDrawer(false)}>Show {results.length}</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
