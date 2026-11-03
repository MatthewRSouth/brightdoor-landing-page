/** Shared types for the free-review form (client component + server action). */

export const reviewFields = ["name", "school", "email", "website", "message"] as const;
export type ReviewField = (typeof reviewFields)[number];
export type ReviewValues = Record<ReviewField, string>;

/** Each maps to a message in `contact.form.errors`. */
export type FieldError = "required" | "email" | "url" | "tooLong";

export type ReviewFormResult =
  | { ok: true }
  | {
      ok: false;
      /** "invalid": a field needs fixing. "rateLimited": too many requests. "send": the email couldn't be sent. */
      error: "invalid" | "rateLimited" | "send";
      fieldErrors: Partial<Record<ReviewField, FieldError>>;
      values: ReviewValues;
    };
