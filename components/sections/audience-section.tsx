import Image from "next/image";
import { SmilingFaceIcon } from "@/components/mood-icons/smiling-face";
import { ChangedText } from "@/components/changed-text";

const SEGMENTS = [
  <span key="obryv">
    Уже был на фестивалях или обменах — и не хочешь, чтобы{" "}
    <ChangedText old="знакомства">связи</ChangedText> обрывались.
  </span>,
  <span key="vstrechi">
    Хочешь превращать случайные{" "}
    <ChangedText old="знакомства">встречи</ChangedText> в постоянные связи.
  </span>,
  "Организуешь события или ведёшь проект — и ищешь партнёров в других странах.",
];

export function AudienceSection() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <SmilingFaceIcon className="pointer-events-none absolute -right-10 -top-14 h-56 w-56 select-none text-accent-ink/[0.06] sm:h-72 sm:w-72" />
      <div className="reveal-on-scroll relative mx-auto flex max-w-4xl flex-col items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 md:flex-row md:gap-12 md:px-12">
        <div className="relative w-full md:w-2/5 md:-ml-6">
          <div
            aria-hidden="true"
            className="absolute -bottom-5 -right-5 h-full w-full rounded-[3rem] bg-accent-warm/20"
          />
          <div className="relative aspect-[3/4] overflow-hidden rounded-[3rem_1rem_3rem_1rem] shadow-[0_20px_48px_-24px_rgba(26,26,46,0.35)]">
            <Image
              src="https://static.tildacdn.com/tild3331-3562-4436-a235-643137326361/494105372_1068739198.jpg"
              alt="Дети в национальных костюмах исполняют народный танец на фестивале"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 320px, 100vw"
            />
          </div>
          <span aria-hidden="true" className="absolute -bottom-3 -left-3 flex -space-x-2">
            <span className="h-5 w-5 rounded-full border-2 border-surface bg-accent" />
            <span className="h-5 w-5 rounded-full border-2 border-surface bg-accent-warm" />
            <span className="h-5 w-5 rounded-full border-2 border-surface bg-accent-ink" />
          </span>
        </div>
        <div className="flex flex-col gap-6 md:w-3/5">
          <span className="w-fit rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Для кого
          </span>
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ты на фестивале — значит, это для тебя
          </h2>
          <p className="text-pretty text-muted">Например, если ты:</p>
          <ul className="flex flex-col gap-3">
            {SEGMENTS.map((segment, i) => (
              <li key={i} className="flex gap-3 text-pretty text-base text-muted">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {segment}
              </li>
            ))}
          </ul>
          <p className="text-pretty text-sm text-muted">
            Позже подключатся вузы и организации. Но начинается всё с тебя.
          </p>
        </div>
      </div>
    </section>
  );
}
