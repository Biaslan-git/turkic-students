import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function OpinionCta() {
  const t = await getTranslations("OpinionCta");

  return (
    <section className="relative bg-background">
      <div className="reveal-on-scroll mx-auto max-w-4xl px-5 pb-6 sm:px-8 md:px-12">
        <div className="flex flex-col items-center gap-5 rounded-[2rem] border border-border bg-tint-teal px-6 py-8 text-center sm:px-10 sm:py-10">
          <h2 className="text-balance font-display text-2xl font-bold tracking-tight sm:text-3xl">{t("title")}</h2>
          <p className="max-w-xl text-pretty text-muted">{t("text")}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/opinion"
              className="rounded-full bg-gradient-to-r from-accent-warm to-[#00d6c8] px-7 py-3.5 text-sm font-semibold text-accent-ink shadow-[0_10px_28px_-10px_var(--accent-warm)] transition-transform hover:scale-[1.03]"
            >
              {t("leave")}
            </Link>
            <Link
              href="/ideas"
              className="rounded-full border border-border bg-background px-7 py-3.5 text-sm font-semibold transition-colors hover:border-accent-warm"
            >
              {t("board")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
