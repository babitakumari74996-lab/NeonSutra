import { useEffect, useRef } from "react";
import { HashRouter, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastProvider } from "@/context/ToastContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppFloat } from "@/components/WhatsAppCTA";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import CustomizerPage from "@/pages/CustomizerPage";
import CartPage from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import HowItWorksPage from "@/pages/HowItWorks";
import ReviewsPage from "@/pages/Reviews";
import FAQPage from "@/pages/FAQ";
import NotFound from "@/pages/NotFound";
import { AdminLayout, AdminDashboard, AdminOrders, AdminProducts, AdminCustomers, AdminRequests } from "@/pages/Admin";
import AdminOrderDetail from "@/pages/AdminOrderDetail";

function ScrollManager() {
  const { pathname, state } = useLocation();
  const stateRef = useRef(state);
  stateRef.current = state;
  useEffect(() => {
    const target = (stateRef.current as { scrollTo?: string } | null)?.scrollTo;
    if (!target) window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function StoreLayout() {
  const { pathname } = useLocation();
  return (
    <>
      <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }} className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-fg focus:px-4 focus:py-2 focus:text-ink-950">
        Skip to content
      </a>
      <Navbar />
      <motion.main
        id="main"
        tabIndex={-1}
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="min-h-[60vh] outline-none"
      >
        <Outlet />
      </motion.main>
      <Footer />
      <CartDrawer />
      <WhatsAppFloat />
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <OrdersProvider>
          <CartProvider>
            <ScrollManager />
            <Routes>
              <Route element={<StoreLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/customize" element={<CustomizerPage />} />
                <Route path="/customize/:templateId" element={<CustomizerPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order/:orderId" element={<OrderConfirmation />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:orderId" element={<AdminOrderDetail />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="requests" element={<AdminRequests />} />
              </Route>
            </Routes>
          </CartProvider>
        </OrdersProvider>
      </ToastProvider>
    </HashRouter>
  );
}
