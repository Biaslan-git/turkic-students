import Image from "next/image";

const OTHER_PARTICIPANTS = [
  "университеты",
  "фестивали и молодёжные проекты",
  "работодателей",
  "международные организации",
];

export function AudienceSection() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col-reverse items-center gap-8 px-5 py-16 sm:px-8 sm:py-24 md:flex-row md:px-12">
      <div className="overflow-hidden rounded-3xl md:w-2/5">
        <Image
          src="https://images.unsplash.com/photo-1758613171176-ea64579c2dcf?auto=format&fit=crop&w=1000&q=80"
          alt="Четверо друзей улыбаются в парке"
          width={1000}
          height={1200}
          className="h-auto w-full object-cover"
          sizes="(min-width: 768px) 320px, 100vw"
        />
      </div>
      <div className="flex flex-col gap-6 md:w-3/5">
        <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Для студентов и молодых специалистов тюркского мира
        </h2>
        <p className="text-pretty text-lg text-muted">
          Платформа создаётся в первую очередь для вас — где бы вы ни
          учились и в какой бы стране ни жили. Позже к ней подключатся и{" "}
          {OTHER_PARTICIPANTS.join(", ")} — но начинается всё со
          студентов.
        </p>
      </div>
    </section>
  );
}
