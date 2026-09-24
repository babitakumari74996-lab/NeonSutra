import { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import type { CategoryId, Order, OrderStatus } from "@/types";
import { SEO } from "@/components/SEO";
import { Logo } from "@/components/Logo";
import { NeonPreview } from "@/components/NeonPreview";
import { LOGO_PLACEHOLDER } from "@/components/ProductCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Badge } from "@/components/ui";
import { IconClipboard, IconDashboard, IconGrid, IconSearch, IconUsers, IconImage, IconArrowRight, IconChevronRight } from "@/components/Icons";
import { useOrders } from "@/context/OrdersContext";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES, getCategory } from "@/data/categories";
import { formatDate, formatINR, ORDER_STATUSES } from "@/utils/helpers";
import { cn } from "@/utils/cn";

const NAV = [
  { to: "/admin", label: "Dashboard", I: IconDashboard, end: true },
  { to: "/admin/orders", label: "Orders", I: IconClipboard, end: false },
  { to: "/admin/products", label: "Products", I: IconGrid, end: false },
  { to: "/admin/customers", label: "Customers", I: IconUsers, end: false },
  { to: "/admin/requests", label: "Customization Requests", I: IconImage, end: false },
];

export function AdminLayout() {
  const { resetDemoData } = useOrders();
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="min-h-screen bg-ink-950">
      <SEO title="Admin Dashboard (Demo) — NEONSUTRA" description="Demo admin dashboard with sample orders." />
      <div className="sticky top-0 z-40 bg-amber-400 px-4 py-1.5 text-center text-xs font-semibold text-ink-950" role="status">
        Demo Admin — sample data only.
      </div>
      <div className="lg:grid lg:grid-cols-[250px_1fr]">
        <aside className="border-b border-white/[0.07] bg-ink-900 lg:sticky lg:top-[28px] lg:h-[calc(100vh-28px)] lg:border-b-0 lg:border-r">
          <div className="flex h-14 items-center justify-between px-4 lg:h-16 lg:px-5">
            <Logo to="/admin" />
            <Link to="/" className="text-xs font-medium text-fg-2 hover:text-fg lg:hidden">View store →</Link>
          </div>
          <nav aria-label="Admin" className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-0">
            {NAV.map(({ to, label, I, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex min-h-[42px] shrink-0 items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-colors",
                    isActive ? "bg-white/[0.07] text-fg" : "text-fg-2 hover:bg-white/[0.04] hover:text-fg"
                  )
                }
              >
                <I size={17} /> {label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden px-5 pt-8 lg:block">
            <Link to="/" className="flex items-center gap-1.5 text-sm text-fg-2 hover:text-fg">← Back to store</Link>
            <div className="mt-6 rounded-lg border border-white/[0.07] p-3 text-xs text-fg-3">
              Orders placed in the storefront appear here instantly (stored in this browser).
              {confirm ? (
                <div className="mt-2 flex gap-2">
                  <button type="button" className="min-h-[32px] rounded bg-err/20 px-2 font-semibold text-red-200" onClick={() => { resetDemoData(); setConfirm(false); }}>Confirm reset</button>
                  <button type="button" className="min-h-[32px] px-2" onClick={() => setConfirm(false)}>Cancel</button>
                </div>
              ) : (
                <button type="button" className="mt-2 block min-h-[32px] font-medium text-fg-2 underline-offset-2 hover:text-fg hover:underline" onClick={() => setConfirm(true)}>Reset demo data</button>
              )}
            </div>
          </div>
        </aside>
        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{title}</h1>
      {sub && <p className="mt-1 text-sm text-fg-2">{sub}</p>}
    </div>
  );
}

const firstItemName = (o: Order) => `${o.items[0]?.customization.text ?? "—"}${o.items.length > 1 ? ` +${o.items.length - 1}` : ""}`;
const payLabel = (o: Order) => (o.paymentMethod === "COD" ? "COD" : o.paymentMethod);

/* ---------------- Dashboard ---------------- */
export function AdminDashboard() {
  const { orders } = useOrders();
  const stats = useMemo(() => {
    const revenue = orders.reduce((a, o) => a + o.total, 0);
    const count = (s: OrderStatus[]) => orders.filter((o) => s.includes(o.status)).length;
    const byCat = new Map<CategoryId, number>();
    orders.forEach((o) => o.items.forEach((i) => byCat.set(i.category, (byCat.get(i.category) ?? 0) + i.customization.quantity)));
    const cats = CATEGORIES.map((c) => ({ id: c.id, name: c.shortName, n: byCat.get(c.id) ?? 0 }));
    return {
      revenue,
      total: orders.length,
      pending: count(["Paid", "Design Review"]),
      production: count(["Production", "Quality Check"]),
      delivered: count(["Delivered"]),
      cats,
      maxCat: Math.max(1, ...cats.map((c) => c.n)),
    };
  }, [orders]);

  const kpis = [
    { label: "Total Orders", value: String(stats.total) },
    { label: "Revenue", value: formatINR(stats.revenue) },
    { label: "Pending Design Reviews", value: String(stats.pending) },
    { label: "In Production", value: String(stats.production) },
    { label: "Delivered", value: String(stats.delivered) },
  ];

  return (
    <>
      <PageTitle title="Dashboard" sub="Overview of your neon business (demo)." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {kpis.map((k, i) => (
          <div key={k.label} className={cn("rounded-xl border border-white/[0.07] bg-ink-800 p-4", i === 1 && "col-span-2 md:col-span-1")}>
            <p className="text-xs text-fg-3">{k.label}</p>
            <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-xl border border-white/[0.07] bg-ink-900" aria-labelledby="recent-title">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <h2 id="recent-title" className="font-semibold">Recent orders</h2>
            <Link to="/admin/orders" className="inline-flex items-center gap-1 text-xs font-medium text-accent-2 hover:underline">View all <IconArrowRight size={13} /></Link>
          </div>
          <ul className="divide-y divide-white/[0.05]">
            {orders.slice(0, 6).map((o) => (
              <li key={o.orderId}>
                <Link to={`/admin/orders/${o.orderId}`} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02]">
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <span className="font-mono">{o.orderId}</span>
                      {!o.isSample && <Badge tone="accent">New</Badge>}
                    </p>
                    <p className="truncate text-xs text-fg-3">{o.customer.fullName} · {o.customer.city} · {firstItemName(o)}</p>
                  </div>
                  <div className="hidden sm:block"><StatusBadge status={o.status} /></div>
                  <p className="w-20 shrink-0 text-right text-sm font-semibold tabular-nums">{formatINR(o.total)}</p>
                  <IconChevronRight size={16} className="shrink-0 text-fg-3" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-white/[0.07] bg-ink-900 p-5" aria-labelledby="chart-title">
          <h2 id="chart-title" className="font-semibold">Signs ordered by category</h2>
          <p className="text-xs text-fg-3">Units across all orders</p>
          <div className="mt-6 flex h-48 items-end gap-2 sm:gap-3" role="img" aria-label={`Bar chart: ${stats.cats.map((c) => `${c.name} ${c.n}`).join(", ")}`}>
            {stats.cats.map((c) => (
              <div key={c.id} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
                <span className="text-[11px] font-semibold tabular-nums text-fg-2">{c.n}</span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-accent/40 to-accent transition-all duration-500"
                  style={{ height: `${Math.max(3, (c.n / stats.maxCat) * 100)}%`, boxShadow: c.n ? "0 0 16px -4px rgba(255,62,165,0.6)" : undefined }}
                />
                <span className="w-full truncate text-center text-[10px] text-fg-3">{c.name}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-white/[0.06] pt-4">
            {ORDER_STATUSES.map((s) => {
              const n = orders.filter((o) => o.status === s).length;
              return (
                <div key={s} className="flex items-center justify-between text-sm">
                  <StatusBadge status={s} />
                  <span className="tabular-nums text-fg-2">{n}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

/* ---------------- Orders ---------------- */
export function AdminOrders() {
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [tab, setTab] = useState<OrderStatus | "All">("All");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return orders.filter(
      (o) =>
        (tab === "All" || o.status === tab) &&
        (!term || o.orderId.toLowerCase().includes(term) || o.customer.fullName.toLowerCase().includes(term) || o.customer.city.toLowerCase().includes(term))
    );
  }, [orders, tab, q]);

  return (
    <>
      <PageTitle title="Orders" sub={`${orders.length} orders in total`} />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:px-0" role="tablist" aria-label="Filter by status">
          {(["All", ...ORDER_STATUSES] as const).map((s) => {
            const n = s === "All" ? orders.length : orders.filter((o) => o.status === s).length;
            return (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={tab === s}
                onClick={() => setTab(s)}
                className={cn(
                  "min-h-[38px] shrink-0 rounded-lg px-3 text-sm font-medium transition-colors",
                  tab === s ? "bg-white/[0.08] text-fg" : "text-fg-3 hover:text-fg"
                )}
              >
                {s} <span className="text-xs text-fg-3">{n}</span>
              </button>
            );
          })}
        </div>
        <div className="relative md:w-72">
          <label htmlFor="admin-search" className="sr-only">Search orders</label>
          <IconSearch size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-3" />
          <input id="admin-search" className="field !min-h-[40px] pl-9 text-sm" placeholder="Search order ID or customer" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {/* Mobile cards */}
      <ul className="mt-4 space-y-2 md:hidden">
        {list.map((o) => (
          <li key={o.orderId}>
            <Link to={`/admin/orders/${o.orderId}`} className="block rounded-xl border border-white/[0.07] bg-ink-900 p-4 hover:border-white/15">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-medium">{o.orderId}</span>
                <StatusBadge status={o.status} />
              </div>
              <p className="mt-1.5 text-sm">{o.customer.fullName} <span className="text-fg-3">· {o.customer.city}</span></p>
              <p className="truncate text-xs text-fg-3">{firstItemName(o)}</p>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-fg-3">{formatDate(o.createdAt)} · {payLabel(o)}</span>
                <span className="font-semibold">{formatINR(o.total)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="mt-4 hidden overflow-x-auto rounded-xl border border-white/[0.07] bg-ink-900 md:block">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-white/[0.07] text-xs uppercase tracking-wider text-fg-3">
            <tr>
              {["Order ID", "Customer", "Product", "Amount", "Payment", "Status", "Date"].map((h) => (
                <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {list.map((o) => (
              <tr
                key={o.orderId}
                onClick={() => navigate(`/admin/orders/${o.orderId}`)}
                className="cursor-pointer transition-colors hover:bg-white/[0.025]"
              >
                <td className="px-4 py-3">
                  <Link to={`/admin/orders/${o.orderId}`} className="font-mono font-medium hover:text-accent-2" onClick={(e) => e.stopPropagation()}>{o.orderId}</Link>
                  {!o.isSample && <Badge tone="accent" className="ml-2">New</Badge>}
                </td>
                <td className="px-4 py-3"><span className="block">{o.customer.fullName}</span><span className="text-xs text-fg-3">{o.customer.city}</span></td>
                <td className="max-w-[180px] truncate px-4 py-3 text-fg-2">{firstItemName(o)}</td>
                <td className="px-4 py-3 font-semibold tabular-nums">{formatINR(o.total)}</td>
                <td className="px-4 py-3 text-fg-2">{payLabel(o)}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="whitespace-nowrap px-4 py-3 text-fg-2">{formatDate(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {list.length === 0 && <p className="mt-6 rounded-xl border border-dashed border-white/10 p-10 text-center text-sm text-fg-2">No orders match this filter.</p>}
    </>
  );
}

/* ---------------- Products ---------------- */
export function AdminProducts() {
  const [featured, setFeatured] = useState<Record<string, boolean>>(() => Object.fromEntries(PRODUCTS.map((p) => [p.id, p.isFeatured])));
  return (
    <>
      <PageTitle title="Products" sub={`${PRODUCTS.length} templates · featured toggle is visual only in this demo`} />
      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-xl border border-white/[0.07] bg-ink-900">
            <NeonPreview variant="card" animate={false} text={p.defaultText} font={p.defaultFont} colour={p.defaultColour} logoUrl={p.supportsLogoUpload ? LOGO_PLACEHOLDER : null} />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-fg-3">{getCategory(p.category).name}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold">{formatINR(p.startingPrice)}</p>
              </div>
              <label className="mt-3 flex min-h-[40px] cursor-pointer items-center justify-between rounded-lg border border-white/[0.07] px-3 text-sm">
                <span className="text-fg-2">Featured</span>
                <input type="checkbox" className="peer sr-only" checked={featured[p.id]} onChange={(e) => setFeatured((f) => ({ ...f, [p.id]: e.target.checked }))} />
                <span className="relative h-6 w-10 rounded-full bg-white/10 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-fg after:transition-transform peer-checked:bg-accent peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-accent-2" aria-hidden="true" />
              </label>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- Customers ---------------- */
export function AdminCustomers() {
  const { orders } = useOrders();
  const customers = useMemo(() => {
    const m = new Map<string, { name: string; email: string; phone: string; city: string; count: number; spent: number; last: string }>();
    orders.forEach((o) => {
      const k = o.customer.email.toLowerCase();
      const cur = m.get(k);
      if (cur) {
        cur.count += 1;
        cur.spent += o.total;
        if (o.createdAt > cur.last) cur.last = o.createdAt;
      } else m.set(k, { name: o.customer.fullName, email: o.customer.email, phone: o.customer.phone, city: o.customer.city, count: 1, spent: o.total, last: o.createdAt });
    });
    return [...m.values()].sort((a, b) => b.spent - a.spent);
  }, [orders]);

  return (
    <>
      <PageTitle title="Customers" sub={`${customers.length} customers derived from orders`} />
      <div className="overflow-x-auto rounded-xl border border-white/[0.07] bg-ink-900">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-white/[0.07] text-xs uppercase tracking-wider text-fg-3">
            <tr>{["Customer", "City", "Orders", "Total spent", "Last order"].map((h) => <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {customers.map((c) => (
              <tr key={c.email}>
                <td className="px-4 py-3"><span className="block font-medium">{c.name}</span><span className="text-xs text-fg-3">{c.email}</span></td>
                <td className="px-4 py-3 text-fg-2">{c.city}</td>
                <td className="px-4 py-3 tabular-nums">{c.count}</td>
                <td className="px-4 py-3 font-semibold tabular-nums">{formatINR(c.spent)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-fg-2">{formatDate(c.last)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ---------------- Customisation requests ---------------- */
export function AdminRequests() {
  const { orders } = useOrders();
  const reqs = useMemo(
    () => orders.flatMap((o) => o.items.filter((i) => i.customization.uploadedLogoDataUrl || i.customization.uploadedLogoName).map((i) => ({ o, i }))),
    [orders]
  );
  return (
    <>
      <PageTitle title="Customization Requests" sub="Items with uploaded logos that need artwork review before production." />
      {reqs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 p-10 text-center text-sm text-fg-2">No logo uploads yet.</p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {reqs.map(({ o, i }) => (
            <li key={o.orderId + i.lineId}>
              <Link to={`/admin/orders/${o.orderId}`} className="flex gap-4 rounded-xl border border-white/[0.07] bg-ink-900 p-4 hover:border-white/15">
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg border border-white/[0.07] bg-black p-2">
                  {i.customization.uploadedLogoDataUrl ? (
                    <img src={i.customization.uploadedLogoDataUrl} alt={`Uploaded logo ${i.customization.uploadedLogoName ?? ""}`} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <IconImage className="text-fg-3" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-medium">{o.orderId}</span>
                    <Badge tone="warn">Needs artwork review</Badge>
                  </div>
                  <p className="mt-1 truncate text-sm">“{i.customization.text}” · {i.templateName}</p>
                  <p className="truncate text-xs text-fg-3">{o.customer.fullName} · {i.customization.uploadedLogoName}</p>
                  <div className="mt-2"><StatusBadge status={o.status} /></div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
