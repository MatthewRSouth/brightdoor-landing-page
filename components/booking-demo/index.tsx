"use client";

import { useRef, useState } from "react";
import { format, type Dictionary } from "@/lib/i18n";
import { stagger } from "@/lib/motion";

type BookingDemoProps = {
  copy: Dictionary["demo"];
};

/** A sample of the parent-facing booking flow. Local state only: it never sends data. */
export function BookingDemo({ copy }: BookingDemoProps) {
  const [day, setDay] = useState(0);
  const [time, setTime] = useState(0);
  const [sent, setSent] = useState(false);
  const againRef = useRef<HTMLButtonElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const when = `${copy.days[day]} ${copy.times[time]}`;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
    requestAnimationFrame(() => againRef.current?.focus());
  }

  function handleAgain() {
    setSent(false);
    requestAnimationFrame(() => submitRef.current?.focus());
  }

  return (
    <div className="mx-auto w-full max-w-[440px]">
      <p className="enter mb-3 text-center text-[14px] font-bold text-ink2" style={stagger(2)}>
        {copy.label}
      </p>

      <div
        className="enter arch-door border-[10px] border-b-0 border-brand-blue bg-brand-light px-4 pt-16 pb-5 sm:px-6 sm:pt-20"
        style={stagger(2)}
      >
        <div className="enter rounded-[20px] bg-card p-5 sm:p-6" style={stagger(5)}>
          <p className="text-[13px] font-bold text-ink2">{copy.school}</p>
          <p className="font-display text-[22px] leading-tight font-bold">{copy.title}</p>

          <div role="status" aria-live="polite">
            {sent && (
              <div className="pop-in pt-5 text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-oksoft">
                  <CheckIcon />
                </span>
                <p className="mt-3 font-display text-[20px] font-bold">{copy.sentTitle}</p>
                <p className="font-bold">{when}</p>
                <p className="mt-1 text-[15px] text-ink2">{copy.sentBody}</p>
              </div>
            )}
          </div>

          {sent ? (
            <div className="pop-in mt-5">
              <button ref={againRef} type="button" onClick={handleAgain} className="btn btn-secondary w-full">
                {copy.again}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pop-in mt-4 space-y-4">
              <PillGroup legend={copy.day} options={copy.days} selected={day} onSelect={setDay} />
              <PillGroup legend={copy.time} options={copy.times} selected={time} onSelect={setTime} />
              <button ref={submitRef} type="submit" className="btn btn-primary w-full">
                {format(copy.request, { when })}
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="floor-light enter-light mx-auto h-10 w-full bg-hatsoft" aria-hidden="true" />
    </div>
  );
}

type PillGroupProps = {
  legend: string;
  options: string[];
  selected: number;
  onSelect: (index: number) => void;
};

function PillGroup({ legend, options, selected, onSelect }: PillGroupProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-[14px] font-bold text-ink2">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const active = index === selected;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(index)}
              className={`press min-h-11 rounded-full border-2 px-4 text-[15px] font-bold ${
                active ? "border-action bg-action text-on-action" : "border-line bg-transparent text-ink hover:border-ink2"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false" className="fill-none stroke-ok">
      <path
        d="M5 12.5 10 17.5 19 7.5"
        pathLength={1}
        className="draw-check"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
