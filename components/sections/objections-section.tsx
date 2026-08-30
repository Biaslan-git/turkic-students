type Objection = { question: string; answer: string };

type ObjectionsSectionProps = {
  title: string;
  items: Objection[];
};

export function ObjectionsSection({ title, items }: ObjectionsSectionProps) {
  return (
    <section className="bg-background">
      <div className="reveal-on-scroll mx-auto flex max-w-4xl flex-col gap-10 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
        <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-5"
            >
              <h3 className="font-display text-base font-bold">{item.question}</h3>
              <p className="text-sm text-muted">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
