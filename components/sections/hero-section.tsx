import Image from "next/image";
import { RouteLinesBackdrop } from "@/components/route-lines";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <RouteLinesBackdrop />
      <div className="relative flex flex-col items-center gap-7 px-5 py-16 text-center sm:px-8 sm:py-20 md:px-12 md:py-24">
        <p className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          При поддержке ТЮРКСОЙ
        </p>
        <h1 className="max-w-3xl text-balance font-display text-[2.5rem] font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
          Гранты, фестивали и стажировки тюркского мира — в одном месте
        </h1>
        <p className="max-w-xl text-pretty text-lg text-muted">
          Вместо десятков разрозненных сайтов университетов, фестивалей и
          грантовых программ — единая платформа для студентов. Оставьте
          email и узнайте первыми о запуске.
        </p>
        <a
          href="#waitlist"
          className="rounded-full bg-accent px-8 py-4 text-base font-semibold text-white shadow-[0_8px_24px_-8px_var(--accent)] transition-transform hover:scale-[1.02]"
        >
          Зарегистрироваться первым
        </a>

        <div className="relative mt-4 w-full max-w-3xl overflow-hidden rounded-3xl">
          <Image
            src="https://images.unsplash.com/photo-1622352496174-9e1d969b1945?auto=format&fit=crop&w=1600&q=80"
            alt="Молодые студенты смеются вместе на закате"
            width={1600}
            height={900}
            priority
            className="h-auto w-full object-cover"
            sizes="(min-width: 768px) 768px, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
