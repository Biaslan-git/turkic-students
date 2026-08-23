import Image from "next/image";
import { RouteLinesBackdrop } from "@/components/route-lines";
import { ChangedText } from "@/components/changed-text";

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
          <ChangedText old="">Под эгидой и </ChangedText>при поддержке ТЮРКСОЙ
        </p>
        <h1 className="max-w-3xl text-balance font-display text-[2.5rem] font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
          Фестивали тюркского мира.{" "}
          <ChangedText old="Без пропущенных дедлайнов">
            Знакомства, которые не обрываются
          </ChangedText>
        </h1>
        <p className="max-w-xl text-pretty text-lg text-muted">
          <ChangedText old="Информация разбросана по десяткам сайтов и чатов — и кто-то успевает подать заявку раньше тебя.">
            Фестивали, стажировки и события тюркского мира разбросаны по
            десяткам сайтов и чатов — а нужные знакомства теряются вместе с
            ними.
          </ChangedText>{" "}
          <ChangedText old="TURKIC">TÜRKSOY</ChangedText> STUDENTS собирает всё в одном месте. Оставь имя
          и email — узнаешь о запуске{" "}
          <ChangedText old="первым">одним из первых</ChangedText>.
        </p>
        {/* было: "Зарегистрироваться первым" */}
        <a
          href="#waitlist"
          className="rounded-full bg-accent px-8 py-4 text-base font-semibold text-white shadow-[0_8px_24px_-8px_var(--accent)] transition-transform hover:scale-[1.02]"
        >
          Зарегистрироваться сейчас
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
