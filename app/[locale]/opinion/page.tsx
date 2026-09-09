import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { OpinionForm } from "@/components/opinion-form";
import { Link } from "@/i18n/navigation";
import { getSiteContent } from "@/lib/content/site-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "OpinionPage" });
  return { title: `${t("title")} — TÜRKSOY STUDENTS` };
}

// Та же причина, что и у app/[locale]/page.tsx — контент читается из БД на каждый запрос.
export const dynamic = "force-dynamic";

export default async function OpinionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [c, t] = await Promise.all([
    getSiteContent(locale),
    getTranslations({ locale, namespace: "OpinionPage" }),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <Header ctaLabel={c.cta_label} />
      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden bg-tint-teal">
          <div className="reveal-on-scroll relative mx-auto flex max-w-xl flex-col gap-8 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="w-fit rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                {t("badge")}
              </span>
              <h1 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {t("title")}
              </h1>
              <p className="max-w-md text-pretty text-muted">
                {t.rich("description", {
                  link: (chunks) => (
                    <Link href="/#waitlist" className="text-accent-warm underline underline-offset-4">
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </div>

            <OpinionForm />
          </div>
        </section>
      </main>
      <Footer ctaLabel={c.cta_label} text={c.footer_text} />
    </div>
  );
}
