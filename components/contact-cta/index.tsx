import { ReviewForm } from "@/components/review-form";
import { CONTACT_EMAIL, INSTAGRAM_URL, REVIEW_MAILTO } from "@/lib/config";
import type { Dictionary, Locale } from "@/lib/i18n";

type ContactCtaProps = {
  lang: Locale;
  copy: Dictionary["contact"];
};

export function ContactCta({ lang, copy }: ContactCtaProps) {
  // "Prefer email? Write to {email}": render {email} as a link
  const [beforeEmail, afterEmail = ""] = copy.form.orEmail.split("{email}");

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-pad">
      <div className="container-site">
        <div
          data-reveal=""
          className="grid items-start gap-10 rounded-[32px] bg-sky px-[clamp(20px,5vw,64px)] py-[clamp(40px,6vw,72px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14"
        >
          <div className="lg:pt-4">
            <h2 id="contact-title" className="h-section max-w-[14em]">
              {copy.title}
            </h2>
            <p className="lead mt-4 max-w-[30em] text-ink">{copy.body}</p>
            <p className="mt-6 text-[15px] font-medium text-ink">
              {beforeEmail}
              <a href={REVIEW_MAILTO} className="text-link min-h-0 break-all">
                {CONTACT_EMAIL}
              </a>
              {afterEmail}
            </p>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-6">
              {copy.instagram}
            </a>
          </div>

          <ReviewForm lang={lang} copy={copy.form} />
        </div>
      </div>
    </section>
  );
}
