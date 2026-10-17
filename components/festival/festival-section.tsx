import { getTranslations } from "next-intl/server";
import { listActiveUniversities } from "@/lib/universities";

type FestivalSectionProps = {
  badge: string;
  title: string;
  subtitle: string;
  text: string;
  alumniNote: string;
};

export async function FestivalSection({ badge, title, subtitle, text, alumniNote }: FestivalSectionProps) {
  const [universities, t] = await Promise.all([listActiveUniversities(), getTranslations("FestivalSection")]);

  return (
    <section id="tvoi-golos" className="relative scroll-mt-20 overflow-hidden bg-tint-teal">
      <div className="reveal-on-scroll relative mx-auto flex max-w-3xl flex-col items-start gap-5 px-5 pt-16 sm:px-8 sm:pt-24 md:px-12">
        <span className="w-fit rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          {badge}
        </span>
        <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <p className="font-display text-lg font-bold text-accent-warm">{subtitle}</p>
        <p className="text-pretty text-muted">{text}</p>
        <p className="text-pretty text-sm text-muted">{alumniNote}</p>
        <a
          href="#waitlist"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-accent-warm underline underline-offset-4"
        >
          {t("join")} <span aria-hidden="true">↓</span>
        </a>
      </div>
      <div className="relative mx-auto max-w-3xl px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-24 md:px-12">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          {t("participatingUniversities")}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {universities.map((university) => (
            <span
              key={university.id}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted"
            >
              {university.name}
            </span>
          ))}
        </div>
        <p className="mt-4 text-pretty text-sm text-muted">{t("moreUniversities")}</p>
      </div>
    </section>
  );
}
