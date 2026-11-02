import { INSTAGRAM_URL, REVIEW_MAILTO } from "@/lib/config";
import type { Dictionary } from "@/lib/i18n";

type ContactCtaProps = {
  copy: Dictionary["contact"];
};

export function ContactCta({ copy }: ContactCtaProps) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section-pad">
      <div className="container-site">
        <div data-reveal="" className="rounded-[32px] bg-sky px-[clamp(20px,5vw,64px)] py-[clamp(40px,6vw,72px)] text-center">
          <h2 id="contact-title" className="h-section mx-auto max-w-[16em]">
            {copy.title}
          </h2>
          <p className="lead mx-auto mt-4 max-w-[32em] text-ink">{copy.body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={REVIEW_MAILTO} className="btn btn-primary">
              {copy.email}
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              {copy.instagram}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
