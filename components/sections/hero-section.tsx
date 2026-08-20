import { RouteLinesBackdrop } from "@/components/route-lines";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <RouteLinesBackdrop />
      <div className="relative flex flex-col items-center gap-7 px-5 py-20 text-center sm:px-8 sm:py-28 md:px-12 md:py-36">
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
          className="rounded-full bg-accent px-8 py-4 text-base font-semibold text-accent-ink shadow-[0_8px_24px_-8px_var(--accent)] transition-transform hover:scale-[1.02]"
        >
          Зарегистрироваться первым
        </a>
      </div>
    </section>
  );
}
