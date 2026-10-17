import { moderateIdea } from "@/app/admin/actions";
import { OPINION_CATEGORIES } from "@/lib/constants";
import { countryFlag } from "@/lib/country";
import { listAllIdeas } from "@/lib/ideas";

const categoryLabels = new Map<string, string>(OPINION_CATEGORIES.map((c) => [c.value, c.label]));

const STATUS_LABEL = { pending: "⏳ ждёт решения", published: "✅ опубликовано", hidden: "🙈 скрыто" } as const;

function ModerationButtons({ kind, id, status }: { kind: "idea" | "comment"; id: string; status: keyof typeof STATUS_LABEL }) {
  const act = (action: string, label: string, className = "underline underline-offset-2") => (
    <form action={moderateIdea}>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="action" value={action} />
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );

  return (
    <div className="flex gap-3 text-xs">
      {status !== "published" && act("publish", "Опубликовать", "font-semibold underline underline-offset-2")}
      {status !== "hidden" && act("hide", "Скрыть")}
      {act("delete", "Удалить", "text-red-600 underline underline-offset-2")}
    </div>
  );
}

export default async function AdminIdeasPage() {
  const ideas = await listAllIdeas();
  const pendingCount = ideas.reduce((n, i) => n + (i.status === "pending" ? 1 : 0) + i.comments.filter((c) => c.status === "pending").length, 0);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Стена идей</h1>
          <p className="text-sm text-muted">
            Новые идеи и ответы сначала ждут решения (их же присылает Telegram-бот): без публикации их видит только автор. Всего идей: {ideas.length}, ждут решения: {pendingCount}.
          </p>
        </div>
      </div>

      {ideas.length === 0 && <p className="text-muted">Пока нет ни одной идеи.</p>}

      {ideas.map((idea) => (
        <article
          key={idea.id}
          className={`flex flex-col gap-3 rounded-2xl border border-border p-4 ${idea.status === "hidden" ? "opacity-50" : ""}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
            <span>
              {categoryLabels.get(idea.category) ?? idea.category} · {new Date(idea.createdAt).toLocaleString("ru-RU")}
              {" · "}{STATUS_LABEL[idea.status]}
            </span>
            <ModerationButtons kind="idea" id={idea.id} status={idea.status} />
          </div>
          <p className="whitespace-pre-line text-sm">{idea.text}</p>
          <p className="text-xs text-muted">
            {idea.authorName || "Аноним"} · {countryFlag(idea.country)} {idea.country}
            {idea.universityName ? ` · ${idea.universityName}` : ""}
          </p>

          {idea.comments.length > 0 && (
            <ul className="flex flex-col gap-3 border-l-2 border-border pl-4">
              {idea.comments.map((c) => (
                <li key={c.id} className={`flex flex-col gap-1 ${c.status === "hidden" ? "opacity-50" : ""}`}>
                  <p className="whitespace-pre-line text-sm">{c.text}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                    <span>
                      {c.authorName || "Аноним"} · {countryFlag(c.country)} {c.country} ·{" "}
                      {new Date(c.createdAt).toLocaleString("ru-RU")}
                      {" · "}{STATUS_LABEL[c.status]}
                    </span>
                    <ModerationButtons kind="comment" id={c.id} status={c.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>
      ))}
    </div>
  );
}
