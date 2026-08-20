const BENEFITS = [
  {
    title: "Единый каталог",
    description:
      "Гранты, обмены, фестивали и стажировки — в одном месте, со ссылками на источник.",
  },
  {
    title: "Профиль под вас",
    description:
      "Указываете страну, вуз и интересы — платформа показывает то, что подходит именно вам.",
  },
  {
    title: "Люди, а не только объявления",
    description:
      "Находите единомышленников и команды для совместных проектов после знакомства на мероприятии.",
  },
];

export function SolutionSection() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-10 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
      <div className="flex flex-col gap-4">
        <h2 className="max-w-2xl text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
          TURKIC STUDENTS не заменяет эти сайты — она их связывает
        </h2>
        <p className="max-w-2xl text-pretty text-lg text-muted">
          Информация остаётся у своих источников. Мы делаем её видимой и
          собранной в одном месте специально для студентов.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {BENEFITS.map((benefit) => (
          <div key={benefit.title} className="flex flex-col gap-2">
            <div className="h-1 w-8 rounded-full bg-accent-warm" />
            <h3 className="font-display text-lg font-bold">{benefit.title}</h3>
            <p className="text-sm text-muted">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
