import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { ButtonLink, Container } from "./ui";
import { IconBag, IconChevronDown, IconClose, IconMenu, IconSearch, IconArrowRight } from "./Icons";
import { CATEGORIES } from "@/data/categories";
import { useCart } from "@/context/CartContext";
import { useSectionNav } from "@/hooks/useSectionNav";
import { cn } from "@/utils/cn";

export function Navbar() {
  const { count, openDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const goSection = useSectionNav();
  const navigate = useNavigate();
  const location = useLocation();
  const catRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setCatOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!catOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCatOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [catOpen]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/shop${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
    setSearchOpen(false);
  };

  const linkCls = "rounded-md px-3 py-2 text-sm font-medium text-fg-2 transition-colors hover:text-fg";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || menuOpen || searchOpen ? "border-white/[0.07] bg-ink-950/80 backdrop-blur-xl" : "border-transparent bg-ink-950/40 backdrop-blur-md"
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-3">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          <NavLink to="/shop" className={({ isActive }) => cn(linkCls, isActive && "text-fg")}>
            Shop
          </NavLink>
          <div className="relative" ref={catRef}>
            <button
              type="button"
              className={cn(linkCls, "inline-flex items-center gap-1")}
              aria-expanded={catOpen}
              aria-haspopup="true"
              onClick={() => setCatOpen((v) => !v)}
            >
              Categories <IconChevronDown size={14} className={cn("transition-transform", catOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {catOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 top-full mt-2 w-[520px] -translate-x-1/2 rounded-xl border border-white/10 bg-ink-850/95 p-2 shadow-2xl backdrop-blur-xl"
                >
                  <div className="grid grid-cols-2 gap-1">
                    {CATEGORIES.map((c) => (
                      <Link key={c.id} to={`/shop?category=${c.id}`} className="group rounded-lg px-3 py-2.5 hover:bg-white/[0.05]">
                        <span className="block text-sm font-medium text-fg">{c.name}</span>
                        <span className="block text-xs text-fg-3 group-hover:text-fg-2">{c.description}</span>
                      </Link>
                    ))}
                  </div>
                  <Link to="/shop" className="mt-1 flex items-center justify-between rounded-lg border-t border-white/5 px-3 py-2.5 text-sm font-medium text-accent-2 hover:bg-white/[0.04]">
                    View all designs <IconArrowRight size={16} />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button type="button" className={linkCls} onClick={() => goSection("how-it-works")}>How It Works</button>
          <button type="button" className={linkCls} onClick={() => goSection("reviews")}>Reviews</button>
          <button type="button" className={linkCls} onClick={() => goSection("faq")}>FAQ</button>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-lg text-fg-2 hover:bg-white/5 hover:text-fg"
            aria-label="Search designs"
            aria-expanded={searchOpen}
          >
            <IconSearch />
          </button>
          <button
            type="button"
            onClick={openDrawer}
            className="relative grid h-11 w-11 place-items-center rounded-lg text-fg-2 hover:bg-white/5 hover:text-fg"
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            <IconBag />
            {count > 0 && (
              <span className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(255,62,165,0.7)]">
                {count}
              </span>
            )}
          </button>
          <ButtonLink to="/customize" size="sm" className="ml-1 hidden sm:inline-flex">
            Create Your Neon
          </ButtonLink>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-lg text-fg hover:bg-white/5 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <IconMenu />
          </button>
        </div>
      </Container>

      {/* Search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/[0.06]"
          >
            <Container className="py-3">
              <form onSubmit={submitSearch} role="search" className="flex gap-2">
                <label htmlFor="nav-search" className="sr-only">Search designs</label>
                <input
                  ref={searchRef}
                  id="nav-search"
                  className="field"
                  placeholder="Search designs — try “coffee”, “gym” or “wedding”"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <button type="submit" className="min-h-[46px] shrink-0 rounded-lg bg-fg px-4 text-sm font-semibold text-ink-950 hover:bg-white">
                  Search
                </button>
              </form>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 right-0 z-[61] flex h-[100dvh] w-full max-w-sm flex-col border-l border-white/10 bg-ink-900 lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-4">
                <Logo />
                <button type="button" className="grid h-11 w-11 place-items-center rounded-lg hover:bg-white/5" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <IconClose />
                </button>
              </div>
              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-4">
                <Link to="/shop" className="flex min-h-[48px] items-center border-b border-white/[0.05] text-lg font-medium">Shop all designs</Link>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-fg-3">Categories</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {CATEGORIES.map((c) => (
                    <Link key={c.id} to={`/shop?category=${c.id}`} className="flex min-h-[44px] items-center rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 text-sm text-fg-2 hover:text-fg">
                      {c.shortName}
                    </Link>
                  ))}
                </div>
                <div className="mt-5 flex flex-col">
                  {[
                    ["how-it-works", "How It Works"],
                    ["reviews", "Reviews"],
                    ["faq", "FAQ"],
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      className="flex min-h-[48px] items-center border-b border-white/[0.05] text-left text-lg font-medium"
                      onClick={() => {
                        setMenuOpen(false);
                        setTimeout(() => goSection(id), 260);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                  <Link to="/cart" className="flex min-h-[48px] items-center border-b border-white/[0.05] text-lg font-medium">
                    Cart {count > 0 && <span className="ml-2 text-sm text-fg-3">({count})</span>}
                  </Link>
                </div>
              </nav>
              <div className="border-t border-white/[0.06] p-4">
                <ButtonLink to="/customize" size="lg" className="w-full">
                  Create Your Neon
                </ButtonLink>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
