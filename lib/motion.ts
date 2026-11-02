import type { CSSProperties } from "react";

/** Sets the stagger index read by the motion classes in globals.css (`--i`, or `--s` for spots). */
export function stagger(index: number, variable: "--i" | "--s" = "--i"): CSSProperties {
  return { [variable]: index } as CSSProperties;
}
