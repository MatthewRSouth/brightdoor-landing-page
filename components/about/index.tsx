import type { Dictionary } from "@/lib/i18n";
import { stagger } from "@/lib/motion";

type AboutProps = {
  copy: Dictionary["about"];
};

export function About({ copy }: AboutProps) {
  return (
    <section aria-labelledby="about-title" className="section-pad">
      <div className="container-site grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        {/* Placeholder until the real photo is supplied */}
        <div
          role="img"
          aria-label={copy.photoAlt}
          data-reveal=""
          className="arch-photo mx-auto flex aspect-[3/4] w-full max-w-[360px] items-center justify-center bg-sky"
        >
          <span aria-hidden="true" className="text-[15px] font-bold text-ink2">
            {copy.photo}
          </span>
        </div>

        <div>
          <h2 id="about-title" className="h-section">
            {copy.title}
          </h2>
          <p className="mt-5 text-[18px]">{copy.body}</p>

          <div data-reveal="" style={stagger(1)} className="mt-8 rounded-[24px] bg-lilac p-6">
            <p className="text-[14px] font-bold text-ink">{copy.nextLabel}</p>
            <p className="mt-1 text-ink">{copy.nextBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
