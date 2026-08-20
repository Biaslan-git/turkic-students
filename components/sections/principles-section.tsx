const PRINCIPLES = [
  {
    title: "Открытость",
    description: "Доступна молодёжи всех стран тюркского мира.",
  },
  {
    title: "Равноправие",
    description: "Ни одна страна не является центральной.",
  },
  {
    title: "Нейтральность",
    description: "Пространство сотрудничества, а не политики.",
  },
  {
    title: "Международность",
    description: "Строится как многострановая система с первого дня.",
  },
];

export function PrinciplesSection() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-8 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
      <div className="flex flex-col gap-4">
        <h2 className="max-w-2xl text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
          При поддержке ТЮРКСОЙ
        </h2>
        <p className="max-w-2xl text-pretty text-lg text-muted">
          Международная организация тюркской культуры поддерживает проект
          — платформа строится на нескольких принципах.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        {PRINCIPLES.map((principle) => (
          <div
            key={principle.title}
            className="flex flex-col gap-1 border-l-2 border-accent-warm pl-4"
          >
            <h3 className="font-display text-lg font-bold">{principle.title}</h3>
            <p className="text-sm text-muted">{principle.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
