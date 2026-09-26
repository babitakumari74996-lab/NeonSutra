export const shopConfig = {
  brand: {
    name: "NEONSUTRA",
    shortName: "NE",
    shortName2: "O",
    tagline: "Custom LED Neon Signs — Designed Online, Handcrafted in India",
    description:
      "Design your custom LED neon sign for your cafe, salon, gym, home or wedding. Live preview, instant pricing, handcrafted in India and shipped pan-India in 7–10 days.",
    logo: {
      alt: "NEONSUTRA home",
      href: "/",
    },
  },

  contact: {
    email: "hello@neonsutra.in",
    phone: "+919876543210",
    phoneDisplay: "+91 98765 43210",
    whatsappNumber: "+919876543210",
    whatsappDisplay: "91 98765 43210",
    address: {
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      full: "Bengaluru, Karnataka, India",
    },
    hours: "Mon–Sat, 10 am – 7 pm IST",
    timezone: "Asia/Kolkata",
  },

  social: {
    instagram: { url: "https://instagram.com/neonsutra", label: "Instagram" },
    facebook: { url: "https://facebook.com/neonsutra", label: "Facebook" },
    youtube: { url: "https://youtube.com/@neonsutra", label: "YouTube" },
    twitter: { url: "https://twitter.com/neonsutra", label: "Twitter" },
    linkedin: { url: "https://linkedin.com/company/neonsutra", label: "LinkedIn" },
  },

  seo: {
    defaultTitle: "NEONSUTRA",
    defaultDescription:
      "Design your custom LED neon sign for your cafe, salon, gym, home or wedding. Live preview, instant pricing, handcrafted in India and shipped pan-India in 7–10 days.",
    siteName: "NEONSUTRA",
    ogImage: "/hero-poster.jpg",
    twitterHandle: "@neonsutra",
    themeColor: "#0A0A0B",
  },

  legal: {
    companyName: "NEONSUTRA",
    copyrightYear: new Date().getFullYear(),
    privacyPolicyUrl: "/privacy",
    termsOfServiceUrl: "/terms",
    shippingPolicyUrl: "/faq#shipping",
    returnsPolicyUrl: "/faq#returns",
    warrantyUrl: "/faq#warranty",
  },

  navigation: {
    quickLinks: [
      { label: "Shop all designs", href: "/shop" },
      { label: "Design your own", href: "/customize" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Reviews", href: "/reviews" },
      { label: "FAQ", href: "/faq" },
      { label: "Cart", href: "/cart" },
    ],
    footerCategories: "from-data", // indicates categories come from CATEGORIES data
  },

  features: {
    freeShippingThreshold: 5000,
    warrantyMonths: 12,
    productionDays: "7–10 business days",
    demoMode: true,
  },

  whatsapp: {
    defaultMessage: "Hi NEONSUTRA! I need help designing a custom neon sign.",
    customizerMessage: (summary: string, price: string) =>
      `Hi NEONSUTRA! I need help designing this neon sign:\n${summary}\nEstimated: ${price}`,
    productMessage: (productName: string, colour: string, size: string) =>
      `Hi NEONSUTRA! I like the "${productName}" design (${colour}, ${size}). Can you help me customise it?`,
    reviewMessage: "Hi NEONSUTRA! I'd love to share a photo/review of my sign.",
  },

  payments: {
    methods: {
      UPI: "UPI (Demo)",
      Card: "Credit / Debit Card (Demo)",
      "Net Banking": "Net Banking (Demo)",
      COD: "Cash on Delivery (Demo)",
    },
    codAvailable: true,
    upiId: "neonsutra@upi",
  },

  currency: {
    code: "INR",
    symbol: "₹",
    locale: "en-IN",
  },

  theme: {
    primaryColor: "#FF3EA5",
    secondaryColor: "#0A0A0B",
    accentColor: "#FF6CBC",
  },
} as const;

export type ShopConfig = typeof shopConfig;

export function getShopConfig() {
  return shopConfig;
}

export function formatINR(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${shopConfig.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}