"use server";

import { headers } from "next/headers";
import { CONTACT_EMAIL } from "@/lib/config";
import { isLocale } from "@/lib/i18n";
import { consume, withinLimits, type Limit } from "@/lib/rate-limit";
import {
  reviewFields,
  type FieldError,
  type ReviewField,
  type ReviewFormResult,
  type ReviewValues,
} from "@/lib/review-form";

const MAX_LENGTH: Record<ReviewField, number> = {
  name: 100,
  school: 150,
  email: 254,
  website: 300,
  message: 2000,
};

const REQUIRED: readonly ReviewField[] = ["name", "school", "email"];

/**
 * A deliberately strict address check: one address only (no commas, spaces, angle
 * brackets or quotes that could smuggle extra recipients into reply-to).
 */
const EMAIL_PATTERN = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;

/** Real people take longer than this to fill in the form; scripts usually don't. */
const MIN_FILL_TIME_MS = 3_000;

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

/** Invisible control characters (keeps tabs and line breaks for the message). */
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F​-‏‪-‮⁦-⁩]/g;

function readValues(formData: FormData): ReviewValues {
  const values = {} as ReviewValues;
  for (const field of reviewFields) {
    const raw = formData.get(field);
    const text = typeof raw === "string" ? raw.replace(CONTROL_CHARACTERS, "").trim() : "";
    // Single-line fields never need line breaks.
    values[field] = field === "message" ? text : text.replace(/\s+/g, " ");
  }
  return values;
}

/** Accepts "example.com" or "https://example.com"; returns a normalised http(s) URL or null. */
function normaliseWebsite(input: string): string | null {
  const withScheme = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.username || url.password) return null;
    return url.hostname.includes(".") ? url.toString() : null;
  } catch {
    return null;
  }
}

function validate(values: ReviewValues): Partial<Record<ReviewField, FieldError>> {
  const errors: Partial<Record<ReviewField, FieldError>> = {};
  for (const field of reviewFields) {
    if (values[field].length > MAX_LENGTH[field]) errors[field] = "tooLong";
    else if (REQUIRED.includes(field) && !values[field]) errors[field] = "required";
  }
  if (!errors.email && !EMAIL_PATTERN.test(values.email)) errors.email = "email";
  if (!errors.website && values.website && !normaliseWebsite(values.website)) errors.website = "url";
  return errors;
}

/** Values echoed back so the form keeps what was typed; capped so a huge post isn't sent back. */
function echo(values: ReviewValues): ReviewValues {
  const capped = {} as ReviewValues;
  for (const field of reviewFields) capped[field] = values[field].slice(0, MAX_LENGTH[field] * 2);
  return capped;
}

/** The client's IP as set by Vercel's edge (falls back to a shared bucket if missing). */
async function clientIp(): Promise<string> {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || list.get("x-real-ip") || "unknown";
}

function limitsFor(ip: string, email: string): Limit[] {
  return [
    { key: `ip-10m:${ip}`, max: 3, windowMs: 10 * MINUTE },
    { key: `ip-day:${ip}`, max: 10, windowMs: DAY },
    { key: `email-day:${email.toLowerCase()}`, max: 3, windowMs: DAY },
    // Overall ceiling: protects the inbox and Resend's free daily quota (100/day).
    { key: "all-day", max: 50, windowMs: DAY },
  ];
}

async function sendWithResend(values: ReviewValues, locale: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[request-review] RESEND_API_KEY is not set; the request was not sent.");
    return false;
  }

  const website = values.website ? normaliseWebsite(values.website) : null;
  const text = [
    `Name: ${values.name}`,
    `School: ${values.school}`,
    `Email: ${values.email}`,
    `Website: ${website ?? "(none given)"}`,
    `Page language: ${locale}`,
    "",
    "Message:",
    values.message || "(none)",
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? "Brightdoor website <onboarding@resend.dev>",
        to: [CONTACT_EMAIL],
        reply_to: values.email,
        subject: `Free website review request: ${values.school}`,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      // Status only: the response body could echo the submitted details.
      console.error(`[request-review] Resend responded with status ${response.status}.`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[request-review] Could not reach Resend.", error instanceof Error ? error.name : "unknown error");
    return false;
  }
}

/** Server action for the free-review form. Validates, rate-limits and emails the request via Resend. */
export async function requestReview(_previous: ReviewFormResult | null, formData: FormData): Promise<ReviewFormResult> {
  // Bot traps: pretend it worked so scripts don't learn to avoid them.
  if (formData.get("company_fax")) return { ok: true };
  const startedAt = Number(formData.get("started_at"));
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_TIME_MS) return { ok: true };

  const values = readValues(formData);
  const rawLocale = formData.get("lang");
  const locale = typeof rawLocale === "string" && isLocale(rawLocale) ? rawLocale : "unknown";

  const fieldErrors = validate(values);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "invalid", fieldErrors, values: echo(values) };
  }

  const limits = limitsFor(await clientIp(), values.email);
  if (!withinLimits(limits)) {
    return { ok: false, error: "rateLimited", fieldErrors: {}, values: echo(values) };
  }
  consume(limits);

  const sent = await sendWithResend(values, locale);
  return sent ? { ok: true } : { ok: false, error: "send", fieldErrors: {}, values: echo(values) };
}
