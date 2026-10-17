import { getLocale, getTranslations } from "next-intl/server";
import { IdeaCard } from "@/components/ideas/idea-card";
import { getCountryOptions } from "@/components/ideas/ideas-data";
import { Link } from "@/i18n/navigation";
import { after } from "next/server";
import { ensureTranslations, listIdeas } from "@/lib/ideas";
import { getMyPosts } from "@/lib/my-posts";

export async function IdeasSection() {
  const [t, locale, mine] = await Promise.all([getTranslations("Ideas"), getLocale(), getMyPosts()]);
  const ideas = await listIdeas({ limit: 3, mine, locale });
  const countries = getCountryOptions(locale);
  after(() => ensureTranslations(ideas, locale));

  return (
    <section id="ideas" className="relative scroll-mt-20 bg-background">
      <div className="reveal-on-scroll mx-auto flex max-w-3xl flex-col gap-8 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
        <div className="flex flex-col gap-3">
          <span className="w-fit rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            {t("badge")}
          </span>
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h2>
          <p className="text-pretty text-muted">{t("description")}</p>
        </div>

        {ideas.length > 0 && (
          <div className="flex flex-col gap-4">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} countries={countries} showComments={false} />
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/ideas#form"
            className="rounded-full bg-gradient-to-r from-accent-warm to-[#00d6c8] px-6 py-3 text-sm font-semibold text-accent-ink shadow-[0_10px_28px_-10px_var(--accent-warm)]"
          >
            {t("shareIdea")}
          </Link>
          {ideas.length > 0 && (
            <Link href="/ideas" className="text-sm font-semibold text-accent-warm underline underline-offset-4">
              {t("allIdeas")}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
