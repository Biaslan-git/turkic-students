import { getLocale, getTranslations } from "next-intl/server";
import type { Idea } from "@/lib/ideas";
import { countryFlag, countryName } from "@/lib/country";
import type { SelectOption } from "@/components/ui/select";
import { TranslatedText } from "@/components/ideas/translated-text";
import { CommentForm } from "@/components/ideas/comment-form";

function formatDate(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso.slice(0, 10);
  }
}

export async function IdeaCard({
  idea,
  countries,
  showComments = true,
}: {
  idea: Idea;
  countries: SelectOption[];
  showComments?: boolean;
}) {
  const [t, tCategories, locale] = await Promise.all([
    getTranslations("Ideas"),
    getTranslations("Constants.opinionCategories"),
    getLocale(),
  ]);

  const author = (name: string | null) => name?.trim() || t("anonymous");
  const textProps = {
    showOriginalLabel: t("showOriginal"),
    showTranslationLabel: t("showTranslation"),
  };

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full border border-border bg-background px-2.5 py-1 font-semibold uppercase tracking-wide text-muted">
          {tCategories(`${idea.category}.label`)}
        </span>
        <span className="text-muted">{formatDate(idea.createdAt, locale)}</span>
      </div>

      <TranslatedText
        original={idea.text}
        translated={idea.translations[locale] ?? idea.text}
        className="text-base"
        {...textProps}
      />

      <p className="text-sm text-muted">
        <span className="font-semibold text-foreground">{author(idea.authorName)}</span> ·{" "}
        {countryFlag(idea.country)} {countryName(idea.country, locale)}
        {idea.universityName ? ` · ${idea.universityName}` : ""}
      </p>

      {showComments && idea.comments.length > 0 && (
        <ul className="flex flex-col gap-3 border-l-2 border-accent-warm/40 pl-4">
          {idea.comments.map((c) => (
            <li key={c.id} className="flex flex-col gap-1">
              <TranslatedText
                original={c.text}
                translated={c.translations[locale] ?? c.text}
                className="text-sm"
                {...textProps}
              />
              <p className="text-xs text-muted">
                <span className="font-semibold text-foreground">{author(c.authorName)}</span> ·{" "}
                {countryFlag(c.country)} {countryName(c.country, locale)} · {formatDate(c.createdAt, locale)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {showComments && <CommentForm ideaId={idea.id} countries={countries} />}
    </article>
  );
}
