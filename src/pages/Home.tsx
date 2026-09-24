import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Hero } from "@/components/Hero";
import {
  TrustBadges, DesignsSection, HowItWorks, ShopByCategory, WhyChooseUs, FeaturedCarousel, Reviews, FAQ, FinalCTA,
} from "@/components/HomeSections";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!target) return;
    const t = window.setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      navigate(".", { replace: true, state: null });
    }, 80);
    return () => window.clearTimeout(t);
  }, [location.state, navigate]);

  return (
    <>
      <SEO
        title="Custom LED Neon Signs | Design Your Own Neon — NEONSUTRA"
        description="Design a custom LED neon sign for your cafe, salon, gym, home or wedding. Live preview, instant pricing, handcrafted in India, shipped pan-India in 7–10 days."
      />
      <Hero />
      <TrustBadges />
      <DesignsSection />
      <HowItWorks />
      <ShopByCategory />
      <WhyChooseUs />
      <FeaturedCarousel />
      <Reviews />
      <FAQ />
      <FinalCTA />
    </>
  );
}
