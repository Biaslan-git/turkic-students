import Image from "next/image";

const CYCLE_STEPS = [
  { title: "Фестиваль", description: "Знакомство на реальном мероприятии" },
  { title: "Контакт", description: "Обмен контактами в общей среде" },
  { title: "Сообщество", description: "Общение продолжается после разъезда" },
  { title: "Сотрудничество", description: "Совместные идеи находят соавторов" },
  { title: "Новые проекты", description: "Идея превращается в инициативу" },
  { title: "Новый фестиваль", description: "Проект возвращается на сцену" },
];

export function CycleSection() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-10 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Платформа работает 365 дней в году — не только во время
            фестиваля
          </h2>
          <p className="text-pretty text-lg text-muted">
            Фестиваль заканчивается — а знакомства и проекты продолжаются.
            Каждое мероприятие становится точкой входа в постоянное
            движение, а не отдельным событием.
          </p>
        </div>
        <div className="overflow-hidden rounded-3xl">
          <Image
            src="https://images.unsplash.com/photo-1501238295340-c810d3c156d2?auto=format&fit=crop&w=1200&q=80"
            alt="Толпа участников фестиваля с поднятыми руками"
            width={1200}
            height={900}
            className="h-auto w-full object-cover"
            sizes="(min-width: 768px) 384px, 100vw"
          />
        </div>
      </div>

      <ol className="relative flex flex-col gap-8 pl-8 sm:pl-10">
        <div
          aria-hidden="true"
          className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-accent via-accent-warm to-accent sm:left-[9px]"
        />
        {CYCLE_STEPS.map((step, index) => (
          <li key={step.title} className="relative flex flex-col gap-0.5">
            <span
              aria-hidden="true"
              className="absolute -left-8 top-1 h-3.5 w-3.5 -translate-x-px rounded-full border-2 border-background bg-accent sm:-left-10"
            />
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {index + 1 < 10 ? `0${index + 1}` : index + 1}
            </span>
            <h3 className="font-display text-xl font-bold">{step.title}</h3>
            <p className="text-sm text-muted">{step.description}</p>
          </li>
        ))}
      </ol>

      <p className="rounded-xl border border-dashed border-border bg-surface px-4 py-3 text-sm text-muted">
        → и цикл начинается заново, с новым фестивалем и новыми людьми
      </p>
    </section>
  );
}
