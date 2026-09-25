import type { Customization, OrderStatus, PaymentMethod } from "@/types";
import { getColour } from "@/data/colours";
import { getFont } from "@/data/fonts";

/** ₹3,499 — Indian digit grouping */
export function formatINR(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const SEQ_KEY = "ns_order_seq";
export function generateOrderId(first: number): string {
  let next = first;
  try {
    const raw = localStorage.getItem(SEQ_KEY);
    if (raw && !Number.isNaN(Number(raw))) next = Math.max(first, Number(raw));
    localStorage.setItem(SEQ_KEY, String(next + 1));
  } catch {
    next = first + Math.floor(Math.random() * 900);
  }
  return `NS-2026-${next}`;
}

export function validatePincode(p: string): boolean {
  return /^[1-9][0-9]{5}$/.test(p.trim());
}
export function validatePhone(p: string): boolean {
  return /^[6-9][0-9]{9}$/.test(p.replace(/\s/g, ""));
}
export function validateEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
}

/** Demo delivery estimate based on pincode zone. */
export function deliveryEstimate(pincode: string): { days: string; from: Date; to: Date; zone: string } {
  const zoneDigit = Number(pincode[0]);
  const zones: Record<number, [string, number, number]> = {
    1: ["North India", 8, 10], 2: ["North India", 8, 10], 3: ["West India", 7, 9], 4: ["West India", 7, 9],
    5: ["South India", 8, 10], 6: ["South India", 8, 11], 7: ["East India", 9, 12], 8: ["East India", 9, 12], 9: ["Army Postal Service", 10, 14],
  };
  const [zone, a, b] = zones[zoneDigit] ?? ["India", 8, 12];
  const addBiz = (d: number) => {
    const dt = new Date();
    let added = 0;
    while (added < d) {
      dt.setDate(dt.getDate() + 1);
      if (dt.getDay() !== 0) added++;
    }
    return dt;
  };
  return { days: `${a}–${b} business days`, from: addBiz(a), to: addBiz(b), zone };
}

export function formatDate(d: Date | string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }): string {
  return new Date(d).toLocaleDateString("en-IN", opts);
}

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  UPI: "UPI (Demo)",
  Card: "Credit / Debit Card (Demo)",
  "Net Banking": "Net Banking (Demo)",
  COD: "Cash on Delivery (Demo)",
};

export const ORDER_STATUSES: OrderStatus[] = ["Paid", "Design Review", "Production", "Quality Check", "Shipped", "Delivered"];

export const TIMELINE_LABELS: Record<OrderStatus, string> = {
  Paid: "Order Confirmed",
  "Design Review": "Design Review",
  Production: "Production",
  "Quality Check": "Quality Check",
  Shipped: "Shipped",
  Delivered: "Delivered",
};

export const WHATSAPP_NUMBER = "919876543210";
export const WHATSAPP_DISPLAY = "+91 98765 43210";

export function customizationSummary(c: Customization, templateName?: string): string {
  const lines = [
    templateName ? `Design: ${templateName}` : null,
    `Text: ${c.text}`,
    `Font: ${getFont(c.font).label}`,
    `Colour: ${getColour(c.colour).label}`,
    `Size: ${c.size}`,
    `Backing: ${c.backing}`,
    `Mounting Kit: ${c.mountingKit ? "Yes" : "No"}`,
    c.uploadedLogoName ? `Logo: ${c.uploadedLogoName}` : null,
    `Quantity: ${c.quantity}`,
  ].filter(Boolean);
  return lines.join("\n");
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
