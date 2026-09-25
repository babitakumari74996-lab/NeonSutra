import type { CartItem, Customer, Customization, Order, OrderStatus, PaymentMethod } from "@/types";
import { getTemplateById } from "./templates";
import { calculatePrice } from "@/utils/calculatePrice";
import { calculateShipping } from "@/utils/calculatePrice";

function item(templateId: string, c: Partial<Customization>, idx: number): CartItem {
  const t = getTemplateById(templateId)!;
  const customization: Customization = {
    templateId,
    text: t.defaultText,
    font: t.defaultFont,
    colour: t.defaultColour,
    size: "Medium",
    backing: "Clear Acrylic",
    mountingKit: true,
    quantity: 1,
    uploadedLogoName: null,
    uploadedLogoDataUrl: null,
    logoColour: null,
    ...c,
  };
  const price = calculatePrice({
    size: customization.size,
    backing: customization.backing,
    mountingKit: customization.mountingKit,
    premiumFont: t.premiumFont,
    quantity: customization.quantity,
    basePriceBySize: t.basePriceBySize,
  });
  return {
    lineId: `sample-${idx}`,
    customization,
    unitPrice: price.unitPrice,
    lineTotal: price.lineTotal,
    templateName: t.name,
    category: t.category,
  };
}

// Tiny inline SVG used as a stand-in "uploaded logo" for sample data.
const SAMPLE_LOGO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='none' stroke='white' stroke-width='8'/><path d='M32 62 L50 30 L68 62 Z' fill='none' stroke='white' stroke-width='7' stroke-linejoin='round'/></svg>"
  );

interface Seed {
  n: number;
  customer: Customer;
  items: CartItem[];
  payment: PaymentMethod;
  status: OrderStatus;
  daysAgo: number;
}

const cust = (fullName: string, email: string, phone: string, address: string, city: string, state: string, pincode: string): Customer => ({
  fullName, email, phone, address, city, state, pincode,
});

const seeds: Seed[] = [
  { n: 1030, customer: cust("Aarav Mehta", "aarav.mehta@example.in", "9820012345", "14, Hill Road, Bandra West", "Mumbai", "Maharashtra", "400050"),
    items: [item("t-your-logo", { text: "BREW LAB", uploadedLogoName: "brewlab-logo.png", uploadedLogoDataUrl: SAMPLE_LOGO, size: "Large", backing: "Black Acrylic" }, 1)], payment: "UPI", status: "Delivered", daysAgo: 38 },
  { n: 1031, customer: cust("Priya Nair", "priya.nair@example.in", "9845098450", "22, 5th Cross, Indiranagar", "Bengaluru", "Karnataka", "560038"),
    items: [item("t-good-vibes-only", { colour: "warm-white" }, 2)], payment: "Card", status: "Delivered", daysAgo: 33 },
  { n: 1032, customer: cust("Rohan Kapoor", "rohan.k@example.in", "9811122233", "B-7, Rajouri Garden", "New Delhi", "Delhi", "110027"),
    items: [item("t-beast-mode", { size: "Extra Large" }, 3), item("t-no-excuses", { size: "Large" }, 4)], payment: "Net Banking", status: "Delivered", daysAgo: 27 },
  { n: 1033, customer: cust("Sneha Iyer", "sneha.iyer@example.in", "9890011122", "Flat 402, Kalyani Nagar", "Pune", "Maharashtra", "411006"),
    items: [item("t-better-together", { size: "Large" }, 5)], payment: "UPI", status: "Shipped", daysAgo: 12 },
  { n: 1034, customer: cust("Karan Shah", "karan.shah@example.in", "9824098240", "Shop 3, CG Road, Navrangpura", "Ahmedabad", "Gujarat", "380009"),
    items: [item("t-open", { quantity: 2, mountingKit: false }, 6)], payment: "COD", status: "Quality Check", daysAgo: 9 },
  { n: 1035, customer: cust("Ananya Reddy", "ananya.r@example.in", "9849012345", "Plot 18, Jubilee Hills", "Hyderabad", "Telangana", "500033"),
    items: [item("t-beauty-studio", { backing: "Black Acrylic" }, 7)], payment: "Card", status: "Production", daysAgo: 6 },
  { n: 1036, customer: cust("Vikram Singh", "vikram.singh@example.in", "9829012345", "C-Scheme, Ashok Marg", "Jaipur", "Rajasthan", "302001"),
    items: [item("t-your-logo", { text: "SINGH & CO", uploadedLogoName: "singh-co.svg", uploadedLogoDataUrl: SAMPLE_LOGO }, 8)], payment: "UPI", status: "Design Review", daysAgo: 4 },
  { n: 1037, customer: cust("Ishita Banerjee", "ishita.b@example.in", "9830012345", "45, Park Street", "Kolkata", "West Bengal", "700016"),
    items: [item("t-dream-big", { size: "Small" }, 9)], payment: "UPI", status: "Production", daysAgo: 5 },
  { n: 1038, customer: cust("Arjun Malhotra", "arjun.m@example.in", "9876012345", "House 212, Sector 8", "Chandigarh", "Chandigarh", "160009"),
    items: [item("t-game-on", { colour: "purple" }, 10)], payment: "Card", status: "Design Review", daysAgo: 3 },
  { n: 1039, customer: cust("Meera Pillai", "meera.p@example.in", "9847012345", "MG Road, Ernakulam", "Kochi", "Kerala", "682011"),
    items: [item("t-coffee-time", {}, 11)], payment: "COD", status: "Paid", daysAgo: 2 },
  { n: 1040, customer: cust("Siddharth Rao", "sid.rao@example.in", "9840012345", "12, TTK Road, Alwarpet", "Chennai", "Tamil Nadu", "600018"),
    items: [item("t-the-names", { text: "THE RAOS", size: "Large" }, 12)], payment: "Net Banking", status: "Paid", daysAgo: 1 },
  { n: 1041, customer: cust("Divya Joshi", "divya.j@example.in", "9826012345", "Vijay Nagar, Scheme 54", "Indore", "Madhya Pradesh", "452010"),
    items: [item("t-level-up", { quantity: 1 }, 13), item("t-glam", { colour: "pink", size: "Small" }, 14)], payment: "UPI", status: "Paid", daysAgo: 0 },
];

export function buildSampleOrders(now = Date.now()): Order[] {
  return seeds.map((s) => {
    const subtotal = s.items.reduce((a, i) => a + i.lineTotal, 0);
    const shipping = calculateShipping(subtotal);
    const c = s.customer;
    return {
      orderId: `NS-2026-${s.n}`,
      customer: c,
      items: s.items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      paymentMethod: s.payment,
      status: s.status,
      createdAt: new Date(now - s.daysAgo * 86400000 - s.n * 60000).toISOString(),
      estimatedProductionDays: "7–10 business days",
      shippingAddress: `${c.address}, ${c.city}, ${c.state} – ${c.pincode}`,
      isSample: true,
    };
  });
}

export const FIRST_ORDER_NUMBER = 1042;
