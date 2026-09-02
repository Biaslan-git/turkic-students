import Image from "next/image";
import { FireIcon } from "@/components/mood-icons/fire-icon";

type CycleStep = { title: string; text: string };

type CycleSectionProps = {
  badge: string;
  title: string;
  text: string;
  steps: CycleStep[];
};

export function CycleSection({ badge, title, text, steps }: CycleSectionProps) {
  return (
    <section className="relative overflow-hidden bg-tint-teal">
      <FireIcon className="pointer-events-none absolute -right-12 -bottom-16 h-56 w-56 select-none text-accent/[0.08] sm:h-72 sm:w-72" />
      <div className="reveal-on-scroll relative mx-auto flex max-w-5xl flex-col gap-14 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-10">
          <div className="relative md:order-1 md:col-span-7">
            <div className="relative aspect-video overflow-hidden rounded-3xl [clip-path:polygon(0_0,92%_0,100%_15%,100%_100%,0_100%)] sm:aspect-[16/10]">
              <Image
                src="https://roza.kg/media/images/press/%D1%82%D1%8E%D1%80%D0%BA%D1%81%D0%BE%D0%B9.jpg"
                alt="Группа участников в национальных костюмах перед зданием ТЮРКСОЙ"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 480px, 100vw"
              />
              <svg
                aria-hidden="true"
                viewBox="0 0 200 140"
                className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 opacity-70"
              >
                <path
                  d="M10 120 Q60 60 100 80 T190 20"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="190" cy="20" r="5" fill="var(--accent)" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:order-2 md:col-span-5">
            <span className="w-fit rounded-full border border-accent/30 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              {badge}
            </span>
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="text-pretty text-lg text-muted">{text}</p>
          </div>
        </div>

        <ol className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-6">
          {steps.map((step, index) => (
            <li key={index} className="relative flex min-w-0 flex-col gap-1">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-accent font-display text-sm font-bold text-white shadow-[0_6px_16px_-6px_var(--accent)]">
                {index + 1}
              </span>
              <h3 className="mt-2 break-words font-display text-base font-bold">{step.title}</h3>
              <p className="text-xs text-muted">{step.text}</p>
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute right-[-14px] top-4 hidden h-px w-6 bg-gradient-to-r from-accent to-accent-warm sm:block"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
