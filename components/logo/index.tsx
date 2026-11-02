type LogoIconProps = {
  className?: string;
};

/** The Brightdoor door mark: deep-blue tile, light-blue frame, butter-yellow doorway and rays, open white door. */
export function LogoIcon({ className }: LogoIconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      width="40"
      height="40"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="40" height="40" rx="10" className="fill-brand-blue" />
      <g className="stroke-brand-light" strokeWidth="1.8" strokeLinecap="round">
        <line x1="20" y1="5.5" x2="20" y2="3" />
        <line x1="11.2" y1="9.4" x2="9.2" y2="7.6" />
        <line x1="28.8" y1="9.4" x2="30.8" y2="7.6" />
      </g>
      <path d="M11.5 33V17.5a8.5 8.5 0 0 1 17 0V33Z" className="fill-brand-frame" />
      <path d="M14.2 33V17.8a5.8 5.8 0 0 1 11.6 0V33Z" className="fill-brand-light" />
      <path d="M14.2 17.4 20.2 19.4V35.2L14.2 33Z" className="fill-brand-door" />
    </svg>
  );
}

type LogoProps = {
  href: string;
};

export function Logo({ href }: LogoProps) {
  return (
    <a
      href={href}
      className="inline-flex min-h-11 items-center gap-2.5 rounded-xl font-display text-[22px] font-bold tracking-[-0.02em] text-ink no-underline"
    >
      <LogoIcon className="shrink-0" />
      <span lang="en">Brightdoor</span>
    </a>
  );
}
