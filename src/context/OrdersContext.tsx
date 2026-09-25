import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import type { CartItem, Customer, Order, OrderStatus, PaymentMethod } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { buildSampleOrders, FIRST_ORDER_NUMBER } from "@/data/orders";
import { calculateShipping } from "@/utils/calculatePrice";
import { generateOrderId } from "@/utils/helpers";

interface OrdersCtx {
  orders: Order[];
  placeOrder: (input: { customer: Customer; items: CartItem[]; paymentMethod: PaymentMethod }) => Order;
  updateStatus: (orderId: string, status: OrderStatus) => void;
  getOrder: (orderId: string | undefined) => Order | undefined;
  resetDemoData: () => void;
}

const Ctx = createContext<OrdersCtx | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useLocalStorage<Order[]>("ns_orders_v1", () => buildSampleOrders());

  const placeOrder = useCallback<OrdersCtx["placeOrder"]>(
    ({ customer, items, paymentMethod }) => {
      const subtotal = items.reduce((a, i) => a + i.lineTotal, 0);
      const shipping = calculateShipping(subtotal);
      const order: Order = {
        orderId: generateOrderId(FIRST_ORDER_NUMBER),
        customer,
        items,
        subtotal,
        shipping,
        total: subtotal + shipping,
        paymentMethod,
        status: "Paid",
        createdAt: new Date().toISOString(),
        estimatedProductionDays: "7–10 business days",
        shippingAddress: `${customer.address}${customer.landmark ? `, near ${customer.landmark}` : ""}, ${customer.city}, ${customer.state} – ${customer.pincode}`,
      };
      setOrders((prev) => [order, ...prev]);
      return order;
    },
    [setOrders]
  );

  const updateStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? { ...o, status } : o)));
    },
    [setOrders]
  );

  const getOrder = useCallback((id: string | undefined) => orders.find((o) => o.orderId === id), [orders]);

  const resetDemoData = useCallback(() => {
    setOrders(buildSampleOrders());
    try {
      localStorage.removeItem("ns_order_seq");
    } catch {
      /* ignore */
    }
  }, [setOrders]);

  const sorted = useMemo(
    () => [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [orders]
  );

  return (
    <Ctx.Provider value={{ orders: sorted, placeOrder, updateStatus, getOrder, resetDemoData }}>{children}</Ctx.Provider>
  );
}

export function useOrders() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useOrders must be used inside OrdersProvider");
  return c;
}
