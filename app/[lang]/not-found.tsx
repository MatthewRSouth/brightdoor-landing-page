import { lang } from "next/root-params";
import { LogoIcon } from "@/components/logo";
import { defaultLocale, getDictionary, isLocale } from "@/lib/i18n";

export default async function NotFound() {
  const current = await lang();
  const locale = isLocale(current) ? current : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <main className="container-site flex min-h-dvh flex-col items-center justify-center py-20 text-center">
      <LogoIcon />
      <h1 className="h-section mt-6">{dict.notFound.title}</h1>
      <p className="lead mt-3">{dict.notFound.body}</p>
      <a href={`/${locale}`} className="btn btn-primary mt-8">
        {dict.notFound.home}
      </a>
    </main>
  );
}
