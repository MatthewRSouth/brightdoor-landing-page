"use client";

import { useEffect } from "react";

/**
 * Fades `[data-reveal]` elements in as they scroll into view (once).
 * Only elements that start below the fold are hidden, so content already on
 * screen never flickers and the page reads fine without JavaScript.
 * Styles live in app/globals.css ("Scroll reveal").
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

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

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.setAttribute("data-reveal", "hidden");
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
