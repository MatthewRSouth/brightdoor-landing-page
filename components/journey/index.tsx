import type { Dictionary } from "@/lib/i18n";
import { stagger } from "@/lib/motion";

type JourneyProps = {
  copy: Dictionary["path"];
};

const badgeFills = ["bg-sky", "bg-lilac", "bg-mint"] as const;

export function Journey({ copy }: JourneyProps) {
  return (
    <section id="path" aria-labelledby="path-title" className="section-pad border-y border-line bg-card">
      <div className="container-site">
        <h2 id="path-title" className="h-section max-w-[18em]">
          {copy.title}
        </h2>
        <p className="lead mt-4 max-w-[36em]">{copy.lead}</p>

        <ol className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5">
          {copy.steps.map((step, index) => (
            <li key={step.title} data-reveal="" style={stagger(index)} className="rounded-[26px] bg-paper p-7">
              <span
                aria-hidden="true"
                className={`arch-badge flex h-11 w-9 items-center justify-center border-2 border-ink pt-1 font-display text-[18px] font-bold ${badgeFills[index % badgeFills.length]}`}
              >
                {index + 1}
              </span>
              <h3 className="h-card mt-5">{step.title}</h3>
              <p className="mt-2 text-ink2">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
