import type { Dictionary } from "@/lib/i18n";
import { stagger } from "@/lib/motion";

type FaqProps = {
  copy: Dictionary["faq"];
};

export function Faq({ copy }: FaqProps) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-pad border-y border-line bg-card">
      <div className="container-site">
        <div className="mx-auto max-w-[860px]">
          <h2 id="faq-title" className="h-section">
            {copy.title}
          </h2>

          <div className="mt-10 space-y-3">
            {copy.items.map((item, index) => (
              <details
                key={item.q}
                data-reveal=""
                style={stagger(index)}
                className="group rounded-[18px] border border-line bg-card"
              >
                <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 rounded-[18px] px-6 py-4 font-bold [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <ChevronIcon />
                </summary>
                <p className="px-6 pb-5 text-ink2">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      focusable="false"
      className="shrink-0 fill-none stroke-ink transition-transform duration-200 group-open:rotate-180"
    >
      <path d="M6 9.5 12 15.5 18 9.5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
