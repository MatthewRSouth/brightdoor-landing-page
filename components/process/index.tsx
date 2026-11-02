import { format, type Dictionary } from "@/lib/i18n";
import { stagger } from "@/lib/motion";

type ProcessProps = {
  copy: Dictionary["process"];
};

export function Process({ copy }: ProcessProps) {
  return (
    <section aria-labelledby="process-title" className="section-pad border-y border-line bg-card">
      <div className="container-site">
        <h2 id="process-title" className="h-section">
          {copy.title}
        </h2>
        <p className="lead mt-4">{copy.lead}</p>

        <ol className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-x-8 gap-y-10">
          {copy.steps.map((step, index) => (
            <li key={step.title} data-reveal="" style={stagger(index)} className="border-t-2 border-ink pt-5">
              <p className="text-[14px] font-bold text-ink2">{format(copy.stepLabel, { n: index + 1 })}</p>
              <h3 className="h-card mt-1">{step.title}</h3>
              <p className="mt-2 text-ink2">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
