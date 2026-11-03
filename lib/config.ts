/** Site-wide values that are not copy. Change them here, not in components. */

export const FOUNDING_SPOTS_TOTAL = 5;
/** How many founding spots are already taken (0–5). */
export const FOUNDING_SPOTS_TAKEN = 0;

export const CONTACT_EMAIL = "brightdoorcontact@gmail.com";
export const REVIEW_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Free website review")}`;

export const INSTAGRAM_HANDLE = "getbrightdoor";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

/** Set to a path such as "/privacy" once the privacy policy exists. The footer link is hidden while null. */
export const PRIVACY_URL: string | null = null;

/** Used for absolute URLs in metadata (hreflang, Open Graph). Update when the domain is live. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
