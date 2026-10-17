import Image from "next/image";
import { useTranslations } from "next-intl";
import { RouteLinesBackdrop } from "@/components/route-lines";

type HeroSectionProps = {
  ctaLabel: string;
  titleMain: string;
  titleAccent: string;
  subtitle: string;
  festivalTitle: string;
  festivalDates: string;
};

// Снимки награждения IV фестиваля (public/hero/NN.webp, 640x480): порядок задан заказчиком.
const CEREMONY_PHOTOS = [1, 2, 3, 4] as const;

export function HeroSection({
  ctaLabel,
  titleMain,
  titleAccent,
  subtitle,
  festivalTitle,
  festivalDates,
}: HeroSectionProps) {
  const t = useTranslations("Alt");
  const tHero = useTranslations("HeroSection");
  return (
    <section className="relative overflow-hidden">
      <RouteLinesBackdrop />
      <div className="relative flex flex-col items-center gap-7 px-5 py-16 text-center sm:px-8 sm:py-20 md:px-12 md:py-24">
        <figure className="flex w-full max-w-sm items-center gap-3 rounded-2xl border border-border bg-background/90 p-2.5 text-left shadow-sm xl:absolute xl:right-10 xl:top-10 xl:w-52 xl:max-w-none xl:flex-col xl:items-stretch xl:gap-2 xl:text-center">
          <Image
            src="/images/poster.webp"
            alt={t("festivalPoster")}
            width={480}
            height={686}
            className="h-auto w-20 flex-none rounded-lg xl:w-full"
          />
          <figcaption className="flex flex-col gap-1.5 text-xs text-muted xl:items-center">
            <Image
              src="/images/turkestan-logo.webp"
              alt={t("turkestanLogo")}
              width={36}
              height={36}
              className="h-9 w-9"
            />
            <span className="font-display text-sm font-bold leading-tight text-foreground">{tHero("posterCaption")}</span>
            <span>{tHero("posterDates")}</span>
          </figcaption>
        </figure>
        <div className="flex flex-col items-center gap-3">
          <p className="max-w-2xl text-balance font-display text-xl font-bold tracking-tight sm:text-2xl">{festivalTitle}</p>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-warm">{festivalDates}</p>
          <figure className="mt-2 flex flex-col items-center gap-2">
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CEREMONY_PHOTOS.map((n) => (
                <li key={n} className="relative aspect-[4/3] w-36 overflow-hidden rounded-xl bg-border sm:w-40 md:w-44">
                  <Image
                    src={`/hero/${String(n).padStart(2, "0")}.webp`}
                    alt={t(`ceremony${n}`)}
                    fill
                    sizes="176px"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
            <figcaption className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
              {tHero("ceremonyCaption")}
            </figcaption>
          </figure>
        </div>
        <h1 className="w-full max-w-3xl text-balance font-display text-[2.5rem] font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
          {titleMain.trim()}{" "}
          <span className="text-accent">{titleAccent.trim()}</span>
        </h1>
        <p className="max-w-xl text-pretty text-lg text-muted">{subtitle}</p>
        <a
          href="#waitlist"
          className="rounded-full bg-gradient-to-r from-accent to-[#ff8a63] px-8 py-4 text-base font-semibold text-white shadow-[0_10px_28px_-8px_var(--accent)] transition-transform hover:scale-[1.02]"
        >
          {ctaLabel}
        </a>

        <div className="relative mt-4 w-full max-w-3xl">
          <div
            aria-hidden="true"
            className="absolute -right-3 -top-3 h-full w-full rounded-3xl bg-accent-warm/25 sm:-right-5 sm:-top-5"
          />
          <div className="relative overflow-hidden rounded-3xl [clip-path:polygon(0_0,100%_0,100%_92%,92%_100%,0_100%)]">
            <Image
              src="/images/hero.jpg"
              alt={t("heroPhoto")}
              width={1600}
              height={900}
              priority
              className="h-auto w-full object-cover"
              sizes="(min-width: 768px) 768px, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
