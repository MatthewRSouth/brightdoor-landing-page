import { notFound } from "next/navigation";
import { About } from "@/components/about";
import { ContactCta } from "@/components/contact-cta";
import { Faq } from "@/components/faq";
import { FoundingOffer } from "@/components/founding-offer";
import { Hero } from "@/components/hero";
import { Journey } from "@/components/journey";
import { Process } from "@/components/process";
import { RevealOnScroll } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDictionary, isLocale } from "@/lib/i18n";

/** Sections in DESIGN.md §6 order. */
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <a
        href="#main"
        className="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
      >
        {dict.a11y.skip}
      </a>
      <SiteHeader lang={lang} dict={dict} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero dict={dict} />
        <Journey copy={dict.path} />
        <FoundingOffer copy={dict.offer} />
        <Process copy={dict.process} />
        <About copy={dict.about} />
        <Faq copy={dict.faq} />
        <ContactCta lang={lang} copy={dict.contact} />
      </main>
      <SiteFooter copy={dict.footer} />
      <RevealOnScroll />
    </>
  );
}
