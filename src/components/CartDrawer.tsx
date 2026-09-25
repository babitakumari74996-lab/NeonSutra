import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { CartItemRow } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { ButtonLink } from "./ui";
import { IconBag, IconClose } from "./Icons";

export function CartDrawer() {
  const { items, drawerOpen, closeDrawer, subtotal, shipping, total, count } = useCart();
  const location = useLocation();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    setTimeout(() => closeRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed inset-y-0 right-0 z-[71] flex h-[100dvh] w-full flex-col border-l border-white/10 bg-ink-900 sm:max-w-[460px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.07] px-5">
              <h2 className="font-display text-lg font-semibold">
                Your cart <span className="text-sm font-normal text-fg-3">({count})</span>
              </h2>
              <button ref={closeRef} type="button" onClick={closeDrawer} className="grid h-11 w-11 place-items-center rounded-lg hover:bg-white/5" aria-label="Close cart">
                <IconClose />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full border border-white/10 text-fg-3">
                  <IconBag size={24} />
                </div>
                <p className="mt-4 font-display text-lg font-semibold">Your cart is empty</p>
                <p className="mt-1 text-sm text-fg-2">Design a sign in minutes — the preview updates as you type.</p>
                <div className="mt-6 flex w-full flex-col gap-2">
                  <ButtonLink to="/customize" onClick={closeDrawer}>Create Your Neon</ButtonLink>
                  <ButtonLink to="/shop" variant="secondary" onClick={closeDrawer}>Explore Designs</ButtonLink>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 divide-y divide-white/[0.06] overflow-y-auto px-5">
                  {items.map((i) => (
                    <CartItemRow key={i.lineId} item={i} compact onNavigate={closeDrawer} />
                  ))}
                </div>
                <div className="shrink-0 border-t border-white/[0.07] bg-ink-850 px-5 pb-5 pt-4">
                  <CartSummary subtotal={subtotal} shipping={shipping} total={total} />
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <ButtonLink to="/cart" variant="secondary" onClick={closeDrawer}>View cart</ButtonLink>
                    <ButtonLink to="/checkout" onClick={closeDrawer}>Checkout</ButtonLink>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
