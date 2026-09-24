import { SEO } from "@/components/SEO";
import { NeonPreview } from "@/components/NeonPreview";
import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-16 sm:py-24">
      <SEO title="Page not found — NEONSUTRA" description="The page you were looking for doesn't exist." />
      <div className="mx-auto max-w-2xl text-center">
        <div className="overflow-hidden rounded-xl border border-white/[0.07]">
          <NeonPreview text="404" font="retro" colour="red" size="Medium" label="Red neon sign reading 404" />
        </div>
        <h1 className="mt-10 font-display text-3xl font-semibold sm:text-4xl">This wall's still blank</h1>
        <p className="mt-3 text-fg-2">The page you're looking for has moved or never existed. Let's get you somewhere brighter.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink to="/">Back to home</ButtonLink>
          <ButtonLink to="/shop" variant="secondary">Explore designs</ButtonLink>
        </div>
      </div>
    </Container>
  );
}
