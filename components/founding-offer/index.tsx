import { FOUNDING_SPOTS_TAKEN, FOUNDING_SPOTS_TOTAL } from "@/lib/config";
import { format, type Dictionary } from "@/lib/i18n";
import { stagger } from "@/lib/motion";

type FoundingOfferProps = {
  copy: Dictionary["offer"];
};

export function FoundingOffer({ copy }: FoundingOfferProps) {
  const taken = Math.min(Math.max(FOUNDING_SPOTS_TAKEN, 0), FOUNDING_SPOTS_TOTAL);
  const open = FOUNDING_SPOTS_TOTAL - taken;

  return (
    <section id="offer" aria-labelledby="offer-title" className="section-pad">
      <div className="container-site">
        <h2 id="offer-title" className="h-section">
          {copy.title}
        </h2>
        <p className="lead mt-4">{copy.lead}</p>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
          {/* Price card */}
          <div
            data-reveal=""
            style={stagger(0)}
            className="rounded-[28px] border-2 border-brand-blue bg-card p-[clamp(24px,4vw,40px)]"
          >
            <p className="font-display text-[clamp(44px,6vw,64px)] leading-none font-bold tracking-[-0.02em] ja:tracking-normal">
              {copy.price}
            </p>
            <p className="mt-2 font-bold text-ink2">{copy.priceNote}</p>

            <ul className="mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {copy.included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a href="#contact" className="btn btn-primary mt-8 w-full sm:w-auto">
              {copy.cta}
            </a>
          </div>

          {/* Spots panel */}
          <div data-reveal="" style={stagger(1)} className="flex flex-col rounded-[28px] bg-peach p-[clamp(24px,4vw,40px)]">
            <h3 className="h-card">{format(copy.spotsLeft, { n: open })}</h3>
            <ol aria-hidden="true" className="mt-6 flex flex-wrap gap-3">
              {Array.from({ length: FOUNDING_SPOTS_TOTAL }, (_, index) => {
                const isTaken = index < taken;
                return (
                  <li key={index} style={stagger(index, "--s")} className="spot flex flex-col items-center gap-1.5">
                    <span
                      className={`arch-spot block h-[54px] w-10 border-2 border-ink ${isTaken ? "bg-ink" : "bg-brand-light"}`}
                    />
                    <span className="text-[13px] font-bold text-ink">{isTaken ? copy.spotTaken : copy.spotOpen}</span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-auto pt-6 text-[15px] font-medium text-ink2">{copy.spotsNote}</p>
          </div>
        </div>

        {/* Care plan */}
        <div data-reveal="" className="mt-5 flex flex-col gap-4 rounded-[24px] border border-line bg-card p-[clamp(24px,4vw,40px)] md:flex-row md:items-center md:justify-between md:gap-10">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="h-card">{copy.careTitle}</h3>
              <span className="rounded-full bg-lilac px-3 py-0.5 text-[13px] font-bold text-ink">{copy.careOptional}</span>
            </div>
            <p className="mt-2 max-w-[38em] text-ink2">{copy.careBody}</p>
          </div>
          <p className="shrink-0 font-display text-[22px] font-bold">{copy.carePrice}</p>
        </div>

        <p className="mt-6 max-w-[52em] text-[15px] text-ink2">{copy.footnote}</p>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      focusable="false"
      className="mt-[3px] shrink-0 fill-none stroke-ok"
    >
      <path d="M5 12.5 10 17.5 19 7.5" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
