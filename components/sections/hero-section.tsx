import Image from "next/image";
import { RouteLinesBackdrop } from "@/components/route-lines";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <RouteLinesBackdrop />
      <div className="relative flex flex-col items-center gap-7 px-5 py-16 text-center sm:px-8 sm:py-20 md:px-12 md:py-24">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white p-0.5">
            <Image
              src="/turksoy-emblem.png"
              alt=""
              aria-hidden="true"
              width={12}
              height={12}
              className="h-3 w-3"
            />
          </span>
          Под эгидой и при поддержке ТЮРКСОЙ
        </p>
        <h1 className="max-w-3xl text-balance font-display text-[2.5rem] font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
          Фестивали и связи тюркского мира —{" "}
          <span className="text-accent">в одном месте</span>
        </h1>
        <p className="max-w-xl text-pretty text-lg text-muted">
          Фестивали и события тюркского мира разбросаны по
          десяткам сайтов и чатов — а нужные связи теряются вместе с
          ними. TÜRKSOY STUDENTS собирает всё в одном месте. Оставь имя
          и email — узнаешь о запуске одним из первых.
        </p>
        <a
          href="#waitlist"
          className="rounded-full bg-gradient-to-r from-accent to-[#ff8a63] px-8 py-4 text-base font-semibold text-white shadow-[0_10px_28px_-8px_var(--accent)] transition-transform hover:scale-[1.02]"
        >
          Зарегистрироваться
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
