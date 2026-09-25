import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { shopConfig, whatsappLink, getCurrentYear } from "@/config/shop.config";

export function Logo({ className, to = "/" }: { className?: string; to?: string }) {
  return (
    <Link to={to} className={cn("group inline-flex items-center gap-2", className)} aria-label="NEONSUTRA home">
      <span className="font-display text-[19px] font-bold tracking-[0.14em] text-fg">
        {shopConfig.brand.shortName}
        <span
          className="relative inline-block text-[#FFE6F3] transition-[text-shadow] duration-300 group-hover:[text-shadow:0_0_6px_#FF3EA5,0_0_16px_#FF3EA5,0_0_28px_#FF3EA5]"
          style={{ textShadow: "0 0 4px #FF3EA5, 0 0 12px rgba(255,62,165,0.8), 0 0 22px rgba(255,62,165,0.5)" }}
        >
          {shopConfig.brand.shortName2}
        </span>
        {shopConfig.brand.name.slice(3)}
      </span>
    </Link>
  );
}
