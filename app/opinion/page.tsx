import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { OpinionForm } from "@/components/opinion-form";
import { getSiteContent } from "@/lib/content/site-content";

export const metadata: Metadata = {
  title: "Мнение о фестивале — TÜRKSOY STUDENTS",
};

// Та же причина, что и у app/page.tsx — контент читается из БД на каждый запрос.
export const dynamic = "force-dynamic";

export default async function OpinionPage() {
  const c = await getSiteContent();

  return (
    <div className="flex flex-1 flex-col">
      <Header ctaLabel={c.cta_label} />
      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden bg-tint-teal">
          <div className="reveal-on-scroll relative mx-auto flex max-w-xl flex-col gap-8 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="w-fit rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Твой голос — твой фестиваль
              </span>
              <h1 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Поделись мнением о фестивале
              </h1>
              <p className="max-w-md text-pretty text-muted">
                Регистрироваться не обязательно — просто напиши, что думаешь. Хочешь ещё и
                попасть в аудиторию своего университета? Загляни в основную{" "}
                <Link href="/#waitlist" className="text-accent-warm underline underline-offset-4">
                  регистрацию
                </Link>
                .
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
