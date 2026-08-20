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
          Гранты и фестивали тюркского мира. Без пропущенных дедлайнов
        </h1>
        <p className="max-w-xl text-pretty text-lg text-muted">
          Информация разбросана по десяткам сайтов и чатов — и кто-то
          успевает подать заявку раньше тебя. TURKIC STUDENTS собирает всё
          в одном месте. Оставь имя и email — узнаешь о запуске первым.
        </p>
        <a
          href="#waitlist"
          className="rounded-full bg-accent px-8 py-4 text-base font-semibold text-white shadow-[0_8px_24px_-8px_var(--accent)] transition-transform hover:scale-[1.02]"
        >
          Зарегистрироваться первым
        </a>

        <div className="relative mt-4 w-full max-w-3xl">
          <div
            aria-hidden="true"
            className="absolute -right-3 -top-3 h-full w-full rounded-3xl bg-accent-warm/25 sm:-right-5 sm:-top-5"
          />
          <div className="relative overflow-hidden rounded-3xl [clip-path:polygon(0_0,100%_0,100%_92%,92%_100%,0_100%)]">
            <Image
              src="https://images.unsplash.com/photo-1581155250123-32707511523f?auto=format&fit=crop&w=1600&q=80"
              alt="Большая энергичная толпа студентов на мероприятии"
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
