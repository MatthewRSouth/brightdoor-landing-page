"use client";

import { useEffect } from "react";

function isRendered(element: HTMLElement): boolean {
  return element.getClientRects().length > 0;
}

/**
 * Fades `[data-reveal]` elements in as they scroll into view (once).
 * Only elements that start below the fold are hidden, so content already on
 * screen never flickers and the page reads fine without JavaScript.
 * Styles live in app/globals.css ("Scroll reveal").
 *
 * Next.js keeps the other language's page in the DOM (hidden) and re-runs this
 * effect when it comes back, so every run must cope with elements left in any
 * state by a previous run: anything on screen is shown, anything below is
 * (re)observed, and elements of a page that isn't displayed are ignored.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach((element) => element.setAttribute("data-reveal", "shown"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-reveal", "shown");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    let frame = 0;
    let tries = 0;
    const setup = () => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter(isRendered);
      // This page may not be displayed yet during a client navigation: wait (up to ~1s).
      if (elements.length === 0) {
        if (tries++ < 60) frame = requestAnimationFrame(setup);
        return;
      }
      for (const element of elements) {
        if (element.getAttribute("data-reveal") === "shown") continue;
        if (element.getBoundingClientRect().top < window.innerHeight) {
          // On screen: never leave it hidden. If a previous run hid it, this fades it in.
          if (element.getAttribute("data-reveal") === "hidden") element.setAttribute("data-reveal", "shown");
          continue;
        }
        element.setAttribute("data-reveal", "hidden");
        observer.observe(element);
      }
    };
    setup();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return null;
}
