import Image from "next/image";
import { RouteLinesBackdrop } from "@/components/route-lines";

type HeroSectionProps = {
  ctaLabel: string;
  badge: string;
  titleMain: string;
  titleAccent: string;
  subtitle: string;
};

export function HeroSection({ ctaLabel, badge, titleMain, titleAccent, subtitle }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <RouteLinesBackdrop />
      <div className="relative flex flex-col items-center gap-7 px-5 py-16 text-center sm:px-8 sm:py-20 md:px-12 md:py-24">
        <Image
          src="/turksoy-logo.svg"
          alt="Эмблема ТЮРКСОЙ"
          width={128}
          height={128}
          className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28"
        />
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          {badge}
        </p>
        <h1 className="max-w-3xl text-balance font-display text-[2.5rem] font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
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
              src="https://tatar-congress.org/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-03-at-15.30.49-1-e1699015757899.jpeg"
              alt="Большая группа людей в национальных костюмах тюркских народов с флагами на фестивале"
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
