"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { requestReview } from "@/app/actions/request-review";
import { CONTACT_EMAIL } from "@/lib/config";
import { format, type Dictionary, type Locale } from "@/lib/i18n";
import type { FieldError, ReviewField, ReviewFormResult } from "@/lib/review-form";

type ReviewFormProps = {
  lang: Locale;
  copy: Dictionary["contact"]["form"];
};

/** The free website review request. Posts to a server action that emails Matthew. */
export function ReviewForm({ lang, copy }: ReviewFormProps) {
  const [result, formAction, pending] = useActionState<ReviewFormResult | null, FormData>(requestReview, null);
  const sentRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  // When the form became usable. Sent with the submission; the server treats
  // near-instant submissions as bots.
  const startedAtRef = useRef(0);
  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  function submit(formData: FormData) {
    if (startedAtRef.current) formData.set("started_at", String(startedAtRef.current));
    formAction(formData);
  }

  // Move focus to the outcome so keyboard and screen-reader users hear it.
  useEffect(() => {
    if (!result) return;
    if (result.ok) sentRef.current?.focus();
    else summaryRef.current?.focus();
  }, [result]);

  if (result?.ok) {
    return (
      <div ref={sentRef} tabIndex={-1} role="status" className="pop-in rounded-[24px] bg-card p-8 text-center outline-none">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-oksoft">
          <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false" className="fill-none stroke-ok">
            <path d="M5 12.5 10 17.5 19 7.5" pathLength={1} className="draw-check" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="mt-4 font-display text-[22px] font-bold">{copy.sentTitle}</p>
        <p className="mt-2 text-ink2">{copy.sentBody}</p>
      </div>
    );
  }

  const failed = result && !result.ok ? result : null;
  const errorFor = (field: ReviewField): FieldError | undefined => failed?.fieldErrors[field];
  const valueFor = (field: ReviewField): string => failed?.values[field] ?? "";

  return (
    <form action={submit} noValidate className="rounded-[24px] bg-card p-[clamp(20px,4vw,32px)] text-left">
      <input type="hidden" name="lang" value={lang} />
      {/* Honeypot for bots: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Fax
          <input type="text" name="company_fax" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {failed && (
        <p ref={summaryRef} tabIndex={-1} role="alert" className="mb-5 rounded-xl border-2 border-ink bg-peach px-4 py-3 font-bold outline-none">
          {failed.error === "invalid" ? copy.errors.invalid : format(copy.errors[failed.error], { email: CONTACT_EMAIL })}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label={copy.name} autoComplete="name" required error={errorFor("name")} defaultValue={valueFor("name")} copy={copy} />
        <Field name="school" label={copy.school} autoComplete="organization" required error={errorFor("school")} defaultValue={valueFor("school")} copy={copy} />
        <Field name="email" label={copy.email} type="email" autoComplete="email" required error={errorFor("email")} defaultValue={valueFor("email")} copy={copy} />
        <Field name="website" label={copy.website} type="url" autoComplete="url" inputMode="url" placeholder="example.com" error={errorFor("website")} defaultValue={valueFor("website")} copy={copy} />
        <div className="sm:col-span-2">
          <Field name="message" label={copy.message} multiline error={errorFor("message")} defaultValue={valueFor("message")} copy={copy} />
        </div>
      </div>

      <button type="submit" disabled={pending} className="btn btn-primary mt-6 w-full disabled:cursor-wait disabled:opacity-80">
        {pending ? copy.sending : copy.submit}
      </button>
      <p className="mt-3 text-[13px] font-medium text-ink2">{copy.privacyNote}</p>
    </form>
  );
}

type FieldProps = {
  name: ReviewField;
  label: string;
  copy: Dictionary["contact"]["form"];
  defaultValue: string;
  error?: FieldError;
  required?: boolean;
  multiline?: boolean;
  type?: "text" | "email" | "url";
  autoComplete?: string;
  inputMode?: "url";
  placeholder?: string;
};

function Field({ name, label, copy, defaultValue, error, required, multiline, type = "text", autoComplete, inputMode, placeholder }: FieldProps) {
  // useId keeps ids unique even while Next.js keeps the other language's page (and its form) in the DOM.
  const id = `review-${name}-${useId()}`;
  const errorId = `${id}-error`;
  // 16px+ text stops iOS from zooming into the field on focus.
  const inputClass = `w-full rounded-xl border-2 bg-card px-4 text-[16px] text-ink transition-[border-color] duration-150 placeholder:text-ink2 ${
    error ? "border-ink" : "border-line hover:border-ink2"
  }`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[14px] font-bold">
        {label}
        {!required && <span className="ml-2 font-medium text-ink2">({copy.optional})</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`${inputClass} block min-h-28 py-3`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`${inputClass} min-h-[52px]`}
        />
      )}
      {error && (
        <p id={errorId} className="mt-1.5 flex items-center gap-1.5 text-[14px] font-bold text-ink">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" className="shrink-0 fill-none stroke-ink">
            <circle cx="12" cy="12" r="9" strokeWidth="2" />
            <path d="M12 7.5v5.5M12 16.5v.5" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          {copy.errors[error]}
        </p>
      )}
    </div>
  );
}
