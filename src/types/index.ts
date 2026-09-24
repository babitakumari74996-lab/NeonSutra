export type CategoryId =
  | "cafe"
  | "salon"
  | "gym"
  | "bedroom"
  | "gaming"
  | "wedding"
  | "business"
  | "quotes";

export interface Category {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  image: string;
  imageAlt: string;
}

export type SizeOption = "Small" | "Medium" | "Large" | "Extra Large";
export type BackingOption = "Clear Acrylic" | "Black Acrylic";
export type FontId = "modern" | "script" | "bold" | "minimal" | "retro" | "handwritten" | "neon";
export type ColourId =
  | "warm-white"
  | "cool-white"
  | "blue"
  | "pink"
  | "red"
  | "green"
  | "purple"
  | "yellow";

export interface NeonFont {
  id: FontId;
  label: string;
  family: string;
  weight: number;
  letterSpacing: number; // em
  uppercase: boolean;
}

export interface NeonColour {
  id: ColourId;
  label: string;
  hex: string; // glow colour
  core: string; // near-white tube core
}

export interface PreviewStyle {
  letterSpacing?: number;
}

export type PriceBySize = Record<SizeOption, number>;

export interface Template {
  id: string;
  name: string;
  slug: string;
  category: CategoryId;
  secondaryCategories?: CategoryId[];
  defaultText: string;
  defaultFont: FontId;
  defaultColour: ColourId;
  availableFonts: FontId[];
  availableColours: ColourId[];
  basePriceBySize: PriceBySize;
  supportsLogoUpload: boolean;
  premiumFont: boolean;
  description: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  previewStyle: PreviewStyle;
  isFeatured: boolean;
  isNew: boolean;
  addedOn: string; // ISO date
  editableHint?: string;
}

export interface Product extends Template {
  startingPrice: number;
}

export interface Customization {
  templateId: string;
  text: string;
  font: FontId;
  colour: ColourId;
  size: SizeOption;
  backing: BackingOption;
  mountingKit: boolean;
  quantity: number;
  uploadedLogoName: string | null;
  uploadedLogoDataUrl: string | null;
}

export interface CartItem {
  lineId: string;
  customization: Customization;
  unitPrice: number;
  lineTotal: number;
  templateName: string;
  category: CategoryId;
}

export interface Customer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export type PaymentMethod = "UPI" | "Card" | "Net Banking" | "COD";

export type OrderStatus =
  | "Paid"
  | "Design Review"
  | "Production"
  | "Quality Check"
  | "Shipped"
  | "Delivered";

export interface Order {
  orderId: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  estimatedProductionDays: string;
  shippingAddress: string;
  isSample?: boolean;
}

export interface PricingOptions {
  size: SizeOption;
  backing: BackingOption;
  mountingKit: boolean;
  premiumFont: boolean;
  quantity: number;
  basePriceBySize: PriceBySize;
}

export interface PriceBreakdown {
  basePrice: number;
  backing: number;
  mounting: number;
  premium: number;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Review {
  id: string;
  name: string;
  city: string;
  rating: number;
  quote: string;
  product?: string;
  date: string;
}

export interface FAQItem {
  q: string;
  a: string;
}
