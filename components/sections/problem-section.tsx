import { FrustratedFaceIcon } from "@/components/mood-icons/frustrated-face";

const SOURCES = [
  "Сайты университетов",
  "Программы обмена",
  "Страницы отдельных фестивалей",
  "Каналы со стажировками",
  "Десятки чатов и групп",
];

export function ProblemSection() {
  return (
    <section className="relative overflow-hidden bg-tint-coral">
      <FrustratedFaceIcon className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 select-none text-accent-ink/[0.06] sm:h-72 sm:w-72" />
      <div className="reveal-on-scroll relative mx-auto flex max-w-4xl flex-col gap-10 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
        <div className="flex flex-col gap-4 md:max-w-xl">
          <span className="w-fit rounded-full border border-accent/30 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Трудность
          </span>
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Пока ты искал — кто-то другой уже поехал
          </h2>
          <p className="text-pretty text-lg text-muted">
            Обмен — на сайте вуза. Фестиваль — в Telegram-канале.
            Стажировка — в чате, который ты давно не открывал. Пока
            собираешь всё по кусочкам, дедлайн уже прошёл.
          </p>
        </div>
        <ul className="flex flex-wrap gap-3 sm:gap-4">
          {SOURCES.map((source, i) => (
            <li
              key={source}
              className={`rounded-2xl border border-border bg-background px-5 py-3 text-sm font-medium text-foreground shadow-[0_10px_24px_-16px_rgba(26,26,46,0.35)] ${
                i % 2 === 0 ? "-rotate-1" : "rotate-1"
              } ${i % 3 === 1 ? "sm:mt-4" : ""}`}
            >
              {source}
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">
          И это только{" "}
          <strong className="font-bold text-accent">твоя</strong> страна!{" "}
          Про остальные пять ты, скорее всего, даже не подозреваешь.
        </p>
      </div>
    </section>
  );
}
