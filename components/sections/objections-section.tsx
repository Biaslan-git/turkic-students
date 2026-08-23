import { ChangedText } from "@/components/changed-text";

const OBJECTIONS = [
  {
    id: "why-now",
    question: "Платформы ведь ещё нет — зачем регистрироваться сейчас?",
    answer: (
      <>
        Чем раньше наберётся аудитория, тем быстрее платформа заработает — а ты узнаешь о запуске{" "}
        <ChangedText old="первым">одним из первых</ChangedText>.
      </>
    ),
  },
  {
    id: "will-it-close",
    question: "Не станет ли это очередным порталом, который закроется через полгода?",
    answer: (
      <>
        Платформа создаётся при поддержке ТЮРКСОЙ — сразу как система шести стран: Азербайджана,
        Казахстана, <ChangedText old="Киргизии">Кыргызстана</ChangedText>, Туркменистана, Турции и
        Узбекистана.
      </>
    ),
  },
  {
    id: "data",
    question: "Куда денутся мои данные?",
    answer: "Имя и email нужны только для регистрации и уведомления о запуске — больше ни для чего.",
  },
  {
    id: "why-need-it",
    question: (
      <>
        У меня и так получается находить{" "}
        <ChangedText old="гранты и фестивали">фестивали и стажировки</ChangedText> — зачем мне это?
      </>
    ),
    answer: (
      <>
        <ChangedText old="Дело не только в поиске. После фестиваля или стажировки знакомства обычно обрываются сами собой.">
          После фестиваля или стажировки знакомства обычно обрываются.
        </ChangedText>{" "}
        <ChangedText old="TURKIC">TÜRKSOY</ChangedText> STUDENTS — про то, что происходит после.
      </>
    ),
  },
];

export function ObjectionsSection() {
  return (
    <section className="bg-background">
      <div className="reveal-on-scroll mx-auto flex max-w-4xl flex-col gap-10 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
        <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Прежде чем оставить email
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {OBJECTIONS.map((item) => (
            <div
              key={item.id}
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
