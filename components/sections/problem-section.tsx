const SOURCES = [
  "Сайты университетов",
  "Госресурсы с грантами",
  "Страницы отдельных фестивалей",
  "Каналы со стажировками",
  "Десятки чатов и групп",
];

export function ProblemSection() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-8 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
      <h2 className="max-w-2xl text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Возможности есть. Но найти их — отдельная работа
      </h2>
      <p className="max-w-2xl text-pretty text-lg text-muted">
        Грант — на одном сайте, фестиваль — на другом, стажировка — в
        третьем чате. Пока студент собирает информацию по кусочкам,
        дедлайны проходят.
      </p>
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {SOURCES.map((source) => (
          <li
            key={source}
            className="rounded-xl border border-dashed border-border bg-surface px-4 py-3 text-sm text-muted"
          >
            {source}
          </li>
        ))}
      </ul>
    </section>
  );
}
