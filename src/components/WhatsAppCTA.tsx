import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IconWhatsApp, IconArrowRight } from "./Icons";
import { whatsappLink } from "@/utils/helpers";
import { getWhatsAppMessage } from "@/hooks/useSectionNav";
import { cn } from "@/utils/cn";

const DEFAULT_MSG = "Hi NEONSUTRA! I need help designing a custom neon sign.";

/** Floating support button — appears after 300px of scroll. Support only, never the primary order path. */
export function WhatsAppFloat() {
  const [show, setShow] = useState(false);
  const location = useLocation();
  const onCustomizer = location.pathname.startsWith("/customize");

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={whatsappLink(DEFAULT_MSG)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        const msg = getWhatsAppMessage();
        e.currentTarget.href = whatsappLink(msg && onCustomizer ? msg : DEFAULT_MSG);
      }}
      aria-label="Need help designing? Chat with our design team on WhatsApp"
      className={cn(
        "group fixed right-4 z-40 flex h-12 items-center gap-0 overflow-hidden rounded-full border border-white/10 bg-ink-800/95 pl-3 pr-3 text-sm text-fg shadow-xl backdrop-blur transition-all duration-300 hover:gap-2 hover:border-emerald-400/40 hover:pr-4 focus-visible:gap-2 focus-visible:pr-4 sm:right-6",
        onCustomizer ? "bottom-24 lg:bottom-6" : "bottom-5 sm:bottom-6",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
        <IconWhatsApp size={16} />
      </span>
      <span className="max-w-0 whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-[320px] group-hover:opacity-100 group-focus-visible:max-w-[320px] group-focus-visible:opacity-100">
        Need Help Designing? <span className="text-fg-2">Chat with our Design Team</span>
      </span>
    </a>
  );
}

/** Inline secondary link used on customiser and product pages. */
export function WhatsAppInline({ message, className }: { message: string; className?: string }) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("inline-flex items-center gap-2 text-sm text-fg-2 transition-colors hover:text-emerald-300", className)}
    >
      <IconWhatsApp size={16} className="text-emerald-400" />
      Prefer WhatsApp? Send us your idea
      <IconArrowRight size={14} />
    </a>
  );
}
