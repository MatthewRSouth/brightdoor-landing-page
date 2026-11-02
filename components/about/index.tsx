import Image from "next/image";
import headshot from "@/content/headshot.jpeg";
import type { Dictionary } from "@/lib/i18n";
import { stagger } from "@/lib/motion";

type AboutProps = {
  copy: Dictionary["about"];
};

export function About({ copy }: AboutProps) {
  return (
    <section aria-labelledby="about-title" className="section-pad">
      <div className="container-site grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <div
          data-reveal=""
          className="arch-photo relative mx-auto aspect-[3/4] w-full max-w-[360px] overflow-hidden bg-sky"
        >
          <Image
            src={headshot}
            alt={copy.photoAlt}
            fill
            sizes="(min-width: 768px) 360px, 90vw"
            placeholder="blur"
            className="object-cover"
          />
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
