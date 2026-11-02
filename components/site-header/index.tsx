import { LanguageToggle } from "@/components/language-toggle";
import { Logo } from "@/components/logo";
import type { Dictionary, Locale } from "@/lib/i18n";

type SiteHeaderProps = {
  lang: Locale;
  dict: Dictionary;
};

export function SiteHeader({ lang, dict }: SiteHeaderProps) {
  const navItems = [
    { href: "#path", label: dict.nav.how },
    { href: "#offer", label: dict.nav.offer },
    { href: "#faq", label: dict.nav.faq },
  ];

  return (
    <header className="site-header sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="container-site flex min-h-[72px] items-center justify-between gap-3">
        <Logo href={`/${lang}`} />

        <nav aria-label={dict.a11y.mainNav} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-xl px-3 text-[15px] font-bold text-ink2 transition-[color,background-color,border-color] duration-150 hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle lang={lang} label={dict.langLabel} />
          <a href="#contact" className="btn btn-primary hidden min-h-11 px-4 text-[15px] xs:inline-flex">
            {dict.nav.cta}
          </a>
        </div>
      </div>
    </header>
  );
}
