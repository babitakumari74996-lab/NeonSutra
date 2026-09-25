import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Container } from "./ui";
import { CATEGORIES } from "@/data/categories";
import { IconFacebook, IconInstagram, IconMail, IconPhone, IconWhatsApp, IconYoutube } from "./Icons";
import { shopConfig, whatsappLink, getCurrentYear } from "@/config/shop.config";

export function Footer() {
  const { brand, contact, social, legal, navigation, features } = shopConfig;
  const h = "text-xs font-semibold uppercase tracking-[0.16em] text-fg-3";
  const a = "text-sm text-fg-2 transition-colors hover:text-fg";
  const year = getCurrentYear();
  return (
    <footer className="border-t border-white/[0.06] bg-ink-950">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-2">
              {shopConfig.brand.description}
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { I: IconInstagram, ...social.instagram },
                { I: IconYoutube, ...social.youtube },
                { I: IconFacebook, ...social.facebook },
              ].map(({ I, label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${brand.name} on ${label}`}
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
              {navigation.quickLinks.map((link) => (
                <li key={link.href}><Link className={a} to={link.href}>{link.label}</Link></li>
              ))}
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
              <li><Link className={a} to={legal.shippingPolicyUrl}>Shipping policy</Link></li>
              <li><Link className={a} to={legal.returnsPolicyUrl}>Returns & remakes</Link></li>
              <li><Link className={a} to={legal.warrantyUrl}>{features.warrantyMonths}-month warranty</Link></li>
              <li><Link className={a} to={legal.privacyPolicyUrl}>Privacy policy</Link></li>
              <li><Link className={a} to={legal.termsOfServiceUrl}>Terms of service</Link></li>
            </ul>
          </nav>
          <div>
            <h2 className={h}>Contact</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a className={`${a} inline-flex items-center gap-2`} href={`mailto:${contact.email}`}><IconMail size={16} /> {contact.email}</a></li>
              <li><a className={`${a} inline-flex items-center gap-2`} href={`tel:${contact.phoneDisplay.replace(/\s/g, "")}`}><IconPhone size={16} /> {contact.phoneDisplay}</a></li>
              <li>
                <a className={`${a} inline-flex items-center gap-2`} href={whatsappLink(shopConfig.whatsapp.defaultMessage)} target="_blank" rel="noopener noreferrer">
                  <IconWhatsApp size={16} /> WhatsApp design team
                </a>
              </li>
              <li className="text-fg-3">{contact.hours}</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-xs text-fg-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {legal.companyName}. Designed in India.</p>
          <p className="rounded-md border border-amber-400/20 bg-amber-400/[0.06] px-3 py-1.5 text-amber-200/90">
            Demo website — no real orders or payments are processed.
          </p>
        </div>
      </Container>
    </footer>
  );
}
