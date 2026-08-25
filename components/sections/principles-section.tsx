import Image from "next/image";
import { RouteLinesBackdrop } from "@/components/route-lines";
import { HandshakeIcon } from "@/components/mood-icons/handshake-icon";
import { ChangedText } from "@/components/changed-text";

const COUNTRIES = [
  "Азербайджан",
  "Казахстан",
  "Кыргызстан",
  "Туркменистан",
  "Турция",
  "Узбекистан",
];

const PRINCIPLES = [
  {
    title: "Открытость",
    description: "Доступна молодёжи всех стран тюркского мира — независимо от вуза и специальности.",
  },
  {
    title: "Равноправие",
    description: "Ни одна страна не является центральной.",
  },
  {
    title: "Практическая польза",
    description: "Не общие слова про сотрудничество, а конкретные программы и контакты.",
  },
  {
    title: "Достоверность",
    description: "Только проверенная информация — со ссылкой на источник.",
  },
  {
    title: "Нейтральность",
    description: "Пространство сотрудничества, а не политической конкуренции.",
  },
  {
    title: "Международность",
    description: "Общее пространство шести стран с первого дня, а не проект одной страны.",
  },
];

export function PrinciplesSection() {
  return (
    <section className="relative overflow-hidden bg-accent-ink text-[#f7f1e6]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.18]">
        <RouteLinesBackdrop />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10 sm:h-96 sm:w-96"
      />
      <HandshakeIcon className="pointer-events-none absolute -left-12 -bottom-16 h-56 w-56 select-none text-accent-warm/[0.14] sm:h-72 sm:w-72" />
      <div className="reveal-on-scroll relative mx-auto flex max-w-4xl flex-col gap-10 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
        <div className="flex flex-col gap-4">
          <span className="w-fit rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent-warm">
            Принципы
          </span>
          <h2 className="max-w-2xl text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            <ChangedText old="Принципы, на которых строится платформа">
              Шесть стран, один тюркский мир
            </ChangedText>
          </h2>
          <p className="max-w-2xl text-pretty text-lg text-white/70">
            При поддержке Международной организации тюркской культуры (ТЮРКСОЙ) — общими усилиями
            шести стран, а не одной.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Image
              src="/turksoy-emblem.png"
              alt=""
              aria-hidden="true"
              width={14}
              height={14}
              className="mr-0.5 h-3.5 w-3.5"
            />
            {COUNTRIES.map((country) => (
              <span
                key={country}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
              >
                {country}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {PRINCIPLES.map((principle, i) => (
            <div
              key={principle.title}
              className={`flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-white/5 p-5 ${
                i % 2 === 1 ? "sm:translate-y-4" : ""
              }`}
            >
              <div className={`h-1 w-8 rounded-full ${i % 2 === 0 ? "bg-accent-warm" : "bg-accent"}`} />
              <h3 className="font-display text-lg font-bold">{principle.title}</h3>
              <p className="text-sm text-white/70">{principle.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
