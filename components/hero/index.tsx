import { BookingDemo } from "@/components/booking-demo";
import type { Dictionary } from "@/lib/i18n";
import { stagger } from "@/lib/motion";

type HeroProps = {
  dict: Dictionary;
};

export function Hero({ dict }: HeroProps) {
  const { hero } = dict;

  return (
    <section className="py-[clamp(40px,6vw,88px)]">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <p className="enter inline-flex rounded-full bg-hatsoft px-4 py-1.5 text-[14px] font-bold text-ink" style={stagger(0)}>
            {hero.chip}
          </p>
          <h1 className="enter h-display mt-5" style={stagger(1)}>
            {hero.title}
          </h1>
          <p className="enter lead mt-5 max-w-[34em]" style={stagger(2)}>
            {hero.body}
          </p>
          <div className="enter mt-8 flex flex-wrap gap-3" style={stagger(3)}>
            <a href="#contact" className="btn btn-primary">
              {hero.primary}
            </a>
            <a href="#offer" className="btn btn-secondary">
              {hero.secondary}
            </a>
          </div>
          <p className="enter mt-6 text-[15px] font-medium text-ink2" style={stagger(4)}>
            {hero.byline}
          </p>
        </div>

        <BookingDemo copy={dict.demo} />
      </div>
    </section>
  );
}
