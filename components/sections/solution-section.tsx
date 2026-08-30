import Image from "next/image";
import { RelievedFaceIcon } from "@/components/mood-icons/relieved-face";

type Benefit = { title: string; text: string };

type SolutionSectionProps = {
  badge: string;
  title: string;
  text: string;
  benefits: Benefit[];
};

export function SolutionSection({ badge, title, text, benefits }: SolutionSectionProps) {
  return (
    <section className="relative overflow-hidden bg-background">
      <RelievedFaceIcon className="pointer-events-none absolute -left-12 -bottom-16 h-56 w-56 select-none text-accent-warm/[0.08] sm:h-72 sm:w-72" />
      <div className="reveal-on-scroll relative mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24 md:px-12">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-8">
          <div className="flex flex-col gap-4 md:col-span-7">
            <span className="w-fit rounded-full border border-accent-warm/30 bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent-warm">
              {badge}
            </span>
            <h2 className="max-w-xl text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="max-w-xl text-pretty text-lg text-muted">{text}</p>
          </div>
          <div className="relative md:col-span-5">
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -left-4 h-full w-full rounded-3xl bg-accent/20 sm:-bottom-6 sm:-left-6"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl [clip-path:polygon(8%_0,100%_0,100%_100%,0_100%,0_18%)]">
              <Image
                src="https://im2.kommersant.ru/Issues.photo/REGIONS/KAZAN_Online/2025/03/24/KKZ_004142_00046_1_t218_144341.jpg"
                alt="Двое участников фестиваля в национальных костюмах тюркских народов"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 360px, 100vw"
              />
            </div>
          </div>
        </div>
        <div className="relative mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-border sm:block"
          />
          {benefits.map((benefit, i) => (
            <div
              key={i}
              className="relative flex flex-col gap-2 rounded-2xl border border-border bg-surface p-5"
            >
              <div className="h-1 w-8 rounded-full bg-accent-warm" />
              <h3 className="font-display text-lg font-bold">{benefit.title}</h3>
              <p className="text-sm text-muted">{benefit.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
