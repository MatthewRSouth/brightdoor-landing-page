import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Zen_Kaku_Gothic_New } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { SITE_URL } from "@/lib/config";
import "../globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  display: "swap",
});

// Japanese glyphs are split into many unicode-range files by Google Fonts,
// so only the Latin subset is preloaded; kana/kanji load as needed.
const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ja: "/ja",
        en: "/en",
        "x-default": "/ja",
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: lang === "ja" ? "ja_JP" : "en_US",
      type: "website",
      siteName: "Brightdoor",
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EEF4FB" },
    { media: "(prefers-color-scheme: dark)", color: "#111826" },
  ],
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${bricolage.variable} ${zenKaku.variable}`}>
      <body className="min-h-dvh bg-paper text-ink">{children}</body>
    </html>
  );
}
