import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { CartItem, Customization } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getTemplateById } from "@/data/templates";
import { priceForCustomization, calculateShipping } from "@/utils/calculatePrice";
import { uuid } from "@/utils/helpers";

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  addItem: (c: Customization) => CartItem | null;
  updateItem: (lineId: string, c: Customization) => void;
  setQuantity: (lineId: string, q: number) => void;
  removeItem: (lineId: string) => { item: CartItem; index: number } | null;
  restoreItem: (item: CartItem, index: number) => void;
  clearCart: () => void;
  getItem: (lineId: string) => CartItem | undefined;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const Ctx = createContext<CartCtx | null>(null);

function buildLine(c: Customization, lineId: string): CartItem | null {
  const t = getTemplateById(c.templateId);
  if (!t) return null;
  const quantity = Math.max(1, Math.min(20, c.quantity));
  const customization = { ...c, quantity };
  const p = priceForCustomization(customization, t);
  return { lineId, customization, unitPrice: p.unitPrice, lineTotal: p.lineTotal, templateName: t.name, category: t.category };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [rawItems, setItems] = useLocalStorage<CartItem[]>("ns_cart_v1", []);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Re-price on load so stored items always reflect the current engine.
  const items = useMemo(
    () => rawItems.map((i) => buildLine(i.customization, i.lineId)).filter((i): i is CartItem => !!i),
    [rawItems]
  );

  const addItem = useCallback(
    (c: Customization) => {
      const line = buildLine(c, uuid());
      if (line) setItems((prev) => [...prev, line]);
      return line;
    },
    [setItems]
  );

  const updateItem = useCallback(
    (lineId: string, c: Customization) => {
      setItems((prev) => prev.map((i) => (i.lineId === lineId ? buildLine(c, lineId) ?? i : i)));
    },
    [setItems]
  );

  const setQuantity = useCallback(
    (lineId: string, q: number) => {
      setItems((prev) =>
        prev.map((i) => (i.lineId === lineId ? buildLine({ ...i.customization, quantity: q }, lineId) ?? i : i))
      );
    },
    [setItems]
  );

  const removeItem = useCallback(
    (lineId: string) => {
      const index = rawItems.findIndex((i) => i.lineId === lineId);
      if (index < 0) return null;
      const item = rawItems[index];
      setItems((prev) => prev.filter((i) => i.lineId !== lineId));
      return { item, index };
    },
    [rawItems, setItems]
  );

  const restoreItem = useCallback(
    (item: CartItem, index: number) => {
      setItems((prev) => {
        if (prev.some((i) => i.lineId === item.lineId)) return prev;
        const next = [...prev];
        next.splice(Math.min(index, next.length), 0, item);
        return next;
      });
    },
    [setItems]
  );

  const clearCart = useCallback(() => setItems([]), [setItems]);
  const getItem = useCallback((lineId: string) => items.find((i) => i.lineId === lineId), [items]);

  const value = useMemo<CartCtx>(() => {
    const subtotal = items.reduce((a, i) => a + i.lineTotal, 0);
    const shipping = calculateShipping(subtotal);
    return {
      items,
      count: items.reduce((a, i) => a + i.customization.quantity, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      addItem,
      updateItem,
      setQuantity,
      removeItem,
      restoreItem,
      clearCart,
      getItem,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    };
  }, [items, addItem, updateItem, setQuantity, removeItem, restoreItem, clearCart, getItem, drawerOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
