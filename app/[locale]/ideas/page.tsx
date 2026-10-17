import type { Metadata } from "next";
import { after } from "next/server";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { IdeaForm } from "@/components/ideas/idea-form";
import { IdeaCard } from "@/components/ideas/idea-card";
import { getCountryOptions } from "@/components/ideas/ideas-data";
import { Link } from "@/i18n/navigation";
import { IDEA_COUNTRIES, OPINION_CATEGORIES } from "@/lib/constants";
import { getSiteContent } from "@/lib/content/site-content";
import { ensureTranslations, listIdeas } from "@/lib/ideas";
import { getMyPosts } from "@/lib/my-posts";
import { listActiveUniversities, universityOptionLabel } from "@/lib/universities";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Ideas" });
  return { title: `${t("title")} — TURKIC STUDENTS` };
}

// Та же причина, что и у app/[locale]/page.tsx — контент и идеи читаются из БД на каждый запрос.
export const dynamic = "force-dynamic";

const pillClass = "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors";

export default async function IdeasPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ country?: string; category?: string }>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const country = (IDEA_COUNTRIES as readonly string[]).includes(query.country ?? "") ? query.country : undefined;
  const category = OPINION_CATEGORIES.some((c) => c.value === query.category) ? query.category : undefined;

  const mine = await getMyPosts();
  const [c, t, tCategories, tNav, ideas, universities] = await Promise.all([
    getSiteContent(locale),
    getTranslations({ locale, namespace: "Ideas" }),
    getTranslations({ locale, namespace: "Constants.opinionCategories" }),
    getTranslations({ locale, namespace: "Nav" }),
    listIdeas({ country, category, mine, locale }),
    listActiveUniversities(),
  ]);
  const countries = getCountryOptions(locale);
  after(() => ensureTranslations(ideas, locale));

  const href = (next: { country?: string; category?: string }) => {
    const params = new URLSearchParams();
    const nextCountry = "country" in next ? next.country : country;
    const nextCategory = "category" in next ? next.category : category;
    if (nextCountry) params.set("country", nextCountry);
    if (nextCategory) params.set("category", nextCategory);
    const qs = params.toString();
    return `/ideas${qs ? `?${qs}` : ""}#feed`;
  };
  const pill = (active: boolean) =>
    `${pillClass} ${active ? "border-accent-warm bg-accent-warm/10" : "border-border bg-background text-muted"}`;

  return (
    <div className="flex flex-1 flex-col">
      <Header ctaLabel={c.cta_label} />
      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden bg-tint-teal">
          <div className="reveal-on-scroll relative mx-auto flex max-w-2xl flex-col gap-8 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
            <div className="flex flex-col items-center gap-3 text-center">
              <Link href="/" className="mb-2 text-sm font-semibold text-accent-warm underline underline-offset-4">
                {tNav("backHome")}
              </Link>
              <span className="w-fit rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                {t("badge")}
              </span>
              <h1 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {t("title")}
              </h1>
              <p className="max-w-md text-pretty text-muted">{t("description")}</p>
            </div>

            <div id="form" className="scroll-mt-24">
              <IdeaForm
                countries={countries}
                universities={universities.map((u) => ({ value: u.id, label: universityOptionLabel(u, locale) }))}
              />
            </div>
          </div>
        </section>

        <section id="feed" className="scroll-mt-20">
          <div className="mx-auto flex max-w-2xl flex-col gap-6 px-5 py-16 sm:px-8 md:px-12">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Link href={href({ country: undefined })} className={pill(!country)}>
                  {t("allCountries")}
                </Link>
                {countries.map((o) => (
                  <Link key={o.value} href={href({ country: o.value })} className={pill(country === o.value)}>
                    {o.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={href({ category: undefined })} className={pill(!category)}>
                  {t("allCategories")}
                </Link>
                {OPINION_CATEGORIES.map((o) => (
                  <Link key={o.value} href={href({ category: o.value })} className={pill(category === o.value)}>
                    {tCategories(`${o.value}.label`)}
                  </Link>
                ))}
              </div>
            </div>

            {ideas.length === 0 ? (
              <p className="rounded-2xl border border-border bg-surface p-8 text-center text-muted">{t("empty")}</p>
            ) : (
              <div className="flex flex-col gap-4">
                {ideas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} countries={countries} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer ctaLabel={c.cta_label} text={c.footer_text} />
    </div>
  );
}
