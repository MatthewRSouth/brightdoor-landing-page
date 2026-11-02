import type en from "@/content/en.json";

export const locales = ["ja", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ja";

/** The English file is the source of truth for the shape of the copy. */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ja: () => import("@/content/ja.json").then((m) => m.default),
  en: () => import("@/content/en.json").then((m) => m.default),
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export async function getDictionary(locale: string): Promise<Dictionary> {
  if (!isLocale(locale)) {
    throw new Error(`Unknown locale "${locale}". Expected one of: ${locales.join(", ")}.`);
  }
  return dictionaries[locale]();
}

/** Fills `{name}` placeholders, e.g. format("Step {n}", { n: 2 }). */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** Picks the best supported locale from an Accept-Language header. */
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const quality = q ? Number.parseFloat(q.trim().slice(2)) : 1;
      return { base: tag.split("-")[0], quality: Number.isNaN(quality) ? 0 : quality };
    })
    .filter((entry) => entry.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { base } of ranked) {
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}

/** Labels for the language toggle (each shown in its own language). */
export const localeNames: Record<Locale, string> = {
  en: "EN",
  ja: "日本語",
};
