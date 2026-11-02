import { PRIVACY_URL } from "@/lib/config";
import { format, type Dictionary } from "@/lib/i18n";

type SiteFooterProps = {
  copy: Dictionary["footer"];
};

/** Cached so the static page can be prerendered (Cache Components disallows a bare `new Date()`). */
async function getCurrentYear(): Promise<number> {
  "use cache";
  return new Date().getFullYear();
}

export async function SiteFooter({ copy }: SiteFooterProps) {
  const year = await getCurrentYear();

  return (
    <footer className="border-t border-line">
      <div className="container-site flex flex-col gap-2 py-10 text-[14px] font-medium text-ink2 sm:flex-row sm:items-center sm:justify-between">
        <p>{copy.tag}</p>
        <div className="flex flex-wrap items-center gap-x-6">
          {PRIVACY_URL && (
            <a href={PRIVACY_URL} className="text-link text-[14px] text-ink2">
              {copy.privacy}
            </a>
          )}
          <p lang="en">{format(copy.copyright, { year })}</p>
        </div>
      </div>
    </footer>
  );
}
