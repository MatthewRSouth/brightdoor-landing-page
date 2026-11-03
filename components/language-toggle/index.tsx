"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { localeNames, type Locale } from "@/lib/i18n";

/** Shown as "EN | 日本語" (DESIGN.md §5). */
const toggleOrder: readonly Locale[] = ["en", "ja"];
const STORAGE_KEY = "brightdoor:lang-switch-position";

/** Where the reader is: which section of <main> sits under the header, and how far into it. */
type ReadingPosition = {
  sectionIndex: number;
  progress: number;
};

/**
 * Next.js keeps recently visited pages in the DOM (hidden) for instant back navigation,
 * so the other locale's header and <main> may exist too. Always work from this toggle's
 * own header and the <main> that follows it.
 */
function pageParts(nav: HTMLElement | null): { header: HTMLElement; main: HTMLElement } | null {
  const header = nav?.closest("header");
  if (!header) return null;
  let next = header.nextElementSibling;
  while (next && next.tagName !== "MAIN") next = next.nextElementSibling;
  return next instanceof HTMLElement ? { header, main: next } : null;
}

function isVisible(element: HTMLElement): boolean {
  return element.getClientRects().length > 0;
}

function sectionsOf(main: HTMLElement): HTMLElement[] {
  return Array.from(main.querySelectorAll<HTMLElement>(":scope > section"));
}

function currentPosition(nav: HTMLElement | null): ReadingPosition | null {
  const parts = pageParts(nav);
  if (!parts) return null;
  const top = parts.header.getBoundingClientRect().bottom;
  const list = sectionsOf(parts.main);
  const index = list.findIndex((section) => section.getBoundingClientRect().bottom > top);
  if (index === -1) return null;
  const rect = list[index].getBoundingClientRect();
  return { sectionIndex: index, progress: Math.max(0, (top - rect.top) / rect.height) };
}

/** Reads a saved position defensively: storage is user-editable, so anything malformed is ignored. */
function parsePosition(saved: string | null): ReadingPosition | null {
  if (!saved) return null;
  try {
    const value: unknown = JSON.parse(saved);
    if (typeof value !== "object" || value === null) return null;
    const { sectionIndex, progress } = value as Record<string, unknown>;
    if (!Number.isInteger(sectionIndex) || typeof progress !== "number" || !Number.isFinite(progress)) return null;
    return { sectionIndex: sectionIndex as number, progress: Math.min(Math.max(progress, 0), 1) };
  } catch {
    return null;
  }
}

function restorePosition(nav: HTMLElement | null, position: ReadingPosition) {
  const parts = pageParts(nav);
  const section = parts && sectionsOf(parts.main)[position.sectionIndex];
  if (!parts || !section) return;
  const rect = section.getBoundingClientRect();
  const target = window.scrollY + rect.top + position.progress * rect.height - parts.header.getBoundingClientRect().bottom;
  // "instant" overrides the page's smooth scrolling, so the reader isn't carried down the page
  window.scrollTo({ top: Math.max(0, target), behavior: "instant" });
}

type LanguageToggleProps = {
  lang: Locale;
  label: string;
};

/**
 * Links to the same page in the other locale. Switching keeps the reader at the same
 * place in the page (same section, same distance into it) instead of jumping to the top.
 */
export function LanguageToggle({ lang, label }: LanguageToggleProps) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage blocked (private mode etc.): the page simply stays where the browser leaves it.
    }
    const position = parsePosition(saved);
    if (!position) return;

    // The new page can arrive in parts (streamed), so it may briefly be too short to hold the
    // reading position. Wait until it's on screen, then keep re-applying the position while
    // it grows, for up to ~1.5s or until the reader scrolls themselves.
    let frame = 0;
    let tries = 0;
    let resizeObserver: ResizeObserver | null = null;
    const apply = () => restorePosition(navRef.current, position);
    const stop = () => {
      resizeObserver?.disconnect();
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
    const attempt = () => {
      const parts = pageParts(navRef.current);
      if (parts && isVisible(parts.main)) {
        apply();
        resizeObserver = new ResizeObserver(apply);
        resizeObserver.observe(parts.main);
        window.addEventListener("wheel", stop, { passive: true });
        window.addEventListener("touchstart", stop, { passive: true });
        window.addEventListener("keydown", stop);
      } else if (tries++ < 60) {
        frame = requestAnimationFrame(attempt);
      }
    };
    frame = requestAnimationFrame(attempt);
    const timeout = window.setTimeout(stop, 1500);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      stop();
    };
  }, [lang]);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    // Opening in a new tab/window: nothing to restore here.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const position = currentPosition(navRef.current);
    if (!position) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(position));
    } catch {
      // Ignore: see above.
    }
  }

  return (
    <nav ref={navRef} aria-label={label}>
      <ul className="flex rounded-full border border-line bg-card p-1">
        {toggleOrder.map((locale) => {
          const active = locale === lang;
          return (
            <li key={locale}>
              <Link
                href={`/${locale}`}
                scroll={false}
                onClick={active ? undefined : handleClick}
                lang={locale}
                hrefLang={locale}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-3 text-[14px] font-bold transition-[color,background-color,border-color] duration-150 ${
                  active ? "bg-action text-on-action" : "text-ink2 hover:text-ink"
                }`}
              >
                {localeNames[locale]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
