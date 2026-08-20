const OTHER_PARTICIPANTS = [
  "университеты",
  "фестивали и молодёжные проекты",
  "работодателей",
  "международные организации",
];

export function AudienceSection() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-6 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
      <h2 className="max-w-2xl text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Для студентов и молодых специалистов тюркского мира
      </h2>
      <p className="max-w-2xl text-pretty text-lg text-muted">
        Платформа создаётся в первую очередь для вас — где бы вы ни учились
        и в какой бы стране ни жили. Позже к ней подключатся и{" "}
        {OTHER_PARTICIPANTS.join(", ")} — но начинается всё со студентов.
      </p>
    </section>
  );
}
