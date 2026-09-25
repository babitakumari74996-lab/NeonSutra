import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Container } from "./ui";
import { CATEGORIES } from "@/data/categories";
import { IconFacebook, IconInstagram, IconMail, IconPhone, IconWhatsApp, IconYoutube } from "./Icons";
import { WHATSAPP_DISPLAY, whatsappLink } from "@/utils/helpers";

export function Footer() {
  const h = "text-xs font-semibold uppercase tracking-[0.16em] text-fg-3";
  const a = "text-sm text-fg-2 transition-colors hover:text-fg";
  return (
    <footer className="border-t border-white/[0.06] bg-ink-950">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-2">
              Custom LED neon signs, designed online and handcrafted in our Bengaluru studio. Made for cafes, studios, homes and celebrations across India.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { I: IconInstagram, label: "Instagram" },
                { I: IconYoutube, label: "YouTube" },
                { I: IconFacebook, label: "Facebook" },
              ].map(({ I, label }) => (
                <a
                  key={label}
                  href="#/"
                  onClick={(e) => e.preventDefault()}
                  aria-label={`NEONSUTRA on ${label} (demo link)`}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-fg-2 hover:border-white/25 hover:text-fg"
                >
                  <I size={18} />
                </a>
              ))}
            </div>
          </div>
          <nav aria-label="Quick links">
            <h2 className={h}>Quick links</h2>
            <ul className="mt-4 space-y-2.5">
              <li><Link className={a} to="/shop">Shop all designs</Link></li>
              <li><Link className={a} to="/customize">Design your own</Link></li>
              <li><Link className={a} to="/how-it-works">How it works</Link></li>
              <li><Link className={a} to="/reviews">Reviews</Link></li>
              <li><Link className={a} to="/faq">FAQ</Link></li>
              <li><Link className={a} to="/cart">Cart</Link></li>
              <li><Link className={a} to="/admin">Admin (demo)</Link></li>
            </ul>
          </nav>
          <nav aria-label="Categories">
            <h2 className={h}>Categories</h2>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.map((c) => (
                <li key={c.id}><Link className={a} to={`/shop?category=${c.id}`}>{c.shortName}</Link></li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Policies">
            <h2 className={h}>Policies</h2>
            <ul className="mt-4 space-y-2.5">
              <li><Link className={a} to="/faq">Shipping policy</Link></li>
              <li><Link className={a} to="/faq">Returns &amp; remakes</Link></li>
              <li><Link className={a} to="/faq">12-month warranty</Link></li>
              <li><span className="text-sm text-fg-3">Privacy policy</span></li>
              <li><span className="text-sm text-fg-3">Terms of service</span></li>
            </ul>
          </nav>
          <div>
            <h2 className={h}>Contact</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a className={`${a} inline-flex items-center gap-2`} href="mailto:hello@neonsutra.in"><IconMail size={16} /> hello@neonsutra.in</a></li>
              <li><a className={`${a} inline-flex items-center gap-2`} href={`tel:${WHATSAPP_DISPLAY.replace(/\s/g, "")}`}><IconPhone size={16} /> {WHATSAPP_DISPLAY}</a></li>
              <li>
                <a className={`${a} inline-flex items-center gap-2`} href={whatsappLink("Hi NEONSUTRA! I have a question about a custom neon sign.")} target="_blank" rel="noopener noreferrer">
                  <IconWhatsApp size={16} /> WhatsApp design team
                </a>
              </li>
              <li className="text-fg-3">Mon–Sat, 10 am – 7 pm IST</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-xs text-fg-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} NEONSUTRA. Designed in India.</p>
          <p className="rounded-md border border-amber-400/20 bg-amber-400/[0.06] px-3 py-1.5 text-amber-200/90">
            Demo website — no real orders or payments are processed.
          </p>
        </div>
      </Container>
    </footer>
  );
}
